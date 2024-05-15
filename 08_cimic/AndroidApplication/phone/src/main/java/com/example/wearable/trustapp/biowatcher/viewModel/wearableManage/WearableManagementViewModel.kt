package com.example.wearable.trustapp.biowatcher.viewModel.wearableManage

import android.app.Application
import android.util.Log
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.SavedStateHandle
import com.example.wearable.trustapp.biowatcher.common.Constants
import com.example.wearable.trustapp.biowatcher.common.Constants.FALSE_STRING
import com.example.wearable.trustapp.biowatcher.common.Constants.TRUE_STRING
import com.example.wearable.trustapp.biowatcher.common.RequestDataList
import com.example.wearable.trustapp.biowatcher.common.Util
import com.example.wearable.trustapp.biowatcher.common.WebRequestCommon
import com.example.wearable.trustapp.biowatcher.common.WebResponseData
import com.example.wearable.trustapp.biowatcher.domain.repository.DeviceRepository
import com.example.wearable.trustapp.biowatcher.infrastructure.network.AppDatabase
import com.example.wearable.trustapp.biowatcher.infrastructure.repository.DeviceRepositoryImpl
import com.example.wearable.trustapp.biowatcher.service.WebRequestService
import com.example.wearable.trustapp.mobile.BaseApplication
import kotlinx.coroutines.CompletableDeferred
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.launch
import java.time.LocalDate

class WearableManagementViewModel(
    application: Application,
    savedStateHandle: SavedStateHandle,
) : MainViewModel(application) {
    // 試験・病院ID
    val studySubjectId: String = checkNotNull(savedStateHandle[Constants.STUDY_SUBJECT_ID])
    val studyHospitalId: String = checkNotNull(savedStateHandle[Constants.STUDY_HOSPITAL_ID])
    val studyHospitalName: String = checkNotNull(savedStateHandle[Constants.STUDY_HOSPITAL_NAME])

    // ローディングフラグ(試験-病院リスト取得中)
    private val _isLoading: MutableLiveData<Boolean> = MutableLiveData(false)
    val isLoading: LiveData<Boolean> = _isLoading

    // コルーチン
    private val job = SupervisorJob()
    private val scope = CoroutineScope(Dispatchers.IO + job)

    // DB
    private var deviceRepository: DeviceRepository? = null

    // フラグ
    // 「更新しますか？」ダイアログ
    private val _alertDialogFlg: MutableLiveData<Boolean> = MutableLiveData(false)
    val alertDialogFlg: LiveData<Boolean> = _alertDialogFlg

    private val _isNoDataFig: MutableLiveData<Boolean> = MutableLiveData(false)
    val isNoDataFig: LiveData<Boolean> = _isNoDataFig

    // 更新ステータス(完了時のトースト表示用)
    private val _updateStatus: MutableLiveData<UpdateStatus> = MutableLiveData(UpdateStatus.NONE)
    val updateStatus: LiveData<UpdateStatus> = _updateStatus

    // 表示用端末リスト
    private val _deviceDataList: MutableLiveData<List<DeviceData>> = MutableLiveData(listOf())
    val deviceDataList: LiveData<List<DeviceData>> = _deviceDataList

    // 更新中フラグ
    private val _isUpdating: MutableLiveData<Boolean> = MutableLiveData(true)
    val isUpdating: LiveData<Boolean> = _isUpdating


    init {
        Log.d(TAG, "init")

        // リポジトリ取得(シングルトン)
        deviceRepository = DeviceRepositoryImpl(
            AppDatabase.getInstance(application.applicationContext).deviceDao()
        )
        scope.launch {
            // 初回デバイス(td_idがnull)をTDに保存する(初回のみ)
            initialSaveDevice()

            // 端末情報取得
            setDeviceList()
        }
    }

    private suspend fun initialSaveDevice() {
        Log.d(TAG, "initialSaveDevice Start")
        // ローディングフラグをtrueにする
        _isLoading.postValue(true)

        // 端末情報取得(roomから取得:TDIDがnullのもの)
        val deviceList = deviceRepository?.getValidAll()
//        val deviceList = deviceRepository?.findDevicesByNullId()
        val count = deviceList?.count() ?: 0
        if (count > 0) {
            try {
                var subjectDeviceIdList = getSubjectDeviceStudyList()?.map { it.subjectDeviceId } ?: listOf()
                deviceList?.forEach { device ->
                    // SubjectDeviceStudyテーブルに保存されていない、またはTdIdがNullの場合、TDに保存する
                    if(device.deviceTdId !in subjectDeviceIdList || device.deviceTdId == null) {
                        val result = saveDeviceToTD(
                            deviceId = device?.id.toString(),
                            deviceTypeId = device?.deviceTypeId.toString(),
                            deviceUri = device?.deviceUri.toString(),
                            deviceTdId = device?.deviceTdId?.toString() ?: "",
                            isValid = FALSE_STRING
                        ) // TDに新規デバイスを保存し、TD_IDを取得する
                        if (result != null) {
                            if (result.id > 0) {
                                // TD_IDを更新する
                                deviceRepository?.update(
                                    device.copy(
                                        deviceTdId = result.id,
                                        updatedAt = Util.toYYYYMMDDString(LocalDate.now())
                                    )
                                )
                            }
                        } else {
                            Log.d(TAG, "initialSaveDevice : ${device.deviceUri} is failed")
                        }
                    }
                }
            } catch (e: Exception) {
                Log.e(TAG, "initialSaveDevice : $e")
            }
        }
        Log.i(TAG, "initialSaveDevice End")
    }

    private suspend fun saveDeviceToTD(
        deviceId: String,
        deviceTypeId: String,
        deviceUri: String,
        deviceTdId: String,
        isValid: String = FALSE_STRING
    ): WebResponseData.SaveDevice? {
        Log.d(TAG, "saveDevice Start")
        var deferred = CompletableDeferred<WebResponseData.SaveDevice?>() // 結果を保持するためのDeferredを作成
        try {
            var deviceResponse: WebResponseData.SaveDevice? = null
            val subjectDeviceId = if (deviceTdId.isNullOrEmpty()) {
                ""  // 初回は空文字列
            } else {
                deviceTdId
            }
            var bodyData = mapOf(
                "study_subject_id" to studySubjectId,
                "sequence_id" to deviceId,
                "device_master_id" to deviceTypeId,
                "device_uri" to deviceUri,
                "is_valid" to isValid,
                "subject_device_id" to subjectDeviceId
            )
            val request = RequestDataList().getRequestData(
                RequestDataList.RequestDataKind.SaveDevice,
                arrayOf(),
                bodyData
            )
            Log.d(TAG, "request : $request")
            Log.d(TAG, "study_subject_id : $studySubjectId")
            Log.d(TAG, "sequence_id : $deviceId")
            Log.d(TAG, "device_master_id : $deviceTypeId")
            Log.d(TAG, "device_uri : $deviceUri")
            Log.d(TAG, "is_valid : $isValid")
            Log.d(TAG, "subject_device_id : $subjectDeviceId")
            WebRequestService(getApplication<BaseApplication>().applicationContext).requestSaveData(
                webRequestData = request
            ) { jsonString ->
                try {
                    Log.d(TAG, "callback: $jsonString")
                    if (!Util.isValidResponseJsonString(jsonString)) {
                        Log.w(TAG, "Initial Device save process failed")
                    } else {
                        deviceResponse = Util.jsonDecode(jsonString)
                    }
                } catch (e: Exception) {
                    Log.e(TAG, "saveDevice WebRequestService : $e")
                } finally {
                    deferred.complete(deviceResponse)
                }
            }
        } catch (e: Exception) {
            deferred.complete(null)
            Log.e(TAG, "saveDevice : $e")
        }
        deferred.await() // 結果が返るまで待機
        Log.i(TAG, "saveDevice End")
        return deferred.getCompleted()
    }

    private suspend fun getSubjectDeviceStudyList():List<WebResponseData.SubjectDevice>? {
        var deferred = CompletableDeferred<List<WebResponseData.SubjectDevice>?>() // 結果を保持するためのDeferredを作成

        // デバイスエンティティ取得
        val deviceEntities = deviceRepository?.getValidAll()
        if (deviceEntities?.count() ?: 0 > 0) {
            // 端末情報取得(webから取得)
            val request = RequestDataList().getRequestData(
                RequestDataList.RequestDataKind.SubjectDeviceStudy,
                arrayOf(studySubjectId),
                mapOf()
            )
            val context = getApplication<BaseApplication>().applicationContext
            WebRequestService(context).requestSaveData(
                webRequestData = request
            ) { jsonString ->
                var deviceListResponse: List<WebResponseData.SubjectDevice>? = null
                try {
                    Log.d(TAG, "callback: $jsonString")
                    if (!Util.isValidResponseJsonString(jsonString)) {
                        Log.w(TAG, "DeviceStudyList is not found")
                        _isLoading.postValue(false)
                        return@requestSaveData
                    }
                    deviceListResponse = Util.jsonDecode(jsonString)
                } catch (e: Exception) {
                    Log.e(TAG, "getDeviceList : $e")
                } finally {
                    deferred.complete(deviceListResponse)
                }
            }
        } else {
            deferred.complete(null)
        }
        deferred.await() // 結果が返るまで待機
        return deferred.getCompleted()
    }
    private suspend fun setDeviceList() {
        // TDからデバイスマスタ取得
        val deviceMaster =
            WebRequestCommon(getApplication<BaseApplication>().applicationContext)
                .getDeviceMater()

        // デバイスエンティティ取得
        val deviceEntities = deviceRepository?.getValidAll()
        if (deviceEntities?.count() ?: 0 > 0) {
            // 端末情報取得(webから取得)
            val request = RequestDataList().getRequestData(
                RequestDataList.RequestDataKind.SubjectDeviceStudy,
                arrayOf(studySubjectId),
                mapOf()
            )
            val context = getApplication<BaseApplication>().applicationContext
            WebRequestService(context).requestSaveData(
                webRequestData = request
            ) { jsonString ->
                try {
                    Log.d(TAG, "callback: $jsonString")
                    if (!Util.isValidResponseJsonString(jsonString)) {
                        Log.w(TAG, "DeviceStudyList is not found")
                        _isLoading.postValue(false)
                        return@requestSaveData
                    }

                    val deviceListResponse: List<WebResponseData.SubjectDevice> =
                        Util.jsonDecode(jsonString)
                    if (deviceListResponse.isNotEmpty()) {
                        val tmp: MutableList<DeviceData> = mutableListOf()
                        var loopCount = 0
                        deviceMaster.devices.forEach { deviceM ->
                            // デバイスエンティティからデバイスIDが一致するものを取得
                            val deviceFilter = deviceEntities?.filter { deviceRoom ->
                                deviceRoom.isValid && deviceRoom.deviceTypeId == deviceM.id
                            }?.sortedBy { it.id }
                            deviceFilter?.forEach { deviceRoom ->
                                // deviceListResponseからdeviceTdIdが一致するものを取得
                                deviceListResponse.find { deviceResponse ->
                                    deviceResponse.subjectDeviceId == deviceRoom.deviceTdId
                                }?.let { deviceResponse ->
                                    Log.d(TAG, "deviceResponse : $deviceResponse")
                                    Log.d(TAG, "deviceRoom : $deviceRoom")
                                    loopCount++
                                    // デバイス名セット
                                    var deviceDisplayName =
                                        ("(No${loopCount}):" + deviceMaster.devices.find { device ->
                                            device.id == deviceRoom.deviceTypeId
                                        }?.deviceName) ?: ""
                                    // _deviceDataListにセットするデータをtmpに追加
                                    tmp?.add(
                                        DeviceData(
                                            studySubjectId = deviceResponse.studySubjectId,
                                            sequenceId = deviceRoom.id,
                                            deviceTdId = deviceResponse.subjectDeviceId,
                                            deviceTypeId = deviceRoom.deviceTypeId,
                                            deviceUri = deviceRoom.deviceUri,
                                            isValid = deviceResponse.isValid,
                                            deviceDisplayName = deviceDisplayName
                                        )
                                    )
                                }
                            }
                        }
                        _deviceDataList.postValue(tmp)
                    }
                } catch (e: Exception) {
                    Log.e(TAG, "getDeviceList : $e")
                } finally {
                    _isLoading.postValue(false)
                }
            }
        } else {
            // 1件もない
            _isNoDataFig.value = true
            _isLoading.value = false
        }
    }

    // 非同期でTDに対しupdate処理を実行する
    fun updateUserDevice() {
        Log.d(TAG, "updateUserDevice Start")
        // 更新ボタンを無効化する
        _isLoading.value = true
        _isUpdating.postValue(false)

        var loopCount = 0
        scope.launch {
            try {
                _deviceDataList.value?.forEach {
                    val result = saveDeviceToTD(
                        deviceId = it.sequenceId.toString(),
                        deviceTypeId = it.deviceTypeId.toString(),
                        deviceUri = it.deviceUri.toString(),
                        deviceTdId = it.deviceTdId.toString(),
                        isValid = if (it.isValid) TRUE_STRING else FALSE_STRING
                    )
                    if (result == null) {
                        throw Exception("result is null")
                    } else {
                        loopCount++
                    }
                    if (loopCount == _deviceDataList.value?.count()) {
                        // 更新ボタンを有効化する
                        _updateStatus.postValue(UpdateStatus.UPDATE_COMPLETED)
                    }
                }
            } catch (e: Exception) {
                Log.e(TAG, "updateUserDevice : $e")
            } finally {
                // 更新ボタンを有効化する
                _isUpdating.postValue(true)
                _isLoading.postValue(false)
            }
        }
        Log.i(TAG, "updateUserDevice End")
    }

    fun changeAlertDialogFlg(bool: Boolean) {
        _alertDialogFlg.value = bool
    }

    fun changeUpdateStatus(status: UpdateStatus) {
        _updateStatus.value = status
    }

    fun changeUserDevice(tdId: Int, isChecked: Boolean) {
        Log.d(TAG, "tdId : $tdId, isChecked : $isChecked")
        // _deviceDataListを更新する
        _deviceDataList.value = _deviceDataList.value?.map {
            if (it.deviceTdId == tdId)
                it.copy(isValid = isChecked)
            else
                it
        }
        Log.d(TAG, "changeUserDevice : ${_deviceDataList.value}")
    }

    data class DeviceData(
        val studySubjectId: Int,
        val sequenceId: Int,
        val deviceTdId: Int,
        val deviceTypeId: Int?,
        val deviceUri: String?,
        val isValid: Boolean,
        val deviceDisplayName: String
    )

    // ログ用オブジェクト
    companion object {
        private const val TAG = "WearableManagementViewModel"
//        const val PERSONA_ALREADY_EXISTS = "Persona already exists"
    }
}

enum class UpdateStatus {
    NONE,
    UPDATE_COMPLETED,
    ERROR,
}
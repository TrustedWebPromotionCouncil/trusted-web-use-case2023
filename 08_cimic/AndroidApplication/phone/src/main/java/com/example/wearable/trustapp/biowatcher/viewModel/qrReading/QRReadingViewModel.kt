package com.example.wearable.trustapp.biowatcher.viewModel.qrReading

import android.app.Application
import android.util.Log
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import com.example.wearable.trustapp.biowatcher.common.Constants.MAX_LOOP_WAITING_APPROVAL
import com.example.wearable.trustapp.biowatcher.common.Constants.TEN_SECONDS
import com.example.wearable.trustapp.biowatcher.common.RequestDataList
import com.example.wearable.trustapp.biowatcher.common.Util
import com.example.wearable.trustapp.biowatcher.common.Util.Companion.isValidResponseJsonString
import com.example.wearable.trustapp.biowatcher.common.Util.Companion.jsonDecode
import com.example.wearable.trustapp.biowatcher.common.WebResponseData
import com.example.wearable.trustapp.biowatcher.domain.entity.StudySubjectEntity
import com.example.wearable.trustapp.biowatcher.domain.repository.StudySubjectRepository
import com.example.wearable.trustapp.biowatcher.infrastructure.network.AppDatabase
import com.example.wearable.trustapp.biowatcher.infrastructure.repository.StudySubjectRepositoryImpl
import com.example.wearable.trustapp.biowatcher.service.WebRequestService
import com.example.wearable.trustapp.mobile.BaseApplication
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable
import java.time.LocalDate

class QRReadingViewModel(application: Application) : MainViewModel(application) {
    // コルーチン
    private val job = SupervisorJob()
    private val scope = CoroutineScope(Dispatchers.IO + job)

    // DB
    private var studySubjectRepository: StudySubjectRepository? = null

    private val _isLoading: MutableLiveData<Boolean> = MutableLiveData(false)
    val isLoading: LiveData<Boolean> = _isLoading

    // QRコード検出結果
    private val _detectedQRCode: MutableLiveData<String> = MutableLiveData("")
    val detectedQRCode: LiveData<String> = _detectedQRCode

    // 承認待ちフラグ
    private val _approvalStatus: MutableLiveData<ApprovalStatus> =
        MutableLiveData(ApprovalStatus.NONE)
    val approvalStatus: LiveData<ApprovalStatus> = _approvalStatus
    fun changeApprovalStatus(status: ApprovalStatus) {
        _approvalStatus.value = status
    }

    // 承認待ちsubject_study_id
    private val _pendingId: MutableLiveData<Int?> = MutableLiveData(null)
    val pendingId: LiveData<Int?> = _pendingId

    //
    init {
        // リポジトリ取得(シングルトン)
        studySubjectRepository = StudySubjectRepositoryImpl(
            AppDatabase.getInstance(application.applicationContext).studySubjectDao()
        )
    }

    // 初回アクセスフラグ更新(施設の承認待ち)
    fun subjectFirstAccess(qrCode: String) {
        try {
            // QRコードの検証
            val qrCodeData = jsonDecode<QRData>(qrCode)
            val request = RequestDataList().getRequestData(
                RequestDataList.RequestDataKind.FirstAccess,
                arrayOf(qrCodeData.studySubjectId.toString()),
                mapOf()
            )

            // 初回アクセスフラグ更新(施設の承認待ち)
            WebRequestService(getApplication<BaseApplication>().applicationContext).requestSaveData(
                webRequestData = request
            ) {
                try {
                    Log.d(TAG, "callback: $it")
                    if (!isValidResponseJsonString(it)) {
                        Log.w(TAG, "subjectFirstAccess update failed")
                        return@requestSaveData
                    }
                    val jsonResult: WebResponseData.BooleanResponse = jsonDecode(it)
                    if (jsonResult.result.lowercase() == "true") {
                        _approvalStatus.postValue(ApprovalStatus.PENDING)
                        _pendingId.postValue(qrCodeData.studySubjectId)
                    }
                } catch (e: Exception) {
                    Log.e(TAG, "subjectFirstAccess error : $e")
                }
            }
        } catch (e: Exception) {
            Log.d(TAG, "subjectFirstAccess: e: $e")
        }
    }

    // 承認待ち
    fun pendingForApproval() {
        try {
            scope.launch {
                // 最大 250 秒待つ
                var flg = false
                for (i in 1..MAX_LOOP_WAITING_APPROVAL) {
                    val request = RequestDataList().getRequestData(
                        RequestDataList.RequestDataKind.StudyHospitalList,
                        arrayOf(_pendingId.value.toString()),
                        mapOf()
                    )
                    WebRequestService(getApplication<BaseApplication>().applicationContext).requestSaveData(
                        webRequestData = request
                    ) {
                        try {
                            Log.d(TAG, "callback: $it")
                            if (!isValidResponseJsonString(it)) {
                                Log.w(TAG, "study subject is not approved yet")
                                return@requestSaveData
                            }

                            // レスポンスデータが取得できたら、承認済みフラグを立てる
                            val studyHospital = jsonDecode<WebResponseData.StudyHospital>(it)
                            if (studyHospital.studyHospitalId != null) flg = true
                        } catch (e: Exception) {
                            Log.e(TAG, "waitingForApproval error : $e")
                        }
                    }
                    delay(TEN_SECONDS)  // 10 秒待つ
                    Log.d(TAG, "waitingForApproval: i: $i")
                    if (flg) {
                        _approvalStatus.postValue(ApprovalStatus.APPROVED)
                        break
                    } else if (i == MAX_LOOP_WAITING_APPROVAL) {
                        _approvalStatus.postValue(ApprovalStatus.REJECTED)  // 最大待ち時間を超えたら、承認拒否
                    }
                }
            }
        } catch (e: Exception) {
            _approvalStatus.postValue(ApprovalStatus.REJECTED)
            Log.e(TAG, "waitingForApproval: $e")
        }
    }

    // roomDBにsubject_study_idを登録する
    private fun updateSubjectUriInRoomDB(callback: (Boolean) -> Unit) {
        try {
            scope.launch {
                try {
                    val findResult = studySubjectRepository?.findBySubjectId(_pendingId.value!!)
                    val today = Util.toYYYYMMDDString(LocalDate.now())
                    if (findResult != null) {
                        findResult.isValid = true   // 有効に変更する
                        findResult.updatedAt = today
                        studySubjectRepository?.update(findResult)
                    } else {
                        studySubjectRepository?.add(
                            StudySubjectEntity(
                                id = 0,
                                studySubjectId = _pendingId.value!!,
                                isValid = true,
                                createdAt = today,
                                updatedAt = today
                            )
                        )
                    }
                    callback(true)
                } catch (e: Exception) {
                    callback(false)
                    Log.d(TAG, "updateSubjectUriInRoomDB: e: $e")
                }
            }
        } catch (e: Exception) {
            Log.d(TAG, "updateSubjectUri: $e")
            callback(false)
        }
    }

    // 承認後、自分のURIをTDに登録する
    fun updateSubjectUri() {
        try {
            // roomDBにsubject_study_idを登録する
            updateSubjectUriInRoomDB { roomResult ->
                if (!roomResult) {
                    _approvalStatus.postValue(ApprovalStatus.REJECTED)
                    return@updateSubjectUriInRoomDB
                }

                // 自分のURIをセット
                val selfUri = gatewayService.activePersona?.uri.toString()
                val request = RequestDataList().getRequestData(
                    RequestDataList.RequestDataKind.SaveSelfUri,
                    arrayOf(_pendingId.value.toString()),
                    mapOf("uri" to selfUri)
                )

                // 自分のURIをTDに登録する
                WebRequestService(getApplication<BaseApplication>().applicationContext).requestSaveData(
                    webRequestData = request
                ) { response ->
                    var status = ApprovalStatus.REJECTED
                    try {
                        Log.d(TAG, "callback: $response")
                        if (!isValidResponseJsonString(response)) {
                            Log.w(TAG, "SelfUri update failed")
                        } else {
                            val jsonResult: WebResponseData.BooleanResponse = jsonDecode(response)
                            if (jsonResult.result.lowercase() == "true") {
                                status = ApprovalStatus.ALL_COMPLETED
                            }
                        }
                    } catch (e: Exception) {
                        Log.e(TAG, "updateSubjectUri : $e")
                    }
                    _approvalStatus.postValue(status)
                }
            }
        } catch (e: Exception) {
            _approvalStatus.postValue(ApprovalStatus.REJECTED)
            Log.d(TAG, "updateSubjectUri: $e")
        }
    }

    @Serializable
    data class QRData(
        @SerialName("id") val studySubjectId: Int,   // 例：{"id":1}
    )

    enum class ApprovalStatus {
        NONE,
        PENDING,
        APPROVED,
        ALL_COMPLETED,
        REJECTED,
    }

    // ログ用オブジェクト
    companion object {
        private const val TAG = "QRReadingViewModel"
//        const val PERSONA_ALREADY_EXISTS = "Persona already exists"
    }
}


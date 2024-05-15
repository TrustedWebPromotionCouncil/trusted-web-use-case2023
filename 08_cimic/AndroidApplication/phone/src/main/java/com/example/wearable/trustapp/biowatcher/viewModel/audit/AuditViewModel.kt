package com.example.wearable.trustapp.biowatcher.viewModel.audit

import android.app.Application
import android.util.Log
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.SavedStateHandle
import com.example.wearable.trustapp.biowatcher.common.Constants
import com.example.wearable.trustapp.biowatcher.common.Constants.HISTORY_DOC_COL_SIZE
import com.example.wearable.trustapp.biowatcher.common.RequestDataList
import com.example.wearable.trustapp.biowatcher.common.Util.Companion.convertIsoOffSetDateTimeToString
import com.example.wearable.trustapp.biowatcher.common.Util.Companion.isValidDateString
import com.example.wearable.trustapp.biowatcher.common.Util.Companion.isValidResponseJsonString
import com.example.wearable.trustapp.biowatcher.common.Util.Companion.jsonDecode
import com.example.wearable.trustapp.biowatcher.common.WebResponseData
import com.example.wearable.trustapp.biowatcher.service.WebRequestService
import com.example.wearable.trustapp.mobile.BaseApplication
import java.time.LocalDate
import java.time.format.DateTimeFormatter


class AuditViewModel(
    application: Application,
    savedStateHandle: SavedStateHandle,
) : MainViewModel(application) {
    // 試験・病院ID
    val studySubjectId: String = checkNotNull(savedStateHandle[Constants.STUDY_SUBJECT_ID])
    val studyHospitalId: String = checkNotNull(savedStateHandle[Constants.STUDY_HOSPITAL_ID])
    val studyHospitalName: String = checkNotNull(savedStateHandle[Constants.STUDY_HOSPITAL_NAME])

    // 表示期間[開始-終了日付]
    private val _startDate: MutableLiveData<LocalDate> = MutableLiveData(LocalDate.now())
    private val _endDate: MutableLiveData<LocalDate> = MutableLiveData(LocalDate.now())
    val startDate: LiveData<LocalDate> = _startDate
    val endDate: LiveData<LocalDate> = _endDate

    // 監査証跡存在可否フラグ(監査証跡履歴があるか判定フラグ)
    private val _isDataListPresent: MutableLiveData<Boolean> = MutableLiveData(false)
    val isDataListPresent: LiveData<Boolean> = _isDataListPresent

    // 監査証跡検索ステータス
    private val _searchStatus: MutableLiveData<SearchStatus> = MutableLiveData(SearchStatus.NONE)
    val searchStatus: LiveData<SearchStatus> = _searchStatus

    // 監査証跡一覧：列数・行数
    private var _columnCount: Int = HISTORY_DOC_COL_SIZE
    private var _rowCount: Int = 0
    val columnCount: Int get() = _columnCount
    val rowCount: Int get() = _rowCount

    // 監査証跡一覧のカラム名
    val columnName
        get() = arrayOf(
            "date_of_action",
            "name",
            "sub_name",
            "action_user_id",
            "action",
            "contact_list",
            "file_name",
            "study_hospital_id",
            "study_subject",
            "hash",
        )

    private val _auditListArray: MutableList<Array<String>> = mutableListOf()
    val auditListArray: MutableList<Array<String>>
        get() = _auditListArray

    init {
        Log.d(TAG, "init Start")

        Log.i(TAG, "init End")
    }


    fun changeStartDate(newDate: String) {
        Log.d(TAG, "changeStartDate() newDate : $newDate")
        val newDate = try {
            LocalDate.parse(newDate, DateTimeFormatter.ofPattern("yyyy/MM/dd"))
        } catch (e: Exception) {
            Log.e(TAG, "changeStartDate() Exception : $e")
            LocalDate.now()
        }
        _startDate.value = newDate
    }

    fun changeEndDate(newDate: String) {
        Log.d(TAG, "changeEndDate() newDate : $newDate")
        val newDate = try {
            LocalDate.parse(newDate, DateTimeFormatter.ofPattern("yyyy/MM/dd"))
        } catch (e: Exception) {
            Log.e("SubjectData", "changeEndDate() Exception : $e")
            LocalDate.now()
        }
        _endDate.value = newDate
    }
    fun backToSearchScreen() {
        _searchStatus.value = SearchStatus.NONE
        _isDataListPresent.value = false
    }
    // 同意文書履歴一覧のセット
    fun searchAuditTrail() {
        // 検索中
        _searchStatus.value = SearchStatus.SEARCHING

        // dateToとdateFromがyyyy-mm-ddの形式かチェック
        val dateFrom = _startDate.value.toString()
        val dateTo = _endDate.value.toString()
        if (!isValidDateString(dateFrom) || !isValidDateString(dateTo)) {
            Log.e(TAG, "dateFrom is invalid")
            _searchStatus.value = SearchStatus.COMPLETE
            return
        }

        // 監査証跡画面[croaudit/subjectauditlog/<[studysubjects]id>/{date_from}/{date_to}]
        val request = RequestDataList().getRequestData(
            RequestDataList.RequestDataKind.AuditList,
            arrayOf(studySubjectId, dateFrom, dateTo),
            mapOf()
        )
        WebRequestService(getApplication<BaseApplication>().applicationContext).requestSaveData(
            webRequestData = request
        ) {
            try {
                Log.d(TAG, "callback: $it")
                if (!isValidResponseJsonString(it)) {
                    Log.w(TAG, "auditTrail is not found")
                } else {
                    val auditTrailList: List<WebResponseData.AuditTrail> = jsonDecode(it)
                    _auditListArray.clear()
                    //_documentListArrayに変換する
                    auditTrailList.forEach { auditTrail ->
                        val dateOfAction = if (convertIsoOffSetDateTimeToString(auditTrail.dateOfAction) == "") {
                             auditTrail.dateOfAction
                        }else{
                            convertIsoOffSetDateTimeToString(auditTrail.dateOfAction)
                        }
                        _auditListArray.add(
                            arrayOf(
                                dateOfAction,
                                auditTrail.name,
                                auditTrail.subName,
                                auditTrail.actionUserId,
                                auditTrail.action,
                                auditTrail.contactList,
                                auditTrail.fileName,
                                auditTrail.studyHospitalId.toString(),
                                auditTrail.studySubjectId.toString(),
                                auditTrail.hash,
                            )
                        )
                    }
                    _columnCount = _auditListArray[0].size
                    _rowCount = _auditListArray.size
                    Log.d(TAG, "_columnCount : $_columnCount")
                    Log.d(TAG, "_rowCount : $_rowCount")
                    _isDataListPresent.postValue(true)
                }
            } catch (e: Exception) {
                Log.e(TAG, "searchAuditTrail : $e")
            } finally {
                _searchStatus.postValue(SearchStatus.COMPLETE)
            }
        }
    }

    enum class SearchStatus {
        NONE,       // 未検索
        SEARCHING,  // 検索中
        COMPLETE,   // 検索完了
    }

    // ログ用オブジェクト
    companion object {
        private const val TAG = "ConsentHistoryViewModel"
    }
}


package com.example.wearable.trustapp.biowatcher.common

import okhttp3.Headers

data class WebRequestData(
    val kind: RequestKind,
    val apiUrl: String,
    val queryData: Map<String, String> = mapOf(),
    val urlStrReplace: Array<String> = arrayOf(),
//    val queryNameList: List<String>,
    val bodyData: Map<String, String>? = null,
    val headers: Headers? = null,
    val urlEncodeFlg: Boolean = false
) {
    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (javaClass != other?.javaClass) return false

        other as WebRequestData

        if (kind != other.kind) return false
        if (apiUrl != other.apiUrl) return false
        if (queryData != other.queryData) return false
        if (!urlStrReplace.contentEquals(other.urlStrReplace)) return false
        if (bodyData != other.bodyData) return false

        return true
    }

    override fun hashCode(): Int {
        var result = kind.hashCode()
        result = 31 * result + apiUrl.hashCode()
        result = 31 * result + queryData.hashCode()
        result = 31 * result + urlStrReplace.contentHashCode()
        result = 31 * result + (bodyData?.hashCode() ?: 0)
        return result
    }
}

class RequestDataList {
    fun getRequestData(
        kindData: RequestDataKind,
        urlStrReplace: Array<String>,
        bodyData: Map<String, String>,
        headers: Headers? = null,
        urlEncodeFlg: Boolean = false
    ): WebRequestData {
        val request = when (kindData) {
            RequestDataKind.FirstAccess -> firstAccess
            RequestDataKind.SaveSelfUri -> saveSelfUri
            RequestDataKind.StudySubjectContactList -> studySubjectContactList
            RequestDataKind.StudyHospitalList -> studyHospitalList
            RequestDataKind.PdfDocument -> pdfDocument
            RequestDataKind.ConsentDocument -> consentDocument
            RequestDataKind.WithdrawDocument -> withdrawDocument
            RequestDataKind.DocumentAfterConsentList -> documentAfterConsentList
            RequestDataKind.DocumentHistoryList -> documentHistoryList
            RequestDataKind.SaveDevice -> saveDevice
            RequestDataKind.SubjectDeviceStudy -> subjectDeviceStudy
            RequestDataKind.AuditList -> auditList
            RequestDataKind.WriteAuditTrail -> writeAuditTrail
            RequestDataKind.DeviceDataList -> deviceDataList
            RequestDataKind.SaveDeviceData -> saveDeviceData
            RequestDataKind.DeviceContactList -> deviceContactList
            RequestDataKind.StudySubjectStatus -> studySubjectStatus
            RequestDataKind.DeviceMaster -> deviceMaster
            RequestDataKind.FitbitPulseTimeSeries -> fitBitPulseTimeseries
            RequestDataKind.FitbitPulseIntraday -> fitBitPulseIntraday

            RequestDataKind.FitbitRefresh -> fitbitRefresh
            RequestDataKind.FitbitECG -> fitbitECG
        }.copy(urlStrReplace = urlStrReplace, bodyData = bodyData, headers = headers, urlEncodeFlg = urlEncodeFlg)
        return request
    }

    fun getRequestText(kindData: RequestDataKind): String {
        return when (kindData) {
            RequestDataKind.FirstAccess -> firstAccessText
            RequestDataKind.SaveSelfUri -> saveSelfUriText
            RequestDataKind.StudySubjectContactList -> studySubjectContactListText
            RequestDataKind.StudyHospitalList -> studyHospitalListText
            RequestDataKind.PdfDocument -> pdfDocumentText
            RequestDataKind.ConsentDocument -> consentDocumentText
            RequestDataKind.WithdrawDocument -> withdrawDocumentText
            RequestDataKind.DocumentAfterConsentList -> documentAfterConsentListText
            RequestDataKind.DocumentHistoryList -> documentHistoryListText
            RequestDataKind.SaveDevice -> saveDeviceText
            RequestDataKind.SubjectDeviceStudy -> subjectDeviceStudyText
            RequestDataKind.AuditList -> auditListText
            RequestDataKind.WriteAuditTrail -> writeAuditListText
            RequestDataKind.DeviceDataList -> deviceDataListText
            RequestDataKind.SaveDeviceData -> saveDeviceDataText
            RequestDataKind.DeviceContactList -> deviceContactListText
            RequestDataKind.StudySubjectStatus -> studySubjectStatusText
            RequestDataKind.DeviceMaster -> deviceMasterText
            RequestDataKind.FitbitPulseTimeSeries -> fitbitPulseTimeSeriesText
            RequestDataKind.FitbitPulseIntraday -> fitbitPulseIntradayText

            RequestDataKind.FitbitRefresh -> fitbitRefreshText
            RequestDataKind.FitbitECG -> fitbitECGText
        }
    }

    private val firstAccessText = "初回アクセス"
    private val saveSelfUriText = "承認待ってからURIを登録"
    private val studySubjectContactListText = "試験-病院コンタクトリストの取得"
    private val studyHospitalListText = "試験-病院リストの取得"
    private val pdfDocumentText = "画面にpdf表示する文書の表示"
    private val consentDocumentText = "同意/再同意ボタン押下"
    private val withdrawDocumentText = "撤回ボタン押下"
    private val documentAfterConsentListText = "同意済み文書の取得"
    private val documentHistoryListText = "同意履歴一覧の取得"
    private val saveDeviceText = "ウェアラブル更新"
    private val subjectDeviceStudyText = "ウェアラブル端末データ取得"
    private val auditListText = "監査証跡画面"
    private val writeAuditListText = "監査証跡画面"
    private val deviceDataListText = "被験者データの取得"
    private val saveDeviceDataText = "ウェアラブルのデータ送信"
    private val deviceContactListText = "デバイス用コンタクトリストの取得"
    private val studySubjectStatusText = "被験者ステータスの取得"
    private val deviceMasterText = "デバイスマスタの取得"
    private val fitbitPulseTimeSeriesText = "Fitbitの心拍数データの取得(TimeSeries)"
    private val fitbitPulseIntradayText = "Fitbitの心拍数データの取得(TimeSeries)"
    private val fitbitRefreshText = "Fitbitの再取得"
    private val fitbitECGText = "FitbitのECGデータ取得"


    enum class RequestDataKind {
        FirstAccess,
        SaveSelfUri,
        StudySubjectContactList,
        StudyHospitalList,
        PdfDocument,
        ConsentDocument,
        WithdrawDocument,
        DocumentAfterConsentList,
        DocumentHistoryList,
        SaveDevice,
        SubjectDeviceStudy,
        AuditList,
        WriteAuditTrail,
        DeviceDataList,
        SaveDeviceData,
        DeviceContactList,
        StudySubjectStatus,
        DeviceMaster,
        FitbitPulseTimeSeries,
        FitbitPulseIntraday,
        FitbitRefresh,
        FitbitECG,
    }

    // 初回アクセス[crodirectory/subjectfirstaccess/<[studysubjects]id>/]
    private val firstAccess = WebRequestData(
        kind = RequestKind.PATCH,
        apiUrl = WebAPIUrl().getApiURL(WebAPIUrl.ApiUrl.WEB_PATCH_FIRST_ACCESS),
    )

    // 承認待ってからURIを登録[crodirectory/updatesubjecturi/<[studysubjects]id>/]
    private val saveSelfUri = WebRequestData(
        kind = RequestKind.PATCH,
        apiUrl = WebAPIUrl().getApiURL(WebAPIUrl.ApiUrl.WEB_PATCH_SAVE_SELF_URI),
    )

    // 試験-病院コンタクトリストの取得[crodirectory/subjectcontacts/<[studysubjects]id>/]
    private val studySubjectContactList = WebRequestData(
        kind = RequestKind.GET,
        apiUrl = WebAPIUrl().getApiURL(WebAPIUrl.ApiUrl.WEB_GET_STUDY_SUBJECT_CONTACT_LIST),
    )

    // 試験-病院リストの取得[crodirectory/subjectstudyhospitals/<[studysubjects]id>/]
    private val studyHospitalList = WebRequestData(
        kind = RequestKind.GET,
        apiUrl = WebAPIUrl().getApiURL(WebAPIUrl.ApiUrl.WEB_GET_STUDY_HOSPITAL_LIST),
    )

    // 画面にpdf表示する文書の表示[crodirectory/subjecticdoc/<[studysubjects]id>/]
    private val pdfDocument = WebRequestData(
        kind = RequestKind.GET,
        apiUrl = WebAPIUrl().getApiURL(WebAPIUrl.ApiUrl.WEB_GET_PDF_DOCUMENT),
    )

    // 同意/再同意ボタン押下[crodirectory/createsubjectic/]
    private val consentDocument = WebRequestData(
        kind = RequestKind.POST,
        apiUrl = WebAPIUrl().getApiURL(WebAPIUrl.ApiUrl.WEB_POST_CONSENT_DOCUMENT),
    )

    // 撤回ボタン押下[crodirectory/createdevice/]
    private val withdrawDocument = WebRequestData(
        kind = RequestKind.POST,
        apiUrl = WebAPIUrl().getApiURL(WebAPIUrl.ApiUrl.WEB_POST_WITHDRAW_DOCUMENT),
    )

    // 同意済み文書の取得[crodirectory/aftericdoc/<[studysubjects]id>/]
    private val documentAfterConsentList = WebRequestData(
        kind = RequestKind.GET,
        apiUrl = WebAPIUrl().getApiURL(WebAPIUrl.ApiUrl.WEB_GET_DOCUMENT_AFTER_CONSENT_LIST),
    )

    // 同意履歴一覧の取得[crodirectory/iclogs/<[studysubjects]id>/]
    private val documentHistoryList = WebRequestData(
        kind = RequestKind.GET,
        apiUrl = WebAPIUrl().getApiURL(WebAPIUrl.ApiUrl.WEB_GET_DOCUMENT_HISTORY_LIST),
    )

    // ウェアラブル更新[crodirectory/updatesubjectdevice/]
    private val saveDevice = WebRequestData(
        kind = RequestKind.POST,
        apiUrl = WebAPIUrl().getApiURL(WebAPIUrl.ApiUrl.WEB_POST_SAVE_DEVICE),
    )

    // ウェアラブル端末データ取得[subjectdevicestudy/[studysubjects]id>/]
    private val subjectDeviceStudy = WebRequestData(
        kind = RequestKind.GET,
        apiUrl = WebAPIUrl().getApiURL(WebAPIUrl.ApiUrl.WEB_GET_STUDY_DEVICE),
    )

    // 監査証跡画面[croaudit/subjectauditlog/<[studysubjects]id>/{date_from}/{date_to}]
    private val auditList = WebRequestData(
        kind = RequestKind.GET,
        apiUrl = WebAPIUrl().getApiURL(WebAPIUrl.ApiUrl.WEB_GET_AUDIT_LIST),
    )
    // 監査証跡画面[croaudit/subjectauditlog/<[studysubjects]id>/{date_from}/{date_to}]
    private val writeAuditTrail = WebRequestData(
        kind = RequestKind.POST,
        apiUrl = WebAPIUrl().getApiURL(WebAPIUrl.ApiUrl.WEB_POST_AUDIT_TRAIL),
    )
    // 被験者データの取得[devicestorage/devicedata/<[studysubjects]id>/<activityId>/<date_from>/<date_to>/]
    private val deviceDataList = WebRequestData(
        kind = RequestKind.GET,
        apiUrl = WebAPIUrl().getApiURL(WebAPIUrl.ApiUrl.WEB_GET_DEVICE_DATA_LIST),
    )

    // ウェアラブルのデータ送信[devicestorage/postdevicedata/]
    private val saveDeviceData = WebRequestData(
        kind = RequestKind.POST,
        apiUrl = WebAPIUrl().getApiURL(WebAPIUrl.ApiUrl.WEB_POST_SAVE_DEVICE_DATA),
    )

    // デバイスのコンタクトリスト[crodirectory/devicecontacts/<[deviceTDId]>]
    private val deviceContactList = WebRequestData(
        kind = RequestKind.GET,
        apiUrl = WebAPIUrl().getApiURL(WebAPIUrl.ApiUrl.WEB_GET_DEVICE_CONTACT_LIST),
    )
    // 試験ー病院施設ステータス取得[crodirectory/subjectstatus/<[studySubjectId]>]
    private val studySubjectStatus = WebRequestData(
        kind = RequestKind.GET,
        apiUrl = WebAPIUrl().getApiURL(WebAPIUrl.ApiUrl.WEB_GET_STUDY_SUBJECT_STATUS),
    )

    // デバイスのマスタ取得(デバイス名・アクティビティ)[devicemaster/]
    private val deviceMaster = WebRequestData(
        kind = RequestKind.GET,
        apiUrl = WebAPIUrl().getApiURL(WebAPIUrl.ApiUrl.WEB_GET_DEVICE_MASTER),
    )

    // [未使用]
    // Fitbitの心拍数データの取得[/1/user/[user-id]/activities/heart/date/[date]/[period].json]
    private val fitBitPulseTimeseries = WebRequestData(
        kind = RequestKind.GET,
        apiUrl = WebAPIUrl().getApiURL(WebAPIUrl.ApiUrl.WEB_GET_FITBIT_PULSE_TIME_SERIES),
    )
    // Fitbitの心拍数データの取得[/1/user/[user-id]/activities/heart/date/[date]/1d/1sec.json]
    private val fitBitPulseIntraday = WebRequestData(
        kind = RequestKind.GET,
        apiUrl = WebAPIUrl().getApiURL(WebAPIUrl.ApiUrl.WEB_GET_FITBIT_PULSE_INTRADAY),
    )
    private val fitbitRefresh = WebRequestData(
        kind = RequestKind.POST,
        apiUrl = WebAPIUrl().getApiURL(WebAPIUrl.ApiUrl.WEB_POST_FITBIT_REFRESH),
    )
    private val fitbitECG = WebRequestData(
        kind = RequestKind.GET,
        apiUrl = WebAPIUrl().getApiURL(WebAPIUrl.ApiUrl.WEB_GET_FITBIT_ECG),
    )

    // ログ用オブジェクト
    companion object {
        private const val TAG = "WebRequestData"
    }
}

enum class RequestKind {
    GET,
    POST,

    //    PUT,
    PATCH,
    DELETE,
}
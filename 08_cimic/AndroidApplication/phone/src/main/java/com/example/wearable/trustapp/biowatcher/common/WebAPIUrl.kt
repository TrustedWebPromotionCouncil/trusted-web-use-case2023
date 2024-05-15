package com.example.wearable.trustapp.biowatcher.common

import com.example.wearable.trustapp.BuildConfig

class WebAPIUrl {
    fun getApiURL(url: ApiUrl): String {
        return when (url) {
            ApiUrl.WEB_PATCH_FIRST_ACCESS -> WEB_PATCH_FIRST_ACCESS
            ApiUrl.WEB_PATCH_SAVE_SELF_URI -> WEB_PATCH_SAVE_SELF_URI
            ApiUrl.WEB_GET_STUDY_SUBJECT_CONTACT_LIST -> WEB_GET_STUDY_SUBJECT_CONTACT_LIST
            ApiUrl.WEB_GET_STUDY_HOSPITAL_LIST -> WEB_GET_STUDY_HOSPITAL_LIST
            ApiUrl.WEB_GET_PDF_DOCUMENT -> WEB_GET_PDF_DOCUMENT
            ApiUrl.WEB_POST_CONSENT_DOCUMENT -> WEB_POST_CONSENT_DOCUMENT
            ApiUrl.WEB_POST_WITHDRAW_DOCUMENT -> WEB_POST_WITHDRAW_DOCUMENT
            ApiUrl.WEB_GET_DOCUMENT_AFTER_CONSENT_LIST -> WEB_GET_DOCUMENT_AFTER_CONSENT_LIST
            ApiUrl.WEB_GET_DOCUMENT_HISTORY_LIST -> WEB_GET_DOCUMENT_HISTORY_LIST
            ApiUrl.WEB_POST_SAVE_DEVICE -> WEB_POST_SAVE_DEVICE
            ApiUrl.WEB_GET_STUDY_DEVICE -> WEB_GET_STUDY_DEVICE
            ApiUrl.WEB_GET_AUDIT_LIST -> WEB_GET_AUDIT_LIST
            ApiUrl.WEB_POST_AUDIT_TRAIL -> WEB_POST_AUDIT_TRAIL
            ApiUrl.WEB_GET_DEVICE_DATA_LIST -> WEB_GET_DEVICE_DATA_LIST
            ApiUrl.WEB_POST_SAVE_DEVICE_DATA -> WEB_POST_SAVE_DEVICE_DATA
            ApiUrl.WEB_GET_DEVICE_CONTACT_LIST -> WEB_GET_DEVICE_CONTACT_LIST
            ApiUrl.WEB_GET_STUDY_SUBJECT_STATUS -> WEB_GET_STUDY_SUBJECT_STATUS
            ApiUrl.WEB_GET_DEVICE_MASTER -> WEB_GET_DEVICE_MASTER
            ApiUrl.WEB_GET_FITBIT_PULSE_TIME_SERIES -> WEB_GET_FITBIT_PULSE_TIME_SERIES
            ApiUrl.WEB_GET_FITBIT_PULSE_INTRADAY -> WEB_GET_FITBIT_PULSE_INTRADAY

            ApiUrl.WEB_POST_FITBIT_REFRESH -> WEB_POST_FITBIT_REFRESH
            ApiUrl.WEB_GET_FITBIT_ECG -> WEB_GET_FITBIT_ECG
        }
    }

    enum class ApiUrl {
        WEB_PATCH_FIRST_ACCESS,
        WEB_PATCH_SAVE_SELF_URI,
        WEB_GET_STUDY_SUBJECT_CONTACT_LIST,
        WEB_GET_STUDY_HOSPITAL_LIST,
        WEB_GET_PDF_DOCUMENT,
        WEB_POST_CONSENT_DOCUMENT,
        WEB_POST_WITHDRAW_DOCUMENT,
        WEB_GET_DOCUMENT_AFTER_CONSENT_LIST,
        WEB_GET_DOCUMENT_HISTORY_LIST,
        WEB_POST_SAVE_DEVICE,
        WEB_GET_STUDY_DEVICE,
        WEB_GET_AUDIT_LIST,
        WEB_POST_AUDIT_TRAIL,
        WEB_GET_DEVICE_DATA_LIST,
        WEB_POST_SAVE_DEVICE_DATA,
        WEB_GET_DEVICE_CONTACT_LIST,
        WEB_GET_STUDY_SUBJECT_STATUS,
        WEB_GET_DEVICE_MASTER,
        WEB_GET_FITBIT_PULSE_TIME_SERIES,
        WEB_GET_FITBIT_PULSE_INTRADAY,
        WEB_POST_FITBIT_REFRESH,
        WEB_GET_FITBIT_ECG,
    }

    companion object {
        // ベースURL
        private const val WEB_API_PREFIX = BuildConfig.TD_SERVER_URL
        private const val WEB_API_PREFIX_FOR_FITBIT = "https://api.fitbit.com"

        // BASE_DIR
        private class WEB_BASE_DIR {
            companion object {
                const val CRO = "/crodirectory/"   // CROディレクトリ
                const val DEV = "/devicestorage/"  // デバイスストレージ
                const val AUD = "/croaudit/"  // 監査証跡
            }
        }

        private const val WEB_PATCH_FIRST_ACCESS =
            WEB_API_PREFIX + WEB_BASE_DIR.CRO + "subjectfirstaccess/%s/"   // 初回アクセス[crodirectory/subjectfirstaccess/<[studysubjects]id>/]
        private const val WEB_PATCH_SAVE_SELF_URI =
            WEB_API_PREFIX + WEB_BASE_DIR.CRO + "updatesubjecturi/%s/"   // 承認待ってからURIを登録[crodirectory/updatesubjecturi/<[studysubjects]id>/]
        private const val WEB_GET_STUDY_SUBJECT_CONTACT_LIST =
            WEB_API_PREFIX + WEB_BASE_DIR.CRO + "subjectcontacts/%s/"   // 試験-病院コンタクトリストの取得[crodirectory/subjectcontacts/<[studysubjects]id>/]
        private const val WEB_GET_STUDY_HOSPITAL_LIST =
            WEB_API_PREFIX + WEB_BASE_DIR.CRO + "subjectstudyhospitals/%s/"   // 試験-病院リストの取得[crodirectory/subjectstudyhospitals/<[studysubjects]id>/]
        private const val WEB_GET_PDF_DOCUMENT =
            WEB_API_PREFIX + WEB_BASE_DIR.CRO + "subjecticdoc/%s/"   // 画面にpdf表示する文書の表示[crodirectory/subjecticdoc/<[studysubjects]id>/]
        private const val WEB_POST_CONSENT_DOCUMENT =
            WEB_API_PREFIX + WEB_BASE_DIR.CRO + "createsubjectic/"   // 同意/再同意ボタン押下[crodirectory/createsubjectic/]
        private const val WEB_POST_WITHDRAW_DOCUMENT =
            WEB_API_PREFIX + WEB_BASE_DIR.CRO + "withdrawic/"   // 撤回ボタン押下[crodirectory/createdevice/%s/]
        private const val WEB_GET_DOCUMENT_AFTER_CONSENT_LIST =
            WEB_API_PREFIX + WEB_BASE_DIR.CRO + "aftericdoc/%s/"   // 同意済み文書の取得[crodirectory/aftericdoc/%s/]
        private const val WEB_GET_DOCUMENT_HISTORY_LIST =
            WEB_API_PREFIX + WEB_BASE_DIR.CRO + "iclogs/%s/"     // 同意履歴一覧の取得[crodirectory/iclogs/%s/]
        private const val WEB_POST_SAVE_DEVICE =
            WEB_API_PREFIX + WEB_BASE_DIR.CRO + "updatesubjectdevice/"     // ウェアラブル更新[crodirectory/updatesubjectdevice/]
        private const val WEB_GET_STUDY_DEVICE =
            WEB_API_PREFIX + WEB_BASE_DIR.CRO + "subjectdevicestudy/%s/"     // ウェアラブル対象フラグ情報取得[subjectdevicestudy/[studysubjects]id>/]
        private const val WEB_GET_DEVICE_CONTACT_LIST =
            WEB_API_PREFIX + WEB_BASE_DIR.CRO + "devicecontacts/%s/"     // デバイスのコンタクトリスト[crodirectory/devicecontacts/<[deviceTDId]>]
        private const val WEB_GET_STUDY_SUBJECT_STATUS =
            WEB_API_PREFIX + WEB_BASE_DIR.CRO + "subjectstatus/%s/"     // 試験ー病院施設ステータス取得[crodirectory/subjectstatus/<[studySubjectId]>]

        // AUDIT
        private const val WEB_GET_AUDIT_LIST =
            WEB_API_PREFIX + WEB_BASE_DIR.AUD + "subjectauditlog/%s/%s/%s/"     // 監査証跡画面[croaudit/{subjectauditlog/<[studysubjects]id>/{date_from}/{date_to}]
        private const val WEB_POST_AUDIT_TRAIL =
            WEB_API_PREFIX + WEB_BASE_DIR.AUD + "subjectauditlogwrite/"     // 監査証跡画面[croaudit/subjectauditlogwrite/]


        // DEVICE
        private const val WEB_GET_DEVICE_DATA_LIST =
            WEB_API_PREFIX + WEB_BASE_DIR.DEV + "devicedata/%s/%s/%s/%s/"     // 被験者データの取得[devicestorage/devicedata/<[studysubjects]id>/activity_id>/<date_from>/<date_to>/]
        private const val WEB_POST_SAVE_DEVICE_DATA =
            WEB_API_PREFIX + WEB_BASE_DIR.DEV + "postdevicedata/"     // ウェアラブルのデータ送信[devicestorage/postdevicedata/]
        private const val WEB_GET_DEVICE_MASTER =
            WEB_API_PREFIX + WEB_BASE_DIR.DEV + "devicemaster/"     // デバイスのマスタ取得(デバイス名・アクティビティ)[devicemaster/]

        // [未使用]Fitbit HeratRate用API[https://dev.fitbit.com/build/reference/web-api/heartrate-timeseries/get-heartrate-timeseries-by-date/]
        private const val WEB_GET_FITBIT_PULSE_TIME_SERIES =
            "$WEB_API_PREFIX_FOR_FITBIT/1/user/%s/activities/heart/date/%s/%s.json"     // デバイスのマスタ取得(デバイス名・アクティビティ)[/1/user/[user-id]/activities/heart/date/[date]/[period].json]
        // Fitbitの心拍数データの取得[/1/user/[user-id]/activities/heart/date/[date]/1d/1sec.json]
        private const val WEB_GET_FITBIT_PULSE_INTRADAY =
            "$WEB_API_PREFIX_FOR_FITBIT/1/user/%s/activities/heart/date/%s/1d/1sec.json"     // Fitbit 心拍数取得[/1/user/[user-id]/activities/heart/date/[date]/1d/1sec.json]
        // https://api.fitbit.com/oauth2/token
        private const val WEB_POST_FITBIT_REFRESH =
            "$WEB_API_PREFIX_FOR_FITBIT/oauth2/token"     // Fitbitのトークン再取得)[/oauth2/token]
        private const val WEB_GET_FITBIT_ECG =
            "$WEB_API_PREFIX_FOR_FITBIT/1/user/%s/ecg/list.json?afterDate=%s&sort=asc&limit=1&offset=0"     // デバイスのマスタ取得(デバイス名・アクティビティ)[1/user/[user-id]/ecg/list.json?afterDate=[yyyy-mm-dd]]&sort=asc&limit=1&offset=0]
    }
}
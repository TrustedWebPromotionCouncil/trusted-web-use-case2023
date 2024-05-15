package com.example.wearable.trustapp.biowatcher.common

import com.google.common.graph.Graph

object Constants {
    const val ALL = "ALL"
    const val HOURS_PER_DAY = 24
    const val HOUR_PER_MINUTE = 60
    const val SENDER_ID = "senderId"
    const val RECEIVER_ID = "receiverId"
    const val MAX_INT = Int.MAX_VALUE
    const val MSG = "msg"
    const val URI = "uri"
    const val ERROR_GETTING_MESSAGES_FOR_CHAT_ID = "Error getting messages for chatId: "
    const val ERROR_REFRESHING_CONTENT = "Error refreshing content: "
    const val ERROR_GETTING_CONTACTS = "Error getting contacts: "
    const val ERROR_SETTING_CHAT_RECIPIENT = "Error setting chat recipient: "
    const val ERROR_SHOWING_CONVERSATION = "Error showing conversation: "
    const val MSG_TYPE = "msgType"
    const val PAIR_REQUEST = "pairRequest"
    const val PAIR_RESPONSE = "pairResponse"
    const val PAIR_ACK = "pairAck"
    const val SENDER_NAME = "senderName"
    const val SENDER_SUB_NAME = "senderSubName"
    const val UNEXPECTED_EXCEPTION = "Unexpected exception: "
    const val RECEIVED = "Received "
    const val SENDING = "Sending "
    const val CONTACT_ALREADY_EXISTS = "Contact already exists"
    const val MOBILE_PERSONA_NAME = "MobileName"
    const val MOBILE_PERSONA_SUB_NAME = "MobileSubName"
    const val STUDY_SUBJECT_ID = "studySubjectId"
    const val STUDY_HOSPITAL_ID = "studyHospitalId"
    const val STUDY_HOSPITAL_NAME = "studyHospitalName"
    const val PULSE_RANGE_UNIT = 10 // 心拍数の最大・最小値を取得する時間の範囲[0...1分 (1分間隔)]
    const val WORK_DO_UNIT:Long = 15 // Workerの実行間隔[15分間隔]
    const val PULSE_ZERO = 0 // 心拍数の最小値
    const val E_SIGN_EXPLAIN = "E" // esign_status：説明
    const val E_SIGN_CONSENT = "C" // esign_status：同意
    const val E_SIGN_WITHDRAW = "" // esign_status：撤回(nullなので、空文字列に変換して対応)
    const val IC_TYPE_FIRST_CONSENT = "IC" // ic_type：同意
    const val IC_TYPE_RE_CONSENT = "RI" // ic_type：再同意
    const val IC_TYPE_WITHDRAW = "WI" // ic_type：撤回
    const val EXPLAIN = "説明" // esign_status：説明
    const val CONSENT = "同意" // esign_status：同意
    const val RE_CONSENT = "再同意" // esign_status：同意
    const val WITHDRAW = "撤回" // esign_status：撤回(nullなので、空文字列に変換して対応)
    const val HISTORY_DOC_COL_SIZE = 5 // 同意履歴文書のカラム数
    const val DOC_LIST_COL_SIZE = 2 // 同意済み文書リストのカラム数
    const val DOC_DOWNLOAD_TMP_DIR = "/document" // 同意済み文書リストの一時保存パス
    const val FILE_SIZE_1K = 1024 // 1K byteサイズ
    const val FILE_SIZE_1K_1M = 1024 * 1024 // 1M byteサイズ
    const val BUFFER_SIZE_FOR_LESS_1K = 1024 // 1kバッファサイズ
    const val BUFFER_SIZE_FOR_LESS_1M = 4096 // 1Kから1M用バッファサイズ
    const val BUFFER_SIZE_FOR_OVER_1M = 16384 // 1M超のバッファサイズ
    const val MIME_TYPE_PDF = "application/pdf" // PDFのMIMEタイプ
    const val MAX_LOOP_WAITING_APPROVAL = 50 // 最大
    const val FIVE_SECONDS = 5000L // 5秒
    const val TEN_SECONDS = 10000L // 10秒
    const val FALSE_STRING = "0" // falseの文字列
    const val TRUE_STRING = "1" // trueの文字列
    const val DELETE_MONTHS : Long = 1 // encrypt_data_tableのデータを削除する月数
    // StudySubjectStatus
    const val BEFORE_IC_STATUS = "I"
    const val ON_GOING_STATUS = "O"
    const val DISCONTINUATION_STATUS = "D"
    const val COMPLETE_STATUS = "C"

    // 表示用
    const val COLON = " : "
    const val SUBJECT = "(被験者)"
    const val HYPHEN = "-"


    //Room
    const val DATABASE_NAME = "trust_app_database.db"
    const val ENCRYPT_DATA_TABLE = "encrypt_data_table"
    const val FITBIT_TOKEN_TABLE = "fitbit_token_table"
    const val STUDY_SUBJECT_TABLE = "study_subject_table"
    const val DEVICE_TABLE = "device_table"
    const val ROOM_BOOLEAN_TRUE = 1 // true:roomではハードコードでTRUEを記述できないので、1を使用する
    const val ROOM_BOOLEAN_FALSE = 0 // true:roomではハードコードでFALSEを記述できないので、0を使用する
    // デバイス情報
    const val TIC_WATCH_E3_ID = 1   // Tic watch E3のID
    const val FITBIT_ID = 2         // FitbitのID
    /// アクティビティ
    const val TIC_WATCH_E3_PULSE_ACTIVITY_ID = 1 // Tic watch E3の心拍数のアクティビティID
    const val FITBIT_PULSE_ACTIVITY_ID = 2    // Fitbitの心拍数のアクティビティID
    const val TIC_WATCH_E3_STEP_ACTIVITY_ID = 3 // Tic watch E3の歩数のアクティビティID
    const val FITBIT_ID_STEP_ACTIVITY_ID = 4    // Fitbitの歩数のアクティビティID
    const val STEP = "step" // 歩数
    const val PULSE = "pulse" // 心拍数
    /// データ種別
    const val LINE_GRAPH_TYPE_ID = 1     // 線グラフ
    const val BAR_GRAPH_TYPE_ID = 2     // 棒グラフ
    const val TABLE_TYPE_ID = 3        // 表
    const val LINE_GRAPH_TYPE_NAME = "線グラフ"     // 線グラフ
    const val BAR_GRAPH_TYPE_NAME = "棒グラフ"     // 棒グラフ
    const val TABLE_TYPE_NAME = "表"        // 表

    // データ送受信パス
    private const val WATCH_PATH = "/watch"                 // 送信先(ウェアラブル)のノードのパス
    private const val MOBILE_PATH = "/mobile"               // 受信(スマホ)のノードのパス
    private const val DEVICE_TIC_WATCH = "/tic_watch_e3"    // デバイス(Tic watch E3)のパス
    private const val DEVICE_FITBIT = "/fitbit"             // デバイス(Fitbit)のパス
    private const val HEART_RATE_PATH = "/heartRate"        // 心拍数のデータアイテムのパス
    private const val STEP_PATH = "/step"                   // 歩数のデータアイテムのパス
    const val MOBILE_TIC_WATCH_E3_HEART_RATE = MOBILE_PATH + DEVICE_TIC_WATCH + HEART_RATE_PATH
    const val MOBILE_TIC_WATCH_E3_STEP = MOBILE_PATH + DEVICE_TIC_WATCH + STEP_PATH
    const val MOBILE_FITBIT_HEART_RATE = MOBILE_PATH + DEVICE_FITBIT + HEART_RATE_PATH
    const val MOBILE_FITBIT_STEP = MOBILE_PATH + DEVICE_FITBIT + STEP_PATH
    const val HEART_RATE_KEY = "heart_rate"
    const val STEP_KEY = "step"
    const val URI_KEY = "self_uri"
    const val URI_NAME_KEY = "self_uri_name"
    const val URI_SUB_NAME_KEY = "self_uri_sub_name"

    private const val URI_PATH = "/uri"
    const val RECEIVE_URI = MOBILE_PATH + URI_PATH  // ペアリングするURIのデータアイテムのパス
    const val SEND_URI = WATCH_PATH + URI_PATH      // 自分のURIの送信先パス
}
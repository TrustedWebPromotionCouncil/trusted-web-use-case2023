package com.example.wearable.trustapp.biowatcher.common

object Constants {
    const val ALL = "ALL"
    const val SENDER_ID = "senderId"
    const val RECEIVER_ID = "receiverId"
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
    const val WATCH_PERSONA_NAME = "watchName"
    const val WATCH_PERSONA_SUB_NAME = "watchSubName"
    const val DELETE_MONTHS : Long = 1 // 心拍数のデータを削除する月数

    // 表示用
    const val COLON = " : "

    //Room
    const val DATABASE_NAME = "trust_app_database.db"
    const val STEP_TABLE = "step"
    const val HEART_RATE_TABLE = "heart_rate"

    //Screens
    const val BOOKS_SCREEN = "Books"
    const val UPDATE_BOOK_SCREEN = "Update book"

    //Arguments
    const val BOOK_ID = "bookId"

    //Actions
    const val ADD_BOOK = "Add a book."
    const val DELETE_BOOK = "Delete a book."

    //Buttons
    const val ADD_BUTTON = "Add"
    const val DISMISS_BUTTON = "Dismiss"
    const val UPDATE_BUTTON = "Update"

    //Placeholders
    const val BOOK_TITLE = "Type a book title..."
    const val AUTHOR = "Type the author name..."
    const val EMPTY_STRING = ""

    // SensorService:心拍数
//    const val PULSE_RANGE_UNIT = 10 // 心拍数の最大・最小値を取得する時間の範囲[0...9分 (10分間隔)]
    const val PULSE_RANGE_UNIT = 10 // 心拍数の最大・最小値を取得する時間の範囲[0...1分 (1分間隔)]
    const val WORK_DO_UNIT:Long = 15 // Workerの実行間隔[15分間隔]
    const val PULSE_ZERO = 0 // 心拍数の最小値

    // データ送受信パス
    private const val WATCH_PATH = "/watch"                 // 送信先(ウェアラブル)のノードのパス
    private const val MOBILE_PATH = "/mobile"               // 受信(スマホ)のノードのパス
    private const val DEVICE_TIC_WATCH = "/tic_watch_e3"    // デバイス(Tic watch E3)のパス
    private const val DEVICE_FITBIT = "/fitbit"             // デバイス(Fitbit)のパス
    private const val HEART_RATE_PATH = "/heartRate"        // 心拍数のデータアイテムのパス
    private const val STEP_PATH = "/step"                   // 歩数のデータアイテムのパス
    const val MOBILE_TIC_WATCH_E3_HEART_RATE_PATH = MOBILE_PATH + DEVICE_TIC_WATCH + HEART_RATE_PATH
    const val MOBILE_TIC_WATCH_E3_STEP_PATH = MOBILE_PATH + DEVICE_TIC_WATCH + STEP_PATH
    const val MOBILE_FITBIT_HEART_RATE_PATH = MOBILE_PATH + DEVICE_FITBIT + HEART_RATE_PATH
    const val MOBILE_FITBIT_STEP_PATH = MOBILE_PATH + DEVICE_FITBIT + STEP_PATH
    const val HEART_RATE_KEY = "heart_rate"
    const val STEP_KEY = "step"
    const val URI_KEY = "self_uri"
    const val URI_NAME_KEY = "self_uri_name"
    const val URI_SUB_NAME_KEY = "self_uri_sub_name"

    private const val URI_PATH = "/uri"
    const val RECEIVE_URI = WATCH_PATH + URI_PATH   // ペアリングするURIのデータアイテムのパス
    const val SEND_URI = MOBILE_PATH + URI_PATH     // 自分のURIの送信先パス
}

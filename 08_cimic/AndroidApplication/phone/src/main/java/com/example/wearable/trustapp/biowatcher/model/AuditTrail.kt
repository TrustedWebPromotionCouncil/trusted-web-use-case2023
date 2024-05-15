package com.example.wearable.trustapp.biowatcher.model

import android.content.Context

data class AuditTrail (
    val context: Context,
    val studySubjectIdList: List<String>,
    var action: AuditAction? = null,
    var contactListString: String,    // [{contactのName}, {contactのName}, ...]
    var fileName: String      // file_name: 同意の時：ファイル名、ウェアラブルデータ：[study_device_id]-[送信日時]
)
enum class AuditAction {
    SignedAndEncrypted,
    DecryptedAndVerified
}

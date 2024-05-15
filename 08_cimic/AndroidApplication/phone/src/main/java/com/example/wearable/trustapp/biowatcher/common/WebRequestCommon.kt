package com.example.wearable.trustapp.biowatcher.common

import android.content.Context
import android.util.Log
import com.example.wearable.trustapp.biowatcher.model.AuditAction
import com.example.wearable.trustapp.biowatcher.model.AuditTrail
import com.example.wearable.trustapp.biowatcher.service.WebRequestService
import kotlinx.coroutines.CompletableDeferred

class WebRequestCommon(private val context: Context) {
    suspend fun getDeviceMater(): WebResponseData.DeviceMaster {
        val funName = object {}.javaClass.enclosingMethod.name

        Log.i(TAG, "$funName Start")
        var deviceMaster: WebResponseData.DeviceMaster =
            WebResponseData.DeviceMaster(listOf(), listOf())
        val deferred = CompletableDeferred<WebResponseData.DeviceMaster>() // 結果を保持するためのDeferredを作成
        try {
            val request = RequestDataList().getRequestData(
                RequestDataList.RequestDataKind.DeviceMaster,
                arrayOf(),
                mapOf()
            )
            WebRequestService(context).requestSaveData(
                webRequestData = request
            ) { it ->
                try {
                    Log.d(TAG, "callback: $it")
                    if (!Util.isValidResponseJsonString(it)) {
                        Log.w(TAG, "DeviceMaster is not found")
                    } else {
                        deviceMaster = Util.jsonDecode(it)
                    }
                } catch (e: Exception) {
                    Log.e(TAG, "$funName : $e")
                } finally {
                    deferred.complete(deviceMaster)
                }
            }
        } catch (e: Exception) {
            Log.e(TAG, "$funName : $e")
            deferred.complete(deviceMaster)
        }
        deferred.await() // 結果が返るまで待機
        Log.i(TAG, "$funName End")
        return deferred.getCompleted()
    }

    suspend fun getEncryptData(
        studySubjectId: String,
        activityId: String,
        dateFrom: String,
        dateTo: String
    ): List<WebResponseData.EncryptData> {
        val funName = object {}.javaClass.enclosingMethod.name

        Log.i(TAG, "$funName Start")
        var encryptDataList: List<WebResponseData.EncryptData> = listOf()
        val deferred =
            CompletableDeferred<List<WebResponseData.EncryptData>>() // 結果を保持するためのDeferredを作成
        try {
            val request = RequestDataList().getRequestData(
                RequestDataList.RequestDataKind.DeviceDataList,
                arrayOf(studySubjectId, activityId, dateFrom, dateTo),
                mapOf()
            )
            Log.i(TAG, "request : $request")
            WebRequestService(context).requestSaveData(
                webRequestData = request
            ) { it ->
                try {
                    Log.d(TAG, "callback: $it")
                    if (!Util.isValidResponseJsonString(it)) {
                        Log.w(TAG, "DeviceData is not found")
                    } else {
                        encryptDataList = Util.jsonDecode(it)
                    }
                } catch (e: Exception) {
                    Log.e(TAG, "$funName : $e")
                } finally {
                    deferred.complete(encryptDataList)
                }
            }
        } catch (e: Exception) {
            Log.e(TAG, "$funName : $e")
            deferred.complete(encryptDataList)
        }
        deferred.await() // 結果が返るまで待機
        Log.i(TAG, "$funName End")
        return deferred.getCompleted()
    }

    // 監査証跡を残す
    fun writeAuditLog(
        auditTrail: AuditTrail,
    ) {
        Log.i(TAG, "writeAuditLog Start")
        try {
            auditTrail.studySubjectIdList.forEach { studySubjectId ->
                val contactListString = if (auditTrail.action!! == AuditAction.SignedAndEncrypted)
                    auditTrail.contactListString else Constants.HYPHEN
                val request = RequestDataList().getRequestData(
                    RequestDataList.RequestDataKind.WriteAuditTrail,
                    arrayOf(),
                    mapOf(
                        "study_subject_id" to studySubjectId,
                        "name" to Constants.MOBILE_PERSONA_NAME,
                        "sub_name" to Constants.MOBILE_PERSONA_SUB_NAME,
                        "action" to getAuditAction(auditTrail.action!!),
                        "contact_list" to contactListString,
                        "file_name" to auditTrail.fileName,
                    )
                )
                Log.d(TAG, "study_subjects_id: $studySubjectId")
                Log.d(TAG, "name: ${Constants.MOBILE_PERSONA_NAME}")
                Log.d(TAG, "sub_name: ${Constants.MOBILE_PERSONA_SUB_NAME}")
                Log.d(TAG, "action: ${getAuditAction(auditTrail.action!!)}")
                Log.d(TAG, "contact_list: $contactListString")
                Log.d(TAG, "file_name: ${auditTrail.fileName}")
                WebRequestService(context).requestSaveData(
                    webRequestData = request
                ) {
                    Log.d(TAG, "callback: $it")
                    if (!Util.isValidResponseJsonString(it)) {
                        Log.w(TAG, "WriteAuditLog is empty")
                        return@requestSaveData
                    }
                    val booleanResponse: WebResponseData.BooleanResponse = Util.jsonDecode(it)
                    booleanResponse?.let { document ->
                        if (document.result.lowercase() != "true") {
                            Log.w(TAG, "WriteAuditLog is not success")
                        }
                    }
                }
            }
        } catch (e: Exception) {
            Log.e(TAG, "WriteAuditLog : $e")
        }
        Log.i(TAG, "writeAuditLog End")
    }

    private fun getAuditAction(action: AuditAction): String {
        return when (action) {
            AuditAction.SignedAndEncrypted -> "SignedAndEncrypted"
            AuditAction.DecryptedAndVerified -> "DecryptedAndVerified"
        }
    }


    // ログ用オブジェクト
    companion object {
        private const val TAG = "WebRequestWrapper"
    }
}


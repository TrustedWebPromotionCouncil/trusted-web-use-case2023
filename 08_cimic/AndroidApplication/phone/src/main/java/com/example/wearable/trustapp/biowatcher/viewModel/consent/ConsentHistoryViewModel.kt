package com.example.wearable.trustapp.biowatcher.viewModel.consent

import android.app.Application
import android.util.Log
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.SavedStateHandle
import com.example.wearable.trustapp.biowatcher.common.Constants
import com.example.wearable.trustapp.biowatcher.common.Constants.CONSENT
import com.example.wearable.trustapp.biowatcher.common.Constants.EXPLAIN
import com.example.wearable.trustapp.biowatcher.common.Constants.E_SIGN_CONSENT
import com.example.wearable.trustapp.biowatcher.common.Constants.E_SIGN_EXPLAIN
import com.example.wearable.trustapp.biowatcher.common.Constants.E_SIGN_WITHDRAW
import com.example.wearable.trustapp.biowatcher.common.Constants.HISTORY_DOC_COL_SIZE
import com.example.wearable.trustapp.biowatcher.common.Constants.SUBJECT
import com.example.wearable.trustapp.biowatcher.common.Constants.WITHDRAW
import com.example.wearable.trustapp.biowatcher.common.RequestDataList
import com.example.wearable.trustapp.biowatcher.common.Util.Companion.isValidResponseJsonString
import com.example.wearable.trustapp.biowatcher.common.Util.Companion.jsonDecode
import com.example.wearable.trustapp.biowatcher.common.Util.Companion.toYYYYMMDDString
import com.example.wearable.trustapp.biowatcher.common.WebResponseData
import com.example.wearable.trustapp.biowatcher.service.WebRequestService
import com.example.wearable.trustapp.mobile.BaseApplication


class ConsentHistoryViewModel(
    application: Application,
    savedStateHandle: SavedStateHandle,
) : MainViewModel(application) {
    private val studySubjectId: String = checkNotNull(savedStateHandle[Constants.STUDY_SUBJECT_ID])

    // コンテキスト
    val context = getApplication<BaseApplication>().applicationContext

    // ドキュメント履歴フラグ(履歴があるか判定フラグ)
    private val _doumentHistoryFlg: MutableLiveData<Boolean> = MutableLiveData(false)
    val documentHistoryFlg: LiveData<Boolean> = _doumentHistoryFlg

    // 同意履歴文書一覧：列数・行数
    private var _columnCount: Int = HISTORY_DOC_COL_SIZE
    private var _rowCount: Int = 0
    val columnCount: Int get() = _columnCount
    val rowCount: Int get() = _rowCount

    // 文書履歴一覧のカラム名
    val documentColumnName get() = arrayOf("同意回数", "アクション", "日付", "署名者", "該当文書")

    private val _documentListArray: MutableList<Array<String>> = mutableListOf()
    val documentListArray: MutableList<Array<String>>
        get() = _documentListArray

    init {
        Log.d(TAG, "init Start")
        // 同意文書履歴一覧のセット
        initWrap()

        Log.i(TAG, "init End")
    }

    fun initWrap() {
        // 同意文書履歴一覧のセット
        setConsentHistoryDocumentList()
    }

    // 同意文書履歴一覧のセット
    private fun setConsentHistoryDocumentList() {
        val request = RequestDataList().getRequestData(
            RequestDataList.RequestDataKind.DocumentHistoryList,
            arrayOf(studySubjectId),
            mapOf()
        )
        WebRequestService(context).requestSaveData(
            webRequestData = request
        ) {
            try {
                //    val fileId1 = "1365042892200"    // GNU PDF - GNU Project - Free Software Foundation.pdf
                Log.d(TAG, "callback: $it")
                if (!isValidResponseJsonString(it)) {
                    Log.w(TAG, "setConsentHistoryDocumentList is not found")
                    return@requestSaveData
                }

                _documentListArray.clear()
                val documentList: List<WebResponseData.ConsentHistoryDocument> = jsonDecode(it)
                //_documentListArrayに変換する
                var count = 1
                Log.d(TAG, "documentList: $documentList")
                documentList.sortedBy { it.updated }.forEach { document ->
                    Log.d(TAG, "document: $document")
                    document.icType == Constants.IC_TYPE_WITHDRAW
                    val no = count++.toString()
                    var action = ""
                    var eSignSigner = ""
                    when (document.eSignStatus ?: "") {
                        E_SIGN_WITHDRAW -> {
                            action = WITHDRAW  // 撤回
                            eSignSigner = ""
                        }

                        E_SIGN_EXPLAIN -> {
                            action = EXPLAIN
                            eSignSigner = document.eSignSigner?.name ?: ""
                        }

                        E_SIGN_CONSENT -> {
                            action = CONSENT
                            eSignSigner = SUBJECT
                        }
                    }
                    val eSignDate = toYYYYMMDDString(document.updated ?: "")
                    val documentName = document.icSignDocNm ?: ""
                    _documentListArray.add(
                        arrayOf(
                            no,
                            action,
                            eSignDate,
                            eSignSigner,
                            documentName
                        )
                    )
                }
                _columnCount = _documentListArray[0].size
                _rowCount = _documentListArray.size
                _doumentHistoryFlg.postValue(true)
            } catch (e: Exception) {
                Log.e(TAG, "setConsentHistoryDocumentList error : $e")
            }
        }
        Log.d(TAG, "_documentListArray: $_documentListArray")
    }

    // ログ用オブジェクト
    companion object {
        private const val TAG = "ConsentHistoryViewModel"
    }
}

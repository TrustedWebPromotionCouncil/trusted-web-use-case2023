package com.example.wearable.trustapp.biowatcher.service

import android.content.Context
import android.os.Handler
import android.os.Looper
import android.util.Log
import com.box.sdk.BoxCCGAPIConnection
import com.box.sdk.BoxFile
import com.box.sdk.BoxFolder
import com.example.wearable.trustapp.R
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.launch
import java.io.File
import java.io.FileOutputStream
import java.io.InputStream
import java.util.concurrent.Executors
import com.example.wearable.trustapp.BuildConfig


// Mainthreadではないスレッドで実行する
// ここではBoxFileの取得を行う
class BoxService(private val context: Context) {
    private val clientId = BuildConfig.BOX_CLIENT_ID
    private val clientSecret = BuildConfig.BOX_CLIENT_SECRET
    private val userId = BuildConfig.BOX_USER_ID

    // コルーチン
    private val job = SupervisorJob()
    private val scope = CoroutineScope(Dispatchers.IO + job)

    fun fileGet(
        fileId: String,
        downloadDirectoryPath: String = context.cacheDir.toString(),
        // InputStreamをcallbackする
        callback: (String) -> Unit
    ) {
        Log.i(TAG, "fileGet START")
        try {
            // ユーザートークンの取得
            val api = BoxCCGAPIConnection.userConnection(
                clientId,
                clientSecret,
                userId
            )

            scope.launch {
                try {
                    val file = BoxFile(api, fileId)

                    //downloadDirectoryPathのディレクトリが存在するか、しない場合フォルダを作成する
                    val downloadDirectory = File(downloadDirectoryPath)
                    if (!downloadDirectory.exists()) {
                        downloadDirectory.mkdirs()
                    }

                    val info = file.getInfo()
                    val downloadFilePath = downloadDirectoryPath + "/" + info.name
                    val stream = FileOutputStream(downloadFilePath)
                    file.download(stream)
                    stream.close()
                    callback(downloadFilePath)  // ダウンロードパスをcallback
                } catch (e: Exception) {
                    Log.e(TAG, "fileGet BoxAPI error : $e")
                    callback("")
                }
            }
//            }
        } catch (e: Exception) {
            Log.e(TAG, "fileGet error : $e")
            callback("")
        }
        Log.i(TAG, "fileGet END")
    }

    fun fileUpload(
        inputFileStream: InputStream,
        uploadFileName: String,
        uploadFolderId: String,
        callback: (String) -> Unit
    ) {
        Log.i(TAG, "fileUpload START")
        var uploadFileId = ""
        try {
            val api = BoxCCGAPIConnection.userConnection(
                clientId,
                clientSecret,
                userId
            )
            scope.launch {
                try {
                    val folder = BoxFolder(api, uploadFolderId)
                    val stream = inputFileStream
                    val newFileInfo = folder.uploadFile(stream, uploadFileName)
                    uploadFileId = newFileInfo.id
                    Log.i(TAG, "fileUpload uploadFileId: $uploadFileId")
                    stream.close()
                    callback(uploadFileId)
                } catch (e: Exception) {
                    Log.e(TAG, "fileUpload error : $e")
                    callback("")
                }
            }
        } catch (e: Exception) {
            Log.e(TAG, "fileUpload error : $e")
            callback("")
        }
        Log.i(TAG, "fileUpload END")
    }

    fun readFile(fileName: String): String {
        var text = ""

        try {
            val inputStream = context.assets.open(fileName)
            text = inputStream.bufferedReader().use {
                it.readText()
            }
        } catch (e: Exception) {
            // エラー処理
        }
        return text
    }

    // ログ用オブジェクト
    companion object {
        private const val TAG = "BoxService"
    }
}

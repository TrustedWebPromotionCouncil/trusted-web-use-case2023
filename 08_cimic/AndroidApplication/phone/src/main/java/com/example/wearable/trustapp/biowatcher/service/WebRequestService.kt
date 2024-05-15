package com.example.wearable.trustapp.biowatcher.service

import android.content.Context
import android.util.Log
import com.example.wearable.trustapp.biowatcher.common.RequestKind
import com.example.wearable.trustapp.biowatcher.common.Util
import com.example.wearable.trustapp.biowatcher.common.WebRequestData
import okhttp3.Call
import okhttp3.Callback
import okhttp3.ConnectionPool
import okhttp3.Headers
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody
import okhttp3.RequestBody.Companion.toRequestBody
import okhttp3.Response
import java.io.IOException
import java.net.URLEncoder


class WebRequestService(private val context: Context) {
    private val client = OkHttpClient.Builder()
        .connectionSpecs(listOf(okhttp3.ConnectionSpec.RESTRICTED_TLS, okhttp3.ConnectionSpec.MODERN_TLS))
        .connectTimeout(30, java.util.concurrent.TimeUnit.SECONDS)
        .readTimeout(30, java.util.concurrent.TimeUnit.SECONDS)
        .writeTimeout(30, java.util.concurrent.TimeUnit.SECONDS)
        .build()

    private val JSON_MEDIA_TYPE = "application/json; charset=utf-8"
    private val EMPTY_JSON_BODY = "{}"
    private val EMPTY_STR_BODY = ""

    fun requestSaveData(
        webRequestData: WebRequestData,
        callback: (String) -> Unit
    ) {
        val requestUrl = createRequestUrl(webRequestData)
        val requestBody = createRequestBody(webRequestData)
        var request =
            createRequest(webRequestData.kind, requestUrl, requestBody, webRequestData.headers)
        // no-cacheを付与する
        request = request.newBuilder().addHeader("Cache-Control", "no-cache").build()
        client.newCall(request).enqueue(object : Callback {
            override fun onFailure(call: Call, e: IOException) {
                Log.e(TAG, "Error requestUrl : $requestUrl")
                e.printStackTrace()
                callback("[]")
            }

            override fun onResponse(call: Call, response: Response) {
                Log.i(TAG, "Success onResponse Start")
                Log.d(TAG, "requestUrl: $requestUrl")
                try {
                    response.use {
                        if (!response.isSuccessful) {
                            Log.e(TAG, "Response is not success.")
                            throw IOException("Unexpected code $response")
                        }
                        val responseBody = response.body?.string().orEmpty()
                        callback(responseBody)
                    }
                } catch (e: Exception) {
                    Log.e(TAG, "Error requestUrl : $requestUrl")
                    e.printStackTrace()
                    callback("[]")
                }
                Log.i(TAG, "Success onResponse End")
            }
        })
    }


    private inline fun createGetRequest(
        url: String,
        headers: Headers
    ): Request {
        return Request.Builder().url(url).get().headers(headers).build()
    }

    private inline fun createPostRequestBody(
        url: String,
        requestBody: RequestBody,
        headers: Headers
    ): Request {
        return Request.Builder().url(url).post(requestBody).headers(headers).build()
    }

    private inline fun createPatchRequestBody(url: String, requestBody: RequestBody): Request {
        return Request.Builder().url(url).patch(requestBody).build()
    }

    private inline fun createDeleteRequestBody(url: String, requestBody: RequestBody): Request {
        return Request.Builder().url(url).delete(requestBody).build()
    }

    private inline fun createRequestUrl(webRequestData: WebRequestData): String {
        val queryString = createUrlQueryString(webRequestData.queryData)
        val url = createUrlStringFormat(webRequestData.apiUrl, webRequestData.urlStrReplace)
        Log.d(TAG, "RequestURL : $url$queryString")
        return "$url$queryString"
    }

    private fun createUrlStringFormat(apiUrl: String, urlStrReplace: Array<String>): Any {
        // apiUrlをformatで置換する
        return if (urlStrReplace.isEmpty()) {
            apiUrl
        } else {
            apiUrl.format(*urlStrReplace)
        }
    }

    private fun createRequestBody(webRequestData: WebRequestData): RequestBody {
        // requestData.listDataをjsonに変換する
        return if (!webRequestData.urlEncodeFlg) {
            if (webRequestData.bodyData == null) {
                EMPTY_JSON_BODY.toRequestBody(JSON_MEDIA_TYPE.toMediaType())
            } else {
                val jsonData = Util.jsonEncode(webRequestData.bodyData)
                jsonData.toRequestBody(JSON_MEDIA_TYPE.toMediaType())
            }
        } else {
            // fitbitのトークン取得時、json形式で送信するとエラーになるため、application/x-www-form-urlencoded形式に変換する
            if (webRequestData.bodyData == null) {
                EMPTY_STR_BODY.toRequestBody()
            } else {
                var mapDataString = webRequestData.bodyData.map { (key, value) ->
                    URLEncoder.encode(key, "UTF-8") + "=" + URLEncoder.encode(value, "UTF-8")
                }.joinToString("&")
                mapDataString.toRequestBody()
            }
        }
    }

    // URLクエリパラメータを作成する
    private fun createUrlQueryString(
        mapData: Map<String, String>,
    ): String {
        var retString = ""
        var flg = true
        mapData.forEach() {
            retString = it.key + "=" + it.value
            retString = if (flg) {
                "?$retString"   // 最初の要素の場合は?をつける
            } else {
                "&$retString"   // 2番目以降の要素の場合は&をつける
            }
            flg = false
        }
        return retString
    }

    private fun createRequest(
        kind: RequestKind,
        url: String,
        requestBody: RequestBody,
        headers: Headers? = Headers.Builder().build()
    ): Request {
        val headers = headers ?: Headers.Builder().build()
        when (kind) {
            RequestKind.GET -> {
                return createGetRequest(url, headers)
            }

            RequestKind.POST -> {
                return createPostRequestBody(url, requestBody, headers)
            }

            RequestKind.PATCH -> {
                return createPatchRequestBody(url, requestBody)
            }

            RequestKind.DELETE -> {
                return createDeleteRequestBody(url, requestBody)
            }
        }
    }


    companion object {
        private val TAG: String = "WebRequestService"
    }

}

/*
 * Copyright 2021 The Android Open Source Project
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package com.example.wearable.trustapp.biowatcher.service

import android.util.Log
import com.example.wearable.trustapp.biowatcher.common.Constants.RECEIVE_URI
import com.example.wearable.trustapp.biowatcher.common.Constants.URI_KEY
import com.example.wearable.trustapp.biowatcher.common.Constants.URI_NAME_KEY
import com.example.wearable.trustapp.biowatcher.common.Constants.URI_SUB_NAME_KEY
import com.example.wearable.trustapp.mobile.BaseApplication
import com.google.android.gms.wearable.CapabilityInfo
import com.google.android.gms.wearable.DataEventBuffer
import com.google.android.gms.wearable.DataMapItem
import com.google.android.gms.wearable.MessageEvent
import com.google.android.gms.wearable.Wearable
import com.google.android.gms.wearable.WearableListenerService

/**
 * A state holder for the client data.
 */
class DataListenerService : WearableListenerService() {

    private val dataClient by lazy { Wearable.getDataClient(this) }
    private var gatewayService: GatewayService? = null
    // gatewayサービス

    init {
        Log.i(TAG, "init Start")
        Log.i(TAG, "init End")
    }

    override fun onDataChanged(dataEvents: DataEventBuffer) {
        Log.i(TAG, "onDataChanged START")
        super.onDataChanged(dataEvents)
        // gatewayサービス
        gatewayService = (applicationContext as BaseApplication).gatewayService

        try {

            dataEvents.forEach { dataEvent ->
                val itemUri = dataEvent.dataItem.uri
                when (itemUri.path) {
                    // モバイルURIとペアリングする
                    RECEIVE_URI -> {
                        Log.d(TAG, "MOBILE_URI")

                        // URI文字列を取得
                        val personaUri =
                            DataMapItem.fromDataItem(dataEvent.dataItem).dataMap.getString(
                                URI_KEY
                            ) ?: ""
                        val personaName =
                            DataMapItem.fromDataItem(dataEvent.dataItem).dataMap.getString(
                                URI_NAME_KEY
                            ) ?: ""
                        val personaSubName =
                            DataMapItem.fromDataItem(dataEvent.dataItem).dataMap.getString(
                                URI_SUB_NAME_KEY
                            ) ?: ""
                        Log.d(TAG, "URI_KEY : $personaUri")
                        Log.d(TAG, "URI_NAME_KEY : $personaName")
                        Log.d(TAG, "URI_SUB_NAME_KEY : $personaSubName")
                        if (gatewayService?.isMatre() == true) {
                            gatewayService!!.createContact(personaUri, personaName, personaSubName)
                        }
                    }

                    else -> {
                        if (itemUri.path != null) {
                            Log.d(TAG, "Unknown path: ${itemUri.path}")
                        } else {
                            Log.d(TAG, "Unknown path: null")
                        }
                    }
                }
                // 受信したデータを削除する。
                // もう一度、onDataChangedが呼ばれるが、これをしないと変更がなかった場合
                // (同じpersonaURIが届いた、など)、受信しなくなってしまうので必要。
                dataClient.deleteDataItems(itemUri)
            }
        } catch (e: Exception) {
            Log.d(TAG, "Exception onDataChanged() : ${e.message}")
        }

        Log.i(TAG, "onDataChanged END")
    }

    // スマホからURIを受信したときに呼び出される
    override fun onMessageReceived(event: MessageEvent) {
        Log.d(TAG, "onMessageReceived")

        super.onMessageReceived(event)
    }

    // CapabilityClient から機能の変更を受信したときに呼び出される
    override fun onCapabilityChanged(capabilityInfo: CapabilityInfo) {
        Log.d(TAG, "onCapabilityChanged")
        super.onCapabilityChanged(capabilityInfo)
    }

    // Channel が閉じられたときに呼び出される
    override fun onChannelClosed(
        channel: com.google.android.gms.wearable.Channel,
        closeReason: Int,
        appSpecificErrorCode: Int
    ) {
        Log.d(TAG, "onChannelClosed")
        super.onChannelClosed(channel, closeReason, appSpecificErrorCode)
    }

    // Channel が開かれたときに呼び出される
    override fun onChannelOpened(channel: com.google.android.gms.wearable.Channel) {
        Log.d(TAG, "onChannelOpened")
        super.onChannelOpened(channel)
    }

    companion object {
        private const val TAG = "DataLayerListenerService"
        private const val mobileFirstName = "/mobileFirstName"
        private const val mobileLastName = "/mobileLastName"
    }
}


package com.example.wearable.trustapp.biowatcher.worker

import android.app.NotificationChannel
import android.app.NotificationManager
import android.content.Context
import android.os.Build
import android.util.Log
import androidx.work.Worker
import androidx.work.WorkerParameters
import com.example.wearable.trustapp.biowatcher.common.Constants.MOBILE_TIC_WATCH_E3_HEART_RATE_PATH
import com.example.wearable.trustapp.biowatcher.domain.entity.HeartRate
import com.example.wearable.trustapp.biowatcher.domain.entity.Step
import com.example.wearable.trustapp.biowatcher.domain.repository.HeartRateRepository
import com.example.wearable.trustapp.biowatcher.domain.repository.StepRepository
import com.example.wearable.trustapp.biowatcher.infrastructure.network.AppDatabase
import com.example.wearable.trustapp.biowatcher.infrastructure.repository.HeartRateRepositoryImpl
import com.example.wearable.trustapp.biowatcher.infrastructure.repository.StepRepositoryImpl
import com.example.wearable.trustapp.biowatcher.service.HeartRateData
import com.example.wearable.trustapp.biowatcher.service.SensorEventsService
import com.example.wearable.trustapp.biowatcher.service.SensorEventsService.Companion.heartRateDatas
import com.example.wearable.trustapp.biowatcher.service.StepData
import com.example.wearable.trustapp.biowatcher.common.Util
import com.example.wearable.trustapp.biowatcher.common.Util.Companion.getTodayDateTime
import com.example.wearable.trustapp.biowatcher.common.Constants.MOBILE_TIC_WATCH_E3_STEP_PATH
import com.example.wearable.trustapp.biowatcher.common.Constants.URI_NAME_KEY
import com.example.wearable.trustapp.biowatcher.common.Constants.URI_KEY
import com.example.wearable.trustapp.biowatcher.common.Constants.URI_SUB_NAME_KEY
import com.example.wearable.trustapp.biowatcher.common.Constants.SEND_URI
import com.example.wearable.trustapp.mobile.BaseApplication
import com.google.android.gms.wearable.PutDataMapRequest
import com.google.android.gms.wearable.Wearable
import kotlinx.coroutines.CancellationException
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.launch
import kotlinx.coroutines.tasks.await

class WorkerManage(cxt: Context, params: WorkerParameters) : Worker(cxt, params) {
    val notificationManager =
        applicationContext.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager

    // カテゴリー名（通知設定画面に表示される情報）
    val name = "wokerの通知"

    // システムに登録するChannelのID
    val id = "wearable_worker_channel_id"

    // 通知の詳細情報（通知設定画面に表示される情報）
    val notifyDescription = "生体情報の登録を行います"

    // DB
    private var stepRepository: StepRepository? = null
    private var heartRateRepository: HeartRateRepository? = null

    // gatewayサービス
    private var gatewayService: GatewayService? =
        (applicationContext as BaseApplication).gatewayService

    // コルーチン
    private val job = SupervisorJob()
    private val scope = CoroutineScope(Dispatchers.IO + job)

    private val dataClient by lazy { Wearable.getDataClient(cxt) }          // データ交換用
    private val messageClient by lazy { Wearable.getMessageClient(cxt) }    // URI交換用メッセージ

    init {
        Log.i(TAG, "MyWorker() START")
        // Channelの取得と生成
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            notificationManager.getNotificationChannel(id) == null
            val mChannel = NotificationChannel(id, name, NotificationManager.IMPORTANCE_HIGH)
            mChannel.apply {
                description = notifyDescription
            }
            notificationManager.createNotificationChannel(mChannel)
        }
        // リポジトリ取得(シングルトン)
        heartRateRepository = HeartRateRepositoryImpl(
            AppDatabase.getInstance(cxt).heartRateDao()
        )
        stepRepository = StepRepositoryImpl(
            AppDatabase.getInstance(cxt).stepDao()
        )

        Log.i(TAG, "MyWorker() END")
    }

    override fun doWork(): Result {
        Log.i(TAG, "doWork() START")

        // gatewayサービス
        gatewayService = (applicationContext as BaseApplication).gatewayService

        val today = Util.getToday()
        val todayStr = Util.getStringOfYYYYMMDD(today)  // yyyy/MM/dd

        // 自分のURI送信
        sendSelfUriData(SEND_URI)

        // 心拍数(heart_rate)をDBに登録、暗号化、スマホ送信
        val heartRateList = heartRateDatas.toMutableList()
        if (heartRateList.isNotEmpty()) {
            scope.launch {
                saveAndSendHeartRate(todayStr, heartRateList)
            }
        }

        // 1か月以前の心拍数をDBから削除
        scope.launch {
            heartRateRepository?.deleteHeartRateBeforeDate(
                Util.getStringOfYYYYMMDD(Util.getBeforeMonthDate(today, 1))
            )
        }

        // [未使用：歩数は送信しない]
        // 歩数(step)をDBに登録、暗号化、スマホ送信
        // val stepList = SensorEventsService.stepDatas.toMutableList()
        // if (stepList.isNotEmpty()) {
        //     scope.launch {
        //         saveAndSendStep(today, stepList)
        //     }
        // }
        Log.i(TAG, "doWork() END")
        return Result.success()
    }

    // 心拍数(heart_rate)をDBに登録、暗号化、スマホ送信
    private suspend fun saveAndSendHeartRate(
        today: String,
        copyHeartRate: MutableList<HeartRateData>
    ) {
        try {
            // yyyyMMdd, hh, mmStart, mmFinishで照準に並び替える
            heartRateDataToDB(copyHeartRate, today)    // 10分単位のデータに変換

            if (gatewayService?.isMatre() == true) {
                // 昨日以前のデータのみ抽出し、送信する
                val heartRateList =
                    heartRateRepository?.getAll()?.groupBy { it.date }?.filter { it.key != today }
                if (!heartRateList.isNullOrEmpty()) {
                    Log.i(TAG, "heartRateList: $heartRateList")
                    encryptData(heartRateList, MOBILE_TIC_WATCH_E3_HEART_RATE_PATH)
                }
            }
        } catch (e: Exception) {
            Log.e(TAG, "Exception saveAndSendHeartRate() : ${e.message}")
        }
    }

    // 心拍数(heart_rate)をDBに登録、暗号化、スマホ送信
    private suspend fun saveAndSendStep(
        today: String,
        copyStepDatas: MutableList<StepData>
    ) {
        try {
            saveStepToDB(copyStepDatas, today)    // 10分単位のデータに変換

            // ペルソナ作成済み、かつ連携済みのスマホがある場合、暗号化してスマホに送信
//                if (gatewayService?.activePersona != null && connectMobileUri != "") {
            if (gatewayService?.isMatre() == true) {
                // 昨日以前のデータのみ抽出し、送信する
                val stepList =
                    stepRepository?.getAll()?.groupBy { it.date }?.filter { it.key != today }
                if (!stepList.isNullOrEmpty()) {
                    Log.i(TAG, "stepList: $stepList")
                    encryptData(stepList, MOBILE_TIC_WATCH_E3_STEP_PATH)
                }
            }
        } catch (e: Exception) {
            Log.e(TAG, "Exception saveAndSendStep() : ${e.message}")
        }
    }

    private suspend inline fun <reified T> encryptData(
        listData: Map<String, List<T>>?,
        path: String
    ) {
        val contacts = gatewayService?.contacts
//        listDataをdateごとにわけて、暗号化する。
        listData?.forEach { (date, list) ->
            val json = Util.jsonEncode(list)
            Log.d(TAG, "JsonData : $json")
            contacts?.let {
                val signThenEncryptStr = gatewayService?.signThenEncrypt(contacts, json) ?: ""
                sendData(signThenEncryptStr, path, date)
            }
        }
    }

    private suspend fun sendData(encryptStr: String, path: String, key: String) {
        Log.i(TAG, "sendData() $key START")
        try {
            val request = PutDataMapRequest.create(path).apply {
                dataMap.putString(key, encryptStr)
            }
                .asPutDataRequest()
                .setUrgent()

            val result = dataClient.putDataItem(request).await()
            Log.d(TAG, "$key request: $request")

            Log.d(TAG, "$key DataItem saved : $result")
        } catch (cancellationException: CancellationException) {
            throw cancellationException
        } catch (exception: Exception) {
            Log.e(TAG, "$key Saving DataItem failed: $exception")
        }
        Log.i(TAG, "sendData() $key END")
    }

    // 歩数(step)をDBに登録
    private suspend fun saveStepToDB(
        stepDataList: MutableList<StepData>,
        today: String
    ) {
        stepDataList.forEach() { stepData ->
            Log.i(TAG, "copyStepDatas: $stepData")
            val dateTime = getTodayDateTime(Util.getToday())
            val step: Step = Step(
                0,
                step = stepData.stepCount,
                date = stepData.yyyyMMdd,
                created_at = dateTime,
                updated_at = dateTime
            )
            val lastStep = stepRepository?.findByDate(stepData.yyyyMMdd)
            if (lastStep == null) {
                stepRepository?.add(step)
            } else {
                step.id = lastStep.id
                stepRepository?.update(step)
            }
            // 今日の日付でない場合、stepDataから削除(昨日以前にカウントした歩数を削除)
            if (stepData.yyyyMMdd != today) {
                SensorEventsService.stepDatas.remove(stepData)    // stepDatasから該当のデータを削除
            }
        }
    }


    // 心拍数(heart_rate)をDBに登録
    private suspend fun heartRateDataToDB(
        heartRateDatas: MutableList<HeartRateData>,
        today: String
    ) {
        heartRateDatas.sortWith(
            compareBy(
                { it.yyyyMMdd },
                { it.hh },
                { it.mmStart },
                { it.mmFinish }
            )
        )
        Log.i(TAG, "heartRateDatas: $heartRateDatas")

        // 10分単位のデータに変換
        heartRateDatas.filter { it.isCountFinished }.forEach() { heartRateData ->
            Log.i(TAG, "pulseData: $heartRateData")
            val dateTime = getTodayDateTime(Util.getToday())
            val heartRate: HeartRate = HeartRate(
                0,
                date = today,
                hh = heartRateData.hh,
                mmStart = heartRateData.mmStart,
                mmFinish = heartRateData.mmFinish,
                maxPulse = heartRateData.maxPulse,
                minPulse = heartRateData.minPulse,
                avePulse = heartRateData.totalPulse / heartRateData.count,
                created_at = dateTime,
                updated_at = dateTime
            )
            heartRateRepository?.add(heartRate)     // DBに登録
            SensorEventsService.heartRateDatas.remove(heartRateData)    // heartRateDatasから該当のデータを削除
            Log.i(TAG, "heartRate To DB: $heartRate")
        }
    }

    private fun sendSelfUriData(path: String) {
        Log.i(TAG, "sendSelfUriData() START")
        try {
            if (gatewayService?.isMatre() == true) {
                val uri = gatewayService?.activePersona?.uri.toString()
                val name = gatewayService?.activePersona?.name.toString()
                val subName = gatewayService?.activePersona?.subName.toString()
                Log.d(TAG, "sendSelfUriData() uri: $uri")
                scope.launch {
                    try {
                        // 自分のURIをメッセージで送信
                        val request = PutDataMapRequest.create(path).apply {
                            dataMap.putString(URI_KEY, uri)
                            dataMap.putString(URI_NAME_KEY, name)
                            dataMap.putString(URI_SUB_NAME_KEY, subName)
                        }
                            .asPutDataRequest()
                            .setUrgent()
                        dataClient.deleteDataItems(request.uri).await().apply {
                            val result = dataClient.putDataItem(request).await()
                            Log.i(TAG, "DataItem saved: $result")
                        }
//                        val result = dataClient.putDataItem(request).await()
                        Log.d(TAG, "path : $path")
                        Log.d(TAG, "URI_KEY : $URI_KEY")
                        Log.d(TAG, "uri : $uri")
                        Log.d(TAG, "sendSelfUriData() request: $request")
                    } catch (cancellationException: CancellationException) {
                        throw cancellationException
                    } catch (exception: Exception) {
                        Log.e(TAG, "Saving DataItem failed: $exception")
                    }
                }
            }
        } catch (e: Exception) {
            Log.e(TAG, "Exception sendSelfUriData() : ${e.message}")
        }
        Log.i(TAG, "sendSelfUriData() END")
    }

    companion object {
        private const val TAG = "WorkerManage"
    }
}
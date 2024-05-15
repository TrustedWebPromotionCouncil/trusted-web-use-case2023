package com.example.wearable.trustapp.biowatcher.service

//import android.hardware.Sensor.TYPE_STEP_DETECTOR
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.Service
import android.content.Context
import android.content.Intent
import android.hardware.Sensor
import android.hardware.SensorEvent
import android.hardware.SensorEventListener
import android.hardware.SensorManager
import android.os.IBinder
import android.util.Log
import androidx.core.app.NotificationCompat
import com.example.wearable.trustapp.R
import com.example.wearable.trustapp.biowatcher.common.Constants
import com.example.wearable.trustapp.biowatcher.common.Constants.PULSE_ZERO
import com.example.wearable.trustapp.biowatcher.common.Util
import java.time.LocalDateTime

class SensorEventsService : SensorEventListener, Service() {
    //class SensorEventsService : SensorEventListener, LifecycleService() {
    private val SENSOR_PERMISSION_CODE = 100

    override fun onCreate() {
        super.onCreate()

        val sensorManager = getSystemService(SENSOR_SERVICE) as SensorManager

        // https://developer.android.com/reference/android/hardware/Sensor
        val heartRateSensor = sensorManager.getDefaultSensor(Sensor.TYPE_HEART_RATE)
        sensorManager.registerListener(this, heartRateSensor, SensorManager.SENSOR_DELAY_NORMAL)
        // [歩数センサー未使用]
        // val stepCountSensor =
        //     sensorManager.getDefaultSensor(Sensor.TYPE_STEP_DETECTOR) // TYPE_STEP_DETECTORだと端末が起動してからの累計歩数ではなく、1.0 固定となる。
        // sensorManager.registerListener(this, stepCountSensor, SensorManager.SENSOR_DELAY_NORMAL)

        Log.i(TAG, "LISTENER REGISTERED.")
    }

    // サービスが開始されたときに呼び出される関数
    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        Log.i(TAG, "onStartCommand() START")

        val manager = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        val id = "sensor_service"
        val name = "センサーサービス" // "通知のタイトル的情報を設定"
        val notifyDescription = "センサーサービス通知"// この通知の詳細情報を設定します

        if (manager.getNotificationChannel(id) == null) {
            val mChannel = NotificationChannel(id, name, NotificationManager.IMPORTANCE_HIGH)
            mChannel.apply {
                description = notifyDescription
            }
            manager.createNotificationChannel(mChannel)
        }

        val notification = NotificationCompat.Builder(this, id).apply {
            setSmallIcon(R.mipmap.ic_launcher)
            // setSmallIcon(R.drawable.ic_launcher_background)
        }.build()

        startForeground(1, notification)
        Log.i(TAG, "onStartCommand() END")

        return START_STICKY
    }

    // センサー値取得後の処理を記載する関数
    override fun onSensorChanged(event: SensorEvent) {
        val today = Util.getToday() // LocalDateTime.now()
        when (event.sensor.type) {
            // 心拍数センサーの場合
            Sensor.TYPE_HEART_RATE -> {
                setPulseData(event.values[0].toInt(), today)
            }
            // [未使用]
            // 歩数センサーの場合
            // TYPE_STEP_DETECTOR -> {
            //     setStepData(today)
            // }
            // それ以外
            else -> {
                Log.d(TAG, "Unknown sensor type")
            }
        }
    }

    // センサーの精度が変更されたときにのみ呼び出される関数。基本使わない。
    override fun onAccuracyChanged(sensor: Sensor, accuracy: Int) {
//        Log.d(TAG, "onAccuracyChanged - accuracy: $accuracy")
    }

    override fun onBind(intent: Intent?): IBinder? {
        TODO("Not yet implemented")
        Log.d(TAG, "onBind")
    }


    override fun onDestroy() {
        stopForeground(Service.STOP_FOREGROUND_DETACH)

        super.onDestroy()
        val sensorManager: SensorManager = getSystemService(Context.SENSOR_SERVICE) as SensorManager
        sensorManager.unregisterListener(this)
        Log.d(TAG, "onDestroy")
    }

    override fun onTaskRemoved(rootIntent: Intent?) {
        super.onTaskRemoved(rootIntent)
        Log.d(TAG, "onTaskRemoved")
    }

    private fun convertMinuteToRange(minute: String): Pair<String, String> {
        val minuteInt = minute.toInt()
        val startMinute = (minuteInt / Constants.PULSE_RANGE_UNIT) * Constants.PULSE_RANGE_UNIT
        val endMinute = startMinute + (Constants.PULSE_RANGE_UNIT - 1)

        return when {
            minuteInt in 0..59 -> String.format("%02d", startMinute) to String.format(
                "%02d",
                endMinute
            )
            else -> "-" to "-"
        }
    }

    private fun setStepData(today: LocalDateTime) {
        val todayDate = Util.getStringOfYYYYMMDD(today)                // yyyy/MM/dd
        val newData = StepData(
            yyyyMMdd = todayDate,
            stepCount = 1,
            isCountFinished = false
        )

        var isNewData = true
        if (stepDatas.isNotEmpty()) {
            // 現在日付時刻と一致する要素を探す
            val matchedData = stepDatas.find { data -> data.yyyyMMdd == todayDate }
            if (matchedData != null) {
                matchedData.stepCount++ // 歩数 + 1
                isNewData = false
            } else {
                // 1個前のisCountFinishedをtrueにする
                stepDatas.last().isCountFinished = true
            }
        }
        if (isNewData) {
            stepDatas.add(newData)  // 新規追加
        }
        stepDatas.forEach {
//            Log.i(TAG, "stepData = $it")
        }
    }


    private fun setPulseData(
        pulse: Int,
        today: LocalDateTime,
    ) {
        if(pulse < PULSE_ZERO) return  // 心拍数が0未満の場合は、処理を終了する

        val todayDate = Util.getStringOfYYYYMMDD(today)                // yyyy/MM/dd
        val todayTimeHour = Util.getTodayTimeHour(today)        // HH
        val todayTimeMinute = Util.getTodayTimeMinute(today)    // mm(分)
        val minute = convertMinuteToRange(todayTimeMinute)
        val newData = HeartRateData(
            yyyyMMdd = todayDate,
            hh = todayTimeHour,
            mmStart = minute.first,
            mmFinish = minute.second,
            maxPulse = pulse,
            minPulse = pulse,
            totalPulse = pulse,
            count = 1,
            isCountFinished = false
        )

        var isNewData = true
        if (heartRateDatas.isNotEmpty()) {
            // 現在日付時刻と一致する要素を探す
            val matchedData = heartRateDatas.find { data ->
                data.yyyyMMdd == todayDate && data.hh == todayTimeHour && data.mmStart <= minute.first && data.mmFinish >= minute.second
            }
            if (matchedData != null) {
                // pulseData更新(findで取得した要素は参照渡しのため、heartRateDatasの要素も更新される)
                matchedData.maxPulse =
                    if (matchedData.maxPulse < pulse) pulse else matchedData.maxPulse
                matchedData.minPulse =
                    if (matchedData.minPulse > pulse) pulse else matchedData.minPulse
                matchedData.totalPulse += pulse
                matchedData.count++
                isNewData = false
            } else {
                // 1個前のisCountFinishedをtrueにする
                heartRateDatas.last().isCountFinished = true
            }
        }
        if (isNewData) {
            heartRateDatas.add(newData)  // 新規追加
        }
    }

    companion object {
        private const val TAG = "SensorEventsService"
        val stepDatas: MutableList<StepData> = mutableListOf()
        val heartRateDatas: MutableList<HeartRateData> = mutableListOf()
    }
}


// データクラスの定義
data class StepData(
    val yyyyMMdd: String,       // 日付
    var stepCount: Int,      // 歩数
    var isCountFinished: Boolean = false, // 終了フラグ[true:終了, false:未終了]
)

data class HeartRateData(
    val yyyyMMdd: String,       // 日付
    val hh: String,       // 時
    val mmStart: String,    // 分(開始)
    val mmFinish: String,   // 分(終了)
    var maxPulse: Int,      // 心拍数の最大値
    var minPulse: Int,      // 心拍数の最小値
    var totalPulse: Int,    // 心拍数の合計
    var count: Int,         // 心拍数の取得回数
    var isCountFinished: Boolean = false, // 終了フラグ[true:終了, false:未終了]
)

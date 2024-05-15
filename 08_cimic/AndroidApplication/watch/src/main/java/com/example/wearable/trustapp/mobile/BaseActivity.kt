package com.example.wearable.trustapp.mobile

import android.Manifest
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Bundle
import android.util.Log
import androidx.activity.ComponentActivity
import androidx.annotation.CallSuper
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import androidx.work.Constraints
import androidx.work.ExistingPeriodicWorkPolicy
import androidx.work.ListenableWorker
import androidx.work.PeriodicWorkRequestBuilder
import androidx.work.WorkManager
import com.example.wearable.trustapp.biowatcher.service.SensorEventsService
import com.example.wearable.trustapp.biowatcher.common.Constants
import java.util.concurrent.TimeUnit


abstract class BaseActivity : ComponentActivity() {
    // for subclasses
//    protected var thisContext: AppCompatActivity? = null
    protected var thisContext: ComponentActivity? = null
    protected var viewModel: MainViewModel? = null
    private val SENSOR_PERMISSION_CODE = 100
    private val manager = WorkManager.getInstance()

    override fun onCreate(savedInstanceState: Bundle?) {
        Log.d(TAG, "onCreate()")
        super.onCreate(savedInstanceState)
        thisContext = this
    }

    override fun onStart() {
        Log.d(TAG, "onStart()")
        super.onStart()
        val preferences = getPreferences(MODE_PRIVATE)
        if (preferences.getBoolean(FIRST_EXECUTION, true)) {
            val editor = preferences.edit()
            editor.putBoolean(FIRST_EXECUTION, false)
        }
        // センサー情報権限チェック
        checkAppPermissions()
    }

    @CallSuper
    override fun onResume() {
        Log.d(TAG, "onResume()")
        super.onResume()
        if (viewModel != null) {
            viewModel!!.startListeners()
        }
    }

    @CallSuper
    override fun onPause() {
        Log.d(TAG, "onPause()")
        super.onPause()
        if (viewModel != null) {
            viewModel!!.stopListeners()
        }
    }

    override fun onStop() {
        Log.d(TAG, "onStop()")
        super.onStop()
    }

    override fun onDestroy() {
        Log.d(TAG, "onDestroy()")
        super.onDestroy()
    }
    // センサー情報権限チェック：許可されていない場合は、許可を求める。許可しない場合、サービスが起動しない。
    private fun checkAppPermissions() {
        if (ContextCompat.checkSelfPermission(this, Manifest.permission.BODY_SENSORS)
            != PackageManager.PERMISSION_GRANTED
        ) {
            Log.d(TAG, "checkAppPermissions() NOT PERMISSION_GRANTED")
            ActivityCompat.requestPermissions(
                this, arrayOf<String>(Manifest.permission.BODY_SENSORS),
                SENSOR_PERMISSION_CODE
            )
        } else {
            // 許可済みなので、処理を続行
            // SensorJobServiceを起動する
            Log.d(TAG, "checkAppPermissions() PERMISSION_GRANTED")
            Intent(this, SensorEventsService::class.java).also { intent ->
                intent.putExtra(TAG, "SensorEventsService start")
                startForegroundService(intent)
            }
            // Workerを起動する
            startWorker<com.example.wearable.trustapp.biowatcher.worker.WorkerManage>()
        }
    }
    // センサー情報権限チェック：許可されていない場合は、許可を求める。許可しない場合、サービスが起動しない。
    override fun onRequestPermissionsResult(
        requestCode: Int,
        permissions: Array<String>,
        grantResults: IntArray
    ) {
        Log.d(TAG, "onRequestPermissionsResult()")
        if (requestCode == SENSOR_PERMISSION_CODE) {
            // requestPermissionsで設定した順番で結果が格納されています。
            if (grantResults.isNotEmpty() && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                Log.d(TAG, "onRequestPermissionsResult() SENSOR_PERMISSION_CODE")
                // 許可されたので、処理を続行
                // SensorJobServiceを起動する
                Intent(this, SensorEventsService::class.java).also { intent ->
                    intent.putExtra(TAG, "SensorEventsService start")
                    startForegroundService(intent)
                }
                // Workerを起動する
                startWorker<com.example.wearable.trustapp.biowatcher.worker.WorkerManage>()
            }
            return;
        }
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
    }
    private inline fun <reified W : ListenableWorker> startWorker() {
        // WorkManagerを使ってバックグラウンドで処理を実行
        val pulseSaveWorkRequest =
            PeriodicWorkRequestBuilder<W>(Constants.WORK_DO_UNIT, TimeUnit.MINUTES)
                // WorkManager制約設定[https://developer.android.com/topic/libraries/architecture/workmanager/how-to/define-work?hl=ja]
                .setConstraints(
                    Constraints.Builder()
//                    .setRequiresCharging(true)  // 充電中である
                    .build()
                )
                .build()
        manager.enqueueUniquePeriodicWork(
            "bio_data_save",
            ExistingPeriodicWorkPolicy.KEEP,    // 以前に同じ名前の作業がスケジュールされている場合にその作業を保持する
            pulseSaveWorkRequest
        )
    }

    companion object {
        private const val TAG = "BaseActivity"
        protected const val EXTRAS_URI = "URI"
        protected const val FIRST_EXECUTION = "FIRST_EXEC"
    }
}
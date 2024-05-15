package com.example.wearable.trustapp.mobile

import android.app.Application
import android.content.Context
import android.util.Log
import androidx.annotation.CallSuper
import java.io.BufferedReader
import java.io.IOException
import java.io.InputStreamReader
import java.nio.charset.StandardCharsets
import java.util.Properties


open class BaseApplication : Application() {
    private var applicationProperties: Properties? = null
    var gatewayService: GatewayService? = null
        private set

    override fun onCreate() {
        Log.d(TAG, "onCreate()")
        super.onCreate()
        loadProperties()
        INSTANCE = this
        gatewayService = GatewayService(this)
        registerActivityLifecycleCallbacks(object : ApplicationLifecycle() {
            // アクティビティのライフサイクルの変更をリッスンして追跡します。
            override fun onForeground() {
                this@BaseApplication.onForeground()
            }

            override fun onBackground() {
                this@BaseApplication.onBackground()
            }
        })
    }

    private fun loadProperties() {
        var reader: BufferedReader? = null
        try {
            reader = BufferedReader(
                InputStreamReader(
                    assets.open("application.properties"),
                    StandardCharsets.UTF_8
                )
            )
            applicationProperties = Properties()
            applicationProperties!!.load(reader)
        } catch (e: IOException) {
            Log.e(TAG, "IOException reading properties: " + e.message)
        } finally {
            if (reader != null) {
                try {
                    reader.close()
                } catch (e: IOException) {
                    Log.e(TAG, "IOException closing reader: " + e.message)
                }
            }
        }
    }

    val context: Context
        get() = INSTANCE!!.applicationContext

    override fun onTerminate() {
        Log.d(TAG, "Terminate Application")
        super.onTerminate()
    }

    @CallSuper
    protected open fun onForeground() {
        Log.d(TAG, "Foreground Application")
        gatewayService!!.startMonitor()
    }

    @CallSuper
    protected open fun onBackground() {
        Log.d(TAG, "Background Application")
        gatewayService!!.stopMonitor()
    }

    companion object {
        private const val TAG = "BaseApplication"
        private var INSTANCE: BaseApplication? = null
    }
}
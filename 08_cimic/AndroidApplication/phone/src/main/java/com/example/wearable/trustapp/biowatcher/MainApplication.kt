package com.example.wearable.trustapp.biowatcher

import android.util.Log
import com.example.wearable.trustapp.mobile.BaseApplication

class MainApplication : BaseApplication() {
    override fun onCreate() {
        Log.d(TAG, "onCreate()")
        super.onCreate()
    }

    companion object {
        private const val TAG = "MainApplication"
    }
}

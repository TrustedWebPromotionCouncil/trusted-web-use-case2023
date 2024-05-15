package com.example.wearable.trustapp.mobile

import android.app.Activity
import android.app.Application.ActivityLifecycleCallbacks
import android.os.Bundle

abstract class ApplicationLifecycle : ActivityLifecycleCallbacks {
    private var numStarted = 0
    abstract fun onForeground()
    abstract fun onBackground()

    override fun onActivityCreated(activity: Activity, savedInstanceState: Bundle?) {}
    override fun onActivityStarted(activity: Activity) {
        if (numStarted == 0) onForeground()
        numStarted++
    }

    override fun onActivityResumed(activity: Activity) {}
    override fun onActivityPaused(activity: Activity) {}
    override fun onActivityStopped(activity: Activity) {
        numStarted--
        if (numStarted == 0) onBackground()
    }

    override fun onActivitySaveInstanceState(activity: Activity, outState: Bundle) {}
    override fun onActivityDestroyed(activity: Activity) {}
}
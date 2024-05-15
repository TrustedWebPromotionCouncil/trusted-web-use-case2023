package com.example.wearable.trustapp.biowatcher.views

import android.Manifest
import android.app.Activity
import android.content.Context
import android.content.ContextWrapper
import android.content.Intent
import android.content.pm.PackageManager
import android.content.res.Configuration
import android.net.Uri
import android.os.Bundle
import android.provider.Settings
import android.view.WindowManager
import androidx.activity.compose.setContent
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.material3.Surface
import androidx.compose.runtime.Composable
import androidx.compose.ui.tooling.preview.Preview
import androidx.core.content.ContextCompat
import com.example.wearable.trustapp.biowatcher.views.navigation.AppNavHost
import com.example.wearable.trustapp.biowatcher.views.ui.theme.TrustAppTheme
import com.example.wearable.trustapp.mobile.BaseActivity
import dagger.hilt.android.AndroidEntryPoint

@AndroidEntryPoint
class MainActivity : BaseActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        checkCameraPermission {
            setContent {
                TrustAppTheme {
                    Surface {
                        AppNavHost()
                        window.addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON) // 画面を常にONにする
                    }
                }

            }
        }
    }

    private fun checkCameraPermission(onGranted: () -> Unit) {
        val cameraPermissionLauncher =
            registerForActivityResult(ActivityResultContracts.RequestPermission()) { isGranted -> // パーミッションダイアログ表示後に呼び出されるコールバック
                if (isGranted) {
                    // パーミッションが与えられたら、onGrantedコールバックを呼び出す
                    onGranted()
                } else {
                    // バーミッションが与えられなかった時は、設定アプリを開き、このアプリを終了する
                    val settingsAppUri = "package:$packageName"
                    val intent =
                        Intent(
                            Settings.ACTION_APPLICATION_DETAILS_SETTINGS,
                            Uri.parse(settingsAppUri),
                        )
                    startActivity(intent)
                    finish()
                }
            }

        // カメラパーミッションが与えられていれば、onGrantedコールバックを呼び出し、そうでなければパーミッションをリクエストする
        if (ContextCompat.checkSelfPermission(
                this,
                Manifest.permission.CAMERA
            ) == PackageManager.PERMISSION_GRANTED
        ) {
            onGranted()
        } else {
            cameraPermissionLauncher.launch(Manifest.permission.CAMERA)
        }
    }

}

fun Context.findActivity(): Activity? = when (this) {
    is Activity -> this
    is ContextWrapper -> baseContext.findActivity()
    else -> null
}


@Preview(name = "Light Mode")
@Preview(
    uiMode = Configuration.UI_MODE_NIGHT_YES,
    showBackground = true,
    name = "Dark Mode"
)
@Composable
fun PreviewMessageCard() {
    TrustAppTheme {
        Surface {
        }
    }
}

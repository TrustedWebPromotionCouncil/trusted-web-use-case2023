/* While this template provides a good starting point for using Wear Compose, you can always
 * take a look at https://github.com/android/wear-os-samples/tree/main/ComposeStarter and
 * https://github.com/android/wear-os-samples/tree/main/ComposeAdvanced to find the most up to date
 * changes to the libraries and their usages.
 */

package com.example.wearable.trustapp.biowatcher.views

import android.os.Bundle
import android.view.WindowManager
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.material3.Surface
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.tooling.preview.Devices
import androidx.compose.ui.tooling.preview.Preview
import androidx.navigation.NavHostController
import androidx.wear.compose.material.MaterialTheme
import androidx.wear.compose.material.Text
import androidx.wear.compose.navigation.rememberSwipeDismissableNavController
import androidx.work.WorkManager
import com.example.wearable.trustapp.R
import com.example.wearable.trustapp.biowatcher.views.navigation.AppNavHost
import com.example.wearable.trustapp.biowatcher.views.theme.initialThemeValues
import com.example.wearable.trustapp.mobile.BaseActivity



//@AndroidEntryPoint
class MainActivity : BaseActivity() {
//class MainActivity : ComponentActivity() {
//    private lateinit var jankPrinter: JankPrinter
    internal lateinit var navController: NavHostController
    private val SENSOR_PERMISSION_CODE = 100
    private val manager = WorkManager.getInstance()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setTheme(android.R.style.Theme_DeviceDefault)
        setContent {
            navController = rememberSwipeDismissableNavController()
            AppNavHost(
                swipeDismissableNavController = navController
            )
            window.addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON) // 画面を常にONにする

        }
    }

    companion object {
        private const val TAG = "MainActivity"
    }
}



@Composable
fun Greeting(greetingName: String) {
    Text(
        modifier = Modifier.fillMaxWidth(),
        textAlign = TextAlign.Center,
        color = MaterialTheme.colors.primary,
        text = stringResource(R.string.hello_world, greetingName)
    )
}

@Preview(device = Devices.WEAR_OS_SMALL_ROUND, showSystemUi = true)
@Composable
fun DefaultPreview() {
    Surface {
        var navController = rememberSwipeDismissableNavController()
        var themeColors by remember { mutableStateOf(initialThemeValues.colors) }
        AppNavHost(
            swipeDismissableNavController = navController
        )

    }
}
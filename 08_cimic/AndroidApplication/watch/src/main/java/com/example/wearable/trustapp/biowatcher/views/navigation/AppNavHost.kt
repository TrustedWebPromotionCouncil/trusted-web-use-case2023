/*
 * Copyright 2022 The Android Open Source Project
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
package com.example.wearable.trustapp.biowatcher.views.navigation

import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.stringResource
import androidx.navigation.NavHostController
import androidx.wear.compose.navigation.rememberSwipeDismissableNavController
import com.example.wearable.trustapp.biowatcher.views.screen.Screen
import com.example.wearable.trustapp.biowatcher.views.components.CustomTimeText
import com.example.wearable.trustapp.biowatcher.views.screen.top.TopScreen
import com.example.wearable.trustapp.biowatcher.views.theme.WearAppTheme
import com.example.wearable.trustapp.biowatcher.views.theme.initialThemeValues
import com.google.android.horologist.annotations.ExperimentalHorologistApi
//import com.example.wearable.watch.presentation.ui.landing.LandingScreen
import com.google.android.horologist.compose.layout.ScalingLazyColumnDefaults
import com.google.android.horologist.compose.navscaffold.WearNavScaffold
import com.google.android.horologist.compose.navscaffold.scrollable

@OptIn(ExperimentalHorologistApi::class)
@Composable
fun AppNavHost(
    modifier: Modifier = Modifier,
    swipeDismissableNavController: NavHostController = rememberSwipeDismissableNavController()
) {
    // Persona作成処理の状態により、初回登録画面かトップ画面かを決定する
    var startDestination = Screen.Top.route

    var themeColors by remember { mutableStateOf(initialThemeValues.colors) }
//    var themeColors by remember { mutableStateOf(initialThemeValues.colors) }
    WearAppTheme(colors = themeColors) {
        // Allows user to disable the text before the time.
        var showProceedingTextBeforeTime by rememberSaveable { mutableStateOf(false) }

        WearNavScaffold(
            modifier = modifier,
            navController = swipeDismissableNavController,
            startDestination = startDestination,
            timeText = {
                CustomTimeText(
                    modifier = it,
                )
            }
        ) {
            // Main Window
            scrollable(
                route = Screen.Top.route,
                columnStateFactory = ScalingLazyColumnDefaults.belowTimeText(
                    firstItemIsFullWidth = true
                )
            ) {
//                Text(
//                    text = "Hello World!",
//                    color= MaterialTheme.colors.primary
//                )

                TopScreen(
                    columnState = it.columnState,
                    navController = swipeDismissableNavController
                )

//                LandingScreen(
//                    columnState = it.columnState,
//                    onClickWatchList = {
//                        swipeDismissableNavController.navigate(Screen.WatchList.route)
//                    },
//                    proceedingTimeTextEnabled = showProceedingTextBeforeTime,
//                    onClickProceedingTimeText = {
//                        showProceedingTextBeforeTime = !showProceedingTextBeforeTime
//                    },
//                    onNavigate = { swipeDismissableNavController.navigate(it) }
//                )
            }
        }
    }
}

@Composable
internal fun menuNameAndCallback(
    onNavigate: (String) -> Unit,
    menuNameResource: Int,
    screen: Screen
) = MenuItem(stringResource(menuNameResource)) { onNavigate(screen.route) }

data class MenuItem(val name: String, val clickHander: () -> Unit)

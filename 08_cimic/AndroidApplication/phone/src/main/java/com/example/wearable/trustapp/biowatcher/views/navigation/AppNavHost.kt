package com.example.wearable.trustapp.biowatcher.views.navigation

import android.annotation.SuppressLint
import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.tween
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.stringResource
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController

import com.example.wearable.trustapp.biowatcher.views.layout.ContentsLayout
import com.example.wearable.trustapp.biowatcher.views.screen.Screen
import com.example.wearable.trustapp.biowatcher.views.ui.theme.*
import kotlin.math.roundToInt


import androidx.navigation.NavType
import androidx.navigation.navArgument
import com.example.wearable.trustapp.R
import com.example.wearable.trustapp.biowatcher.common.Constants.STUDY_HOSPITAL_ID
import com.example.wearable.trustapp.biowatcher.common.Constants.STUDY_HOSPITAL_NAME
import com.example.wearable.trustapp.biowatcher.common.Constants.STUDY_SUBJECT_ID
import com.example.wearable.trustapp.biowatcher.views.screen.auditTrail.AuditLayout
import com.example.wearable.trustapp.biowatcher.views.screen.consent.ConsentLayout
import com.example.wearable.trustapp.biowatcher.views.screen.menu.MenuScreen
import com.example.wearable.trustapp.biowatcher.views.screen.qrReading.QRReadingLayout
import com.example.wearable.trustapp.biowatcher.views.screen.studySite.StudySiteLayout
import com.example.wearable.trustapp.biowatcher.views.screen.subjectData.SubjectDataLayout
import com.example.wearable.trustapp.biowatcher.views.screen.subjectData.SubjectDataScreen
import com.example.wearable.trustapp.biowatcher.views.screen.top.TopScreen
import com.example.wearable.trustapp.biowatcher.views.screen.wearableManage.WearableManageLayout

@OptIn(ExperimentalMaterial3Api::class)
@SuppressLint("UnusedMaterial3ScaffoldPaddingParameter", "CoroutineCreationDuringComposition")
@Composable
fun AppNavHost(
    navController: NavHostController = rememberNavController(),
) {
    // Persona作成処理の状態により、初回登録画面かトップ画面かを決定する
    var startDestination = Screen.Top.route

    // URIルートおよびパラメータ
    val queryParam =
        "/{$STUDY_SUBJECT_ID}/{$STUDY_HOSPITAL_ID}/{$STUDY_HOSPITAL_NAME}"
    val studyArguments = listOf(
        navArgument(STUDY_SUBJECT_ID) {
            type = NavType.StringType
            nullable = false
            defaultValue = ""
        },
        navArgument(STUDY_HOSPITAL_ID) {
            type = NavType.StringType
            nullable = false
            defaultValue = ""
        },
        navArgument("STUDY_HOSPITAL_NAME") {
            type = NavType.StringType
            nullable = false
            defaultValue = ""
        })

    NavHost(
        navController = navController,
        startDestination = startDestination,
    ) {
        // トップ画面/初回登録画面
        composable(route = Screen.Top.route) {
            TopScreen(
                navController = navController
            )
        }

        // QRコード読み取り画面
        composable(route = Screen.QRReading.route) {
            QRReadingLayout(
                navController = navController
            )
        }

        // 試験－病院選択画面
        composable(route = Screen.StudySite.route) {
            StudySiteLayout(
                navController = navController
            )
        }


        // メニュー画面
        composable(route = Screen.Menu.route + queryParam, arguments = studyArguments) {
            val studySubjectId = it.arguments?.getString(STUDY_SUBJECT_ID, "") ?: ""
            val studyHospitalId = it.arguments?.getString(STUDY_HOSPITAL_ID, "") ?: ""
            val studyHospitalName = it.arguments?.getString(STUDY_HOSPITAL_NAME, "") ?: ""
            ContentsLayout(
                titleText = stringResource(id = R.string.Screen_Menu),
                screenContent = {
                    MenuScreen(
                        navController = navController,
                        studySubjectId = studySubjectId,
                        studyHospitalId = studyHospitalId,
                        studyHospitalName = studyHospitalName
                    )
                }
            )
        }

        // 同意取得画面
        composable(route = Screen.Consent.route + queryParam, arguments = studyArguments) {
            ConsentLayout(
                navController = navController
            )
        }

        // 被験者データ画面
        composable(route = Screen.SubjectData.route + queryParam, arguments = studyArguments) {
            SubjectDataLayout(
                navController = navController
            )
        }

        // ウェアラブルデバイス管理画面
        composable(route = Screen.WearableManage.route + queryParam, arguments = studyArguments) {
            WearableManageLayout(
                navController = navController
            )
        }

        // 監査証跡画面
        composable(route = Screen.AuditTrail.route + queryParam, arguments = studyArguments) {
            AuditLayout(
                navController = navController
            )
        }
    }
//    }
}

@Composable
fun TextSwitcher(texts: List<String>, targetColor: Color = Black) {
    if (texts.size == 0) {
        return
    }
    // 無限に繰り返すアニメーションを作成する
    val infiniteTransition = rememberInfiniteTransition(label = "")
    // 1秒ごとにインデックスを切り替えるアニメーションを定義する
    val animation = infiniteTransition.animateFloat(
        initialValue = 0f,
        targetValue = (1f * (texts.size - 1)),
        animationSpec = infiniteRepeatable(
            animation = tween(durationMillis = 1000 * texts.size),
            repeatMode = RepeatMode.Restart
        ), label = ""
    )

    // アニメーションの値に応じてインデックスを更新する
    var index by remember { mutableStateOf(0) }
    index = animation.value.roundToInt()

    // テキストを表示する
    Text(
        text = texts[index],
        modifier = Modifier.padding(top = paddings.textSmall),
        color = targetColor
    )
}


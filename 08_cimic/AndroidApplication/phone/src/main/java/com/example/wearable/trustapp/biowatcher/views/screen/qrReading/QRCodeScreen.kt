package com.example.wearable.trustapp.biowatcher.views.screen.qrReading

import android.widget.Toast
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.livedata.observeAsState
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.stringResource
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavHostController
import com.example.wearable.trustapp.R
import com.example.wearable.trustapp.biowatcher.viewModel.qrReading.QRReadingViewModel
import com.example.wearable.trustapp.biowatcher.viewModel.qrReading.QRReadingViewModel.ApprovalStatus.*
import com.example.wearable.trustapp.biowatcher.views.layout.LoadingContentLayout
import com.example.wearable.trustapp.biowatcher.views.navigation.TextSwitcher
import com.example.wearable.trustapp.biowatcher.views.screen.Screen
import com.example.wearable.trustapp.biowatcher.views.ui.theme.Red40

@Composable
fun QRReadingLayout(
    navController: NavHostController,
    qrReadingViewModel: QRReadingViewModel = viewModel()
) {
    val isLoading by qrReadingViewModel.isLoading.observeAsState(false)
    val titleText = stringResource(id = R.string.Screen_QRReading)
    LoadingContentLayout(
        titleText = titleText,
        loading = isLoading,
        screenContent = {
            QRReadingScreen(
                navController = navController,
            )
        }
    )
}

@Composable
fun QRReadingScreen(
    navController: NavHostController,
    qrReadingViewModel: QRReadingViewModel = viewModel()
) {
    val approvalPending by qrReadingViewModel.approvalStatus.observeAsState(NONE)
    val context = LocalContext.current
    when (approvalPending) {
        NONE -> {
            // QRコード読み取り
            CameraPreview(
                navController = navController,
                modifier = Modifier.fillMaxSize()
            ) {
                qrReadingViewModel.subjectFirstAccess(it)
            }
        }

        PENDING -> {
            // 承認待ち
            val txtApprovalPending = stringResource(id = R.string.Text_ApprovalPending)
            Column(
                modifier = Modifier.fillMaxSize(),
                verticalArrangement = Arrangement.Center,
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                TextSwitcher(
                    listOf(
                        "$txtApprovalPending.",
                        "$txtApprovalPending..",
                        "$txtApprovalPending..."
                    ), Red40
                )
            }
            // 承認待ちsubject_study_id
            qrReadingViewModel.pendingForApproval()
        }

        APPROVED -> {
            Column(
                modifier = Modifier.fillMaxSize(),
                verticalArrangement = Arrangement.Center,
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                val txtWaitingApproval = stringResource(id = R.string.Text_WaitingApproval)
                TextSwitcher(
                    listOf(
                        "$txtWaitingApproval.",
                        "$txtWaitingApproval..",
                        "$txtWaitingApproval..."
                    ), Red40
                )
            }
            // 承認後、自分のURIをTDに登録する
            qrReadingViewModel.updateSubjectUri()
        }

        ALL_COMPLETED -> {
            val txtAllComplete = stringResource(id = R.string.Text_ApprovalAllCompleted)
            LaunchedEffect(Unit) {
                Toast.makeText(
                    context,
                    txtAllComplete,
                    Toast.LENGTH_LONG
                ).show()
                qrReadingViewModel.changeApprovalStatus(NONE)
                navController.navigate(Screen.StudySite.route)  // 試験病院一覧画面へ
            }
        }

        REJECTED -> {
            val txtApprovalRejected = stringResource(id = R.string.Text_ApprovalRejected)
            Toast.makeText(
                context,
                txtApprovalRejected,
                Toast.LENGTH_LONG
            ).show()
            qrReadingViewModel.changeApprovalStatus(NONE)
        }
    }
//    if(approvalPending){
//        // QRコード読み取り
//        CameraPreview(
//            navController = navController,
//            modifier = Modifier.fillMaxSize()
//        ) {
//            qrReadingViewModel.subjectFirstAccess(it)
//        }
//    }else{
//        // 承認待ち
//        val txtCreatingPersona = stringResource(id = R.string.Text_ApprovalPending)
//        TextSwitcher(
//            listOf(
//                "$txtCreatingPersona.",
//                "$txtCreatingPersona..",
//                "$txtCreatingPersona..."
//            ), Red40
//        )
//        qrReadingViewModel.updateSubjectUri()
//    }
}


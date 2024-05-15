package com.example.wearable.trustapp.biowatcher.views.screen.consent


import android.widget.Toast
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Divider
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.livedata.observeAsState
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.colorResource
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavHostController
import com.example.wearable.trustapp.R
import com.example.wearable.trustapp.biowatcher.viewModel.consent.ConsentListViewModel
import com.example.wearable.trustapp.biowatcher.viewModel.consent.ConsentHistoryViewModel
import com.example.wearable.trustapp.biowatcher.viewModel.consent.ConsentPage
import com.example.wearable.trustapp.biowatcher.viewModel.consent.ConsentViewModel
import com.example.wearable.trustapp.biowatcher.viewModel.consent.DownloadStatus
import com.example.wearable.trustapp.biowatcher.views.layout.ButtonWrapper
import com.example.wearable.trustapp.biowatcher.views.layout.LoadingContentLayout
import com.example.wearable.trustapp.biowatcher.views.layout.buttonBackToMenu
import com.example.wearable.trustapp.biowatcher.views.screen.Screen
import com.example.wearable.trustapp.biowatcher.views.ui.theme.paddings
import com.example.wearable.trustapp.biowatcher.views.ui.theme.Typography

@Composable
fun ConsentLayout(
    navController: NavHostController,
    consentViewModel: ConsentViewModel = viewModel()
) {
    val navigationList by consentViewModel.navigationList.observeAsState(mutableListOf(ConsentPage.MAIN))
    val isLoading by consentViewModel.isLoading.observeAsState(false)
    val titleText = when (navigationList) {
        ConsentPage.MAIN -> stringResource(id = R.string.Screen_Consent)
        ConsentPage.CONSENT_DOCUMENT_LIST -> stringResource(id = R.string.Screen_ConsentDocumentList)
        ConsentPage.CONSENT_HISTORY -> stringResource(id = R.string.Screen_ConsentHistory)
        else -> stringResource(id = R.string.Screen_Consent)
    }
    LoadingContentLayout(
        titleText = titleText,
        loading = isLoading,
        screenContent = {
            ConsentMainScreen(
                navController = navController,
                pageList = navigationList,
            )
        }
    )
}

@Composable
fun ConsentMainScreen(
    navController: NavHostController,
    consentViewModel: ConsentViewModel = viewModel(),
    consentPdfViewModel: ConsentPdfViewModel = viewModel(),
    consentHistoryViewModel: ConsentHistoryViewModel = viewModel(),
    consentListViewModel: ConsentListViewModel = viewModel(),
    pageList: Any
) {
    val isConsent by consentPdfViewModel.isConsent.observeAsState(false)
    val documentName by consentPdfViewModel.documentName.observeAsState("")
    val documentHistoryFlg by consentHistoryViewModel.documentHistoryFlg.observeAsState(false)
    val downloadStatus =
        consentListViewModel.downloadStatus.observeAsState(DownloadStatus.NONE)
    val isSigning by consentPdfViewModel.isSigning.observeAsState(false)
    val isStudyFinish by consentPdfViewModel.isStudyFinish.observeAsState(false)
    val completeWithdraw by consentPdfViewModel.completeWithdraw.observeAsState(false)
    val consentProcessStatus by consentPdfViewModel.consentProcessStatus.observeAsState(
        ConsentPdfViewModel.ConsentProcessStatus.NONE
    )

    // ヘッダー
    ConsentHeader(
        navController = navController,
        studySiteName = consentViewModel.studySiteName,
        documentName = documentName,
        pageList = pageList
    )

    if (pageList == ConsentPage.MAIN) {

        if (isStudyFinish) {
            SigningOrWithdrawnScreen(
                stringResource(id = R.string.Text_Finish)
            )
        } else if (isSigning) {
            SigningOrWithdrawnScreen(
                stringResource(id = R.string.Text_Signing)
            )
        } else {
            // 同意文書(最新PDF表示)
            ConsentPdfScreen(
                navController = navController,
                modifier = Modifier
                    .fillMaxHeight(0.6f)
                    .padding(paddings.textSmall),
            )
        }
    } else if (pageList == ConsentPage.CONSENT_DOCUMENT_LIST) {
        consentPdfViewModel.openFile() // ここで開いておかないと、同意履歴画面に遷移した時に、PDFが表示されない(fileStreamが最後まで読み込まれているため)
        consentPdfViewModel.setPdfPage(ConsentPdfViewModel.PdfPage.Consent)
        // 同意済文書一覧
        ConsentListScreen(
            consentViewModel = consentViewModel,
            consentListViewModel = consentListViewModel,
            navController = navController,
            consentFileList = consentListViewModel.consentFileList,
            changeDownloadStatus = consentListViewModel::changeDownloadStatus,
            downloadStatus = downloadStatus.value,
        )
    } else if (pageList == ConsentPage.CONSENT_HISTORY) {
        consentPdfViewModel.openFile() // ここで開いておかないと、同意履歴画面に遷移した時に、PDFが表示されない(fileStreamが最後まで読み込まれているため)
        consentPdfViewModel.setPdfPage(ConsentPdfViewModel.PdfPage.Consent)
        // 同意履歴一覧
        if (documentHistoryFlg) {
            TableListScreen(
                navController = navController,
                modifier = Modifier
                    .fillMaxHeight(0.6f)
                    .padding(paddings.textSmall),
                columnCount = consentHistoryViewModel.columnCount,
                rowCount = consentHistoryViewModel.rowCount,
                documentColumnName = consentHistoryViewModel.documentColumnName,
                documentListArray = consentHistoryViewModel.documentListArray
            )
        }else{
            Row(
                modifier = Modifier
                    .fillMaxWidth(1f)
                    .height(200.dp)
            ) {
                Text(text = stringResource(id = R.string.Text_NoHistory))
            }
        }
    }

    // ページ移動ボタン
    MovePageColumn(
        navController = navController,
        pageList = pageList,
        consentViewModel = consentViewModel,
        isConsent = isConsent,
        isWithdraw = isStudyFinish,
        isSigning = isSigning
    )
    // トースト表示関連
    ToastPage(
        consentViewModel,
        consentPdfViewModel,
        consentListViewModel,
        consentHistoryViewModel,
        completeWithdraw,
        consentProcessStatus,
        navController
    )


}



@Composable
fun ConsentHeader(
    navController: NavHostController,
    studySiteName: String,
    documentName: String,
    pageList: Any
) {
    Column {
        Row {
            Text(
                text = studySiteName,
                modifier = Modifier
                    .padding(start = paddings.textSmall)
                    .fillMaxWidth(),
                fontSize = Typography.titleMedium.fontSize
            )
        }
        // 文書名はPDF表示の時のみ表示
        if (pageList == ConsentPage.MAIN) {
            Row {
                Text(
                    text = documentName,
                    modifier = Modifier
                        .padding(start = paddings.textSmall)
                        .fillMaxWidth(),
                    fontSize = Typography.titleMedium.fontSize
                )
            }
        }
        Divider(
            color = colorResource(id = R.color.black),
            thickness = 0.5.dp
        )
    }
}

@Composable
fun MovePageColumn(
    navController: NavHostController,
    pageList: Any,
    consentViewModel: ConsentViewModel = viewModel(),
    isConsent: Boolean = false,
    isWithdraw: Boolean = false,
    isSigning: Boolean = false
) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(paddings.textMedium),
        horizontalAlignment = Alignment.End,
    ) {
        if (pageList == ConsentPage.MAIN) {
            if (!isWithdraw && !isSigning) {
                // 同意・再同意・撤回ボタン
                buttonConsent(
                    navController = navController,
                    consentViewModel = consentViewModel,
                    isConsent = isConsent
                )
            }
        } else {
            // 同意画面ボタン
            buttonConsentPage(
                consentViewModel = consentViewModel,
            )
        }
        if (pageList != ConsentPage.CONSENT_DOCUMENT_LIST) {
            // 同意文書一覧ボタン
            buttonConsentListPage(
                consentViewModel = consentViewModel,
            )
        }
        if (pageList != ConsentPage.CONSENT_HISTORY) {
            // 同意履歴ボタン
            buttonConsentHistoryPage(
                consentViewModel = consentViewModel,
            )
        }
        // メニュー画面に戻るボタン
        buttonBackToMenu(
            navController = navController,
            isLoading = !consentViewModel.isLoading.value!!,
            studySubjectId = consentViewModel.studySubjectId,
            studyHospitalId = consentViewModel.studyHospitalId,
            studyHospitalName = consentViewModel.studyHospitalName
        )
    }
}

// トースト表示
@Composable
fun ToastPage(
    consentViewModel: ConsentViewModel = viewModel(),
    consentPdfViewModel: ConsentPdfViewModel = viewModel(),
    consentListViewModel: ConsentListViewModel = viewModel(),
    consentHistoryViewModel: ConsentHistoryViewModel = viewModel(),
    completeWithdraw: Boolean,
    consentProcessStatus: ConsentPdfViewModel.ConsentProcessStatus,
    navController: NavHostController
) {
    if (completeWithdraw) {
        Toast.makeText(
            consentViewModel.getApplication(),
            stringResource(id = R.string.ToastText_WithdrawComplete),
            Toast.LENGTH_SHORT
        ).show()
        consentPdfViewModel.changeCompleteWithdraw(false)
        consentListViewModel.initWrap()
        consentHistoryViewModel.initWrap()
        navController.navigate(Screen.Consent.route + "/${consentViewModel.studySubjectId}/${consentViewModel.studyHospitalId}/${consentViewModel.studyHospitalName}")
    }
    // ダウンロード処理が完了したら、共有ストレージを選択する画面を開いて、PDFをコピーする。
    when (consentProcessStatus) {
        ConsentPdfViewModel.ConsentProcessStatus.ERROR -> {
            Toast.makeText(
                consentPdfViewModel.getApplication(),
                stringResource(id = R.string.ToastText_ConsentProcessError),
                Toast.LENGTH_SHORT
            ).show()
            consentPdfViewModel.changeConsentProcessStatus(ConsentPdfViewModel.ConsentProcessStatus.NONE)
            navController.navigate(Screen.Consent.route + "/${consentViewModel.studySubjectId}/${consentViewModel.studyHospitalId}/${consentViewModel.studyHospitalName}")
        }
        ConsentPdfViewModel.ConsentProcessStatus.COMPLETE -> {
            Toast.makeText(
                consentPdfViewModel.getApplication(),
                stringResource(id = R.string.ToastText_ConsentComplete),
                Toast.LENGTH_SHORT
            ).show()
            consentPdfViewModel.changeConsentProcessStatus(ConsentPdfViewModel.ConsentProcessStatus.NONE)
            consentListViewModel.initWrap()
            consentHistoryViewModel.initWrap()
            navController.navigate(Screen.Consent.route + "/${consentViewModel.studySubjectId}/${consentViewModel.studyHospitalId}/${consentViewModel.studyHospitalName}")
        }
        else -> {
            // 何もしない
        }
    }
}

// 同意・再同意画面ボタン
@Composable
fun buttonConsentPage(
    consentViewModel: ConsentViewModel = viewModel(),
) {
    Row(
        horizontalArrangement = Arrangement.End,
    ) {
        // 同意文書一覧
        ButtonWrapper(
            buttonText = stringResource(id = R.string.ButtonText_DocumentPage),
            enabled = !consentViewModel.isLoading.value!!,
            spacerPadding = paddings.textSmall
        ) {
            consentViewModel.changePageList(ConsentPage.MAIN)
        }
    }
}

// 同意済文書一覧ボタン
@Composable
fun buttonConsentListPage(
    consentViewModel: ConsentViewModel = viewModel(),
) {
    Row(
        horizontalArrangement = Arrangement.End,
    ) {
        // 同意文書一覧
        ButtonWrapper(
            buttonText = stringResource(id = R.string.ButtonText_DocumentListPage),
            enabled = !consentViewModel.isLoading.value!!,
            spacerPadding = paddings.textSmall
        ) {
            consentViewModel.changePageList(ConsentPage.CONSENT_DOCUMENT_LIST)
        }
    }
}

// 同意履歴ボタン
@Composable
fun buttonConsentHistoryPage(
    consentViewModel: ConsentViewModel = viewModel(),
) {
    Row(
        horizontalArrangement = Arrangement.End,
    ) {
        // 同意履歴
        ButtonWrapper(
            buttonText = stringResource(id = R.string.ButtonText_DocumentHistoryPage),
            enabled = !consentViewModel.isLoading.value!!,
            spacerPadding = paddings.textSmall
        ) {
            consentViewModel.changePageList(ConsentPage.CONSENT_HISTORY)
        }
    }
}


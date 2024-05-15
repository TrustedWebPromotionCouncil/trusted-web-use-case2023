package com.example.wearable.trustapp.biowatcher.views.screen.consent


import android.widget.Toast
import androidx.compose.foundation.ExperimentalFoundationApi
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.rounded.Info
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Icon
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.livedata.observeAsState
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.colorResource
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavHostController
import com.example.wearable.pdfcomposesample.PdfViewer
import com.example.wearable.trustapp.R
import com.example.wearable.trustapp.biowatcher.common.Constants.COLON
import com.example.wearable.trustapp.biowatcher.common.Util.Companion.toYYYYMMDDString
import com.example.wearable.trustapp.biowatcher.viewModel.consent.ConsentAction
import com.example.wearable.trustapp.biowatcher.viewModel.consent.ConsentAction.CONSENT
import com.example.wearable.trustapp.biowatcher.viewModel.consent.ConsentAction.NONE
import com.example.wearable.trustapp.biowatcher.viewModel.consent.ConsentAction.RECONSENT
import com.example.wearable.trustapp.biowatcher.viewModel.consent.ConsentAction.WITHDRAW
import com.example.wearable.trustapp.biowatcher.viewModel.consent.ConsentViewModel
import com.example.wearable.trustapp.biowatcher.views.layout.ButtonWrapper
import com.example.wearable.trustapp.biowatcher.views.layout.SimpleFilledTextFieldSample1
import com.example.wearable.trustapp.biowatcher.views.navigation.TextSwitcher
import com.example.wearable.trustapp.biowatcher.views.ui.theme.Red40
import com.example.wearable.trustapp.biowatcher.views.ui.theme.Typography
import com.example.wearable.trustapp.biowatcher.views.ui.theme.paddings
import java.time.LocalDate


// PDF表示
@OptIn(ExperimentalFoundationApi::class)
@Composable
fun ConsentPdfScreen(
    navController: NavHostController,
    modifier: Modifier = Modifier,
    consentPdfViewModel: ConsentPdfViewModel = viewModel(),
) {
    val updateLoading by consentPdfViewModel.updateLoading.observeAsState(false)
    val pdfPage by consentPdfViewModel.pdfPage.observeAsState(ConsentPdfViewModel.PdfPage.Consent)

    Box {
        if (updateLoading) {
            Column(
                modifier = Modifier.fillMaxSize(),
                verticalArrangement = Arrangement.Center,
                horizontalAlignment = Alignment.CenterHorizontally
            ) {

                val txtCreatingPersona = stringResource(id = R.string.Text_ConsentLoadingPDF)
                TextSwitcher(
                    listOf(
                        "$txtCreatingPersona.",
                        "$txtCreatingPersona..",
                        "$txtCreatingPersona..."
                    ), Red40
                )
            }
        } else {
            if (pdfPage == ConsentPdfViewModel.PdfPage.Consent) {
                pdfScreen(
                    navController = navController,
                    modifier = modifier,
                    consentPdfViewModel = consentPdfViewModel,
                )
            } else if (pdfPage == ConsentPdfViewModel.PdfPage.Withdraw) {
                consentPdfViewModel.openFile()
                WithdrawPdfScreen(
                    navController = navController,
                    modifier = modifier
                        .fillMaxWidth(1f)
                        .background(
                            colorResource(id = R.color.light_yellow),
                        )
                        .padding(paddings.textSmall),
                    onChangeStartDate = consentPdfViewModel::changeWithdrawDate
                )
            }
        }

        AlertConsent(
            consentPdfViewModel = consentPdfViewModel,
        )
        AlertWithdraw(
            consentPdfViewModel = consentPdfViewModel,
            consentAction = WITHDRAW,
        )
    }
}

@OptIn(ExperimentalFoundationApi::class)
@Composable
fun pdfScreen(
    navController: NavHostController,
    modifier: Modifier,
    consentPdfViewModel: ConsentPdfViewModel
) {
    val documentStream by consentPdfViewModel.documentStream.observeAsState(null)
    var isPdfLoading by remember {
        mutableStateOf(false)
    }
    var currentLoadingPage by remember {
        mutableStateOf<Int?>(null)
    }
    var pdfPageCount by remember {
        mutableStateOf<Int?>(null)
    }

    if (documentStream == null) {
        Column(
            modifier = Modifier.fillMaxSize(),
            verticalArrangement = Arrangement.Center,
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            val txtCreatingPersona = stringResource(id = R.string.Text_LoadingPDF)
            TextSwitcher(
                listOf(
                    "$txtCreatingPersona.",
                    "$txtCreatingPersona..",
                    "$txtCreatingPersona..."
                ), Red40
            )
        }
    } else {
        PdfViewer(
            modifier = modifier,
            pdfStream = documentStream!!,
            fallbackWidget = {
                Icon(
                    Icons.Rounded.Info,
                    contentDescription = "Error Component"
                )
            },
            loadingListener = { loading, currentPage, maxPage ->
                isPdfLoading = loading
                if (currentPage != null) currentLoadingPage = currentPage
                if (maxPage != null) pdfPageCount = maxPage
            }
        )
    }
    if (isPdfLoading) {
        Column(
            modifier = Modifier.fillMaxSize(),
            verticalArrangement = Arrangement.Center
        ) {
            LinearProgressIndicator(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 30.dp),
                progress = if (currentLoadingPage == null || pdfPageCount == null) 0f
                else currentLoadingPage!!.toFloat() / pdfPageCount!!.toFloat()
            )
            Text(
                modifier = Modifier
                    .align(Alignment.End)
                    .padding(top = 5.dp)
                    .padding(horizontal = 30.dp),
                text = "${currentLoadingPage ?: "-"} ページ / 計 ${pdfPageCount ?: "-"}ページ"
            )
        }
    }
}


// 同意・再同意・撤回ボタン
@Composable
fun buttonConsent(
    navController: NavHostController,
    consentViewModel: ConsentViewModel = viewModel(),
    consentPdfViewModel: ConsentPdfViewModel = viewModel(),
    isConsent: Boolean = false
) {
    val consentType by consentPdfViewModel.consentType.observeAsState(
        NONE
    )

    Row(
        horizontalArrangement = Arrangement.End,
    ) {
        when (consentType) {
            CONSENT, RECONSENT -> {
                val consentAction =
                    if (consentType == CONSENT) CONSENT
                    else RECONSENT

                // 同意
                ButtonWrapper(
                    buttonText = stringResource(id = R.string.ButtonText_Consent),
                    enabled = !consentViewModel.isLoading.value!!,
                    spacerPadding = paddings.textSmall
                ) {
                    consentPdfViewModel.changeConsentAlertDialogFlg(true)
                }
            }

            WITHDRAW -> {
                // 撤回
                ButtonWrapper(
                    buttonText = stringResource(id = R.string.ButtonText_Withdraw),
                    enabled = !consentViewModel.isLoading.value!!,
                    spacerPadding = paddings.textSmall
                ) {
                    consentPdfViewModel.setPdfPage(ConsentPdfViewModel.PdfPage.Withdraw)
                }
            }

            NONE -> {
                // 何もしない
            }
        }
    }
}

@Composable
fun WithdrawPdfScreen(
    navController: NavHostController,
    modifier: Modifier = Modifier,
    consentViewModel: ConsentViewModel = viewModel(),
    consentPdfViewModel: ConsentPdfViewModel = viewModel(),
    onChangeStartDate: (String) -> Unit,
) {
    val withdrawDate by consentPdfViewModel.withdrawDate.observeAsState(LocalDate.now())
    val withdrawReason by consentPdfViewModel.withdrawReason.observeAsState("")

    // 同意履歴
    Row(
        modifier = modifier
    ) {
        Box {
            LazyColumn(
                verticalArrangement = Arrangement.Center
            ) {
                item {
                    Text(
                        text = stringResource(id = R.string.Text_Withdraw),
                        style = Typography.bodyMedium,
                        modifier = Modifier.padding(bottom = 10.dp)
                    )
                }
                item {
                    // 撤回日
                    Text(
                        text = stringResource(id = R.string.Text_WithdrawDate) + COLON + toYYYYMMDDString(
                            withdrawDate
                        ),
                        modifier = Modifier.padding(bottom = paddings.textSmall)
                    )
                }
                item {
                    SimpleFilledTextFieldSample1(
                        label = stringResource(id = R.string.Text_WithdrawReason),
                        textValue = withdrawReason,
                        modifier = Modifier.padding(bottom = 10.dp),
                        onDateChange = consentPdfViewModel::changeWithdrawReason,
                    )
                }
                item {
                    Text(
                        text = stringResource(id = R.string.Text_WithdrawAlert),
                        color = Red40,
                        modifier = Modifier.padding(bottom = paddings.textSmall)
                    )
                }
                item {
                    Row {
                        val toastText = stringResource(id = R.string.ToastText_WithdrawReason)
                        ButtonWrapper(
                            buttonText = stringResource(id = R.string.ButtonText_Back),
                            enabled = !consentViewModel.isLoading.value!!,
                            spacerPadding = paddings.textSmall,
                            buttonModifier = Modifier.padding(end = paddings.buttonMedium)
                        ) {
                            consentPdfViewModel.setPdfPage(ConsentPdfViewModel.PdfPage.Consent)
                        }
                        ButtonWrapper(
                            colors = androidx.compose.material3.ButtonDefaults.buttonColors(
                                containerColor = Red40
                            ),
                            buttonText = stringResource(id = R.string.ButtonText_Withdraw),
                            enabled = !consentViewModel.isLoading.value!!,
                            spacerPadding = paddings.textSmall
                        ) {
                            if (withdrawReason == "") {
                                // Toastでエラー表示
                                Toast.makeText(
                                    consentPdfViewModel.getApplication(),
                                    toastText,
                                    Toast.LENGTH_SHORT
                                ).show()

                            } else {
                                consentPdfViewModel.changeWithdrawAlertDialogFlg(true)
                            }
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun AlertConsent(
    consentPdfViewModel: ConsentPdfViewModel,
) {
    val consentAlertDialogFlg by consentPdfViewModel.consentAlertDialogFlg.observeAsState(false)
    if (consentAlertDialogFlg) {
        AlertDialog(
            onDismissRequest = {
                consentPdfViewModel.changeConsentAlertDialogFlg(false)
            },
            confirmButton = {
                TextButton(
                    onClick = {
                        consentPdfViewModel.setUpdateLoading(true)
                        consentPdfViewModel.changeConsentAlertDialogFlg(false)
                        consentPdfViewModel.changeConsentProcessStatus(ConsentPdfViewModel.ConsentProcessStatus.PROCESSING)
                        consentPdfViewModel.consentOrReConsentButton(
                            consentPdfViewModel.consentType.value!!,
                        )
                    }
                ) {
                    Text(stringResource(id = R.string.Text_Yes))
                }
            },
            dismissButton = {
                TextButton(
                    onClick = {
                        consentPdfViewModel.changeConsentAlertDialogFlg(false)
                    }
                ) {
                    Text(stringResource(id = R.string.Text_No))
                }
            },
            title = {
                Text(stringResource(id = R.string.Text_Consent))
            },
            text = {
                Text(stringResource(id = R.string.Text_IsConsent))
            },
        )
    }
}

@Composable
fun AlertWithdraw(
    consentPdfViewModel: ConsentPdfViewModel,
    consentAction: ConsentAction,
) {
    val withdrawAlertDialogFlg by consentPdfViewModel.withdrawAlertDialogFlg.observeAsState(false)
    if (withdrawAlertDialogFlg) {
        AlertDialog(
            onDismissRequest = {
                consentPdfViewModel.changeWithdrawAlertDialogFlg(false)
            },
            confirmButton = {
                TextButton(
                    onClick = {
                        consentPdfViewModel.setUpdateLoading(true)
                        consentPdfViewModel.changeWithdrawAlertDialogFlg(false)
                        consentPdfViewModel.withdrawButton(
                            consentAction
                        )
                    }
                ) {
                    Text(stringResource(id = R.string.Text_Withdrawing))
                }
            },
            dismissButton = {
                TextButton(
                    onClick = {
                        consentPdfViewModel.changeWithdrawAlertDialogFlg(false)
                    }
                ) {
                    Text(stringResource(id = R.string.Text_Cancel))
                }
            },
            title = {
                Text(stringResource(id = R.string.Text_Withdraw))
            },
            text = {
                Text(stringResource(id = R.string.Text_IsWithdraw))
            },
        )
    }
}

@Composable
fun SigningOrWithdrawnScreen(text: String) {
    Row(
        modifier = Modifier
            .fillMaxWidth(1f)
            .height(500.dp)
            .background(
                colorResource(id = R.color.light_yellow),
            )
    ) {
        Text(text = text)
    }
}


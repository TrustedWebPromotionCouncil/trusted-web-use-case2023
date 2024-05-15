package com.example.wearable.trustapp.biowatcher.views.screen.auditTrail

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.livedata.observeAsState
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavHostController
import com.example.wearable.trustapp.R
import com.example.wearable.trustapp.biowatcher.common.Util
import com.example.wearable.trustapp.biowatcher.viewModel.audit.AuditViewModel
import com.example.wearable.trustapp.biowatcher.viewModel.audit.AuditViewModel.SearchStatus.NONE
import com.example.wearable.trustapp.biowatcher.viewModel.audit.AuditViewModel.SearchStatus.SEARCHING
import com.example.wearable.trustapp.biowatcher.viewModel.audit.AuditViewModel.SearchStatus.COMPLETE
import com.example.wearable.trustapp.biowatcher.views.layout.ButtonWrapper
import com.example.wearable.trustapp.biowatcher.views.layout.LoadingContentLayout
import com.example.wearable.trustapp.biowatcher.views.layout.buttonBackToMenu
import com.example.wearable.trustapp.biowatcher.views.screen.consent.TableListScreen
import com.example.wearable.trustapp.biowatcher.views.screen.subjectData.InputDateTextField
import com.example.wearable.trustapp.biowatcher.views.ui.theme.paddings
import java.time.LocalDate

@Composable
fun AuditLayout(
    navController: NavHostController,
    auditViewModel: AuditViewModel = viewModel(),
) {
    val searchStatus by auditViewModel.searchStatus.observeAsState(NONE)
    val titleText = stringResource(id = R.string.Screen_AuditTrail)
    LoadingContentLayout(
        titleText = titleText,
        loading = searchStatus == SEARCHING,
        screenContent = {
            AuditScreen(
                navController = navController,
                searchStatus = searchStatus,
            )
        }
    )
}

@Composable
fun AuditScreen(
    navController: NavHostController,
    searchStatus: AuditViewModel.SearchStatus,
    auditViewModel: AuditViewModel = viewModel(),
) {
    val startDate: LocalDate by auditViewModel.startDate.observeAsState(LocalDate.now())
    val endDate: LocalDate by auditViewModel.endDate.observeAsState(LocalDate.now())
    val isDataListPresent by auditViewModel.isDataListPresent.observeAsState(false)

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(paddings.textMedium)
            .verticalScroll(
                rememberScrollState()
            ),
        horizontalAlignment = Alignment.End,
    ) {
        when (searchStatus) {
            NONE,SEARCHING -> {
                AuditSearchContents(
                    navController = navController,
                    startDate = startDate,
                    endDate = endDate,
                    onChangeStartDate = auditViewModel::changeStartDate,
                    onChangeEndDate = auditViewModel::changeEndDate,
                    onSearchAuditTrail = { auditViewModel.searchAuditTrail() },
                    isLoading = searchStatus == SEARCHING,
                    studySubjectId = auditViewModel.studySubjectId,
                    studyHospitalId = auditViewModel.studyHospitalId,
                    studyHospitalName = auditViewModel.studyHospitalName
                )
            }

            COMPLETE -> {
                if (isDataListPresent) {
                    TableListScreen(
                        navController = navController,
                        modifier = Modifier
                            .fillMaxHeight(0.6f)
                            .padding(paddings.textSmall),
                        columnCount = auditViewModel.columnCount,
                        rowCount = auditViewModel.rowCount,
                        documentColumnName = auditViewModel.columnName,
                        documentListArray = auditViewModel.auditListArray
                    )
                } else {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth(1f)
                            .height(200.dp)
                    ) {
                        Text(text = stringResource(id = R.string.Text_NoAuditTrail))
                    }
                }
                Row {
                    // 戻るボタン
                    ButtonWrapper(
                        buttonText = stringResource(id = R.string.ButtonText_Back),
                        enabled = true,
                        spacerPadding = paddings.textSmall
                    ) {
                        auditViewModel.backToSearchScreen()
                    }
                }
            }
        }
    }
}

@Composable
fun AuditSearchContents(
    navController: NavHostController,
    startDate: LocalDate,
    endDate: LocalDate,
    onChangeStartDate: (String) -> Unit,
    onChangeEndDate: (String) -> Unit,
    onSearchAuditTrail: () -> Unit = {},
    isLoading:Boolean = false,
    studySubjectId: String,
    studyHospitalId: String,
    studyHospitalName: String,
) {
    Column(
        verticalArrangement = Arrangement.Center
    ) {
        // [表示期間]
        Text(text = "[" + stringResource(id = R.string.Text_Period) + "]")
        Row(
            modifier = Modifier.padding(bottom = paddings.buttonSmall),
            horizontalArrangement = Arrangement.Start,
            verticalAlignment = Alignment.CenterVertically
        ) {
            InputDateTextField(
                label = stringResource(id = R.string.Text_StartDate),
                textValue = Util.toYYYYMMDDString(startDate),
                onDateChange = onChangeStartDate
            )
        }
        Row(
            modifier = Modifier.padding(bottom = paddings.buttonSmall),
            horizontalArrangement = Arrangement.Start,
            verticalAlignment = Alignment.CenterVertically
        ) {
            InputDateTextField(
                label = stringResource(id = R.string.Text_EndDate),
                textValue = Util.toYYYYMMDDString(endDate),
                onDateChange = onChangeEndDate
            )
        }
    }
    Row {
        // 検索ボタン
        ButtonWrapper(
            stringResource(id = R.string.ButtonText_Search)
        ) {
            onSearchAuditTrail()
        }
    }
    // メニュー画面に戻るボタン
    buttonBackToMenu(
        navController = navController,
        isLoading = !isLoading,
        studySubjectId = studySubjectId,
        studyHospitalId = studyHospitalId,
        studyHospitalName = studyHospitalName
    )
}


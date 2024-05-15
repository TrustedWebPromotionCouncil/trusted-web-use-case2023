package com.example.wearable.trustapp.biowatcher.views.screen.studySite

import android.widget.Toast
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Button
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.livedata.observeAsState
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.stringResource
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavHostController
import com.example.wearable.trustapp.R
import com.example.wearable.trustapp.biowatcher.common.Constants.COLON
import com.example.wearable.trustapp.biowatcher.viewModel.studySite.StudySiteViewModel
import com.example.wearable.trustapp.biowatcher.viewModel.studySite.StudySubject
import com.example.wearable.trustapp.biowatcher.views.layout.DropdownWrapperForStudySubject
import com.example.wearable.trustapp.biowatcher.views.layout.LoadingContentLayout
import com.example.wearable.trustapp.biowatcher.views.screen.Screen
import com.example.wearable.trustapp.biowatcher.views.ui.theme.paddings

@Composable
fun StudySiteLayout(
    navController: NavHostController,
    studySiteViewModel: StudySiteViewModel = viewModel()
) {
    val isLoading by studySiteViewModel.isLoading.observeAsState(false)
    val titleText = stringResource(id = R.string.Text_StudySite)
    LoadingContentLayout(
        titleText = titleText,
        loading = isLoading,
        screenContent = {
            StudySiteScreen(
                navController = navController,
            )
        }
    )
}

@Composable
fun StudySiteScreen(
    navController: NavHostController,
    studySiteViewModel: StudySiteViewModel = viewModel()
    ) {
    val studySubjectLiveList by studySiteViewModel.studySubjectLiveList.observeAsState(listOf())
    val selectedSubjectId by studySiteViewModel.selectedStudySubjectId.observeAsState("")
    val selectedHospitalName by studySiteViewModel.selectedStudyHospitalName.observeAsState("")
    val selectedHospitalId by studySiteViewModel.selectedHospitalId.observeAsState("")

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(paddings.textMedium),
        verticalArrangement = Arrangement.Center,
        horizontalAlignment = Alignment.End
    ) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            Text(text = stringResource(id = R.string.Text_StudySite) + COLON)
            DropdownWrapperForStudySubject(
                studySubjectLiveList,
                selectedHospitalName,
                studySiteViewModel::changeSelectedItem
            )
        }
        Spacer(modifier = Modifier.height(paddings.buttonSmall))
        Button(
            onClick = {
                if(selectedHospitalId == "") {
                    // Toastでエラー表示
                    Toast.makeText(
                        studySiteViewModel.getApplication(),
                        "試験-病院を選択してください",
                        Toast.LENGTH_SHORT
                    ).show()
                }else{
                    navController.navigate(Screen.Menu.route + "/${selectedSubjectId}/${selectedHospitalId}/${selectedHospitalName}")
                }
            },
        ) {
            Text(text = stringResource(id = R.string.ButtonText_Select))
        }
        Spacer(modifier = Modifier.height(paddings.buttonMedium))
        Button(
            onClick = {
                navController.navigate(Screen.Top.route)
            },
        ) {
            Text(text = stringResource(id = R.string.ButtonText_BackToTop))
        }
    }
}

package com.example.wearable.trustapp.biowatcher.views.screen.menu


import android.widget.Toast
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.stringResource
import androidx.navigation.NavHostController
import com.example.wearable.trustapp.R
import com.example.wearable.trustapp.biowatcher.service.BoxService
import com.example.wearable.trustapp.biowatcher.views.layout.ButtonWrapper
import com.example.wearable.trustapp.biowatcher.views.screen.Screen
import com.example.wearable.trustapp.biowatcher.views.ui.theme.paddings

@Composable
fun MenuScreen(
    navController: NavHostController,
    studySubjectId: String,
    studyHospitalId: String,
    studyHospitalName: String,
) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(paddings.textMedium)
            .verticalScroll(
                rememberScrollState()
            ),
        verticalArrangement = Arrangement.Center,
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        ButtonWrapper(
            stringResource(id = R.string.Screen_Consent)
        ) { navController.navigate("${Screen.Consent.route}/${studySubjectId}/${studyHospitalId}/${studyHospitalName}") }
        ButtonWrapper(
            stringResource(id = R.string.Screen_SubjectData),
        ) { navController.navigate("${Screen.SubjectData.route}/${studySubjectId}/${studyHospitalId}/${studyHospitalName}") }
        ButtonWrapper(
            stringResource(id = R.string.Screen_WearableManage),
        ) { navController.navigate("${Screen.WearableManage.route}/${studySubjectId}/${studyHospitalId}/${studyHospitalName}") }
        ButtonWrapper(
            stringResource(id = R.string.Screen_AuditTrail),
        ) { navController.navigate("${Screen.AuditTrail.route}/${studySubjectId}/${studyHospitalId}/${studyHospitalName}") }
        ButtonWrapper(
            stringResource(id = R.string.ButtonText_BackToTop),
        ) {
            navController.navigate(Screen.Top.route)
        }
    }
}


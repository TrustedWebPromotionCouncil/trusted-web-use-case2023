package com.example.wearable.trustapp.biowatcher.views.layout

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.runtime.Composable
import androidx.compose.ui.res.stringResource
import androidx.navigation.NavHostController
import com.example.wearable.trustapp.R
import com.example.wearable.trustapp.biowatcher.views.screen.Screen
import com.example.wearable.trustapp.biowatcher.views.ui.theme.paddings

// メニューに戻るボタン
@Composable
fun buttonBackToMenu(
    navController: NavHostController,
    isLoading: Boolean,
    studySubjectId: String,
    studyHospitalId: String,
    studyHospitalName: String
) {
    Row(
        horizontalArrangement = Arrangement.End,
    ) {
        ButtonWrapper(
            buttonText = stringResource(id = R.string.ButtonText_BackToMenu),
            enabled = isLoading,
            spacerPadding = paddings.textSmall
        ) {
            navController.navigate(Screen.Menu.route + "/${studySubjectId}/${studyHospitalId}/${studyHospitalName}")
        }
    }
}

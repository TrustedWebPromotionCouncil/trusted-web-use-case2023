package com.example.wearable.trustapp.biowatcher.views.layout

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Divider
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.colorResource
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.unit.dp
import com.example.wearable.trustapp.R
import com.example.wearable.trustapp.biowatcher.views.ui.theme.Typography
import com.example.wearable.trustapp.biowatcher.views.ui.theme.paddings

// コンテンツベース
@Composable
fun LoadingContentLayout(
    titleText: String?,
    loading: Boolean,
    screenContent: @Composable () -> Unit
) {
    Box(
        modifier = Modifier
            .fillMaxSize()
//            .background(Color.Black.copy(alpha = 0.5f))
//            .clickable(onClick = { /* 何もしない */ }, enabled = false)
    ) {
        if (loading) {
            // メッセージを表示
            Text(
                text = stringResource(id = R.string.Text_Loading),
                color = Color.Gray,
                modifier = Modifier.align(Alignment.Center)
            )
            // ローディングアニメーションを表示
            CircularProgressIndicator(
                color = Color.Gray,
                modifier = Modifier
                    .align(Alignment.Center)
                    .padding(top = 8.dp) // メッセージとの余白
            )
        }
        Column {
            titleText?.let { TitleBarLayout(titleText = it) }
            screenContent()
        }
    }
}

@Composable
fun Spinner(color: Color = Color.Black) {
    Column(
        modifier = Modifier.fillMaxSize(),
        verticalArrangement = Arrangement.Center,
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        CircularProgressIndicator(color = color)
    }
}
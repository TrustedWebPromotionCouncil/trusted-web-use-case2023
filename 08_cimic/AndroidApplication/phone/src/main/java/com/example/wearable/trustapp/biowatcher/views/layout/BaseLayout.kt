package com.example.wearable.trustapp.biowatcher.views.layout

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Divider
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.colorResource
import androidx.compose.ui.unit.dp
import com.example.wearable.trustapp.R
import com.example.wearable.trustapp.biowatcher.views.ui.theme.Typography
import com.example.wearable.trustapp.biowatcher.views.ui.theme.paddings

// コンテンツベース
@Composable
fun ContentsLayout(
    titleText: String?, screenContent: @Composable () -> Unit
) {
    Column {
        titleText?.let { TitleBarLayout(titleText = it) }

        screenContent()
    }
}
// コンテンツベース
@Composable
fun ContentsLayout2(
    titleText: String?, screenContent: @Composable () -> Unit
) {
    Column {
        titleText?.let { TitleBarLayout(titleText = it) }

        screenContent()
    }
}

// タイトルバー
@Composable
fun TitleBarLayout(titleText: String) {
    Column(
        Modifier
            .background(Color.LightGray)
    ) {
        Row{
            Text(
                text = titleText, fontSize = Typography.headlineSmall.fontSize,
                modifier = Modifier.padding(paddings.textSmall)
            )
        }
        Divider(
            color = colorResource(id = R.color.black),
            thickness = 0.5.dp
        )
    }
}

package com.example.wearable.trustapp.biowatcher.views.components

import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.tween
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import com.example.wearable.trustapp.biowatcher.views.theme.Black
import com.example.wearable.trustapp.biowatcher.views.theme.paddings
import kotlin.math.roundToInt

@Composable
fun TextSwitcher(texts: List<String>, targetColor: Color = Black) {
    if (texts.size == 0) {
        return
    }
    // 無限に繰り返すアニメーションを作成する
    val infiniteTransition = rememberInfiniteTransition()
    // 1秒ごとにインデックスを切り替えるアニメーションを定義する
    val animation = infiniteTransition.animateFloat(
        initialValue = 0f,
        targetValue = (1f * (texts.size - 1)),
        animationSpec = infiniteRepeatable(
            animation = tween(durationMillis = 1000 * texts.size),
            repeatMode = RepeatMode.Restart
        )
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

package com.example.wearable.trustapp.biowatcher.views.layout

import androidx.compose.foundation.layout.Arrangement.Absolute.Center
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.height
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonColors
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.Dp
import com.example.wearable.trustapp.biowatcher.views.ui.theme.paddings

@Composable
fun ButtonWrapper(
    buttonText: String,
    enabled: Boolean = true,
    spacerPadding: Dp = paddings.buttonSmall,
    buttonModifier: Modifier = Modifier,
    textModifier: Modifier = Modifier,
    textAlignment: TextAlign = TextAlign.Center,
    colors: ButtonColors = ButtonDefaults.buttonColors(),
    spacerFlg : Boolean = true,
    onClickEvent : () -> Unit
) {
    Button(
        modifier = buttonModifier,
        colors = colors,
        onClick = {
            onClickEvent()
        },
        enabled = enabled
    ) {
        Text(text = buttonText, modifier = textModifier, textAlign = textAlignment)
    }
    if (spacerFlg) Spacer(modifier = Modifier.height(spacerPadding))
}
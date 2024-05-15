package com.example.wearable.trustapp.biowatcher.views.layout

import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.PressInteraction
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.material3.TextField
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import com.example.wearable.trustapp.biowatcher.common.Util
import com.example.wearable.trustapp.biowatcher.views.screen.subjectData.showDatePicker
import com.example.wearable.trustapp.biowatcher.views.ui.theme.paddings

@Composable
fun SimpleFilledTextFieldSample() {
    var text by remember { mutableStateOf("") }

    TextField(
        value = text,
        onValueChange = { text = it },
        label = { Text("Label") }
    )
}

@Composable
fun SimpleFilledTextFieldSample1(
    label: String,
    textValue : String,
    singleLine: Boolean = false,
    modifier: Modifier = Modifier
        .fillMaxSize()
        .padding(bottom = paddings.buttonSmall),
    onDateChange: (String) -> Unit
) {
    Text(text = "$label : ")
    OutlinedTextField(
        value = textValue,
        onValueChange = { onDateChange(it) },
        modifier = modifier,
        singleLine = singleLine,
    )
}
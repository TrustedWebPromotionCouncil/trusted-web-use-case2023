package com.example.wearable.trustapp.biowatcher.views.theme

import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.wear.compose.material.Typography

// Set of Material typography styles to start with
val WearTypography = Typography(
    body1 = TextStyle(
        fontFamily = FontFamily.Default,
        fontWeight = FontWeight.Normal,
        fontSize = 16.sp
    )
    /* Other default text styles to override
    button = TextStyle(
        fontFamily = FontFamily.Default,
        fontWeight = FontWeight.W500,
        fontSize = 14.sp
    ),
    caption = TextStyle(
        fontFamily = FontFamily.Default,
        fontWeight = FontWeight.Normal,
        fontSize = 12.sp
    )
    */
)

val paddings = Paddings(
    textSmall = 10.dp,
    textMedium = 20.dp,
    textLarge = 30.dp,
    textBigLarge = 60.dp,
    buttonSmall = 30.dp,
    buttonMedium = 40.dp,
    buttonLarge = 50.dp,
    dropdownSmall = 15.dp,
    dropdownMedium = 20.dp,
    dropdownLarge = 25.dp,
)

class Paddings(
    textSmall: Dp,
    textMedium: Dp,
    textLarge: Dp,
    textBigLarge: Dp,
    buttonSmall: Dp,
    buttonMedium: Dp,
    buttonLarge: Dp,
    dropdownSmall: Dp,
    dropdownMedium: Dp,
    dropdownLarge: Dp,
) {
    val textSmall = textSmall
    val textMedium = textMedium
    val textLarge = textLarge
    val textBigLarge = textBigLarge
    val buttonSmall = buttonSmall
    val buttonMedium = buttonMedium
    val buttonLarge = buttonLarge
    val dropdownSmall = dropdownSmall
    val dropdownMedium = dropdownMedium
    val dropdownLarge = dropdownLarge
}

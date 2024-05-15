package com.example.wearable.trustapp.biowatcher.views.theme

import androidx.compose.ui.graphics.Color
import androidx.wear.compose.material.Colors

internal data class ThemeValues(val description: String, val colors: Colors)

internal val initialThemeValues = ThemeValues(
    "Lilac (D0BCFF)",
    Colors(
        primary = Color(0xFFD0BCFF),
        primaryVariant = Color(0xFF9A82DB),
        secondary = Color(0xFF7FCFFF),
        secondaryVariant = Color(0xFF3998D3)
    )
)
internal val themeValues = listOf(
    initialThemeValues,
    ThemeValues("Blue (Default AECBFA)", Colors()),
    ThemeValues(
        "Blue 2 (7FCFFF)",
        Colors(
            primary = Color(0xFF7FCFFF),
            primaryVariant = Color(0xFF3998D3),
            secondary = Color(0xFF6DD58C),
            secondaryVariant = Color(0xFF1EA446)
        )
    ),
    ThemeValues(
        "Green (6DD58C)",
        Colors(
            primary = Color(0xFF6DD58C),
            primaryVariant = Color(0xFF1EA446),
            secondary = Color(0xFFFFBB29),
            secondaryVariant = Color(0xFFD68400)
        )
    )
)
val Purple80 = Color(0xFFD0BCFF)
val PurpleGrey80 = Color(0xFFCCC2DC)
val Pink80 = Color(0xFFEFB8C8)

val Purple40 = Color(0xFF6650a4)
val PurpleGrey40 = Color(0xFF625b71)
val Pink40 = Color(0xFF7D5260)

val Red40 = Color(0xFFE53935)
val Black = Color(0xFF000000)

//val Purple200 = Color(0xFFBB86FC)
//val Purple500 = Color(0xFF6200EE)
//val Purple700 = Color(0xFF3700B3)
//val Teal200 = Color(0xFF03DAC5)
//val Red400 = Color(0xFFCF6679)

//internal val wearColorPalette: Colors = Colors(
//    primary = Purple200,
//    primaryVariant = Purple700,
//    secondary = Teal200,
//    secondaryVariant = Teal200,
//    error = Red400,
//    onPrimary = Color.Black,
//    onSecondary = Color.Black,
//    onError = Color.Black
//)

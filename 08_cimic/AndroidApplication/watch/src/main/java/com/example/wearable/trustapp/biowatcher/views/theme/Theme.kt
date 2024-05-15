package com.example.wearable.trustapp.biowatcher.views.theme

import androidx.compose.runtime.Composable
import androidx.wear.compose.material.MaterialTheme

@Composable
fun TrustedAppTheme(
    content: @Composable () -> Unit
) {
    MaterialTheme(
        colors = initialThemeValues.colors,
        typography = WearTypography,
        // For shapes, we generally recommend using the default Material Wear shapes which are
        // optimized for round and non-round devices.
        content = content
    )
}
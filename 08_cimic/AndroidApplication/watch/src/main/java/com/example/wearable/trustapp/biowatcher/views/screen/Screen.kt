package com.example.wearable.trustapp.biowatcher.views.screen

sealed class Screen(
    val route: String
) {
    object Top : Screen("TopScreen")
}

package com.example.wearable.trustapp.biowatcher.views.screen

sealed class Screen(
    val route: String
) {
//    object Menu : Screen(route = "Menu/{studyHospitalId}")
    object Menu : Screen(route = "Menu")
    object Top : Screen(route = "Top")
    object QRReading : Screen(route = "QRReading")
    object StudySite : Screen(route = "StudySite")
    object Consent : Screen(route = "Consent")
    object SubjectData : Screen(route = "SubjectData")
    object WearableManage : Screen(route = "WearableManage")
    object AuditTrail : Screen(route = "AuditTrail")
}
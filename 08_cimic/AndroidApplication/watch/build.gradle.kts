plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
    id("com.google.devtools.ksp")
    id("kotlinx-serialization")
}

android {
    namespace = "com.example.wearable.trustapp"
    compileSdk = 34

    defaultConfig {
        applicationId = "com.example.wearable.trustapp"
        minSdk = 26
        targetSdk = 33
        versionCode = 1
        versionName = "1.0"
        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
        vectorDrawables {
            useSupportLibrary = true
        }

    }

    buildTypes {
        release {
            isMinifyEnabled = false
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
//        sourceCompatibility = JavaVersion.VERSION_1_8
//        targetCompatibility = JavaVersion.VERSION_1_8
    }
    kotlinOptions {
        jvmTarget = "17"
//        jvmTarget = "1.8"
        freeCompilerArgs += "-Xjvm-default=all"
        freeCompilerArgs += "-opt-in=kotlin.RequiresOptIn"
        // Allow for widescale experimental APIs in Alpha libraries we build upon
        freeCompilerArgs += "-opt-in=androidx.wear.compose.material.ExperimentalWearMaterialApi"
        freeCompilerArgs += "-opt-in=androidx.compose.animation.ExperimentalAnimationApi"
        freeCompilerArgs += "-opt-in=com.google.android.horologist.annotations.ExperimentalHorologistApi"
        freeCompilerArgs = listOf("-opt-in=androidx.compose.material3.ExperimentalMaterial3Api")
    }
    buildFeatures {
        compose = true
    }
    composeOptions {
        kotlinCompilerExtensionVersion = "1.4.3"
    }
    packaging {
        resources {
            excludes += "/META-INF/{AL2.0,LGPL2.1}"
        }
    }
}

dependencies {

    implementation("androidx.core:core-ktx:1.9.0")
    implementation("com.google.android.gms:play-services-wearable:18.1.0")
    implementation("androidx.percentlayout:percentlayout:1.0.0")
    implementation("androidx.legacy:legacy-support-v4:1.0.0")
    implementation("androidx.recyclerview:recyclerview:1.3.1")
    implementation(platform("androidx.compose:compose-bom:2022.10.00"))
    implementation("androidx.compose.ui:ui")
    implementation("androidx.compose.ui:ui-tooling-preview")
    implementation("androidx.wear.compose:compose-ui-tooling:1.2.0-alpha09")
    implementation("androidx.wear.compose:compose-material:1.0.0")
    implementation("androidx.wear.compose:compose-foundation:1.0.0")
//    implementation("androidx.lifecycle:lifecycle-runtime-ktx:2.5.1")
    implementation("androidx.lifecycle:lifecycle-runtime-ktx:2.6.2")
    implementation("androidx.activity:activity-compose:1.5.1")
    implementation("androidx.wear.tiles:tiles:1.1.0")
    implementation("androidx.wear.tiles:tiles-material:1.1.0")
    implementation("androidx.compose.material3:material3:1.1.0")
    implementation("com.google.android.horologist:horologist-compose-tools:0.1.5")
    implementation("com.google.android.horologist:horologist-tiles:0.1.5")
    implementation("androidx.wear.watchface:watchface-complications-data-source-ktx:1.1.1")
    implementation("androidx.navigation:navigation-runtime-ktx:2.7.4")
    androidTestImplementation(platform("androidx.compose:compose-bom:2022.10.00"))
    androidTestImplementation("androidx.compose.ui:ui-test-junit4")
    debugImplementation("androidx.compose.ui:ui-tooling")
    debugImplementation("androidx.compose.ui:ui-test-manifest")

    //Navigation コンポーネント[https://developer.android.com/guide/navigation/navigation-getting-started?hl=ja]
    val nav_version = "2.5.2"
    // Jetpack Compose Integration
    implementation("androidx.navigation:navigation-compose:$nav_version")
    implementation("androidx.lifecycle:lifecycle-viewmodel-compose:2.5.1")
    implementation("androidx.hilt:hilt-navigation-compose:1.1.0-alpha01")

    // Gateway
    // [https://developer.android.com/jetpack/androidx/releases/lifecycle?hl=ja]
    // val lifecycle_version = "1.1.1"
    // ViewModel and LiveData[https://developer.android.com/jetpack/compose/state?hl=ja]
    implementation("androidx.lifecycle:lifecycle-runtime-compose:2.6.0-beta01")
    implementation("androidx.compose.runtime:runtime-livedata:1.3.2")

    // rememberSwipeDismissableNavController
    val wear_compose_version = "1.2.0"
    implementation("androidx.wear.compose:compose-navigation:$wear_compose_version")
    // Performance
    implementation("androidx.metrics:metrics-performance:1.0.0-alpha03")

    // horogist
    val horologist_version = "0.5.7"
    implementation("com.google.android.horologist:horologist-composables:$horologist_version")
    implementation("com.google.android.horologist:horologist-compose-layout:$horologist_version")
    implementation("com.google.android.horologist:horologist-compose-material:$horologist_version")

    // Wearable Data Layer API を使用してデータを送信、同期する
    // [https://developer.android.com/training/wearables/data/data-layer?hl=ja#bluetooth]
    implementation("com.google.android.gms:play-services-wearable:18.1.0")

    //    androidx.wear
    implementation("androidx.wear:wear:1.3.0")
    // https://developer.android.com/training/wearables/health-services/active?hl=ja
//    implementation("androidx.health:health-services-client:1.0.0-beta02")

    // SQLiteライブラリのroomを使用
    val room_version = "2.5.0"
    implementation("androidx.room:room-runtime:$room_version")
    implementation("androidx.room:room-ktx:$room_version")
    ksp("androidx.room:room-compiler:$room_version")
//    annotationProcessor("androidx.room:room-compiler:$room_version")

    // Kotlin + coroutines
    val work_version = "2.8.0"
    implementation("androidx.work:work-runtime-ktx:$work_version")
    implementation("com.google.firebase:firebase-inappmessaging-ktx:20.3.5")

    // シリアル化(json)
    implementation("org.jetbrains.kotlinx:kotlinx-serialization-json:1.5.1")
}
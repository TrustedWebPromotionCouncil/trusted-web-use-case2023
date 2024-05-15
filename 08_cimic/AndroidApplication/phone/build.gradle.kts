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
            // FitBit
            buildConfigField("String", "FITBIT_USER_ID", "\"${project.property("FITBIT_USER_ID")}\"")
            buildConfigField("String", "FITBIT_CLIENT_ID_01", "\"${project.property("FITBIT_CLIENT_ID_01")}\"")
            buildConfigField("String", "FITBIT_AUTH_CODE_01", "\"${project.property("FITBIT_AUTH_CODE_01")}\"")
            buildConfigField("String", "FITBIT_CLIENT_SECRET_01", "\"${project.property("FITBIT_CLIENT_SECRET_01")}\"")
            buildConfigField("String", "FITBIT_ACCESS_TOKEN_01", "\"${project.property("FITBIT_ACCESS_TOKEN_01")}\"")
            buildConfigField("String", "FITBIT_REFRESH_TOKEN_01", "\"${project.property("FITBIT_REFRESH_TOKEN_01")}\"")
            // BOX
            buildConfigField("String", "BOX_CLIENT_ID", "\"${project.property("BOX_CLIENT_ID")}\"")
            buildConfigField("String", "BOX_CLIENT_SECRET", "\"${project.property("BOX_CLIENT_SECRET")}\"")
            buildConfigField("String", "BOX_USER_ID", "\"${project.property("BOX_USER_ID")}\"")
            isMinifyEnabled = false
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
        debug{
            // FitBit
            buildConfigField("String", "FITBIT_USER_ID", "\"${project.property("FITBIT_USER_ID")}\"")
            buildConfigField("String", "FITBIT_CLIENT_ID_01", "\"${project.property("FITBIT_CLIENT_ID_01")}\"")
            buildConfigField("String", "FITBIT_AUTH_CODE_01", "\"${project.property("FITBIT_AUTH_CODE_01")}\"")
            buildConfigField("String", "FITBIT_CLIENT_SECRET_01", "\"${project.property("FITBIT_CLIENT_SECRET_01")}\"")
            buildConfigField("String", "FITBIT_ACCESS_TOKEN_01", "\"${project.property("FITBIT_ACCESS_TOKEN_01")}\"")
            buildConfigField("String", "FITBIT_REFRESH_TOKEN_01", "\"${project.property("FITBIT_REFRESH_TOKEN_01")}\"")
            // BOX
            buildConfigField("String", "BOX_CLIENT_ID", "\"${project.property("BOX_CLIENT_ID")}\"")
            buildConfigField("String", "BOX_CLIENT_SECRET", "\"${project.property("BOX_CLIENT_SECRET")}\"")
            buildConfigField("String", "BOX_USER_ID", "\"${project.property("BOX_USER_ID")}\"")
            // TD Sever URL
            buildConfigField("String", "TD_SERVER_URL", "\"${project.property("TD_SERVER_URL")}\"")
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
        allWarningsAsErrors = false
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
    implementation("androidx.lifecycle:lifecycle-extensions:2.2.0")
    implementation("androidx.lifecycle:lifecycle-runtime-ktx:2.6.2")
    implementation("androidx.activity:activity-compose:1.7.2")
    implementation(platform("androidx.compose:compose-bom:2023.03.00"))
    implementation("androidx.compose.ui:ui")
    implementation("androidx.compose.ui:ui-graphics")
    implementation("androidx.compose.ui:ui-tooling-preview")
    implementation("androidx.compose.material3:material3:1.1.0")
    testImplementation("junit:junit:4.13.2")
    androidTestImplementation("androidx.test.ext:junit:1.1.5")
    androidTestImplementation("androidx.test.espresso:espresso-core:3.5.1")
    androidTestImplementation(platform("androidx.compose:compose-bom:2023.03.00"))
    androidTestImplementation("androidx.compose.ui:ui-test-junit4")
    debugImplementation("androidx.compose.ui:ui-tooling")
    debugImplementation("androidx.compose.ui:ui-test-manifest")
    // https://developer.android.com/jetpack/androidx/releases/appcompat?hl=ja
    val appcompat_version = "1.6.1"

    implementation("androidx.appcompat:appcompat:$appcompat_version")
    // For loading and tinting drawables on older versions of the platform
    implementation("androidx.appcompat:appcompat-resources:$appcompat_version")

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

    // CameraX core library using the camera2 implementation
    // [https://developer.android.com/training/camerax/architecture?hl=ja]
    val camerax_version = "1.3.0-alpha04"
    // The following line is optional, as the core library is included indirectly by camera-camera2
    implementation("androidx.camera:camera-core:${camerax_version}")
    implementation("androidx.camera:camera-camera2:${camerax_version}")
    // If you want to additionally use the CameraX Lifecycle library
    implementation("androidx.camera:camera-lifecycle:${camerax_version}")
    // If you want to additionally use the CameraX VideoCapture library
    implementation("androidx.camera:camera-video:${camerax_version}")
    // If you want to additionally use the CameraX View class
    implementation("androidx.camera:camera-view:${camerax_version}")
    // If you want to additionally use the CameraX Extensions library
    implementation("androidx.camera:camera-extensions:${camerax_version}")

    // MLKit barcode-scanning
    // [https://developers.google.com/ml-kit/vision/barcode-scanning/android?hl=ja]
    implementation("com.google.mlkit:barcode-scanning:17.2.0")

    // MPAndroidChart
    implementation("com.github.PhilJay:MPAndroidChart:v3.1.0")

    // Wearable Data Layer API を使用してデータを送信、同期する
    // [https://developer.android.com/training/wearables/data/data-layer?hl=ja#bluetooth]
    implementation("com.google.android.gms:play-services-wearable:18.1.0")

    //    androidx.wear
    implementation("androidx.wear:wear:1.3.0")

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
    // Box SDK
    implementation("com.box:box-java-sdk:4.0.1")

    // OkHttp[https://square.github.io/okhttp/]
    /// define a BOM and its version
    implementation(platform("com.squareup.okhttp3:okhttp-bom:4.11.0"))
    /// define any required OkHttp artifacts without version
    implementation("com.squareup.okhttp3:okhttp")
    implementation("com.squareup.okhttp3:logging-interceptor")

}
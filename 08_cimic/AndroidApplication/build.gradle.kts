// Top-level build file where you can add configuration options common to all sub-projects/modules.
plugins {
    id("com.android.application") version "8.2.2" apply false
    id("com.android.library") version "8.2.2" apply false
    id("org.jetbrains.kotlin.android") version "1.8.10" apply false
    id("com.jfrog.artifactory") version "5.1.5" apply false
    id("com.google.devtools.ksp") version "1.8.10-1.0.9" apply false
    id("org.jetbrains.kotlin.plugin.serialization") version "1.8.10"
}

buildscript {
    dependencies {
        classpath("org.jfrog.buildinfo:build-info-extractor-gradle:latest.release")
        classpath("com.github.dcendents:android-maven-gradle-plugin:2.0")
        classpath("org.jetbrains.kotlin:kotlin-gradle-plugin:1.8.10")
    }
}

tasks.register<Delete>("clean") {
    delete(rootProject.buildDir)
}
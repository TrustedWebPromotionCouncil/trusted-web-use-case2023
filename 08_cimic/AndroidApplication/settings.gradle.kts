pluginManagement {
    repositories {
        google()
        mavenCentral()
        gradlePluginPortal()
        // Don't remove this - needed for 'volley'
        jcenter()
    }
}
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
        maven(url = "https://jitpack.io")
    }
}

rootProject.name = "TrustedWebApp"
include(":phone")
include(":watch")

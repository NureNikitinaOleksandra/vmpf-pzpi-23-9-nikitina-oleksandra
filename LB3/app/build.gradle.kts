plugins {
    alias(libs.plugins.android.application)
}

android {
    namespace = "com.example.lb3"
    compileSdk {
        version = release(36) {
            minorApiLevel = 1
        }
    }

    defaultConfig {
        applicationId = "com.example.lb3"
        minSdk = 24
        targetSdk = 36
        versionCode = 1
        versionName = "1.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
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
        sourceCompatibility = JavaVersion.VERSION_11
        targetCompatibility = JavaVersion.VERSION_11
    }
}

dependencies {
    implementation(libs.androidx.activity.ktx)
    implementation(libs.androidx.appcompat)
    implementation(libs.androidx.constraintlayout)
    implementation(libs.androidx.core.ktx)
    implementation(libs.material)
    testImplementation(libs.junit)
    androidTestImplementation(libs.androidx.espresso.core)
    androidTestImplementation(libs.androidx.junit)
    // Retrofit (для HTTP-запитів)
    implementation("com.squareup.retrofit2:retrofit:2.9.0")
    // Gson (для конвертації JSON)
    implementation("com.squareup.retrofit2:converter-gson:2.9.0")

    // Coroutines (для асинхронної роботи, щоб не "вішати" інтерфейс під час завантаження)
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-android:1.7.3")
}
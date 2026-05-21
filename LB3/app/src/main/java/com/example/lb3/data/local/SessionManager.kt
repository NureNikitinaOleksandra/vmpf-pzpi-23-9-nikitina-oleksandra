package com.example.lb3.data.local

import android.content.Context
import android.content.SharedPreferences

class SessionManager(private val context: Context) {
    private var prefs: SharedPreferences = context.getSharedPreferences("AppPrefs", Context.MODE_PRIVATE)

    // Зберегти токен після логіну
    fun saveAuthToken(token: String) {
        val editor = prefs.edit()
        editor.putString("USER_TOKEN", token)
        editor.apply()
    }

    // Отримати токен для додавання в HTTP-заголовки
    fun fetchAuthToken(): String? {
        return prefs.getString("USER_TOKEN", null)
    }

    // Видалити токен (Вихід з акаунту)
    fun logout() {
        prefs.edit().remove("USER_TOKEN").apply()
    }
}
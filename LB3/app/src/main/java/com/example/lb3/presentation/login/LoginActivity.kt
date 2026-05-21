package com.example.lb3.presentation.login

import android.content.Intent
import android.os.Bundle
import android.widget.Button
import android.widget.EditText
import android.widget.TextView
import android.widget.Toast
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import androidx.lifecycle.lifecycleScope
import com.example.lb3.R
import com.example.lb3.data.local.SessionManager
import com.example.lb3.data.remote.ApiClient
import com.example.lb3.presentation.main.MainActivity
import kotlinx.coroutines.launch

class LoginActivity : AppCompatActivity() {
    private lateinit var sessionManager: SessionManager
    private var isLoginMode = true // Перемикач Вхід/Реєстрація

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContentView(R.layout.activity_login)
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main)) { v, insets ->
            val systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom)
            insets
        }

        sessionManager = SessionManager(this)

        // Якщо токен вже є, пропускаємо цей екран і йдемо на головний
        if (sessionManager.fetchAuthToken() != null) {
            goToMainActivity()
            return
        }

        val etEmail = findViewById<EditText>(R.id.etEmail)
        val etPassword = findViewById<EditText>(R.id.etPassword)
        val btnLogin = findViewById<Button>(R.id.btnLogin)
        val tvSwitchMode = findViewById<TextView>(R.id.tvSwitchMode)

        // Перемикання між Входом та Реєстрацією
        tvSwitchMode.setOnClickListener {
            isLoginMode = !isLoginMode
            btnLogin.text = if (isLoginMode) "Увійти" else "Зареєструватися"
            tvSwitchMode.text = if (isLoginMode) "Немає акаунту? Зареєструватися" else "Вже є акаунт? Увійти"
        }

        // Обробка натискання кнопки "Увійти"
        btnLogin.setOnClickListener {
            val email = etEmail.text.toString()
            val password = etPassword.text.toString()

            if (email.isBlank() || password.isBlank()) {
                Toast.makeText(this, "Заповніть всі поля", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            // Запускаємо асинхронну корутину для запиту в Інтернет
            lifecycleScope.launch {
                try {
                    val requestData = mapOf("email" to email, "password" to password, "name" to "Mobile User")

                    val response = if (isLoginMode) {
                        ApiClient.apiService.login(requestData)
                    } else {
                        ApiClient.apiService.register(requestData)
                        // Після успішної реєстрації одразу робимо логін, щоб отримати токен
                        ApiClient.apiService.login(mapOf("email" to email, "password" to password))
                    }

                    // Зберігаємо отриманий токен
                    sessionManager.saveAuthToken(response.token)
                    Toast.makeText(this@LoginActivity, "Успішно!", Toast.LENGTH_SHORT).show()

                    goToMainActivity()

                } catch (e: Exception) {
                    // Виводимо реальну помилку від системи
                    Toast.makeText(this@LoginActivity, "Помилка: ${e.message}", Toast.LENGTH_LONG).show()
                    // Записуємо деталі в системний журнал (Logcat)
                    android.util.Log.e("LoginActivity", "Login/Register Error", e)
                }
            }
        }
    }

    private fun goToMainActivity() {
        // Перехід на головний екран
        val intent = Intent(this, MainActivity::class.java)
        startActivity(intent)
        finish()
    }
}
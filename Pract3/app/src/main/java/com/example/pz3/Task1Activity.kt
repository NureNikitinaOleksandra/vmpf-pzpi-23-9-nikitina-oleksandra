package com.example.pz3

import android.os.Bundle
import android.widget.Button
import android.widget.EditText
import android.widget.TextView
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat

class Task1Activity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContentView(R.layout.activity_task1)
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main)) { v, insets ->
            val systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom)
            insets
        }

        val etBirthDate = findViewById<EditText>(R.id.etTargetValue)
        val btnCalculateAge = findViewById<Button>(R.id.btnCalculate)
        val tvAgeResult = findViewById<TextView>(R.id.tvResult)

        btnCalculateAge.setOnClickListener {
            val dateInput = etBirthDate.text.toString()
            val result = AgeCalculatorLogic.calculateAge(dateInput)
            tvAgeResult.text = result
        }

        val btnBack = findViewById<Button>(R.id.btnBack)
        btnBack.setOnClickListener {
            finish()
        }
    }
}
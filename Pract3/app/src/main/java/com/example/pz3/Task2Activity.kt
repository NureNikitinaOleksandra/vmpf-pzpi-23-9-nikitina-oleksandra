package com.example.pz3

import android.os.Bundle
import android.widget.Button
import android.widget.EditText
import android.widget.TextView
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat

class Task2Activity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContentView(R.layout.activity_task2)
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main)) { v, insets ->
            val systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom)
            insets
        }

        val etTargetDate = findViewById<EditText>(R.id.etTargetValue)
        val btnCalcSeconds = findViewById<Button>(R.id.btnCalculate)
        val tvSecondsResult = findViewById<TextView>(R.id.tvResult)

        btnCalcSeconds.setOnClickListener {
            val inputDate = etTargetDate.text.toString()
            val result = TimeCalculatorLogic.calculateSeconds(inputDate)
            tvSecondsResult.text = result
        }

        val btnBack = findViewById<Button>(R.id.btnBack2)
        btnBack.setOnClickListener {
            finish()
        }
    }
}
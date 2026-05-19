package com.example.pz3

import android.os.Bundle
import android.widget.Button
import android.widget.TextView
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat

class Task3Activity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContentView(R.layout.activity_task3)
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main)) { v, insets ->
            val systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom)
            insets
        }

        val tvResult = findViewById<TextView>(R.id.tvResult)

        findViewById<Button>(R.id.btnRock).setOnClickListener {
            tvResult.text = RockPaperScissorsLogic.play(0)
        }

        findViewById<Button>(R.id.btnScissors).setOnClickListener {
            tvResult.text = RockPaperScissorsLogic.play(1)
        }

        findViewById<Button>(R.id.btnPaper).setOnClickListener {
            tvResult.text = RockPaperScissorsLogic.play(2)
        }

        // Кнопка назад
        findViewById<Button>(R.id.btnBackToMain).setOnClickListener {
            finish()
        }
    }
}
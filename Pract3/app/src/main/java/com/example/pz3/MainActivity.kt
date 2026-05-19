package com.example.pz3

import android.content.Intent
import android.os.Bundle
import android.widget.Button
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat

class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContentView(R.layout.activity_main)
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main)) { v, insets ->
            val systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom)
            insets
        }

        findViewById<Button>(R.id.btnTask1).setOnClickListener {
            startActivity(Intent(this, Task1Activity::class.java))
        }

        findViewById<Button>(R.id.btnTask2).setOnClickListener {
             startActivity(Intent(this, Task2Activity::class.java))
        }

        findViewById<Button>(R.id.btnTask3).setOnClickListener {
             startActivity(Intent(this, Task3Activity::class.java))
        }

        findViewById<Button>(R.id.btnTask4).setOnClickListener {
             startActivity(Intent(this, Task4Activity::class.java))
        }
    }
}
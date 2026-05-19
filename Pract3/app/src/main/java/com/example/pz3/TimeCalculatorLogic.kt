package com.example.pz3

import java.time.LocalDateTime
import java.time.temporal.ChronoUnit

object TimeCalculatorLogic {
    fun calculateSeconds(inputDateStr: String): String {
        return try {
            val parts = inputDateStr.split(".")
            if (parts.size != 3) {
                return "Помилка: Введіть дату у форматі ДД.ММ.РРРР"
            }

            val day = parts[0].toInt()
            val month = parts[1].toInt()
            val year = parts[2].toInt()

            val endDate = LocalDateTime.of(year, month, day, 12, 0)

            val startDate = LocalDateTime.of(-365, 5, 2, 11, 30)

            val seconds = ChronoUnit.SECONDS.between(startDate, endDate)

            "Пройшло секунд: \n$seconds"

        } catch (e: Exception) {
            "Помилка: Некоректний ввід. Перевірте правильність введення дати."
        }
    }
}
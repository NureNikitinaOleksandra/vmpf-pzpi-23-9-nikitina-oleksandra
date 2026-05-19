package com.example.pz3

import java.time.LocalDate

object AgeCalculatorLogic {
    fun calculateAge(birthDateStr: String): String {
        return try {
            val parts = birthDateStr.split(".")
            if (parts.size != 3) {
                return "Помилка: Введіть дату у форматі ДД.ММ.РРРР"
            }

            val birthDay = parts[0].toInt()
            val birthMonth = parts[1].toInt()
            val birthYear = parts[2].toInt()

            val today = LocalDate.now()
            val currentDay = today.dayOfMonth
            val currentMonth = today.monthValue
            val currentYear = today.year

            var days = currentDay - birthDay
            var months = currentMonth - birthMonth
            var years = currentYear - birthYear

            if (days < 0) {
                months--
                days += 30
            }

            if (months < 0) {
                years--
                months += 12
            }

            if (years < 0) {
                return "Ви ще не народилися!"
            }

            "Вам: $years років, $months місяців та $days днів"

        } catch (e: Exception) {
            "Помилка: Некоректний ввід. Використовуйте цифри (ДД.ММ.РРРР)"
        }
    }
}
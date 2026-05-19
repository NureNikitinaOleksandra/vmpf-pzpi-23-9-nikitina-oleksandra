package com.example.pz3

object PrimeCalculatorLogic {
    private fun isPrime(num: Int): Boolean {
        if (num < 2) return false
        for (i in 2..Math.sqrt(num.toDouble()).toInt()) {
            if (num % i == 0) return false
        }
        return true
    }

    fun findNthPrimeManual(n: Int): String {
        if (n <= 0) return "Помилка: Введіть число більше 0"

        var count = 0
        var currentNumber = 2

        while (true) {
            if (isPrime(currentNumber)) {
                count++
                if (count == n) {
                    return "Просте число №$n: $currentNumber (Ручний метод)"
                }
            }
            currentNumber++
        }
    }

    fun findNthPrimeSequence(n: Int): String {
        if (n <= 0) return "Помилка: Введіть число більше 0"

        val result = generateSequence(2) { it + 1 }
            .filter { isPrime(it) }
            .elementAt(n - 1)

        return "Просте число №$n: $result (Через Sequence)"
    }
}
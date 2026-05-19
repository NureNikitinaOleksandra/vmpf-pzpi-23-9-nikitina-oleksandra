package com.example.pz3

object RockPaperScissorsLogic {
    fun play(userChoice: Int): String {
        val userText = when (userChoice) {
            0 -> "Камінь \u270A"
            1 -> "Ножиці \u270C\uFE0F"
            2 -> "Папір \u270B"
            else -> "Невідомо"
        }

        val computerChoice = (0..2).random()

        val computerText = when (computerChoice) {
            0 -> "Камінь \u270A"
            1 -> "Ножиці \u270C\uFE0F"
            2 -> "Папір \u270B"
            else -> "Невідомо"
        }

        val resultText = when (userChoice) {
            computerChoice -> "Нічия!"
            0 if computerChoice == 1 -> "Ви перемогли! (Камінь ламає ножиці)"
            1 if computerChoice == 2 -> "Ви перемогли! (Ножиці ріжуть папір)"
            2 if computerChoice == 0 -> "Ви перемогли! (Папір накриває камінь)"
            else -> "Комп'ютер переміг!"
        }

        return "Ви обрали: $userText\nКомп'ютер обрав: $computerText\n\nРезультат: $resultText"
    }
}
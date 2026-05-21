package com.example.lb3.domain.model

// Користувач (Профіль)
data class User(
    val id: Int,
    val name: String,
    val email: String
)

// Жанр
data class Genre(
    val id: Int,
    val name: String
)

// Відгук
data class Review(
    val id: Int,
    val text: String,
    val rating: Int,
    val user: User
)

// Трек
data class Track(
    val id: Int,
    val title: String,
    val artist: String,
    val album: String?,
    val duration: Int,
    val filePath: String,
    val genre: Genre?,
    val reviews: List<Review> = emptyList()
)

// Допоміжні класи для авторизації
data class AuthResponse(
    val token: String,
    val user: User
)
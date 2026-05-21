package com.example.lb3.data.remote

import com.example.lb3.domain.model.AuthResponse
import com.example.lb3.domain.model.Review
import com.example.lb3.domain.model.Track
import retrofit2.http.*

interface ApiService {
    // --- 1. АВТОРИЗАЦІЯ (Рівень 3) ---
    @POST("api/auth/login")
    suspend fun login(@Body request: Map<String, String>): AuthResponse

    @POST("api/auth/register")
    suspend fun register(@Body request: Map<String, String>): Map<String, String>

    // --- 2. МУЗИКА, ЖАНРИ ТА ПОШУК (Рівні 1 та 2) ---
    // Підтримує пошук за виконавцем/альбомом та фільтрацію за жанром
    @GET("api/tracks")
    suspend fun getAllTracks(
        @Query("search") search: String? = null,
        @Query("genreId") genreId: Int? = null
    ): List<Track>

    @GET("api/genres")
    suspend fun getGenres(): List<com.example.lb3.domain.model.Genre>

    // --- 3. ПЛЕЙЛИСТИ / "ПРОСЛУХАТИ ПІЗНІШЕ" (Рівні 1 та 2) ---
    @GET("api/listen-later")
    suspend fun getListenLater(@Header("Authorization") token: String): List<Track>

    @POST("api/listen-later/toggle")
    suspend fun toggleListenLater(
        @Header("Authorization") token: String,
        @Body request: Map<String, Int> // {"trackId": 1}
    ): Map<String, Any>

    // --- 4. ВІДГУКИ (Рівень 3) ---
    @GET("api/reviews/{trackId}")
    suspend fun getReviews(@Path("trackId") trackId: Int): List<Review>

    @POST("api/reviews/add")
    suspend fun addReview(
        @Header("Authorization") token: String,
        @Body request: ReviewRequest
    ): okhttp3.ResponseBody

    // --- 5. АНАЛІТИКА (Рівень 4) ---
    @POST("api/analytics/log")
    suspend fun logPlay(
        @Header("Authorization") token: String?,
        @Body request: Map<String, Int> // {"trackId": 1}
    ): Map<String, Boolean>

    @GET("api/analytics/top")
    suspend fun getTopTracks(): List<Track>
}

data class ReviewRequest(val trackId: Int, val text: String, val rating: Int)
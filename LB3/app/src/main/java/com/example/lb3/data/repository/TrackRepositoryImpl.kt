package com.example.lb3.data.repository

import com.example.lb3.data.remote.ApiService
import com.example.lb3.domain.repository.TrackRepository
import com.example.lb3.domain.model.Track

class TrackRepositoryImpl (
    private val apiService: ApiService
) : TrackRepository {

    override suspend fun getTracks(search: String?, genreId: Int?): List<Track> {
        // Звертаємося до сервера через Retrofit
        return apiService.getAllTracks(search, genreId)
    }
}
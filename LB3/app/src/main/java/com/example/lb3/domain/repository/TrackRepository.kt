package com.example.lb3.domain.repository

import com.example.lb3.domain.model.Track

interface TrackRepository {
    suspend fun getTracks(search: String?, genreId: Int?): List<Track>
}
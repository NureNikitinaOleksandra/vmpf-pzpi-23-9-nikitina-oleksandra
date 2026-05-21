package com.example.lb3.presentation.main

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.lb3.data.local.SessionManager
import com.example.lb3.data.remote.ApiClient
import com.example.lb3.data.repository.TrackRepositoryImpl
import com.example.lb3.domain.model.Track
import kotlinx.coroutines.launch

class MainViewModel (private val sessionManager: SessionManager) : ViewModel() {
    private val repository = TrackRepositoryImpl(ApiClient.apiService)
    private val _tracks = MutableLiveData<List<Track>>()
    val tracks: LiveData<List<Track>> = _tracks
    private val _topTrackTitle = MutableLiveData<String>()
    val topTrackTitle: LiveData<String> = _topTrackTitle
    private val _genres = MutableLiveData<List<com.example.lb3.domain.model.Genre>>()
    val genres: LiveData<List<com.example.lb3.domain.model.Genre>> = _genres

    // Запам'ятовуємо поточний пошук та жанр
    private var currentSearchQuery: String? = null
    private var currentGenreId: Int? = null

    init {
        loadGenres()
        loadAllTracks()
        loadTopTrack()
    }

    fun loadGenres() {
        viewModelScope.launch {
            try {
                _genres.value = ApiClient.apiService.getGenres()
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }
    }

    // Функція завантаження топу
    fun loadTopTrack() {
        viewModelScope.launch {
            try {
                val topList = ApiClient.apiService.getTopTracks()
                if (topList.isNotEmpty()) {
                    val best = topList[0]
                    _topTrackTitle.postValue("🏆 Топ-1: ${best.title} (${best.artist})")
                } else {
                    _topTrackTitle.postValue("🏆 Топ-1: Поки немає прослуховувань")
                }
            } catch (e: Exception) {
                _topTrackTitle.postValue("🏆 Топ-1: Помилка (${e.message})")
                e.printStackTrace()
            }
        }
    }

    // Завантаження всіх треків (з можливістю пошуку)
    fun loadAllTracks(searchQuery: String? = currentSearchQuery, genreId: Int? = currentGenreId) {
        currentSearchQuery = searchQuery
        currentGenreId = genreId
        viewModelScope.launch {
            try {
                val result = repository.getTracks(search = searchQuery, genreId = currentGenreId)
                _tracks.value = result
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }
    }

    // Завантаження добірки "Прослухати пізніше"
    fun loadListenLater() {
        viewModelScope.launch {
            try {
                val token = sessionManager.fetchAuthToken() ?: return@launch
                // Додаємо Bearer перед токеном, як того вимагає Node.js бекенд
                val result = ApiClient.apiService.getListenLater("Bearer $token")
                _tracks.value = result
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }
    }

    // Додавання/видалення з добірки
    fun toggleListenLater(track: Track) {
        viewModelScope.launch {
            try {
                val token = sessionManager.fetchAuthToken() ?: return@launch
                ApiClient.apiService.toggleListenLater("Bearer $token", mapOf("trackId" to track.id))
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }
    }

    // Відправка аналітики
    fun logPlay(track: Track) {
        viewModelScope.launch {
            try {
                // Токен може бути null, якщо ми дозволимо слухати гостям, але у нас всі залогінені
                val token = sessionManager.fetchAuthToken()
                val header = if (token != null) "Bearer $token" else null

                ApiClient.apiService.logPlay(header, mapOf("trackId" to track.id))
            } catch (e: Exception) {
                // Якщо аналітика не відправилась - не страшно, просто ігноруємо, щоб не заважати плеєру
                e.printStackTrace()
            }
        }
    }
}
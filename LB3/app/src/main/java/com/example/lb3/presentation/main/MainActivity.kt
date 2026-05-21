package com.example.lb3.presentation.main

import android.content.Intent
import android.os.Bundle
import android.widget.Button
import android.widget.EditText
import android.widget.TextView
import android.widget.Toast
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import androidx.core.widget.addTextChangedListener
import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.lb3.R
import com.example.lb3.data.local.SessionManager

class MainActivity : AppCompatActivity() {

    private lateinit var trackAdapter: TrackAdapter
    private lateinit var viewModel: MainViewModel
    private var mediaPlayer: android.media.MediaPlayer? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContentView(R.layout.activity_main)
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main)) { v, insets ->
            val systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom)
            insets
        }

        // Ініціалізація ViewModel та Сесії
        val sessionManager = SessionManager(this)
        val factory = object : ViewModelProvider.Factory {
            override fun <T : ViewModel> create(modelClass: Class<T>): T {
                return MainViewModel(sessionManager) as T
            }
        }
        viewModel = ViewModelProvider(this, factory)[MainViewModel::class.java]

        // Прив'язка елементів інтерфейсу
        val etSearch = findViewById<EditText>(R.id.etSearch)
        val btnAllTracks = findViewById<Button>(R.id.btnAllTracks)
        val btnMyPlaylist = findViewById<Button>(R.id.btnMyPlaylist)
        val tvTopTrack = findViewById<TextView>(R.id.tvTopTrack)
        val rvTracks = findViewById<RecyclerView>(R.id.rvTracks)
        val btnLogout = findViewById<Button>(R.id.btnLogout)

        // Вихід з акаунту
        btnLogout.setOnClickListener {
            sessionManager.logout()
            val intent =
                Intent(this, com.example.lb3.presentation.login.LoginActivity::class.java)
            startActivity(intent)
            finish()
        }

        // Налаштування Адаптера та логіки Плеєра
        trackAdapter = TrackAdapter(
            onPlayClick = { track ->
                if (trackAdapter.playingTrackId == track.id) {
                    if (mediaPlayer?.isPlaying == true) {
                        mediaPlayer?.pause()
                        trackAdapter.playingTrackId = null
                    } else {
                        mediaPlayer?.start()
                        trackAdapter.playingTrackId = track.id
                    }
                    trackAdapter.notifyDataSetChanged() // Оновлюємо іконки
                }
                // Якщо натиснули на новий трек
                else {
                    try {
                        mediaPlayer?.release() // Зупиняємо старий
                        mediaPlayer = android.media.MediaPlayer()
                        mediaPlayer?.setDataSource("http://10.0.2.2:3000/api/tracks/${track.id}/stream")
                        mediaPlayer?.prepareAsync()

                        // Показуємо стан завантаження
                        trackAdapter.playingTrackId = null
                        trackAdapter.notifyDataSetChanged()
                        Toast.makeText(this, "Завантаження...", Toast.LENGTH_SHORT).show()

                        mediaPlayer?.setOnPreparedListener {
                            it.start()
                            trackAdapter.playingTrackId = track.id
                            trackAdapter.notifyDataSetChanged()

                            viewModel.logPlay(track)
                            viewModel.loadTopTrack()
                        }
                    } catch (e: Exception) {
                        Toast.makeText(this, "Помилка відтворення", Toast.LENGTH_SHORT).show()
                    }
                }
            },
            onListenLaterClick = { track ->
                viewModel.toggleListenLater(track)
                Toast.makeText(this, "Статус змінено!", Toast.LENGTH_SHORT).show()
            },
            onCardClick = { track ->
                val intent = android.content.Intent(this, com.example.lb3.presentation.detail.TrackDetailActivity::class.java)

                // Передаємо дані треку на новий екран
                intent.putExtra("TRACK_ID", track.id)
                intent.putExtra("TRACK_TITLE", track.title)
                intent.putExtra("TRACK_ARTIST", track.artist)
                intent.putExtra("TRACK_ALBUM", track.album)
                intent.putExtra("TRACK_GENRE", track.genre?.name)
                intent.putExtra("TRACK_FILE_PATH", track.filePath)

                startActivity(intent)
            }
        )
        rvTracks.layoutManager = LinearLayoutManager(this)
        rvTracks.adapter = trackAdapter

        // Підписка на дані з ViewModel
        viewModel.tracks.observe(this) { loadedTracks ->
            trackAdapter.submitList(loadedTracks)
        }
        viewModel.topTrackTitle.observe(this) { topTitle ->
            tvTopTrack.text = topTitle
        }

        // Знаходимо наш Spinner
        val spinnerGenre = findViewById<android.widget.Spinner>(R.id.spinnerGenre)

        // Підписуємося на жанри
        viewModel.genres.observe(this) { genreList ->
            // Створюємо масив назв: ["Всі жанри", "Рок", "Поп", "Джаз"...]
            val genreNames = mutableListOf("Всі жанри")
            genreNames.addAll(genreList.map { it.name })

            // Налаштовуємо стандартний адаптер для випадаючого списку
            val spinnerAdapter = android.widget.ArrayAdapter(
                this,
                android.R.layout.simple_spinner_dropdown_item,
                genreNames
            )
            spinnerGenre.adapter = spinnerAdapter

            // Слухаємо вибір жанру користувачем
            spinnerGenre.onItemSelectedListener = object : android.widget.AdapterView.OnItemSelectedListener {
                override fun onItemSelected(parent: android.widget.AdapterView<*>?, view: android.view.View?, position: Int, id: Long) {
                    if (position == 0) {
                        viewModel.loadAllTracks(genreId = null) // Всі жанри
                    } else {
                        // position - 1, бо нульовий елемент це "Всі жанри"
                        val selectedGenreId = genreList[position - 1].id
                        viewModel.loadAllTracks(genreId = selectedGenreId)
                    }
                }
                override fun onNothingSelected(parent: android.widget.AdapterView<*>?) {}
            }
        }

        // Обробка кнопок перемикання списків
        btnAllTracks.setOnClickListener {
            etSearch.text.clear()
            viewModel.loadAllTracks()

            btnAllTracks.setBackgroundColor(android.graphics.Color.parseColor("#2563EB"))
            btnMyPlaylist.setBackgroundColor(android.graphics.Color.parseColor("#9CA3AF"))
        }

        btnMyPlaylist.setOnClickListener {
            etSearch.text.clear()
            viewModel.loadListenLater()

            btnMyPlaylist.setBackgroundColor(android.graphics.Color.parseColor("#2563EB"))
            btnAllTracks.setBackgroundColor(android.graphics.Color.parseColor("#9CA3AF"))
        }

        // Логіка пошуку (спрацьовує при кожному введеному символі)
        etSearch.addTextChangedListener { text ->
            val query = text.toString()
            if (query.isNotEmpty()) {
                viewModel.loadAllTracks(searchQuery = query)
            } else {
                viewModel.loadAllTracks()
            }
        }
    }

    // Звільняємо ресурси при закритті додатку
    override fun onDestroy() {
        super.onDestroy()
        mediaPlayer?.release()
        mediaPlayer = null
    }
}
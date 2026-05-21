package com.example.lb3.presentation.detail

import android.app.DownloadManager
import android.content.Context
import android.net.Uri
import android.os.Bundle
import android.os.Environment
import android.view.ViewGroup
import android.widget.Button
import android.widget.EditText
import android.widget.TextView
import android.widget.Toast
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import androidx.lifecycle.lifecycleScope
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.lb3.R
import com.example.lb3.data.local.SessionManager
import com.example.lb3.data.remote.ApiClient
import com.example.lb3.data.remote.ReviewRequest
import com.example.lb3.domain.model.Review
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import java.io.File
import java.io.FileOutputStream
import java.net.URL

class TrackDetailActivity : AppCompatActivity() {

    private lateinit var sessionManager: SessionManager
    private lateinit var reviewAdapter: ReviewAdapter
    private var currentTrackId: Int = -1

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContentView(R.layout.activity_track_detail)
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main)) { v, insets ->
            val systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom)
            insets
        }

        sessionManager = SessionManager(this)

        val btnBack = findViewById<Button>(R.id.btnBack)
        val tvDetailTitle = findViewById<TextView>(R.id.tvDetailTitle)
        val tvDetailInfo = findViewById<TextView>(R.id.tvDetailInfo)
        val btnDownload = findViewById<Button>(R.id.btnDownload)
        val rvReviews = findViewById<RecyclerView>(R.id.rvReviews)
        val etReviewText = findViewById<EditText>(R.id.etReviewText)
        val btnSendReview = findViewById<Button>(R.id.btnSendReview)

        // Отримуємо дані, які ми передали з головного екрану
        currentTrackId = intent.getIntExtra("TRACK_ID", -1)
        val trackTitle = intent.getStringExtra("TRACK_TITLE") ?: "Невідомо"
        val trackArtist = intent.getStringExtra("TRACK_ARTIST") ?: "Невідомо"
        val trackAlbum = intent.getStringExtra("TRACK_ALBUM") ?: "Сингл"
        val trackGenre = intent.getStringExtra("TRACK_GENRE") ?: "Різне"
        val trackFilePath = intent.getStringExtra("TRACK_FILE_PATH") ?: ""

        // Виводимо їх на екран
        tvDetailTitle.text = trackTitle
        tvDetailInfo.text = "$trackArtist • $trackAlbum • $trackGenre"

        // Логіка кнопки "Назад"
        btnBack.setOnClickListener {
            finish() // Просто закриваємо цей екран і повертаємося на головний
        }

        // 3. ЛОГІКА СКАЧУВАННЯ (Рівень 2)
        btnDownload.setOnClickListener {
            downloadTrack(currentTrackId, trackTitle)
        }

        // 4. НАЛАШТУВАННЯ СПИСКУ ВІДГУКІВ
        reviewAdapter = ReviewAdapter(emptyList())
        rvReviews.layoutManager = LinearLayoutManager(this)
        rvReviews.adapter = reviewAdapter

        // Завантажуємо відгуки з сервера при відкритті екрану
        loadReviews()

        // 5. ВІДПРАВКА НОВОГО ВІДГУКУ (Рівень 3)
        btnSendReview.setOnClickListener {
            val text = etReviewText.text.toString()
            if (text.isNotBlank()) {
                sendReview(text)
                etReviewText.text.clear() // Очищаємо поле вводу
            }
        }
    }

    // --- ФУНКЦІЯ СКАЧУВАННЯ ФАЙЛУ ---
    private fun downloadTrack(trackId: Int, fileName: String) {
        Toast.makeText(this, "Завантаження почалося...", Toast.LENGTH_SHORT).show()

        // Запускаємо важку роботу у фоновому потоці (Dispatchers.IO)
        lifecycleScope.launch(Dispatchers.IO) {
            try {
                val url = URL("http://10.0.2.2:3000/api/tracks/$trackId/stream")

                val directory = getExternalFilesDir(Environment.DIRECTORY_MUSIC)
                val file = File(directory, "$fileName.mp3")

                url.openStream().use { input ->
                    FileOutputStream(file).use { output ->
                        input.copyTo(output)
                    }
                }

                withContext(Dispatchers.Main) {
                    Toast.makeText(this@TrackDetailActivity, "✅ Завантажено у папку Music!", Toast.LENGTH_LONG).show()
                }
            } catch (e: Exception) {
                withContext(Dispatchers.Main) {
                    Toast.makeText(this@TrackDetailActivity, "❌ Помилка: ${e.message}", Toast.LENGTH_LONG).show()
                }
            }
        }
    }

    // --- РОБОТА З СЕРВЕРОМ (Корутини) ---
    private fun loadReviews() {
        lifecycleScope.launch {
            try {
                val reviews = ApiClient.apiService.getReviews(currentTrackId)
                reviewAdapter.updateData(reviews)
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }
    }

    private fun sendReview(text: String) {
        lifecycleScope.launch {
            try {
                val token = sessionManager.fetchAuthToken() ?: return@launch
                // Формуємо тіло запиту
                val request = ReviewRequest(trackId = currentTrackId, text = text, rating = 5)
                // Відправляємо на сервер
                ApiClient.apiService.addReview("Bearer $token", request)
                Toast.makeText(this@TrackDetailActivity, "Відгук додано!", Toast.LENGTH_SHORT).show()
                // Оновлюємо список
                loadReviews()
            } catch (e: Exception) {
                Toast.makeText(this@TrackDetailActivity, "Помилка: ${e.message}", Toast.LENGTH_LONG).show()
            }
        }
    }

    // --- МІНІ-АДАПТЕР ДЛЯ ВІДГУКІВ (щоб не створювати новий файл) ---
    inner class ReviewAdapter(private var reviews: List<Review>) : RecyclerView.Adapter<ReviewAdapter.ReviewViewHolder>() {

        inner class ReviewViewHolder(val textView: TextView) : RecyclerView.ViewHolder(textView)

        override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ReviewViewHolder {
            // Створюємо текстове поле програмно, щоб не робити зайвий XML
            val tv = TextView(parent.context).apply {
                setPadding(16, 16, 16, 16)
                textSize = 16f
                setTextColor(android.graphics.Color.DKGRAY)
            }
            return ReviewViewHolder(tv)
        }

        override fun onBindViewHolder(holder: ReviewViewHolder, position: Int) {
            val review = reviews[position]
            // Виводимо ім'я автора та сам відгук
            holder.textView.text = "👤 ${review.user.name}:\n${review.text}"
        }

        override fun getItemCount(): Int = reviews.size

        fun updateData(newReviews: List<Review>) {
            reviews = newReviews
            notifyDataSetChanged()
        }
    }
}
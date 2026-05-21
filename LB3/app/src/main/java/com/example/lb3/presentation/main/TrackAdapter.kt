package com.example.lb3.presentation.main

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.example.lb3.R
import com.example.lb3.domain.model.Track

// Адаптер приймає функції (лямбди), які спрацюють, коли користувач натисне Play, Плюс або на саму картку
class TrackAdapter (
    private val onPlayClick: (Track) -> Unit,
    private val onListenLaterClick: (Track) -> Unit,
    private val onCardClick: (Track) -> Unit
) : RecyclerView.Adapter<TrackAdapter.TrackViewHolder>(){
    private var tracks = listOf<Track>()

    var playingTrackId: Int? = null

    // Оновлення списку
    fun submitList(newTracks: List<Track>) {
        tracks = newTracks
        notifyDataSetChanged()
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): TrackViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.item_track, parent, false)
        return TrackViewHolder(view)
    }

    override fun onBindViewHolder(holder: TrackViewHolder, position: Int) {
        holder.bind(tracks[position])
    }

    override fun getItemCount(): Int = tracks.size

    // Внутрішній клас, який тримає посилання на елементи дизайну
    inner class TrackViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        private val tvTitle: TextView = itemView.findViewById(R.id.tvTrackTitle)
        private val tvArtist: TextView = itemView.findViewById(R.id.tvTrackArtist)
        private val btnPlay: Button = itemView.findViewById(R.id.btnPlay)
        private val btnListenLater: Button = itemView.findViewById(R.id.btnListenLater)

        fun bind(track: Track) {
            tvTitle.text = track.title
            tvArtist.text = track.artist

            // Змінюємо текст кнопки залежно від стану
            if (track.id == playingTrackId) {
                btnPlay.text = "||"
            } else {
                btnPlay.text = "▶"
            }

            // Слухачі кліків
            btnPlay.setOnClickListener { onPlayClick(track) }
            btnListenLater.setOnClickListener { onListenLaterClick(track) }
            itemView.setOnClickListener { onCardClick(track) }
        }
    }
}
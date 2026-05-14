import { useState, useEffect } from "react";
import TrackItem from "./TrackItem";

export default function TrackList({ mode }) {
  const [tracks, setTracks] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("");
  const [loading, setLoading] = useState(true);

  // Окремий useEffect для завантаження списку жанрів (виконується лише 1 раз при старті)
  useEffect(() => {
    fetch("http://localhost:3000/api/genres")
      .then((res) => res.json())
      .then((data) => setGenres(data))
      .catch((err) => console.error("Помилка завантаження жанрів:", err));
  }, []);

  // useEffect для завантаження треків
  useEffect(() => {
    setLoading(true);
    let url = "http://localhost:3000/api/tracks";

    // Формуємо правильний URL
    if (mode === "playlist") {
      url = "http://localhost:3000/api/playlist";
    } else if (selectedGenre) {
      url = `http://localhost:3000/api/tracks?genreId=${selectedGenre}`;
    }

    // Дістаємо токен з пам'яті браузера
    const token = localStorage.getItem("token");

    // Налаштовуємо заголовки запиту
    const fetchOptions = {
      method: "GET",
      headers: {},
    };

    // Якщо ми запитуємо плейлист, обов'язково додаємо токен авторизації
    if (token && mode === "playlist") {
      fetchOptions.headers["Authorization"] = `Bearer ${token}`;
    }

    fetch(url, fetchOptions)
      .then((res) => {
        if (res.status === 401 || res.status === 403) {
          throw new Error(
            "Будь ласка, увійдіть у систему, щоб побачити свій плейлист",
          );
        }
        return res.json();
      })
      .then((data) => {
        // Якщо це плейлист, дані лежать всередині властивості data.tracks
        const fetchedTracks = mode === "playlist" ? data?.tracks || [] : data;
        setTracks(fetchedTracks);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Помилка:", error);
        setTracks([]); // Очищуємо список при помилці (наприклад, якщо немає токена)
        setLoading(false);
      });
  }, [selectedGenre, mode]);

  return (
    <div>
      {/* Панель керування з фільтром */}
      <div className="mb-4 flex justify-between items-center bg-white p-3 rounded-xl shadow-sm border border-gray-100">
        <span className="text-gray-600 font-medium ml-2">
          Список відтворення
        </span>

        <select
          value={selectedGenre}
          onChange={(e) => setSelectedGenre(e.target.value)}
          className="bg-gray-50 border border-gray-200 text-gray-700 py-1.5 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
        >
          <option value="">Всі жанри</option>
          {genres.map((genre) => (
            <option key={genre.id} value={genre.id}>
              {genre.name}
            </option>
          ))}
        </select>
      </div>

      {/* Список треків */}
      {loading ? (
        <div className="text-center py-10 text-gray-500">
          Завантаження треків...
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-2">
          {tracks.length > 0 ? (
            tracks.map((track) => <TrackItem key={track.id} track={track} />)
          ) : (
            <div className="text-center py-8 text-gray-500">
              На жаль, треків у цьому жанрі поки немає.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

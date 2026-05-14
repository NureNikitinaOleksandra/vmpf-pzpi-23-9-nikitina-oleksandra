import { useState, useRef, useEffect } from "react";

export default function TrackItem({ track }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showReviews, setShowReviews] = useState(false); // Чи відкритий блок відгуків
  const [reviews, setReviews] = useState([]); // Список відгуків
  const [newReview, setNewReview] = useState({ text: "", rating: 5 }); // Дані форми

  const audioRef = useRef(null);
  const token = localStorage.getItem("token");

  // Функція для перемикання Play/Pause
  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const duration = `${Math.floor(track.duration / 60)}:${String(track.duration % 60).padStart(2, "0")}`;

  // Функція для додавання/видалення з плейлиста
  const togglePlaylist = async () => {
    if (!token) {
      alert("Будь ласка, увійдіть у систему, щоб редагувати плейлист!");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:3000/api/playlist/toggle",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Додаємо JWT токен
          },
          body: JSON.stringify({ trackId: track.id }),
        },
      );

      const data = await response.json();

      if (response.ok) {
        alert(data.message); // Виведе "Додано" або "Видалено"

        // Якщо ми зараз на вкладці "Плейлист" і видалили трек,
        // сторінку варто оновити, щоб трек зник візуально.
        if (
          data.message.includes("видалено") &&
          window.location.href.includes("playlist")
        ) {
          window.location.reload();
        }
      } else {
        alert(data.error || "Сталася помилка");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Завантаження відгуків при відкритті блоку
  useEffect(() => {
    if (showReviews) {
      fetch(`http://localhost:3000/api/reviews/${track.id}`)
        .then((res) => res.json())
        .then((data) => setReviews(data))
        .catch((err) => console.error(err));
    }
  }, [showReviews, track.id]);

  // Відправка нового відгуку
  const submitReview = async (e) => {
    e.preventDefault();
    if (!token) return alert("Увійдіть, щоб залишити відгук!");

    try {
      const res = await fetch("http://localhost:3000/api/reviews/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...newReview, trackId: track.id }),
      });

      const data = await res.json();
      if (res.ok) {
        setReviews([data, ...reviews]); // Додаємо новий відгук на початок списку
        setNewReview({ text: "", rating: 5 }); // Очищаємо форму
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Функція для відстеження прослуховувань
  const handlePlay = () => {
    fetch("http://localhost:3000/api/analytics/log", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ trackId: track.id }),
    }).catch((err) => console.log("Analytics error", err));
  };

  return (
    <div className="group flex flex-col p-3 border-b border-gray-100 hover:bg-gray-50 transition-colors rounded-lg">
      {/* ОСНОВНА КАРТКА ТРЕКУ */}
      <div className="flex items-center justify-between w-full">
        {/* Ліва частина: Кнопка Play та Інфо */}
        <audio
          ref={audioRef}
          src={`http://localhost:3000/api/tracks/${track.id}/stream`}
          onPlay={handlePlay}
          onEnded={() => setIsPlaying(false)}
        />

        <div className="flex items-center gap-4">
          {/* Кнопка Play/Pause */}
          <button
            onClick={togglePlay}
            className="w-10 h-10 flex-shrink-0 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors"
          >
            {isPlaying ? (
              <svg className="w-5 h-5 " fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
              </svg>
            ) : (
              <svg
                className="w-5 h-5 ml-1"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>

          {/* Назва, Виконавець, Жанр */}
          <div className="flex flex-col">
            <span className="font-bold text-gray-900 leading-tight">
              {track.title}
            </span>
            <div className="flex items-center gap-2 text-sm text-gray-500 mt-0.5">
              <span className="hover:underline cursor-pointer">
                {track.artist}
              </span>
              <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
              <span className="text-blue-500 font-medium hover:underline cursor-pointer">
                {track.genre?.name}
              </span>
            </div>
          </div>
        </div>

        {/* Права частина: Кнопки (з'являються при наведенні) та Час */}
        <div className="flex items-center gap-4">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
            <button
              onClick={() => setShowReviews(!showReviews)}
              className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-full transition-colors"
              title="Відгуки"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                />
              </svg>
            </button>

            <button
              onClick={togglePlaylist}
              className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
              title="Додати/Видалити з плейлиста"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </button>
            <button
              onClick={() =>
                (window.location.href = `http://localhost:3000/api/tracks/${track.id}/download`)
              }
              className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-full transition-colors"
              title="Завантажити"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
            </button>
          </div>
          <span className="text-gray-500 text-sm font-medium w-10 text-right">
            {duration}
          </span>
        </div>
      </div>

      {/* РОЗГОРНУТИЙ БЛОК ВІДГУКІВ */}
      {showReviews && (
        <div className="mt-4 pt-4 border-t border-gray-100 pl-14 pr-4">
          <h4 className="text-sm font-bold text-gray-700 mb-3">
            Відгуки користувачів
          </h4>

          {/* Форма для нового відгуку */}
          {token ? (
            <form
              onSubmit={submitReview}
              className="mb-4 flex gap-2 items-start"
            >
              <select
                value={newReview.rating}
                onChange={(e) =>
                  setNewReview({ ...newReview, rating: e.target.value })
                }
                className="bg-gray-50 border border-gray-200 text-sm rounded-lg p-2 focus:ring-blue-500"
              >
                <option value="5">5 ⭐️</option>
                <option value="4">4 ⭐️</option>
                <option value="3">3 ⭐️</option>
                <option value="2">2 ⭐️</option>
                <option value="1">1 ⭐️</option>
              </select>
              <input
                type="text"
                required
                placeholder="Що думаєте про цей трек?"
                className="flex-1 bg-gray-50 border border-gray-200 text-sm rounded-lg p-2 focus:ring-blue-500 outline-none"
                value={newReview.text}
                onChange={(e) =>
                  setNewReview({ ...newReview, text: e.target.value })
                }
              />
              <button
                type="submit"
                className="bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Надіслати
              </button>
            </form>
          ) : (
            <div className="text-sm text-gray-500 mb-4 bg-gray-50 p-2 rounded-lg text-center">
              Увійдіть, щоб залишити відгук
            </div>
          )}

          {/* Список відгуків */}
          <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
            {reviews.length === 0 ? (
              <p className="text-sm text-gray-400">
                Ще немає відгуків. Будьте першим!
              </p>
            ) : (
              reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm"
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold text-sm text-gray-800">
                      {rev.user.name}
                    </span>
                    <span className="text-xs text-yellow-500">
                      {"★".repeat(rev.rating)}
                      {"☆".repeat(5 - rev.rating)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{rev.text}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

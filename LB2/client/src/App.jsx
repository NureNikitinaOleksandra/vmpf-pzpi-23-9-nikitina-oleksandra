import { useState, useEffect } from "react";
import Header from "./components/Header";
import TrackList from "./components/TrackList";
import AuthModal from "./components/AuthModal";

function App() {
  const [view, setView] = useState("all");
  const [user, setUser] = useState(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [topTracks, setTopTracks] = useState([]);

  // При завантаженні сторінки перевіряємо, чи є юзер у пам'яті браузера
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));

    // Завантажуємо Топ-3 трека при старті
    fetch("http://localhost:3000/api/analytics/top")
      .then((res) => res.json())
      .then((data) => setTopTracks(data))
      .catch((err) => console.error(err));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setView("all"); // Повертаємо на головну при виході
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        user={user}
        onLoginClick={() => setIsAuthOpen(true)}
        onLogout={handleLogout}
      />

      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Топ-3 (Тільки у вкладці "Всі треки") */}
        {view === "all" && topTracks.length > 0 && (
          <div className="mb-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <svg
                className="w-6 h-6 text-yellow-300"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              Топ-3 найпопулярніших треки за прослуховуваннями
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {topTracks.map((track, idx) => (
                <div
                  key={track.id}
                  className="bg-white/20 backdrop-blur-sm rounded-xl p-3 flex items-center gap-3"
                >
                  <div className="text-2xl font-black text-white/50">
                    {idx + 1}
                  </div>
                  <div>
                    <div className="font-bold leading-tight">{track.title}</div>
                    <div className="text-sm text-blue-100">{track.artist}</div>
                  </div>
                  <div className="ml-auto text-xs font-semibold bg-white/20 px-2 py-1 rounded-full whitespace-nowrap">
                    {track._count.logs} відтворень
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Панель з кнопками "Всі" і "Плейлист" та TrackList */}
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">
            {view === "all" ? "Всі треки" : "Мій плейлист"}
          </h1>

          {user && ( // Показуємо перемикач тільки авторизованим
            <div className="flex gap-2 bg-white p-1 rounded-lg shadow-sm border">
              <button
                onClick={() => setView("all")}
                className={`px-4 py-1.5 rounded-md text-sm ${view === "all" ? "bg-blue-600 text-white" : "text-gray-600"}`}
              >
                Всі
              </button>
              <button
                onClick={() => setView("playlist")}
                className={`px-4 py-1.5 rounded-md text-sm ${view === "playlist" ? "bg-blue-600 text-white" : "text-gray-600"}`}
              >
                Плейлист
              </button>
            </div>
          )}
        </div>

        <TrackList mode={view} />
      </main>

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLogin={(userData) => setUser(userData)}
      />
    </div>
  );
}

export default App;

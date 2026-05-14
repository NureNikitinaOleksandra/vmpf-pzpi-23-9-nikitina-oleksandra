export default function Header({ user, onLoginClick, onLogout }) {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="max-w-5xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Логотип */}
        <div className="text-2xl font-black text-blue-600 tracking-tight flex items-center gap-2">
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
          </svg>
          MuziStream
        </div>

        {/* Кнопки авторизації */}
        <div className="flex gap-3 items-center">
          {user ? (
            <>
              <span className="text-sm font-medium text-gray-700 italic">
                Привіт, {user.name}!
              </span>
              <button
                onClick={onLogout}
                className="text-sm font-semibold text-red-500 hover:text-red-700 px-3 py-2"
              >
                Вийти
              </button>
            </>
          ) : (
            <button
              onClick={onLoginClick}
              className="text-sm font-semibold bg-blue-600 text-white px-5 py-2 rounded-full hover:bg-blue-700 transition-colors"
            >
              Увійти
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

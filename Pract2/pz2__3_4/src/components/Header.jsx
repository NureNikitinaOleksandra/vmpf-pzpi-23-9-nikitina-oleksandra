function Header() {
  return (
    <header className="bg-white shadow-sm mb-8">
      <div className="max-w-4xl mx-auto px-4 py-6 flex items-center gap-3">
        {/* Іконка книги (з Heroicons) */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-8 h-8 text-blue-600"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
          />
        </svg>

        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
          Моя бібліотека книг
        </h1>
      </div>
    </header>
  );
}
export default Header;

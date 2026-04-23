import { STATUS_LABELS, GENRES } from "../constants";

export default function Filters({
  searchQuery,
  setSearchQuery,
  filterStatus,
  setFilterStatus,
  filterGenre,
  setFilterGenre,
  sortBy,
  setSortBy,
}) {
  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 mb-8 space-y-4">
      {/* Пошук */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Пошук
        </label>
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Шукати за назвою або автором..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
          />
          {/* Іконка лупи */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-gray-400 absolute left-3 top-2.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Фільтр за статусом */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Статус
          </label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="all">Всі статуси</option>
            {Object.entries(STATUS_LABELS).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>

        {/* Фільтр за жанром */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Жанр
          </label>
          <select
            value={filterGenre}
            onChange={(e) => setFilterGenre(e.target.value)}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="all">Всі жанри</option>
            {GENRES.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>

        {/* Сортування */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Сортування
          </label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="dateDesc">Спочатку нові</option>
            <option value="dateAsc">Спочатку старі</option>
            <option value="titleAsc">За алфавітом (А-Я)</option>
            <option value="titleDesc">За алфавітом (Я-А)</option>
          </select>
        </div>
      </div>
    </div>
  );
}

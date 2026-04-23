// src/components/BookItem.jsx
import { STATUS_LABELS, RATING_LABELS } from "../constants";

export default function BookItem({ book, onDelete, onUpdate }) {
  const handleStatusChange = (e) => {
    const newStatus = e.target.value;
    const newRating = newStatus !== "read" ? "none" : book.rating;
    onUpdate(book.id, { status: newStatus, rating: newRating });
  };

  const handleRatingChange = (e) => {
    onUpdate(book.id, { rating: e.target.value });
  };

  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      {/* Інформація про книгу */}
      <div className="flex-1">
        <h3 className="text-lg font-bold text-gray-900">{book.title}</h3>
        <p className="text-gray-600">
          {book.author} • <span className="italic">{book.genre}</span>
        </p>
      </div>

      {/* Статуси та Оцінки */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Вибір статусу */}
        <select
          value={book.status}
          onChange={handleStatusChange}
          className="bg-gray-50 border border-gray-200 text-sm rounded-lg px-3 py-1.5 focus:ring-blue-500 focus:border-blue-500 outline-none"
        >
          {Object.entries(STATUS_LABELS).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>

        {/* Вибір оцінки (лише якщо статус "Прочитано") */}
        {book.status === "read" && (
          <select
            value={book.rating}
            onChange={handleRatingChange}
            className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg px-3 py-1.5 focus:ring-green-500 outline-none"
          >
            {Object.entries(RATING_LABELS).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        )}

        {/* Кнопка видалення */}
        <button
          onClick={() => onDelete(book.id)}
          className="text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition"
          title="Видалити книгу"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

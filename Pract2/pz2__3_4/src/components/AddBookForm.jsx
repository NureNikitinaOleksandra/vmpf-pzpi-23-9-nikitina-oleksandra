import { useState } from "react";
import { GENRES, STATUS_LABELS } from "../constants";

export default function AddBookForm({ onAdd }) {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    genre: GENRES[0],
    status: "planned",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.author.trim()) {
      alert("Будь ласка, заповніть назву та автора книги");
      return;
    }

    const newBook = {
      ...formData,
      id: Date.now(),
      rating: "none",
      addedAt: new Date().toISOString(),
    };

    onAdd(newBook);

    setFormData({
      title: "",
      author: "",
      genre: GENRES[0],
      status: "planned",
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8"
    >
      <h2 className="text-xl font-bold mb-4 text-gray-800">
        Додати нову книгу
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Назва книги */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Назва
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            placeholder="Наприклад: Чистий код"
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
          />
        </div>

        {/* Автор */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Автор
          </label>
          <input
            type="text"
            value={formData.author}
            onChange={(e) =>
              setFormData({ ...formData, author: e.target.value })
            }
            placeholder="Наприклад: Роберт Мартін"
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
          />
        </div>

        {/* Жанр */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Жанр
          </label>
          <select
            value={formData.genre}
            onChange={(e) =>
              setFormData({ ...formData, genre: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
          >
            {GENRES.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>

        {/* Статус */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Статус
          </label>
          <select
            value={formData.status}
            onChange={(e) =>
              setFormData({ ...formData, status: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
          >
            {Object.entries(STATUS_LABELS).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button
        type="submit"
        className="mt-6 w-full md:w-auto px-8 py-2.5 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition shadow-md shadow-blue-100"
      >
        Додати до бібліотеки
      </button>
    </form>
  );
}

import { useState, useEffect } from "react";
import Header from "./components/Header";
import BookList from "./components/BookList";
import AddBookForm from "./components/AddBookForm";
import Filters from "./components/Filters";
import initialBooksData from "./data/books.json";

function App() {
  const [books, setBooks] = useState(() => {
    const savedBooks = localStorage.getItem("myLibrary");

    if (savedBooks) {
      return JSON.parse(savedBooks);
    }

    return initialBooksData;
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterGenre, setFilterGenre] = useState("all");
  const [sortBy, setSortBy] = useState("dateDesc");

  useEffect(() => {
    localStorage.setItem("myLibrary", JSON.stringify(books));
  }, [books]);

  const handleDeleteBook = (idToDelete) => {
    setBooks(books.filter((book) => book.id !== idToDelete));
  };

  const handleUpdateBook = (id, updatedFields) => {
    setBooks(
      books.map((book) =>
        book.id === id ? { ...book, ...updatedFields } : book,
      ),
    );
  };

  const handleAddBook = (newBook) => {
    setBooks([newBook, ...books]);
  };

  const filteredAndSortedBooks = books
    .filter((book) => {
      const matchesSearch =
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        filterStatus === "all" || book.status === filterStatus;

      const matchesGenre = filterGenre === "all" || book.genre === filterGenre;

      return matchesSearch && matchesStatus && matchesGenre;
    })
    .sort((a, b) => {
      if (sortBy === "dateDesc") {
        return new Date(b.addedAt) - new Date(a.addedAt); // Новіші вище
      }
      if (sortBy === "dateAsc") {
        return new Date(a.addedAt) - new Date(b.addedAt); // Старіші вище
      }
      if (sortBy === "titleAsc") {
        return a.title.localeCompare(b.title); // Алфавіт А-Я
      }
      if (sortBy === "titleDesc") {
        return b.title.localeCompare(a.title); // Алфавіт Я-А
      }
      return 0;
    });

  return (
    <div className="min-h-screen pb-10">
      <Header />

      <main className="max-w-4xl mx-auto px-4">
        <AddBookForm onAdd={handleAddBook} />

        <Filters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          filterGenre={filterGenre}
          setFilterGenre={setFilterGenre}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />

        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4">Список книг</h2>
          <BookList
            books={filteredAndSortedBooks}
            onDelete={handleDeleteBook}
            onUpdate={handleUpdateBook}
          />
        </section>
      </main>
    </div>
  );
}

export default App;

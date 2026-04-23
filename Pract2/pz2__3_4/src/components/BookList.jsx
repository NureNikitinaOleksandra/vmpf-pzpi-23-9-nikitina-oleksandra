import BookItem from "./BookItem";

export default function BookList({ books, onDelete, onUpdate }) {
  if (books.length === 0) {
    return (
      <div className="text-center text-gray-500 py-10">
        Ваша бібліотека порожня. Додайте першу книгу!
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {books.map((book) => (
        <BookItem
          key={book.id}
          book={book}
          onDelete={onDelete}
          onUpdate={onUpdate}
        />
      ))}
    </div>
  );
}

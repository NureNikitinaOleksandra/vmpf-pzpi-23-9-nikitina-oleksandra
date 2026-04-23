const saveJson = (obj, filename = "books.json") => {
  const str = JSON.stringify(obj, null, 2);
  const blob = new Blob([str], { type: "application/json" });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;

  link.click();

  URL.revokeObjectURL(url);
};

const generateBooksDatabase = () => {
  const books = [];
  const statuses = ["planned", "reading", "read"];
  const ratings = ["awesome", "normal", "bad", "none"];
  const genres = [
    "Програмування",
    "Фантастика",
    "Детектив",
    "Класика",
    "Психологія",
    "Фентезі",
  ];
  const titles = [
    "Чистий код",
    "1984",
    "Дюна",
    "Володар перснів",
    "Мистецтво війни",
    "Ессенціалізм",
    "Гаррі Поттер",
    "Шерлок Холмс",
    "Кобзар",
    "Алгоритми",
  ];
  const authors = [
    "Роберт Мартін",
    "Джордж Оруелл",
    "Френк Герберт",
    "Дж.Р.Р. Толкін",
    "Сунь Цзи",
    "Ґреґ Маккеон",
    "Дж.К. Роулінг",
    "Артур Конан Дойл",
    "Тарас Шевченко",
    "Томас Кормен",
  ];

  for (let i = 0; i < 10; i++) {
    const randomGenre = genres[Math.floor(Math.random() * genres.length)];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    const randomRating = ratings[Math.floor(Math.random() * ratings.length)];
    const randomDate = new Date(Date.now() - Math.random() * 31536000000); // 31536000000 мілісекунд = 1 рік

    books.push({
      id: i + 1,
      title: titles[i],
      author: authors[i],
      genre: randomGenre,
      status: randomStatus,
      rating: randomStatus === "read" ? randomRating : "none",
      addedAt: randomDate.toISOString(),
    });
  }

  return books;
};

const btn = document.getElementById("generateBtn");

btn.addEventListener("click", () => {
  const myBooks = generateBooksDatabase();
  saveJson(myBooks);

  alert("Файл books.json згенеровано! Шукайте його в папці Завантаження!");
});

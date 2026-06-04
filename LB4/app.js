import express from "express";
import session from "express-session";
import path from "path";
import { fileURLToPath } from "url";
import { sequelize } from "./models/index.js";
import apiRoutes from "./routes/api.js";

// Налаштування для ES Modules (щоб працювали шляхи до папок)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// --- НАЛАШТУВАННЯ СЕРВЕРА ---
// Дозволяємо серверу розуміти JSON та дані з HTML-форм
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Налаштування сесій (це потрібно для системи логіну)
app.use(
  session({
    secret: "super-secret-key-for-lab", // Ключ для шифрування сесії
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 1000 * 60 * 60 * 24 }, // Сесія живе 1 день
  }),
);

// Налаштування шаблонізатора EJS (для відображення HTML)
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public"))); // Для CSS файлів

// --- ПІДКЛЮЧЕННЯ МАРШРУТІВ ---
app.use("/api", apiRoutes);

// Маршрути для відображення HTML-сторінок
app.get("/", (req, res) => {
  // Передаємо дані сесії у шаблон, щоб знати, чи показувати форму входу
  res.render("index", { user: req.session });
});

app.get("/admin", (req, res) => {
  if (req.session.role !== "ADMIN") {
    return res.send(
      '<h1>Доступ заборонено. Ви не адміністратор!</h1><a href="/">На головну</a>',
    );
  }
  res.render("admin", { user: req.session });
});

// --- ЗАПУСК СЕРВЕРА ТА БД ---
const PORT = 3000;

// Синхронізуємо базу даних (створюємо таблиці, якщо їх немає)
sequelize
  .sync()
  .then(() => {
    console.log("✅ База даних успішно синхронізована!");
    app.listen(PORT, () => {
      console.log(`🚀 Сервер працює на http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Помилка підключення до БД:", err);
  });

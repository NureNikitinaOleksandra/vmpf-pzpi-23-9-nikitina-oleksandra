import express, { json } from "express";
import cors from "cors";
import trackRoutes from "./routes/track.routes.js";
import genreRoutes from "./routes/genre.routes.js";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import playlistRoutes from "./routes/playlist.routes.js";
import reviewRoutes from "./routes/review.routes.js";
import analyticsRoutes from "./routes/analytics.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware для обробки CORS та JSON
app.use(cors());
app.use(json());

app.use("/api/auth", authRoutes);
app.use("/api/tracks", trackRoutes);
app.use("/api/genres", genreRoutes);
app.use("/api/playlist", playlistRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/analytics", analyticsRoutes);

// Базовий тестовий маршрут
app.get("/", (req, res) => {
  res.send("Music Streaming API is running!");
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Application started and Listening on port ${PORT}`);
});

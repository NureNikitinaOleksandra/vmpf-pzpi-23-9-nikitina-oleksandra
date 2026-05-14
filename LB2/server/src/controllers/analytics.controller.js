import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const JWT_SECRET = "super_secret_key_123";

// Запис факту прослуховування
export const logPlay = async (req, res) => {
  try {
    const { trackId } = req.body;
    let userId = null;

    // Спробуємо дістати користувача з токена (але не блокуємо, якщо він гість)
    const token = req.headers["authorization"]?.split(" ")[1];
    if (token) {
      try {
        const decoded = jwt.verify(token, JWT_SECRET);
        userId = decoded.userId;
      } catch (e) {
        /* Ігноруємо невалідний токен, запишемо як гостя */
      }
    }

    // Створюємо запис в аналітиці
    await prisma.analyticsLog.create({
      data: {
        trackId: parseInt(trackId),
        userId: userId,
      },
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Помилка запису аналітики" });
  }
};

// Отримання Топ-3 треків
export const getTopTracks = async (req, res) => {
  try {
    // Шукаємо треки, сортуємо їх за кількістю логів (прослуховувань) за спаданням (desc)
    const topTracks = await prisma.track.findMany({
      take: 3, // Беремо тільки 3
      orderBy: {
        logs: { _count: "desc" },
      },
      include: {
        genre: true,
        _count: { select: { logs: true } }, // Підтягуємо саму цифру прослуховувань
      },
    });

    res.json(topTracks);
  } catch (error) {
    res.status(500).json({ error: "Помилка отримання топ треків" });
  }
};

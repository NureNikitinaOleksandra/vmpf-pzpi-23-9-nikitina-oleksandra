import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Отримання списку всіх жанрів
export const getAllGenres = async (req, res) => {
  try {
    const genres = await prisma.genre.findMany();
    res.json(genres);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Помилка при отриманні жанрів" });
  }
};

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Отримати відгуки для конкретного треку
export const getTrackReviews = async (req, res) => {
  try {
    const trackId = parseInt(req.params.trackId);
    const reviews = await prisma.review.findMany({
      where: { trackId },
      include: { user: { select: { name: true } } },
      orderBy: { createdAt: "desc" }, // Нові відгуки зверху
    });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: "Помилка при отриманні відгуків" });
  }
};

// Додати новий відгук (тільки для авторизованих)
export const addReview = async (req, res) => {
  try {
    const { trackId, text, rating } = req.body;
    const userId = req.user.userId;

    const review = await prisma.review.create({
      data: {
        text,
        rating: parseInt(rating),
        trackId: parseInt(trackId),
        userId,
      },
      include: { user: { select: { name: true } } },
    });

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ error: "Не вдалося додати відгук" });
  }
};

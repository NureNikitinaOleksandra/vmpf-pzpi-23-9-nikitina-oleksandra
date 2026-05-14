import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Отримати плейлист конкретного користувача
export const getMyPlaylist = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Шукаємо перший плейлист користувача та підтягуємо треки в ньому
    let playlist = await prisma.playlist.findFirst({
      where: { userId: userId },
      include: { tracks: { include: { genre: true } } },
    });

    // Якщо плейлиста ще немає — створюємо його
    if (!playlist) {
      playlist = await prisma.playlist.create({
        data: { name: "Мій улюблений плейлист", userId: userId },
        include: { tracks: true },
      });
    }

    res.json(playlist);
  } catch (error) {
    res.status(500).json({ error: "Помилка при отриманні плейлиста" });
  }
};

// Додати або видалити трек з плейлиста
export const toggleTrackInPlaylist = async (req, res) => {
  try {
    const { trackId } = req.body;
    const userId = req.user.userId;

    // Знаходимо плейлист користувача
    const playlist = await prisma.playlist.findFirst({
      where: { userId },
      include: { tracks: true },
    });

    // Перевіряємо, чи є вже цей трек у плейлисті
    const isTrackInPlaylist = playlist.tracks.some(
      (track) => track.id === parseInt(trackId),
    );

    // Оновлюємо плейлист
    await prisma.playlist.update({
      where: { id: playlist.id },
      data: {
        tracks: isTrackInPlaylist
          ? { disconnect: { id: parseInt(trackId) } } // Якщо є — від'єднуємо (видаляємо)
          : { connect: { id: parseInt(trackId) } }, // Якщо немає — приєднуємо (додаємо)
      },
    });

    // Відправляємо зрозумілу відповідь на фронтенд
    res.json({
      message: isTrackInPlaylist
        ? "Трек видалено з плейлиста"
        : "Трек додано в плейлист",
      added: !isTrackInPlaylist,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Помилка при оновленні плейлиста" });
  }
};

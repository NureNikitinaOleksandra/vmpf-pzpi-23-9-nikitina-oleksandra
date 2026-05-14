import { PrismaClient } from "@prisma/client";
import { statSync, createReadStream } from "fs";
import { resolve } from "path";

const prisma = new PrismaClient();

// Отримання списку всіх треків
export const getAllTracks = async (req, res) => {
  try {
    const { genreId } = req.query;

    const whereClause = genreId ? { genreId: parseInt(genreId) } : {};

    const tracks = await prisma.track.findMany({
      where: whereClause,
      include: { genre: true },
    });
    res.json(tracks);
  } catch (error) {
    res.status(500).json({ error: "Помилка при отриманні треків" });
  }
};

// Потокова передача аудіо
export const streamTrack = async (req, res) => {
  try {
    const trackId = parseInt(req.params.id);
    const track = await prisma.track.findUnique({ where: { id: trackId } });

    if (!track) {
      return res.status(404).json({ error: "Трек не знайдено" });
    }

    const filePath = resolve(track.filePath);
    const stat = statSync(filePath);
    const fileSize = stat.size;
    const range = req.headers.range; // Браузер каже, з якої секунди читати

    if (range) {
      // Якщо браузер просить частину файлу (наприклад, при перемотці)
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunksize = end - start + 1;

      const file = createReadStream(filePath, { start, end });
      const head = {
        "Content-Range": `bytes ${start}-${end}/${fileSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": chunksize,
        "Content-Type": "audio/mpeg",
      };

      res.writeHead(206, head); // 206 Partial Content
      file.pipe(res);
    } else {
      // Якщо запит без діапазону — віддаємо весь файл потоком
      const head = {
        "Content-Length": fileSize,
        "Content-Type": "audio/mpeg",
      };
      res.writeHead(200, head);
      createReadStream(filePath).pipe(res);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Помилка відтворення треку" });
  }
};

// Завантаження треку на пристрій
export const downloadTrack = async (req, res) => {
  try {
    const trackId = parseInt(req.params.id);
    const track = await prisma.track.findUnique({ where: { id: trackId } });

    if (!track) {
      return res.status(404).json({ error: "Трек не знайдено" });
    }

    const filePath = resolve(track.filePath);

    res.download(filePath, `${track.artist} - ${track.title}.mp3`);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Помилка при завантаженні файлу" });
  }
};

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const popGenre = await prisma.genre.upsert({
    where: { name: "Pop" },
    update: {},
    create: { name: "Pop" },
  });

  const rockGenre = await prisma.genre.upsert({
    where: { name: "Rock" },
    update: {},
    create: { name: "Rock" },
  });

  const rapGenre = await prisma.genre.upsert({
    where: { name: "Rap" },
    update: {},
    create: { name: "Rap" },
  });

  const testUser = await prisma.user.upsert({
    where: { email: "test@example.com" },
    update: {},
    create: {
      email: "test@example.com",
      password: "password123",
      name: "Test User",
    },
  });

  await prisma.track.createMany({
    data: [
      {
        title: "Думи",
        artist: "Артем Пивоваров feat. Dorofeeva",
        filePath: "./uploads/track1.mp3",
        duration: 165,
        genreId: popGenre.id,
      },
      {
        title: "Мам",
        artist: "Скрябiн",
        filePath: "./uploads/track2.mp3",
        duration: 291,
        genreId: rockGenre.id,
      },
      {
        title: "Додому",
        artist: "KALUSH feat. Skofka",
        filePath: "./uploads/track3.mp3",
        duration: 216,
        genreId: rapGenre.id,
      },
    ],
    skipDuplicates: true,
  });

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

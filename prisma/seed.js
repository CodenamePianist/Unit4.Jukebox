const prisma = require("./index");
const { faker } = require("@faker-js/faker");

const seed = async (numUsers = 5, numTracks = 20, numPlaylists = 10) => {
  const users = Array.from({ length: numUsers }, () => ({
    username: faker.person.zodiacSign(),
  }));
  await prisma.user.createMany({ data: users });

  const tracks = Array.from({ length: numTracks }, () => ({
    name: faker.music.songName(),
  }));
  await prisma.track.createMany({ data: tracks });

  for (let i = 0; i < numPlaylists; i++) {
    const playlistTracks = Array.from({ length: 8 }, () => ({
      id: Math.floor(Math.random() * numTracks) + 1,
    }));
    await prisma.playlist.create({
      data: {
        name: faker.music.album(),
        description: `Rave Day ${i + 1}`,
        ownerId: Math.floor(Math.random() * numUsers) + 1,
        tracks: { connect: playlistTracks },
      },
    });
  }
};

seed()
  .then(async () => await prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

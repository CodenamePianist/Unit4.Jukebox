const express = require("express");
const router = express.Router();
module.exports = router;

const prisma = require("../prisma");

router.get("/users", async (req, res, next) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    next(error);
  }
});

router.get("/users/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const user = await prisma.user.findFirst({
      where: { id: +id },
      include: { playlists: true },
    });
    if (user) {
      res.json(user);
    } else {
      next({ status: 404, message: `User with id ${id} does not exist.` });
    }
  } catch (error) {
    next(error);
  }
});

router.get("/playlists", async (req, res, next) => {
  try {
    const playlists = await prisma.playlist.findMany();
    res.json(playlists);
  } catch (error) {
    next(error);
  }
});

router.get("/playlists/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const playlist = await prisma.playlist.findUnique({
      where: { id: +id },
      include: { tracks: true },
    });
    if (playlist) {
      res.json(playlist);
    } else {
      next({
        status: 404,
        message: `The playlist with id ${id} does not exist. Sad Day.`,
      });
    }
  } catch (error) {
    next(error);
  }
});

router.post("/playlists", async (req, res, next) => {
  const { name, description, trackIds, ownerId } = req.body;
  const tracks = trackIds.map((id) => ({ id: +id }));

  if (!name) {
    return next({
      status: 422,
      message: "New playlists must have a name.",
    });
  }

  try {
    const playlist = await prisma.playlist.create({
      data: {
        name,
        description,
        ownerId: +ownerId,
        tracks: { connect: tracks },
      },
      include: {
        owner: true,
        tracks: true,
      },
    });
    res.json(playlist);
  } catch (error) {
    console.log(req.body);
    next(error);
  }
});

router.get("/tracks", async (req, res, next) => {
  try {
    const tracks = await prisma.track.findMany();
    res.json(tracks);
  } catch (error) {
    next(error);
  }
});

router.get("/tracks/:id", async (req, res, next) => {
  const { id } = req.params;

  try {
    const track = await prisma.track.findUnique({ where: { id: +id } });
    if (track) {
      res.json(track);
    } else {
      next({ status: 404, message: "This song does not exist. Sad Day." });
    }
  } catch (error) {
    next(error);
  }
});

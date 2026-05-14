import { Router } from "express";
import {
  getAllTracks,
  streamTrack,
  downloadTrack,
} from "../controllers/track.controller.js";

const router = Router();

// GET /api/tracks - отримати список
router.get("/", getAllTracks);

// GET /api/tracks/:id/stream - слухати трек
router.get("/:id/stream", streamTrack);

// GET /api/tracks/:id/download - завантажити трек
router.get("/:id/download", downloadTrack);

export default router;

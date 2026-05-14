import { Router } from "express";
import {
  getMyPlaylist,
  toggleTrackInPlaylist,
} from "../controllers/playlist.controller.js";
import { authenticateToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", authenticateToken, getMyPlaylist);
router.post("/toggle", authenticateToken, toggleTrackInPlaylist);

export default router;

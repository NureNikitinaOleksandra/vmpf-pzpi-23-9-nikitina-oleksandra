import { Router } from "express";
import { logPlay, getTopTracks } from "../controllers/analytics.controller.js";

const router = Router();

router.post("/log", logPlay);
router.get("/top", getTopTracks);

export default router;

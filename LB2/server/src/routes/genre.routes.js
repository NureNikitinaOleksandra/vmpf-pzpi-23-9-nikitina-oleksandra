import { Router } from "express";
import { getAllGenres } from "../controllers/genre.controller.js";

const router = Router();

// GET /api/genres - отримати список жанрів
router.get("/", getAllGenres);

export default router;

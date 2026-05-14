import { Router } from "express";
import {
  getTrackReviews,
  addReview,
} from "../controllers/review.controller.js";
import { authenticateToken } from "../middlewares/auth.middleware.js";

const router = Router();

// Отримати відгуки (доступно всім)
router.get("/:trackId", getTrackReviews);

// Додати відгук (тільки авторизованим)
router.post("/add", authenticateToken, addReview);

export default router;

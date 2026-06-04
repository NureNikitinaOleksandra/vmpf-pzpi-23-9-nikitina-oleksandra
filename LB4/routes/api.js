import express from "express";
import { register, login, logout } from "../controllers/authController.js";
import {
  createPost,
  getPosts,
  addComment,
  toggleLike,
  deletePost,
  deleteComment,
} from "../controllers/postController.js";
import { requireAuth, requireAdmin } from "../middlewares/auth.js";
import { Log } from "../models/index.js";
import {
  getUsers,
  addFriend,
  removeFriend,
} from "../controllers/userController.js";

const router = express.Router();

// --- АВТОРИЗАЦІЯ ---
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

// --- ПОСТИ ---
router.get("/posts", getPosts);
router.post("/posts", requireAuth, createPost);
router.delete("/posts/:id", requireAuth, deletePost);
router.post("/posts/:id/comments", requireAuth, addComment);
router.post("/posts/:id/like", requireAuth, toggleLike);
router.delete("/comments/:id", requireAuth, deleteComment);

// --- КОРИСТУВАЧІ ТА ДРУЗІ ---
router.get("/users", getUsers);
router.post("/users/:id/friend", requireAuth, addFriend);
router.delete("/users/:id/friend", requireAuth, removeFriend);

// --- АДМІН-ПАНЕЛЬ ---
router.get("/admin/logs", requireAdmin, async (req, res) => {
  try {
    const logs = await Log.findAll({ order: [["createdAt", "DESC"]] });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: "Помилка завантаження логів" });
  }
});

export default router;

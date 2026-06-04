import { Post, User, Comment, Like } from "../models/index.js";
import { systemLog } from "../utils/logger.js";
import { Op } from "sequelize";

// Створення нового поста
export const createPost = async (req, res) => {
  try {
    const { content } = req.body;
    const userId = req.session.userId;

    if (!userId) return res.status(401).json({ error: "Потрібна авторизація" });

    const post = await Post.create({ content, UserId: userId });

    await systemLog("CREATE_POST", userId, `Created post ID: ${post.id}`);

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ error: "Помилка створення поста" });
  }
};

// Отримання всіх постів з фільтрацією та сортуванням
export const getPosts = async (req, res) => {
  try {
    const { sort, search } = req.query;

    let orderClause = [["createdAt", "DESC"]];
    if (sort === "likes") {
      orderClause = [["likesCount", "DESC"]];
    }

    let whereClause = {};
    if (search && search !== "undefined" && search.trim() !== "") {
      whereClause = {
        content: { [Op.like]: `%${search.trim()}%` },
      };
    }

    const posts = await Post.findAll({
      where: whereClause,
      order: orderClause,
      include: [
        { model: User, attributes: ["username"] },
        {
          model: Comment,
          include: [{ model: User, attributes: ["username"] }],
        },
      ],
    });

    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: "Помилка завантаження постів" });
  }
};

// Додавання коментаря
export const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    const postId = req.params.id;
    const userId = req.session.userId;

    if (!userId) return res.status(401).json({ error: "Потрібна авторизація" });

    const comment = await Comment.create({
      text,
      PostId: postId,
      UserId: userId,
    });

    await systemLog("ADD_COMMENT", userId, `Commented on post ID: ${postId}`);

    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ error: "Помилка додавання коментаря" });
  }
};

// Лайк
export const toggleLike = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.session.userId;

    if (!userId) return res.status(401).json({ error: "Потрібна авторизація" });

    const existingLike = await Like.findOne({
      where: { PostId: postId, UserId: userId },
    });

    const post = await Post.findByPk(postId);
    if (!post) return res.status(404).json({ error: "Пост не знайдено" });

    if (existingLike) {
      // Якщо лайк є -> видаляємо його і зменшуємо лічильник
      await existingLike.destroy();
      await post.decrement("likesCount");
      await systemLog("UNLIKE_POST", userId, `Unliked post ID: ${postId}`);
      res.json({ message: "Лайк прибрано", isLiked: false });
    } else {
      // Якщо лайка немає -> створюємо його і збільшуємо лічильник
      await Like.create({ PostId: postId, UserId: userId });
      await post.increment("likesCount");
      await systemLog("LIKE_POST", userId, `Liked post ID: ${postId}`);
      res.json({ message: "Лайк поставлено", isLiked: true });
    }
  } catch (error) {
    res.status(500).json({ error: "Помилка обробки лайка" });
  }
};

// Видалення поста
export const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.session.userId;
    const userRole = req.session.role;

    const post = await Post.findByPk(postId);
    if (!post) return res.status(404).json({ error: "Пост не знайдено" });

    if (post.UserId !== userId && userRole !== "ADMIN") {
      return res
        .status(403)
        .json({ error: "Немає прав для видалення цього поста" });
    }

    await post.destroy();
    await systemLog("DELETE_POST", userId, `Deleted post ID: ${postId}`);
    res.json({ message: "Пост успішно видалено" });
  } catch (error) {
    res.status(500).json({ error: "Помилка видалення поста" });
  }
};

// Видалення коментаря
export const deleteComment = async (req, res) => {
  try {
    const commentId = req.params.id;
    const userId = req.session.userId;
    const userRole = req.session.role;

    const comment = await Comment.findByPk(commentId);
    if (!comment)
      return res.status(404).json({ error: "Коментар не знайдено" });

    if (comment.UserId !== userId && userRole !== "ADMIN") {
      return res
        .status(403)
        .json({ error: "Немає прав для видалення коментаря" });
    }

    const postId = comment.PostId;
    await comment.destroy();

    await systemLog(
      "DELETE_COMMENT",
      userId,
      `Deleted comment ID: ${commentId} from post ID: ${postId}`,
    );
    res.json({ message: "Коментар видалено" });
  } catch (error) {
    res.status(500).json({ error: "Помилка видалення коментаря" });
  }
};

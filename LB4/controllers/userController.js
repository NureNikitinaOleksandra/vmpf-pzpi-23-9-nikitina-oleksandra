import { User } from "../models/index.js";
import { systemLog } from "../utils/logger.js";
import { Op } from "sequelize";

// --- ОТРИМАННЯ СПИСКІВ ДРУЗІВ ---
export const getUsers = async (req, res) => {
  try {
    const userId = req.session.userId;
    if (!userId) return res.json({ potentialFriends: [], friends: [] });

    const currentUser = await User.findByPk(userId, {
      include: [{ model: User, as: "Friends", attributes: ["id", "username"] }],
    });

    const friends = currentUser.Friends || [];

    const excludeIds = friends.map((f) => f.id);
    excludeIds.push(userId);

    const potentialFriends = await User.findAll({
      where: { id: { [Op.notIn]: excludeIds } },
      attributes: ["id", "username"],
    });

    res.json({ potentialFriends, friends });
  } catch (error) {
    res.status(500).json({ error: "Помилка завантаження користувачів" });
  }
};

// --- ДОДАВАННЯ У ДРУЗІ ---
export const addFriend = async (req, res) => {
  try {
    const friendId = req.params.id;
    const userId = req.session.userId;

    const user = await User.findByPk(userId);
    const friend = await User.findByPk(friendId);

    if (user && friend) {
      await user.addFriend(friend);
      await friend.addFriend(user);
      await systemLog(
        "ADD_FRIEND",
        userId,
        `Added user ID: ${friendId} to friends`,
      );
    }
    res.json({ message: "Додано до друзів!" });
  } catch (error) {
    res.status(500).json({ error: "Помилка" });
  }
};

// --- ВИДАЛЕННЯ З ДРУЗІВ ---
export const removeFriend = async (req, res) => {
  try {
    const friendId = req.params.id;
    const userId = req.session.userId;

    const user = await User.findByPk(userId);
    const friend = await User.findByPk(friendId);

    if (user && friend) {
      await user.removeFriend(friend);
      await friend.removeFriend(user);
      await systemLog(
        "REMOVE_FRIEND",
        userId,
        `Removed user ID: ${friendId} from friends`,
      );
    }
    res.json({ message: "Видалено з друзів" });
  } catch (error) {
    res.status(500).json({ error: "Помилка" });
  }
};

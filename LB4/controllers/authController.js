import bcrypt from "bcrypt";
import { User } from "../models/index.js";
import { systemLog } from "../utils/logger.js";

export const register = async (req, res) => {
  try {
    const { username, password, role } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      password: hashedPassword,
      role: role || "USER",
    });

    await systemLog(
      "REGISTER",
      user.id,
      `New user registered: ${username} with role ${user.role}`,
    );

    res.status(201).json({ message: "Реєстрація успішна", userId: user.id });
  } catch (error) {
    res.status(400).json({
      error: "Помилка реєстрації. Можливо, такий користувач вже існує.",
    });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(404).json({ error: "Користувача не знайдено" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Невірний пароль" });
    }

    req.session.userId = user.id;
    req.session.role = user.role;

    await systemLog("LOGIN", user.id, `User ${username} logged in`);

    res.json({ message: "Вхід успішний", role: user.role });
  } catch (error) {
    res.status(500).json({ error: "Помилка сервера" });
  }
};

export const logout = async (req, res) => {
  const userId = req.session.userId;
  req.session.destroy(async () => {
    if (userId) await systemLog("LOGOUT", userId, "User logged out");
    res.json({ message: "Вийшли з акаунта" });
  });
};

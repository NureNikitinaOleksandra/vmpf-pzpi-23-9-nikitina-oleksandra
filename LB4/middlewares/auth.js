export const requireAuth = (req, res, next) => {
  // Якщо в сесії є ID користувача - пропускаємо далі
  if (req.session.userId) {
    return next();
  }
  res.status(401).json({ error: "Необхідна авторизація" });
};

export const requireAdmin = (req, res, next) => {
  // Якщо користувач залогінений і має роль ADMIN - пропускаємо
  if (req.session.userId && req.session.role === "ADMIN") {
    return next();
  }
  res
    .status(403)
    .json({ error: "Доступ заборонено. Тільки для адміністраторів." });
};

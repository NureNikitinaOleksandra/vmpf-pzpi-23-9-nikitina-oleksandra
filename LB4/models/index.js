import sequelize from "../config/db.js";
import User from "./User.js";
import Post from "./Post.js";
import Comment from "./Comment.js";
import Like from "./Like.js";
import Log from "./Log.js";

// Зв'язки

// Користувач <-> Пости (1 до багатьох)
User.hasMany(Post, { onDelete: "CASCADE" });
Post.belongsTo(User);

// Користувач <-> Коментарі
User.hasMany(Comment, { onDelete: "CASCADE" });
Comment.belongsTo(User);

// Пост <-> Коментарі
Post.hasMany(Comment, { onDelete: "CASCADE" });
Comment.belongsTo(Post);

// Лайки
User.hasMany(Like, { onDelete: "CASCADE" });
Like.belongsTo(User);
Post.hasMany(Like, { onDelete: "CASCADE" });
Like.belongsTo(Post);

// Зв'язок друзів (Багато до багатьох, Користувач <-> Користувач)
User.belongsToMany(User, {
  as: "Friends",
  through: "Friendships",
  foreignKey: "userId",
  otherKey: "friendId",
});

export { sequelize, User, Post, Comment, Like, Log };

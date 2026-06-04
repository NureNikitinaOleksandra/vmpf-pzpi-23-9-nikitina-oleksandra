import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const User = sequelize.define("User", {
  username: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM("USER", "ADMIN"),
    defaultValue: "USER",
  },
  bio: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: "Привіт! Я новий користувач.",
  },
});

export default User;

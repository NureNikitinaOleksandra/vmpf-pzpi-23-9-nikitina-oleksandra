import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Log = sequelize.define("Log", {
  action: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: true, // Може бути null, якщо дія сталася до авторизації
  },
  details: {
    type: DataTypes.TEXT,
  },
});

export default Log;

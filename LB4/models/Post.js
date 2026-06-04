import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Post = sequelize.define("Post", {
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  likesCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
});

export default Post;

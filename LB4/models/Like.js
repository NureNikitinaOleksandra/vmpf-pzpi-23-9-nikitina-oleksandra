import sequelize from "../config/db.js";

const Like = sequelize.define(
  "Like",
  {},
  {
    indexes: [{ unique: true, fields: ["UserId", "PostId"] }],
  },
);
export default Like;

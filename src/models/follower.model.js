const db = require("../models");
const User = db.user;

module.exports = (sequelize, Sequelize) => {
  const Follower = sequelize.define("followers", {
    // ID del seguidor
    followerId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    // ID del usuario seguido
    followedUserId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
  });

  return Follower;
};

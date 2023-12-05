module.exports = (sequelize, Sequelize) => {
  const Report = sequelize.define("report", {
    userId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    commentId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    reason: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  });

  return Report;
};

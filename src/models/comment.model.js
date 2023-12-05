module.exports = (sequelize, Sequelize) => {
  const Comment = sequelize.define("Comment", {
    content: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    contentId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    username: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  });
  return Comment;
};

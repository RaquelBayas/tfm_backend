module.exports = (sequelize, Sequelize) => {
  const Review = sequelize.define("review", {
    rating: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    comment: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    movieId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    listId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    userId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
  });
  return Review;
};

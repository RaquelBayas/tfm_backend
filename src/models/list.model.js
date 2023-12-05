module.exports = (sequelize, Sequelize) => {
  const List = sequelize.define("list", {
    title: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    description: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    privacy: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    userId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    selectedContent: {
      type: Sequelize.JSON,
      allowNull: true,
    },
  });

  List.associate = (models) => {
    List.belongsTo(models.user, {
      foreignKey: {
        name: "userId",
        allowNull: false,
        onDelete: 'CASCADE',
      },
    });
  };

  return List;
};

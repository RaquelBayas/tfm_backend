const bcrypt = require('bcrypt');

module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("users", {
    username: {
      type: Sequelize.STRING,
    },
    email: {
      type: Sequelize.STRING,
    },
    password: {
      type: Sequelize.STRING,
    },
    profileImg: {
      type: Sequelize.STRING,
      allowNull: true,
    },
  });

  User.prototype.comparePassword = function (password) {
    return bcrypt.compareSync(password, this.password);
  };

  return User;
};

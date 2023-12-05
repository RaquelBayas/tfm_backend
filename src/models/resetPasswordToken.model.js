module.exports = (sequelize, Sequelize) => {
  const ResetPasswordToken = sequelize.define("reset_password-token", {
    token: {
      type: Sequelize.STRING,
    },
    email: {
      type: Sequelize.STRING,
    },
    created_at: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    },
  });

  return ResetPasswordToken;
};

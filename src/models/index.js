const config = require("../config/db.config.js");
const Sequelize = require("sequelize");

const sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, {
  host: config.HOST,
  dialect: config.dialect,
  operatorsAliases: false,
  pool: {
    max: config.pool.max,
    min: config.pool.min,
    acquire: config.pool.acquire,
    idle: config.pool.idle,
  },
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("../models/user.model.js")(sequelize, Sequelize);
db.role = require("../models/role.model.js")(sequelize, Sequelize);
db.resetPasswordToken = require("../models/resetPasswordToken.model.js")(sequelize, Sequelize);
db.list = require("../models/list.model.js")(sequelize, Sequelize);
db.comment = require("../models/comment.model.js")(sequelize, Sequelize);
db.review = require("../models/review.model.js")(sequelize, Sequelize);
db.report = require("../models/report.model.js")(sequelize, Sequelize);
db.follower = require("../models/follower.model.js")(sequelize, Sequelize);
db.contact = require("../models/contact.model.js")(sequelize, Sequelize);

db.role.belongsToMany(db.user, {
  through: "user_roles",
  foreignKey: "roleId",
  otherKey: "userId",
});

db.user.belongsToMany(db.role, {
  through: "user_roles",
  foreignKey: "userId",
  otherKey: "roleId",
});

db.list.belongsTo(db.user, {
  foreignKey: {
    name: "userId",
    allowNull: false,
  },
});

db.user.belongsToMany(db.user, {
  through: db.follower,
  as: "Followers",
  foreignKey: "followerId",
});

db.user.belongsToMany(db.user, {
  through: db.follower,
  as: "FollowedUsers",
  foreignKey: "followedUserId",
});

db.review.belongsTo(db.user, {
  foreignKey: {
    name: "userId",
    allowNull: false,
  },
});

db.report.belongsTo(db.user, {
  foreignKey: {
    name: "userId",
    allowNull: false,
  },
});

db.report.belongsTo(db.comment, {
  foreignKey: {
    name: "commentId",
    allowNull: false,
  },
});

// Asociaciones con alias únicos para la entidad "user"
db.user.hasMany(db.follower, { foreignKey: "followerId", as: "UserFollowers" });
db.user.hasMany(db.follower, { foreignKey: "followedUserId", as: "UserFollowedUsers" });
db.follower.belongsTo(db.user, { foreignKey: "followerId", as: "Follower" });
db.follower.belongsTo(db.user, { foreignKey: "followedUserId", as: "FollowedUser" });

db.ROLES = ["user", "admin"];

module.exports = db;


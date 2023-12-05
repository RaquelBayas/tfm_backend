const { authJwt } = require("../middlewares");
const controller = require("../controllers/follower.controller");

module.exports = (app) => {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });

  app.post("/follow/:followerId/:followedUserId", controller.followUser);
  app.get("/follow/:followerId/followedTotal", controller.getTotalFollowed);
  app.get("/follow/:followerId/followedList", controller.getFollowedList);
  app.get("/follow/:followerId/followersTotal", controller.getTotalFollowers);
  app.get("/follow/:userId/followersList", controller.getFollowersList),
  app.get("/follow/:userId/followingList", controller.getFollowingList);
  app.get("/follow/:followerId/:followedUserId", controller.isFollowingUser);
  app.delete("/follow/:followerId/:followedUserId", controller.unfollowUser);
};

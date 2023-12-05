const { authJwt, verifySignUp } = require("../middlewares");
const controller = require("../controllers/user.controller");
const multerConfig = require("../config/multer.config");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });

  app.get("/api/test/all", controller.allAccess);
  app.get("/api/test/user", [authJwt.verifyToken], controller.userBoard);
  app.get(
    "/api/test/admin",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.adminBoard
  );
  app.get("/profile/:username", controller.visitProfile);
  app.post(
    "/api/users/:userId/upload-profileImg",
    multerConfig.single("profileImg"),
    controller.uploadProfileImg
  );
  app.get("/api/users/:userId/profileImg", controller.getProfileImage);
  app.get("/api/users/:username", controller.searchUsersByUsername);
  app.put(
    "/api/users/:userId",
    [verifySignUp.checkUsernameAvailability],
    controller.updateUsername
  );
  app.post("/api/users/:userId/updateEmail", controller.updateEmail);
  app.post("/api/users/:userId/updatePassword", controller.updatePassword);
};

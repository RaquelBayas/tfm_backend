const { verifySignUp, authJwt } = require("../middlewares");
const controller = require("../controllers/auth.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });

  app.post(
    "/api/auth/signup",
    [
      verifySignUp.checkDuplicateUsernameOrEmail,
      verifySignUp.checkRolesExisted,
    ],
    controller.signup
  );
  app.post("/api/auth/signin", controller.signin);
  app.post("/api/auth/signout", controller.signout);
  app.post("/api/auth/:userId", controller.verifyPassword);
  app.post("/api/auth/forgotPassword", controller.forgotPassword); 
  app.post("/api/auth/updatePassword", controller.updatePassword);
  app.get("/api/users", controller.getUsers); // Usuarios de la app
  app.get(
    "/api/users/:username",
    [authJwt.verifyToken],
    controller.getUserByUsername
  );
  app.get(
    "/api/users/:id",
    [verifySignUp.checkUsernameAvailability],
    controller.updateUsername
  );
  app.get("/api/users/:id/username", controller.getUsernameByID);

};

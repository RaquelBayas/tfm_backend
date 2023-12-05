const { authJwt } = require("../middlewares");
const controller = require("../controllers/list.controller");

module.exports = (app) => {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });

  //Obtener listas del usuario
  app.get("/api/lists", [authJwt.verifyToken], controller.findAll);
  app.get("/api/lists/:userId/:title", [authJwt.verifyToken], controller.getListMeGusta);

  //Crear una lista
  app.post("/api/lists", [authJwt.verifyToken], controller.createList);

  //Obtener listas de un usuario por el id de usuario
  app.get(
    "/api/users/:id/lists",
    [authJwt.verifyToken],
    controller.getListsByUser
  );

  //Devuelve una lista específica de un usuario específico
  app.get("/api/users/:userId/lists/:listId", controller.getListByIdAndUserId);

  app.delete(
    "/api/users/:id/lists/:listId",
    [authJwt.verifyToken],
    controller.deleteList
  );

  /*
  app.post(
    "/api/lists/:listId",
    [authJwt.verifyToken],
    controller.addContentToList
  );*/
  app.post(
    "/api/users/:userId/lists/:listId",
    [authJwt.verifyToken],
    controller.addContentToList
  );
  //Actualiza el content de la lista 
  app.put("/api/lists/:listId",
  [authJwt.verifyToken],
  controller.updateContentList);

};

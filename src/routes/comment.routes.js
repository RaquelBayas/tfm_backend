const controller = require("../controllers/comment.controller");

module.exports = function (app) {
  app.post("/movies/:contentId/comments", controller.addCommentMovie);
  app.post("/series/:contentId/comments", controller.addCommentSerie);
  app.get("/movies/:contentId/comments", controller.getcommentsMovie);
  app.get("/series/:contentId/comments", controller.getcommentsSerie);
  app.post("/comments/:commentId/report", controller.reportComment);
};

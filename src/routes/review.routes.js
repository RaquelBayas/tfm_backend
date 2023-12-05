const { authJwt } = require("../middlewares");
const controller = require("../controllers/review.controller");

module.exports = function (app) {
  app.post("/reviews", controller.createReview);
  app.get("/reviews/:id", controller.getReviewById);
  app.get(
    "/reviews/list/:listId/movie/:movieId",
    controller.getReviewByListIdMovieId
  );
  app.put("/reviews/:id", controller.updateReview);
  app.delete("/reviews/movie/:id", controller.deleteReview);
};

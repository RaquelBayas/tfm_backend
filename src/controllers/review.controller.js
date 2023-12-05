const db = require("../models");
const config = require("../config/auth.config");
const Review = db.review;

exports.createReview = async (req, res) => {
  const { userId, movieId, listId, rating, comment } = req.body;

  console.log("createReview:", userId, "-", movieId);
  try {
    const review = await db.review.create({
      rating,
      comment,
      movieId,
      listId,
      userId,
    });
    return res.status(201).json({ review });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getReviewByListIdMovieId = async (req, res) => {
  const movieId = req.params.movieId;
  const listId = req.params.listId;

  try {
    const reviews = await Review.findOne({
      where: { movieId, listId },
    });
    res.json({ reviews });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getReviewById = async (req, res) => {
  const reviewId = req.params.reviewId;
  try {
    const review = await Review.findOne({
      where: { id: reviewId },
    });
    res.json({ review });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateReview = async (req, res) => {
  const listId = req.params.id;
  const { rating, comment } = req.body;
  console.log(req.params);
  try {
    const review = await Review.findOne({
      where: { id: listId },
    });

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    review.rating = rating;
    review.comment = comment;
    await review.save();
    res.json({ review });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteReview = async (req, res) => {
  const reviewId = req.params.reviewId;
  console.log("deleteReview-bk:", reviewId);
  try {
    const review = await Review.findOne({
      where: { id: reviewId },
    });
    console.log("deleteReview-bk:", review);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    await review.destroy();
    res.json({ message: "Review deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

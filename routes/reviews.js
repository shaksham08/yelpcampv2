const express = require("express");
const router = express.Router({ mergeParams: true });
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware");
const Campground = require("../models/campground");
const Review = require("../models/Review");
const catchAsync = require("../utils/catchAsync");
const reviews = require("../controllers/reviews");

router.post(
  "/reviews",
  isLoggedIn,
  validateReview,
  catchAsync(reviews.createReview)
);

router.delete(
  "/reviews/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  catchAsync(reviews.destroyReview)
);

module.exports = router;

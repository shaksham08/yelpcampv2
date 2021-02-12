const express = require("express");
const router = express.Router({ mergeParams: true });
const { reviewsSchema } = require("../models/validation/schemas");
const Campground = require("../models/campground");
const Review = require("../models/Review");
const catchAsync = require("../utils/catchAsync");

const validateReview = (req, res, next) => {
  const result = reviewsSchema.validate(req.body);
  if (result.error) {
    throw new ExpressError(
      result.error.details.map((el) => el.message).join(","),
      500
    );
  }
  next();
};

router.post(
  "/reviews",
  validateReview,
  catchAsync(async (req, res, next) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    res.redirect(`/campgrounds/${req.params.id}`);
  })
);

router.delete(
  "/:reviewId",
  catchAsync(async (req, res, next) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, {
      $pull: { reviews: reviewId },
    });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/campgrounds/${id}`);
  })
);

module.exports = router;

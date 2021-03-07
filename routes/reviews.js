const express = require("express");
const router = express.Router({ mergeParams: true });
const { validateReview } = require("../middleware");
const Campground = require("../models/campground");
const Review = require("../models/Review");
const catchAsync = require("../utils/catchAsync");

router.post(
  "/reviews",
  validateReview,
  catchAsync(async (req, res, next) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash("success", "Sucessfully created new review");
    res.redirect(`/campgrounds/${req.params.id}`);
  })
);

router.delete(
  "/reviews/:reviewId",
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

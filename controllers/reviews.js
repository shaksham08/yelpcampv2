const Campground = require("../models/campground");
const Review = require("../models/Review");

module.exports.createReview = async (req, res, next) => {
  const campground = await Campground.findById(req.params.id);
  const review = new Review(req.body.review);
  review.author = req.user._id;
  campground.reviews.push(review);
  await review.save();
  await campground.save();
  req.flash("success", "Sucessfully created new review");
  res.redirect(`/campgrounds/${req.params.id}`);
};

module.exports.destroyReview = async (req, res, next) => {
  const { id, reviewId } = req.params;
  await Campground.findByIdAndUpdate(id, {
    $pull: { reviews: reviewId },
  });
  await Review.findByIdAndDelete(reviewId);
  res.redirect(`/campgrounds/${id}`);
};

const {
  campgroundsSchema,
  reviewsSchema,
  usersSchema,
} = require("./models/validation/Schemas");
const ExpressError = require("./utils/ExpressError");
const Campground = require("./models/campground");
const Review = require("./models/Review");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash("error", "You must be signed in first!");
    return res.redirect("/login");
  }
  next();
};

module.exports.isAuthor = async (req, res, next) => {
  const { id } = req.params;
  const campground = await Campground.findById(id)
    .populate("reviews")
    .populate("author");
  if (!campground.author.equals(req.user._id)) {
    req.flash("error", "You do not have permission to do that!!");
    return res.redirect(`/campgrounds/${id}`);
  }
  next();
};

module.exports.validateCampground = async (req, res, next) => {
  const result = campgroundsSchema.validate(req.body);
  if (result.error) {
    throw new ExpressError(
      result.error.details.map((el) => el.message).join(","),
      500
    );
  }
  next();
};

module.exports.validateReview = (req, res, next) => {
  const result = reviewsSchema.validate(req.body);
  if (result.error) {
    throw new ExpressError(
      result.error.details.map((el) => el.message).join(","),
      500
    );
  }
  next();
};

module.exports.isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId).populate("author");
  if (!review.author.equals(req.user._id)) {
    req.flash("error", "You do not have permission to do that!!");
    return res.redirect(`/campgrounds/${id}`);
  }
  next();
};

module.exports.validateUser = (req, res, next) => {
  const result = usersSchema.validate(req.body);
  if (result.error) {
    throw new ExpressError(
      result.error.details.map((el) => el.message).join(","),
      500
    );
  }
  next();
};

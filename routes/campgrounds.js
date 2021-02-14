const express = require("express");
const router = express.Router({ mergeParams: true });
const { campgroundsSchema } = require("../models/validation/schemas");
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const Campground = require("../models/campground");

const validateCampground = (req, res, next) => {
  const result = campgroundsSchema.validate(req.body);

  if (result.error) {
    throw new ExpressError(
      result.error.details.map((el) => el.message).join(","),
      500
    );
  }
  next();
};

router.get(
  "/campgrounds",
  catchAsync(async (req, res, next) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
  })
);

router.get("/campgrounds/new", (req, res) => {
  res.render("campgrounds/new");
});

router.post(
  "/campgrounds",
  validateCampground,
  catchAsync(async (req, res, next) => {
    const newCampground = new Campground(req.body.campground);
    await newCampground.save();
    req.flash("success", "Sucessfully created new campground");
    res.redirect(`/campgrounds/${newCampground._id}`);
  })
);

router.get(
  "/campgrounds/:id",
  catchAsync(async (req, res, next) => {
    const campground = await Campground.findById(req.params.id).populate(
      "reviews"
    );
    //TODO: Why we need this as already we are handling errors
    //why when we try to visit any id we get another error and once delete and then visit hen we get different errior
    if (!campground) {
      req.flash("error", "Cannot find that campground!");
      return res.redirect("/campgrounds");
    }
    res.render("campgrounds/show", { campground });
  })
);

router.get(
  "/campgrounds/:id/edit",
  catchAsync(async (req, res, next) => {
    const campground = await Campground.findById(req.params.id);
    if (!campground) {
      req.flash("error", "Cannot find that campground!");
      return res.redirect("/campgrounds");
    }
    res.render("campgrounds/edit", { campground });
  })
);

router.patch(
  "/campgrounds/:id",
  validateCampground,
  catchAsync(async (req, res, next) => {
    await Campground.findByIdAndUpdate(req.params.id, req.body.campground);
    req.flash("success", "Sucessfully updated the campground");
    res.redirect(`/campgrounds/${req.params.id}`);
  })
);

router.delete(
  "/campgrounds/:id",
  catchAsync(async (req, res, next) => {
    await Campground.findByIdAndDelete(req.params.id);
    req.flash("success", "Successfully deleted campground");
    res.redirect("/campgrounds");
  })
);

module.exports = router;

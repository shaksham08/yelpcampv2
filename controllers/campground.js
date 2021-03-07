const Campground = require("../models/campground");

module.exports.index = async (req, res, next) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index", { campgrounds });
};

module.exports.renderNewForm = (req, res) => {
  res.render("campgrounds/new");
};

module.exports.createCampground = async (req, res, next) => {
  const newCampground = new Campground(req.body.campground);
  newCampground.author = req.user._id;
  await newCampground.save();
  req.flash("success", "Sucessfully created new campground");
  res.redirect(`/campgrounds/${newCampground._id}`);
};

module.exports.showCampgrounds = async (req, res, next) => {
  const campground = await Campground.findById(req.params.id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("author");
  if (!campground) {
    req.flash("error", "Cannot find that campground!");
    return res.redirect("/campgrounds");
  }
  res.render("campgrounds/show", { campground });
};

module.exports.renderEditForm = async (req, res, next) => {
  const campground = await Campground.findById(req.params.id)
    .populate("reviews")
    .populate("author");
  res.render("campgrounds/edit", { campground });
};

module.exports.updateCampground = async (req, res, next) => {
  const { id } = req.params;
  await Campground.findByIdAndUpdate(id, req.body.campground);
  req.flash("success", "Sucessfully updated the campground");
  res.redirect(`/campgrounds/${id}`);
};

module.exports.destroyCampground = async (req, res, next) => {
  const { id } = req.params;
  await Campground.findByIdAndDelete(id);
  req.flash("success", "Successfully deleted campground");
  res.redirect("/campgrounds");
};

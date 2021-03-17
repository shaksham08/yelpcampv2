const mongoose = require("mongoose");
const Review = require("./Review");

const opts = { toJSON: { virtuals: true } };

const ImageSchema = new mongoose.Schema({
  url: String,
  filename: String,
});

ImageSchema.virtual("thumbnail").get(function () {
  return this.url.replace("/upload", "/upload/w_200");
});

//Defining The Campground Schema
const CampgroundSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    geometry: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    description: {
      type: String,
    },
    location: {
      type: String,
    },
    price: {
      type: Number,
    },
    images: [ImageSchema],
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  opts
);

//Deleting all reviews once the campground is deleted
CampgroundSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await Review.remove({ _id: { $in: doc.reviews } });
  }
});

CampgroundSchema.virtual("properties.popUpMarkup").get(function () {
  return `
    <strong><a href="/campgrounds/${this._id}">${this.title}</a><strong>
    <p>${this.description.substring(0, 20)}...</p>`;
});

//Creating a Model From that Schema
const Campground = mongoose.model("Campground", CampgroundSchema);

module.exports = Campground;

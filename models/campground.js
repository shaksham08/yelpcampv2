const mongoose = require("mongoose");
const Review = require("./Review");

//Defining The Campground Schema
const CampgroundSchema = new mongoose.Schema({
  title: {
    type: String,
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
  image: {
    type: String,
  },
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

//Deleting all reviews once the campground is deleted
CampgroundSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await Review.remove({ _id: { $in: doc.reviews } });
  }
});

//Creating a Model From that Schema
const Campground = mongoose.model("Campground", CampgroundSchema);

module.exports = Campground;

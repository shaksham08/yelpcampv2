const mongoose = require("mongoose");

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
    type: String,
  },
});

//Creating a Model From that Schema
const Campground = mongoose.model("Campground", CampgroundSchema);

module.exports = Campground;

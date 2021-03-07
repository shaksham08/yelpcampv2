const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const ReviewSchema = new Schema({
  body: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

const Review = mongoose.model("Review", ReviewSchema);

module.exports = Review;

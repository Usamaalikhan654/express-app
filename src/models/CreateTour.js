const mongoose = require("mongoose");

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  destinations: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    default: "", // Default value if image URL is not provided
  },
});

const TourPackage = mongoose.model("TourPackage", tourSchema);

module.exports = TourPackage;

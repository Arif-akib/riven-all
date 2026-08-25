const mongoose = require("mongoose");

const heroSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    subtitle: String,
    image: {
      type: String,
      required: true,
    },
    buttonText: String,
    buttonLink: String,
    isActive: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Hero", heroSchema);
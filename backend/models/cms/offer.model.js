const mongoose = require("mongoose");

const offerSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    subtitle: String,
    discount: Number,
    image: {
      type: String,
      required: true,
    },
    expiryDate: Date,
    isActive: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Offer", offerSchema);

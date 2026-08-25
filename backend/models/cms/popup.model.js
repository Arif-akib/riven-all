const mongoose = require("mongoose");

const popupSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: String,
    image: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Popup", popupSchema);

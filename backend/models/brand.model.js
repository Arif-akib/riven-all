const mongoose = require("mongoose");

const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Brand name is required"],
      unique: true,
      trim: true,
      lowercase: true,
    },

    slug: {
      type: String,
      required: [true, "Brand slug is required"],
      unique: true,
      trim: true,
      lowercase: true,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category is required"],
    },

    image: {
      type: String,
      default: "",
    },

    isActive: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

brandSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

brandSchema.set("toJSON", {
  virtuals: true,
});

module.exports = mongoose.model("Brand", brandSchema);
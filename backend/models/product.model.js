const mongoose = require("mongoose");

const variantSchema = mongoose.Schema({
  size: { type: String, required: true },
  color: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  discountPrice: { type: Number, min: 0 },
  countInStock: { type: Number, required: true, min: 0 },
  images: [String],
  sku: String,
  isActive: { type: Boolean, default: true },
});

const productSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },

  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },

  description: {
    type: String,
    required: true,
  },

  richDescription: {
    type: String,
    default: "",
  },

  materials: {
    type: String,
    default: "",
  },

  brand: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Brand",
    required: true,
  },

  variants: [variantSchema],

  image: {
    type: String,
    default: "",
  },

  rating: {
    type: Number,
    default: 0,
  },

  numReviews: {
    type: Number,
    default: 0,
  },

  isFeatured: {
    type: Boolean,
    default: false,
  },

  isActive: {
    type: Boolean,
    default: true,
  },

  isOnsale: {
    type: Boolean,
    default: false,
  },

  isNewArrival: {
    type: Boolean,
    default: false,
  },

  dateCreated: {
    type: Date,
    default: Date.now,
  },
});

productSchema.index({
  "variants.size": 1,
  "variants.color": 1,
});

// ✅ ADD INDEX HERE
productSchema.index({ "variants.size": 1, "variants.color": 1 });

// virtual
productSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

productSchema.set("toJSON", {
  virtuals: true,
});

module.exports = mongoose.model("Product", productSchema);

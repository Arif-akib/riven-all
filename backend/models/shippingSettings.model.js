// models/shippingSettings.model.js

const mongoose = require("mongoose");

const shippingSettingsSchema = new mongoose.Schema(
  {
    /**
     * Enable / disable shipping system
     */
    shippingEnabled: {
      type: Boolean,
      default: true,
    },

    /**
     * Default shipping charge
     */
    standardShippingFee: {
      type: Number,
      required: true,
      default: 80,
      min: 0,
    },

    /**
     * Free shipping toggle
     */
    freeShippingEnabled: {
      type: Boolean,
      default: true,
    },

    /**
     * Minimum amount for free shipping
     */
    freeShippingMinimumAmount: {
      type: Number,
      default: 3000,
      min: 0,
    },

    /**
     * Optional inside/outside dhaka support
     */
    insideCityShippingFee: {
      type: Number,
      default: 80,
      min: 0,
    },

    outsideCityShippingFee: {
      type: Number,
      default: 120,
      min: 0,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model(
  "ShippingSettings",
  shippingSettingsSchema,
);
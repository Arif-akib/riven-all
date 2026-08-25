// models/discountSettings.model.js

const mongoose = require("mongoose");

const discountSettingsSchema = new mongoose.Schema(
  {
    /**
     * Global cart discount
     */
    cartDiscountEnabled: {
      type: Boolean,
      default: true,
    },

    /**
     * Discount type
     * flat => fixed amount
     * percentage => %
     */
    discountType: {
      type: String,
      enum: ["flat", "percentage"],
      default: "flat",
    },

    /**
     * Minimum cart amount
     */
    minimumAmount: {
      type: Number,
      default: 5000,
      min: 0,
    },

    /**
     * Discount value
     * flat => 500
     * percentage => 10
     */
    discountValue: {
      type: Number,
      default: 500,
      min: 0,
    },

    /**
     * Prevent huge percentage discounts
     */
    maximumDiscountAmount: {
      type: Number,
      default: 2000,
      min: 0,
    },

    /**
     * Campaign active dates
     */
    startDate: {
      type: Date,
      default: null,
    },

    endDate: {
      type: Date,
      default: null,
    },

    /**
     * Enable / disable
     */
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model(
  "DiscountSettings",
  discountSettingsSchema,
);
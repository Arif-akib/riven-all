// models/order.model.js

const mongoose = require("mongoose");

/**
 * ORDER ITEM
 */

const orderItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    productName: {
      type: String,
      required: true,
      trim: true,
    },

    productSlug: {
      type: String,
      required: true,
      trim: true,
    },

    variantKey: {
      type: String,
      required: true,
      trim: true,
    },

    variant: {
      size: {
        type: String,
        required: true,
      },

      color: {
        type: String,
        required: true,
      },
    },

    image: {
      type: String,
      default: "",
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    _id: false,
  },
);

/**
 * CUSTOMER INFO
 */

const customerInfoSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    zip: { type: String, requried:true},
    country: { type: String, required: true },
  },
  {
    _id: false,
  },
);

/**
 * PRICING
 */

const pricingSchema = new mongoose.Schema(
  {
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },

    discount: {
      type: Number,
      default: 0,
      min: 0,
    },

    shipping: {
      type: Number,
      default: 0,
      min: 0,
    },

    total: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    _id: false,
  },
);

/**
 * ORDER
 */

const orderSchema = new mongoose.Schema(
  {
    /**
     * Human readable order id
     * Example:
     * ORD-20260509-AB12
     */

    orderId: {
      type: String,
      unique: true,
    },

    /**
     * User (optional for guest checkout)
     */

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    /**
     * Customer Info
     */

    customerInfo: {
      type: customerInfoSchema,
      required: true,
    },

    /**
     * Ordered items
     */

    items: {
      type: [orderItemSchema],
      required: true,
      validate: {
        validator: function (items) {
          return items.length > 0;
        },
        message: "Order must contain at least one item",
      },
    },

    /**
     * Pricing
     */

    pricing: {
      type: pricingSchema,
      required: true,
    },

    /**
     * Payment
     */

    paymentMethod: {
      type: String,
      enum: ["cod", "sslcommerz", "stripe"],
      default: "cod",
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },

    transactionId: {
      type: String,
      default: null,
    },

    /**
     * Order status
     */

    orderStatus: {
      type: String,
      enum: [
        "pending",
        "processing",
        "confirmed",
        "shipped",
        "delivered",
        "cancelled",
        "returned",
      ],
      default: "pending",
    },

    /**
     * Optional note
     */

    note: {
      type: String,
      trim: true,
      maxlength: 500,
    },

    /**
     * Delivery timestamps
     */

    deliveredAt: {
      type: Date,
      default: null,
    },

    cancelledAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

/**
 * GENERATE ORDER ID
 */

orderSchema.pre("save", function (next) {
  if (!this.orderId) {
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();

    const date = new Date();

    const formattedDate =
      `${date.getFullYear()}` +
      `${String(date.getMonth() + 1).padStart(2, "0")}` +
      `${String(date.getDate()).padStart(2, "0")}`;

    this.orderId = `ORD-${formattedDate}-${random}`;
  }

  // next();
});

/**
 * INDEXES
 */

// orderSchema.index({ orderId: 1 });

orderSchema.index({ createdAt: -1 });

orderSchema.index({ orderStatus: 1 });

orderSchema.index({ paymentStatus: 1 });

module.exports = mongoose.model("Order", orderSchema);

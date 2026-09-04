// controllers/cart.controller.js

const mongoose = require("mongoose");
const Product = require("../models/product.model");
const Order = require("../models/order.model");
const User = require("../models/user.model");

const ShippingSettings = require("../models/shippingSettings.model");
const DiscountSettings = require("../models/discountSettings.model");

const { getShippingFee } = require("../utils/getShippingPrice");

exports.validateCart = async (req, res) => {
  try {
    const { items } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Items must be an array",
      });
    }

    // 🧠 bulk fetch (fix N+1 problem)
    const productIds = items.map((i) => i.productId);

    const products = await Product.find({
      _id: { $in: productIds },
      isActive: true,
    });

    const productMap = new Map();
    products.forEach((p) => productMap.set(p._id.toString(), p));

    let subtotal = 0;
    let discount = 0;
    let shipping = 0;

    const validatedItems = [];

    for (const item of items) {
      const product = productMap.get(item.productId.toString());

      if (!product) continue;

      const variant = product.variants.find((v) => v.sku === item.variantKey);

      if (!variant) continue;

      const availableStock = variant.countInStock || 0;

      //   const quantity = Math.max(
      //     1,
      //     Math.min(Number(item.quantity) || 1, availableStock),
      //     );

      const quantity = item.quantity;

      const finalPrice =
        variant.discountPrice > 0 ? variant.discountPrice : variant.price;

      const itemSubtotal = finalPrice * quantity;

      subtotal += itemSubtotal;

      validatedItems.push({
        productId: product._id,
        productName: product.name,
        productSlug: product.slug,
        variantKey: variant.sku,
        variant: {
          size: variant.size,
          color: variant.color,
        },
        image: variant.images?.[0] || product.images?.[0] || "",
        quantity,
        stock: availableStock,
        originalPrice: variant.price,
        finalPrice,
        subtotal: itemSubtotal,
        hasDiscount:
          variant.discountPrice && variant.discountPrice < variant.price,
      });
    }

    /**
     * SETTINGS
     */
    const discountSettings = await DiscountSettings.findOne();
    const shippingSettings = await ShippingSettings.findOne();

    /**
     * DISCOUNT (dynamic)
     */
    if (
      discountSettings?.isActive &&
      discountSettings?.cartDiscountEnabled &&
      subtotal >= discountSettings.minimumAmount
    ) {
      if (discountSettings.discountType === "flat") {
        discount = discountSettings.discountValue;
      }

      if (discountSettings.discountType === "percentage") {
        discount = (subtotal * discountSettings.discountValue) / 100;

        if (discount > discountSettings.maximumDiscountAmount) {
          discount = discountSettings.maximumDiscountAmount;
        }
      }
    }

    /**
     * SHIPPING (dynamic)
     */
    shipping = shippingSettings?.standardShippingFee || 80;

    if (
      shippingSettings?.freeShippingEnabled &&
      subtotal >= shippingSettings.freeShippingMinimumAmount
    ) {
      shipping = 0;
    }

    const total = subtotal + shipping - discount;

    return res.status(200).json({
      success: true,
      items: validatedItems,
      summary: {
        subtotal,
        discount,
        shipping,
        freeShipping: shipping === 0,
        total,
      },
    });
  } catch (error) {
    console.error("Validate cart error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to validate cart",
    });
  }
};

// PLACE ORDER user
exports.placeOrder = async (req, res, next) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // 1. Move DB operations inside try block
    const user = await User.findById(req.user.id).session(session);

    if (!user?.name || !user?.phone || !user?.email) {
      throw new Error("Missing customer info");
    }

    const { items, paymentMethod, address, note } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      throw new Error("Cart is empty");
    }

    if (!address || !address.city || !address.zip || !address.country) {
      throw new Error("Missing or incomplete delivery address");
    }

    if (!paymentMethod) {
      throw new Error("Select any payment method");
    }

    /**
     * BULK PRODUCT FETCH
     */
    const productIds = items.map((i) => i.productId);

    const products = await Product.find({
      _id: { $in: productIds },
    }).session(session);

    const productMap = new Map();
    products.forEach((p) => productMap.set(p._id.toString(), p));

    let subtotal = 0;
    let discount = 0;
    let shipping = getShippingFee(address);

    const orderItems = [];

    /**
     * VALIDATION & STOCK LOOP
     */
    for (const item of items) {
      const product = productMap.get(item.productId.toString());

      if (!product) throw new Error("Product not found");

      const variant = product.variants.find((v) => v.sku === item.variantKey);

      if (!variant) throw new Error("Variant not found");

      const quantity = Number(item.quantity);

      if (!quantity || quantity < 1) {
        throw new Error("Invalid quantity");
      }

      // Prevent negative stock
      if (variant.countInStock < quantity) {
        throw new Error(`Only ${variant.countInStock} stock available for ${product.name}`);
      }

      const finalPrice = variant.discountPrice > 0 ? variant.discountPrice : variant.price;
      const itemSubtotal = finalPrice * quantity;

      subtotal += itemSubtotal;

      orderItems.push({
        productId: product._id,
        productName: product.name,
        productSlug: product.slug,
        variantKey: variant.sku,
        variant: {
          size: variant.size,
          color: variant.color,
        },
        image: variant.images?.[0] || product.images?.[0] || "",
        quantity,
        price: finalPrice,
        subtotal: itemSubtotal,
      });

      // Deduct stock
      // variant.countInStock -= quantity;
    }

    /**
     * CREATE ORDER
     */
    const total = subtotal + shipping - discount;

    const order = await Order.create(
      [
        {
          user: user.id,
          customerInfo: {
            name: user.name,
            phone: user.phone,
            email: user.email,
            street: address.street,
            city: address.city,
            zip: address.zip,
            country: address.country,
          },
          items: orderItems,
          paymentMethod,
          note,
          pricing: {
            subtotal,
            discount,
            shipping,
            total,
          },
          paymentStatus: "pending",
          orderStatus: "pending",
        },
      ],
      { session }
    );

    /**
     * SAVE UPDATED PRODUCTS
     */
    for (const product of products) {
      await product.save({ session });
    }

    await session.commitTransaction();

    return res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order: order[0],
    });
  } catch (error) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }

    console.error("Order Creation Error:", error);

    return res.status(400).json({
      success: false,
      message: error.message || "Order failed",
    });
  } finally {
    session.endSession();
  }
};

exports.getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({
      userId: req.user.id,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

// use both for user and admin
exports.getOrder = async (req, res, next) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

// admin
exports.getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateOrder = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { orderStatus, paymentStatus, note, customerInfo } = req.body;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Update allowed fields only
    if (orderStatus !== undefined) {
      order.orderStatus = orderStatus;
    }

    if (paymentStatus !== undefined) {
      order.paymentStatus = paymentStatus;
    }

    if (note !== undefined) {
      order.note = note;
    }

    if (customerInfo !== undefined) {
      order.customerInfo = {
        ...order.customerInfo,
        ...customerInfo,
      };
    }

    await order.save();

    return res.status(200).json({
      success: true,
      message: "Order updated successfully",
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

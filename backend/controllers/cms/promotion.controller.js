const Promotion = require("../../models/cms/promotion.model");

// admin routes
exports.createPromotion = async (req, res, next) => {
  try {
    const { name, isActive } =
      req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Title is required",
      });
    }

    const promotion = await Promotion.create({
      name: name.trim(),
      isActive: isActive === "true" || isActive === true
    });

    return res.status(201).json({
      success: true,
      data: promotion,
    });
  } catch (err) {
    next(err);
  }
};

exports.getAllPromotionList = async (req, res, next) => {
  try {
    const promotions = await Promotion.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      data: promotions,
    });
  } catch (err) {
    next(err);
  }
};

exports.updatePromotion = async (req, res, next) => {
  try {
    const updates = {};

    [
      "title",
      "isActive",
    ].forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const updatedPromotion = await Promotion.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedPromotion) {
      return res.status(404).json({
        success: false,
        message: "Promotion not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Promotion updated successfully",
      data: updatedPromotion,
    });
  } catch (error) {
    next(error);
  }
};


// public route 
exports.getActivePromotionList = async (req, res, next) => {
  try {
    const promotions = await Promotion.find({isActive:true}).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: promotions,
    });
  } catch (err) {
    next(err);
  }
};
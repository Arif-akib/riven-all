const Review = require("../../models/cms/review.model");

// admin routes
exports.createReview = async (req, res, next) => {
  try {
    const { name, comment, rating, isActive } =
      req.body;

    if (!name || !comment) {
      return res.status(400).json({
        success: false,
        message: "Name and review is required",
      });
    }

    const review = await Review.create({
      name: name.trim(),
      comment,
      isActive: isActive === "true" || isActive === true,
      rating: Number(rating) || 0,
    });

    return res.status(201).json({
      success: true,
      data: review,
    });
  } catch (err) {
    next(err);
  }
};

exports.getAllReviewList = async (req, res, next) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      data: reviews,
    });
  } catch (err) {
    next(err);
  }
};

exports.updateReview = async (req, res, next) => {
  try {
    const updates = {};

    [
      "name",
      "comment",
      "rating",
      "isActive",
    ].forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const updatedReview = await Review.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedReview) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Review updated successfully",
      data: updatedReview,
    });
  } catch (error) {
    next(error);
  }
};

// public route 
exports.getActiveReviewList = async (req, res, next) => {
  try {
    const reviews = await Review.find({isActive:true}).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: reviews,
    });
  } catch (err) {
    next(err);
  }
};

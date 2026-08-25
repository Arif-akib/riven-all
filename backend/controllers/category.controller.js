const Category = require("../models/category.model");
const Product = require('../models/product.model')
const cloudinary = require("../utils/cloudinary");
const { extractPublicId } = require("../utils/cloudinary.helper");

const streamifier = require("streamifier");

// admin routes
exports.createCategory = async (req, res, next) => {
  let uploadedImage = null;

  try {
    const { name, slug, color, isActive } = req.body;

    if (!name || !slug) {
      return res
        .status(400)
        .json({ success: false, message: "Name & slug is required" });
    }

    // ✅ upload to cloudinary (ONLY ONCE)
    if (req.file) {
      await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "categories" },
          (error, result) => {
            if (error) return reject(error);
            uploadedImage = result;
            resolve(result);
          },
        );

        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
    }

    const category = await Category.create({
      name,
      slug,
      color,
      isActive,
      image: uploadedImage?.secure_url,
    });
    res.status(201).json({ success: true, data: category });
  } catch (error) {
    if (uploadedImage?.public_id) {
      await cloudinary.uploader.destroy(uploadedImage.public_id);
    }
    next(error);
  }
};

exports.getAllCategoriesList = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};

exports.getCategoryDetails = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }

    res.status(200).json({ success: true, data: category });
  } catch (error) {
    next(error);
  }
};

exports.updateCategory = async (req, res, next) => {
  let uploadedImage = null;

  try {
    const updates = {};

    ["name", "color", "slug", "image", "isActive"].forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const category = await Category.findById(req.params.id);

    if (!Category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // ✅ upload new image (if provided)
    if (req.file) {
      await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "categories" },
          (error, result) => {
            if (error) return reject(error);
            uploadedImage = result;
            resolve(result);
          },
        );

        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });

      updates.image = uploadedImage.secure_url;
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true },
    );

    // ✅ delete old image ONLY AFTER success
    if (uploadedImage && category.image) {
      const publicId = extractPublicId(category.image);

      if (publicId) {
        await cloudinary.uploader.destroy(publicId);
      }
    }

    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: updatedCategory,
    });
  } catch (error) {
    // 🔥 rollback new upload if anything fails
    if (uploadedImage?.public_id) {
      await cloudinary.uploader.destroy(uploadedImage.public_id);
    }
    next(error);
  }
};

// public routes
exports.getActiveCategoriesList = async (req, res, next) => {
  try {
    const categories = await Category.aggregate([
      {
        $match: { isActive: true }
      },
      {
        $lookup: {
          from: "products",
          let: { categoryId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$category", "$$categoryId"] }
              }
            },
            {
              $count: "count"
            }
          ],
          as: "productData"
        }
      },
      {
        $addFields: {
          productCount: {
            $ifNull: [{ $arrayElemAt: ["$productData.count", 0] }, 0]
          }
        }
      },
      {
        $project: {
          productData: 0
        }
      },
      {
        $sort: { createdAt: -1 }
      }
    ]);

    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};

exports.getActiveCategoryDetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    const mongoose = require("mongoose");

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category ID",
      });
    }

    const category = await Category.findOne({
      _id: id,
      isActive: true,
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.status(200).json({
      success: true,
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

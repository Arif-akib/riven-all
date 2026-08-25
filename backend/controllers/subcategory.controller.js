const mongoose = require("mongoose");
const Brand = require("../models/brand.model");
const Category = require("../models/category.model");

const cloudinary = require("../utils/cloudinary");
const { extractPublicId } = require("../utils/cloudinary.helper");
const streamifier = require("streamifier");

/**
 * Convert multipart/form-data boolean values properly.
 */
const parseBoolean = (value, defaultValue = false) => {
  if (value === undefined || value === null || value === "") {
    return defaultValue;
  }

  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "string") {
    return value.toLowerCase() === "true";
  }

  return Boolean(value);
};

/**
 * Upload image to Cloudinary
 */
const uploadImage = async (file) => {
  if (!file) return null;

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "brands",
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }

        resolve(result);
      }
    );

    streamifier.createReadStream(file.buffer).pipe(stream);
  });
};

/**
 * Delete image from Cloudinary
 */
const deleteCloudinaryImage = async (imageUrl) => {
  if (!imageUrl) return;

  try {
    const publicId = extractPublicId(imageUrl);

    if (publicId) {
      await cloudinary.uploader.destroy(publicId);
    }
  } catch (error) {
    console.error("Cloudinary delete error:", error);
  }
};

/**
 * ADMIN
 * Create Brand
 */
exports.createBrand = async (req, res, next) => {
  let uploadedImage = null;

  try {
    const {
      name,
      slug,
      category,
      isActive,
    } = req.body;

    // -------------------------
    // Validation
    // -------------------------

    if (!name?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Brand name is required",
      });
    }

    if (!slug?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Brand slug is required",
      });
    }

    if (!category) {
      return res.status(400).json({
        success: false,
        message: "Category is required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(category)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category ID",
      });
    }

    // Check category exists
    const categoryExists = await Category.findById(category);

    if (!categoryExists) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // -------------------------
    // Check duplicate brand
    // -------------------------

    const existingBrand = await Brand.findOne({
      $or: [
        { name: name.trim().toLowerCase() },
        { slug: slug.trim().toLowerCase() },
      ],
    });

    if (existingBrand) {
      return res.status(409).json({
        success: false,
        message:
          existingBrand.name === name.trim().toLowerCase()
            ? "Brand name already exists"
            : "Brand slug already exists",
      });
    }

    // -------------------------
    // Upload image
    // -------------------------

    if (req.file) {
      uploadedImage = await uploadImage(req.file);
    }

    // -------------------------
    // Create brand
    // -------------------------

    const brand = await Brand.create({
      name: name.trim().toLowerCase(),
      slug: slug.trim().toLowerCase(),
      category,
      isActive: parseBoolean(isActive, false),
      image: uploadedImage?.secure_url || "",
    });

    // Populate category
    await brand.populate("category");

    return res.status(201).json({
      success: true,
      message: "Brand created successfully",
      data: brand,
    });
  } catch (error) {
    // Rollback Cloudinary upload
    if (uploadedImage?.public_id) {
      try {
        await cloudinary.uploader.destroy(uploadedImage.public_id);
      } catch (cloudinaryError) {
        console.error(
          "Cloudinary rollback error:",
          cloudinaryError
        );
      }
    }

    next(error);
  }
};

/**
 * ADMIN
 * Get all brands
 */
exports.getAllBrandList = async (req, res, next) => {
  try {
    const brands = await Brand.find()
      .populate("category", "name slug")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: brands.length,
      data: brands,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * ADMIN
 * Get brand details
 */
exports.getBrandDetails = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid brand ID",
      });
    }

    const brand = await Brand.findById(id).populate(
      "category",
      "name slug"
    );

    if (!brand) {
      return res.status(404).json({
        success: false,
        message: "Brand not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: brand,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * ADMIN
 * Update brand
 */
exports.updateBrand = async (req, res, next) => {
  let uploadedImage = null;

  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid brand ID",
      });
    }

    const brand = await Brand.findById(id);

    if (!brand) {
      return res.status(404).json({
        success: false,
        message: "Brand not found",
      });
    }

    const updates = {};

    // -------------------------
    // Name
    // -------------------------
    if (req.body.name !== undefined) {
      const name = req.body.name.trim().toLowerCase();

      if (!name) {
        return res.status(400).json({
          success: false,
          message: "Brand name cannot be empty",
        });
      }

      updates.name = name;
    }

    // -------------------------
    // Slug
    // -------------------------
    if (req.body.slug !== undefined) {
      const slug = req.body.slug.trim().toLowerCase();

      if (!slug) {
        return res.status(400).json({
          success: false,
          message: "Brand slug cannot be empty",
        });
      }

      updates.slug = slug;
    }

    // -------------------------
    // Category
    // -------------------------
    if (req.body.category !== undefined) {
      const category = req.body.category;

      if (!mongoose.Types.ObjectId.isValid(category)) {
        return res.status(400).json({
          success: false,
          message: "Invalid category ID",
        });
      }

      const categoryExists = await Category.findById(category);

      if (!categoryExists) {
        return res.status(404).json({
          success: false,
          message: "Category not found",
        });
      }

      updates.category = category;
    }

    // -------------------------
    // Active status
    // -------------------------
    if (req.body.isActive !== undefined) {
      updates.isActive = parseBoolean(req.body.isActive);
    }

    // -------------------------
    // Remove existing image
    // -------------------------
    const removeImage =
      req.body.removeImage === true ||
      req.body.removeImage === "true";

    if (removeImage && !req.file) {
      if (brand.image) {
        await deleteCloudinaryImage(brand.image);
      }

      updates.image = "";
    }

    // -------------------------
    // Upload new image
    // -------------------------
    if (req.file) {
      uploadedImage = await uploadImage(req.file);

      updates.image = uploadedImage.secure_url;
    }

    // -------------------------
    // Update database
    // -------------------------
    const updatedBrand = await Brand.findByIdAndUpdate(
      id,
      updates,
      {
        new: true,
        runValidators: true,
      }
    ).populate("category", "name slug");

    // -------------------------
    // Delete OLD image
    // Only when a NEW image replaced it
    // -------------------------
    if (req.file && brand.image) {
      await deleteCloudinaryImage(brand.image);
    }

    return res.status(200).json({
      success: true,
      message: "Brand updated successfully",
      data: updatedBrand,
    });
  } catch (error) {
    // Rollback newly uploaded image
    if (uploadedImage?.public_id) {
      try {
        await cloudinary.uploader.destroy(
          uploadedImage.public_id
        );
      } catch (cloudinaryError) {
        console.error(
          "Cloudinary rollback error:",
          cloudinaryError
        );
      }
    }

    next(error);
  }
};

/**
 * PUBLIC
 * Get active brands
 */
exports.getActiveBrandList = async (req, res, next) => {
  try {
    const brands = await Brand.find({
      isActive: true,
    })
      .populate("category", "name slug")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: brands.length,
      data: brands,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUBLIC
 * Get active brand details
 */
exports.getActiveBrandDetails = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid brand ID",
      });
    }

    const brand = await Brand.findOne({
      _id: id,
      isActive: true,
    }).populate("category", "name slug");

    if (!brand) {
      return res.status(404).json({
        success: false,
        message: "Brand not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: brand,
    });
  } catch (error) {
    next(error);
  }
};
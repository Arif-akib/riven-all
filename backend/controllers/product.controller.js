const mongoose = require("mongoose");

const Product = require("../models/product.model");
const Brand = require("../models/brand.model");

const streamifier = require("streamifier");
const cloudinary = require("../utils/cloudinary");
const { extractPublicId } = require("../utils/cloudinary.helper");

// ============================================================
// HELPERS
// ============================================================

const parseBoolean = (value, defaultValue = false) => {
  if (value === undefined || value === null || value === "") {
    return defaultValue;
  }

  if (typeof value === "boolean") {
    return value;
  }

  return value === "true";
};

const uploadImage = async (file) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "products",
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

const deleteImage = async (imageUrl) => {
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

const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};


// ============================================================
// ADMIN
// CREATE PRODUCT
// ============================================================

exports.createProduct = async (req, res, next) => {
  const uploadedPublicIds = [];

  try {
    let {
      name,
      slug,
      description,
      richDescription,
      materials,
      brand,
      variants: rawVariants,
      isFeatured,
      isActive,
      isNewArrival,
      isOnsale,
    } = req.body;

    // --------------------------------------------------------
    // Parse variants
    // --------------------------------------------------------

    let variants;

    try {
      variants =
        typeof rawVariants === "string"
          ? JSON.parse(rawVariants)
          : rawVariants;
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: "Invalid variants JSON",
      });
    }

    // --------------------------------------------------------
    // Basic validation
    // --------------------------------------------------------

    if (!name?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Product name is required",
      });
    }

    if (!slug?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Product slug is required",
      });
    }

    if (!description?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Product description is required",
      });
    }

    if (!brand) {
      return res.status(400).json({
        success: false,
        message: "Brand is required",
      });
    }

    if (!isValidObjectId(brand)) {
      return res.status(400).json({
        success: false,
        message: "Invalid brand ID",
      });
    }

    if (!Array.isArray(variants) || variants.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one variant is required",
      });
    }

    // --------------------------------------------------------
    // Validate brand
    // --------------------------------------------------------

    const brandExists = await Brand.findById(brand);

    if (!brandExists) {
      return res.status(404).json({
        success: false,
        message: "Brand not found",
      });
    }

    // --------------------------------------------------------
    // Validate variants
    // --------------------------------------------------------

    for (let i = 0; i < variants.length; i++) {
      const variant = variants[i];

      if (!variant.size?.trim()) {
        return res.status(400).json({
          success: false,
          message: `Variant ${i + 1}: size is required`,
        });
      }

      if (!variant.color?.trim()) {
        return res.status(400).json({
          success: false,
          message: `Variant ${i + 1}: color is required`,
        });
      }

      if (
        variant.price === undefined ||
        variant.price === null ||
        variant.price === ""
      ) {
        return res.status(400).json({
          success: false,
          message: `Variant ${i + 1}: price is required`,
        });
      }

      if (
        variant.countInStock === undefined ||
        variant.countInStock === null ||
        variant.countInStock === ""
      ) {
        return res.status(400).json({
          success: false,
          message: `Variant ${i + 1}: stock is required`,
        });
      }

      if (Number(variant.price) < 0) {
        return res.status(400).json({
          success: false,
          message: `Variant ${i + 1}: price cannot be negative`,
        });
      }

      if (Number(variant.countInStock) < 0) {
        return res.status(400).json({
          success: false,
          message: `Variant ${i + 1}: stock cannot be negative`,
        });
      }

      if (
        variant.discountPrice !== undefined &&
        variant.discountPrice !== null &&
        variant.discountPrice !== ""
      ) {
        if (Number(variant.discountPrice) < 0) {
          return res.status(400).json({
            success: false,
            message: `Variant ${i + 1}: discount price cannot be negative`,
          });
        }

        if (Number(variant.discountPrice) > Number(variant.price)) {
          return res.status(400).json({
            success: false,
            message: `Variant ${i + 1}: discount price cannot be greater than price`,
          });
        }
      }
    }

    // --------------------------------------------------------
    // Group uploaded files by variant index
    // --------------------------------------------------------

    const variantImagesMap = {};

    (req.files || []).forEach((file) => {
      const match = file.fieldname.match(/variant_(\d+)_image/);

      if (!match) return;

      const index = Number(match[1]);

      if (!variantImagesMap[index]) {
        variantImagesMap[index] = [];
      }

      variantImagesMap[index].push(file);
    });

    // --------------------------------------------------------
    // Upload variant images
    // --------------------------------------------------------

    for (let i = 0; i < variants.length; i++) {
      const files = variantImagesMap[i] || [];

      const uploadedImages = [];

      for (const file of files) {
        const uploadedImage = await uploadImage(file);

        uploadedPublicIds.push(uploadedImage.public_id);

        uploadedImages.push(uploadedImage.secure_url);
      }

      variants[i].images = uploadedImages;
    }

    // --------------------------------------------------------
    // Create product
    // --------------------------------------------------------

    const product = await Product.create({
      name: name.trim().toLowerCase(),
      slug: slug.trim().toLowerCase(),
      description: description.trim(),
      richDescription: richDescription || "",
      materials: materials || "",
      brand,

      variants: variants.map((variant) => ({
        size: variant.size.trim(),
        color: variant.color.trim(),
        price: Number(variant.price),
        discountPrice:
          variant.discountPrice !== undefined &&
          variant.discountPrice !== ""
            ? Number(variant.discountPrice)
            : undefined,
        countInStock: Number(variant.countInStock),
        images: variant.images || [],
        sku: variant.sku || "",
        isActive:
          variant.isActive !== undefined
            ? parseBoolean(variant.isActive)
            : true,
      })),

      // Keep this for compatibility with your model
      image: variants[0]?.images?.[0] || "",

      isFeatured: parseBoolean(isFeatured, false),
      isActive: parseBoolean(isActive, true),
      isNewArrival: parseBoolean(isNewArrival, false),
      isOnsale: parseBoolean(isOnsale, false),
    });

    await product.populate({
      path: "brand",
      populate: {
        path: "category",
        select: "name slug",
      },
    });

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    // --------------------------------------------------------
    // Rollback uploaded images
    // --------------------------------------------------------

    for (const publicId of uploadedPublicIds) {
      try {
        await cloudinary.uploader.destroy(publicId);
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


// ============================================================
// ADMIN
// GET ALL PRODUCTS
// ============================================================

exports.getAllProductsList = async (req, res, next) => {
  try {
    const products = await Product.find()
      .populate({
        path: "brand",
        select: "name slug image category",
        populate: {
          path: "category",
          select: "name slug",
        },
      })
      .sort({ dateCreated: -1 });

    const formatted = products.map((product) => {
      const firstVariant = product.variants?.[0];

      return {
        _id: product._id,
        id: product._id,

        name: product.name,
        slug: product.slug,

        description: product.description,
        richDescription: product.richDescription,
        materials: product.materials,

        brand: product.brand,

        image: firstVariant?.images?.[0] || "",

        variants: product.variants.map((variant) => ({
          _id: variant._id,
          size: variant.size,
          color: variant.color,
          price: variant.price,
          discountPrice: variant.discountPrice,
          countInStock: variant.countInStock,
          images: variant.images,
          sku: variant.sku,
          isActive: variant.isActive,
        })),

        rating: product.rating,
        numReviews: product.numReviews,

        isFeatured: product.isFeatured,
        isActive: product.isActive,
        isOnsale: product.isOnsale,
        isNewArrival: product.isNewArrival,

        createdAt: product.dateCreated,
      };
    });

    return res.status(200).json({
      success: true,
      count: formatted.length,
      data: formatted,
    });
  } catch (error) {
    next(error);
  }
};


// ============================================================
// ADMIN
// GET PRODUCT DETAILS
// ============================================================

exports.getAllProductDetails = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    const product = await Product.findById(id).populate({
      path: "brand",
      select: "name slug image category",
      populate: {
        path: "category",
        select: "name slug",
      },
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};


// ============================================================
// ADMIN
// UPDATE PRODUCT
// ============================================================

exports.updateProduct = async (req, res, next) => {
  const uploadedPublicIds = [];
  const imagesToDelete = [];

  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    let {
      name,
      slug,
      description,
      richDescription,
      materials,
      brand,
      variants,
      isFeatured,
      isActive,
      isNewArrival,
      isOnsale,
    } = req.body;

    // --------------------------------------------------------
    // Parse variants
    // --------------------------------------------------------

    try {
      variants =
        typeof variants === "string"
          ? JSON.parse(variants)
          : variants;
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: "Invalid variants JSON",
      });
    }

    if (!Array.isArray(variants) || variants.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one variant is required",
      });
    }

    // --------------------------------------------------------
    // Validate brand
    // --------------------------------------------------------

    if (!brand) {
      return res.status(400).json({
        success: false,
        message: "Brand is required",
      });
    }

    if (!isValidObjectId(brand)) {
      return res.status(400).json({
        success: false,
        message: "Invalid brand ID",
      });
    }

    const brandExists = await Brand.findById(brand);

    if (!brandExists) {
      return res.status(404).json({
        success: false,
        message: "Brand not found",
      });
    }

    // --------------------------------------------------------
    // Group uploaded files
    // --------------------------------------------------------

    const variantImagesMap = {};

    (req.files || []).forEach((file) => {
      const match = file.fieldname.match(/variant_(\d+)_image/);

      if (!match) return;

      const index = Number(match[1]);

      if (!variantImagesMap[index]) {
        variantImagesMap[index] = [];
      }

      variantImagesMap[index].push(file);
    });

    // --------------------------------------------------------
    // Process variants
    // --------------------------------------------------------

    for (let i = 0; i < variants.length; i++) {
      const incoming = variants[i];
      const existing = product.variants[i];

      let images = Array.isArray(incoming.images)
        ? [...incoming.images]
        : [];

      // ------------------------------------------------------
      // Upload new images
      // ------------------------------------------------------

      const files = variantImagesMap[i] || [];

      for (const file of files) {
        const uploadedImage = await uploadImage(file);

        uploadedPublicIds.push(uploadedImage.public_id);

        images.push(uploadedImage.secure_url);
      }

      // ------------------------------------------------------
      // Find removed old images
      // ------------------------------------------------------

      if (existing?.images?.length) {
        const removedImages = existing.images.filter(
          (oldImage) => !images.includes(oldImage)
        );

        for (const imageUrl of removedImages) {
          const publicId = extractPublicId(imageUrl);

          if (publicId) {
            imagesToDelete.push(publicId);
          }
        }
      }

      variants[i].images = images;
    }

    // --------------------------------------------------------
    // Update DB FIRST
    // --------------------------------------------------------

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        name: name?.trim().toLowerCase(),
        slug: slug?.trim().toLowerCase(),
        description,
        richDescription: richDescription || "",
        materials: materials || "",
        brand,

        variants,

        image: variants[0]?.images?.[0] || "",

        isFeatured: parseBoolean(isFeatured, product.isFeatured),
        isActive: parseBoolean(isActive, product.isActive),
        isNewArrival: parseBoolean(
          isNewArrival,
          product.isNewArrival
        ),
        isOnsale: parseBoolean(
          isOnsale,
          product.isOnsale
        ),
      },
      {
        new: true,
        runValidators: true,
      }
    ).populate({
      path: "brand",
      select: "name slug image category",
      populate: {
        path: "category",
        select: "name slug",
      },
    });

    // --------------------------------------------------------
    // Delete removed images from Cloudinary
    // --------------------------------------------------------

    for (const publicId of imagesToDelete) {
      try {
        await cloudinary.uploader.destroy(publicId);
      } catch (cloudinaryError) {
        console.error(
          "Cloudinary image deletion error:",
          cloudinaryError
        );
      }
    }

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: updatedProduct,
    });
  } catch (error) {
    // --------------------------------------------------------
    // Rollback newly uploaded images
    // --------------------------------------------------------

    for (const publicId of uploadedPublicIds) {
      try {
        await cloudinary.uploader.destroy(publicId);
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


// ============================================================
// PUBLIC
// GET ACTIVE PRODUCTS
// ============================================================

exports.getAllActiveProductsList = async (req, res, next) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);

    const limit = Math.min(
      Math.max(parseInt(req.query.limit) || 12, 1),
      100
    );

    const skip = (page - 1) * limit;

    const {
      brand,
      onsale,
      featured,
      newArrival,
      sort,
    } = req.query;

    // --------------------------------------------------------
    // Filter
    // --------------------------------------------------------

    const filter = {
      isActive: true,
    };

    if (brand) {
      if (!isValidObjectId(brand)) {
        return res.status(400).json({
          success: false,
          message: "Invalid brand ID",
        });
      }

      filter.brand = brand;
    }

    if (onsale !== undefined) {
      filter.isOnsale = onsale === "true";
    }

    if (featured !== undefined) {
      filter.isFeatured = featured === "true";
    }

    if (newArrival !== undefined) {
      filter.isNewArrival = newArrival === "true";
    }

    // --------------------------------------------------------
    // Sorting
    // --------------------------------------------------------

    let sortOption = {
      dateCreated: -1,
    };

    switch (sort) {
      case "newest":
        sortOption = { dateCreated: -1 };
        break;

      case "oldest":
        sortOption = { dateCreated: 1 };
        break;

      case "price_asc":
        sortOption = {
          "variants.0.price": 1,
        };
        break;

      case "price_desc":
        sortOption = {
          "variants.0.price": -1,
        };
        break;

      default:
        sortOption = {
          dateCreated: -1,
        };
    }

    // --------------------------------------------------------
    // Count
    // --------------------------------------------------------

    const total = await Product.countDocuments(filter);

    // --------------------------------------------------------
    // Products
    // --------------------------------------------------------

    const products = await Product.find(filter)
      .populate({
        path: "brand",
        select: "name slug image category",
        populate: {
          path: "category",
          select: "name slug",
        },
      })
      .sort(sortOption)
      .skip(skip)
      .limit(limit);

    // --------------------------------------------------------
    // Format
    // --------------------------------------------------------

    const formatted = products.map((product) => {
      const variant = product.variants?.[0];

      return {
        _id: product._id,
        id: product._id,

        name: product.name,
        slug: product.slug,

        description: product.description,

        brand: product.brand,

        image: variant?.images?.[0] || "",

        price: variant?.price || 0,
        discountPrice: variant?.discountPrice || null,

        isFeatured: product.isFeatured,
        isOnsale: product.isOnsale,
        isNewArrival: product.isNewArrival,

        rating: product.rating,
        numReviews: product.numReviews,

        createdAt: product.dateCreated,
      };
    });

    return res.status(200).json({
      success: true,
      count: formatted.length,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
      data: formatted,
    });
  } catch (error) {
    next(error);
  }
};


// ============================================================
// PUBLIC
// GET ACTIVE PRODUCT DETAILS
// ============================================================

exports.getActiveProductDetails = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    const product = await Product.findOne({
      _id: id,
      isActive: true,
    }).populate({
      path: "brand",
      select: "name slug image category",
      populate: {
        path: "category",
        select: "name slug",
      },
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};


// ============================================================
// PUBLIC
// FEATURED PRODUCTS
// ============================================================

exports.getActiveFeaturedProductsList = async (
  req,
  res,
  next
) => {
  try {
    const products = await Product.find({
      isActive: true,
      isFeatured: true,
    })
      .populate({
        path: "brand",
        select: "name slug image category",
        populate: {
          path: "category",
          select: "name slug",
        },
      })
      .sort({ dateCreated: -1 })
      .limit(5);

    const formatted = products.map((product) => {
      const variant = product.variants?.[0];

      return {
        _id: product._id,
        id: product._id,

        name: product.name,
        slug: product.slug,

        description: product.description,

        brand: product.brand,

        image: variant?.images?.[0] || "",

        price: variant?.price || 0,
        discountPrice: variant?.discountPrice || null,

        isFeatured: product.isFeatured,
        isOnsale: product.isOnsale,
        isNewArrival: product.isNewArrival,

        createdAt: product.dateCreated,
      };
    });

    return res.status(200).json({
      success: true,
      count: formatted.length,
      data: formatted,
    });
  } catch (error) {
    next(error);
  }
};


// ============================================================
// PUBLIC
// RELATED PRODUCTS
// ============================================================
//
// Products are related through the SAME BRAND.
// Example:
//
// Brand: Nike
//   ├── Air Max
//   ├── Air Force
//   └── Revolution
//
// ============================================================

exports.getRelatedProducts = async (req, res, next) => {
  try {
    const { brandId, productId } = req.params;

    if (!isValidObjectId(brandId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid brand ID",
      });
    }

    if (!isValidObjectId(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    const products = await Product.find({
      brand: brandId,
      _id: {
        $ne: productId,
      },
      isActive: true,
    })
      .populate({
        path: "brand",
        select: "name slug image category",
        populate: {
          path: "category",
          select: "name slug",
        },
      })
      .sort({ dateCreated: -1 })
      .limit(10);

    const formatted = products.map((product) => {
      const variant = product.variants?.[0];

      return {
        _id: product._id,
        id: product._id,

        name: product.name,
        slug: product.slug,

        description: product.description,

        brand: product.brand,

        image: variant?.images?.[0] || "",

        price: variant?.price || 0,
        discountPrice: variant?.discountPrice || null,

        isFeatured: product.isFeatured,
        isOnsale: product.isOnsale,
        isNewArrival: product.isNewArrival,

        createdAt: product.dateCreated,
      };
    });

    return res.status(200).json({
      success: true,
      count: formatted.length,
      data: formatted,
    });
  } catch (error) {
    next(error);
  }
};

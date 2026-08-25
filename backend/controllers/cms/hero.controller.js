const Hero = require("../../models/cms/hero.model");

const cloudinary = require("../../utils/cloudinary");
const { extractPublicId } = require("../../utils/cloudinary.helper");

const streamifier = require("streamifier");

// admin routes
exports.createHero = async (req, res, next) => {
  let uploadedImage = null;

  try {
    const { title, subtitle, buttonText, buttonLink, isActive, order } =
      req.body;

    if (!title || !req.file) {
      return res.status(400).json({
        success: false,
        message: "Title and Image is required",
      });
    }

    // ✅ upload to cloudinary (ONLY ONCE)
    await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "heroes" },
        (error, result) => {
          if (error) return reject(error);
          uploadedImage = result;
          resolve(result);
        },
      );

      streamifier.createReadStream(req.file.buffer).pipe(stream);
    });

    const hero = await Hero.create({
      title: title.trim(),
      subtitle,
      buttonText,
      buttonLink,
      isActive: isActive === "true" || isActive === true,
      order: Number(order) || 0,
      image: uploadedImage.secure_url,
    });

    res.status(201).json({
      success: true,
      data: hero,
    });
  } catch (err) {
    if (uploadedImage?.public_id) {
      await cloudinary.uploader.destroy(uploadedImage.public_id);
    }

    next(err);
  }
};

exports.getAllHeroList = async (req, res, next) => {
  try {
    const heroes = await Hero.find().sort({ order: 1, createdAt: -1 });

    res.json({
      success: true,
      data: heroes,
    });
  } catch (err) {
    next(err);
  }
};

exports.updateHero = async (req, res, next) => {
  let uploadedImage = null;

  try {
    const updates = {};
    // ✅ pick only allowed fields
    [
      "title",
      "subtitle",
      "buttonText",
      "buttonLink",
      "order",
      "isActive",
    ].forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    // ✅ normalize types
    if (updates.isActive !== undefined) {
      updates.isActive =
        updates.isActive === "true" || updates.isActive === true;
    }

    if (updates.order !== undefined) {
      updates.order = Number(updates.order) || 0;
    }

    // ✅ find existing hero first
    const hero = await Hero.findById(req.params.id);

    if (!hero) {
      return res.status(404).json({
        success: false,
        message: "Hero not found",
      });
    }

    // ✅ upload new image (if provided)
    if (req.file) {
      await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "heroes" },
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

    // ✅ update DB
    const updatedHero = await Hero.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    // ✅ delete old image ONLY AFTER success
    if (uploadedImage && hero.image) {
      const publicId = extractPublicId(hero.image);

      if (publicId) {
        await cloudinary.uploader.destroy(publicId);
      }
    }

    res.status(200).json({
      success: true,
      message: "hero updated successfully",
      data: updatedHero,
    });
  } catch (err) {
    // 🔥 rollback new upload if anything fails
    if (uploadedImage?.public_id) {
      await cloudinary.uploader.destroy(uploadedImage.public_id);
    }

    next(err);
  }
};

// public routes 
exports.getActiveHeroList = async (req, res, next) => {
  try {
    const heroes = await Hero.find({isActive:true}).sort({ order: 1, createdAt: -1 });

    res.json({
      success: true,
      data: heroes,
    });
  } catch (err) {
    next(err);
  }
};
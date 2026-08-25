const Offer = require("../../models/cms/offer.model");
const cloudinary = require("../../utils/cloudinary");
const { extractPublicId } = require("../../utils/cloudinary.helper");

const streamifier = require("streamifier");

// admin routes
exports.createOffer = async (req, res, next) => {
  let uploadedImage = null;

  try {
    const { title, subtitle, isActive, order, expiryDate } = req.body;

    if (!title || !req.file) {
      return res.status(400).json({
        success: false,
        message: "Title and Image is required",
      });
    }

    // ✅ upload to cloudinary (ONLY ONCE)
    await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "offers" },
        (error, result) => {
          if (error) return reject(error);
          uploadedImage = result;
          resolve(result);
        },
      );

      streamifier.createReadStream(req.file.buffer).pipe(stream);
    });

    const offer = await Offer.create({
      title: title.trim(),
      subtitle,
      expiryDate,
      isActive: isActive === "true" || isActive === true,
      order: Number(order) || 0,
      image: uploadedImage.secure_url,
    });

    return res.status(201).json({
      success: true,
      data: offer,
    });
  } catch (err) {
    if (uploadedImage?.public_id) {
      await cloudinary.uploader.destroy(uploadedImage.public_id);
    }
    next(err);
  }
};

exports.getAllOfferList = async (req, res, next) => {

  try {
    const offers = await Offer.find().sort({ order: 1, createdAt: -1 });

    res.json({
      success: true,
      data: offers,
    });
  } catch (err) {
    next(err);
  }
};

exports.updateOffer = async (req, res, next) => {
  let uploadedImage = null;
  
  try {
    const updates = {};

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

    // ✅ find existing offer first
    const offer = await Offer.findById(req.params.id);

    if (!Offer) {
      return res.status(404).json({
        success: false,
        message: "Offer not found",
      });
    }

    // ✅ upload new image (if provided)
    if (req.file) {
      await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "offers" },
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

    const updatedOffer = await Offer.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    // ✅ delete old image ONLY AFTER success
    if (uploadedImage && offer.image) {
      const publicId = extractPublicId(offer.image);

      if (publicId) {
        await cloudinary.uploader.destroy(publicId);
      }
    }

    res.status(200).json({
      success: true,
      message: "offer updated successfully",
      data: updatedOffer,
    });
  } catch (error) {
    // 🔥 rollback new upload if anything fails
    if (uploadedImage?.public_id) {
      await cloudinary.uploader.destroy(uploadedImage.public_id);
    }
    next(error);
  }
};


// public route 
exports.getActiveOfferList = async (req, res, next) => {
  let uploadedImage = null;

  try {
    const offers = await Offer.find({isActive:true}).sort({ order: 1, createdAt: -1 });

    res.json({
      success: true,
      data: offers,
    });
  } catch (err) {
    next(err);
  }
};
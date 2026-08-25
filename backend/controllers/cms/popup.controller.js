const Popup = require("../../models/cms/popup.model");

const cloudinary = require("../../utils/cloudinary");
const { extractPublicId } = require("../../utils/cloudinary.helper");

const streamifier = require("streamifier");

// admin routes
exports.createPopup = async (req, res, next) => {
  let uploadedImage = null;

  try {
    const { name, description, isActive } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Title is required",
      });
    }

    // ✅ upload to cloudinary (ONLY ONCE)
    if (req.file) {
      await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "popups" },
          (error, result) => {
            if (error) return reject(error);
            uploadedImage = result;
            resolve(result);
          },
        );

        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
    }

    const popup = await Popup.create({
      name: name.trim(),
      description,
      isActive: isActive === "true" || isActive === true,
      image: uploadedImage?.secure_url,
    });

    return res.status(201).json({
      success: true,
      data: popup,
    });
  } catch (err) {
    if (uploadedImage?.public_id) {
      await cloudinary.uploader.destroy(uploadedImage.public_id);
    }
    next(err);
  }
};

exports.getAllPopupList = async (req, res, next) => {
  try {
    const popups = await Popup.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      data: popups,
    });
  } catch (err) {
    next(err);
  }
};

exports.updatePopup = async (req, res, next) => {
  let uploadedImage = null;
  
  try {
    const updates = {};

    ["name", "description", "image", "isActive"].forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    // ✅ find existing hero first
    const popup = await Popup.findById(req.params.id);

    if (!popup) {
      return res.status(404).json({
        success: false,
        message: "popup not found",
      });
    }

    // ✅ upload new image (if provided)
    if (req.file) {
      await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "popups" },
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

    const updatedPopup = await Popup.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    // ✅ delete old image ONLY AFTER success
    if (uploadedImage && popup.image) {
      const publicId = extractPublicId(popup.image);

      if (publicId) {
        await cloudinary.uploader.destroy(publicId);
      }
    }

    res.status(200).json({
      success: true,
      message: "Popup updated successfully",
      data: updatedPopup,
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
exports.getActivePopupList = async (req, res, next) => {
  try {
    const popups = await Popup.find({isActive: true}).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: popups,
    });
  } catch (err) {
    next(err);
  }
};

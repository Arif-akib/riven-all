// utils/cloudinary.helper.js

exports.extractPublicId = (url) => {
  if (!url) return null;

  try {
    const parts = url.split("/");

    const uploadIndex = parts.findIndex((p) => p === "upload");
    const pathParts = parts.slice(uploadIndex + 1);

    // remove version (v123...)
    if (pathParts[0].startsWith("v")) {
      pathParts.shift();
    }

    const fullPath = pathParts.join("/");

    return fullPath.replace(/\.[^/.]+$/, "");
  } catch (err) {
    return null;
  }
};
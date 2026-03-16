const { v2: cloudinary } = require("cloudinary");

const cloudinaryUrl = (process.env.CLOUDINARY_URL || "").trim();
const cloudName = (process.env.CLOUDINARY_CLOUD_NAME || "").trim();
const apiKey = (process.env.CLOUDINARY_API_KEY || "").trim();
const apiSecret = (process.env.CLOUDINARY_API_SECRET || "").trim();

if (cloudinaryUrl) {
  cloudinary.config(cloudinaryUrl);
} else {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret
  });
}

const uploadImageBuffer = (buffer, options = {}) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) {
        return reject(error);
      }
      resolve(result);
    });

    uploadStream.end(buffer);
  });
};

const extractPublicIdFromUrl = (imageUrl) => {
  if (!imageUrl || typeof imageUrl !== "string") {
    return null;
  }

  const uploadIndex = imageUrl.indexOf("/upload/");
  if (uploadIndex === -1) {
    return null;
  }

  const afterUpload = imageUrl.slice(uploadIndex + "/upload/".length);
  const withoutVersion = afterUpload.replace(/^v\d+\//, "");
  const withoutExtension = withoutVersion.replace(/\.[^.]+$/, "");

  return withoutExtension || null;
};

const deleteImageByUrl = async (imageUrl) => {
  const publicId = extractPublicIdFromUrl(imageUrl);
  if (!publicId) {
    return;
  }

  await cloudinary.uploader.destroy(publicId, { resource_type: "image" });
};

module.exports = {
  cloudinary,
  uploadImageBuffer,
  deleteImageByUrl
};

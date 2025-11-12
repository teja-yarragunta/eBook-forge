// middlewares/uploadMiddleware.js
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

// Configure Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "ebook-forge-covers", // Cloudinary folder
    allowed_formats: ["jpeg", "jpg", "png"],
    public_id: (req, file) => `${file.fieldname}-${Date.now()}`,
  },
});

// Initialize Multer
const uploadMiddleware = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB limit
}).single("coverImage"); // name of the field from frontend

module.exports = uploadMiddleware;

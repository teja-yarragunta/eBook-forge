const multer = require("multer");
const path = require("path");
const fs = require("fs");

// create uploads directory if it doesn't exist
const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// setup storage engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

// check file type
function checkFileType(file, cb) {
  const fileTypes = /jpeg|jpg|png|gif/;
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = fileTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Error: Images only.");
  }
}

// initialize upload
const uploadMiddleware = multer({
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2mb limit
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).single("coverImage"); // fieldname for uploaded file

module.exports = uploadMiddleware;

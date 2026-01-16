const multer = require("multer");
const path = require("path");

// Configure multer for memory storage (for Cloudinary upload)
const storage = multer.memoryStorage();

// File filter function
const fileFilter = (req, file, cb) => {
  // Accept images only
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else if (
    file.mimetype === "text/csv" ||
    file.mimetype === "application/vnd.ms-excel" ||
    file.mimetype ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  ) {
    // Accept CSV and Excel files
    cb(null, true);
  } else {
    cb(
      new Error(
        "Invalid file type. Only images, CSV, and Excel files are allowed."
      ),
      false
    );
  }
};

// Create multer upload instance
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max file size
  },
});

module.exports = upload;

const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Configure storage for uploaded files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir =
      file.fieldname === "image"
        ? path.join(__dirname, "../../uploads/images")
        : path.join(__dirname, "../../uploads/pdfs");

    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

// File filter to validate uploads
const fileFilter = (req, file, cb) => {
  if (file.fieldname === "image") {
    // Accept only image files
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files are allowed!"), false);
    }
  } else if (file.fieldname === "pdfFile") {
    // Accept only PDF files
    if (file.mimetype !== "application/pdf") {
      return cb(new Error("Only PDF files are allowed!"), false);
    }
  }
  cb(null, true);
};

// Initialize multer upload
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

// Middleware for handling book file uploads
const uploadFiles = (req, res, next) => {
  const uploadMiddleware = upload.fields([
    { name: "image", maxCount: 1 },
    { name: "pdfFile", maxCount: 1 },
  ]);

  uploadMiddleware(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading
      return res.status(400).json({ success: false, error: err.message });
    } else if (err) {
      // An unknown error occurred
      return res.status(500).json({ success: false, error: err.message });
    }
    // Everything went fine
    next();
  });
};

const deleteFile = async (filePath) => {
  try {
    const fs = require("fs").promises;
    await fs.unlink(filePath);
    console.log(`File deleted: ${filePath}`);
  } catch (err) {
    console.error(`Error deleting file: ${filePath}`);
  }
};

module.exports = {
  uploadFiles,
  deleteFile,
};

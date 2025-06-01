const express = require("express");
const router = express.Router();
const bookController = require("../../controllers/book/book.controller");
const { uploadFiles } = require("../../middlewares/fileUpload");
const {
  authMiddleware,
  authorize,
} = require("../../middlewares/auth.middlweare");

// Apply authenticaiton middleware to all book routes
router.use(authMiddleware);

// Public routes (accessible to all authenticated users)
router.get("/", bookController.getBooks);
router.get("/:id", bookController.getBookById);

// Protected routes (only accessible to admin users)
// Apply the upload middleware before the createBook controller
router.post("/", authorize(["ADMIN"]), uploadFiles, bookController.createBook);
router.put(
  "/:id",
  authorize(["ADMIN"]),
  uploadFiles,
  bookController.updateBook
);
router.delete("/:id", authorize(["ADMIN"]), bookController.deleteBook);

module.exports = router;

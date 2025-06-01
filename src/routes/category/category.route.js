const express = require("express");
const router = express.Router();
const categoryController = require("../../controllers/category/category.controller");
const {
  authMiddleware,
  authorize,
} = require("../../middlewares/auth.middlweare");
const bookController = require("../../controllers/book/book.controller");

router.use(authMiddleware);

router.get("/", authorize(["ADMIN"]), categoryController.getCategories);
router.get("/:id", authorize(["ADMIN"]), bookController.getBookById);
router.post("/", authorize(["ADMIN"]), categoryController.createCategory);
router.put("/:id", authorize(["ADMIN"]), categoryController.updateCategory);
router.delete("/:id", authorize(["ADMIN"]), categoryController.deleteCategory);

module.exports = router;

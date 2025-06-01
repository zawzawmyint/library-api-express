const categoryService = require("../../services/category/category.service");

class CategoryController {
  async createCategory(req, res, next) {
    try {
      const { name, description } = req.body;

      if (!name) {
        return res
          .status(400)
          .json({ success: false, message: "Name is required." });
      }

      const category = await categoryService.createCategory({
        name,
        description,
      });

      res.status(201).json({
        success: true,
        data: category,
        message: "Category created successfully.",
      });
    } catch (err) {
      next(err);
    }
  }

  async getCategories(req, res, next) {
    try {
      const { search } = req.query;
      const categories = await categoryService.getCategories({ search });

      res.json({
        success: true,
        data: categories,
        message: "Categories retrieved successfully.",
      });
    } catch (err) {
      next(err);
    }
  }

  async getCategoryById(req, res, next) {
    try {
      const { id } = req.params;
      const category = await categoryService.getCategoryById(id);

      if (!category) {
        return res.status(404).json({
          success: false,
          message: "Category not found.",
        });
      }

      res.json({
        success: true,
        data: category,
        message: "Category retrieved successfully.",
      });
    } catch (err) {
      next(err);
    }
  }

  async updateCategory(req, res, next) {
    try {
      const { id } = req.params;
      const { name, description } = req.body;

      let updateData = {
        title,
        description,
      };

      const exists = await categoryService.categoryExists(id);

      if (!exists) {
        return res.status(404).json({
          success: false,
          message: "Category not found.",
        });
      }

      if (!name) {
        return res
          .status(400)
          .json({ success: false, message: "Name is required." });
      }

      const updatedCategory = await categoryService.updateCategory(
        id,
        updateData
      );

      res.json({
        success: true,
        data: updatedCategory,
        message: "Category updated successfully.",
      });
    } catch (err) {
      next(err);
    }
  }

  async deleteCategory(req, res, next) {
    try {
      const { id } = req.params;
      const exists = await categoryService.categoryExists(id);

      if (!exists) {
        return res.status(404).json({
          success: false,
          message: "Category not found.",
        });
      }

      await categoryService.deleteCategory(id);

      res.json({
        success: true,
        data: {},
        message: "Category deleted successfully.",
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new CategoryController();

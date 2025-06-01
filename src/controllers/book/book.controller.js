const bookService = require("../../services/book/book.service");
class BookController {
  async createBook(req, res, next) {
    try {
      const { title, description, publisher, categoryId } = req.body;
      let coverImage = null;
      let pdfFile = null;
      let fileSize = null;
      if (!title) {
        return res
          .status(400)
          .json({ success: false, message: "Title is required." });
      }

      // Process uploaded files
      if (req.files) {
        if (req.files.image) {
          coverImage = req.files.image[0].path.replace(/\\/g, "/");
        }

        if (req.files.pdfFile) {
          pdfFile = req.files.pdfFile[0].path.replace(/\\/g, "/");
          fileSize = req.files.pdfFile[0].size;
        }
      }

      const task = await bookService.createBook(req.user.id, {
        title,
        description,
        publisher,
        coverImage,
        pdfFile,
        fileSize,
        categoryId,
      });

      res.status(201).json({
        success: true,
        data: task,
        message: "Book created successfully",
      });
    } catch (err) {
      next(err);
    }
  }

  async getBooks(req, res, next) {
    try {
      const { publisher, search, categoryId } = req.query;
      const books = await bookService.getBooks(req.user.id, {
        publisher,
        search,
        categoryId,
      });

      res.json({
        success: true,
        data: books,
        message: "Books retrieved successfully",
      });
    } catch (err) {
      next(err);
    }
  }

  async getBookById(req, res, next) {
    try {
      const { id } = req.params;

      const book = await bookService.getBookById(id, req.user.id);

      if (!book) {
        return res.status(404).json({
          success: false,
          message: "Book not found",
        });
      }

      res.json({
        success: true,
        data: book,
        message: "Book retrieved successfully",
      });
    } catch (err) {
      next(err);
    }
  }

  async updateBook(req, res, next) {
    try {
      const { id } = req.params;
      const { title, description, publisher, categoryId } = req.body;

      // Initialize with existing values
      let updateData = {
        title,
        description,
        publisher: publisher ? publisher : "Zack",
        categoryId,
      };

      const exists = await bookService.bookExists(id, req.user.id);

      if (!exists) {
        return res.status(404).json({
          success: false,
          message: "Book not found",
        });
      }

      if (!title) {
        return res.status(400).json({
          success: false,
          message: "Title is required.",
        });
      }

      // Process uploaded files
      if (req.files) {
        if (req.files.image) {
          updateData.coverImage = req.files.image[0].path.replace(/\\/g, "/");
        }

        if (req.files.pdfFile) {
          updateData.pdfFile = req.files.pdfFile[0].path.replace(/\\/g, "/");
          updateData.fileSize = req.files.pdfFile[0].size;
        }
      }

      const updatedBook = await bookService.updateBook(
        id,
        req.user.id,
        updateData
      );

      res.json({
        success: true,
        data: updatedBook,
        message: "Book updated successfully",
      });
    } catch (err) {
      next(err);
    }
  }

  async deleteBook(req, res, next) {
    try {
      const { id } = req.params;

      const exists = await bookService.bookExists(id, req.user.id);

      if (!exists) {
        return res.status(404).json({
          success: false,
          message: "Book not found",
        });
      }

      await bookService.deleteBook(id, req.user.id);

      res.json({
        success: true,
        data: {},
        message: "Book deleted successfully",
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new BookController();

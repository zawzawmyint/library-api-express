const prisma = require("../../../prisma-client");
const { deleteFile } = require("../../middlewares/fileUpload");

class BookService {
  async createBook(userId, book) {
    const {
      title,
      description,
      coverImage,
      publisher,
      pdfFile,
      fileSize,
      categoryId,
    } = book;

    return prisma.book.create({
      data: {
        title,
        description,
        coverImage,
        publisher,
        pdfFile,
        fileSize,
        categoryId,
        userId,
      },
    });
  }

  async getBooks(userId, filters = {}) {
    const { publisher, search, categoryId } = filters;
    const whereClause = {};

    if (publisher) {
      whereClause.publisher = publisher;
    }

    if (categoryId) {
      whereClause.categoryId = categoryId;
    }

    if (search) {
      whereClause.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    if (userId) {
      whereClause.userId = userId;
    }

    const books = await prisma.book.findMany({
      where: whereClause,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        category: {
          select: {
            name: true,
          },
        },
        User: {
          select: {
            name: true,
          },
        },
      },
    });

    return books.map((book) => {
      return {
        ...book,
        categoryName: book.category.name,
        userName: book.User.name,
        category: undefined,
        User: undefined,
      };
    });
  }

  async getBookById(id, userId) {
    const book = await prisma.book.findUnique({
      where: { id: id, userId: userId },
      include: {
        category: {
          select: {
            name: true,
          },
        },
        User: {
          select: {
            name: true,
          },
        },
      },
    });

    return {
      ...book,
      categoryName: book.category.name,
      userName: book.User.name,
      category: undefined,
      User: undefined,
    };
  }

  async updateBook(id, userId, book) {
    const {
      title,
      description,
      coverImage,
      publisher,
      pdfFile,
      fileSize,
      categoryId,
    } = book;

    console.log("Book", book);

    // Get the existing book to access its properties
    const existingBook = await this.getBookById(id);

    const updateData = {};

    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (coverImage !== undefined) {
      // Delete tha last image if it exists
      if (existingBook.coverImage) {
        await deleteFile(existingBook.coverImage);
      }
      updateData.coverImage = coverImage;
    }
    if (publisher !== undefined) updateData.publisher = publisher;
    if (pdfFile !== undefined) {
      // Delete tha last pdf if it exists
      if (existingBook.pdfFile) {
        await deleteFile(existingBook.pdfFile);
      }
      updateData.pdfFile = pdfFile;
    }
    if (fileSize !== undefined) updateData.fileSize = fileSize;
    if (categoryId !== undefined) updateData.categoryId = categoryId;

    return prisma.book.update({
      where: { id: id, userId: userId },
      data: updateData,
    });
  }

  async deleteBook(id, userId) {
    // Delete the book's image and pdf if they exist
    const existingBook = await this.getBookById(id);
    if (existingBook.coverImage) {
      await deleteFile(existingBook.coverImage);
    }
    if (existingBook.pdfFile) {
      await deleteFile(existingBook.pdfFile);
    }

    // Delete the book
    return prisma.book.delete({
      where: { id: id, userId: userId },
    });
  }

  async bookExists(id, userId) {
    const count = await prisma.book.count({
      where: { id: id, userId: userId },
    });
    return count > 0;
  }
}

module.exports = new BookService();

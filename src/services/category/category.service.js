const prisma = require("../../../prisma-client");

class CategoryService {
  async createCategory(cat) {
    const { name, description } = cat;
    return prisma.category.create({
      data: {
        name,
        description,
      },
    });
  }

  async getCategories(filters = {}) {
    const { search } = filters;
    const whereClause = {};

    if (search) {
      whereClause.OR = [
        {
          name: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: search,
            mode: "insensitive",
          },
        },
      ];
    }

    return prisma.category.findMany({
      where: whereClause,
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async getCategoryById(id) {
    return prisma.category.findUnique({
      where: { id: id },
    });
  }

  async updateCategory(id, cat) {
    const { name, description } = cat;
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    return prisma.category.update({
      where: { id: id },
      data: updateData,
    });
  }

  async deleteCategory(id) {
    return prisma.category.delete({
      where: { id: id },
    });
  }

  async categoryExists(id) {
    const count = await prisma.category.count({
      where: { id: id },
    });
    return count > 0;
  }
}

module.exports = new CategoryService();

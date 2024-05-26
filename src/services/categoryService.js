const prisma = require("../../prisma");

const defaultSelect = {
  id: true,
  name: true,
  createdAt: true,
  updatedAt: true,
};

exports.findAllCategory = async () => {
  return await prisma.category.findMany({
    select: defaultSelect,
    orderBy: [
      {
        name: "asc",
      },
    ],
  });
};

exports.findCategoryById = async (id) => {
  return await prisma.category.findUnique({
    where: {
      id: id,
    },
    select: defaultSelect,
  });
};

exports.createCategory = async (data) => {
  const { name } = data;
  return await prisma.category.create({
    data: {
      name,
    },
  });
};

exports.updateCategory = async (id, data) => {
  const { name } = data;
  return await prisma.category.update({
    data: {
      name,
    },
    where: {
      id: id,
    },
  });
};

exports.deleteCategoryById = async (id) => {
  return await prisma.category.delete({
    where: {
      id: id,
    },
  });
};

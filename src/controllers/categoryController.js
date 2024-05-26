const {
  findAllCategory,
  createCategory,
  findCategoryById,
  updateCategory,
  deleteCategoryById,
} = require("../services/categoryService");
const {
  successResponse,
  errorResponse,
} = require("../utils/responseFormatter");

exports.getAll = async (req, res) => {
  try {
    const data = await findAllCategory();
    successResponse(res, data);
  } catch (error) {
    errorResponse(res, null, error);
  }
};

exports.create = async (req, res) => {
  try {
    const data = await createCategory(req.body);
    successResponse(res, data);
  } catch (error) {
    errorResponse(res, null, error);
  }
};

exports.getById = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await findCategoryById(id);
    successResponse(res, data);
  } catch (error) {
    errorResponse(res, null, error);
  }
};

exports.update = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await updateCategory(id, req.body);
    successResponse(res, data);
  } catch (error) {
    errorResponse(res, null, error);
  }
};

exports.destroy = async (req, res) => {
  const { id } = req.params;
  try {
    await deleteCategoryById(id);
    successResponse(res, null, "Category deleted!");
  } catch (error) {
    errorResponse(res, null, error);
  }
};

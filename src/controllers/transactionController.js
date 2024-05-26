const { findCategoryById } = require("../services/categoryService");
const {
  findAllTransaction,
  createTransaction,
  findTransactionById,
  updateTransaction,
  deleteTransactionById,
} = require("../services/transactionService");
const { findWalletById } = require("../services/walletService");
const {
  successResponse,
  errorResponse,
} = require("../utils/responseFormatter");

exports.getAll = async (req, res) => {
  try {
    const data = await findAllTransaction();
    successResponse(res, data);
  } catch (error) {
    errorResponse(res, null, error);
  }
};

exports.create = async (req, res) => {
  const { walletId, categoryId, amount, type } = req.body;
  try {
    const wallet = await findWalletById(walletId);
    if (!wallet) return errorResponse(res, "Invalid wallet!", null, 400);

    if (type === "OUT" && wallet.balance < parseInt(amount))
      return errorResponse(
        res,
        `${
          wallet.name
        } is not enough balance. Current balance (${new Intl.NumberFormat(
          "id-ID"
        ).format(wallet.balance)})`,
        400
      );

    const category = await findCategoryById(categoryId);
    if (!category) return errorResponse(res, "Invalid category!", null, 400);

    const data = await createTransaction(req.body);
    successResponse(res, data);
  } catch (error) {
    errorResponse(res, null, error);
  }
};

exports.getById = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await findTransactionById(id);
    successResponse(res, data);
  } catch (error) {
    errorResponse(res, null, error);
  }
};

exports.destroy = async (req, res) => {
  const { id } = req.params;
  try {
    await deleteTransactionById(id);
    successResponse(res, null, "Transaction deleted!");
  } catch (error) {
    errorResponse(res, null, error);
  }
};

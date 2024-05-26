const {
  findAllWallet,
  createWallet,
  findWalletById,
  updateWallet,
  deleteWalletById,
} = require("../services/walletService");
const {
  successResponse,
  errorResponse,
} = require("../utils/responseFormatter");

exports.getAll = async (req, res) => {
  try {
    const data = await findAllWallet();
    successResponse(res, data);
  } catch (error) {
    errorResponse(res, null, error);
  }
};

exports.create = async (req, res) => {
  try {
    const data = await createWallet(req.body);
    successResponse(res, data);
  } catch (error) {
    errorResponse(res, null, error);
  }
};

exports.getById = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await findWalletById(id);
    successResponse(res, data);
  } catch (error) {
    errorResponse(res, null, error);
  }
};

exports.update = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await updateWallet(id, req.body);
    successResponse(res, data);
  } catch (error) {
    errorResponse(res, null, error);
  }
};

exports.destroy = async (req, res) => {
  const { id } = req.params;
  try {
    await deleteWalletById(id);
    successResponse(res, null, "Wallet deleted!");
  } catch (error) {
    errorResponse(res, null, error);
  }
};

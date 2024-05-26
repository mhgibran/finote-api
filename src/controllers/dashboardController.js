const { findAllTransaction } = require("../services/transactionService");
const { findAllWallet } = require("../services/walletService");
const {
  successResponse,
  errorResponse,
} = require("../utils/responseFormatter");

exports.getAllWallet = async (req, res) => {
  try {
    const orderBy = [
      {
        isMain: "desc",
      },
      {
        isPrivate: "asc",
      },
      {
        balance: "desc",
      },
    ];

    const data = await findAllWallet(orderBy);
    successResponse(res, data);
  } catch (error) {
    errorResponse(res, null, error);
  }
};

exports.getRecentTransaction = async (req, res) => {
  try {
    const data = await findAllTransaction(5);
    successResponse(res, data);
  } catch (error) {
    errorResponse(res, null, error);
  }
};

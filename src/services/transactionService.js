const prisma = require("../../prisma");
const crypto = require("crypto");

const defaultSelect = {
  id: true,
  trxNumber: true,
  trxDate: true,
  note: true,
  type: true,
  amount: true,
  createdAt: true,
  updatedAt: true,
  category: {
    select: {
      id: true,
      name: true,
    },
  },
  wallet: {
    select: {
      id: true,
      name: true,
    },
  },
};

function generateTransactionNumber() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  // Generate a random number (6 digits in this example)
  const randomNumber = crypto.randomInt(100000, 999999);

  // Combine year, month, day, and random number
  const transactionNumber = `${year}${month}${day}${randomNumber}`;

  return transactionNumber;
}

exports.findAllTransaction = async (take = 0) => {
  let queryOptions = {
    select: defaultSelect,
    orderBy: [
      {
        trxDate: "desc",
      },
    ],
  };

  if (take) queryOptions.take = take;

  return await prisma.transaction.findMany(queryOptions);
};

exports.findTransactionById = async (id) => {
  return await prisma.transaction.findUnique({
    where: {
      id: id,
    },
    select: defaultSelect,
  });
};

exports.createTransaction = async (data) => {
  const { trxDate, walletId, categoryId, amount, note, type } = data;

  return await prisma.$transaction(async (prisma) => {
    // Create the transaction
    const transaction = await prisma.transaction.create({
      data: {
        walletId,
        categoryId,
        amount,
        note,
        type,
        trxDate: new Date(trxDate),
        trxNumber: generateTransactionNumber(),
      },
    });

    // Update the wallet balance
    const wallet = await prisma.wallet.findUnique({ where: { id: walletId } });
    const newBalance =
      type === "IN"
        ? wallet.balance.plus(amount)
        : wallet.balance.minus(amount);

    if (newBalance.lessThan(0)) throw new Error("Insufficient balance");

    await prisma.wallet.update({
      where: { id: walletId },
      data: { balance: newBalance },
    });

    return transaction;
  });
};

exports.deleteTransactionById = async (id) => {
  return await prisma.$transaction(async (prisma) => {
    // Delete the transaction
    const transaction = await prisma.transaction.delete({
      where: {
        id: id,
      },
    });

    // Update the wallet balance
    const wallet = await prisma.wallet.findUnique({
      where: { id: transaction.walletId },
    });
    const newBalance =
      transaction.type === "OUT"
        ? wallet.balance.plus(transaction.amount)
        : wallet.balance.minus(transaction.amount);

    if (newBalance.lessThan(0)) throw new Error("Insufficient balance");

    await prisma.wallet.update({
      where: { id: transaction.walletId },
      data: { balance: newBalance },
    });

    return transaction;
  });
};

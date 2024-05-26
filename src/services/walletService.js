const prisma = require("../../prisma");

const defaultSelect = {
  id: true,
  name: true,
  balance: true,
  isMain: true,
  isPrivate: true,
  createdAt: true,
  updatedAt: true,
};

exports.findAllWallet = async (ordering = null) => {
  return await prisma.wallet.findMany({
    select: defaultSelect,
    orderBy: ordering || [
      {
        name: "asc",
      },
    ],
  });
};

exports.findWalletById = async (id) => {
  return await prisma.wallet.findUnique({
    where: {
      id: id,
    },
    select: defaultSelect,
  });
};

exports.createWallet = async (data) => {
  const { name, balance, isMain, isPrivate } = data;
  return await prisma.wallet.create({
    data: {
      name,
      balance,
      isMain: !!+isMain,
      isPrivate: !!+isPrivate,
    },
  });
};

exports.updateWallet = async (id, data) => {
  const { name, balance, isMain, isPrivate } = data;
  return await prisma.wallet.update({
    data: {
      name,
      balance,
      isMain: !!+isMain,
      isPrivate: !!+isPrivate,
    },
    where: {
      id: id,
    },
  });
};

exports.deleteWalletById = async (id) => {
  return await prisma.wallet.delete({
    where: {
      id: id,
    },
  });
};

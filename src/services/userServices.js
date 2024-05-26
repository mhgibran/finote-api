const prisma = require("../../prisma");
const { formatTimestampToDateTime } = require("../utils/formatDate");
const { generateAccessToken, generateRefreshToken } = require("../utils/jwt");

const defaultSelect = {
  id: true,
  name: true,
  email: true,
  password: true,
  createdAt: true,
  updatedAt: true,
};

exports.findUserBy = async (column, value) => {
  return await prisma.user.findUnique({
    where: {
      ...(column === "id"
        ? {
            id: value,
          }
        : column === "email"
        ? {
            email: value,
          }
        : ""),
    },
    select: defaultSelect,
  });
};

exports.registerUser = async (data) => {
  const { name, email, hashedPassword, userAgent, ip } = data;
  return await prisma.$transaction(async (prisma) => {
    // create user
    const user = await prisma.user.create({
      data: {
        name: name,
        email: email,
        password: hashedPassword,
      },
    });

    // asign access & refresh token
    const { password, deletedAt: _, ...payload } = user;
    const accessToken = generateAccessToken(payload);
    const { refreshToken, expiresAt } = generateRefreshToken(payload);

    // create refresh token
    const formattedExpiresAt = formatTimestampToDateTime(expiresAt);
    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        deviceInfo: userAgent,
        ipAddress: ip,
        expiresAt: new Date(formattedExpiresAt),
      },
    });

    return { accessToken, refreshToken };
  });
};

exports.updateUser = async (id, data) => {
  const { name, email } = data;
  return await prisma.user.update({
    data: {
      name: name,
      email: email,
    },
    where: {
      id: id,
    },
  });
};

exports.changePasswordUser = async (id, hashedPassword) => {
  return await prisma.user.update({
    where: {
      id: id,
    },
    data: {
      password: hashedPassword,
    },
  });
};

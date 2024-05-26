const prisma = require("../../prisma");
const { formatTimestampToDateTime } = require("../utils/formatDate");
const { generateAccessToken, generateRefreshToken } = require("../utils/jwt");

exports.findAllByUserId = async (userId) => {
  return await prisma.refreshToken.findMany({
    where: {
      userId: userId,
    },
  });
};

exports.findByToken = async (token) => {
  return await prisma.refreshToken.findFirst({
    where: {
      token: token,
    },
  });
};

exports.createOrUpdateRefreshToken = async (data) => {
  const { user, ip, userAgent } = data;

  // asign access & refresh token
  const { password: _, ...payload } = user;
  const accessToken = generateAccessToken(payload);
  const { refreshToken, expiresAt } = generateRefreshToken(payload);
  const formattedExpiresAt = formatTimestampToDateTime(expiresAt);
  const sessionData = {
    token: refreshToken,
    userId: user.id,
    deviceInfo: userAgent,
    ipAddress: ip,
    expiresAt: new Date(formattedExpiresAt),
  };

  const sessionStored = await prisma.refreshToken.findFirst({
    where: {
      userId: user.id,
      deviceInfo: userAgent,
      ipAddress: ip,
    },
    select: {
      id: true,
    },
  });

  if (sessionStored) {
    await prisma.refreshToken.update({
      where: {
        id: sessionStored.id,
      },
      data: sessionData,
    });
  } else {
    await prisma.refreshToken.create({
      data: sessionData,
    });
  }

  return { accessToken, refreshToken };
};

exports.revokeTokenBy = async (column, value) => {
  return await prisma.refreshToken.deleteMany({
    where: {
      ...(column === "token"
        ? {
            token: value,
          }
        : {
            userId: value,
          }),
    },
  });
};

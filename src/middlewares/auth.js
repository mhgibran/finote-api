const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../config/env");
const prisma = require("../../prisma");

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.sendStatus(401);

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, jwtSecret);
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      include: {
        _count: {
          select: { refreshTokens: true },
        },
      },
    });
    if (!user || !user._count.refreshTokens) return res.sendStatus(401);

    const { password, deletedAt, _count: _, ...payload } = user;
    req.payload = payload;
    next();
  } catch (err) {
    return res.sendStatus(403);
  }
};

module.exports = authMiddleware;

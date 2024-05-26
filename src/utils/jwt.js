const jwt = require("jsonwebtoken");
const {
  jwtSecret,
  jwtExpiration,
  refreshTokenExpiration,
  refreshTokenSecret,
} = require("../config/env");

const generateAccessToken = (user) => {
  return jwt.sign(user, jwtSecret, { expiresIn: jwtExpiration });
};

const generateRefreshToken = (user) => {
  const refreshToken = jwt.sign(user, refreshTokenSecret, {
    expiresIn: refreshTokenExpiration,
  });

  const decoded = jwt.decode(refreshToken);
  return { refreshToken, expiresAt: decoded.exp };
};

const verifyToken = (token) => {
  return jwt.verify(token, jwtSecret);
};

const verifyRefreshToken = (token) => {
  return jwt.verify(token, refreshTokenSecret);
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
  verifyRefreshToken,
};

const dotenv = require("dotenv");

dotenv.config();

module.exports = {
  build: process.env.APP_ENV || "development",
  port: process.env.APP_PORT || 3001,
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiration: process.env.JWT_EXPIRATION,
  refreshTokenExpiration: process.env.REFRESH_TOKEN_EXPIRATION,
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
};

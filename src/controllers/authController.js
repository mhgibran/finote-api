const bcrypt = require("bcrypt");
const { verifyRefreshToken } = require("../utils/jwt");
const { findUserBy, registerUser } = require("../services/userServices");
const {
  findByToken,
  revokeTokenBy,
  createOrUpdateRefreshToken,
} = require("../services/refreshTokenService");
const {
  successResponse,
  errorResponse,
} = require("../utils/responseFormatter");

exports.register = async (req, res) => {
  const { email, password } = req.body;
  const { ip, userAgent } = req;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await findUserBy("email", email);
    if (user) return errorResponse(res, null, "Email already exists", 400);

    const { accessToken, refreshToken } = await registerUser({
      ...req.body,
      hashedPassword,
      ip,
      userAgent,
    });

    res.cookie("_CkToken", refreshToken, {
      httpOnly: true,
      secure: true,
    });
    successResponse(res, {
      accessToken: accessToken,
    });
  } catch (error) {
    errorResponse(res, null, error);
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const { ip, userAgent } = req;

  try {
    const user = await findUserBy("email", email);
    if (!user)
      return errorResponse(res, "Invalid email or password", null, 401);

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return errorResponse(res, "Invalid email or password", null, 401);

    const { accessToken, refreshToken } = await createOrUpdateRefreshToken({
      ...{ user },
      ip,
      userAgent,
    });

    res.cookie("_CkToken", refreshToken, {
      httpOnly: true,
      secure: true,
    });
    successResponse(res, {
      accessToken: accessToken,
    });
  } catch (error) {
    errorResponse(res, null, error);
  }
};

exports.refreshToken = async (req, res) => {
  const { ip, userAgent } = req;
  const cookie = req.cookies;
  if (!cookie._CkToken) return res.sendStatus(401);

  const refreshTokenCookie = cookie._CkToken;

  try {
    const storedToken = await findByToken(refreshTokenCookie);
    if (!storedToken || new Date() > storedToken.expiresAt)
      return errorResponse(res, "Invalid token", null, 401);

    const verifyToken = verifyRefreshToken(refreshTokenCookie);
    if (!verifyToken || verifyToken.id !== storedToken.userId)
      return errorResponse(res, "Invalid token", null, 401);

    const user = await findUserBy("id", verifyToken.id);
    if (!user) return errorResponse(res, "Invalid token", null, 401);

    const { accessToken, refreshToken } = await createOrUpdateRefreshToken({
      ...{ user },
      ip,
      userAgent,
    });

    res.cookie("_CkToken", refreshToken, {
      httpOnly: true,
      secure: true,
    });
    successResponse(res, {
      accessToken: accessToken,
    });
  } catch (error) {
    errorResponse(res, null, error);
  }
};

exports.revoke = async (req, res) => {
  const cookie = req.cookies;
  if (!cookie._CkToken) return res.sendStatus(401);
  const refreshTokenCookie = cookie._CkToken;
  try {
    await revokeTokenBy("token", refreshTokenCookie);
    res.sendStatus(204);
  } catch (error) {
    errorResponse(res, null, error);
  }
};

exports.revokeAll = async (req, res) => {
  try {
    await revokeTokenBy("userId", req.payload.id);
    res.sendStatus(204);
  } catch (error) {
    errorResponse(res, null, error);
  }
};

const bcrypt = require("bcrypt");
const {
  findAllByUserId,
  revokeTokenBy,
} = require("../services/refreshTokenService");
const {
  findUserBy,
  updateUser,
  changePasswordUser,
} = require("../services/userServices");
const {
  successResponse,
  errorResponse,
} = require("../utils/responseFormatter");

exports.getUserProfile = async (req, res) => {
  successResponse(res, req.payload);
};

exports.getUserSessions = async (req, res) => {
  const { id } = req.payload;
  try {
    const data = await findAllByUserId(id);
    successResponse(res, data);
  } catch (error) {
    errorResponse(res, null, error);
  }
};

exports.updateProfile = async (req, res) => {
  const { email, name } = req.body;
  const { id } = req.payload;

  try {
    const user = await findUserBy("id", id);
    if (!user) return res.sendStatus(401);

    const userUpdate = await updateUser(id, { email, name });
    const { password, deletedAt: _, ...userWithoutPassword } = userUpdate;

    successResponse(res, userWithoutPassword);
  } catch (error) {
    errorResponse(res, null, error);
  }
};

exports.changePassword = async (req, res) => {
  const oldPassword = req.body.password;
  const newPassword = req.body.newPassword;
  const { id } = req.payload;

  try {
    const user = await findUserBy("id", id);
    if (!user) return res.sendStatus(401);

    const passwordMatch = await bcrypt.compare(oldPassword, user.password);
    if (!passwordMatch)
      return errorResponse(res, null, "Incorrect password", 400);

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await changePasswordUser(id, hashedPassword);
    await revokeTokenBy("userId", id);

    successResponse(res, null, "Password changed! Please login again");
  } catch (error) {
    errorResponse(res, null, error);
  }
};

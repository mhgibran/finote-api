const express = require("express");
const userProfileController = require("../controllers/userProfileController");
const authMiddleware = require("../middlewares/auth");
const { z } = require("zod");
const { errorResponse } = require("../utils/responseFormatter");

const router = express.Router();

const FormSchema = z.object({
  name: z.string().max(255).min(3),
  email: z.string().email().max(255),
  password: z.string().min(6),
  newPassword: z.string().min(6),
});

const validate = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body);

    next();
  } catch (error) {
    errorResponse(res, "Validation Error", error.errors, 400);
  }
};

router.get("/", authMiddleware, userProfileController.getUserProfile);
router.get("/session", authMiddleware, userProfileController.getUserSessions);
router.post(
  "/update",
  validate(
    FormSchema.omit({
      password: true,
      newPassword: true,
    })
  ),
  authMiddleware,
  userProfileController.updateProfile
);
router.post(
  "/change-password",
  validate(
    FormSchema.omit({
      name: true,
      email: true,
    })
  ),
  authMiddleware,
  userProfileController.changePassword
);

module.exports = router;

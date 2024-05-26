const express = require("express");
const authController = require("../controllers/authController");
const authMiddleware = require("../middlewares/auth");
const { z } = require("zod");
const { errorResponse } = require("../utils/responseFormatter");

const router = express.Router();

const FormSchema = z.object({
  name: z.string().max(255).min(3),
  email: z.string().email().max(255),
  password: z.string().min(6).max(100),
});

const validate = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body);
    next();
  } catch (error) {
    errorResponse(res, "Validation Error", error.errors, 400);
  }
};

router.post("/register", validate(FormSchema), authController.register);
router.post(
  "/login",
  validate(FormSchema.omit({ name: true })),
  authController.login
);
router.post("/refresh-token", authController.refreshToken);
router.post("/revoke", authMiddleware, authController.revoke);
router.post("/revoke-all", authMiddleware, authController.revokeAll);

module.exports = router;

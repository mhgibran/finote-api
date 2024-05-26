const express = require("express");
const { z } = require("zod");
const { errorResponse } = require("../utils/responseFormatter");
const authMiddleware = require("../middlewares/auth");
const walletController = require("../controllers/walletController");

const router = express.Router();

const FormSchema = z.object({
  body: z.object({
    name: z.string().max(255).min(3),
    balance: z.coerce.number().gte(0),
    isMain: z.coerce.boolean(),
    isPrivate: z.coerce.boolean(),
  }),
  params: z.object({
    id: z.string().uuid(),
  }),
});

const validate = (schema) => (req, res, next) => {
  try {
    schema.parse({
      body: req.body,
      params: req.params,
    });
    next();
  } catch (error) {
    errorResponse(res, "Validation Error", error.errors, 400);
  }
};

router.get("/", authMiddleware, walletController.getAll);
router.post(
  "/",
  validate(FormSchema.omit({ params: true })),
  authMiddleware,
  walletController.create
);
router.get(
  "/:id",
  validate(FormSchema.omit({ body: true })),
  authMiddleware,
  walletController.getById
);
router.put(
  "/:id",
  validate(FormSchema),
  authMiddleware,
  walletController.update
);
router.delete(
  "/:id",
  validate(FormSchema.omit({ body: true })),
  authMiddleware,
  walletController.destroy
);

module.exports = router;

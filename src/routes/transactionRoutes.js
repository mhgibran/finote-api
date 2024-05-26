const express = require("express");
const { z } = require("zod");
const { errorResponse } = require("../utils/responseFormatter");
const authMiddleware = require("../middlewares/auth");
const transactionController = require("../controllers/transactionController");

const router = express.Router();

const FormSchema = z.object({
  body: z.object({
    walletId: z.string().uuid(),
    categoryId: z.string().uuid(),
    trxDate: z.coerce.date(),
    amount: z.coerce.number().gte(0),
    note: z.string(),
    type: z.enum(["IN", "OUT", "TRANSFER"]),
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

router.get("/", authMiddleware, transactionController.getAll);
router.post(
  "/",
  validate(FormSchema.omit({ params: true })),
  authMiddleware,
  transactionController.create
);
router.get(
  "/:id",
  validate(FormSchema.omit({ body: true })),
  authMiddleware,
  transactionController.getById
);
router.delete(
  "/:id",
  validate(FormSchema.omit({ body: true })),
  authMiddleware,
  transactionController.destroy
);

module.exports = router;

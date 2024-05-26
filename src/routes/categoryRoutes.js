const express = require("express");
const { z } = require("zod");
const { errorResponse } = require("../utils/responseFormatter");
const authMiddleware = require("../middlewares/auth");
const categoryController = require("../controllers/categoryController");

const router = express.Router();

const FormSchema = z.object({
  body: z.object({
    name: z.string().max(255).min(3),
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

router.get("/", authMiddleware, categoryController.getAll);
router.post(
  "/",
  validate(FormSchema.omit({ params: true })),
  authMiddleware,
  categoryController.create
);
router.get(
  "/:id",
  validate(FormSchema.omit({ body: true })),
  authMiddleware,
  categoryController.getById
);
router.put(
  "/:id",
  validate(FormSchema),
  authMiddleware,
  categoryController.update
);
router.delete(
  "/:id",
  validate(FormSchema.omit({ body: true })),
  authMiddleware,
  categoryController.destroy
);

module.exports = router;

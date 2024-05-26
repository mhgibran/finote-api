const express = require("express");
const authMiddleware = require("../middlewares/auth");
const dashboardController = require("../controllers/dashboardController");

const router = express.Router();

router.get("/wallet", authMiddleware, dashboardController.getAllWallet);
router.get(
  "/transaction",
  authMiddleware,
  dashboardController.getRecentTransaction
);

module.exports = router;

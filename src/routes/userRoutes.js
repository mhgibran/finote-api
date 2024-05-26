const express = require("express");
const userProfileRoutes = require("./userProfileRoutes");

const router = express.Router();

router.use("/profile", userProfileRoutes);

module.exports = router;

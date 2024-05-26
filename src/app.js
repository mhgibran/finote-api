const express = require("express");
const errorHandler = require("./middlewares/errorHandler");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const walletRoutes = require("./routes/walletRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const cookieParser = require("cookie-parser");
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use((req, res, next) => {
  req.userAgent = req.headers["user-agent"] || "unknown";
  next();
});

app.get("/", async (req, res) => {
  res.sendStatus(403);
});
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/wallet", walletRoutes);
app.use("/category", categoryRoutes);
app.use("/transaction", transactionRoutes);
app.use("/dashboard", dashboardRoutes);

app.use(errorHandler);

module.exports = app;

const express = require("express");
const morgan = require("morgan");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(morgan("dev"));

// Debug logger
app.use((req, res, next) => {
  console.log("----- New Request -----");
  console.log("Method:", req.method);
  console.log("URL:", req.originalUrl);
  console.log("Headers:", req.headers);
  console.log("Body:", req.body);
  console.log("------------------------");
  next();
});

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/categories", require("./routes/category"));
app.use("/api/history", require("./routes/history.routes"));
app.use("/api/transactions", require("./routes/transactions.routes"));
app.use("/api/version", require("./routes/version"));
app.use("/api/token-check", require("./routes/token_check.routes"));

// Sequelize DB connection
const sequelize = require("./config/db.config");

// Models
require("./models/user");
require("./models/otp.model");
require("./models/category.model");
require("./models/transaction");
require("./models/history");

(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Connected to DB");

    await sequelize.sync({ alter: true });
    console.log("✅ All models synced");

    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  } catch (err) {
    console.error("❌ DB Error:", err);
  }
})();

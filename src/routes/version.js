// routes/version.js
const express = require("express");
const router = express.Router();

const CURRENT_VERSION = "2.0.0"; // هر وقت آپدیت دادی این رو تغییر بده

router.get("/", (req, res) => {
  res.json({ latest: CURRENT_VERSION });
});

module.exports = router;

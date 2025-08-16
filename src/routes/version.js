// routes/version.js
const express = require("express");
const router = express.Router();

const VERSION_INFO = {
  latest_version: "2.0.0",
  minimum_supported_version: "2.0.0",
  update_url: "https://cafebazaar.ir/app/com.nazmino",
  changelog: [
    { fa: "", en: "" },
    { fa: "", en: "" },
    { fa: "", en: "" }
  ]
};

router.get("/", (req, res) => {
  try {
    console.log("[VERSION] Version info requested");

    res.json(VERSION_INFO);
  } catch (err) {
    console.error("[VERSION] Error fetching version info:", err.message);
    res.status(500).json({
      success: false,
      message: "خطا در دریافت اطلاعات نسخه",
      message_en: "Failed to fetch version info",
      ...(process.env.NODE_ENV === "development" && { debug: err.message })
    });
  }
});

module.exports = router;

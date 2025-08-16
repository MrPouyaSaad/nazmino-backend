const User = require('../models/user');
const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();

router.get("/", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    console.log('[AUTH] Token not provided');
    return res.status(401).json({
      success: false,
      message: "توکن ارسال نشده است",
      message_en: "Token not provided"
    });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    console.log('[AUTH] Token is valid:', payload);

    const user = await User.findByPk(payload.id);
    if (!user) {
      console.log(`[AUTH] User not found with id: ${payload.id}`);
      return res.status(401).json({
        success: false,
        message: "کاربر یافت نشد",
        message_en: "User not found"
      });
    }

    console.log('[AUTH] User authenticated:', { id: user.id, phone: user.phone });
    res.json({
      success: true,
      message: "توکن معتبر است",
      message_en: "Token is valid"
    });
  } catch (err) {
    console.log('[AUTH] Invalid or expired token:', err.message);
    res.status(401).json({
      success: false,
      message: "توکن نامعتبر یا منقضی شده است",
      message_en: "Invalid or expired token",
      ...(process.env.NODE_ENV === 'development' && { debug: err.message })
    });
  }
});

module.exports = router;

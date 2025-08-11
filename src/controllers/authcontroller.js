const Otp = require('../models/otp.model');
const { sendOTP } = require('../services/sms.service');
const Category = require("../models/category.model"); // اگر مدل Category دارید
const User = require("../models/user");
const { generateToken } = require("../utils/jwt");
const sequelize = require("../config/db.config");


exports.sendCode = async (req, res) => {
  const { phone } = req.body;
  if (!phone) return res.status(400).json({ message: "شماره وارد نشده" });

  try {
    const code = await sendOTP(phone);
    const expiresAt = new Date(Date.now() + 2 * 60 * 1000);

    await Otp.upsert({
      phone,
      code,
      expires_at: expiresAt
    });

    res.json({ message: "کد ارسال شد" });
  } catch (err) {
    console.error("خطا در ارسال کد:", err);
    res.status(500).json({ 
      message: "ارسال پیامک با خطا مواجه شد",
      error: err.message 
    });
  }
};

exports.verifyCode = async (req, res) => {
  const { phone, code } = req.body;
  
  if (!phone || !code) {
    return res.status(400).json({ 
      success: false,
      message: "شماره یا کد وارد نشده" 
    });
  }

  try {
    // ۱. بررسی کد OTP
    const otp = await Otp.findOne({ where: { phone } });

    if (!otp || otp.code !== code) {
      return res.status(400).json({ 
        success: false,
        message: "کد نادرست است" 
      });
    }

    if (new Date(otp.expires_at) < new Date()) {
      return res.status(400).json({ 
        success: false,
        message: "کد منقضی شده است" 
      });
    }

    // ۲. حذف کد استفاده شده
    await Otp.destroy({ where: { phone } });

    // ۳. بررسی یا ایجاد کاربر
    let user = await User.findOne({ where: { phone } });

    if (!user) {
      user = await User.create({ phone });
      
      // ۴. ایجاد دسته‌بندی پیش‌فرض با استفاده از مدل
      await Category.create({
        name: "همه",
        user_id: user.id,
        is_default: true
      });
    }

    // ۵. تولید توکن
    const token = generateToken({
      id: user.id,
      phone: user.phone
    });

    res.json({ 
      success: true,
      token 
    });

  } catch (err) {
    console.error("خطا در تایید کد:", err);
    res.status(500).json({ 
      success: false,
      message: "خطا در تایید کد",
      error: err.message 
    });
  }
};
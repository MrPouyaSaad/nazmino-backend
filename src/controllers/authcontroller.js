const Otp = require('../models/otp.model');
const { sendOTP } = require('../services/sms.service');
const Category = require("../models/category.model");
const User = require("../models/user");
const { generateToken } = require("../utils/jwt");
const sequelize = require("../config/db.config");


exports.sendCode = async (req, res) => {
  const { phone } = req.body;
  if (!phone) 
    return res.status(400).json({ 
      message: "شماره موبایل ضروری است!",
      message_en: "Phone number is required!"
    });

  try {
    console.log('Sending OTP to phone:', phone);
    const code = await sendOTP(phone);
    console.log('OTP generated:', code);

    const expiresAt = new Date(Date.now() + 2 * 60 * 1000);

    await Otp.upsert({
      phone,
      code,
      expires_at: expiresAt
    });
    console.log('OTP saved in database');

    res.json({ 
      message: "کد با موفقیت ارسال شد.",
      message_en: "OTP sent successfully."
    });
  } catch (err) {
    console.error("Error sending code:", err);
    res.status(500).json({ 
      message: "مشکلی در ارسال پیامک رخ داده است، لحظاتی دیگر دوباره تلاش کنید.",
      message_en: "Failed to send OTP. Please try again later.",
      error: typeof err === "string" ? err : err.message 
    });
  }
};


exports.verifyCode = async (req, res) => {
  const { phone, code } = req.body;
  
  if (!phone || !code) {
    return res.status(400).json({ 
      success: false,
      message: "شماره یا کد وارد نشده",
      message_en: "Phone number or code is missing"
    });
  }

  try {
    const otp = await Otp.findOne({ where: { phone } });

    if (!otp || otp.code !== code) {
      return res.status(400).json({ 
        success: false,
        message: "کد نادرست است",
        message_en: "Invalid OTP code"
      });
    }

    if (new Date(otp.expires_at) < new Date()) {
      return res.status(400).json({ 
        success: false,
        message: "کد منقضی شده است",
        message_en: "OTP code has expired"
      });
    }

    await Otp.destroy({ where: { phone } });

    let user = await User.findOne({ where: { phone } });

    if (!user) {
      user = await User.create({ phone });
      
      await Category.create({
        name: "همه",
        user_id: user.id,
        is_default: true
      });
    }

    const token = generateToken({
      id: user.id,
      phone: user.phone
    });

    res.json({ 
      success: true,
      token,
      message_en: "OTP verified successfully"
    });

  } catch (err) {
    console.error("خطا در تایید کد:", err);
    res.status(500).json({ 
      success: false,
      message: "خطا در تایید کد",
      message_en: "Error verifying OTP",
      error: err.message 
    });
  }
};

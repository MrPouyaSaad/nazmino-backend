const { verifyToken } = require("../utils/jwt");
const User = require("../models/user");

const publicRoutes = [
  "/api/auth/send-code",
  "/api/auth/verify-code",
  "/api/version",
];

module.exports = async (req, res, next) => {
  console.log('\n--- Auth Middleware Debug ---');
  console.log('Request Path:', req.path);
  console.log('Request Method:', req.method);
  console.log('Headers:', req.headers);

  if (publicRoutes.some(route => req.path.startsWith(route))) {
    console.log('Public route - skipping authentication');
    return next();
  }

  const authHeader = req.headers.authorization;
  console.log('Authorization Header:', authHeader);

  if (!authHeader?.startsWith("Bearer ")) {
    console.error('No Bearer token found in headers');
    return res.status(401).json({
      success: false,
      message: "لطفا وارد حساب کاربری خود شوید",
      message_en: "Please log in"
    });
  }

  const token = authHeader.split(" ")[1];
  console.log('Extracted Token:', token);

  try {
    console.log('Verifying token...');
    const decoded = verifyToken(token);
    console.log('Decoded Token:', decoded);

    console.log(`Finding user with ID: ${decoded.id}`);
    const user = await User.findByPk(decoded.id);

    if (!user) {
      console.error('User not found in database');
      return res.status(404).json({
        success: false,
        message: "کاربر یافت نشد",
        message_en: "User not found"
      });
    }

    console.log('Authenticated User:', {
      id: user.id,
      phone: user.phone
    });

   req.user = user;
    next();
  } catch (err) {
    console.error("Authentication Error:", {
      message: err.message,
      stack: err.stack
    });

    res.status(401).json({
      success: false,
      message: "توکن نامعتبر یا منقضی شده است",
      message_en: "Invalid or expired token",
      ...(process.env.NODE_ENV === 'development' && { 
        debug: err.message 
      })
    });
  }
};

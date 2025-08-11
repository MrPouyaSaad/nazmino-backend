const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET || "supersecret";

module.exports = {
  generateToken: (user) => {
    return jwt.sign(
      { 
        id: user.id, // Sequelize → id
        phone: user.phone
      },
      secret,
      { expiresIn: "14d" }
    );
  },

  verifyToken: (token) => {
    try {
      return jwt.verify(token, secret);
    } catch (err) {
      throw new Error("Invalid or expired token");
    }
  }
};

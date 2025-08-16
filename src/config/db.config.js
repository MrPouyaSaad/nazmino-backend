require("dotenv").config();
const { Sequelize } = require("sequelize");

// اطمینان حاصل کنید که DATABASE_URL تعریف شده است
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined in environment variables");
}

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
  logging: false
});

// تست اتصال
sequelize.authenticate()
  .then(() => console.log("✅ Connected to Neon PostgreSQL"))
  .catch(err => console.error("❌ Connection failed:", err));

module.exports = sequelize;
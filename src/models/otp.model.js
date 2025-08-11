// models/otp.model.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const Otp = sequelize.define('Otp', {
  phone: {
    type: DataTypes.STRING(20),
    primaryKey: true,
    allowNull: false
  },
  code: {
    type: DataTypes.STRING(10),
    allowNull: false
  },
  expires_at: {
    type: DataTypes.DATE,
    allowNull: false
  }
}, {
  tableName: 'otps',
  timestamps: false
});

module.exports = Otp;
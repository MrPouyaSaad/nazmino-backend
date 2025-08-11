// models/user.model.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const User = sequelize.define('User', {
  phone: {
    type: DataTypes.STRING(20),
    unique: true,
    allowNull: false
  }
}, {
  tableName: 'users',
  timestamps: true
});

module.exports = User;
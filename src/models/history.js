// models/history.model.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');  // این مسیر باید به فایل تنظیمات کانکشن دیتابیس اشاره کنه

const History = sequelize.define('History', {
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('income', 'expense'),
    allowNull: false
  },
  category_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  user_id: {    // اضافه کردن این فیلد
    type: DataTypes.INTEGER,
    allowNull: false
  },
  deleted_at: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'history',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  paranoid: true
});

module.exports = History;


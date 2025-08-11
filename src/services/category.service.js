const Category = require("../models/category.model");
const { Op } = require('sequelize');

// services/category.service.js

exports.getCategories = async (userId) => {
  try {
    let categories = await Category.findAll({
      where: { user_id: userId },
      attributes: ['id', 'name', 'is_default', 'created_at'],
      order: [['created_at', 'DESC']]
    });
    
    if (!categories || categories.length === 0) {
      await Category.create({
        name: 'All',
        user_id: userId,
        is_default: true
      });

      categories = await Category.findAll({
        where: { user_id: userId },
        attributes: ['id', 'name', 'is_default', 'created_at'],
        order: [['created_at', 'DESC']]
      });
    }
    
    return categories;
  } catch (err) {
    console.error('Error in getCategories service:', err);
    throw err;
  }
};


exports.createCategory = async (userId, name) => {
  // بررسی وجود دسته‌بندی تکراری (بدون حساسیت به حروف بزرگ/کوچک)
const existingCategory = await Category.findOne({
  where: { name, user_id: userId }
});

  
  if (existingCategory) {
    throw new Error("دسته‌بندی با این نام قبلاً وجود دارد");
  }

  return await Category.createCategory({ 
    name, 
    userId,
    isDefault: false 
  });
};

exports.deleteCategory = async (userId, id) => {
  // بررسی وجود دسته‌بندی و مالکیت کاربر
  const category = await Category.findByIdAndUser(id, userId);
  
  if (!category) {
    throw new Error("دسته‌بندی مورد نظر یافت نشد");
  }

  if (category.is_default) {
    throw new Error("امکان حذف دسته‌بندی پیش‌فرض وجود ندارد");
  }

  return await Category.remove(id);
};

exports.getCategoryById = async (userId, id) => {
  return await Category.findByIdAndUser(id, userId);
};
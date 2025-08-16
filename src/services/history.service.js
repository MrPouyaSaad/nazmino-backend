// services/history.service.js
const History = require("../models/history");
const Transaction = require("../models/transaction");
const Category = require("../models/category.model");

exports.restore = async (id) => {
  const doc = await History.findByPk(id);
  if (!doc) throw new Error("تراکنش یافت نشد");

  // 1. پیدا کردن دسته‌بندی پیش‌فرض با نام "همه"
  const defaultCategory = await Category.findOne({ 
    where: { name: "همه" } 
  });

  if (!defaultCategory) {
    throw new Error("دسته‌بندی پیش‌فرض 'همه' یافت نشد");
  }

  // 2. بررسی وجود دسته‌بندی اصلی
  let categoryId = doc.category_id;
  if (categoryId) {
    const categoryExists = await Category.findByPk(categoryId);
    if (!categoryExists) {
      categoryId = defaultCategory.id; // استفاده از دسته‌بندی پیش‌فرض
      console.warn(`دسته‌بندی با شناسه ${doc.category_id} یافت نشد. از دسته‌بندی پیش‌فرض استفاده شد.`);
    }
  } else {
    categoryId = defaultCategory.id; // اگر category_id null بود
  }

  try {
    const tx = await Transaction.create({
      title: doc.title,
      amount: doc.amount,
      type: doc.type,
      category_id: categoryId, // استفاده از شناسه صحیح دسته‌بندی
      date: doc.date,
      user_id: doc.user_id
    });

    await doc.destroy();
    return tx;
  } catch (err) {
    console.error("❌ خطا در بازگردانی تراکنش:", err);
    throw new Error("بازگردانی تراکنش با خطا مواجه شد");
  }
};

exports.archiveTransaction = async (transaction) => {
  const plain = transaction.toJSON ? transaction.toJSON() : transaction;
  
  // پیدا کردن دسته‌بندی پیش‌فرض برای مواردی که category_id null است
  const defaultCategory = await Category.findOne({ where: { name: "همه" } });
  const categoryId = plain.category_id || (defaultCategory ? defaultCategory.id : null);

  await History.create({
    title: transaction.title,
    amount: transaction.amount,
    type: transaction.type,
    category_id: categoryId,
    date: transaction.date,
    user_id: transaction.user_id
  });
};

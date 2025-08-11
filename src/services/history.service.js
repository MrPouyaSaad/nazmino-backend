// services/history.service.js
const History = require("../models/history");
const Transaction = require("../models/transaction");
const Category = require("../models/category.model");

exports.getAll = async () => {
  return await History.findAll();
};

exports.remove = async (id) => {
  return await History.destroy({ where: { id } });
};

exports.removeAll = async () => {
  return await History.destroy({ where: {} });
};

exports.restore = async (id) => {
  const doc = await History.findByPk(id);
  if (!doc) throw new Error("تراکنش یافت نشد");

  try {
    const tx = await Transaction.create({
      title: doc.title,
      amount: doc.amount,
      type: doc.type,
      category_id: doc.category_id,  // به جای category از category_id استفاده کن
      date: doc.date,
      user_id: doc.user_id // اگر این فیلد هم اجباریه حتما بفرستش
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
  const category = await Category.findByPk(plain.category_id);
  const categoryName = category ? category.name : "بدون دسته‌بندی";

  // فرض کن transaction داده اصلی تراکنش باشه
await History.create({
  title: transaction.title,
  amount: transaction.amount,
  type: transaction.type,
  category_id: transaction.category_id,  // این مقدار رو حتما پاس بده
  date: transaction.date,
  user_id: transaction.user_id
});

};

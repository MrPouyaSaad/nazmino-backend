// controllers/transaction.controller.js
const transactionService = require("../services/transaction.service");

exports.getAll = async (req, res) => {
  try {
    console.log("Fetching all transactions for user ID:", req.user.id);
    const transactions = await transactionService.getAll(req.user.id);
    console.log(`Fetched ${transactions.length} transactions`);
    res.json({ success: true, data: transactions });
  } catch (err) {
    console.error("Error getting transactions:", err);
    res.status(500).json({
      success: false,
      message: "خطا در دریافت تراکنش‌ها",
      message_en: "Error fetching transactions",
      error: err.message
    });
  }
};

exports.create = async (req, res) => {
  try {
    const { title, amount, type, date, category_id } = req.body;
    console.log("Creating transaction with data:", req.body);

    if (!title || !amount || !type || !date || !category_id) {
      return res.status(400).json({
        success: false,
        message: "تمام فیلدها الزامی هستند",
        message_en: "All fields are required"
      });
    }

    if (!["income", "expense"].includes(type)) {
      return res.status(400).json({
        success: false,
        message: "نوع تراکنش نامعتبر است",
        message_en: "Invalid transaction type"
      });
    }

    const transaction = await transactionService.create(req.user.id, {
      title,
      amount: parseFloat(amount),
      type,
      date: new Date(date),
      category_id
    });

    console.log("Transaction created:", transaction);
    res.status(201).json({ success: true, data: transaction });
  } catch (err) {
    console.error("Error creating transaction:", err);
    res.status(500).json({
      success: false,
      message: "خطا در ایجاد تراکنش",
      message_en: "Error creating transaction",
      error: err.message
    });
  }
};

exports.update = async (req, res) => {
  try {
    console.log("Updating transaction ID:", req.params.id, "with data:", req.body);
    const updated = await transactionService.update(
      req.user.id,
      req.params.id,
      req.body
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "تراکنش یافت نشد",
        message_en: "Transaction not found"
      });
    }

    console.log("Transaction updated:", updated);
    res.json({ success: true, data: updated });
  } catch (err) {
    console.error("Error updating transaction:", err);
    res.status(500).json({
      success: false,
      message: "خطا در ویرایش تراکنش",
      message_en: "Error updating transaction",
      error: err.message
    });
  }
};

exports.remove = async (req, res) => {
  try {
    console.log("Removing transaction ID:", req.params.id);
    const deleted = await transactionService.remove(req.user.id, req.params.id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "تراکنش یافت نشد",
        message_en: "Transaction not found"
      });
    }

    console.log("Transaction removed successfully");
    res.status(204).send();
  } catch (err) {
    console.error("Error removing transaction:", err);
    res.status(500).json({
      success: false,
      message: "خطا در حذف تراکنش",
      message_en: "Error removing transaction",
      error: err.message
    });
  }
};

exports.removeAll = async (req, res) => {
  try {
    console.log("Removing all transactions for user ID:", req.user.id);
    await transactionService.removeAll(req.user.id);
    console.log("All transactions removed successfully");
    res.status(204).send();
  } catch (err) {
    console.error("Error removing all transactions:", err);
    res.status(500).json({
      success: false,
      message: "خطا در حذف همه تراکنش‌ها",
      message_en: "Error removing all transactions",
      error: err.message
    });
  }
};

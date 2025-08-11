const transactionService = require("../services/transaction.service");

exports.getAll = async (req, res) => {
  try {
    const transactions = await transactionService.getAll(req.user.id);
    res.json(transactions);
  } catch (err) {
    console.error("Error getting transactions:", err);
    res.status(500).json({ error: "خطا در دریافت تراکنش‌ها" });
  }
};

exports.create = async (req, res) => {
  try {
    const { title, amount, type, date, category_id } = req.body;

    if (!title || !amount || !type || !date || !category_id) {
      return res.status(400).json({ error: "تمام فیلدها الزامی هستند" + title + type + date + category_id +amount });
    }

    if (!["income", "expense"].includes(type)) {
      return res.status(400).json({ error: "نوع تراکنش نامعتبر است" });
    }

    const transaction = await transactionService.create(req.user.id, {
      title,
      amount: parseFloat(amount),
      type,
      date: new Date(date),
      category_id
    });

    res.status(201).json(transaction);
  } catch (err) {
    console.error("Error creating transaction:", err);
    res.status(500).json({ error: "خطا در ایجاد تراکنش" });
  }
};

exports.update = async (req, res) => {
  try {
    const updated = await transactionService.update(
      req.user.id,
      req.params.id,
      req.body
    );

    if (!updated) {
      return res.status(404).json({ error: "تراکنش یافت نشد" });
    }

    res.json(updated);
  } catch (err) {
    console.error("Error updating transaction:", err);
    res.status(500).json({ error: "خطا در ویرایش تراکنش" });
  }
};

exports.remove = async (req, res) => {
  try {
    const deleted = await transactionService.remove(
      req.user.id,
      req.params.id
    );

    if (!deleted) {
      return res.status(404).json({ error: "تراکنش یافت نشد" });
    }

    res.status(204).send();
  } catch (err) {
    console.error("Error removing transaction:", err);
    res.status(500).json({ error: "خطا در حذف تراکنش" });
  }
};

exports.removeAll = async (req, res) => {
  try {
    await transactionService.removeAll(req.user.id);
    res.status(204).send();
  } catch (err) {
    console.error("Error removing all transactions:", err);
    res.status(500).json({ error: "خطا در حذف همه تراکنش‌ها" });
  }
};

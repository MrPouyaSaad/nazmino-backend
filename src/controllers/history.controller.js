// controllers/history.controller.js
const historyService = require("../services/history.service");

exports.getAll = async (req, res) => {
  try {
    console.log("Fetching all history items for request:", req.originalUrl);
    const data = await historyService.getAll();
    console.log(`Fetched ${data.length} history items`);
    res.json({ success: true, data });
  } catch (err) {
    console.error("Error fetching history:", err);
    res.status(500).json({
      success: false,
      message: "خطا در دریافت تاریخچه",
      message_en: "Error fetching history",
      error: err.message
    });
  }
};

exports.remove = async (req, res) => {
  try {
    console.log("Removing history item with ID:", req.params.id);
    await historyService.remove(req.params.id);
    console.log("History item removed successfully");
    res.status(204).send();
  } catch (err) {
    console.error("Error removing history item:", err);
    res.status(400).json({
      success: false,
      message: "خطا در حذف تراکنش",
      message_en: "Error removing history item",
      error: err.message
    });
  }
};

exports.removeAll = async (req, res) => {
  try {
    console.log("Removing all history items");
    await historyService.removeAll();
    console.log("All history items removed successfully");
    res.status(204).send();
  } catch (err) {
    console.error("Error removing all history items:", err);
    res.status(400).json({
      success: false,
      message: "خطا در حذف همه تراکنش‌ها",
      message_en: "Error removing all history items",
      error: err.message
    });
  }
};

exports.restore = async (req, res) => {
  try {
    console.log("Restoring history item with ID:", req.params.id);
    const tx = await historyService.restore(req.params.id);
    console.log("History item restored:", tx);
    res.json({ success: true, data: tx });
  } catch (err) {
    console.error("Error restoring history item:", err);
    res.status(400).json({ 
      success: false,
      message: "خطا در بازیابی تراکنش",
      message_en: "Error restoring history item",
      error: err.message
    });
  }
};

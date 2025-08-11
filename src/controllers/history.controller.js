// controllers/history.controller.js
const historyService = require("../services/history.service");

exports.getAll = async (req, res) => {
  const data = await historyService.getAll();
  res.json(data);
};

exports.remove = async (req, res) => {
  await historyService.remove(req.params.id);
  res.status(204).send();
};

exports.removeAll = async (req, res) => {
  await historyService.removeAll();
  res.status(204).send();
};

exports.restore = async (req, res) => {
  try {
    const tx = await historyService.restore(req.params.id);
    res.json(tx);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

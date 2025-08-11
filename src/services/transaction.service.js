const Transaction = require("../models/transaction");
const Category = require("../models/category.model");
const HistoryService = require("./history.service");

exports.getAll = async (userId) => {
  return await Transaction.findAll({
    where: { user_id: userId },
    include: [{ model: Category, as: "category" }],
    order: [["date", "DESC"]]
  });
};

exports.create = async (userId, data) => {
  return await Transaction.create({
    ...data,
    user_id: userId
  });
};

exports.update = async (userId, id, data) => {
  const tx = await Transaction.findOne({
    where: { id, user_id: userId }
  });
  if (!tx) return null;
  await tx.update(data);
  return tx;
};

exports.remove = async (userId, id) => {
  const tx = await Transaction.findOne({
    where: { id, user_id: userId }
  });
  if (!tx) return null;

  await HistoryService.archiveTransaction(tx.toJSON());
  await tx.destroy();
  return true;
};

exports.removeAll = async (userId) => {
  const all = await Transaction.findAll({ where: { user_id: userId } });

  for (const tx of all) {
    await HistoryService.archiveTransaction(tx.toJSON());
  }

  await Transaction.destroy({ where: { user_id: userId } });
};

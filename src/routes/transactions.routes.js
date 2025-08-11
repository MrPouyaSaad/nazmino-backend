// src/routes/transaction.routes.js
const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transaction.controller');
const auth = require('../middlewares/auth');
router.use(auth);


router.get('/', transactionController.getAll);
router.post('/', transactionController.create);
router.put('/:id', transactionController.update);       // ✅ ویرایش
router.delete('/:id', transactionController.remove);    // ✅ حذف تکی
router.delete('/', transactionController.removeAll);    // ✅ حذف همه


module.exports = router;

const express = require('express');
const router = express.Router();
const historyController = require('../controllers/history.controller');

router.get('/', historyController.getAll);
router.delete('/:id', historyController.remove);
router.delete('/', historyController.removeAll);
router.post('/restore/:id', historyController.restore);

module.exports = router;

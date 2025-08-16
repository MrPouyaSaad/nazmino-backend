const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth");
const categoryController = require("../controllers/category.controller");

router.use(authMiddleware);

// GET /api/categories
router.get("/", categoryController.getCategories);

// POST /api/categories
router.post("/", categoryController.createCategory);

// DELETE /api/categories/:id
router.delete("/:id", categoryController.deleteCategory);

// GET /api/categories/:id
router.get("/:id", categoryController.getCategory);

module.exports = router;

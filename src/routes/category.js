const express = require("express");
const router = express.Router();
const Category = require("../models/category.model");
const authMiddleware = require("../middlewares/auth");
const categoryService = require("../services/category.service");


router.use(authMiddleware);

// GET /api/categories
router.get("/", async (req, res) => {
 try {
    const categories = await categoryService.getCategories(req.user.id);
    res.json(categories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err });
  }
});


// POST /api/categories
router.post("/", async (req, res) => {
  try {
    const { name } = req.body;

    const existingCategory = await Category.findOne({
      where: { name, user_id: req.user.id }
    });

    if (existingCategory) {
      return res.status(400).json({ message: "Category already exists" });
    }

    const category = await Category.create({
      name,
      user_id: req.user.id,
      is_default: false
    });

    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE /api/categories/:id
router.delete("/:id", async (req, res) => {
  try {
    const category = await Category.findOne({
      where: { id: req.params.id, user_id: req.user.id }
    });

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    if (category.is_default) {
      return res.status(400).json({ message: "Cannot delete default category" });
    }

    await category.destroy();
    res.json({ message: "Category deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

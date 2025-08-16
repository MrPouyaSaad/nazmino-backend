const categoryService = require("../services/category.service");

exports.getCategories = async (req, res) => {
  try {
    const categories = await categoryService.getCategories(req.user.id);
    res.json({ success: true, count: categories.length, data: categories });
  } catch (err) {
    console.error("Error fetching categories:", err);
    res.status(500).json({
      success: false,
      message: "خطا در دریافت دسته‌بندی‌ها",
      message_en: "Error fetching categories"
    });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || name.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "نام دسته‌بندی الزامی است",
        message_en: "Category name is required"
      });
    }

    const category = await categoryService.createCategory(req.user.id, name.trim());
    res.status(201).json({ success: true, data: category });
  } catch (err) {
    console.error("Error creating category:", err);
    res.status(500).json({
      success: false,
      message: "خطا در ایجاد دسته‌بندی",
      message_en: "Error creating category"
    });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await categoryService.deleteCategory(req.user.id, parseInt(id));
    if (!result) {
      return res.status(404).json({
        success: false,
        message: "دسته‌بندی یافت نشد",
        message_en: "Category not found"
      });
    }
    res.json({ success: true, data: result });
  } catch (err) {
    console.error("Error deleting category:", err);
    res.status(500).json({
      success: false,
      message: "خطا در حذف دسته‌بندی",
      message_en: "Error deleting category"
    });
  }
};

exports.getCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await categoryService.getCategoryById(req.user.id, parseInt(id));
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "دسته‌بندی یافت نشد",
        message_en: "Category not found"
      });
    }
    res.json({ success: true, data: category });
  } catch (err) {
    console.error("Error fetching category:", err);
    res.status(500).json({
      success: false,
      message: "خطا در دریافت دسته‌بندی",
      message_en: "Error fetching category"
    });
  }
};

const categoryService = require("../services/category.service");

exports.getCategories = async (req, res) => {
  try {
    console.log('Fetching categories for user ID:', req.user.id);
    
    const categories = await Category.findAll({
      where: { user_id: req.user.id },
      order: [['created_at', 'DESC']],
      attributes: ['id', 'name', 'is_default'] // فقط فیلدهای مورد نیاز
    });

    console.log('Categories found:', categories.length);
    
    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories
    });
    
  } catch (err) {
    console.error('Error in getCategories:', err);
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت دسته‌بندی‌ها',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    
    if (!name || name.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "نام دسته‌بندی الزامی است"
      });
    }

    const category = await categoryService.createCategory(
      req.user.id, 
      name.trim()
    );
    
    res.status(201).json({
      success: true,
      data: category
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "شناسه دسته‌بندی نامعتبر است"
      });
    }

    const result = await categoryService.deleteCategory(
      req.user.id, 
      parseInt(id)
    );
    
    res.json({
      success: true,
      data: result
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

exports.getCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await categoryService.getCategoryById(
      req.user.id,
      parseInt(id)
    );
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "دسته‌بندی مورد نظر یافت نشد"
      });
    }
    
    res.json({
      success: true,
      data: category
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};
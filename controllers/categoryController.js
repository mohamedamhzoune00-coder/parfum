const Category = require('../models/Category');

// @desc    جلب جميع الفئات
// @route   GET /api/categories
// @access  Public
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({})
      .populate('productCount')
      .sort({ name: 1 });

    res.json({
      success: true,
      count: categories.length,
      data: categories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطأ في جلب الفئات',
      error: error.message,
    });
  }
};

// @desc    جلب فئة واحدة
// @route   GET /api/categories/:id
// @access  Public
const getCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id).populate(
      'productCount'
    );

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'الفئة غير موجودة',
      });
    }

    res.json({
      success: true,
      data: category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطأ في جلب الفئة',
      error: error.message,
    });
  }
};

// @desc    إضافة فئة جديدة
// @route   POST /api/categories
// @access  Private (Admin)
const createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    // التحقق من عدم وجود الفئة مسبقاً
    const exists = await Category.findOne({ name });
    if (exists) {
      return res.status(400).json({
        success: false,
        message: 'هاد الفئة موجودة من قبل',
      });
    }

    const category = await Category.create({ name });

    res.status(201).json({
      success: true,
      message: 'الفئة تزادت بنجاح ✅',
      data: category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطأ في إضافة الفئة',
      error: error.message,
    });
  }
};

// @desc    تعديل فئة
// @route   PUT /api/categories/:id
// @access  Private (Admin)
const updateCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'الفئة غير موجودة',
      });
    }

    category.name = req.body.name || category.name;
    const updated = await category.save(); // باش يت trigger الـ pre-save (slug)

    res.json({
      success: true,
      message: 'الفئة تعدلت بنجاح ✅',
      data: updated,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطأ في تعديل الفئة',
      error: error.message,
    });
  }
};

// @desc    حذف فئة
// @route   DELETE /api/categories/:id
// @access  Private (Admin)
const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'الفئة غير موجودة',
      });
    }

    res.json({
      success: true,
      message: 'الفئة تمسحت بنجاح 🗑️',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطأ في حذف الفئة',
      error: error.message,
    });
  }
};

module.exports = {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
};

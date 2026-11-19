const Product = require('../models/Product');

// @desc    جلب جميع المنتجات (للعملاء - غير المنتجات النشيطة)
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const {
      category,
      brand,
      search,
      bestSeller,
      sort,
      page = 1,
      limit = 12,
    } = req.query;

    const query = { isActive: true };

    // فلترة بالفئة
    if (category) query.category = category;

    // فلترة بالماركة
    if (brand) query.brand = { $regex: brand, $options: 'i' };

    // البحث بالاسم أو الوصف
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } },
      ];
    }

    // فلترة Best Sellers
    if (bestSeller === 'true') query.isBestSeller = true;

    // الترتيب
    let sortOption = { createdAt: -1 }; // الأحدث أولاً
    if (sort === 'price_asc') sortOption = { 'variants.0.price': 1 };
    if (sort === 'price_desc') sortOption = { 'variants.0.price': -1 };
    if (sort === 'name') sortOption = { name: 1 };

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const products = await Product.find(query)
      .populate('category', 'name slug')
      .sort(sortOption)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Product.countDocuments(query);

    res.json({
      success: true,
      count: products.length,
      total,
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطأ في جلب المنتجات',
      error: error.message,
    });
  }
};

// @desc    جلب منتج واحد
// @route   GET /api/products/:id
// @access  Public
const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      'category',
      'name slug'
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'المنتج غير موجود',
      });
    }

    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطأ في جلب المنتج',
      error: error.message,
    });
  }
};

// @desc    جلب جميع المنتجات (للأدمن - كلشي)
// @route   GET /api/products/admin/all
// @access  Private (Admin)
const getAdminProducts = async (req, res) => {
  try {
    const products = await Product.find({})
      .populate('category', 'name slug')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطأ في جلب المنتجات',
      error: error.message,
    });
  }
};

// @desc    إضافة منتج جديد
// @route   POST /api/products
// @access  Private (Admin)
const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    const populated = await product.populate('category', 'name slug');

    res.status(201).json({
      success: true,
      message: 'المنتج تزاد بنجاح ✅',
      data: populated,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطأ في إضافة المنتج',
      error: error.message,
    });
  }
};

// @desc    تعديل منتج
// @route   PUT /api/products/:id
// @access  Private (Admin)
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('category', 'name slug');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'المنتج غير موجود',
      });
    }

    res.json({
      success: true,
      message: 'المنتج تعدل بنجاح ✅',
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطأ في تعديل المنتج',
      error: error.message,
    });
  }
};

// @desc    حذف منتج
// @route   DELETE /api/products/:id
// @access  Private (Admin)
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'المنتج غير موجود',
      });
    }

    res.json({
      success: true,
      message: 'المنتج تمسح بنجاح 🗑️',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطأ في حذف المنتج',
      error: error.message,
    });
  }
};

module.exports = {
  getProducts,
  getProduct,
  getAdminProducts,
  createProduct,
  updateProduct,
  deleteProduct,
};

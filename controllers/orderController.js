const Order = require('../models/Order');

// @desc    إنشاء طلبية جديدة (للعملاء)
// @route   POST /api/orders
// @access  Public
const createOrder = async (req, res) => {
  try {
    const { customer, items, total, paymentMethod, notes } = req.body;

    // التحقق من المدخلات
    if (!customer || !items || items.length === 0 || !total) {
      return res.status(400).json({
        success: false,
        message: 'المعلومات ناقصة، خاصك تعمر جميع الحقول المطلوبة',
      });
    }

    const order = await Order.create({
      customer,
      items,
      total,
      paymentMethod: paymentMethod || 'cod',
      notes,
    });

    res.status(201).json({
      success: true,
      message: `الطلبية تسجلت بنجاح ✅ رقم الطلبية: ${order.orderNumber}`,
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطأ في إنشاء الطلبية',
      error: error.message,
    });
  }
};

// @desc    جلب جميع الطلبيات (للأدمن)
// @route   GET /api/orders
// @access  Private (Admin)
const getOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    const query = {};
    if (status) query.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const orders = await Order.find(query)
      .populate('items.product', 'name brand images')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Order.countDocuments(query);

    res.json({
      success: true,
      count: orders.length,
      total,
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      data: orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطأ في جلب الطلبيات',
      error: error.message,
    });
  }
};

// @desc    جلب طلبية واحدة
// @route   GET /api/orders/:id
// @access  Private (Admin)
const getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      'items.product',
      'name brand images'
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'الطلبية غير موجودة',
      });
    }

    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطأ في جلب الطلبية',
      error: error.message,
    });
  }
};

// @desc    تحديث حالة الطلبية (للأدمن)
// @route   PUT /api/orders/:id
// @access  Private (Admin)
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const validStatuses = [
      'pending',
      'confirmed',
      'shipped',
      'delivered',
      'cancelled',
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `الحالة غير صالحة. الحالات المقبولة: ${validStatuses.join(', ')}`,
      });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'الطلبية غير موجودة',
      });
    }

    res.json({
      success: true,
      message: `حالة الطلبية تبدلت لـ "${status}" ✅`,
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطأ في تحديث الطلبية',
      error: error.message,
    });
  }
};

// @desc    إحصائيات الطلبيات (Dashboard)
// @route   GET /api/orders/stats/summary
// @access  Private (Admin)
const getOrderStats = async (req, res) => {
  try {
    const stats = await Order.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalRevenue: { $sum: '$total' },
        },
      },
    ]);

    const totalOrders = await Order.countDocuments();
    const totalRevenue = await Order.aggregate([
      { $match: { status: { $ne: 'cancelled' } } },
      { $group: { _id: null, total: { $sum: '$total' } } },
    ]);

    res.json({
      success: true,
      data: {
        totalOrders,
        totalRevenue: totalRevenue[0]?.total || 0,
        byStatus: stats,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطأ في جلب الإحصائيات',
      error: error.message,
    });
  }
};

module.exports = {
  createOrder,
  getOrders,
  getOrder,
  updateOrderStatus,
  getOrderStats,
};

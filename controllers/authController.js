const User = require('../models/User');
const { generateToken } = require('../utils/generateToken');

// @desc    تسجيل أدمن جديد
// @route   POST /api/auth/register
// @access  Public (أو ممكن نحميوه من بعد)
const registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // التحقق من عدم وجود الإيميل مسبقاً
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'هاد الإيميل مسجل من قبل',
      });
    }

    // إنشاء الأدمن
    const user = await User.create({
      name,
      email,
      password,
      role: 'admin',
    });

    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطأ في التسجيل',
      error: error.message,
    });
  }
};

// @desc    تسجيل الدخول
// @route   POST /api/auth/login
// @access  Public
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // التحقق من المدخلات
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'خاصك تدخل الإيميل وكلمة السر',
      });
    }

    // البحث على الأدمن مع كلمة السر
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({
        success: false,
        message: 'الإيميل أو كلمة السر غلط',
      });
    }

    res.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطأ في تسجيل الدخول',
      error: error.message,
    });
  }
};

// @desc    جلب بيانات الأدمن المتصل
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطأ',
      error: error.message,
    });
  }
};

module.exports = { registerAdmin, loginAdmin, getMe };

const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  // التحقق من وجود الـ token فالـ header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // استخراج الـ token
      token = req.headers.authorization.split(' ')[1];

      // فك تشفير الـ token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // جلب بيانات الأدمن (بلا كلمة السر)
      req.user = await User.findById(decoded.id);

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'المستخدم غير موجود',
        });
      }

      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Token غير صالح أو منتهي الصلاحية',
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'ماعندكش صلاحية، خاصك تكون متصل (Token مطلوب)',
    });
  }
};

module.exports = { protect };

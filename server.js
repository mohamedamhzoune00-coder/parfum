const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// ⚠️ خاص dotenv.config تكون أول حاجة قبل ما نستعملو أي process.env
dotenv.config();

const connectDB = require('./config/db');

// الاتصال بقاعدة البيانات
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));

// Route ديال الصفحة الرئيسية
app.get('/', (req, res) => {
  res.json({
    message: 'Salam! Parfum Zaki API khdam 🚀',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      products: '/api/products',
      categories: '/api/categories',
      orders: '/api/orders',
    },
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'حدث خطأ في السيرفر',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server khdam 3la port ${PORT}`);
});

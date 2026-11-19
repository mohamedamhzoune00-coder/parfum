const express = require('express');
const router = express.Router();
const {
  createOrder,
  getOrders,
  getOrder,
  updateOrderStatus,
  getOrderStats,
} = require('../controllers/orderController');
const { protect } = require('../middlewares/authMiddleware');

// Route publique (الزبون كيدير طلبية)
router.post('/', createOrder);

// Routes privées (للأدمن)
router.get('/', protect, getOrders);
router.get('/stats/summary', protect, getOrderStats);
router.get('/:id', protect, getOrder);
router.put('/:id', protect, updateOrderStatus);

module.exports = router;

const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProduct,
  getAdminProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const { protect } = require('../middlewares/authMiddleware');

// Routes publiques (للعملاء)
router.get('/', getProducts);
router.get('/:id', getProduct);

// Routes privées (للأدمن)
router.get('/admin/all', protect, getAdminProducts);
router.post('/', protect, createProduct);
router.put('/:id', protect, updateProduct);
router.delete('/:id', protect, deleteProduct);

module.exports = router;

// backend/routes/productRoutes.js
const express = require('express');
const {
    createProduct,
    getAllProducts,
    updateProduct,
    deleteProduct,
    getLowStockReport,
    searchProducts,
    updateProductImage // Ensure this is in the list with a comma before it
} = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');
const multer = require('multer');

const router = express.Router();

// Multer setup for in-memory file storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Routes
router.route('/search').get(protect, searchProducts);
    
router.route('/report/low-stock')
    .get(protect, admin, getLowStockReport);
    
router.route('/')
    .get(protect, getAllProducts)
    .post(protect, admin, upload.single('image'), createProduct);

router.route('/:id')
    .put(protect, admin, updateProduct)
    .delete(protect, admin, deleteProduct);

// New route for updating just the image
router.route('/:id/image')
    .put(protect, admin, upload.single('image'), updateProductImage);

module.exports = router;
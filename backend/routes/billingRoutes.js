// backend/routes/billingRoutes.js
const express = require('express');
const { processCheckout } = require('../controllers/billingController');
const { protect } = require('../middleware/authMiddleware'); // Anyone logged in can checkout
const router = express.Router();

router.post('/checkout', protect, processCheckout);

module.exports = router;
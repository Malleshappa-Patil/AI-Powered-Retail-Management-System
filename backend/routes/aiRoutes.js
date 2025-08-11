// backend/routes/aiRoutes.js
const express = require('express');
const { getReorderSuggestions } = require('../controllers/aiController');
const { protect, admin } = require('../middleware/authMiddleware');
const router = express.Router();

// This route is protected and only accessible by admins
router.get('/reorder-suggestions', protect, admin, getReorderSuggestions);

module.exports = router;
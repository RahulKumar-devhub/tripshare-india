const express = require('express');
const router = express.Router();
const {
  getAllStays,
  getStayByIdOrSlug,
  createStay,
  updateStay,
  deleteStay
} = require('../controllers/stayController');
const protect = require('../middleware/authMiddleware');
const isAdmin = require('../middleware/adminMiddleware');

// Public routes
router.get('/', getAllStays);
router.get('/:id', getStayByIdOrSlug);

// Admin-only routes
router.post('/', protect, isAdmin, createStay);
router.put('/:id', protect, isAdmin, updateStay);
router.delete('/:id', protect, isAdmin, deleteStay);

module.exports = router;

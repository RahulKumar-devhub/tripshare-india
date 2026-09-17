const express = require('express');
const router = express.Router();
const {
  getMetrics,
  getAnalytics,
  getUsers,
  updateUser,
  updateBookingStatus
} = require('../controllers/adminController');
const protect = require('../middleware/authMiddleware');
const isAdmin = require('../middleware/adminMiddleware');

// Protect all admin routes
router.use(protect, isAdmin);

router.get('/metrics', getMetrics);
router.get('/analytics', getAnalytics);
router.get('/users', getUsers);
router.patch('/users/:id', updateUser);
router.patch('/bookings/:id/status', updateBookingStatus);

module.exports = router;

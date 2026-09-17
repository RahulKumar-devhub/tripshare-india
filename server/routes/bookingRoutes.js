const express = require('express');
const router = express.Router();
const {
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking,
  getAllBookings
} = require('../controllers/bookingController');
const protect = require('../middleware/authMiddleware');
const isAdmin = require('../middleware/adminMiddleware');

router.use(protect);

router.post('/', createBooking);
router.get('/my', getMyBookings);
router.get('/detail/:id', getBookingById);
router.put('/:id/cancel', cancelBooking);

// Admin only
router.get('/', isAdmin, getAllBookings);

module.exports = router;

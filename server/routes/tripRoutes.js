const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
  getAllTrips,
  getTripById,
  createTrip,
  updateTrip,
  deleteTrip,
  joinTrip,
  leaveTrip,
  getMyTrips
} = require('../controllers/tripController');

router.get('/', getAllTrips);
router.get('/my', authMiddleware, getMyTrips);
router.get('/:id', getTripById);
router.post('/', authMiddleware, createTrip);
router.put('/:id', authMiddleware, updateTrip);
router.delete('/:id', authMiddleware, deleteTrip);
router.post('/:id/join', authMiddleware, joinTrip);
router.post('/:id/leave', authMiddleware, leaveTrip);

module.exports = router;

const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const upload = require('../config/upload');
const {
  updateProfile,
  getUserProfile,
  getAllSavedItems,
  toggleSavedItem,
  removeSavedItem,
  toggleSaveTrip,
  getSavedTrips,
  toggleFavourite,
  getFavourites,
  getAllUsers
} = require('../controllers/userController');

router.put('/profile', authMiddleware, upload.single('profileImage'), updateProfile);
router.get('/profile/:id', getUserProfile);

// Unified saved items
router.get('/saved', authMiddleware, getAllSavedItems);
router.post('/saved', authMiddleware, toggleSavedItem);
router.delete('/saved/:itemType/:itemId', authMiddleware, removeSavedItem);

// Legacy routes
router.post('/saved-trips/:tripId', authMiddleware, toggleSaveTrip);
router.get('/saved-trips', authMiddleware, getSavedTrips);
router.post('/favourites/:eventId', authMiddleware, toggleFavourite);
router.get('/favourites', authMiddleware, getFavourites);

// Admin only
router.get('/', authMiddleware, adminMiddleware, getAllUsers);

module.exports = router;

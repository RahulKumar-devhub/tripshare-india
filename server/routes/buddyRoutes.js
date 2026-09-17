const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
  matchBuddies,
  sendBuddyRequest,
  getMyBuddyRequests,
  respondToBuddyRequest,
  getConnectedBuddies,
  getBuddyStatus
} = require('../controllers/buddyController');

// Optional auth for matchBuddies so guests can see matches, but logged-in users get status
const optionalAuth = (req, res, next) => {
  const token = req.headers.authorization?.startsWith('Bearer ')
    ? req.headers.authorization.split(' ')[1]
    : null;
  if (!token) return next();
  try {
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { _id: decoded.id, role: decoded.role };
    next();
  } catch {
    next();
  }
};

router.post('/match', optionalAuth, matchBuddies);
router.post('/connect', authMiddleware, sendBuddyRequest);
router.get('/requests', authMiddleware, getMyBuddyRequests);
router.put('/requests/:id', authMiddleware, respondToBuddyRequest);
router.get('/connected', authMiddleware, getConnectedBuddies);
router.get('/status/:userId', authMiddleware, getBuddyStatus);

module.exports = router;

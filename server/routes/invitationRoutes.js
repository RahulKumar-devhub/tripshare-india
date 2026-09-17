const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
  sendInvitation,
  getMyInvitations,
  respondToInvitation
} = require('../controllers/invitationController');

router.post('/', authMiddleware, sendInvitation);
router.get('/my', authMiddleware, getMyInvitations);
router.put('/:id/respond', authMiddleware, respondToInvitation);

module.exports = router;

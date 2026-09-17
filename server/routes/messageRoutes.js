const express = require('express');
const router = express.Router();
const {
  getConversations,
  getThread,
  sendMessage,
  markThreadRead,
  getUnreadCount
} = require('../controllers/messageController');
const protect = require('../middleware/authMiddleware');

router.use(protect);

router.get('/conversations', getConversations);
router.get('/thread/:userId', getThread);
router.get('/unread-count', getUnreadCount);
router.post('/', sendMessage);
router.put('/read/:senderId', markThreadRead);

module.exports = router;

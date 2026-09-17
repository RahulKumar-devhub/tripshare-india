const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { getNotifications, markRead, markAllRead } = require('../controllers/notificationController');

router.get('/', authMiddleware, getNotifications);
router.put('/:id/read', authMiddleware, markRead);
router.put('/read-all', authMiddleware, markAllRead);

module.exports = router;

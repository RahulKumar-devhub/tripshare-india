const Notification = require('../models/Notification');

// GET /api/notifications - protected - get user notifications
const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user._id })
      .populate('sender', 'fullName city profileImage')
      .sort({ createdAt: -1 })
      .limit(30);

    const unreadCount = await Notification.countDocuments({ user: req.user._id, read: false });

    res.json({ success: true, count: notifications.length, unreadCount, notifications });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Could not fetch notifications.', error: err.message });
  }
};

// PUT /api/notifications/:id/read - protected - mark notification as read
const markRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { read: true },
      { new: true }
    );
    if (!notification) return res.status(404).json({ success: false, message: 'Notification not found.' });

    res.json({ success: true, notification });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Could not update notification.', error: err.message });
  }
};

// PUT /api/notifications/read-all - protected - mark all notifications read
const markAllRead = async (req, res) => {
  try {
    await Notification.updateMany({ user: req.user._id, read: false }, { read: true });
    res.json({ success: true, message: 'All notifications marked as read.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Could not mark notifications read.', error: err.message });
  }
};

module.exports = { getNotifications, markRead, markAllRead };

const Message = require('../models/Message');
const User = require('../models/User');
const Notification = require('../models/Notification');

// GET /api/messages/conversations - fetch list of active conversation threads
const getConversations = async (req, res) => {
  try {
    const currentUserId = req.user._id;

    // Find all messages involving current user
    const messages = await Message.find({
      $or: [{ sender: currentUserId }, { recipient: currentUserId }]
    })
      .sort({ createdAt: -1 })
      .populate('sender', 'fullName profileImage city verified')
      .populate('recipient', 'fullName profileImage city verified');

    const conversationMap = new Map();

    for (const msg of messages) {
      const isSender = String(msg.sender._id) === String(currentUserId);
      const otherUser = isSender ? msg.recipient : msg.sender;
      if (!otherUser) continue;

      const otherUserId = String(otherUser._id);

      if (!conversationMap.has(otherUserId)) {
        conversationMap.set(otherUserId, {
          user: otherUser,
          lastMessage: {
            _id: msg._id,
            text: msg.text,
            sender: msg.sender._id,
            createdAt: msg.createdAt,
            read: msg.read
          },
          unreadCount: 0
        });
      }

      // If unread and sent to current user, count it
      if (!isSender && !msg.read) {
        conversationMap.get(otherUserId).unreadCount += 1;
      }
    }

    const conversations = Array.from(conversationMap.values());
    res.json({ success: true, count: conversations.length, conversations });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Could not fetch conversations.', error: err.message });
  }
};

// GET /api/messages/thread/:userId - fetch thread history with specific user
const getThread = async (req, res) => {
  try {
    const currentUserId = req.user._id;
    const { userId } = req.params;

    const otherUser = await User.findById(userId).select('fullName profileImage city bio travelStyle verified');
    if (!otherUser) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const messages = await Message.find({
      $or: [
        { sender: currentUserId, recipient: userId },
        { sender: userId, recipient: currentUserId }
      ]
    })
      .sort({ createdAt: 1 })
      .populate('sender', 'fullName profileImage');

    // Auto mark received unread messages as read
    await Message.updateMany(
      { sender: userId, recipient: currentUserId, read: false },
      { $set: { read: true, readAt: new Date() } }
    );

    res.json({ success: true, otherUser, messages });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Could not fetch thread.', error: err.message });
  }
};

// POST /api/messages - send message to a user
const sendMessage = async (req, res) => {
  try {
    const { recipientId, text, tripId, attachments = [] } = req.body;

    if (!recipientId || !text || text.trim() === '') {
      return res.status(400).json({ success: false, message: 'Recipient and message text are required.' });
    }

    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({ success: false, message: 'Recipient not found.' });
    }

    const message = await Message.create({
      sender: req.user._id,
      recipient: recipientId,
      trip: tripId || null,
      text: text.trim(),
      attachments
    });

    const populated = await Message.findById(message._id)
      .populate('sender', 'fullName profileImage city')
      .populate('recipient', 'fullName profileImage city');

    // Create in-app notification for recipient
    await Notification.create({
      user: recipientId,
      sender: req.user._id,
      type: 'general',
      title: `New message from ${req.user.fullName}`,
      message: text.length > 60 ? text.substring(0, 57) + '...' : text,
      link: '/connections'
    });

    res.status(201).json({ success: true, message: populated });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Could not send message.', error: err.message });
  }
};

// PUT /api/messages/read/:senderId - mark all messages from sender as read
const markThreadRead = async (req, res) => {
  try {
    const { senderId } = req.params;
    await Message.updateMany(
      { sender: senderId, recipient: req.user._id, read: false },
      { $set: { read: true, readAt: new Date() } }
    );
    res.json({ success: true, message: 'Thread marked as read.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Could not mark thread as read.', error: err.message });
  }
};

// GET /api/messages/unread-count - total unread messages count
const getUnreadCount = async (req, res) => {
  try {
    const count = await Message.countDocuments({
      recipient: req.user._id,
      read: false
    });
    res.json({ success: true, unreadCount: count });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Could not fetch unread count.', error: err.message });
  }
};

module.exports = {
  getConversations,
  getThread,
  sendMessage,
  markThreadRead,
  getUnreadCount
};

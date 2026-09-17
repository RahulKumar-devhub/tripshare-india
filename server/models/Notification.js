const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // recipient
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    type: {
      type: String,
      enum: [
        'buddy_request',
        'buddy_accepted',
        'trip_invite',
        'invite_accepted',
        'trip_joined',
        'story_like',
        'booking_confirmed',
        'booking_cancelled',
        'message',
        'expense',
        'general'
      ],
      default: 'general',
      required: true
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    link: { type: String, default: '' },
    read: { type: Boolean, default: false }
  },
  { timestamps: true }
);

notificationSchema.index({ user: 1, read: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);

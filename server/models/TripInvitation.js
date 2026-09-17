const mongoose = require('mongoose');

const tripInvitationSchema = new mongoose.Schema(
  {
    trip: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', required: true },
    fromUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    toUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: String, default: 'Hey! I would love for you to join this trip!' },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending'
    }
  },
  { timestamps: true }
);

tripInvitationSchema.index({ trip: 1, toUser: 1, status: 1 });

module.exports = mongoose.model('TripInvitation', tripInvitationSchema);

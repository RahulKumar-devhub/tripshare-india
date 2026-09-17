const mongoose = require('mongoose');

const buddyRequestSchema = new mongoose.Schema(
  {
    fromUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    toUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    trip: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', default: null },
    destination: { type: String, default: '' },
    message: { type: String, default: 'Hi! Let\'s connect and travel India together!' },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending'
    }
  },
  { timestamps: true }
);

buddyRequestSchema.index({ fromUser: 1, toUser: 1, status: 1 });

module.exports = mongoose.model('BuddyRequest', buddyRequestSchema);

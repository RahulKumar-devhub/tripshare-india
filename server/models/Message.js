const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    trip: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', default: null },
    text: { type: String, required: true, trim: true },
    attachments: [
      {
        url: { type: String },
        fileType: { type: String, default: 'image' }
      }
    ],
    read: { type: Boolean, default: false },
    readAt: { type: Date, default: null }
  },
  { timestamps: true }
);

messageSchema.index({ sender: 1, recipient: 1, createdAt: -1 });
messageSchema.index({ recipient: 1, read: 1 });

module.exports = mongoose.model('Message', messageSchema);

const mongoose = require('mongoose');

const savedItemSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    itemType: {
      type: String,
      required: true,
      enum: ['destination', 'experience', 'stay', 'trip', 'buddy']
    },
    itemId: { type: String, required: true },
    itemData: {
      title: { type: String, default: '' },
      subtitle: { type: String, default: '' },
      image: { type: String, default: '' },
      price: { type: Number, default: 0 },
      rating: { type: Number, default: 0 },
      location: { type: String, default: '' },
      category: { type: String, default: '' }
    }
  },
  { timestamps: true }
);

savedItemSchema.index({ user: 1, itemType: 1 });
savedItemSchema.index({ user: 1, itemType: 1, itemId: 1 }, { unique: true });

module.exports = mongoose.model('SavedItem', savedItemSchema);

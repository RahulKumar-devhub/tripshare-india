const mongoose = require('mongoose');

const travelStorySchema = new mongoose.Schema(
  {
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    destination: { type: String, required: true, trim: true },
    coverImage: { type: String, required: true },
    excerpt: { type: String, required: true, maxlength: 400 },
    content: { type: String, required: true },
    tripDuration: { type: String, default: '5 Days' },
    budgetSpent: { type: Number, default: 12000 },
    travelStyle: { type: String, default: 'Adventure' },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    comments: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        text: { type: String, required: true },
        createdAt: { type: Date, default: Date.now }
      }
    ],
    tags: [{ type: String }]
  },
  { timestamps: true }
);

module.exports = mongoose.model('TravelStory', travelStorySchema);

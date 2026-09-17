const mongoose = require('mongoose');

const destinationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    state: { type: String, required: true, trim: true },
    tagLine: { type: String, default: '' },
    description: { type: String, required: true },
    heroImage: { type: String, required: true },
    gallery: [{ type: String }],
    category: {
      type: String,
      enum: ['Mountains', 'Beaches', 'Heritage', 'Spiritual', 'Wildlife', 'Road Trips', 'Offbeat'],
      required: true
    },
    bestTimeToVisit: { type: String, default: 'Year-round' },
    idealDuration: { type: String, default: '4-7 Days' },
    averageBudgetPerDay: { type: Number, default: 2500 },
    highlights: [{ type: String }],
    experiences: [
      {
        title: { type: String, required: true },
        description: { type: String, required: true },
        icon: { type: String, default: 'Compass' }
      }
    ],
    travelTips: [{ type: String }],
    coordinates: {
      lat: { type: Number, default: 20.5937 },
      lng: { type: Number, default: 78.9629 }
    },
    featured: { type: Boolean, default: false }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Destination', destinationSchema);

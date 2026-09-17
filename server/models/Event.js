const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    city: { type: String, required: true, trim: true },
    venue: { type: String, required: true, trim: true },
    date: { type: Date, required: true },
    time: { type: String, required: true }, // e.g. "06:00"
    category: {
      type: String,
      required: true,
      enum: [
        'Trekking',
        'Camping',
        'Cultural Tours',
        'Adventure',
        'Food Experiences',
        'Beach Activities',
        'Wildlife',
        'Spiritual',
        'Photography',
        'Road Trips',
        'Movies',
        'Concerts',
        'Sports',
        'Theatre',
        'Festivals',
        'Food',
        'Wellness'
      ]
    },
    price: { type: Number, required: true, min: 0 },
    rating: { type: Number, default: 4.8, min: 0, max: 5 },
    reviewCount: { type: Number, default: 24 },
    totalSeats: { type: Number, required: true, min: 1 },
    availableSeats: { type: Number, required: true, min: 0 },
    image: { type: String, required: true }, // URL or uploaded file path
    gallery: [{ type: String }],
    organiser: { type: String, required: true },
    tags: [{ type: String }],
    duration: { type: String, default: '1 Day' }, // e.g. "3 Days / 2 Nights"
    ageLimit: { type: String, default: 'All ages' }, // e.g. "12+", "All ages"
    difficulty: {
      type: String,
      enum: ['Easy', 'Moderate', 'Challenging', 'Strenuous'],
      default: 'Moderate'
    },
    amenities: [{ type: String }],
    facilities: [{ type: String }],
    highlights: [{ type: String }],
    included: [{ type: String }],
    excluded: [{ type: String }],
    itineraryTimeline: [
      {
        day: { type: Number, default: 1 },
        title: { type: String, default: '' },
        description: { type: String, default: '' }
      }
    ],
    cancellationPolicy: {
      type: String,
      default: 'Full refund if cancelled up to 48 hours before the start time.'
    },
    safetyTips: [{ type: String }],
    venueType: { type: String, enum: ['Indoor', 'Outdoor', 'Hybrid'], default: 'Outdoor' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

eventSchema.index({ city: 1, category: 1, price: 1, date: 1 });
eventSchema.index({ rating: -1 });

module.exports = mongoose.model('Event', eventSchema);

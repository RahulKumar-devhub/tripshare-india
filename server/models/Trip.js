const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    destination: { type: String, required: true, trim: true }, // e.g. "Spiti Valley, Himachal Pradesh"
    fromCity: { type: String, required: true, trim: true },
    toCity: { type: String, required: true, trim: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    duration: { type: String, default: '' }, // e.g. "7 Days / 6 Nights"
    budget: { type: Number, required: true, min: 0 }, // budget per person in INR
    travelStyle: {
      type: String,
      required: true,
      trim: true
    },
    interests: [{ type: String }],
    groupSize: { type: Number, required: true, min: 1, max: 100 },
    organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    members: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        role: { type: String, enum: ['organizer', 'member'], default: 'member' },
        joinedAt: { type: Date, default: Date.now }
      }
    ],
    description: { type: String, required: true },
    itinerary: [
      {
        day: { type: Number, default: 1 },
        title: { type: String, default: '' },
        activity: { type: String, default: '' },
        activities: [{ type: String }],
        stayLocation: { type: String, default: '' }
      }
    ],
    meetingPoint: { type: String, default: '' },
    images: [{ type: String }],
    status: { type: String, enum: ['active', 'completed', 'cancelled'], default: 'active' },
    tags: [{ type: String }],
    event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', default: null } // backward compatibility
  },
  { timestamps: true }
);

tripSchema.index({ destination: 1, startDate: 1, budget: 1 });
tripSchema.index({ fromCity: 1, toCity: 1, startDate: 1 });

module.exports = mongoose.model('Trip', tripSchema);


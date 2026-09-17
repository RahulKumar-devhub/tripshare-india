const mongoose = require('mongoose');

const staySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    destination: { type: String, required: true, trim: true }, // e.g. "Manali", "Goa", "Jaipur"
    state: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    propertyType: {
      type: String,
      required: true,
      enum: ['Hotel', 'Resort', 'Hostel', 'Guest House', 'Homestay', 'Villa', 'Apartment', 'Cottage', 'Camp'],
      default: 'Hotel'
    },
    rating: { type: Number, default: 4.5, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    pricePerNight: { type: Number, required: true, min: 0 },
    taxPercentage: { type: Number, default: 12 },
    heroImage: { type: String, required: true },
    gallery: [{ type: String }],
    description: { type: String, required: true },
    amenities: [{ type: String }],
    roomTypes: [
      {
        title: { type: String, required: true },
        capacity: { type: Number, default: 2 },
        pricePerNight: { type: Number, required: true },
        bedType: { type: String, default: '1 Queen Bed' },
        size: { type: String, default: '280 sq.ft' },
        features: [{ type: String }]
      }
    ],
    rules: [{ type: String }],
    address: { type: String, required: true },
    coordinates: {
      lat: { type: Number, default: 20.5937 },
      lng: { type: Number, default: 78.9629 }
    },
    distanceFromCenter: { type: String, default: 'Near city center' },
    checkInTime: { type: String, default: '14:00' },
    checkOutTime: { type: String, default: '11:00' },
    featured: { type: Boolean, default: false },
    reviews: [
      {
        userName: { type: String, required: true },
        userAvatar: { type: String, default: '' },
        rating: { type: Number, required: true, min: 1, max: 5 },
        comment: { type: String, required: true },
        date: { type: Date, default: Date.now }
      }
    ]
  },
  { timestamps: true }
);

staySchema.index({ destination: 1, propertyType: 1, pricePerNight: 1, rating: -1 });

module.exports = mongoose.model('Stay', staySchema);

const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    bookingReference: {
      type: String,
      unique: true,
      required: true,
      default: () => 'TSI-' + Math.floor(100000 + Math.random() * 900000)
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    bookingType: {
      type: String,
      enum: ['experience', 'stay'],
      default: 'experience'
    },
    event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', default: null },
    stay: { type: mongoose.Schema.Types.ObjectId, ref: 'Stay', default: null },
    stayRoomType: { type: String, default: '' },
    quantity: { type: Number, required: true, min: 1, default: 1 },
    checkInDate: { type: Date, default: null },
    checkOutDate: { type: Date, default: null },
    guests: {
      adults: { type: Number, default: 1 },
      children: { type: Number, default: 0 }
    },
    addOns: [
      {
        title: { type: String },
        price: { type: Number }
      }
    ],
    customerInfo: {
      fullName: { type: String, default: '' },
      email: { type: String, default: '' },
      phone: { type: String, default: '' },
      specialRequests: { type: String, default: '' }
    },
    priceBreakdown: {
      basePrice: { type: Number, default: 0 },
      taxes: { type: Number, default: 0 },
      serviceFee: { type: Number, default: 0 },
      discount: { type: Number, default: 0 },
      addOnsTotal: { type: Number, default: 0 },
      totalAmount: { type: Number, default: 0 }
    },
    totalAmount: { type: Number, required: true, min: 0 },
    paymentMethod: { type: String, default: 'sandbox_payment' },
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'refunded'],
      default: 'completed'
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'completed'],
      default: 'confirmed'
    },
    bookingDate: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

bookingSchema.index({ user: 1, createdAt: -1 });
bookingSchema.index({ event: 1, status: 1 });
bookingSchema.index({ stay: 1, status: 1 });

module.exports = mongoose.model('Booking', bookingSchema);

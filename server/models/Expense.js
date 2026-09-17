const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    trip: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', default: null },
    category: {
      type: String,
      enum: ['Transport', 'Hotel', 'Food', 'Activity', 'Shopping', 'Tickets', 'Miscellaneous'],
      default: 'Miscellaneous'
    },
    description: { type: String, default: '' },
    amount: { type: Number, default: 0, min: 0 },
    paidBy: { type: String, default: '' }, // e.g. "Rahul", "Aman", or User name
    date: { type: Date, default: Date.now },
    participants: [
      {
        name: { type: String, required: true },
        share: { type: Number, default: 0 }
      }
    ],

    // Legacy fields for backward compatibility
    hotel: { type: Number, default: 0, min: 0 },
    food: { type: Number, default: 0, min: 0 },
    transport: { type: Number, default: 0, min: 0 },
    other: { type: Number, default: 0, min: 0 },
    people: { type: Number, default: 1, min: 1 },
    note: { type: String, default: '' },
    total: { type: Number, default: 0 },
    perPerson: { type: Number, default: 0 }
  },
  { timestamps: true }
);

expenseSchema.index({ trip: 1, createdAt: -1 });
expenseSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Expense', expenseSchema);

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    password: { type: String, required: true }, // stored as a bcrypt hash
    bio: { type: String, default: '', maxlength: 500 },
    profileImage: { type: String, default: '' }, // uploaded file path or URL
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    
    // Travel Persona & Matching Criteria
    travelStyle: {
      type: String,
      enum: ['Backpacker', 'Roadtripper', 'Luxury', 'Adventure', 'Cultural', 'Solo Explorer', 'Weekend Escaper'],
      default: 'Adventure'
    },
    interests: [{
      type: String,
      enum: [
        'Mountains', 'Beaches', 'Trekking', 'Photography', 'Food',
        'Nightlife', 'Culture', 'Spiritual', 'Wildlife', 'Road Trips',
        'Backpacking', 'Luxury', 'Camping', 'Heritage'
      ]
    }],
    budgetLevel: {
      type: String,
      enum: ['Budget', 'Moderate', 'Comfort', 'Luxury'],
      default: 'Moderate'
    },
    adventureLevel: {
      type: String,
      enum: ['Low', 'Moderate', 'High', 'Extreme'],
      default: 'Moderate'
    },
    accommodationPref: {
      type: String,
      enum: ['Hostels', 'Homestays', 'Boutique Hotels', 'Luxury Resorts', 'Camps'],
      default: 'Homestays'
    },
    transportPref: {
      type: String,
      enum: ['Public / Trains', 'Self-Drive / Bikes', 'Flights', 'Shared Cabs'],
      default: 'Shared Cabs'
    },
    groupPreference: {
      type: String,
      enum: ['Solo', 'Small Group', 'Any'],
      default: 'Small Group'
    },
    destinationsVisited: [{ type: String, trim: true }],
    bucketList: [{ type: String, trim: true }],
    savedTrips: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Trip' }],
    verified: { type: Boolean, default: true },
    socialLinks: {
      instagram: { type: String, default: '' },
      twitter: { type: String, default: '' }
    },

    favourites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }],
    resetToken: { type: String, default: null },
    resetTokenExpires: { type: Date, default: null }
  },
  { timestamps: true }
);

// Never send the password hash back to the client.
userSchema.methods.toSafeObject = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.resetToken;
  delete obj.resetTokenExpires;
  return obj;
};

module.exports = mongoose.model('User', userSchema);


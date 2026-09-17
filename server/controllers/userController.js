const User = require('../models/User');
const Trip = require('../models/Trip');
const SavedItem = require('../models/SavedItem');

// PUT /api/users/profile - protected - update personal & travel profile
const updateProfile = async (req, res) => {
  try {
    const {
      fullName,
      phone,
      city,
      bio,
      travelStyle,
      interests,
      budgetLevel,
      adventureLevel,
      accommodationPref,
      transportPref,
      groupPreference,
      destinationsVisited,
      bucketList,
      socialLinks
    } = req.body;

    const update = {};
    if (fullName) update.fullName = fullName.trim();
    if (phone) update.phone = phone.trim();
    if (city) update.city = city.trim();
    if (bio !== undefined) update.bio = bio;
    if (travelStyle) update.travelStyle = travelStyle;
    if (interests) update.interests = Array.isArray(interests) ? interests : [interests];
    if (budgetLevel) update.budgetLevel = budgetLevel;
    if (adventureLevel) update.adventureLevel = adventureLevel;
    if (accommodationPref) update.accommodationPref = accommodationPref;
    if (transportPref) update.transportPref = transportPref;
    if (groupPreference) update.groupPreference = groupPreference;
    if (destinationsVisited) update.destinationsVisited = Array.isArray(destinationsVisited) ? destinationsVisited : destinationsVisited.split(',').map((s) => s.trim());
    if (bucketList) update.bucketList = Array.isArray(bucketList) ? bucketList : bucketList.split(',').map((s) => s.trim());
    if (socialLinks) update.socialLinks = socialLinks;

    if (req.file) update.profileImage = `/uploads/${req.file.filename}`;

    const user = await User.findByIdAndUpdate(req.user._id, update, { new: true, runValidators: true });
    res.json({ success: true, message: 'Travel profile updated successfully.', user: user.toSafeObject() });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Could not update profile.', error: err.message });
  }
};

// GET /api/users/profile/:id - public - get full public travel profile with trips
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password -resetToken -resetTokenExpires');
    if (!user) return res.status(404).json({ success: false, message: 'Traveler not found.' });

    // Fetch user's created trips
    const createdTrips = await Trip.find({ organizer: user._id, status: 'active' })
      .populate('organizer', 'fullName city profileImage travelStyle verified')
      .sort({ startDate: 1 });

    // Fetch user's joined trips
    const joinedTrips = await Trip.find({
      organizer: { $ne: user._id },
      'members.user': user._id,
      status: 'active'
    })
      .populate('organizer', 'fullName city profileImage travelStyle verified')
      .sort({ startDate: 1 });

    res.json({
      success: true,
      user,
      createdTrips,
      joinedTrips,
      stats: {
        tripsCreated: createdTrips.length,
        tripsJoined: joinedTrips.length,
        destinationsVisitedCount: (user.destinationsVisited || []).length,
        bucketListCount: (user.bucketList || []).length
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Could not fetch user profile.', error: err.message });
  }
};

// --- UNIFIED SAVED ITEMS API ---
// GET /api/users/saved - protected - get all saved items across categories
const getAllSavedItems = async (req, res) => {
  try {
    const savedItems = await SavedItem.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, count: savedItems.length, savedItems });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Could not fetch saved items.', error: err.message });
  }
};

// POST /api/users/saved - protected - toggle save item
const toggleSavedItem = async (req, res) => {
  try {
    const { itemType, itemId, itemData = {} } = req.body;
    if (!itemType || !itemId) {
      return res.status(400).json({ success: false, message: 'itemType and itemId are required.' });
    }

    const existing = await SavedItem.findOne({ user: req.user._id, itemType, itemId: String(itemId) });
    if (existing) {
      await existing.deleteOne();
      return res.json({ success: true, saved: false, message: 'Item removed from saved.' });
    }

    const created = await SavedItem.create({
      user: req.user._id,
      itemType,
      itemId: String(itemId),
      itemData
    });

    res.json({ success: true, saved: true, message: 'Item saved successfully.', savedItem: created });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Could not toggle saved item.', error: err.message });
  }
};

// DELETE /api/users/saved/:itemType/:itemId - protected
const removeSavedItem = async (req, res) => {
  try {
    const { itemType, itemId } = req.params;
    await SavedItem.findOneAndDelete({ user: req.user._id, itemType, itemId });
    res.json({ success: true, message: 'Item removed from saved.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Could not remove saved item.', error: err.message });
  }
};

// Legacy support for trips and events
const toggleSaveTrip = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const tripId = req.params.tripId;

    const idx = (user.savedTrips || []).findIndex((id) => String(id) === String(tripId));
    let saved = false;

    if (idx > -1) {
      user.savedTrips.splice(idx, 1);
    } else {
      user.savedTrips.push(tripId);
      saved = true;
    }

    await user.save();
    res.json({
      success: true,
      saved,
      message: saved ? 'Trip saved to your wishlist.' : 'Trip removed from wishlist.',
      savedTrips: user.savedTrips
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Could not save trip.', error: err.message });
  }
};

const getSavedTrips = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: 'savedTrips',
      populate: { path: 'organizer', select: 'fullName city profileImage travelStyle' }
    });

    res.json({ success: true, savedTrips: user.savedTrips || [] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Could not fetch saved trips.', error: err.message });
  }
};

const toggleFavourite = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const eventId = req.params.eventId;
    const idx = user.favourites.findIndex((id) => String(id) === String(eventId));
    let added = false;
    if (idx > -1) {
      user.favourites.splice(idx, 1);
    } else {
      user.favourites.push(eventId);
      added = true;
    }
    await user.save();
    res.json({ success: true, added, favourites: user.favourites });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Could not update favourites.', error: err.message });
  }
};

const getFavourites = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('favourites');
    res.json({ success: true, favourites: user.favourites });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Could not fetch favourites.', error: err.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password -resetToken -resetTokenExpires');
    res.json({ success: true, count: users.length, users });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Could not fetch users.', error: err.message });
  }
};

module.exports = {
  updateProfile,
  getUserProfile,
  getAllSavedItems,
  toggleSavedItem,
  removeSavedItem,
  toggleSaveTrip,
  getSavedTrips,
  toggleFavourite,
  getFavourites,
  getAllUsers
};

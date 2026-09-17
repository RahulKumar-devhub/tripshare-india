const Destination = require('../models/Destination');
const Trip = require('../models/Trip');
const User = require('../models/User');

// GET /api/destinations - public - fetch all Indian destinations
const getAllDestinations = async (req, res) => {
  try {
    const { category, search, featured } = req.query;
    const query = {};

    if (category && category !== 'All') {
      query.category = category;
    }
    if (featured === 'true') {
      query.featured = true;
    }
    if (search) {
      const searchRe = { $regex: search.trim(), $options: 'i' };
      query.$or = [{ name: searchRe }, { state: searchRe }, { tagLine: searchRe }, { highlights: searchRe }];
    }

    const destinations = await Destination.find(query).sort({ featured: -1, name: 1 });
    res.json({ success: true, count: destinations.length, destinations });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Could not fetch destinations.', error: err.message });
  }
};

// GET /api/destinations/:slug - public - get destination details with active trips
const getDestinationBySlug = async (req, res) => {
  try {
    const destination = await Destination.findOne({ slug: req.params.slug.toLowerCase() });
    if (!destination) {
      return res.status(404).json({ success: false, message: 'Destination not found.' });
    }

    // Find active trips heading to this destination
    const trips = await Trip.find({
      destination: { $regex: destination.name, $options: 'i' },
      status: 'active'
    })
      .populate('organizer', 'fullName city profileImage travelStyle verified')
      .sort({ startDate: 1 });

    // Find fellow travelers interested in this destination
    const travelers = await User.find({
      $or: [
        { bucketList: { $regex: destination.name, $options: 'i' } },
        { destinationsVisited: { $regex: destination.name, $options: 'i' } }
      ]
    })
      .select('fullName city profileImage travelStyle interests verified bio')
      .limit(6);

    res.json({
      success: true,
      destination,
      activeTrips: trips,
      interestedTravelers: travelers
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Could not fetch destination.', error: err.message });
  }
};

module.exports = { getAllDestinations, getDestinationBySlug };

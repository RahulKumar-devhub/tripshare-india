const Trip = require('../models/Trip');
const Notification = require('../models/Notification');

// GET /api/trips - public - get all trips with filtering and sorting
const getAllTrips = async (req, res) => {
  try {
    const {
      destination,
      travelStyle,
      minBudget,
      maxBudget,
      startDate,
      search,
      interests,
      groupSize,
      sort = 'newest'
    } = req.query;

    const query = { status: 'active' };

    if (destination) {
      query.$or = [
        { destination: { $regex: destination.trim(), $options: 'i' } },
        { toCity: { $regex: destination.trim(), $options: 'i' } }
      ];
    }

    if (search) {
      const searchRe = { $regex: search.trim(), $options: 'i' };
      query.$or = [
        { title: searchRe },
        { destination: searchRe },
        { fromCity: searchRe },
        { toCity: searchRe },
        { description: searchRe },
        { tags: searchRe }
      ];
    }

    if (travelStyle && travelStyle !== 'All') {
      query.travelStyle = travelStyle;
    }

    if (minBudget || maxBudget) {
      query.budget = {};
      if (minBudget) query.budget.$gte = Number(minBudget);
      if (maxBudget) query.budget.$lte = Number(maxBudget);
    }

    if (startDate) {
      query.startDate = { $gte: new Date(startDate) };
    }

    if (groupSize) {
      query.groupSize = { $gte: Number(groupSize) };
    }

    if (interests) {
      const interestList = Array.isArray(interests) ? interests : interests.split(',');
      query.interests = { $in: interestList };
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'date') sortOption = { startDate: 1 };
    if (sort === 'budget_asc') sortOption = { budget: 1 };
    if (sort === 'budget_desc') sortOption = { budget: -1 };
    if (sort === 'popular') sortOption = { 'members.length': -1 };

    const trips = await Trip.find(query)
      .populate('organizer', 'fullName city bio profileImage travelStyle verified')
      .populate('members.user', 'fullName city profileImage travelStyle')
      .sort(sortOption);

    res.json({ success: true, count: trips.length, trips });
  } catch (err) {
    console.error('Fetch trips error:', err);
    res.status(500).json({ success: false, message: 'Could not fetch trips.', error: err.message });
  }
};

// GET /api/trips/:id - public - get trip details
const getTripById = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id)
      .populate('organizer', 'fullName city bio profileImage travelStyle interests verified phone email')
      .populate('members.user', 'fullName city profileImage travelStyle interests bio verified');

    if (!trip) {
      return res.status(404).json({ success: false, message: 'Trip not found.' });
    }

    res.json({ success: true, trip });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Could not fetch trip details.', error: err.message });
  }
};

// POST /api/trips - protected - create trip (11-step creation backend handler)
const createTrip = async (req, res) => {
  try {
    const {
      title,
      destination,
      fromCity,
      toCity,
      startDate,
      endDate,
      duration,
      budget,
      estimatedBudget,
      travelStyle,
      interests = [],
      groupSize,
      groupSizeLimit,
      maxMembers,
      description,
      itinerary = [],
      meetingPoint,
      images = [],
      tags = []
    } = req.body;

    const finalToCity = (toCity || destination || '').trim();
    const finalBudget = budget !== undefined ? Number(budget) : (estimatedBudget !== undefined ? Number(estimatedBudget) : 0);
    const finalGroupSize = groupSize !== undefined ? Number(groupSize) : (groupSizeLimit !== undefined ? Number(groupSizeLimit) : (maxMembers !== undefined ? Number(maxMembers) : 4));

    if (!title || !destination || !fromCity || !startDate || !endDate || !finalBudget || !travelStyle || !description) {
      return res.status(400).json({
        success: false,
        message: 'Title, destination, origin, dates, budget, style, and description are all required.'
      });
    }

    if (new Date(endDate) < new Date(startDate)) {
      return res.status(400).json({ success: false, message: 'End date cannot be earlier than start date.' });
    }

    // Default image if none provided
    const tripImages = images && images.length > 0
      ? images
      : ['https://images.unsplash.com/photo-1506461883276-594a12b11cf3?auto=format&fit=crop&w=1200&q=80'];

    // Calculate duration string if not given
    const sDate = new Date(startDate);
    const eDate = new Date(endDate);
    const diffDays = Math.max(1, Math.round((eDate - sDate) / (1000 * 60 * 60 * 24)));
    const calculatedDuration = duration || `${diffDays} Days / ${Math.max(0, diffDays - 1)} Nights`;

    const trip = await Trip.create({
      title: title.trim(),
      destination: destination.trim(),
      fromCity: fromCity.trim(),
      toCity: finalToCity,
      startDate,
      endDate,
      duration: calculatedDuration,
      budget: finalBudget,
      travelStyle,
      interests: Array.isArray(interests) ? interests : [interests],
      groupSize: finalGroupSize,
      organizer: req.user._id,
      members: [
        {
          user: req.user._id,
          role: 'organizer',
          joinedAt: new Date()
        }
      ],
      description: description.trim(),
      itinerary: Array.isArray(itinerary) ? itinerary : [],
      meetingPoint: meetingPoint || `${fromCity.trim()} Central Hub`,
      images: tripImages,
      tags: Array.isArray(tags) ? tags : []
    });

    const populatedTrip = await Trip.findById(trip._id)
      .populate('organizer', 'fullName city bio profileImage travelStyle verified')
      .populate('members.user', 'fullName city profileImage travelStyle');

    res.status(201).json({
      success: true,
      message: 'Trip created and published successfully!',
      trip: populatedTrip
    });
  } catch (err) {
    console.error('Create trip error:', err);
    res.status(500).json({ success: false, message: 'Could not create trip.', error: err.message });
  }
};

// PUT /api/trips/:id - protected - update trip (organizer only)
const updateTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ success: false, message: 'Trip not found.' });

    if (String(trip.organizer) !== String(req.user._id)) {
      return res.status(403).json({ success: false, message: 'Only the trip organizer can edit this trip.' });
    }

    const allowedUpdates = [
      'title', 'destination', 'fromCity', 'toCity', 'startDate', 'endDate',
      'budget', 'travelStyle', 'interests', 'groupSize', 'description',
      'itinerary', 'meetingPoint', 'images', 'tags', 'status'
    ];

    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) trip[field] = req.body[field];
    });

    await trip.save();
    const updated = await Trip.findById(trip._id)
      .populate('organizer', 'fullName city bio profileImage travelStyle verified')
      .populate('members.user', 'fullName city profileImage travelStyle');

    res.json({ success: true, message: 'Trip updated successfully.', trip: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Could not update trip.', error: err.message });
  }
};

// DELETE /api/trips/:id - protected - delete trip (organizer only)
const deleteTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ success: false, message: 'Trip not found.' });

    if (String(trip.organizer) !== String(req.user._id) && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Only the organizer can delete this trip.' });
    }

    await trip.deleteOne();
    res.json({ success: true, message: 'Trip deleted successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Could not delete trip.', error: err.message });
  }
};

// POST /api/trips/:id/join - protected - join an active trip
const joinTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ success: false, message: 'Trip not found.' });

    if (trip.status !== 'active') {
      return res.status(400).json({ success: false, message: 'This trip is no longer accepting members.' });
    }

    // Check if already a member
    const alreadyMember = trip.members.some((m) => String(m.user) === String(req.user._id));
    if (alreadyMember) {
      return res.status(400).json({ success: false, message: 'You have already joined this trip.' });
    }

    // Check capacity
    if (trip.members.length >= trip.groupSize) {
      return res.status(400).json({ success: false, message: 'This trip is full! No open slots left.' });
    }

    trip.members.push({
      user: req.user._id,
      role: 'member',
      joinedAt: new Date()
    });

    await trip.save();

    // Notify organizer
    if (String(trip.organizer) !== String(req.user._id)) {
      await Notification.create({
        user: trip.organizer,
        sender: req.user._id,
        type: 'trip_joined',
        title: 'New Trip Member!',
        message: `${req.user.fullName} just joined your trip to ${trip.destination}!`,
        link: `/trips/${trip._id}`
      });
    }

    const updated = await Trip.findById(trip._id)
      .populate('organizer', 'fullName city bio profileImage travelStyle verified')
      .populate('members.user', 'fullName city profileImage travelStyle verified');

    res.json({ success: true, message: `You've joined the trip to ${trip.destination}!`, trip: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Could not join trip.', error: err.message });
  }
};

// POST /api/trips/:id/leave - protected - leave a trip
const leaveTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ success: false, message: 'Trip not found.' });

    if (String(trip.organizer) === String(req.user._id)) {
      return res.status(400).json({
        success: false,
        message: 'Organizers cannot leave their own trip. You can cancel or delete the trip if needed.'
      });
    }

    const memberIndex = trip.members.findIndex((m) => String(m.user) === String(req.user._id));
    if (memberIndex === -1) {
      return res.status(400).json({ success: false, message: 'You are not a member of this trip.' });
    }

    trip.members.splice(memberIndex, 1);
    await trip.save();

    const updated = await Trip.findById(trip._id)
      .populate('organizer', 'fullName city bio profileImage travelStyle verified')
      .populate('members.user', 'fullName city profileImage travelStyle');

    res.json({ success: true, message: 'You have left the trip.', trip: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Could not leave trip.', error: err.message });
  }
};

// GET /api/trips/my - protected - trips organized by or joined by current user
const getMyTrips = async (req, res) => {
  try {
    const organized = await Trip.find({ organizer: req.user._id })
      .populate('organizer', 'fullName city profileImage')
      .populate('members.user', 'fullName city profileImage')
      .sort({ createdAt: -1 });

    const joined = await Trip.find({
      organizer: { $ne: req.user._id },
      'members.user': req.user._id
    })
      .populate('organizer', 'fullName city profileImage')
      .populate('members.user', 'fullName city profileImage')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      organized,
      joined,
      totalCount: organized.length + joined.length
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Could not fetch your trips.', error: err.message });
  }
};

module.exports = {
  getAllTrips,
  getTripById,
  createTrip,
  updateTrip,
  deleteTrip,
  joinTrip,
  leaveTrip,
  getMyTrips
};

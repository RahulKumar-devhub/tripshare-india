const User = require('../models/User');
const Booking = require('../models/Booking');
const Trip = require('../models/Trip');
const Event = require('../models/Event');
const Stay = require('../models/Stay');
const BuddyRequest = require('../models/BuddyRequest');
const Destination = require('../models/Destination');

// GET /api/admin/metrics - platform KPIs
const getMetrics = async (req, res) => {
  try {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const [
      totalUsers,
      newUsersWeek,
      totalBookings,
      confirmedBookings,
      totalTrips,
      activeTrips,
      totalExperiences,
      totalStays,
      buddyRequests,
      destinations
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ createdAt: { $gte: oneWeekAgo } }),
      Booking.countDocuments(),
      Booking.find({ status: { $ne: 'cancelled' } }),
      Trip.countDocuments(),
      Trip.countDocuments({ status: 'active' }),
      Event.countDocuments(),
      Stay.countDocuments(),
      BuddyRequest.countDocuments(),
      Destination.countDocuments()
    ]);

    const totalRevenue = confirmedBookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
    const connectedBuddies = await BuddyRequest.countDocuments({ status: 'accepted' });

    res.json({
      success: true,
      metrics: {
        totalUsers,
        newUsersWeek,
        totalBookings,
        confirmedBookingsCount: confirmedBookings.length,
        totalRevenue,
        totalTrips,
        activeTrips,
        totalExperiences,
        totalStays,
        buddyRequests,
        connectedBuddies,
        destinations
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Could not fetch admin metrics.', error: err.message });
  }
};

// GET /api/admin/analytics - chart time-series and distributions
const getAnalytics = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('event', 'title category price city')
      .populate('stay', 'name propertyType city pricePerNight')
      .sort({ createdAt: 1 });

    // Group bookings by month
    const monthlyMap = {};
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    // Initialize past 6 months
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${months[d.getMonth()]} ${d.getFullYear().toString().slice(-2)}`;
      monthlyMap[key] = { month: key, bookings: 0, revenue: 0 };
    }

    for (const b of bookings) {
      const bDate = new Date(b.createdAt);
      const key = `${months[bDate.getMonth()]} ${bDate.getFullYear().toString().slice(-2)}`;
      if (monthlyMap[key]) {
        monthlyMap[key].bookings += 1;
        if (b.status !== 'cancelled') {
          monthlyMap[key].revenue += b.totalAmount || 0;
        }
      }
    }

    // Category distribution
    const categoryMap = {};
    for (const b of bookings) {
      const cat = b.event?.category || b.stay?.propertyType || 'Experiences';
      categoryMap[cat] = (categoryMap[cat] || 0) + 1;
    }
    const categoryDistribution = Object.entries(categoryMap).map(([name, count]) => ({ name, count }));

    // Popular destinations
    const trips = await Trip.find().select('destination toCity budget');
    const destMap = {};
    for (const t of trips) {
      const dest = t.toCity || t.destination.split(',')[0].trim();
      destMap[dest] = (destMap[dest] || 0) + 1;
    }
    const popularDestinations = Object.entries(destMap)
      .map(([destination, count]) => ({ destination, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    res.json({
      success: true,
      monthlyBookings: Object.values(monthlyMap),
      categoryDistribution,
      popularDestinations
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Could not fetch admin analytics.', error: err.message });
  }
};

// GET /api/admin/users - list users with search and pagination
const getUsers = async (req, res) => {
  try {
    const { search, role, page = 1, limit = 20 } = req.query;
    const query = {};

    if (search && search.trim() !== '') {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [{ fullName: regex }, { email: regex }, { city: regex }];
    }

    if (role && role !== 'all') {
      query.role = role;
    }

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(50, Math.max(1, Number(limit)));
    const skip = (pageNum - 1) * limitNum;

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .select('-password -resetToken -resetTokenExpires')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    res.json({ success: true, count: users.length, total, page: pageNum, pages: Math.ceil(total / limitNum) || 1, users });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Could not fetch users.', error: err.message });
  }
};

// PATCH /api/admin/users/:id - update user role or verification
const updateUser = async (req, res) => {
  try {
    const { role, verified } = req.body;
    const updateData = {};
    if (role) updateData.role = role;
    if (typeof verified === 'boolean') updateData.verified = verified;

    const user = await User.findByIdAndUpdate(req.params.id, updateData, { new: true }).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

    res.json({ success: true, message: 'User updated successfully.', user });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Could not update user.', error: err.message });
  }
};

// PATCH /api/admin/bookings/:id/status - update booking status
const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['pending', 'confirmed', 'cancelled', 'completed'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value.' });
    }

    const booking = await Booking.findByIdAndUpdate(req.params.id, { status }, { new: true })
      .populate('event', 'title price')
      .populate('stay', 'name pricePerNight')
      .populate('user', 'fullName email phone');

    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found.' });

    res.json({ success: true, message: `Booking status updated to ${status}.`, booking });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Could not update booking status.', error: err.message });
  }
};

module.exports = {
  getMetrics,
  getAnalytics,
  getUsers,
  updateUser,
  updateBookingStatus
};

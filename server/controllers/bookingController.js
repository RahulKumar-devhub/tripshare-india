const Booking = require('../models/Booking');
const Event = require('../models/Event');
const Stay = require('../models/Stay');
const Notification = require('../models/Notification');

// POST /api/bookings - create a booking (experience or stay)
const createBooking = async (req, res) => {
  try {
    const {
      bookingType = 'experience',
      eventId,
      stayId,
      event,
      stay,
      stayRoomType = '',
      quantity = 1,
      checkInDate,
      checkOutDate,
      guests = { adults: 1, children: 0 },
      addOns = [],
      customerInfo = {},
      priceBreakdown = {},
      totalAmount,
      paymentMethod = 'sandbox_payment'
    } = req.body;

    const resolvedEventId = eventId || event;
    const resolvedStayId = stayId || stay;

    const qty = Math.max(1, Number(quantity) || (guests.adults || 1));
    let calculatedTotal = Number(totalAmount) || 0;
    let eventDoc = null;
    let stayDoc = null;

    if (bookingType === 'stay') {
      if (!resolvedStayId) {
        return res.status(400).json({ success: false, message: 'Stay ID is required for stay bookings.' });
      }
      stayDoc = await Stay.findById(resolvedStayId);
      if (!stayDoc) {
        return res.status(404).json({ success: false, message: 'Stay property not found.' });
      }
      if (!calculatedTotal) {
        calculatedTotal = stayDoc.pricePerNight * qty;
      }
    } else {
      // Experience / Event booking
      if (!resolvedEventId) {
        return res.status(400).json({ success: false, message: 'Experience ID is required.' });
      }
      eventDoc = await Event.findById(resolvedEventId);
      if (!eventDoc) {
        return res.status(404).json({ success: false, message: 'Experience not found.' });
      }
      if (eventDoc.availableSeats < qty) {
        return res.status(400).json({
          success: false,
          message: `Only ${eventDoc.availableSeats} seat(s) remaining for this experience.`
        });
      }

      // Decrement seats
      eventDoc.availableSeats -= qty;
      await eventDoc.save();

      if (!calculatedTotal) {
        calculatedTotal = eventDoc.price * qty;
      }
    }

    const bookingRef = 'TSI-' + Math.floor(100000 + Math.random() * 900000);

    const booking = await Booking.create({
      bookingReference: bookingRef,
      user: req.user._id,
      bookingType,
      event: eventDoc ? eventDoc._id : null,
      stay: stayDoc ? stayDoc._id : null,
      stayRoomType,
      quantity: qty,
      checkInDate: checkInDate ? new Date(checkInDate) : new Date(),
      checkOutDate: checkOutDate ? new Date(checkOutDate) : null,
      guests,
      addOns,
      customerInfo: {
        fullName: customerInfo.fullName || req.user.fullName,
        email: customerInfo.email || req.user.email,
        phone: customerInfo.phone || req.user.phone,
        specialRequests: customerInfo.specialRequests || ''
      },
      priceBreakdown: {
        basePrice: priceBreakdown.basePrice || calculatedTotal,
        taxes: priceBreakdown.taxes || Math.round(calculatedTotal * 0.12),
        serviceFee: priceBreakdown.serviceFee || Math.round(calculatedTotal * 0.05),
        discount: priceBreakdown.discount || 0,
        addOnsTotal: priceBreakdown.addOnsTotal || 0,
        totalAmount: calculatedTotal
      },
      totalAmount: calculatedTotal,
      paymentMethod,
      paymentStatus: 'completed',
      status: 'confirmed'
    });

    // Create in-app confirmation notification
    await Notification.create({
      user: req.user._id,
      type: 'general',
      title: 'Booking Confirmed!',
      message: `Your booking #${bookingRef} for ${eventDoc?.title || stayDoc?.name} is confirmed!`,
      link: '/bookings'
    });

    const populated = await Booking.findById(booking._id)
      .populate('event')
      .populate('stay');

    res.status(201).json({
      success: true,
      message: 'Booking confirmed successfully!',
      booking: populated
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Booking failed.', error: err.message });
  }
};

// GET /api/bookings/my - current user's bookings
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('event')
      .populate('stay')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: bookings.length, bookings });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Could not fetch bookings.', error: err.message });
  }
};

// GET /api/bookings/:id - fetch single booking detail
const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;
    let booking = null;

    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      booking = await Booking.findById(id).populate('event').populate('stay').populate('user', 'fullName email phone');
    }
    if (!booking) {
      booking = await Booking.findOne({ bookingReference: id })
        .populate('event')
        .populate('stay')
        .populate('user', 'fullName email phone');
    }

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }

    if (String(booking.user._id) !== String(req.user._id) && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Unauthorized access to booking.' });
    }

    res.json({ success: true, booking });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Could not fetch booking.', error: err.message });
  }
};

// PUT /api/bookings/:id/cancel - cancel booking and refund/release seats
const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }
    if (String(booking.user) !== String(req.user._id) && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'You can only cancel your own bookings.' });
    }
    if (booking.status === 'cancelled') {
      return res.status(400).json({ success: false, message: 'Booking is already cancelled.' });
    }

    booking.status = 'cancelled';
    booking.paymentStatus = 'refunded';
    await booking.save();

    // Release seats back if experience
    if (booking.event) {
      await Event.findByIdAndUpdate(booking.event, { $inc: { availableSeats: booking.quantity } });
    }

    // Notify user
    await Notification.create({
      user: booking.user,
      type: 'general',
      title: 'Booking Cancelled',
      message: `Booking #${booking.bookingReference} has been cancelled and refunded to your original payment method.`,
      link: '/bookings'
    });

    res.json({ success: true, message: 'Booking cancelled and refund processed.', booking });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Could not cancel booking.', error: err.message });
  }
};

// GET /api/bookings - admin only: view all bookings
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('event')
      .populate('stay')
      .populate('user', 'fullName email phone city')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: bookings.length, bookings });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Could not fetch bookings.', error: err.message });
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking,
  getAllBookings
};

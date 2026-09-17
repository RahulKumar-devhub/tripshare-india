const TripInvitation = require('../models/TripInvitation');
const Trip = require('../models/Trip');
const Notification = require('../models/Notification');

// POST /api/invitations - protected - invite a user to a trip
const sendInvitation = async (req, res) => {
  try {
    const { tripId, toUserId, message } = req.body;

    if (!tripId || !toUserId) {
      return res.status(400).json({ success: false, message: 'Trip ID and recipient user ID are required.' });
    }

    if (String(toUserId) === String(req.user._id)) {
      return res.status(400).json({ success: false, message: 'You cannot invite yourself.' });
    }

    const trip = await Trip.findById(tripId);
    if (!trip) return res.status(404).json({ success: false, message: 'Trip not found.' });

    // Check if requester is organizer or member
    const isMember = String(trip.organizer) === String(req.user._id) ||
      trip.members.some((m) => String(m.user?._id || m.user) === String(req.user._id));
    if (!isMember) {
      return res.status(403).json({ success: false, message: 'You must be a member or organizer to invite others.' });
    }

    // Check if target is already in the trip
    const targetIsMember = String(trip.organizer) === String(toUserId) ||
      trip.members.some((m) => String(m.user?._id || m.user) === String(toUserId));
    if (targetIsMember) {
      return res.status(400).json({ success: false, message: 'This traveler is already in the trip.' });
    }


    // Check if trip is full
    if (trip.members.length >= trip.groupSize) {
      return res.status(400).json({ success: false, message: 'This trip is already full.' });
    }

    // Check if invitation already pending
    const existing = await TripInvitation.findOne({
      trip: tripId,
      toUser: toUserId,
      status: 'pending'
    });
    if (existing) {
      return res.status(400).json({ success: false, message: 'An invitation is already pending for this traveler.' });
    }

    const invitation = await TripInvitation.create({
      trip: tripId,
      fromUser: req.user._id,
      toUser: toUserId,
      message: message || `Hey! Join me for an incredible trip to ${trip.destination}!`
    });

    // Send in-app notification
    await Notification.create({
      user: toUserId,
      sender: req.user._id,
      type: 'trip_invite',
      title: 'Trip Invitation!',
      message: `${req.user.fullName} invited you to join their trip to ${trip.destination}!`,
      link: `/trips/${tripId}`
    });

    res.status(201).json({
      success: true,
      message: 'Trip invitation sent successfully!',
      invitation
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Could not send invitation.', error: err.message });
  }
};

// GET /api/invitations/my - protected - get user invitations
const getMyInvitations = async (req, res) => {
  try {
    const received = await TripInvitation.find({ toUser: req.user._id })
      .populate('fromUser', 'fullName city profileImage travelStyle verified')
      .populate({
        path: 'trip',
        populate: { path: 'organizer', select: 'fullName city profileImage' }
      })
      .sort({ createdAt: -1 });

    const sent = await TripInvitation.find({ fromUser: req.user._id })
      .populate('toUser', 'fullName city profileImage travelStyle verified')
      .populate('trip', 'title destination startDate budget')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      received,
      sent,
      pendingCount: received.filter((inv) => inv.status === 'pending').length
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Could not fetch invitations.', error: err.message });
  }
};

// PUT /api/invitations/:id/respond - protected - accept or reject
const respondToInvitation = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Status must be "accepted" or "rejected".' });
    }

    const invitation = await TripInvitation.findById(req.params.id);
    if (!invitation) return res.status(404).json({ success: false, message: 'Invitation not found.' });

    if (String(invitation.toUser) !== String(req.user._id)) {
      return res.status(403).json({ success: false, message: 'You can only respond to invitations sent to you.' });
    }

    invitation.status = status;
    await invitation.save();

    // If accepted, add user to trip members
    if (status === 'accepted') {
      const trip = await Trip.findById(invitation.trip);
      if (trip && trip.status === 'active') {
        const alreadyIn = trip.members.some((m) => String(m.user) === String(req.user._id));
        if (!alreadyIn && trip.members.length < trip.groupSize) {
          trip.members.push({
            user: req.user._id,
            role: 'member',
            joinedAt: new Date()
          });
          await trip.save();
        }
      }

      // Notify the inviter
      await Notification.create({
        user: invitation.fromUser,
        sender: req.user._id,
        type: 'invite_accepted',
        title: 'Invitation Accepted!',
        message: `${req.user.fullName} accepted your invitation to join the trip!`,
        link: `/trips/${invitation.trip}`
      });
    }

    res.json({
      success: true,
      message: `Invitation ${status} successfully.`,
      invitation
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Could not update invitation.', error: err.message });
  }
};

module.exports = { sendInvitation, getMyInvitations, respondToInvitation };

const User = require('../models/User');
const Trip = require('../models/Trip');
const BuddyRequest = require('../models/BuddyRequest');
const Notification = require('../models/Notification');

// Dynamic Travel Buddy Matching Engine
const matchBuddies = async (req, res) => {
  try {
    const {
      destination,
      fromCity,
      startDate,
      endDate,
      flexibleDates,
      budgetLevel,
      travelStyle,
      interests = [],
      groupPreference,
      adventureLevel
    } = req.body;

    const currentUserId = req.user ? req.user._id : null;

    // 1. Fetch potential buddy users from MongoDB (exclude current user)
    const userQuery = currentUserId ? { _id: { $ne: currentUserId } } : {};
    const allUsers = await User.find(userQuery).select(
      'fullName email phone city bio profileImage travelStyle interests budgetLevel adventureLevel accommodationPref transportPref groupPreference destinationsVisited bucketList verified socialLinks createdAt'
    );

    // 2. Fetch active trips to see who is travelling where
    const activeTrips = await Trip.find({ status: 'active' }).populate('organizer', 'fullName city profileImage');

    const searchInterests = Array.isArray(interests) ? interests : interests ? [interests] : [];
    const searchDest = (destination || '').trim().toLowerCase();
    const searchCity = (fromCity || '').trim().toLowerCase();

    // 3. Score each user dynamically
    const scoredUsers = [];

    for (const user of allUsers) {
      let score = 0;
      const matchReasons = [];
      const commonInterests = [];

      // Find if this user has any active trip to the destination
      const userTrips = activeTrips.filter(
        (t) => String(t.organizer?._id) === String(user._id) || t.members?.some((m) => String(m.user) === String(user._id))
      );

      // --- FACTOR 1: Destination (30%) ---
      let destScore = 0;
      if (searchDest) {
        const hasTripToDest = userTrips.some(
          (t) => t.destination?.toLowerCase().includes(searchDest) || t.toCity?.toLowerCase().includes(searchDest)
        );
        const inBucketList = (user.bucketList || []).some((d) => d.toLowerCase().includes(searchDest));
        const hasVisited = (user.destinationsVisited || []).some((d) => d.toLowerCase().includes(searchDest));

        if (hasTripToDest) {
          destScore = 30;
          matchReasons.push(`Heading to ${destination} on an active trip`);
        } else if (inBucketList) {
          destScore = 26;
          matchReasons.push(`Has ${destination} on their bucket list`);
        } else if (hasVisited) {
          destScore = 18;
          matchReasons.push(`Previously explored ${destination}`);
        } else {
          destScore = 8;
        }
      } else {
        // If no destination specified, baseline match
        destScore = 20;
      }
      score += destScore;

      // --- FACTOR 2: Travel Dates (20%) ---
      let dateScore = 0;
      if (startDate) {
        const targetDate = new Date(startDate);
        const hasMatchingTripDate = userTrips.some((t) => {
          const tDate = new Date(t.startDate);
          const diffDays = Math.abs(tDate - targetDate) / (1000 * 60 * 60 * 24);
          return diffDays <= 7;
        });

        if (hasMatchingTripDate) {
          dateScore = 20;
          matchReasons.push('Travelling around the exact same dates');
        } else if (flexibleDates) {
          dateScore = 15;
          matchReasons.push('Flexible travel dates');
        } else {
          dateScore = 8;
        }
      } else {
        dateScore = 15;
      }
      score += dateScore;

      // --- FACTOR 3: Interests Overlap (20%) ---
      let interestScore = 0;
      const userInterests = user.interests || [];
      if (searchInterests.length > 0) {
        userInterests.forEach((item) => {
          if (searchInterests.some((si) => si.toLowerCase() === item.toLowerCase())) {
            commonInterests.push(item);
          }
        });

        const overlapRatio = commonInterests.length / Math.max(searchInterests.length, 1);
        interestScore = Math.min(20, Math.round(overlapRatio * 20));

        if (commonInterests.length > 0) {
          matchReasons.push(`${commonInterests.length} shared interest${commonInterests.length > 1 ? 's' : ''} (${commonInterests.slice(0, 3).join(', ')})`);
        }
      } else {
        interestScore = 12;
      }
      score += interestScore;

      // --- FACTOR 4: Budget Tier (10%) ---
      let budgetScore = 0;
      if (budgetLevel) {
        if (user.budgetLevel?.toLowerCase() === budgetLevel.toLowerCase()) {
          budgetScore = 10;
          matchReasons.push(`Matching ${user.budgetLevel} budget tier`);
        } else {
          budgetScore = 5;
        }
      } else {
        budgetScore = 8;
      }
      score += budgetScore;

      // --- FACTOR 5: Travel Style (10%) ---
      let styleScore = 0;
      if (travelStyle) {
        if (user.travelStyle?.toLowerCase() === travelStyle.toLowerCase()) {
          styleScore = 10;
          matchReasons.push(`Shared travel style: ${user.travelStyle}`);
        } else {
          // Check complementary styles
          const compPairs = [
            ['Backpacker', 'Solo Explorer'],
            ['Roadtripper', 'Adventure'],
            ['Cultural', 'Spiritual'],
            ['Weekend Escaper', 'Backpacker']
          ];
          const isComp = compPairs.some(
            ([a, b]) =>
              (travelStyle === a && user.travelStyle === b) ||
              (travelStyle === b && user.travelStyle === a)
          );
          styleScore = isComp ? 7 : 4;
        }
      } else {
        styleScore = 7;
      }
      score += styleScore;

      // --- FACTOR 6: Starting City / Location (5%) ---
      let locScore = 0;
      if (searchCity && user.city?.toLowerCase() === searchCity) {
        locScore = 5;
        matchReasons.push(`Both departing from ${user.city}`);
      } else {
        locScore = 2;
      }
      score += locScore;

      // --- FACTOR 7: Group Preference & Adventure Pace (5%) ---
      let paceScore = 0;
      if (groupPreference && user.groupPreference === groupPreference) {
        paceScore += 3;
      } else {
        paceScore += 1;
      }
      if (adventureLevel && user.adventureLevel === adventureLevel) {
        paceScore += 2;
      } else {
        paceScore += 1;
      }
      score += paceScore;

      // Cap score cleanly between 45% and 98% based on real data
      const finalScore = Math.min(98, Math.max(45, Math.round(score)));

      // Check live connection state if logged in
      let connectionStatus = 'none';
      let existingRequestId = null;

      if (currentUserId) {
        const reqSent = await BuddyRequest.findOne({
          fromUser: currentUserId,
          toUser: user._id,
          status: { $in: ['pending', 'accepted'] }
        });
        const reqReceived = await BuddyRequest.findOne({
          fromUser: user._id,
          toUser: currentUserId,
          status: { $in: ['pending', 'accepted'] }
        });

        if (reqSent?.status === 'accepted' || reqReceived?.status === 'accepted') {
          connectionStatus = 'connected';
        } else if (reqSent) {
          connectionStatus = 'pending_sent';
          existingRequestId = reqSent._id;
        } else if (reqReceived) {
          connectionStatus = 'pending_received';
          existingRequestId = reqReceived._id;
        }
      }

      scoredUsers.push({
        user: {
          _id: user._id,
          fullName: user.fullName,
          city: user.city,
          bio: user.bio,
          profileImage: user.profileImage,
          travelStyle: user.travelStyle,
          interests: user.interests,
          budgetLevel: user.budgetLevel,
          adventureLevel: user.adventureLevel,
          accommodationPref: user.accommodationPref,
          transportPref: user.transportPref,
          bucketList: user.bucketList,
          destinationsVisited: user.destinationsVisited,
          verified: user.verified
        },
        compatibility: finalScore,
        matchReasons,
        commonInterests,
        upcomingTrips: userTrips.slice(0, 2),
        connectionStatus,
        requestId: existingRequestId
      });
    }

    // Sort by compatibility descending
    scoredUsers.sort((a, b) => b.compatibility - a.compatibility);

    res.json({
      success: true,
      count: scoredUsers.length,
      matches: scoredUsers,
      buddies: scoredUsers,
      appliedFilters: {
        destination,
        fromCity,
        startDate,
        budgetLevel,
        travelStyle,
        interests: searchInterests
      }
    });
  } catch (err) {
    console.error('Match error:', err);
    res.status(500).json({ success: false, message: 'Could not run buddy matching.', error: err.message });
  }
};

// POST /api/buddies/connect - protected - send a buddy connect request
const sendBuddyRequest = async (req, res) => {
  try {
    const { toUserId, recipientId, tripId, destination, message } = req.body;
    const targetUserId = toUserId || recipientId;

    if (!targetUserId) {
      return res.status(400).json({ success: false, message: 'Target user ID is required.' });
    }
    if (String(targetUserId) === String(req.user._id)) {
      return res.status(400).json({ success: false, message: 'You cannot connect with yourself.' });
    }

    // Check if target user exists
    const targetUser = await User.findById(targetUserId);
    if (!targetUser) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    // Check existing request
    const existing = await BuddyRequest.findOne({
      $or: [
        { fromUser: req.user._id, toUser: targetUserId },
        { fromUser: targetUserId, toUser: req.user._id }
      ]
    });

    if (existing) {
      if (existing.status === 'accepted') {
        return res.status(400).json({ success: false, message: 'You are already connected with this traveler.' });
      }
      if (existing.status === 'pending') {
        return res.status(400).json({ success: false, message: 'A connect request is already pending between you two.' });
      }
    }

    const request = await BuddyRequest.create({
      fromUser: req.user._id,
      toUser: toUserId,
      trip: tripId || null,
      destination: destination || '',
      message: message || 'Hi! Let\'s connect and travel India together!'
    });

    // Create real in-app notification for recipient
    await Notification.create({
      user: toUserId,
      sender: req.user._id,
      type: 'buddy_request',
      title: 'New Travel Buddy Request',
      message: `${req.user.fullName} sent you a travel buddy connect request.`,
      link: '/buddy-requests'
    });

    res.status(201).json({
      success: true,
      message: 'Buddy connect request sent successfully!',
      request
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Could not send connect request.', error: err.message });
  }
};

// GET /api/buddies/requests - protected - get received and sent requests
const getMyBuddyRequests = async (req, res) => {
  try {
    const received = await BuddyRequest.find({ toUser: req.user._id })
      .populate('fromUser', 'fullName city profileImage travelStyle interests bio verified')
      .populate('trip', 'title destination startDate')
      .sort({ createdAt: -1 });

    const sent = await BuddyRequest.find({ fromUser: req.user._id })
      .populate('toUser', 'fullName city profileImage travelStyle interests bio verified')
      .populate('trip', 'title destination startDate')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      received,
      sent,
      pendingCount: received.filter((r) => r.status === 'pending').length
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Could not fetch buddy requests.', error: err.message });
  }
};

// PUT /api/buddies/requests/:id - protected - accept or reject a request
const respondToBuddyRequest = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Status must be "accepted" or "rejected".' });
    }

    const request = await BuddyRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found.' });
    }
    if (String(request.toUser) !== String(req.user._id)) {
      return res.status(403).json({ success: false, message: 'You can only respond to requests sent to you.' });
    }

    request.status = status;
    await request.save();

    // If accepted, notify the requester
    if (status === 'accepted') {
      await Notification.create({
        user: request.fromUser,
        sender: req.user._id,
        type: 'buddy_accepted',
        title: 'Buddy Request Accepted!',
        message: `${req.user.fullName} accepted your travel buddy connect request. You are now connected!`,
        link: '/buddies'
      });
    }

    res.json({
      success: true,
      message: `Request ${status} successfully.`,
      request
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Could not update request.', error: err.message });
  }
};

// GET /api/buddies/connected - protected - get all connected travel buddies
const getConnectedBuddies = async (req, res) => {
  try {
    const requests = await BuddyRequest.find({
      $or: [{ fromUser: req.user._id }, { toUser: req.user._id }],
      status: 'accepted'
    })
      .populate('fromUser', 'fullName city bio profileImage travelStyle interests bucketList verified')
      .populate('toUser', 'fullName city bio profileImage travelStyle interests bucketList verified');

    const connectedUsers = requests.map((r) => {
      const buddy = String(r.fromUser._id) === String(req.user._id) ? r.toUser : r.fromUser;
      return {
        ...buddy.toObject(),
        connectedSince: r.updatedAt
      };
    });

    // Deduplicate
    const unique = Array.from(new Map(connectedUsers.map((u) => [String(u._id), u])).values());

    res.json({ success: true, count: unique.length, buddies: unique });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Could not fetch connected buddies.', error: err.message });
  }
};

// GET /api/buddies/status/:userId - protected - check relationship with another user
const getBuddyStatus = async (req, res) => {
  try {
    const targetUserId = req.params.userId;
    if (String(targetUserId) === String(req.user._id)) {
      return res.json({ success: true, status: 'self' });
    }

    const reqSent = await BuddyRequest.findOne({ fromUser: req.user._id, toUser: targetUserId });
    const reqReceived = await BuddyRequest.findOne({ fromUser: targetUserId, toUser: req.user._id });

    if (reqSent?.status === 'accepted' || reqReceived?.status === 'accepted') {
      return res.json({ success: true, status: 'connected' });
    }
    if (reqSent && reqSent.status === 'pending') {
      return res.json({ success: true, status: 'pending_sent', requestId: reqSent._id });
    }
    if (reqReceived && reqReceived.status === 'pending') {
      return res.json({ success: true, status: 'pending_received', requestId: reqReceived._id });
    }

    res.json({ success: true, status: 'none' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Could not check status.', error: err.message });
  }
};

module.exports = {
  matchBuddies,
  sendBuddyRequest,
  getMyBuddyRequests,
  respondToBuddyRequest,
  getConnectedBuddies,
  getBuddyStatus
};

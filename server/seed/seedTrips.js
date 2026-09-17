function getTrips(users, daysFromNow) {
  const [admin, arjun, riya, vikram, ananya, kabir, meera, rohan] = users;

  return [
    {
      title: 'Spiti Valley High Mountain Circuit & Monasteries',
      destination: 'Spiti Valley, Himachal Pradesh',
      fromCity: 'Chandigarh',
      toCity: 'Kaza',
      startDate: daysFromNow(14),
      endDate: daysFromNow(22),
      duration: '8 Days / 7 Nights',
      budget: 18500,
      travelStyle: 'Adventure',
      interests: ['Mountains', 'Road Trips', 'Photography', 'Camping', 'Trekking'],
      groupSize: 8,
      organizer: arjun._id,
      members: [
        { user: arjun._id, role: 'organizer', joinedAt: new Date() },
        { user: kabir._id, role: 'member', joinedAt: new Date() }
      ],
      description: 'An epic road trip from Chandigarh across Kinnaur into Spiti Valley. We will camp by the turquoise Chandratal Lake, visit the ancient 1,000-year-old Tabo monastery, send postcards from Hikkim, and cross the breathtaking Kunzum Pass. Sharing an SUV and homestays to split costs.',
      itinerary: [
        { day: 1, title: 'Chandigarh to Kalpa', activity: 'Drive through Hindustan-Tibet Highway with views of Kinner Kailash peak.' },
        { day: 2, title: 'Kalpa to Nako & Tabo', activity: 'Explore 996 AD Tabo monastery murals and Nako sacred lake.' },
        { day: 3, title: 'Tabo to Dhankar & Kaza', activity: 'Cliff-edge Dhankar gompa hike and entry into Spiti capital Kaza.' },
        { day: 4, title: 'Key Monastery, Kibber & Chicham', activity: 'Iconic pyramid gompa and crossing Asia highest suspension bridge.' },
        { day: 5, title: 'Highest Villages: Hikkim, Komic, Langza', activity: 'Postcard from highest post office and marine fossil search.' },
        { day: 6, title: 'Kaza to Chandratal via Kunzum La', activity: 'Cross 14,931 ft Kunzum Pass and setup camp by Moon Lake.' },
        { day: 7, title: 'Chandratal to Manali', activity: 'Navigate Rohtang Pass into lush Kullu Valley.' },
        { day: 8, title: 'Manali to Chandigarh departure', activity: 'Return drive with fond memories and farewell lunch.' }
      ],
      meetingPoint: 'Chandigarh Sector 17 ISBT at 06:00 AM',
      images: [
        'https://images.unsplash.com/photo-1578592080911-2902377f49c4?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1596701062351-8c2c14d1fdd0?auto=format&fit=crop&w=800&q=80'
      ],
      tags: ['spiti', 'roadtrip', 'himalayas', 'camping', 'monasteries'],
      status: 'active'
    },
    {
      title: 'Meghalaya Living Root Bridges & Waterfalls Expedition',
      destination: 'Meghalaya',
      fromCity: 'Guwahati',
      toCity: 'Cherrapunji & Dawki',
      startDate: daysFromNow(20),
      endDate: daysFromNow(26),
      duration: '6 Days / 5 Nights',
      budget: 15200,
      travelStyle: 'Solo Explorer',
      interests: ['Trekking', 'Mountains', 'Photography', 'Culture', 'Wildlife'],
      groupSize: 6,
      organizer: riya._id,
      members: [
        { user: riya._id, role: 'organizer', joinedAt: new Date() },
        { user: ananya._id, role: 'member', joinedAt: new Date() }
      ],
      description: 'Join our small group as we trek deep into the Khasi rainforest to the Double Decker Root Bridge in Nongriat, swim in the crystal blue natural pools of Krang Shuri, and row glass-bottom boats on the Umngot River in Dawki.',
      itinerary: [
        { day: 1, title: 'Guwahati to Shillong', activity: 'Meet at Guwahati airport, drive to Umiam Lake and vibrant Police Bazar.' },
        { day: 2, title: 'Shillong to Cherrapunji', activity: 'Visit Wei Sawdong tiered waterfalls and dramatic Nohkalikai plunge.' },
        { day: 3, title: 'Nongriat Root Bridge Trek', activity: 'Descend 3,500 steps to Double Decker bridge and natural Rainbow Falls.' },
        { day: 4, title: 'Sohra to Mawlynnong & Dawki', activity: 'Explore cleanest village in Asia and boat on crystal Umngot river.' },
        { day: 5, title: 'Dawki to Krang Shuri & Jowai', activity: 'Swim in the aquamarine waterfall lagoons of Jaintia Hills.' },
        { day: 6, title: 'Return to Guwahati', activity: 'Drop-off at Guwahati airport for afternoon flights.' }
      ],
      meetingPoint: 'Guwahati Airport Arrivals (GAU) at 10:30 AM',
      images: [
        'https://images.unsplash.com/photo-1605649487212-47bdab064df8?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1598463131751-e73703c19e59?auto=format&fit=crop&w=800&q=80'
      ],
      tags: ['meghalaya', 'waterfalls', 'rootbridges', 'northeast', 'trekking'],
      status: 'active'
    },
    {
      title: 'Ladakh High Altitude Motorbike & Stargazing Odyssey',
      destination: 'Ladakh',
      fromCity: 'Leh',
      toCity: 'Pangong & Nubra',
      startDate: daysFromNow(30),
      endDate: daysFromNow(38),
      duration: '8 Days / 7 Nights',
      budget: 28000,
      travelStyle: 'Adventure',
      interests: ['Mountains', 'Road Trips', 'Photography', 'Camping', 'Trekking'],
      groupSize: 10,
      organizer: vikram._id,
      members: [
        { user: vikram._id, role: 'organizer', joinedAt: new Date() },
        { user: arjun._id, role: 'member', joinedAt: new Date() },
        { user: rohan._id, role: 'member', joinedAt: new Date() }
      ],
      description: 'Ride across Khardung La and Chang La passes! We will experience the dramatic sand dunes of Hunder with Bactrian camels, stargaze in the high altitude clear skies of Nubra, camp on the shores of Pangong Tso, and visit ancient clifftop monasteries.',
      itinerary: [
        { day: 1, title: 'Leh Acclimatization', activity: 'Rest day to adjust to 11,500 ft elevation. Sunset at Shanti Stupa.' },
        { day: 2, title: 'Leh Monasteries Circuit', activity: 'Thiksey, Shey Palace, and Hemis monastery culture tour.' },
        { day: 3, title: 'Leh to Nubra Valley via Khardung La', activity: 'Conquer the 17,982 ft pass and ride into Nubra Valley.' },
        { day: 4, title: 'Turtuk Border Village Excursion', activity: 'Visit the northernmost village of India in Baltistan territory.' },
        { day: 5, title: 'Nubra to Pangong Tso via Shyok River', activity: 'Off-road ride along river gorge reaching the 134 km long lake.' },
        { day: 6, title: 'Pangong Sunrise to Hanle', activity: 'Witness sunrise over Pangong and ride to Hanle observatory.' },
        { day: 7, title: 'Hanle to Leh via hot springs', activity: 'Scenic return journey across Indus river plains.' },
        { day: 8, title: 'Farewell Leh', activity: 'Souvenir shopping at Leh market and departure.' }
      ],
      meetingPoint: 'Leh Main Bazaar Coffee Shop at 09:00 AM',
      images: [
        'https://images.unsplash.com/photo-1506461883276-594a12b11cf3?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=800&q=80'
      ],
      tags: ['ladakh', 'motorbiking', 'pangong', 'himalayas', 'adventure'],
      status: 'active'
    },
    {
      title: 'South Goa Secret Beaches & Portuguese Heritage Trail',
      destination: 'Goa',
      fromCity: 'Goa (Mopa Airport)',
      toCity: 'Palolem & Agonda',
      startDate: daysFromNow(10),
      endDate: daysFromNow(15),
      duration: '5 Days / 4 Nights',
      budget: 12500,
      travelStyle: 'Backpacker',
      interests: ['Beaches', 'Food', 'Culture', 'Nightlife', 'Photography'],
      groupSize: 6,
      organizer: kabir._id,
      members: [
        { user: kabir._id, role: 'organizer', joinedAt: new Date() },
        { user: meera._id, role: 'member', joinedAt: new Date() }
      ],
      description: 'Explore pristine South Goa. We will kayak through mangrove backwaters, hike to hidden Cola beach lagoon, savor freshly caught coastal seafood, and photograph Portuguese colonial mansions in Fontainhas.',
      itinerary: [
        { day: 1, title: 'Arrival & Agonda Beach Sunset', activity: 'Check in to beach huts in Agonda and enjoy sunset beach walk.' },
        { day: 2, title: 'Cola Lagoon & Cabo de Rama Fort', activity: 'Hike to sweet water lagoon and watch cliffs of Cabo de Rama.' },
        { day: 3, title: 'Palolem Kayaking & Butterfly Beach', activity: 'Morning dolphin watching and sea kayaking to hidden cove.' },
        { day: 4, title: 'Fontainhas & Old Goa Heritage', activity: 'Day trip to colorful Latin Quarter and Basilica of Bom Jesus.' },
        { day: 5, title: 'Departure with Beach Brunch', activity: 'Lazy breakfast by the waves before heading to airport.' }
      ],
      meetingPoint: 'Agonda Beach Central Shack at 02:00 PM',
      images: [
        'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'
      ],
      tags: ['goa', 'beaches', 'southgoa', 'heritage', 'kayaking'],
      status: 'active'
    },
    {
      title: 'Varanasi Sacred River, Dawn Boats & Spiritual Immersion',
      destination: 'Varanasi',
      fromCity: 'Delhi',
      toCity: 'Varanasi',
      startDate: daysFromNow(18),
      endDate: daysFromNow(22),
      duration: '4 Days / 3 Nights',
      budget: 8500,
      travelStyle: 'Cultural',
      interests: ['Culture', 'Spiritual', 'Heritage', 'Photography', 'Food'],
      groupSize: 5,
      organizer: ananya._id,
      members: [
        { user: ananya._id, role: 'organizer', joinedAt: new Date() }
      ],
      description: 'Experience the spiritual heart of India. We will take wooden boat rides at dawn across all 84 ghats, attend the mesmerizing evening Ganga Aarti, and explore centuries-old music schools.',
      itinerary: [
        { day: 1, title: 'Arrival & Evening Aarti', activity: 'Check in near Assi Ghat. Watch grand brass-lamp Aarti from boat.' },
        { day: 2, title: 'Dawn Ghat Cruise', activity: 'Sunrise rowboat and walk through silk weaver quarters.' },
        { day: 3, title: 'Sarnath Excursion', activity: 'Visit Deer Park where Buddha preached.' },
        { day: 4, title: 'Departure', activity: 'Morning walk from Assi to Dashashwamedh, then airport transfer.' }
      ],
      meetingPoint: 'Assi Ghat Steps at 04:00 PM',
      images: [
        'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1571536802807-30451e3955d8?auto=format&fit=crop&w=800&q=80'
      ],
      tags: ['varanasi', 'spiritual', 'heritage', 'ganga', 'culture'],
      status: 'active'
    }
  ];
}

module.exports = { getTrips };

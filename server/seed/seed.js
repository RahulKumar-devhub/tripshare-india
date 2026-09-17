require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const connectDB = require('../config/db');

const User = require('../models/User');
const Trip = require('../models/Trip');
const Destination = require('../models/Destination');
const Stay = require('../models/Stay');
const Event = require('../models/Event');
const Booking = require('../models/Booking');
const Expense = require('../models/Expense');
const BuddyRequest = require('../models/BuddyRequest');
const TravelStory = require('../models/TravelStory');
const Notification = require('../models/Notification');
const Message = require('../models/Message');

const { getUsers } = require('./seedUsers');
const { getDestinations } = require('./seedDestinations');
const { getTrips } = require('./seedTrips');
const seedStays = require('./seedStays');
const seedExperiences = require('./seedExperiences');

const daysFromNow = (n) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d;
};

const run = async () => {
  await connectDB();
  console.log('Clearing database collections for clean seed...');
  await Promise.all([
    User.deleteMany({}),
    Trip.deleteMany({}),
    Destination.deleteMany({}),
    Stay.deleteMany({}),
    Event.deleteMany({}),
    Booking.deleteMany({}),
    Expense.deleteMany({}),
    BuddyRequest.deleteMany({}),
    TravelStory.deleteMany({}),
    Notification.deleteMany({}),
    Message.deleteMany({})
  ]);

  // 1. Seed Users
  const usersData = await getUsers();
  const createdUsers = await User.insertMany(usersData);
  console.log(`Successfully seeded ${createdUsers.length} verified traveler profiles.`);

  const [admin, arjun, riya, vikram, ananya, kabir, meera, rohan] = createdUsers;

  // 2. Seed Destinations
  const destinationsData = getDestinations();
  const createdDestinations = await Destination.insertMany(destinationsData);
  console.log(`Successfully seeded ${createdDestinations.length} iconic Indian destinations.`);

  // 3. Seed Stays
  const createdStays = await seedStays();

  // 4. Seed Experiences
  const createdExperiences = await seedExperiences(admin);

  // 5. Seed Trips
  const tripsData = getTrips(createdUsers, daysFromNow);
  const createdTrips = await Trip.insertMany(tripsData);
  console.log(`Successfully seeded ${createdTrips.length} active Indian trips.`);

  // 6. Seed Buddy Requests
  const buddyRequestsData = [
    {
      fromUser: arjun._id,
      toUser: kabir._id,
      destination: 'Spiti Valley',
      message: 'Hey Kabir! Saw you love high-altitude camping. Want to travel together to Spiti?',
      status: 'accepted'
    },
    {
      fromUser: riya._id,
      toUser: ananya._id,
      destination: 'Meghalaya',
      message: 'Hi Ananya! Loved your photography. Would love to explore the living root bridges together!',
      status: 'accepted'
    },
    {
      fromUser: vikram._id,
      toUser: arjun._id,
      destination: 'Ladakh',
      message: 'Hey Arjun! Let us ride across Khardung La together.',
      status: 'accepted'
    },
    {
      fromUser: rohan._id,
      toUser: admin._id,
      destination: 'Rajasthan',
      message: 'Hey! Planning a Thar desert roadtrip, would be awesome to connect!',
      status: 'pending'
    },
    {
      fromUser: meera._id,
      toUser: admin._id,
      destination: 'Goa',
      message: 'Hi! Heading to South Goa for coastal photography. Let us connect!',
      status: 'accepted'
    }
  ];
  await BuddyRequest.insertMany(buddyRequestsData);
  console.log('Successfully seeded buddy connections.');

  // 7. Seed Sample Persistent Messages between connected buddies
  const sampleMessages = [
    {
      sender: meera._id,
      recipient: admin._id,
      text: 'Hey! Are you still planning the South Goa coastal photography trip this weekend?',
      read: true,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
    },
    {
      sender: admin._id,
      recipient: meera._id,
      text: 'Yes absolutely! I have booked a boutique stay in Vagator and checking out the kayaking estuary.',
      read: true,
      createdAt: new Date(Date.now() - 90 * 60 * 1000)
    },
    {
      sender: meera._id,
      recipient: admin._id,
      text: 'Sounds amazing! Can I join you for the sunset paddle? I have got my drone packed.',
      read: false,
      createdAt: new Date(Date.now() - 30 * 60 * 1000)
    },
    {
      sender: arjun._id,
      recipient: kabir._id,
      text: 'Hey Kabir, got the sleeping bags serviced for Spiti!',
      read: true,
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000)
    }
  ];
  await Message.insertMany(sampleMessages);
  console.log('Successfully seeded persistent travel chat messages.');

  // 8. Seed Sample Bookings
  const sampleBookings = [
    {
      bookingReference: 'TSI-782914',
      user: admin._id,
      bookingType: 'experience',
      event: createdExperiences[0]._id, // Hampta Pass
      quantity: 2,
      checkInDate: createdExperiences[0].date,
      guests: { adults: 2, children: 0 },
      addOns: [{ title: 'Trekking Pole & Gaiter Rental', price: 600 }],
      customerInfo: {
        fullName: admin.fullName,
        email: admin.email,
        phone: admin.phone,
        specialRequests: 'Need vegetarian meal preference'
      },
      priceBreakdown: {
        basePrice: 19600,
        taxes: 2352,
        serviceFee: 980,
        discount: 0,
        addOnsTotal: 600,
        totalAmount: 23532
      },
      totalAmount: 23532,
      paymentMethod: 'sandbox_payment',
      paymentStatus: 'completed',
      status: 'confirmed'
    },
    {
      bookingReference: 'TSI-491028',
      user: admin._id,
      bookingType: 'stay',
      stay: createdStays[0]._id, // Whispering Pines Manali
      stayRoomType: 'Cedar Valley View Suite',
      quantity: 1,
      checkInDate: daysFromNow(12),
      checkOutDate: daysFromNow(15),
      guests: { adults: 2, children: 0 },
      addOns: [{ title: 'Airport / Volvo Cab Transfer', price: 1200 }],
      customerInfo: {
        fullName: admin.fullName,
        email: admin.email,
        phone: admin.phone,
        specialRequests: 'Upper floor room requested'
      },
      priceBreakdown: {
        basePrice: 14400,
        taxes: 1728,
        serviceFee: 720,
        discount: 500,
        addOnsTotal: 1200,
        totalAmount: 17548
      },
      totalAmount: 17548,
      paymentMethod: 'sandbox_payment',
      paymentStatus: 'completed',
      status: 'confirmed'
    },
    {
      bookingReference: 'TSI-903182',
      user: arjun._id,
      bookingType: 'experience',
      event: createdExperiences[1]._id, // Spiti Stargazing
      quantity: 1,
      checkInDate: createdExperiences[1].date,
      guests: { adults: 1, children: 0 },
      customerInfo: {
        fullName: arjun.fullName,
        email: arjun.email,
        phone: arjun.phone
      },
      totalAmount: 14500,
      paymentMethod: 'sandbox_payment',
      paymentStatus: 'completed',
      status: 'confirmed'
    }
  ];
  await Booking.insertMany(sampleBookings);
  console.log('Successfully seeded real multi-step bookings.');

  // 9. Seed Sample Group Expenses & Splits
  const sampleTrip = createdTrips[0];
  const sampleExpenses = [
    {
      user: admin._id,
      trip: sampleTrip._id,
      category: 'Hotel',
      description: 'Cottage stay booking for group in Old Manali',
      amount: 12000,
      paidBy: 'Admin User',
      date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      participants: [
        { name: 'Admin User', share: 4000 },
        { name: 'Arjun Sen', share: 4000 },
        { name: 'Vikram Malhotra', share: 4000 }
      ],
      total: 12000,
      people: 3,
      perPerson: 4000
    },
    {
      user: admin._id,
      trip: sampleTrip._id,
      category: 'Transport',
      description: '4x4 Gypsy fuel & Rohtang Pass permit',
      amount: 6000,
      paidBy: 'Arjun Sen',
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      participants: [
        { name: 'Admin User', share: 2000 },
        { name: 'Arjun Sen', share: 2000 },
        { name: 'Vikram Malhotra', share: 2000 }
      ],
      total: 6000,
      people: 3,
      perPerson: 2000
    },
    {
      user: admin._id,
      trip: sampleTrip._id,
      category: 'Food',
      description: 'Dinner at Café 1947 with local trout & craft drinks',
      amount: 3600,
      paidBy: 'Vikram Malhotra',
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      participants: [
        { name: 'Admin User', share: 1200 },
        { name: 'Arjun Sen', share: 1200 },
        { name: 'Vikram Malhotra', share: 1200 }
      ],
      total: 3600,
      people: 3,
      perPerson: 1200
    }
  ];
  await Expense.insertMany(sampleExpenses);
  console.log('Successfully seeded group expenses and split records.');

  // 10. Seed Travel Stories
  const storiesData = [
    {
      author: arjun._id,
      title: 'Crossing Kunzum La: 10 Days in the High Altitude Desert of Spiti',
      destination: 'Spiti Valley',
      coverImage: 'https://images.unsplash.com/photo-1578592080911-2902377f49c4?auto=format&fit=crop&w=1200&q=80',
      excerpt: 'When the engine roars at 15,000 feet and all that separates you from the abyss is a ribbon of loose gravel, you truly understand Indian travel.',
      content: 'Spiti is not merely a destination; it is an endurance test and a spiritual elevation rolled into one. Starting from Chandigarh, the transition from humid plains to apple orchards in Kinnaur, and then abruptly into the lunar wasteland of Spiti, is sublime. We camped beside Chandratal under a moonless sky where the Milky Way cast an actual shadow on the water. In Hikkim, we sat with the postmaster drinking salty butter tea while stamping postcards. Traveling with fellow riders found on TripShare made sharing vehicle costs and repairs effortless!',
      tripDuration: '10 Days',
      budgetSpent: 21000,
      travelStyle: 'Adventure',
      likes: [riya._id, vikram._id, kabir._id, admin._id],
      comments: [
        {
          user: riya._id,
          text: 'The photo at Chandratal is breathtaking! Adding Spiti to my bucket list right now.',
          createdAt: new Date()
        },
        {
          user: kabir._id,
          text: 'Best expedition ever! Can not wait to do Zanskar with you next year Arjun.',
          createdAt: new Date()
        }
      ],
      tags: ['spiti', 'himalayas', 'biking', 'adventure']
    },
    {
      author: riya._id,
      title: 'Walking into the Clouds: The Living Root Bridges of Nongriat',
      destination: 'Meghalaya',
      coverImage: 'https://images.unsplash.com/photo-1605649487212-47bdab064df8?auto=format&fit=crop&w=1200&q=80',
      excerpt: 'Descending 3,500 stone steps through dripping rainforest to stand upon a bridge grown from living Ficus roots over 200 years.',
      content: 'I undertook the trek to Nongriat with a travel buddy I met right here on TripShare India. The descent into the gorge was humid and steep, but every step was rewarded with cascading waterfalls, iron suspension bridges swinging over turquoise torrents, and the warm smiles of Khasi village children. The Double Decker bridge is pure organic genius. Sitting on the roots while small fish nibbled at our feet in the river pool washed away all city fatigue.',
      tripDuration: '6 Days',
      budgetSpent: 14500,
      travelStyle: 'Solo Explorer',
      likes: [arjun._id, ananya._id, meera._id],
      comments: [
        {
          user: ananya._id,
          text: 'Such inspiring writing Riya! The botanical architecture of Khasi bridges is incredible.',
          createdAt: new Date()
        }
      ],
      tags: ['meghalaya', 'nongriat', 'rootbridges', 'rainforest']
    }
  ];
  await TravelStory.insertMany(storiesData);
  console.log('Successfully seeded community travel stories.');

  // 11. Seed In-App Notifications
  await Notification.create([
    {
      user: admin._id,
      sender: meera._id,
      type: 'buddy_accepted',
      title: 'Connection Accepted',
      message: 'Meera Nambiar accepted your travel buddy request! You can now message her.',
      link: '/connections'
    },
    {
      user: admin._id,
      sender: rohan._id,
      type: 'buddy_request',
      title: 'New Travel Buddy Request',
      message: 'Rohan Kapoor sent you a travel buddy connect request for Rajasthan.',
      link: '/connections'
    },
    {
      user: admin._id,
      type: 'general',
      title: 'Booking Confirmed (#TSI-782914)',
      message: 'Your booking for Hampta Pass Alpine Trek is confirmed. Download your voucher.',
      link: '/bookings'
    }
  ]);
  console.log('Successfully seeded notifications.');

  console.log('TripShare India Seed completed with 100% database persistence!');
  await mongoose.connection.close();
  process.exit(0);
};

run().catch((err) => {
  console.error('Seed error:', err);
  process.exit(1);
});

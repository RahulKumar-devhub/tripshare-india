const Stay = require('../models/Stay');

const seedStays = async () => {
  const staysData = [
    {
      name: 'The Whispering Pines Alpine Chalet',
      slug: 'whispering-pines-manali',
      destination: 'Manali',
      state: 'Himachal Pradesh',
      city: 'Manali',
      propertyType: 'Resort',
      rating: 4.8,
      reviewCount: 142,
      pricePerNight: 4800,
      taxPercentage: 12,
      heroImage: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80'
      ],
      description: 'Nestled amidst whispering cedar forests overlooking snow-capped Pir Panjal peaks, this stone-and-timber mountain retreat features cozy wood fireplaces, panoramic private balconies, and authentic Himachali hospitality.',
      amenities: ['Wi-Fi', 'Free Breakfast', 'Mountain View', 'Bonfire & BBQ', 'Parking', 'Heating', 'Restaurant', 'Spa'],
      roomTypes: [
        {
          title: 'Cedar Valley View Suite',
          capacity: 2,
          pricePerNight: 4800,
          bedType: '1 King Bed',
          size: '380 sq.ft',
          features: ['Private Balcony', 'Forest View', 'Fireplace', 'En-suite bath with tub']
        },
        {
          title: 'Himalayan Family Loft',
          capacity: 4,
          pricePerNight: 7500,
          bedType: '2 Queen Beds',
          size: '540 sq.ft',
          features: ['Mountain Panorama', 'Attic Sitting Area', 'Heated Flooring', 'Free Breakfast']
        }
      ],
      rules: ['Check-in after 14:00', 'Quiet hours from 22:00', 'Pets allowed on request'],
      address: 'Log Huts Area, Old Manali, Himachal Pradesh 175131',
      coordinates: { lat: 32.253, lng: 77.175 },
      distanceFromCenter: '1.2 km from Mall Road',
      featured: true,
      reviews: [
        {
          userName: 'Arjun Sen',
          rating: 5,
          comment: 'Waking up to the Pir Panjal peaks from the balcony with steaming kahwa was unmatched. Staff was incredibly courteous.',
          date: new Date()
        }
      ]
    },
    {
      name: 'Zostel Riverside Backpacker Hub',
      slug: 'zostel-riverside-manali',
      destination: 'Manali',
      state: 'Himachal Pradesh',
      city: 'Manali',
      propertyType: 'Hostel',
      rating: 4.6,
      reviewCount: 310,
      pricePerNight: 1200,
      taxPercentage: 12,
      heroImage: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1200&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80'
      ],
      description: 'Perched right beside the roaring Manalsu River in Old Manali. A thriving community space for solo nomads, trekkers, and digital creators with superfast fiber internet, rooftop café, and nightly acoustic jams.',
      amenities: ['Wi-Fi', 'Café', 'River View', 'Locker', 'Co-working Area', 'Games Lounge', 'Bonfire'],
      roomTypes: [
        {
          title: '6-Bed Mixed Riverfront Dorm',
          capacity: 1,
          pricePerNight: 1200,
          bedType: '1 Bunk Bed',
          size: '300 sq.ft',
          features: ['River Soundscape', 'Individual Reading Light & Socket', 'Secure Locker']
        },
        {
          title: 'Private Deluxe Mountain Room',
          capacity: 2,
          pricePerNight: 2800,
          bedType: '1 Double Bed',
          size: '260 sq.ft',
          features: ['Private Balcony', 'High-speed Wi-Fi', 'Work Desk']
        }
      ],
      rules: ['Valid Govt ID required', '18+ only in dorms', 'No loud music after 23:00'],
      address: 'Manu Temple Road, Old Manali, Himachal Pradesh 175131',
      coordinates: { lat: 32.258, lng: 77.172 },
      distanceFromCenter: '1.8 km from Mall Road',
      featured: false,
      reviews: [
        {
          userName: 'Riya Sharma',
          rating: 5,
          comment: 'Met 4 other travellers here and ended up doing the Bhrigu Lake trek together! The vibes are authentic.',
          date: new Date()
        }
      ]
    },
    {
      name: 'Casa Vagator Boutique Coastal Villa',
      slug: 'casa-vagator-goa',
      destination: 'Goa',
      state: 'Goa',
      city: 'Vagator',
      propertyType: 'Villa',
      rating: 4.9,
      reviewCount: 98,
      pricePerNight: 8500,
      taxPercentage: 18,
      heroImage: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80'
      ],
      description: 'Perched on the red laterite cliff of Little Vagator overlooking the Arabian Sea. Portuguese-influenced architecture with private plunge pool, open-air sun decks, curated cocktail service, and direct trail to the beach.',
      amenities: ['Wi-Fi', 'Swimming Pool', 'Sea View', 'Air Conditioning', 'Free Breakfast', 'Bar & Lounge', 'Parking'],
      roomTypes: [
        {
          title: 'Ocean Horizon Luxury Suite',
          capacity: 2,
          pricePerNight: 8500,
          bedType: '1 King Bed',
          size: '480 sq.ft',
          features: ['Direct Sea View', 'Private Plunge Pool', 'Rain Shower', 'Sunset Deck']
        }
      ],
      rules: ['No glass by the pool', 'Check-in 14:00', 'Pets allowed with prior deposit'],
      address: 'Cliff Edge, Ozran Beach Road, Vagator, Goa 403509',
      coordinates: { lat: 15.597, lng: 73.738 },
      distanceFromCenter: '400m from Vagator Beach',
      featured: true,
      reviews: [
        {
          userName: 'Vikram Malhotra',
          rating: 5,
          comment: 'Best sunset in North Goa hands down. Sitting in the plunge pool watching the sun melt into the Arabian sea was magical.',
          date: new Date()
        }
      ]
    },
    {
      name: 'Samode Haveli Heritage Palace',
      slug: 'samode-haveli-jaipur',
      destination: 'Jaipur',
      state: 'Rajasthan',
      city: 'Jaipur',
      propertyType: 'Hotel',
      rating: 4.9,
      reviewCount: 185,
      pricePerNight: 7200,
      taxPercentage: 18,
      heroImage: 'https://images.unsplash.com/photo-1590073242678-70ee3fc28e8e?auto=format&fit=crop&w=1200&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1590073242678-70ee3fc28e8e?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80'
      ],
      description: 'An intimate 175-year-old Rajput aristocratic mansion situated within the walled Pink City. Meticulously restored with hand-painted frescoes, fountains, a Moorish swimming pool, and verdant courtyards.',
      amenities: ['Wi-Fi', 'Swimming Pool', 'Heritage Architecture', 'Restaurant', 'Spa', 'Air Conditioning', 'Free Breakfast'],
      roomTypes: [
        {
          title: 'Royal Deluxe Heritage Chamber',
          capacity: 2,
          pricePerNight: 7200,
          bedType: '1 Four-Poster King Bed',
          size: '420 sq.ft',
          features: ['Courtyard View', 'Antique Rajput Furnishings', 'Marble Bathroom']
        }
      ],
      rules: ['Heritage preservation rules apply', 'Check-in 14:00', 'Check-out 11:00'],
      address: 'Gangapole, Old City, Jaipur, Rajasthan 302002',
      coordinates: { lat: 26.931, lng: 75.834 },
      distanceFromCenter: '1.5 km from Hawa Mahal',
      featured: true,
      reviews: [
        {
          userName: 'Ananya Roy',
          rating: 5,
          comment: 'Living like royalty. The evening flute performance in the courtyard by the fountain was pure poetry.',
          date: new Date()
        }
      ]
    },
    {
      name: 'Lake Pichola Water Heritage Retreat',
      slug: 'lake-pichola-retreat-udaipur',
      destination: 'Udaipur',
      state: 'Rajasthan',
      city: 'Udaipur',
      propertyType: 'Resort',
      rating: 4.8,
      reviewCount: 220,
      pricePerNight: 6400,
      taxPercentage: 18,
      heroImage: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1200&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80'
      ],
      description: 'Positioned right on the tranquil banks of Lake Pichola directly facing the majestic City Palace and Jag Mandir. Rooftop candlelight dining overlooking illuminated palace reflections.',
      amenities: ['Wi-Fi', 'Lake View', 'Rooftop Dining', 'Boat Transfers', 'Air Conditioning', 'Free Breakfast', 'Spa'],
      roomTypes: [
        {
          title: 'Palace View Jharokha Room',
          capacity: 2,
          pricePerNight: 6400,
          bedType: '1 King Bed',
          size: '390 sq.ft',
          features: ['Traditional Window Seat (Jharokha)', 'Direct Palace Reflection View', 'Heritage Bathtub']
        }
      ],
      rules: ['Check-in 13:00', 'Check-out 11:00'],
      address: 'Ambrai Ghat Road, Chandpole, Udaipur, Rajasthan 313001',
      coordinates: { lat: 24.581, lng: 73.682 },
      distanceFromCenter: 'Waterfront beside City Palace',
      featured: true,
      reviews: [
        {
          userName: 'Kabir Joshi',
          rating: 5,
          comment: 'Dinner on the rooftop with City Palace glowing right in front across the lake is a core memory.',
          date: new Date()
        }
      ]
    },
    {
      name: 'Pangong High Altitude Glamping Yurt',
      slug: 'pangong-glamping-leh',
      destination: 'Leh',
      state: 'Ladakh',
      city: 'Leh',
      propertyType: 'Camp',
      rating: 4.7,
      reviewCount: 88,
      pricePerNight: 5200,
      taxPercentage: 12,
      heroImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80'
      ],
      description: 'Insulated luxury domes and yurts stationed at 14,270 ft, 500 meters from the crystalline sapphire shores of Pangong Lake. Equipped with oxygen backup, heated bedding, and unobstructed views of the Milky Way.',
      amenities: ['Oxygen Support', 'Heated Bedding', 'Stargazing Telescope', 'Buffet Meals', 'Bonfire', 'Power Backup', 'Free Breakfast'],
      roomTypes: [
        {
          title: 'Celestial Stargazing Dome',
          capacity: 2,
          pricePerNight: 5200,
          bedType: '1 Queen Bed',
          size: '320 sq.ft',
          features: ['Transparent Skylight Window', 'Thermal Bed Warmers', 'Attached Western Washroom']
        }
      ],
      rules: ['Acclimatization of at least 48 hours in Leh required', 'Strict plastic-free zone'],
      address: 'Spangmik Village, Pangong Tso, Ladakh 194201',
      coordinates: { lat: 33.759, lng: 78.438 },
      distanceFromCenter: '500m from Pangong Lake Shore',
      featured: true,
      reviews: [
        {
          userName: 'Meera Nambiar',
          rating: 5,
          comment: 'The night sky is unbelievable. You can clearly trace the entire spiral of the Milky Way right above your tent.',
          date: new Date()
        }
      ]
    },
    {
      name: 'Ganga Kinare Riverside Yoga Sanctuary',
      slug: 'ganga-kinare-rishikesh',
      destination: 'Rishikesh',
      state: 'Uttarakhand',
      city: 'Rishikesh',
      propertyType: 'Resort',
      rating: 4.8,
      reviewCount: 260,
      pricePerNight: 4200,
      taxPercentage: 12,
      heroImage: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=1200&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80'
      ],
      description: 'Situated on the private quiet ghat of the holy Ganges. Features sunrise guided meditation sessions, Ayurvedic wellness spas, pure sattvic organic cuisine, and private evening Ganga Aarti ceremonies.',
      amenities: ['Wi-Fi', 'Yoga Deck', 'Ganga View', 'Ayurvedic Spa', 'Pure Vegetarian Restaurant', 'Air Conditioning', 'Free Breakfast'],
      roomTypes: [
        {
          title: 'Riverfront Meditation Suite',
          capacity: 2,
          pricePerNight: 4200,
          bedType: '1 King Bed',
          size: '340 sq.ft',
          features: ['Direct River Facing', 'Yoga Mats Provided', 'Ganga Soundscape']
        }
      ],
      rules: ['Pure vegetarian and alcohol-free premises', 'Check-in 14:00'],
      address: '23 Barrage Road, Mayakund, Rishikesh, Uttarakhand 249201',
      coordinates: { lat: 30.103, lng: 78.294 },
      distanceFromCenter: 'Direct access to private Ganga Ghat',
      featured: true,
      reviews: [
        {
          userName: 'Rohan Verma',
          rating: 5,
          comment: 'Practicing morning yoga as the mist lifted over the river was a life-changing peaceful experience.',
          date: new Date()
        }
      ]
    },
    {
      name: 'Tea Valley Cloud Haven Estate',
      slug: 'tea-valley-munnar-kerala',
      destination: 'Kerala',
      state: 'Kerala',
      city: 'Munnar',
      propertyType: 'Homestay',
      rating: 4.9,
      reviewCount: 115,
      pricePerNight: 3900,
      taxPercentage: 12,
      heroImage: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=1200&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80'
      ],
      description: 'An organic 25-acre functioning tea and cardamom plantation homestay high in the Western Ghats. Wake up wrapped in morning clouds, enjoy home-cooked Kerala sadhya, and hike through private spice trails.',
      amenities: ['Wi-Fi', 'Tea Plantation View', 'Home Cooked Meals', 'Spice Garden Tour', 'Bonfire', 'Parking', 'Free Breakfast'],
      roomTypes: [
        {
          title: 'Cloud Canopy Planters Cottage',
          capacity: 2,
          pricePerNight: 3900,
          bedType: '1 King Bed',
          size: '360 sq.ft',
          features: ['Panoramic Tea Garden View', 'Verandah with rocking chairs', 'Fresh estate tea station']
        }
      ],
      rules: ['Respect plantation ecosystem', 'Check-in 13:00'],
      address: 'Pothamedu Viewpoint Road, Munnar, Kerala 685612',
      coordinates: { lat: 10.088, lng: 77.059 },
      distanceFromCenter: '4.5 km from Munnar Town',
      featured: false,
      reviews: [
        {
          userName: 'Priya Nair',
          rating: 5,
          comment: 'Hosts treated us like family. Drinking fresh garden cardamom tea while mist rolled over the valley was bliss.',
          date: new Date()
        }
      ]
    }
  ];

  await Stay.deleteMany({});
  const inserted = await Stay.insertMany(staysData);
  console.log(`Seeded ${inserted.length} stays successfully.`);
  return inserted;
};

module.exports = seedStays;

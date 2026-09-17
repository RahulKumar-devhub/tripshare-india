const Event = require('../models/Event');

const seedExperiences = async (adminUser) => {
  const adminId = adminUser ? adminUser._id : null;
  const experiences = [
    {
      title: 'Hampta Pass & Chandratal High-Altitude Alpine Trek',
      description: 'The dramatic crossover trek from lush green valleys of Kullu to the stark barren moonscape of Lahaul and Spiti. Cross Hampta Pass at 14,035 ft, traverse glacial moraines, and pitch tents beside the crescent moon-shaped Chandratal lake.',
      city: 'Manali',
      venue: 'Jobra Base Camp, Prini, Manali',
      date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      time: '06:30',
      category: 'Trekking',
      price: 9800,
      rating: 4.9,
      reviewCount: 168,
      totalSeats: 16,
      availableSeats: 7,
      image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80'
      ],
      organiser: 'Himalayan Highs Mountaineering Collective',
      tags: ['trekking', 'manali', 'hamptapass', 'chandratal', 'himalayas'],
      duration: '5 Days / 4 Nights',
      ageLimit: '14+ years',
      difficulty: 'Moderate',
      amenities: ['Alpine Tents', 'High-Altitude Sleeping Bags', 'All Meals & Snacks', 'Oxygen Cylinder & First Aid'],
      facilities: ['Campsite Washrooms', 'Trek Leader Certified', 'Cook & Porter Support', 'Luggage Offloading'],
      highlights: [
        'Ascend from alpine meadows to 14,035 ft pass',
        'Stargaze beside crystalline Chandratal lake',
        'Crossover from lush Kullu valley to arid Spiti'
      ],
      included: [
        'Professional Wilderness First Responder certified trek leader',
        'High-altitude alpine dome tents (twin sharing)',
        'Nutritious hot vegetarian meals throughout trek',
        'Microspikes and gaiters if snow encountered'
      ],
      excluded: [
        'Transport from your home city to Manali base',
        'Personal trekking gear (boots, backpack, warm layers)',
        'Travel & medical insurance'
      ],
      itineraryTimeline: [
        { day: 1, title: 'Drive Manali to Jobra (9,800 ft) & Trek to Chika (10,100 ft)', description: 'Scenic drive through 42 hairpin bends followed by a gentle 2-hour pine forest hike along Rani Nallah.' },
        { day: 2, title: 'Chika to Balu Ka Ghera (11,900 ft)', description: 'Trek across boulder fields, river crossings, and colorful wildflower meadows.' },
        { day: 3, title: 'Balu Ka Ghera to Hampta Pass (14,035 ft) & descend to Shea Goru (12,900 ft)', description: 'Summit day with 360-degree views of Mt. Indrasan and Deotibba.' },
        { day: 4, title: 'Shea Goru to Chatru (11,000 ft) & Drive to Chandratal Lake', description: 'Cross icy stream, descent into Spiti valley, drive to moon lake.' },
        { day: 5, title: 'Chatru to Manali via Atal Tunnel', description: 'Drive back to Old Manali by late afternoon.' }
      ],
      cancellationPolicy: 'Free cancellation up to 7 days before departure. 50% refund between 7 to 3 days.',
      safetyTips: [
        'Keep well-hydrated; drink 4 liters of water daily',
        'Do not skip acclimatization briefing',
        'Carry Diamox or consult doctor regarding AMS'
      ],
      venueType: 'Outdoor',
      createdBy: adminId
    },
    {
      title: 'Spiti Celestial Stargazing & Milky Way Photography Camp',
      description: 'Spend 6 nights beneath one of the darkest skies on Earth. Pitch base in Hikkim (home to highest post office), Langza (fossil village), and Kaza. Master long-exposure astrophotography with professional landscape astronomers.',
      city: 'Kaza, Spiti',
      venue: 'Langza High Plateau, Spiti Valley',
      date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      time: '19:00',
      category: 'Camping',
      price: 14500,
      rating: 5.0,
      reviewCount: 92,
      totalSeats: 12,
      availableSeats: 4,
      image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=1200&q=80'
      ],
      organiser: 'AstroNomads India',
      tags: ['spiti', 'astrophotography', 'camping', 'stargazing', 'milkyway'],
      duration: '6 Days / 5 Nights',
      ageLimit: '16+ years',
      difficulty: 'Moderate',
      amenities: ['Telescope Station (10-inch Dobsonian)', 'Heated Tents', 'Astrophotography Tripods Provided', 'Warm Tibetan Butter Tea'],
      facilities: ['Solar Power Bank Stations', 'Homestay Backups in Case of Weather', 'Oxygen Concentrator'],
      highlights: [
        'Observe Saturn rings and Orion Nebula via 10-inch Dobsonian telescope',
        'Shoot the Milky Way core arching over the Golden Buddha of Langza',
        'Send hand-stamped postcards from Hikkim at 14,567 ft'
      ],
      included: ['Guided night astrophotography workshops', 'All 4x4 transfers within Spiti', 'Traditional local homestay and dome camps', 'All meals'],
      excluded: ['Flights/trains to Shimla or Manali', 'Personal mirrorless camera & wide lens'],
      itineraryTimeline: [
        { day: 1, title: 'Arrival in Kaza (12,470 ft) & Rest', description: 'Acclimatization, hydration, evening photography gear check.' },
        { day: 2, title: 'Langza Fossil Village & Sunset shoot', description: 'Setting up tracking mounts near the iconic Buddha statue.' },
        { day: 3, title: 'Hikkim & Komic Stargazing Night', description: 'Deep sky imaging at 15,000 ft with zero light pollution.' },
        { day: 4, title: 'Ki Monastery & Kibber Wildlife Sanctuary', description: 'Snow leopard tracking trails by day, star trails by night.' },
        { day: 5, title: 'Chandratal Lake Astrophotography camp', description: 'Reflections of the galactic core in still high-altitude water.' },
        { day: 6, title: 'Departure to Manali', description: 'Journey back via Kunzum La pass.' }
      ],
      cancellationPolicy: 'Full refund up to 10 days before expedition start.',
      safetyTips: ['Thermal base layers (rated down to -10°C) strictly necessary', 'Use red headlamp only during night shoots to preserve night vision'],
      venueType: 'Outdoor',
      createdBy: adminId
    },
    {
      title: 'Varanasi Dawn Awakening: Subah-e-Banaras Ghats & Sacred Alleys',
      description: 'Experience Varanasi before sunrise when the holy river mist rises and Vedic chants echo across centuries-old stone steps. Board a traditional wooden rowboat, witness morning cremation rituals from a respectful distance at Manikarnika, and savor piping hot malaiyo in secret alleys.',
      city: 'Varanasi',
      venue: 'Assi Ghat Stone Steps, Varanasi',
      date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      time: '05:15',
      category: 'Spiritual',
      price: 1899,
      rating: 4.9,
      reviewCount: 340,
      totalSeats: 20,
      availableSeats: 9,
      image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1200&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=1200&q=80'
      ],
      organiser: 'Kashi Cultural Foundation',
      tags: ['varanasi', 'spiritual', 'heritage', 'boatride', 'culture'],
      duration: '4 Hours',
      ageLimit: 'All ages',
      difficulty: 'Easy',
      amenities: ['Private Wooden Boat', 'Vedic Historian Guide', 'Kullhad Chai & Kachori', 'Flower Diyas for River Offering'],
      facilities: ['Life Jackets Provided', 'Microphone Audio Tour System', 'Hand Sanitizer'],
      highlights: [
        'Exclusive dawn wooden boat cruise past 84 sacred ghats',
        'Subah-e-Banaras morning raga flute performance at Assi Ghat',
        'Secret lane walk through 300-year-old wrestling akharas'
      ],
      included: ['Private boat charter', 'Licensed cultural historian', 'Breakfast of Banarasi kachori, jalebi and masala chai', 'Floating flower offerings'],
      excluded: ['Personal tips and donations at temples'],
      itineraryTimeline: [
        { day: 1, title: '05:15 AM - Assi Ghat Gathering', description: 'Listen to Vedic morning mantras and witness classical sunrise aarti.' },
        { day: 1, title: '06:00 AM - Rowboat Odyssey across 84 Ghats', description: 'Glide past Harishchandra, Dashashwamedh, and Manikarnika Ghats.' },
        { day: 1, title: '07:30 AM - Winding Gali Walk & Heritage Breakfast', description: 'Navigate ancient labyrinthine lanes for fresh kachori, lassi, and silk weavers workshops.' }
      ],
      cancellationPolicy: 'Free cancellation up to 24 hours in advance.',
      safetyTips: ['Wear comfortable slip-on walking shoes', 'Maintain cultural reverence and no photography directly pointing at cremation fires'],
      venueType: 'Outdoor',
      createdBy: adminId
    },
    {
      title: 'Goa Hidden Estuary Kayaking & Bioluminescence Night Paddle',
      description: 'Paddle through the silence of dense Chapora and Sal backwaters where lush mangrove canopies form natural cathedrals. As dusk falls, watch sparkling blue bioluminescent plankton illuminate every stroke of your paddle.',
      city: 'Goa',
      venue: 'Morjim Estuary Pier, North Goa',
      date: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
      time: '16:45',
      category: 'Beach Activities',
      price: 2499,
      rating: 4.8,
      reviewCount: 215,
      totalSeats: 14,
      availableSeats: 6,
      image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80'
      ],
      organiser: 'Konkan Ocean Explorers',
      tags: ['goa', 'kayaking', 'bioluminescence', 'watersports', 'mangroves'],
      duration: '3.5 Hours',
      ageLimit: '10+ years',
      difficulty: 'Easy',
      amenities: ['Perception Touring Kayaks', 'Carbon Fiber Paddles', 'Dry Bags for Phones', 'Headlamps with Red Night Mode'],
      facilities: ['Shower & Changing Rooms', 'Certified Lifeguard Escort', 'Waterproof GoPros for Group Photos'],
      highlights: [
        'Glide silently under mangrove arches with exotic kingfishers',
        'Watch the sunset melt over the Chapora estuary sandbar',
        'Observe glowing blue bioluminescent trails in dark lagoon waters'
      ],
      included: ['Single/Tandem sit-inside kayak', 'CE-certified lifejacket', 'Cold tender coconut water', 'Digital photo pack'],
      excluded: ['Transport to Morjim pier'],
      itineraryTimeline: [
        { day: 1, title: '04:45 PM - Safety briefing & launch', description: 'Learn basic strokes, dry bag check, paddle into mangrove creek.' },
        { day: 1, title: '06:15 PM - Estuary sandbar sunset break', description: 'Rest on secluded sandbar with fresh coconuts watching sunset.' },
        { day: 1, title: '07:15 PM - Bioluminescent night glide', description: 'Turn off lights and stroke water to trigger vibrant blue glitter glow.' }
      ],
      cancellationPolicy: '100% refund if cancelled due to bad weather or tide conditions.',
      safetyTips: ['Non-swimmers welcome; life jackets mandatory at all times', 'Wear quick-drying clothes and water shoes'],
      venueType: 'Outdoor',
      createdBy: adminId
    },
    {
      title: 'Rishikesh Grade IV White Water Rafting & Cliff Jump Expedition',
      description: 'Conquer the legendary roaring rapids of the holy Ganges: Roller Coaster, Golf Course, Clubhouse, and Three Blind Mice. A high-octane 26 km journey from Marine Drive down to Rishikesh with an adrenaline-pumping 30-foot cliff jump.',
      city: 'Rishikesh',
      venue: 'Marine Drive Rafting Point, Rishikesh',
      date: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
      time: '08:30',
      category: 'Adventure',
      price: 2200,
      rating: 4.9,
      reviewCount: 420,
      totalSeats: 30,
      availableSeats: 11,
      image: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=1200&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=1200&q=80'
      ],
      organiser: 'Ganga White Water Collective',
      tags: ['rishikesh', 'rafting', 'adventure', 'cliffjumping', 'ganga'],
      duration: '5 Hours',
      ageLimit: '14+ to 55 years',
      difficulty: 'Challenging',
      amenities: ['Imported Self-Bailing Hyside Rafts', 'Class V Helmets & Lifejackets', 'Safety Kayaker Escort', 'Wetsuits in Winter'],
      facilities: ['Locker facilities for valuables', 'GoPro HD video recording option', 'Transport from Rishikesh to start point'],
      highlights: [
        'Tackle 9 major Grade III & IV rapids on the Ganges',
        'Leap from the iconic 30-foot cliff at Magpie rock into turquoise deep water',
        'Body surfing in calm river pools beneath the Himalayan foothills'
      ],
      included: ['26 km rafting expedition with licensed river guides', 'Safety kayaker accompaniment', 'Cliff jumping supervision', 'All safety gear'],
      excluded: ['GoPro video files (available at ₹500 on spot)'],
      itineraryTimeline: [
        { day: 1, title: '08:30 AM - Departure from Tapovan office to Marine Drive', description: 'Scenic drive along Badrinath highway to put-in point.' },
        { day: 1, title: '09:45 AM - River safety drill & command practice', description: 'Paddle forwards, backwards, hold rope, flip rescue drills.' },
        { day: 1, title: '10:30 AM to 01:30 PM - River expedition & cliff jump', description: 'Tackle the big rapids, cliff jump at halfway point, float past Lakshman Jhula.' }
      ],
      cancellationPolicy: 'Full refund up to 48 hours prior.',
      safetyTips: ['Listen strictly to your river guide commands: Forward, Back, Get Down!', 'Ensure life jacket buckles are tightly strapped'],
      venueType: 'Outdoor',
      createdBy: adminId
    },
    {
      title: 'Old Delhi Midnight Culinary Heritage Walk & Khari Baoli Spice Trail',
      description: 'An immersive nocturnal gastronomic voyage through the 400-year-old walled city of Shahjahanabad. Taste melt-in-the-mouth galouti kebabs, crispy jalebis fried in desi ghee, 100-year-old nihari, and ascend to a secret rooftop overlooking the illuminated Jama Masjid.',
      city: 'Delhi',
      venue: 'Jama Masjid Gate 3, Old Delhi',
      date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
      time: '19:30',
      category: 'Food Experiences',
      price: 1650,
      rating: 4.9,
      reviewCount: 280,
      totalSeats: 15,
      availableSeats: 5,
      image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80'
      ],
      organiser: 'Delhi Dawat Heritage Guild',
      tags: ['delhi', 'food', 'olddelhi', 'culinary', 'kebabs', 'streetfood'],
      duration: '3.5 Hours',
      ageLimit: 'All ages',
      difficulty: 'Easy',
      amenities: ['12+ Curated Food Tastings', 'Certified Food Historian Guide', 'Bottled Mineral Water', 'Sanitizing Wipes'],
      facilities: ['Rickshaw rides between distant alleyways', 'Private rooftop access with Jama Masjid view'],
      highlights: [
        '12 curated historic food tastings in shops operating since Mughal era',
        'Private rooftop vantage point for night views of Jama Masjid domes',
        'Smell sacks of Kashmiri saffron and star anise in Asia largest spice market'
      ],
      included: ['All food and beverage tastings', 'Cycle rickshaw rides', 'Heritage storytelling by culinary author'],
      excluded: ['Personal shopping purchases at spice market'],
      itineraryTimeline: [
        { day: 1, title: '07:30 PM - Meeting at Jama Masjid Gate 3', description: 'Brief history of Mughal culinary culture and royal kitchens.' },
        { day: 1, title: '08:00 PM - Matia Mahal & Kebab lane', description: 'Taste melt-in-mouth mutton seekh kebabs and butter chicken roti.' },
        { day: 1, title: '09:30 PM - Ballimaran & Chandni Chowk', description: ' Mirza Ghalib haveli stop, jalebi tasting, and Rabri Falooda.' }
      ],
      cancellationPolicy: 'Free cancellation up to 24 hours before.',
      safetyTips: ['Come with a completely empty stomach!', 'Comfortable walking shoes recommended'],
      venueType: 'Outdoor',
      createdBy: adminId
    }
  ];

  await Event.deleteMany({});
  const inserted = await Event.insertMany(experiences);
  console.log(`Seeded ${inserted.length} rich travel experiences successfully.`);
  return inserted;
};

module.exports = seedExperiences;

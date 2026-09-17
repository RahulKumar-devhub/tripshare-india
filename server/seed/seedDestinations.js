function getDestinations() {
  return [
    {
      name: 'Ladakh',
      slug: 'ladakh',
      state: 'Ladakh (UT)',
      tagLine: 'Land of High Passes & Azure Alpine Lakes',
      description: 'Cradled between the Great Himalayas and the Karakoram range, Ladakh offers surreal moonscapes, ancient Tibetan Buddhist gompas, crystalline lakes like Pangong Tso, and thrilling high-altitude motorable passes.',
      heroImage: 'https://images.unsplash.com/photo-1506461883276-594a12b11cf3?auto=format&fit=crop&w=1200&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1593181629936-11c609b8db9b?auto=format&fit=crop&w=800&q=80'
      ],
      category: 'Mountains',
      bestTimeToVisit: 'May to September',
      idealDuration: '7-10 Days',
      averageBudgetPerDay: 3200,
      highlights: ['Pangong Tso & Tso Moriri lakes', 'Khardung La pass at 17,982 ft', 'Thiksey & Hemis Monasteries', 'Nubra Valley sand dunes & double-humped camels'],
      experiences: [
        { title: 'Khardung La High Pass Ride', description: 'Drive across one of the highest motorable mountain roads in the world.', icon: 'Bike' },
        { title: 'Stargazing at Hanle', description: 'Experience zero-pollution night skies at India Dark Sky Reserve.', icon: 'Sparkles' }
      ],
      travelTips: ['Acclimatize for at least 48 hours in Leh before traveling to higher passes.', 'Carry postpaid BSNL/Jio SIM cards.'],
      coordinates: { lat: 34.1526, lng: 77.5771 },
      featured: true
    },
    {
      name: 'Spiti Valley',
      slug: 'spiti-valley',
      state: 'Himachal Pradesh',
      tagLine: 'The Middle Land Between Tibet and India',
      description: 'A cold mountain desert valley tucked away behind Rohtang and Kunzum passes. Spiti is renowned for fossil villages, thousand-year-old mud monasteries, turquoise rivers, and raw adventure.',
      heroImage: 'https://images.unsplash.com/photo-1578592080911-2902377f49c4?auto=format&fit=crop&w=1200&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1596701062351-8c2c14d1fdd0?auto=format&fit=crop&w=800&q=80'
      ],
      category: 'Offbeat',
      bestTimeToVisit: 'June to October',
      idealDuration: '8-10 Days',
      averageBudgetPerDay: 2400,
      highlights: ['Key Gompa pyramid monastery', 'Chicham Bridge — Asia highest suspension bridge', 'Postcard from Hikkim highest post office', 'Chandratal: The Moon Lake'],
      experiences: [
        { title: 'Chandratal Lake Camping', description: 'Camp under billions of stars beside the crescent-shaped turquoise lake.', icon: 'Tent' }
      ],
      travelTips: ['Hydrate relentlessly to counter altitude sickness.'],
      coordinates: { lat: 32.2461, lng: 78.0349 },
      featured: true
    },
    {
      name: 'Meghalaya',
      slug: 'meghalaya',
      state: 'Meghalaya',
      tagLine: 'Abode of Clouds & Living Root Bridges',
      description: 'The emerald jewel of Northeast India. Plunging waterfalls like Nohkalikai, crystal-clear Dawki river, and bio-engineered living root bridges grown over centuries by Khasi people.',
      heroImage: 'https://images.unsplash.com/photo-1605649487212-47bdab064df8?auto=format&fit=crop&w=1200&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1598463131751-e73703c19e59?auto=format&fit=crop&w=800&q=80'
      ],
      category: 'Mountains',
      bestTimeToVisit: 'September to May',
      idealDuration: '6-8 Days',
      averageBudgetPerDay: 2800,
      highlights: ['Double Decker Living Root Bridge in Nongriat', 'Umngot River at Dawki with transparent waters', 'Krang Shuri tier waterfalls'],
      experiences: [
        { title: 'Trek to Nongriat Root Bridge', description: 'Descend 3,500 stone steps into the subtropical rainforest gorge.', icon: 'Footprints' }
      ],
      travelTips: ['Carry good waterproof hiking boots with grip for wet rainforest trails.'],
      coordinates: { lat: 25.467, lng: 91.3662 },
      featured: true
    },
    {
      name: 'Goa',
      slug: 'goa',
      state: 'Goa',
      tagLine: 'Golden Sands, Portuguese Heritage & Bohemian Spirit',
      description: 'Beyond crowded commercial shores, Goa reveals secluded southern coves, emerald spice plantations, vibrant Latin quarters in Fontainhas, beach shacks, and water adventures.',
      heroImage: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'
      ],
      category: 'Beaches',
      bestTimeToVisit: 'November to March',
      idealDuration: '4-7 Days',
      averageBudgetPerDay: 2600,
      highlights: ['Cola beach secret lagoon & Palolem curve', 'Fontainhas colorful Portuguese heritage precinct', 'Dudhsagar multi-tiered jungle waterfalls'],
      experiences: [
        { title: 'South Goa Hidden Beach Hopping', description: 'Ride scooters along coastal palm tunnels to Butterfly and Cabo de Rama beaches.', icon: 'Compass' }
      ],
      travelTips: ['Rent a scooter for maximum flexibility.'],
      coordinates: { lat: 15.2993, lng: 74.124 },
      featured: true
    },
    {
      name: 'Varanasi',
      slug: 'varanasi',
      state: 'Uttar Pradesh',
      tagLine: 'The Eternal City of Light & Sacred River Ghats',
      description: 'One of the world oldest living cities. A sensory tapestry of ancient riverfront ghats, mystical evening Ganga Aarti with brass lamps, classical music heritage, and vibrant old lanes.',
      heroImage: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1200&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1571536802807-30451e3955d8?auto=format&fit=crop&w=800&q=80'
      ],
      category: 'Spiritual',
      bestTimeToVisit: 'October to March',
      idealDuration: '3-4 Days',
      averageBudgetPerDay: 1800,
      highlights: ['Grand Maha Aarti at Dashashwamedh Ghat', 'Sunrise wooden boat ride along the 84 ghats', 'Sarnath Buddhist pilgrimage', 'Banarasi silk weavers'],
      experiences: [
        { title: 'Subah-e-Banaras Boat Ride', description: 'Witness dawn break over Manikarnika and Assi ghats with flute music resonating over the river.', icon: 'Sunrise' }
      ],
      travelTips: ['Walk the entire ghat stretch from Assi to Rajghat at sunrise.'],
      coordinates: { lat: 25.3176, lng: 82.9739 },
      featured: true
    },
    {
      name: 'Jaipur & Udaipur',
      slug: 'rajasthan-heritage',
      state: 'Rajasthan',
      tagLine: 'Grand Forts, Lake Palaces & Desert Majesty',
      description: 'Step into royal Rajputana history. Marvel at pink sandstone palaces, hilltop fortresses like Amer and Mehrangarh, tranquil boat rides on Lake Pichola, and colorful bazaars.',
      heroImage: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1200&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?auto=format&fit=crop&w=800&q=80'
      ],
      category: 'Heritage',
      bestTimeToVisit: 'October to March',
      idealDuration: '6-8 Days',
      averageBudgetPerDay: 2900,
      highlights: ['Amer Fort & Jal Mahal in Jaipur', 'Lake Palace & City Palace in Udaipur', 'Sunset at Nahargarh Fort'],
      experiences: [
        { title: 'Heritage Night Walk in Old Jaipur', description: 'Explore hidden havelis and spice markets illuminated under heritage street lamps.', icon: 'Moon' }
      ],
      travelTips: ['Book composite heritage monument tickets online to skip queues.'],
      coordinates: { lat: 26.9124, lng: 75.7873 },
      featured: true
    }
  ];
}

module.exports = { getDestinations };

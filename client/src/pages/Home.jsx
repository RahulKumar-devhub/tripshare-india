import React, { useState, useEffect } from 'react';
import { 
  Compass, MapPin, Calendar, Sparkles, Users, ArrowRight, ShieldCheck, 
  TrendingUp, Heart, Search, Filter, Mountain, Waves, Landmark, TreePine, 
  ChevronRight, Star, ShieldAlert, Award, Footprints, MessageSquare, 
  BedDouble, Clock, Navigation, CheckCircle2, Shield, DollarSign
} from 'lucide-react';
import ThreeHeroGlobe, { DESTINATIONS, POPULAR_ROUTES } from '../components/ThreeHeroGlobe';
import SearchAutocomplete from '../components/SearchAutocomplete';
import { tripsAPI, destinationsAPI, buddiesAPI, storiesAPI, staysAPI, experiencesAPI, formatMoney } from '../services/api';

export default function Home({ 
  onOpenTripDetail, 
  onOpenCreateTrip, 
  onOpenAuth, 
  onOpenProfile, 
  onNavigate,
  onOpenBooking,
  onOpenDestinationDetail,
  onOpenExperienceDetail
}) {
  const [featuredTrips, setFeaturedTrips] = useState([]);
  const [featuredBuddies, setFeaturedBuddies] = useState([]);
  const [featuredDestinations, setFeaturedDestinations] = useState([]);
  const [featuredStays, setFeaturedStays] = useState([]);
  const [featuredExperiences, setFeaturedExperiences] = useState([]);
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Integrated Hero Search Panel State
  const [fromCity, setFromCity] = useState('Delhi');
  const [toCity, setToCity] = useState('Manali');
  const [travelDate, setTravelDate] = useState(
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [travellers, setTravellers] = useState(2);
  const [travelStyle, setTravelStyle] = useState('Adventure');

  // Interactive Smart Planner Day Preview State
  const [plannerActiveDay, setPlannerActiveDay] = useState(1);

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    setLoading(true);
    try {
      const [tripsRes, buddiesRes, destsRes, staysRes, expRes, storiesRes] = await Promise.allSettled([
        tripsAPI.getAll({ limit: 4 }),
        buddiesAPI.getRecommendations(),
        destinationsAPI.getAll(),
        staysAPI.getAll({ limit: 4 }),
        experiencesAPI.getAll({ limit: 4 }),
        storiesAPI.getAll({ limit: 2 })
      ]);

      if (tripsRes.status === 'fulfilled' && tripsRes.value.trips) setFeaturedTrips(tripsRes.value.trips.slice(0, 3));
      if (buddiesRes.status === 'fulfilled' && buddiesRes.value.buddies) setFeaturedBuddies(buddiesRes.value.buddies.slice(0, 3));
      if (destsRes.status === 'fulfilled' && destsRes.value.destinations) setFeaturedDestinations(destsRes.value.destinations.slice(0, 6));
      if (staysRes.status === 'fulfilled' && staysRes.value.stays) setFeaturedStays(staysRes.value.stays.slice(0, 4));
      if (expRes.status === 'fulfilled' && expRes.value.events) setFeaturedExperiences(expRes.value.events.slice(0, 4));
      if (storiesRes.status === 'fulfilled' && storiesRes.value.stories) setStories(storiesRes.value.stories.slice(0, 2));
    } catch (err) {
      console.error('Failed to load home data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Called when a route is clicked on the 3D globe
  const handleSelectRouteFromGlobe = (route) => {
    const fromDest = DESTINATIONS.find((d) => d.id === route.from);
    const toDest = DESTINATIONS.find((d) => d.id === route.to);
    if (fromDest) setFromCity(fromDest.name);
    if (toDest) setToCity(toDest.name);
  };

  // Called when a destination pin is clicked on the 3D globe
  const handleSelectDestinationFromGlobe = (dest) => {
    setToCity(dest.name);
  };

  const handleExecuteHeroSearch = (e) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate('explore', { 
        destination: toCity,
        fromCity,
        travelStyle
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#060910] text-white">
      {/* SECTION B: 3D CINEMATIC TRAVEL HERO */}
      <section className="relative pt-28 pb-16 overflow-hidden border-b border-white/5">
        {/* Ambient atmospheric backdrop */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[550px] bg-gradient-to-tr from-saffron-600/15 via-azure-500/10 to-transparent blur-[160px] rounded-full pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Hero Narrative & Integrated Search Panel */}
            <div className="lg:col-span-6 z-10">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold uppercase tracking-wider text-saffron-400 mb-5 backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5 text-saffron-400 animate-pulse" />
                <span>India's Co-Travel & Expedition Command Center</span>
              </div>

              <h1 className="text-4xl sm:text-6xl font-display font-extrabold tracking-tight leading-[1.08] mb-4">
                Travel Beyond <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-saffron-400 via-amber-300 to-azure-400">
                  Boundaries.
                </span>
              </h1>

              <p className="text-sm sm:text-base text-white/70 max-w-lg mb-6 leading-relaxed">
                Connect with verified travel companions, book boutique alpine stays and guided treks, and split group expenses seamlessly across India.
              </p>

              {/* Integrated Travel Search Panel */}
              <div className="bg-[#0c111d]/95 border border-white/15 backdrop-blur-xl p-5 rounded-3xl shadow-2xl space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-white/50 block">
                  Interactive Route Planner
                </span>

                <form onSubmit={handleExecuteHeroSearch} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="text-[11px] text-white/50 block mb-1">From</label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-saffron-400" />
                        <input
                          type="text"
                          value={fromCity}
                          onChange={(e) => setFromCity(e.target.value)}
                          placeholder="Departure City"
                          className="w-full pl-8 pr-3 py-2 bg-[#060910] border border-white/10 rounded-xl text-xs text-white placeholder-white/40 focus:border-saffron-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] text-white/50 block mb-1">To (Destination)</label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-azure-400" />
                        <input
                          type="text"
                          value={toCity}
                          onChange={(e) => setToCity(e.target.value)}
                          placeholder="Destination"
                          className="w-full pl-8 pr-3 py-2 bg-[#060910] border border-white/10 rounded-xl text-xs text-white placeholder-white/40 focus:border-azure-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <div>
                      <label className="text-[11px] text-white/50 block mb-1">Travel Dates</label>
                      <input
                        type="date"
                        value={travelDate}
                        onChange={(e) => setTravelDate(e.target.value)}
                        className="w-full px-3 py-2 bg-[#060910] border border-white/10 rounded-xl text-xs text-white focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] text-white/50 block mb-1">Explorers</label>
                      <select
                        value={travellers}
                        onChange={(e) => setTravellers(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-[#060910] border border-white/10 rounded-xl text-xs text-white focus:outline-none"
                      >
                        <option value={1}>1 Solo</option>
                        <option value={2}>2 Duo</option>
                        <option value={4}>4 Group</option>
                        <option value={6}>6+ Crew</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] text-white/50 block mb-1">Travel Style</label>
                      <select
                        value={travelStyle}
                        onChange={(e) => setTravelStyle(e.target.value)}
                        className="w-full px-3 py-2 bg-[#060910] border border-white/10 rounded-xl text-xs text-white focus:outline-none"
                      >
                        <option value="Adventure">Adventure</option>
                        <option value="Backpacker">Backpacker</option>
                        <option value="Cultural">Cultural</option>
                        <option value="Roadtripper">Roadtripper</option>
                        <option value="Luxury">Luxury</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center gap-3">
                    <button
                      type="submit"
                      className="flex-1 btn-saffron py-3 px-5 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 shadow-saffron"
                    >
                      <Search className="w-4 h-4" />
                      <span>Plan Your Trip to {toCity}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onNavigate && onNavigate('buddies', { destination: toCity })}
                      className="btn-outline py-3 px-4 rounded-2xl text-xs font-semibold flex items-center gap-1.5"
                    >
                      <Users className="w-4 h-4 text-saffron-400" />
                      <span>Find Buddy</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Right: 3D Interactive Three.js Globe Command Center */}
            <div className="lg:col-span-6">
              <ThreeHeroGlobe
                onSelectRoute={handleSelectRouteFromGlobe}
                onSelectDestination={handleSelectDestinationFromGlobe}
              />
            </div>
          </div>
        </div>
      </section>

      {/* SECTION C: LIVE TRAVEL NETWORK TELEMETRY */}
      <section className="py-10 border-b border-white/5 bg-[#080d17]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
              <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono block">18,400+</span>
              <span className="text-xs text-white/50">Active Explorers Across India</span>
            </div>

            <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
              <span className="text-2xl sm:text-3xl font-extrabold text-saffron-400 font-mono block">120+</span>
              <span className="text-xs text-white/50">Live Travel Corridors</span>
            </div>

            <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
              <span className="text-2xl sm:text-3xl font-extrabold text-azure-400 font-mono block">94.8%</span>
              <span className="text-xs text-white/50">Buddy Match Success Rate</span>
            </div>

            <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
              <span className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono block">100%</span>
              <span className="text-xs text-white/50">Government ID Verified Profiles</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION D: DESTINATION DISCOVERY */}
      <section className="py-20 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10 flex-wrap gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-saffron-400 block mb-1">
                Subcontinent Highlights
              </span>
              <h2 className="text-2xl sm:text-4xl font-display font-extrabold text-white">
                Iconic Destinations
              </h2>
            </div>

            <button
              onClick={() => onNavigate && onNavigate('destinations')}
              className="btn-outline text-xs py-2 px-4 rounded-xl flex items-center gap-1.5"
            >
              <span>View All 28 States</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredDestinations.map((dest) => (
              <div
                key={dest._id || dest.slug}
                onClick={() => onOpenDestinationDetail && onOpenDestinationDetail(dest.slug)}
                className="group relative h-80 rounded-3xl overflow-hidden cursor-pointer border border-white/10 shadow-2xl hover:border-saffron-500/50 transition-all duration-300 flex flex-col justify-end p-6"
              >
                <img
                  src={dest.heroImage}
                  alt={dest.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                <div className="relative z-10 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-saffron-500 text-white">
                      {dest.category}
                    </span>
                    <span className="text-xs font-bold text-white/80 font-mono">
                      Avg. {formatMoney(dest.averageBudgetPerDay || 2500)}/day
                    </span>
                  </div>

                  <h3 className="text-2xl font-display font-bold text-white group-hover:text-saffron-400 transition-colors">
                    {dest.name}
                  </h3>

                  <p className="text-xs text-white/70 line-clamp-2 leading-relaxed">
                    {dest.description}
                  </p>

                  <div className="flex items-center justify-between pt-2 text-xs text-white/60">
                    <span>{dest.idealDuration || '4-7 Days'}</span>
                    <span className="text-saffron-400 font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      <span>Explore</span>
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION E: CURATED EXPERIENCES */}
      <section className="py-20 border-b border-white/5 bg-[#080d17]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10 flex-wrap gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-azure-400 block mb-1">
                Handpicked Expeditions
              </span>
              <h2 className="text-2xl sm:text-4xl font-display font-extrabold text-white">
                Adventures, Treks & Cultural Immersions
              </h2>
            </div>

            <button
              onClick={() => onNavigate && onNavigate('explore')}
              className="btn-outline text-xs py-2 px-4 rounded-xl flex items-center gap-1.5"
            >
              <span>Explore All Activities</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredExperiences.map((exp) => (
              <div
                key={exp._id}
                className="group bg-[#0c111d] border border-white/10 rounded-2xl overflow-hidden shadow-xl flex flex-col justify-between hover:border-azure-500/40 transition-all"
              >
                <div>
                  <div className="relative h-44 overflow-hidden">
                    <img
                      src={exp.image}
                      alt={exp.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute bottom-3 left-3 px-2 py-0.5 rounded-full text-[10px] font-bold bg-black/60 backdrop-blur-md text-white border border-white/10">
                      {exp.category}
                    </span>
                  </div>

                  <div className="p-4 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-white/50">{exp.city}</span>
                      <div className="flex items-center gap-1 text-amber-400 font-bold">
                        <Star className="w-3 h-3 fill-amber-400" />
                        <span>{exp.rating}</span>
                      </div>
                    </div>

                    <h3 className="text-sm font-bold text-white line-clamp-1 group-hover:text-azure-400 transition-colors">
                      {exp.title}
                    </h3>

                    <p className="text-xs text-white/60 line-clamp-2">
                      {exp.description}
                    </p>
                  </div>
                </div>

                <div className="p-4 border-t border-white/5 bg-black/20 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-white/40 block">From</span>
                    <span className="text-base font-bold text-white font-mono">{formatMoney(exp.price)}</span>
                  </div>

                  <button
                    onClick={() => onOpenExperienceDetail ? onOpenExperienceDetail(exp._id) : (onOpenBooking && onOpenBooking(exp, 'experience'))}
                    className="btn-saffron text-xs py-1.5 px-3 rounded-xl font-semibold flex items-center gap-1"
                  >
                    <span>View & Book</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION F: TRAVEL BUDDY MATCHING SYSTEM */}
      <section className="py-20 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-wider">
                <Users className="w-3.5 h-3.5" />
                <span>Multi-Factor Compatibility Engine</span>
              </div>

              <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-white leading-tight">
                Never Travel Solo <br />
                <span className="text-saffron-400">Unless You Want To.</span>
              </h2>

              <p className="text-sm text-white/70 leading-relaxed">
                Our algorithm scores compatibility across travel styles, budget ranges, shared transit preferences, and bucket lists—pairing you with trustworthy explorers heading your way.
              </p>

              {/* Compatibility Weights Explainer */}
              <div className="p-5 bg-[#0c111d] border border-white/10 rounded-2xl space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-white/50 block">
                  Weighted Compatibility Breakdown
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 bg-white/5 rounded-xl flex items-center justify-between">
                    <span className="text-white/70">Route & Hub Match</span>
                    <span className="font-mono font-bold text-saffron-400">30%</span>
                  </div>
                  <div className="p-2.5 bg-white/5 rounded-xl flex items-center justify-between">
                    <span className="text-white/70">Travel Date Alignment</span>
                    <span className="font-mono font-bold text-azure-400">20%</span>
                  </div>
                  <div className="p-2.5 bg-white/5 rounded-xl flex items-center justify-between">
                    <span className="text-white/70">Budget Compatibility</span>
                    <span className="font-mono font-bold text-emerald-400">15%</span>
                  </div>
                  <div className="p-2.5 bg-white/5 rounded-xl flex items-center justify-between">
                    <span className="text-white/70">Shared Interests</span>
                    <span className="font-mono font-bold text-amber-300">15%</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => onNavigate && onNavigate('buddies')}
                className="btn-saffron py-3 px-6 rounded-2xl text-xs font-bold flex items-center gap-2 shadow-saffron"
              >
                <span>Launch Find My Buddy</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Sample Buddy Compatibility Cards */}
            <div className="lg:col-span-7 space-y-4">
              {featuredBuddies.map((buddy) => (
                <div
                  key={buddy._id}
                  className="p-5 bg-[#0c111d] border border-white/10 rounded-3xl shadow-xl flex items-center justify-between flex-wrap gap-4 hover:border-saffron-500/30 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={buddy.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                      alt={buddy.fullName}
                      className="w-14 h-14 rounded-2xl object-cover border border-white/15"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-white">{buddy.fullName}</h3>
                        {buddy.verified && <ShieldCheck className="w-4 h-4 text-emerald-400" />}
                      </div>
                      <p className="text-xs text-white/50">
                        {buddy.city} • Style: <span className="text-saffron-400">{buddy.travelStyle}</span>
                      </p>
                      <div className="flex items-center gap-1.5 mt-2">
                        {(buddy.interests || ['Mountains', 'Trekking']).slice(0, 3).map((int) => (
                          <span key={int} className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-white/70">
                            {int}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-lg font-bold font-mono text-emerald-400 block">
                      {buddy.compatibilityScore || 92}% Match
                    </span>
                    <span className="text-[10px] text-white/40 block mb-2">High Vibe Fit</span>
                    <button
                      onClick={() => onOpenProfile && onOpenProfile(buddy)}
                      className="btn-outline text-xs py-1.5 px-3 rounded-xl font-semibold"
                    >
                      View Profile
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION G: STAYS & BOUTIQUE RETREATS */}
      <section className="py-20 border-b border-white/5 bg-[#080d17]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10 flex-wrap gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 block mb-1">
                Accommodations
              </span>
              <h2 className="text-2xl sm:text-4xl font-display font-extrabold text-white">
                Alpine Chalets & Coastal Villas
              </h2>
            </div>

            <button
              onClick={() => onNavigate && onNavigate('stays')}
              className="btn-outline text-xs py-2 px-4 rounded-xl flex items-center gap-1.5"
            >
              <span>Explore Stays</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredStays.map((stay) => (
              <div
                key={stay._id}
                className="bg-[#0c111d] border border-white/10 rounded-2xl overflow-hidden shadow-xl flex flex-col justify-between hover:border-emerald-500/40 transition-all group"
              >
                <div>
                  <div className="relative h-44 overflow-hidden">
                    <img
                      src={stay.heroImage}
                      alt={stay.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute bottom-3 left-3 px-2 py-0.5 rounded-full text-[10px] font-bold bg-black/60 backdrop-blur-md text-white border border-white/10">
                      {stay.propertyType}
                    </span>
                  </div>

                  <div className="p-4 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-white/50">{stay.destination}</span>
                      <div className="flex items-center gap-1 text-amber-400 font-bold">
                        <Star className="w-3 h-3 fill-amber-400" />
                        <span>{stay.rating}</span>
                      </div>
                    </div>

                    <h3 className="text-sm font-bold text-white line-clamp-1 group-hover:text-emerald-400 transition-colors">
                      {stay.name}
                    </h3>

                    <p className="text-xs text-white/50">{stay.distanceFromCenter}</p>
                  </div>
                </div>

                <div className="p-4 border-t border-white/5 bg-black/20 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-white/40 block">From</span>
                    <span className="text-base font-bold text-white font-mono">{formatMoney(stay.pricePerNight)}</span>
                    <span className="text-[10px] text-white/40"> / night</span>
                  </div>

                  <button
                    onClick={() => onOpenBooking && onOpenBooking(stay, 'stay')}
                    className="btn-saffron text-xs py-1.5 px-3 rounded-xl font-semibold"
                  >
                    Reserve
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION H: SMART PLANNER PREVIEW */}
      <section className="py-20 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#0c111d] border border-white/10 rounded-3xl p-8 sm:p-12 shadow-2xl">
            <div className="max-w-2xl mb-8">
              <span className="text-xs font-bold uppercase tracking-wider text-saffron-400 block mb-1">
                Algorithmic Trip Architecture
              </span>
              <h2 className="text-2xl sm:text-4xl font-display font-extrabold text-white mb-2">
                Sample Expedition Itinerary: Manali & Beyond
              </h2>
              <p className="text-xs sm:text-sm text-white/60">
                Every itinerary is completely customizable. Drag, reorder, adjust times, and calculate road distances.
              </p>
            </div>

            {/* Day Selector Tabs */}
            <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2 scrollbar-none">
              {[1, 2, 3, 4].map((d) => (
                <button
                  key={d}
                  onClick={() => setPlannerActiveDay(d)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    plannerActiveDay === d
                      ? 'bg-saffron-500 text-white shadow-saffron'
                      : 'bg-white/5 text-white/60 hover:text-white'
                  }`}
                >
                  Day {d}
                </button>
              ))}
            </div>

            {/* Itinerary Schedule Card */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-2">
                <span className="text-xs font-mono text-saffron-400 font-bold block">09:30 AM • 2.5 Hours</span>
                <h4 className="text-sm font-bold text-white">Old Manali Heritage & Temple Trail</h4>
                <p className="text-xs text-white/60">Walk through century-old cedar groves to Manu Temple and Hadimba shrine.</p>
                <span className="text-[11px] text-emerald-400 font-mono block pt-1">Est. Cost: Free</span>
              </div>

              <div className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-2">
                <span className="text-xs font-mono text-azure-400 font-bold block">01:30 PM • 3 Hours</span>
                <h4 className="text-sm font-bold text-white">Atal Tunnel Transit to Sissu Falls</h4>
                <p className="text-xs text-white/60">Drive through the engineering marvel into Lahaul with stops for glacial photos.</p>
                <span className="text-[11px] text-emerald-400 font-mono block pt-1">Est. Cost: ₹1,200 (Shared Cab)</span>
              </div>

              <div className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-2">
                <span className="text-xs font-mono text-amber-300 font-bold block">07:00 PM • Evening</span>
                <h4 className="text-sm font-bold text-white">Riverside Acoustic Jam & Siddu Feast</h4>
                <p className="text-xs text-white/60">Gather with fellow travellers beside the river for traditional Himachali dinner.</p>
                <span className="text-[11px] text-emerald-400 font-mono block pt-1">Est. Cost: ₹650 / person</span>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between flex-wrap gap-4">
              <span className="text-xs text-white/50">
                Want to build your own trip? Customize budget, dates, and transport mode in the full planner.
              </span>
              <button
                onClick={() => onNavigate && onNavigate('planner')}
                className="btn-saffron text-xs py-2 px-5 rounded-xl font-bold flex items-center gap-2"
              >
                <span>Open Interactive Planner</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION K: TRAVEL SAFETY & TRUST */}
      <section className="py-20 border-b border-white/5 bg-[#080d17]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 block mb-1">
              Safety Ecosystem
            </span>
            <h2 className="text-2xl sm:text-4xl font-display font-extrabold text-white mb-3">
              Built on Uncompromising Trust & Verification
            </h2>
            <p className="text-xs sm:text-sm text-white/60">
              Co-travelling across India requires complete peace of mind. We enforce multi-layer verification on every explorer.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-[#0c111d] border border-white/10 rounded-3xl space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Government ID Verification</h3>
              <p className="text-xs text-white/60 leading-relaxed">
                Aadhaar, Passport, and Driving License verification ensure every companion profile is genuinely authenticated before connection.
              </p>
            </div>

            <div className="p-6 bg-[#0c111d] border border-white/10 rounded-3xl space-y-3">
              <div className="w-10 h-10 rounded-xl bg-saffron-500/10 text-saffron-400 flex items-center justify-center border border-saffron-500/20">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Emergency Trip Sharing</h3>
              <p className="text-xs text-white/60 leading-relaxed">
                Share live itinerary checkpoints, hotel locations, and co-traveller contacts with family via automated SMS & WhatsApp links.
              </p>
            </div>

            <div className="p-6 bg-[#0c111d] border border-white/10 rounded-3xl space-y-3">
              <div className="w-10 h-10 rounded-xl bg-azure-500/10 text-azure-400 flex items-center justify-center border border-azure-500/20">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">24/7 Rapid Response & Block</h3>
              <p className="text-xs text-white/60 leading-relaxed">
                Instant user reporting, zero-tolerance harassment bans, and dedicated customer safety escalation desks.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION J: SOCIAL PROOF & COMMUNITY STORIES */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-saffron-400 block mb-1">
              Field Dispatch
            </span>
            <h2 className="text-2xl sm:text-4xl font-display font-extrabold text-white mb-2">
              Dispatches from the Road
            </h2>
            <p className="text-xs sm:text-sm text-white/60">
              Read authentic travel journals from explorers who matched and journeyed together.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {stories.map((story) => (
              <div
                key={story._id}
                className="p-6 sm:p-8 bg-[#0c111d] border border-white/10 rounded-3xl shadow-2xl space-y-4"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={story.author?.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                    alt={story.author?.fullName}
                    className="w-11 h-11 rounded-full object-cover border border-white/15"
                  />
                  <div>
                    <h3 className="text-sm font-bold text-white">{story.author?.fullName}</h3>
                    <p className="text-[11px] text-white/50">{story.destination} • {story.tripDuration}</p>
                  </div>
                </div>

                <h4 className="text-lg font-bold text-white">{story.title}</h4>
                <p className="text-xs text-white/70 leading-relaxed italic">
                  "{story.excerpt}"
                </p>

                <div className="pt-2 flex items-center justify-between text-xs text-white/50 border-t border-white/5">
                  <span>Spent: <strong className="text-emerald-400">{formatMoney(story.budgetSpent)}</strong></span>
                  <span className="text-saffron-400 font-semibold cursor-pointer" onClick={() => onNavigate && onNavigate('community')}>
                    Read full story →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

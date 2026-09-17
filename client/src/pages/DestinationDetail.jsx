import React, { useState, useEffect } from 'react';
import { 
  MapPin, Calendar, Compass, BedDouble, Users, CloudSun, 
  Wind, Droplets, ArrowRight, Star, Heart, Check, Train, 
  Plane, Car, DollarSign, Sparkles, ChevronLeft
} from 'lucide-react';
import { 
  destinationsAPI, staysAPI, experiencesAPI, buddiesAPI, 
  savedAPI, formatMoney 
} from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function DestinationDetail({
  destinationSlug = 'manali',
  onBack,
  onOpenBooking,
  onOpenProfile,
  onNavigate
}) {
  const { isAuthenticated, showToast } = useAuth();

  const [destination, setDestination] = useState(null);
  const [stays, setStays] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [buddies, setBuddies] = useState([]);
  const [loading, setLoading] = useState(true);

  // Weather widget state (simulated for destination)
  const [weather] = useState({
    temp: '18°C',
    condition: 'Crisp & Sunny',
    humidity: '42%',
    wind: '12 km/h',
    rainProb: '10%',
    bestSeason: 'May to October & Winter Snow'
  });

  useEffect(() => {
    loadDestinationData();
  }, [destinationSlug]);

  const loadDestinationData = async () => {
    setLoading(true);
    try {
      const destRes = await destinationsAPI.getBySlug(destinationSlug);
      if (destRes.success && destRes.destination) {
        const dest = destRes.destination;
        setDestination(dest);

        // Fetch correlated stays, experiences and buddies
        const [staysRes, expRes, budRes] = await Promise.allSettled([
          staysAPI.getAll({ destination: dest.name, limit: 4 }),
          experiencesAPI.getAll({ search: dest.name, limit: 4 }),
          buddiesAPI.match({ destination: dest.name })
        ]);

        if (staysRes.status === 'fulfilled' && staysRes.value.stays) setStays(staysRes.value.stays);
        if (expRes.status === 'fulfilled' && expRes.value.events) setExperiences(expRes.value.events);
        if (budRes.status === 'fulfilled' && budRes.value.buddies) setBuddies(budRes.value.buddies.slice(0, 4));
      }
    } catch (err) {
      console.error('Failed to load destination details:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !destination) {
    return (
      <div className="min-h-screen bg-[#060910] text-white pt-32 pb-20 flex items-center justify-center">
        <div className="text-center text-xs text-white/50 flex items-center gap-2">
          <span className="w-4 h-4 border-2 border-saffron-500 border-t-transparent rounded-full animate-spin" />
          <span>Exploring destination intelligence...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#060910] text-white pb-24">
      {/* Hero Visual Header */}
      <div className="relative h-[480px] sm:h-[560px] overflow-hidden">
        <img
          src={destination.heroImage}
          alt={destination.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#060910] via-[#060910]/60 to-transparent" />

        {/* Back button */}
        <div className="absolute top-28 left-4 sm:left-8 z-10">
          <button
            onClick={onBack}
            className="px-4 py-2 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 text-xs font-semibold text-white flex items-center gap-2 hover:bg-black/80 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to Explore</span>
          </button>
        </div>

        {/* Destination Headline */}
        <div className="absolute bottom-8 left-4 sm:left-8 right-4 max-w-7xl mx-auto">
          <span className="px-3 py-1 rounded-full bg-saffron-500 text-white font-bold text-xs uppercase tracking-wider mb-2 inline-block">
            {destination.category}
          </span>
          <h1 className="text-4xl sm:text-6xl font-display font-extrabold text-white tracking-tight mb-2">
            {destination.name}
          </h1>
          <p className="text-sm sm:text-base text-white/80 max-w-2xl flex items-center gap-2">
            <MapPin className="w-4 h-4 text-saffron-400" />
            <span>{destination.state}, India • {destination.tagLine}</span>
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-12">
        {/* Intelligence Bar & Live Weather */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Summary & Overview */}
          <div className="md:col-span-8 bg-[#0c111d] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl space-y-4">
            <h2 className="text-lg font-bold text-white">About {destination.name}</h2>
            <p className="text-xs sm:text-sm text-white/70 leading-relaxed">
              {destination.description}
            </p>

            {/* Highlights Chips */}
            <div className="pt-2">
              <span className="text-xs font-bold uppercase tracking-wider text-white/40 block mb-2">Key Highlights</span>
              <div className="flex flex-wrap gap-2">
                {(destination.highlights || []).map((h, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/5 text-xs text-white/90 flex items-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5 text-saffron-400" />
                    <span>{h}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Live Weather & Best Travel Window */}
          <div className="md:col-span-4 bg-gradient-to-br from-[#0e172a] to-[#0c111d] border border-white/10 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-azure-400 flex items-center gap-1.5">
                <CloudSun className="w-4 h-4" /> Live Climate
              </span>
              <span className="text-xs font-semibold text-emerald-400">Optimal Window</span>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className="text-3xl font-display font-extrabold text-white font-mono">{weather.temp}</span>
                <span className="text-xs text-white/60 block">{weather.condition}</span>
              </div>
              <CloudSun className="w-10 h-10 text-amber-400" />
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-white/5">
              <div className="p-2.5 bg-white/5 rounded-xl">
                <span className="text-[10px] text-white/40 block">Precipitation</span>
                <span className="font-semibold text-white">{weather.rainProb}</span>
              </div>
              <div className="p-2.5 bg-white/5 rounded-xl">
                <span className="text-[10px] text-white/40 block">Wind Speed</span>
                <span className="font-semibold text-white">{weather.wind}</span>
              </div>
            </div>

            <div className="p-3 bg-saffron-500/10 border border-saffron-500/20 rounded-xl text-xs">
              <span className="text-[10px] text-saffron-400 font-bold uppercase block">Best Time to Visit</span>
              <span className="text-white/90 font-medium">{destination.bestTimeToVisit || weather.bestSeason}</span>
            </div>
          </div>
        </div>

        {/* Stays in Destination */}
        {stays.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <BedDouble className="w-5 h-5 text-azure-400" /> Handpicked Stays in {destination.name}
                </h2>
                <p className="text-xs text-white/50">Chalets, boutique stays, and camps in {destination.name}.</p>
              </div>
              <button
                onClick={() => onNavigate && onNavigate('stays')}
                className="text-xs text-azure-400 hover:underline flex items-center gap-1"
              >
                <span>View all stays</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {stays.map((stay) => (
                <div
                  key={stay._id}
                  className="bg-[#0c111d] border border-white/10 rounded-2xl overflow-hidden shadow-xl flex flex-col justify-between"
                >
                  <div className="relative h-40 overflow-hidden">
                    <img src={stay.heroImage} alt={stay.name} className="w-full h-full object-cover" />
                    <span className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-black/60 text-white border border-white/10">
                      {stay.propertyType}
                    </span>
                  </div>
                  <div className="p-3.5">
                    <h4 className="text-xs font-bold text-white line-clamp-1 mb-1">{stay.name}</h4>
                    <span className="text-xs font-bold text-saffron-400 font-mono">
                      {formatMoney(stay.pricePerNight)}/night
                    </span>
                  </div>
                  <div className="p-3.5 pt-0">
                    <button
                      onClick={() => onOpenBooking && onOpenBooking(stay, 'stay')}
                      className="w-full btn-saffron text-xs py-1.5 rounded-xl font-semibold"
                    >
                      Reserve Stay
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Experiences in Destination */}
        {experiences.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Compass className="w-5 h-5 text-saffron-400" /> Curated Experiences & Treks
                </h2>
                <p className="text-xs text-white/50">Guided alpine hikes, local cultural tours, and adventures.</p>
              </div>
              <button
                onClick={() => onNavigate && onNavigate('explore')}
                className="text-xs text-saffron-400 hover:underline flex items-center gap-1"
              >
                <span>View all experiences</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {experiences.map((exp) => (
                <div
                  key={exp._id}
                  className="bg-[#0c111d] border border-white/10 rounded-2xl overflow-hidden shadow-xl flex flex-col justify-between"
                >
                  <div className="relative h-40 overflow-hidden">
                    <img src={exp.image} alt={exp.title} className="w-full h-full object-cover" />
                    <span className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-black/60 text-white border border-white/10">
                      {exp.category}
                    </span>
                  </div>
                  <div className="p-3.5">
                    <h4 className="text-xs font-bold text-white line-clamp-1 mb-1">{exp.title}</h4>
                    <span className="text-xs font-bold text-emerald-400 font-mono">
                      {formatMoney(exp.price)}
                    </span>
                  </div>
                  <div className="p-3.5 pt-0">
                    <button
                      onClick={() => onOpenBooking && onOpenBooking(exp, 'experience')}
                      className="w-full btn-saffron text-xs py-1.5 rounded-xl font-semibold"
                    >
                      Book Experience
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Travel Buddies Heading to Destination */}
        {buddies.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-amber-400" /> Travellers Heading to {destination.name}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {buddies.map((buddy) => (
                <div
                  key={buddy._id}
                  className="p-4 bg-[#0c111d] border border-white/10 rounded-2xl shadow-xl flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={buddy.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                      alt={buddy.fullName}
                      className="w-11 h-11 rounded-full object-cover border border-white/10"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-white">{buddy.fullName}</h4>
                      <p className="text-[10px] text-white/50">{buddy.city} • {buddy.travelStyle}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => onOpenProfile && onOpenProfile(buddy)}
                    className="btn-outline text-xs py-1 px-2.5 rounded-lg"
                  >
                    View
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

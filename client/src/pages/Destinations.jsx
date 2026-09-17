import React, { useState, useEffect } from 'react';
import { 
  MapPin, Compass, Search, Calendar, IndianRupee, Mountain, 
  ArrowRight, ShieldCheck, Sparkles, X, Info, CheckCircle2, ChevronRight
} from 'lucide-react';
import { destinationsAPI } from '../services/api';

export default function Destinations({ onNavigate }) {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [activeModalDest, setActiveModalDest] = useState(null);

  useEffect(() => {
    fetchDestinations();
  }, []);

  const fetchDestinations = async () => {
    setLoading(true);
    try {
      const res = await destinationsAPI.getAll();
      if (res && res.destinations) {
        setDestinations(res.destinations);
      }
    } catch (err) {
      console.error('Failed to load destinations:', err);
    } finally {
      setLoading(false);
    }
  };

  const regions = ['All', 'Himalayas', 'Western Ghats & South', 'Coastal & Beaches', 'Desert & Heritage', 'North East'];

  const filteredDestinations = destinations.filter((dest) => {
    const matchesSearch = 
      dest.name.toLowerCase().includes(search.toLowerCase()) ||
      (dest.state && dest.state.toLowerCase().includes(search.toLowerCase())) ||
      (dest.description && dest.description.toLowerCase().includes(search.toLowerCase()));

    if (selectedRegion === 'All') return matchesSearch;
    if (selectedRegion === 'Himalayas') {
      return matchesSearch && ['Himachal Pradesh', 'Ladakh', 'Uttarakhand', 'Jammu & Kashmir'].includes(dest.state);
    }
    if (selectedRegion === 'Western Ghats & South') {
      return matchesSearch && ['Kerala', 'Karnataka', 'Tamil Nadu'].includes(dest.state);
    }
    if (selectedRegion === 'Coastal & Beaches') {
      return matchesSearch && ['Goa', 'Karnataka', 'Kerala', 'Andaman & Nicobar'].includes(dest.state);
    }
    if (selectedRegion === 'Desert & Heritage') {
      return matchesSearch && ['Rajasthan', 'Uttar Pradesh', 'Madhya Pradesh'].includes(dest.state);
    }
    if (selectedRegion === 'North East') {
      return matchesSearch && ['Meghalaya', 'Arunachal Pradesh', 'Sikkim', 'Nagaland', 'Assam'].includes(dest.state);
    }
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#07090e] text-white pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Title */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-saffron-500/10 border border-saffron-500/20 text-xs font-semibold text-saffron-400 mb-3">
            <Compass className="w-3.5 h-3.5" />
            <span>Curated Indian Geographical Circuits</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-display font-extrabold text-white mb-3">
            India Travel Hub & Guides
          </h1>
          <p className="text-neutral-400 text-sm sm:text-base">
            From the trans-Himalayan desert of Spiti to the rain-soaked living root bridges of Meghalaya, explore top regions with live community trips and essential tips.
          </p>
        </div>

        {/* Search & Region Filter Strip */}
        <div className="mb-10 space-y-4">
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by destination name, state or circuit..."
              className="w-full pl-11 pr-4 py-3 bg-[#0e1320] border border-white/10 rounded-2xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-saffron-500/60 transition-colors shadow-lg"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2">
            {regions.map((region) => (
              <button
                key={region}
                onClick={() => setSelectedRegion(region)}
                className={`px-4 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  selectedRegion === region
                    ? 'bg-saffron-500 text-white shadow-md shadow-saffron-500/25'
                    : 'bg-white/5 hover:bg-white/10 text-neutral-300 border border-white/5'
                }`}
              >
                {region}
              </button>
            ))}
          </div>
        </div>

        {/* Destinations Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-96 rounded-2xl bg-white/5 animate-pulse border border-white/10" />
            ))}
          </div>
        ) : filteredDestinations.length === 0 ? (
          <div className="text-center py-20 bg-[#0e1320] rounded-3xl border border-white/10 p-8">
            <MapPin className="w-16 h-16 text-saffron-500/40 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No destinations match "{search}"</h3>
            <p className="text-neutral-400 text-sm max-w-md mx-auto mb-6">
              Try searching for popular circuits like Ladakh, Spiti, Gokarna, or Munnar.
            </p>
            <button
              onClick={() => { setSearch(''); setSelectedRegion('All'); }}
              className="px-5 py-2.5 rounded-xl bg-saffron-500 text-white text-xs font-semibold"
            >
              Reset Search
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDestinations.map((dest) => (
              <div
                key={dest._id}
                className="group rounded-3xl bg-[#0e1320] border border-white/10 overflow-hidden hover:border-saffron-500/50 transition-all shadow-xl flex flex-col hover:scale-[1.01]"
              >
                <div className="relative h-60 overflow-hidden">
                  <img
                    src={dest.image || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb'}
                    alt={dest.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0e1320] via-transparent to-black/30" />
                  
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-black/60 backdrop-blur-md text-saffron-400 border border-white/10">
                      {dest.state}
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-4 right-4">
                    <h3 className="text-2xl font-display font-bold text-white group-hover:text-saffron-300 transition-colors">
                      {dest.name}
                    </h3>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed mb-4">
                      {dest.description}
                    </p>

                    {/* Highlights tags */}
                    {dest.topAttractions && dest.topAttractions.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {dest.topAttractions.slice(0, 3).map((att, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/5 text-[11px] text-neutral-300"
                          >
                            {att}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-white/10">
                    <div className="flex items-center justify-between text-xs text-neutral-400 mb-4">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-saffron-400" />
                        Best: {dest.bestSeason || 'Oct - Apr'}
                      </span>
                      {dest.averageBudgetPerDay && (
                        <span className="font-mono text-white">
                          ₹{dest.averageBudgetPerDay}/day avg
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setActiveModalDest(dest)}
                        className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-semibold border border-white/10 transition-colors flex items-center justify-center gap-1.5"
                      >
                        <Info className="w-3.5 h-3.5" />
                        <span>Travel Guide</span>
                      </button>

                      <button
                        onClick={() => onNavigate && onNavigate('explore', { destination: dest.name })}
                        className="w-full py-2.5 rounded-xl bg-saffron-500 hover:bg-saffron-600 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-saffron-500/20"
                      >
                        <span>Find Trips</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* DESTINATION GUIDE MODAL */}
        {activeModalDest && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="relative w-full max-w-2xl bg-[#0e1320] border border-white/15 rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
              <button
                onClick={() => setActiveModalDest(null)}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/60 text-white hover:bg-black/90 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="relative h-64">
                <img
                  src={activeModalDest.image}
                  alt={activeModalDest.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0e1320] via-black/40 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-saffron-500 text-white">
                    {activeModalDest.state}
                  </span>
                  <h2 className="text-3xl font-display font-extrabold text-white mt-2">
                    {activeModalDest.name}
                  </h2>
                </div>
              </div>

              <div className="p-6 sm:p-8 space-y-6 max-h-[60vh] overflow-y-auto">
                <div>
                  <h4 className="text-sm font-bold uppercase tracking-wider text-saffron-400 mb-2">
                    About The Destination
                  </h4>
                  <p className="text-sm text-neutral-300 leading-relaxed">
                    {activeModalDest.description}
                  </p>
                </div>

                {activeModalDest.topAttractions && activeModalDest.topAttractions.length > 0 && (
                  <div>
                    <h4 className="text-sm font-bold uppercase tracking-wider text-saffron-400 mb-3">
                      Must-Visit Highlights
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {activeModalDest.topAttractions.map((att, i) => (
                        <div key={i} className="flex items-center gap-2 p-2.5 rounded-xl bg-white/5 border border-white/5 text-xs text-neutral-200">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                          <span>{att}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeModalDest.travelTips && activeModalDest.travelTips.length > 0 && (
                  <div>
                    <h4 className="text-sm font-bold uppercase tracking-wider text-saffron-400 mb-3">
                      Field Notes & Responsible Travel
                    </h4>
                    <div className="space-y-2">
                      {activeModalDest.travelTips.map((tip, i) => (
                        <div key={i} className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 flex items-start gap-2.5">
                          <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                          <span>{tip}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <div className="text-xs text-neutral-400">
                    <p>Ideal for co-travelers seeking authentic, slow journeys.</p>
                  </div>
                  <button
                    onClick={() => {
                      const destName = activeModalDest.name;
                      setActiveModalDest(null);
                      if (onNavigate) onNavigate('explore', { destination: destName });
                    }}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-saffron-500 to-amber-500 text-white font-semibold text-xs shadow-lg shadow-saffron-500/25 transition-all hover:scale-105"
                  >
                    View Active Trips to {activeModalDest.name}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

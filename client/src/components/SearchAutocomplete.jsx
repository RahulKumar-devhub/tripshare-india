import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, BedDouble, Compass, Users, Sparkles, X, ArrowRight } from 'lucide-react';
import { destinationsAPI, staysAPI, experiencesAPI, buddiesAPI } from '../services/api';

export default function SearchAutocomplete({
  placeholder = 'Search destinations, stays, experiences, or buddies...',
  onSelectResult,
  className = ''
}) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState({
    destinations: [],
    stays: [],
    experiences: [],
    buddies: []
  });
  const [loading, setLoading] = useState(false);
  const containerRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced multi-entity search
  useEffect(() => {
    if (!query.trim() || query.length < 2) {
      setResults({ destinations: [], stays: [], experiences: [], buddies: [] });
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const q = query.trim();
        const [destRes, staysRes, expRes, budRes] = await Promise.allSettled([
          destinationsAPI.getAll({ search: q }),
          staysAPI.getAll({ destination: q, limit: 3 }),
          experiencesAPI.getAll({ search: q, limit: 3 }),
          buddiesAPI.match({ destination: q })
        ]);

        const dests = destRes.status === 'fulfilled' && destRes.value.destinations ? destRes.value.destinations.slice(0, 3) : [];
        const stays = staysRes.status === 'fulfilled' && staysRes.value.stays ? staysRes.value.stays.slice(0, 3) : [];
        const exps = expRes.status === 'fulfilled' && expRes.value.events ? expRes.value.events.slice(0, 3) : [];
        const buds = budRes.status === 'fulfilled' && budRes.value.buddies ? budRes.value.buddies.slice(0, 3) : [];

        setResults({ destinations: dests, stays, experiences: exps, buddies: buds });
        setIsOpen(true);
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    }, 280);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (type, item) => {
    setIsOpen(false);
    if (onSelectResult) {
      onSelectResult(type, item);
    }
  };

  const hasAnyResults =
    results.destinations.length > 0 ||
    results.stays.length > 0 ||
    results.experiences.length > 0 ||
    results.buddies.length > 0;

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      <div className="relative flex items-center">
        <Search className="absolute left-4 w-5 h-5 text-white/40 pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => {
            if (query.length >= 2) setIsOpen(true);
          }}
          placeholder={placeholder}
          className="w-full pl-12 pr-10 py-3.5 bg-[#090d16]/95 border border-white/15 focus:border-saffron-500 rounded-2xl text-white placeholder-white/40 text-sm focus:outline-none focus:ring-2 focus:ring-saffron-500/20 shadow-xl transition-all"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setIsOpen(false);
            }}
            className="absolute right-3.5 text-white/40 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Dropdown Menu */}
      {isOpen && query.length >= 2 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-[#0c111c] border border-white/15 rounded-2xl shadow-2xl backdrop-blur-2xl z-50 max-h-[460px] overflow-y-auto p-3 divide-y divide-white/10 animate-in fade-in slide-in-from-top-2">
          {loading && (
            <div className="py-6 text-center text-xs text-white/50 flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-saffron-500 border-t-transparent rounded-full animate-spin" />
              <span>Scanning India travel network...</span>
            </div>
          )}

          {!loading && !hasAnyResults && (
            <div className="py-6 text-center text-xs text-white/50">
              No exact matches found for "{query}". Try searching "Manali", "Goa", "Trek", or "Camp".
            </div>
          )}

          {/* 1. Destinations */}
          {results.destinations.length > 0 && (
            <div className="py-2 first:pt-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-saffron-400 px-2.5 mb-1.5 flex items-center gap-1.5">
                <MapPin className="w-3 h-3" /> Destinations
              </span>
              {results.destinations.map((d) => (
                <div
                  key={d._id || d.slug}
                  onClick={() => handleSelect('destination', d)}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={d.heroImage}
                      alt={d.name}
                      className="w-10 h-10 rounded-lg object-cover border border-white/10"
                    />
                    <div>
                      <div className="text-sm font-semibold text-white group-hover:text-saffron-400 transition-colors">
                        {d.name}, {d.state}
                      </div>
                      <div className="text-xs text-white/50">{d.category} • {d.idealDuration}</div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-white/30 group-hover:text-saffron-400 transition-colors" />
                </div>
              ))}
            </div>
          )}

          {/* 2. Experiences */}
          {results.experiences.length > 0 && (
            <div className="py-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-azure-400 px-2.5 mb-1.5 flex items-center gap-1.5">
                <Compass className="w-3 h-3" /> Things To Do & Experiences
              </span>
              {results.experiences.map((exp) => (
                <div
                  key={exp._id}
                  onClick={() => handleSelect('experience', exp)}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={exp.image}
                      alt={exp.title}
                      className="w-10 h-10 rounded-lg object-cover border border-white/10"
                    />
                    <div>
                      <div className="text-sm font-semibold text-white group-hover:text-azure-400 transition-colors line-clamp-1">
                        {exp.title}
                      </div>
                      <div className="text-xs text-white/50">
                        {exp.city} • ₹{exp.price.toLocaleString('en-IN')} • {exp.duration}
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-white/30 group-hover:text-azure-400 transition-colors" />
                </div>
              ))}
            </div>
          )}

          {/* 3. Stays & Hotels */}
          {results.stays.length > 0 && (
            <div className="py-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 px-2.5 mb-1.5 flex items-center gap-1.5">
                <BedDouble className="w-3 h-3" /> Stays & Hotels
              </span>
              {results.stays.map((stay) => (
                <div
                  key={stay._id}
                  onClick={() => handleSelect('stay', stay)}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={stay.heroImage}
                      alt={stay.name}
                      className="w-10 h-10 rounded-lg object-cover border border-white/10"
                    />
                    <div>
                      <div className="text-sm font-semibold text-white group-hover:text-emerald-400 transition-colors line-clamp-1">
                        {stay.name}
                      </div>
                      <div className="text-xs text-white/50">
                        {stay.propertyType} in {stay.destination} • ₹{stay.pricePerNight.toLocaleString('en-IN')}/night
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-white/30 group-hover:text-emerald-400 transition-colors" />
                </div>
              ))}
            </div>
          )}

          {/* 4. Travel Buddies */}
          {results.buddies.length > 0 && (
            <div className="py-2 last:pb-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 px-2.5 mb-1.5 flex items-center gap-1.5">
                <Users className="w-3 h-3" /> Travellers Heading There
              </span>
              {results.buddies.map((buddy) => (
                <div
                  key={buddy._id}
                  onClick={() => handleSelect('buddy', buddy)}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={buddy.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                      alt={buddy.fullName}
                      className="w-10 h-10 rounded-full object-cover border border-white/10"
                    />
                    <div>
                      <div className="text-sm font-semibold text-white group-hover:text-amber-400 transition-colors flex items-center gap-1.5">
                        <span>{buddy.fullName}</span>
                        {buddy.compatibilityScore && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono">
                            {buddy.compatibilityScore}% Match
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-white/50">{buddy.city} • {buddy.travelStyle}</div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-white/30 group-hover:text-amber-400 transition-colors" />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

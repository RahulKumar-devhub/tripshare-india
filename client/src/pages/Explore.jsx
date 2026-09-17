import React, { useState, useEffect } from 'react';
import { 
  Search, Filter, SlidersHorizontal, MapPin, Calendar, Users, 
  IndianRupee, Sparkles, RefreshCw, X, ArrowUpDown, ShieldCheck,
  Compass, PlusCircle, LayoutGrid, List, Star, Clock, Check, 
  ArrowRight, Heart
} from 'lucide-react';
import { tripsAPI, experiencesAPI, savedAPI, formatMoney, formatDate } from '../services/api';
import TripCard from '../components/TripCard';
import { useAuth } from '../context/AuthContext';

const EXPERIENCE_CATEGORIES = [
  'All',
  'Trekking',
  'Camping',
  'Cultural Tours',
  'Adventure',
  'Food Experiences',
  'Beach Activities',
  'Spiritual'
];

export default function Explore({ 
  initialFilters = {}, 
  onOpenTripDetail, 
  onOpenCreateTrip, 
  onOpenProfile,
  onOpenBooking,
  onOpenExperienceDetail
}) {
  const { isAuthenticated, showToast } = useAuth();

  // Mode: 'experiences' | 'trips'
  const [activeMode, setActiveMode] = useState('experiences');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'

  const [experiences, setExperiences] = useState([]);
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState(initialFilters.destination || '');
  const [category, setCategory] = useState(initialFilters.category || 'All');
  const [maxPrice, setMaxPrice] = useState(25000);
  const [difficulty, setDifficulty] = useState('all');
  const [sortBy, setSortBy] = useState('recommended');
  const [savedIds, setSavedIds] = useState(new Set());

  useEffect(() => {
    fetchData();
    if (isAuthenticated) {
      loadSaved();
    }
  }, [activeMode, search, category, maxPrice, difficulty, sortBy]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeMode === 'experiences') {
        const params = {
          search: search.trim(),
          category: category !== 'All' ? category : undefined,
          difficulty: difficulty !== 'all' ? difficulty : undefined,
          maxPrice,
          sort: sortBy
        };
        const res = await experiencesAPI.getAll(params);
        if (res.success && res.events) {
          setExperiences(res.events);
        }
      } else {
        const params = {
          search: search.trim(),
          category: category !== 'All' ? category : undefined,
          maxBudget: maxPrice,
          sort: sortBy
        };
        const res = await tripsAPI.getAll(params);
        if (res.trips) {
          setTrips(res.trips);
        }
      }
    } catch (err) {
      console.error('Failed to load explore data:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadSaved = async () => {
    try {
      const res = await savedAPI.getAll();
      if (res.success && res.savedItems) {
        setSavedIds(new Set(res.savedItems.map((i) => i.itemId)));
      }
    } catch (err) {
      console.error('Failed to load saved items:', err);
    }
  };

  const handleToggleSave = async (e, item, type) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      showToast('Please login to save items', 'info');
      return;
    }
    try {
      const res = await savedAPI.toggle({
        itemType: type,
        itemId: item._id,
        itemData: {
          title: item.title || item.name,
          subtitle: `${item.category} in ${item.city || item.destination}`,
          image: item.image || item.heroImage,
          price: item.price || item.budget,
          rating: item.rating || 4.8,
          location: item.city || item.destination
        }
      });
      if (res.success) {
        const next = new Set(savedIds);
        if (res.saved) {
          next.add(item._id);
          showToast('Item saved to wishlist!', 'success');
        } else {
          next.delete(item._id);
          showToast('Removed from wishlist', 'info');
        }
        setSavedIds(next);
      }
    } catch (err) {
      showToast('Could not save item', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-[#060910] text-white pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Hero Banner */}
        <div className="flex items-center justify-between border-b border-white/10 pb-6 mb-8 flex-wrap gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-azure-500/10 border border-azure-500/30 text-azure-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <Compass className="w-3.5 h-3.5" />
              <span>Verified Expeditions & Journeys</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-white">
              Explore India's Wildest Horizons
            </h1>
            <p className="text-xs sm:text-sm text-white/60">
              High-altitude treks, sacred dawn cruises, and group expeditions with transparent pricing.
            </p>
          </div>

          {/* Mode Switcher: Experiences vs Co-Travel Trips */}
          <div className="flex items-center gap-2 bg-[#0c111d] p-1.5 rounded-2xl border border-white/10">
            <button
              onClick={() => setActiveMode('experiences')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeMode === 'experiences' ? 'bg-saffron-500 text-white shadow-saffron' : 'text-white/60 hover:text-white'
              }`}
            >
              Curated Experiences
            </button>
            <button
              onClick={() => setActiveMode('trips')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeMode === 'trips' ? 'bg-saffron-500 text-white shadow-saffron' : 'text-white/60 hover:text-white'
              }`}
            >
              Community Trips
            </button>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="space-y-4 mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            {/* Search Input */}
            <div className="sm:col-span-6 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search destination, activity, or region (e.g. Manali, Spiti, Varanasi)..."
                className="w-full pl-11 pr-4 py-3 bg-[#0c111d] border border-white/10 rounded-2xl text-xs text-white placeholder-white/40 focus:border-saffron-500 focus:outline-none"
              />
            </div>

            {/* Price Filter */}
            <div className="sm:col-span-3 p-2.5 bg-[#0c111d] border border-white/10 rounded-2xl flex flex-col justify-center">
              <div className="flex items-center justify-between text-[10px] text-white/50 mb-1">
                <span>Max Budget</span>
                <span className="font-bold text-saffron-400">{formatMoney(maxPrice)}</span>
              </div>
              <input
                type="range"
                min="1000"
                max="30000"
                step="1000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-saffron-500"
              />
            </div>

            {/* Sort Dropdown & Layout Mode */}
            <div className="sm:col-span-3 flex items-center gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="flex-1 py-3 px-3.5 bg-[#0c111d] border border-white/10 rounded-2xl text-xs text-white focus:outline-none"
              >
                <option value="recommended">Recommended</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating_desc">Highest Rated</option>
              </select>

              <div className="flex items-center bg-[#0c111d] border border-white/10 rounded-2xl p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-xl transition-colors ${viewMode === 'grid' ? 'bg-white/10 text-white' : 'text-white/40'}`}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-xl transition-colors ${viewMode === 'list' ? 'bg-white/10 text-white' : 'text-white/40'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {EXPERIENCE_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  category === cat
                    ? 'bg-azure-500 text-white shadow-lg shadow-azure-500/20'
                    : 'bg-[#0c111d] text-white/60 hover:text-white border border-white/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Content Section */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-72 bg-white/5 rounded-3xl animate-pulse" />
            ))}
          </div>
        ) : activeMode === 'experiences' ? (
          /* Experiences Grid / List */
          experiences.length === 0 ? (
            <div className="py-20 text-center bg-[#0c111d] rounded-3xl border border-white/10 p-8">
              <Compass className="w-12 h-12 text-white/30 mx-auto mb-3" />
              <h3 className="text-base font-bold text-white mb-1">No experiences match your filters</h3>
              <p className="text-xs text-white/50 max-w-sm mx-auto mb-4">
                Try searching for broader keywords like "Trek", "Camp", or "Rafting".
              </p>
              <button
                onClick={() => { setSearch(''); setCategory('All'); setMaxPrice(25000); }}
                className="btn-outline text-xs py-2 px-4 rounded-xl"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
              {experiences.map((exp) => {
                const isSaved = savedIds.has(exp._id);
                return (
                  <div
                    key={exp._id}
                    className={`group bg-[#0c111d] border border-white/10 rounded-3xl overflow-hidden shadow-xl hover:border-azure-500/40 transition-all ${
                      viewMode === 'list' ? 'flex flex-col sm:flex-row' : 'flex flex-col justify-between'
                    }`}
                  >
                    <div className={`relative ${viewMode === 'list' ? 'sm:w-72 h-56 sm:h-auto' : 'h-52'} overflow-hidden`}>
                      <img
                        src={exp.image}
                        alt={exp.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <button
                        onClick={(e) => handleToggleSave(e, exp, 'experience')}
                        className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white hover:text-rose-400 transition-colors"
                      >
                        <Heart className={`w-4 h-4 ${isSaved ? 'fill-rose-500 text-rose-500' : ''}`} />
                      </button>
                      <span className="absolute bottom-3 left-3 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/60 backdrop-blur-md text-white border border-white/10">
                        {exp.category}
                      </span>
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between text-xs mb-1.5">
                          <span className="text-white/50 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-saffron-400" />
                            {exp.city}
                          </span>
                          <div className="flex items-center gap-1 text-amber-400 font-bold">
                            <Star className="w-3 h-3 fill-amber-400" />
                            <span>{exp.rating}</span>
                            <span className="text-white/40 font-normal">({exp.reviewCount || 24})</span>
                          </div>
                        </div>

                        <h3 className="text-base font-bold text-white mb-2 line-clamp-1 group-hover:text-azure-400 transition-colors">
                          {exp.title}
                        </h3>

                        <p className="text-xs text-white/60 line-clamp-2 mb-3 leading-relaxed">
                          {exp.description}
                        </p>

                        <div className="flex items-center gap-2 text-[11px] text-white/50 mb-4">
                          <span>{exp.duration}</span>
                          <span>•</span>
                          <span>{exp.difficulty || 'Moderate'}</span>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-white/40 block">Price</span>
                          <span className="text-lg font-bold text-white font-mono">{formatMoney(exp.price)}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onOpenExperienceDetail && onOpenExperienceDetail(exp._id)}
                            className="btn-outline text-xs py-2 px-3 rounded-xl font-semibold"
                          >
                            Details
                          </button>
                          <button
                            onClick={() => onOpenBooking && onOpenBooking(exp, 'experience')}
                            className="btn-saffron text-xs py-2 px-4 rounded-xl font-bold flex items-center gap-1"
                          >
                            <span>Book</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )
        ) : (
          /* Community Trips Grid */
          trips.length === 0 ? (
            <div className="py-20 text-center bg-[#0c111d] rounded-3xl border border-white/10 p-8">
              <Users className="w-12 h-12 text-white/30 mx-auto mb-3" />
              <h3 className="text-base font-bold text-white mb-1">No community trips found</h3>
              <p className="text-xs text-white/50 max-w-sm mx-auto mb-4">
                Be the first to create an expedition to this destination!
              </p>
              <button
                onClick={onOpenCreateTrip}
                className="btn-saffron text-xs py-2 px-4 rounded-xl"
              >
                Create Expedition
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trips.map((trip) => (
                <TripCard
                  key={trip._id}
                  trip={trip}
                  onOpenTripDetail={onOpenTripDetail}
                  onOpenProfile={onOpenProfile}
                />
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
}

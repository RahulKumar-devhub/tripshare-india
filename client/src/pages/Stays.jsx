import React, { useState, useEffect } from 'react';
import { 
  Search, Filter, MapPin, Star, BedDouble, Wifi, Waves, Car, 
  Coffee, Dumbbell, ShieldCheck, Heart, ArrowUpDown, ChevronDown, 
  Sparkles, Check, X, SlidersHorizontal, ArrowRight
} from 'lucide-react';
import { staysAPI, savedAPI, formatMoney } from '../services/api';
import { useAuth } from '../context/AuthContext';

const PROPERTY_TYPES = [
  'All',
  'Resort',
  'Hotel',
  'Hostel',
  'Villa',
  'Homestay',
  'Camp'
];

const AMENITY_FILTERS = [
  'Wi-Fi',
  'Swimming Pool',
  'Free Breakfast',
  'Mountain View',
  'Sea View',
  'Air Conditioning',
  'Bonfire & BBQ',
  'Spa',
  'Parking'
];

export default function Stays({ onOpenStayBooking, onOpenStayDetail }) {
  const { isAuthenticated, showToast } = useAuth();

  const [stays, setStays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savedStayIds, setSavedStayIds] = useState(new Set());

  // Search & Filter State
  const [destination, setDestination] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [maxPrice, setMaxPrice] = useState(15000);
  const [minRating, setMinRating] = useState(0);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [sortBy, setSortBy] = useState('recommended');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  useEffect(() => {
    fetchStays();
    if (isAuthenticated) {
      loadSavedStays();
    }
  }, [selectedType, maxPrice, minRating, selectedAmenities, sortBy]);

  const fetchStays = async () => {
    setLoading(true);
    try {
      const params = {
        destination: destination.trim(),
        propertyType: selectedType !== 'All' ? selectedType : '',
        maxPrice,
        minRating: minRating > 0 ? minRating : '',
        amenities: selectedAmenities.join(','),
        sort: sortBy
      };
      const res = await staysAPI.getAll(params);
      if (res.success && res.stays) {
        setStays(res.stays);
      }
    } catch (err) {
      console.error('Failed to fetch stays:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadSavedStays = async () => {
    try {
      const res = await savedAPI.getAll();
      if (res.success && res.savedItems) {
        const staySet = new Set(
          res.savedItems.filter((i) => i.itemType === 'stay').map((i) => i.itemId)
        );
        setSavedStayIds(staySet);
      }
    } catch (err) {
      console.error('Failed to load saved stays:', err);
    }
  };

  const handleToggleSave = async (e, stay) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      showToast('Please login to bookmark stays', 'info');
      return;
    }
    try {
      const res = await savedAPI.toggle({
        itemType: 'stay',
        itemId: stay._id,
        itemData: {
          title: stay.name,
          subtitle: `${stay.propertyType} in ${stay.destination}`,
          image: stay.heroImage,
          price: stay.pricePerNight,
          rating: stay.rating,
          location: stay.city
        }
      });
      if (res.success) {
        const next = new Set(savedStayIds);
        if (res.saved) {
          next.add(stay._id);
          showToast('Stay saved to wishlist!', 'success');
        } else {
          next.delete(stay._id);
          showToast('Stay removed from wishlist', 'info');
        }
        setSavedStayIds(next);
      }
    } catch (err) {
      showToast('Could not save stay', 'error');
    }
  };

  const toggleAmenity = (amenity) => {
    if (selectedAmenities.includes(amenity)) {
      setSelectedAmenities(selectedAmenities.filter((a) => a !== amenity));
    } else {
      setSelectedAmenities([...selectedAmenities, amenity]);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchStays();
  };

  return (
    <div className="min-h-screen bg-[#060910] text-white pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Hero Banner */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#0d1628] via-[#09101d] to-[#0d1628] border border-white/10 p-6 sm:p-10 mb-8 shadow-2xl">
          <div className="max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-wider text-azure-400 bg-azure-500/10 px-3 py-1 rounded-full border border-azure-500/20 inline-block mb-3">
              Curated Accommodations Across India
            </span>
            <h1 className="text-3xl sm:text-5xl font-display font-extrabold text-white mb-3 tracking-tight">
              Iconic Mountain Chalets, Coastal Villas & Heritage Havelis.
            </h1>
            <p className="text-sm sm:text-base text-white/60">
              Discover authentic stays handpicked for co-travellers, digital nomads, and explorers. Transparent pricing with instant sandbox reservations.
            </p>
          </div>

          {/* Quick Search Bar */}
          <form onSubmit={handleSearchSubmit} className="mt-6 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="Search destination, city, or property name (e.g. Manali, Goa, Udaipur)..."
                className="w-full pl-11 pr-4 py-3.5 bg-black/40 border border-white/15 rounded-2xl text-white placeholder-white/40 text-sm focus:border-azure-500 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="btn-saffron py-3 px-6 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2 shadow-lg shadow-saffron-500/20"
            >
              <Search className="w-4 h-4" />
              <span>Find Stays</span>
            </button>
          </form>
        </div>

        {/* Filter Controls Bar */}
        <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
          {/* Property Types Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full scrollbar-none">
            {PROPERTY_TYPES.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedType === type
                    ? 'bg-azure-500 text-white shadow-lg shadow-azure-500/25'
                    : 'bg-[#0f1626] hover:bg-[#152038] text-white/70 border border-white/5'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 bg-[#0f1626] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white/80">
              <ArrowUpDown className="w-3.5 h-3.5 text-azure-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent border-none text-white text-xs focus:outline-none cursor-pointer"
              >
                <option value="recommended" className="bg-[#0c111c]">Recommended</option>
                <option value="price_asc" className="bg-[#0c111c]">Price: Low to High</option>
                <option value="price_desc" className="bg-[#0c111c]">Price: High to Low</option>
                <option value="rating_desc" className="bg-[#0c111c]">Highest Rated</option>
              </select>
            </div>

            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
              className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-saffron-400" />
              <span>Filters</span>
            </button>
          </div>
        </div>

        {/* Main Grid with Sidebar Filter */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Desktop Filter Sidebar */}
          <aside className={`lg:col-span-3 space-y-6 ${isMobileFilterOpen ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-[#0c111d] border border-white/10 rounded-2xl p-5 shadow-xl space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <span className="text-sm font-bold text-white flex items-center gap-2">
                  <Filter className="w-4 h-4 text-saffron-400" /> Refine Stays
                </span>
                <button
                  onClick={() => {
                    setSelectedType('All');
                    setMaxPrice(15000);
                    setMinRating(0);
                    setSelectedAmenities([]);
                  }}
                  className="text-[11px] text-white/40 hover:text-saffron-400 transition-colors"
                >
                  Reset all
                </button>
              </div>

              {/* Price Range */}
              <div>
                <label className="text-xs font-semibold text-white/80 block mb-2 flex justify-between">
                  <span>Max Nightly Rate</span>
                  <span className="text-saffron-400 font-bold">{formatMoney(maxPrice)}</span>
                </label>
                <input
                  type="range"
                  min="1000"
                  max="20000"
                  step="500"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-saffron-500"
                />
                <div className="flex justify-between text-[10px] text-white/40 mt-1">
                  <span>₹1,000</span>
                  <span>₹20,000+</span>
                </div>
              </div>

              {/* Minimum Rating */}
              <div>
                <label className="text-xs font-semibold text-white/80 block mb-2">Guest Rating</label>
                <div className="grid grid-cols-4 gap-2">
                  {[0, 4.0, 4.5, 4.8].map((rate) => (
                    <button
                      key={rate}
                      type="button"
                      onClick={() => setMinRating(rate)}
                      className={`py-1.5 rounded-lg text-xs font-bold border transition-all ${
                        minRating === rate
                          ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                          : 'bg-white/5 border-white/5 text-white/60 hover:text-white'
                      }`}
                    >
                      {rate === 0 ? 'Any' : `${rate}+★`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Amenities */}
              <div>
                <label className="text-xs font-semibold text-white/80 block mb-2">Popular Amenities</label>
                <div className="space-y-2">
                  {AMENITY_FILTERS.map((amenity) => {
                    const active = selectedAmenities.includes(amenity);
                    return (
                      <div
                        key={amenity}
                        onClick={() => toggleAmenity(amenity)}
                        className={`p-2 rounded-lg text-xs flex items-center justify-between cursor-pointer border transition-colors ${
                          active
                            ? 'bg-azure-500/15 border-azure-500/50 text-white font-medium'
                            : 'bg-white/5 border-transparent text-white/60 hover:text-white'
                        }`}
                      >
                        <span>{amenity}</span>
                        {active && <Check className="w-3.5 h-3.5 text-azure-400" />}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </aside>

          {/* Stays Listing Cards */}
          <div className="lg:col-span-9">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-80 bg-white/5 rounded-2xl animate-pulse border border-white/5" />
                ))}
              </div>
            ) : stays.length === 0 ? (
              <div className="py-20 text-center bg-[#0c111d] rounded-3xl border border-white/10 p-8">
                <BedDouble className="w-12 h-12 text-white/30 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-white mb-1">No stays match your criteria</h3>
                <p className="text-xs text-white/50 max-w-md mx-auto mb-4">
                  Try adjusting your price range, relaxing amenity filters, or searching for other iconic travel hubs like Manali, Goa, or Udaipur.
                </p>
                <button
                  onClick={() => {
                    setSelectedType('All');
                    setMaxPrice(15000);
                    setMinRating(0);
                    setSelectedAmenities([]);
                    setDestination('');
                  }}
                  className="btn-outline text-xs py-2 px-4 rounded-xl"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {stays.map((stay) => {
                  const isSaved = savedStayIds.has(stay._id);
                  return (
                    <div
                      key={stay._id}
                      className="group bg-[#0c111d] border border-white/10 rounded-2xl overflow-hidden hover:border-azure-500/40 transition-all duration-300 shadow-xl flex flex-col justify-between"
                    >
                      <div>
                        {/* Image Banner */}
                        <div className="relative h-48 overflow-hidden">
                          <img
                            src={stay.heroImage}
                            alt={stay.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <button
                            onClick={(e) => handleToggleSave(e, stay)}
                            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white hover:text-rose-400 transition-colors"
                          >
                            <Heart className={`w-4 h-4 ${isSaved ? 'fill-rose-500 text-rose-500' : ''}`} />
                          </button>
                          <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/60 backdrop-blur-md text-white border border-white/10">
                              {stay.propertyType}
                            </span>
                            {stay.featured && (
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-saffron-500 text-white">
                                Top Pick
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Stay Details */}
                        <div className="p-4">
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-1 text-amber-400 text-xs font-bold">
                              <Star className="w-3.5 h-3.5 fill-amber-400" />
                              <span>{stay.rating}</span>
                              <span className="text-white/40 font-normal">({stay.reviewCount})</span>
                            </div>
                            <span className="text-[11px] text-white/50">{stay.distanceFromCenter}</span>
                          </div>

                          <h3 className="text-base font-display font-bold text-white line-clamp-1 group-hover:text-azure-400 transition-colors mb-1">
                            {stay.name}
                          </h3>

                          <p className="text-xs text-white/50 flex items-center gap-1 mb-3">
                            <MapPin className="w-3.5 h-3.5 text-saffron-400 flex-shrink-0" />
                            <span>{stay.city}, {stay.state}</span>
                          </p>

                          {/* Amenity Chips */}
                          <div className="flex items-center gap-1.5 flex-wrap mb-4">
                            {(stay.amenities || []).slice(0, 3).map((a) => (
                              <span
                                key={a}
                                className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 text-white/70 border border-white/5"
                              >
                                {a}
                              </span>
                            ))}
                            {(stay.amenities || []).length > 3 && (
                              <span className="text-[10px] text-white/40">
                                +{(stay.amenities.length - 3)} more
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Footer Price & Booking CTA */}
                      <div className="p-4 border-t border-white/5 flex items-center justify-between bg-black/20">
                        <div>
                          <span className="text-[10px] text-white/40 block">From</span>
                          <span className="text-lg font-bold text-white font-mono">
                            {formatMoney(stay.pricePerNight)}
                          </span>
                          <span className="text-[10px] text-white/40"> / night</span>
                        </div>

                        <button
                          onClick={() => onOpenStayBooking && onOpenStayBooking(stay)}
                          className="btn-saffron text-xs py-2 px-3.5 rounded-xl font-semibold flex items-center gap-1.5 shadow-md"
                        >
                          <span>Reserve</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

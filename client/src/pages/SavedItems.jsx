import React, { useState, useEffect } from 'react';
import { 
  Heart, Bookmark, MapPin, Compass, BedDouble, Users, 
  Trash2, ArrowRight, Sparkles, Star
} from 'lucide-react';
import { savedAPI, formatMoney } from '../services/api';
import { useAuth } from '../context/AuthContext';

const TABS = [
  { id: 'all', label: 'All Saved' },
  { id: 'stay', label: 'Stays & Hotels' },
  { id: 'experience', label: 'Experiences' },
  { id: 'destination', label: 'Destinations' },
  { id: 'buddy', label: 'Travellers' },
  { id: 'trip', label: 'Trips' }
];

export default function SavedItems({ onOpenBooking, onNavigate }) {
  const { isAuthenticated, showToast } = useAuth();
  const [savedItems, setSavedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    if (isAuthenticated) {
      loadSaved();
    }
  }, [isAuthenticated]);

  const loadSaved = async () => {
    setLoading(true);
    try {
      const res = await savedAPI.getAll();
      if (res.success && res.savedItems) {
        setSavedItems(res.savedItems);
      }
    } catch (err) {
      console.error('Failed to load saved items:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (item) => {
    try {
      const res = await savedAPI.remove(item.itemType, item.itemId);
      if (res.success) {
        showToast('Removed from saved wishlist', 'info');
        setSavedItems(savedItems.filter((i) => i._id !== item._id));
      }
    } catch (err) {
      showToast('Could not remove item', 'error');
    }
  };

  const filteredItems = activeTab === 'all'
    ? savedItems
    : savedItems.filter((i) => i.itemType === activeTab);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#060910] text-white pt-32 pb-20 flex items-center justify-center">
        <div className="text-center max-w-md p-8 bg-[#0c111d] rounded-3xl border border-white/10">
          <Bookmark className="w-12 h-12 text-saffron-400 mx-auto mb-3" />
          <h2 className="text-2xl font-bold text-white mb-2">Your Saved Wishlist</h2>
          <p className="text-xs text-white/60 mb-6">
            Log in to access your bookmarked stays, curated experiences, dream destinations, and fellow travellers.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#060910] text-white pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="border-b border-white/10 pb-6 mb-8 flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <Heart className="w-3.5 h-3.5 fill-rose-400" />
              <span>Personal Travel Wishlist</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-white">
              Saved Stays, Experiences & Buddies
            </h1>
            <p className="text-xs sm:text-sm text-white/60">
              Curate your dream journeys across the subcontinent.
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full scrollbar-none">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20'
                    : 'bg-[#0f1628] text-white/70 hover:text-white border border-white/5'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 bg-white/5 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="py-20 text-center bg-[#0c111d] rounded-3xl border border-white/10 p-8">
            <Bookmark className="w-12 h-12 text-white/30 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white mb-1">No saved items in this category</h3>
            <p className="text-xs text-white/50 max-w-md mx-auto mb-4">
              Explore stays, experiences, or destinations and tap the heart icon to save them here.
            </p>
            <button
              onClick={() => onNavigate && onNavigate('explore')}
              className="btn-saffron text-xs py-2 px-4 rounded-xl"
            >
              Start Exploring
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <div
                key={item._id}
                className="group bg-[#0c111d] border border-white/10 rounded-2xl overflow-hidden shadow-xl flex flex-col justify-between hover:border-rose-500/40 transition-all"
              >
                <div>
                  <div className="relative h-44 overflow-hidden">
                    <img
                      src={item.itemData?.image || 'https://images.unsplash.com/photo-1506461883276-594a12b11cf3?auto=format&fit=crop&w=800&q=80'}
                      alt={item.itemData?.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <button
                      onClick={() => handleRemove(item)}
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-rose-400 hover:text-white transition-colors"
                      title="Remove bookmark"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <span className="absolute bottom-3 left-3 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/60 backdrop-blur-md text-white border border-white/10">
                      {item.itemType}
                    </span>
                  </div>

                  <div className="p-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-white/50">{item.itemData?.location || item.itemData?.subtitle}</span>
                      {item.itemData?.rating > 0 && (
                        <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                          <Star className="w-3 h-3 fill-amber-400" />
                          {item.itemData.rating}
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-bold text-white line-clamp-1 mb-1">{item.itemData?.title}</h3>
                    {item.itemData?.price > 0 && (
                      <span className="text-sm font-bold text-saffron-400 font-mono">
                        {formatMoney(item.itemData.price)}
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-4 border-t border-white/5 bg-black/20 flex items-center justify-end">
                  <button
                    onClick={() => {
                      if (item.itemType === 'stay') onNavigate('stays');
                      else if (item.itemType === 'experience') onNavigate('explore');
                      else if (item.itemType === 'buddy') onNavigate('buddies');
                      else onNavigate('explore');
                    }}
                    className="btn-outline text-xs py-1.5 px-3 rounded-xl flex items-center gap-1.5 font-semibold"
                  >
                    <span>View Details</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

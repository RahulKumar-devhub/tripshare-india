import React, { useState, useEffect } from 'react';
import { 
  Users, Sparkles, Search, Filter, ShieldCheck, Heart, UserPlus, 
  Send, CheckCircle, XCircle, Clock, MessageSquare, ArrowRight, 
  SlidersHorizontal, Check, Compass, Award, ShieldAlert, ChevronRight
} from 'lucide-react';
import { buddiesAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import BuddyCard from '../components/BuddyCard';

export default function TravelBuddy({ 
  onOpenProfile, 
  onOpenConnectModal, 
  onOpenInviteModal,
  onOpenAuth
}) {
  const { user, isAuthenticated, showToast } = useAuth();
  
  // Navigation tabs
  const [activeTab, setActiveTab] = useState('matchmaker'); // 'matchmaker', 'all', 'requests'

  // Matchmaker form state (7 factors)
  const [matchCriteria, setMatchCriteria] = useState({
    pace: 'Early Bird',
    budgetTier: 'Budget Backpacking',
    activity: 'High Altitude Trekking',
    socialStyle: 'Social Explorer',
    spontaneity: 'Balanced',
    dietary: 'Flexible',
    destination: ''
  });

  // Results & lists
  const [matchedBuddies, setMatchedBuddies] = useState([]);
  const [allBuddies, setAllBuddies] = useState([]);
  const [requests, setRequests] = useState({ received: [], sent: [] });
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    if (activeTab === 'matchmaker') {
      runMatchmaker();
    } else if (activeTab === 'all') {
      fetchAllBuddies();
    } else if (activeTab === 'requests' && isAuthenticated) {
      fetchRequests();
    }
  }, [activeTab, isAuthenticated]);

  const runMatchmaker = async () => {
    setLoading(true);
    try {
      const res = await buddiesAPI.match(matchCriteria);
      if (res && res.buddies) {
        setMatchedBuddies(res.buddies);
      }
    } catch (err) {
      console.error('Failed to run matchmaker:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllBuddies = async () => {
    setLoading(true);
    try {
      const res = await buddiesAPI.getAll();
      if (res && res.buddies) {
        setAllBuddies(res.buddies);
      }
    } catch (err) {
      console.error('Failed to load buddies:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await buddiesAPI.getRequests();
      if (res) {
        setRequests({
          received: res.received || [],
          sent: res.sent || []
        });
      }
    } catch (err) {
      console.error('Failed to load buddy requests:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptRequest = async (requestId) => {
    setActionLoading(requestId);
    try {
      await buddiesAPI.respondRequest(requestId, 'accepted');
      showToast('Buddy request accepted! You are now co-travel companions.', 'success');
      fetchRequests();
    } catch (err) {
      showToast(err.message || 'Failed to accept request', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeclineRequest = async (requestId) => {
    setActionLoading(requestId);
    try {
      await buddiesAPI.respondRequest(requestId, 'rejected');
      showToast('Buddy request declined.', 'info');
      fetchRequests();
    } catch (err) {
      showToast(err.message || 'Failed to decline request', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-white pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Title */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-saffron-500/10 border border-saffron-500/20 text-xs font-semibold text-saffron-400 mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>7-Factor Algorithmic Matchmaker</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-display font-extrabold text-white mb-3">
            Find Your Indian Co-Travel Tribe
          </h1>
          <p className="text-neutral-400 text-sm sm:text-base leading-relaxed">
            Never compromise on waking times, food habits, or budget friction. Match with travelers who live the journey at your exact wavelength.
          </p>

          {/* Navigation Pill Switcher */}
          <div className="mt-8 inline-flex p-1.5 rounded-2xl bg-[#0f1422] border border-white/10 shadow-lg">
            <button
              onClick={() => setActiveTab('matchmaker')}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
                activeTab === 'matchmaker'
                  ? 'bg-gradient-to-r from-saffron-500 to-amber-500 text-white shadow-md'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Smart Matchmaker</span>
            </button>

            <button
              onClick={() => setActiveTab('all')}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
                activeTab === 'all'
                  ? 'bg-gradient-to-r from-saffron-500 to-amber-500 text-white shadow-md'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>All Verified Buddies</span>
            </button>

            <button
              onClick={() => {
                if (!isAuthenticated) {
                  onOpenAuth();
                  return;
                }
                setActiveTab('requests');
              }}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
                activeTab === 'requests'
                  ? 'bg-gradient-to-r from-saffron-500 to-amber-500 text-white shadow-md'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Send className="w-4 h-4" />
              <span>My Connect Requests</span>
              {requests.received.length > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-saffron-500 text-[10px] font-bold text-white">
                  {requests.received.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* TAB 1: 7-FACTOR MATCHMAKER */}
        {activeTab === 'matchmaker' && (
          <div>
            {/* Criteria Selector Card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#111728] to-[#0c101a] border border-white/10 shadow-2xl mb-12">
              <div className="flex items-center justify-between pb-6 mb-6 border-b border-white/10">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <SlidersHorizontal className="w-5 h-5 text-saffron-400" />
                    Tune Your Travel Personality Criteria
                  </h3>
                  <p className="text-xs text-neutral-400 mt-1">
                    Adjust factors below to instantly recalibrate real companion compatibility scores.
                  </p>
                </div>
                <button
                  onClick={runMatchmaker}
                  className="px-5 py-2.5 rounded-xl bg-saffron-500 hover:bg-saffron-600 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-saffron-500/25 transition-all"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Recalculate Synergy</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {/* 1. Daily Rhythm */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-2">
                    1. Daily Rhythm & Wake Time
                  </label>
                  <select
                    value={matchCriteria.pace}
                    onChange={(e) => setMatchCriteria({ ...matchCriteria, pace: e.target.value })}
                    className="w-full p-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:border-saffron-500/60 focus:outline-none cursor-pointer"
                  >
                    <option value="Early Bird" className="bg-[#121826]">Early Bird (Sunrise Chasers / 5 AM)</option>
                    <option value="Night Owl" className="bg-[#121826]">Night Owl (Stargazing / Late Nights)</option>
                    <option value="Flexible" className="bg-[#121826]">Easygoing / Flexible</option>
                  </select>
                </div>

                {/* 2. Budget Tier */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-2">
                    2. Budget Philosophy
                  </label>
                  <select
                    value={matchCriteria.budgetTier}
                    onChange={(e) => setMatchCriteria({ ...matchCriteria, budgetTier: e.target.value })}
                    className="w-full p-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:border-saffron-500/60 focus:outline-none cursor-pointer"
                  >
                    <option value="Budget Backpacking" className="bg-[#121826]">Backpacker (Dorms & Dhabas &lt; ₹15k)</option>
                    <option value="Mid-Range Explorer" className="bg-[#121826]">Mid-Range (Homestays & Cabs ₹15k-40k)</option>
                    <option value="Luxury Comfort" className="bg-[#121826]">Comfort & Heritage Resorts (₹40k+)</option>
                  </select>
                </div>

                {/* 3. Primary Activity */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-2">
                    3. Target Activity
                  </label>
                  <select
                    value={matchCriteria.activity}
                    onChange={(e) => setMatchCriteria({ ...matchCriteria, activity: e.target.value })}
                    className="w-full p-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:border-saffron-500/60 focus:outline-none cursor-pointer"
                  >
                    <option value="High Altitude Trekking" className="bg-[#121826]">High Himalayan Trekking</option>
                    <option value="Road Trip" className="bg-[#121826]">Motorbike & Car Road Trip</option>
                    <option value="Beach & Chill" className="bg-[#121826]">Coastal Sunsets & Cafes</option>
                    <option value="Spiritual & Heritage" className="bg-[#121826]">Temples & Sacred Ghats</option>
                    <option value="Wildlife Safari" className="bg-[#121826]">National Parks & Safaris</option>
                  </select>
                </div>

                {/* 4. Social Bandwidth */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-2">
                    4. Social Energy
                  </label>
                  <select
                    value={matchCriteria.socialStyle}
                    onChange={(e) => setMatchCriteria({ ...matchCriteria, socialStyle: e.target.value })}
                    className="w-full p-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:border-saffron-500/60 focus:outline-none cursor-pointer"
                  >
                    <option value="Social Explorer" className="bg-[#121826]">Social Explorer (Loves meeting folks)</option>
                    <option value="Quiet Companion" className="bg-[#121826]">Quiet & Reflective (Deep peaceful vibe)</option>
                    <option value="Party & Nightlife" className="bg-[#121826]">Party & Live Music Scene</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Results Grid */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span>Top Algorithmic Matches</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-saffron-500/20 text-saffron-400 font-mono">
                  {matchedBuddies.length} Found
                </span>
              </h2>
              <span className="text-xs text-neutral-400">
                Sorted by dynamic synergy score
              </span>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-96 rounded-2xl bg-white/5 animate-pulse border border-white/10" />
                ))}
              </div>
            ) : matchedBuddies.length === 0 ? (
              <div className="text-center py-16 bg-[#0e1320] rounded-2xl border border-white/10">
                <Users className="w-12 h-12 text-neutral-500 mx-auto mb-3" />
                <p className="text-neutral-300 font-semibold">No direct matches found</p>
                <p className="text-xs text-neutral-500 mt-1">Try broadening your criteria above.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {matchedBuddies.map((buddy) => (
                  <BuddyCard
                    key={buddy._id}
                    buddy={buddy}
                    onOpenProfile={() => onOpenProfile(buddy)}
                    onConnect={() => onOpenConnectModal ? onOpenConnectModal(buddy) : onOpenProfile(buddy)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: ALL VERIFIED BUDDIES */}
        {activeTab === 'all' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">
                All Verified Indian Travelers
              </h2>
              <span className="text-xs text-neutral-400">
                Aadhaar & Community-Vetted
              </span>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-96 rounded-2xl bg-white/5 animate-pulse border border-white/10" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {allBuddies.map((buddy) => (
                  <BuddyCard
                    key={buddy._id}
                    buddy={buddy}
                    onOpenProfile={() => onOpenProfile(buddy)}
                    onConnect={() => onOpenConnectModal ? onOpenConnectModal(buddy) : onOpenProfile(buddy)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: REQUESTS DASHBOARD */}
        {activeTab === 'requests' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Received Requests */}
            <div className="p-6 rounded-3xl bg-[#0e1320] border border-white/10 shadow-xl">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center justify-between">
                <span>Received Connect Requests</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-saffron-500/20 text-saffron-300 font-mono">
                  {requests.received.length}
                </span>
              </h3>

              {requests.received.length === 0 ? (
                <div className="text-center py-12 border border-white/5 rounded-2xl bg-white/5">
                  <UserPlus className="w-10 h-10 text-neutral-500 mx-auto mb-2" />
                  <p className="text-neutral-400 text-xs">No pending requests received.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {requests.received.map((req) => (
                    <div
                      key={req._id}
                      className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between gap-4"
                    >
                      <div 
                        onClick={() => onOpenProfile(req.sender)}
                        className="flex items-center gap-3 cursor-pointer"
                      >
                        <img
                          src={req.sender?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb'}
                          alt={req.sender?.name}
                          className="w-11 h-11 rounded-full object-cover border border-white/10"
                        />
                        <div>
                          <h4 className="text-sm font-bold text-white hover:text-saffron-400 transition-colors">
                            {req.sender?.name}
                          </h4>
                          <p className="text-xs text-neutral-400 line-clamp-1">
                            {req.message || 'Wants to connect as a travel buddy!'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleAcceptRequest(req._id)}
                          disabled={actionLoading === req._id}
                          className="p-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500 text-emerald-300 hover:text-white border border-emerald-500/30 transition-all"
                          title="Accept"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeclineRequest(req._id)}
                          disabled={actionLoading === req._id}
                          className="p-2 rounded-xl bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-white border border-rose-500/30 transition-all"
                          title="Decline"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Sent Requests */}
            <div className="p-6 rounded-3xl bg-[#0e1320] border border-white/10 shadow-xl">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center justify-between">
                <span>Sent Connect Requests</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-white/10 text-neutral-300 font-mono">
                  {requests.sent.length}
                </span>
              </h3>

              {requests.sent.length === 0 ? (
                <div className="text-center py-12 border border-white/5 rounded-2xl bg-white/5">
                  <Send className="w-10 h-10 text-neutral-500 mx-auto mb-2" />
                  <p className="text-neutral-400 text-xs">You haven't sent any requests yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {requests.sent.map((req) => (
                    <div
                      key={req._id}
                      className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between gap-4"
                    >
                      <div 
                        onClick={() => onOpenProfile(req.recipient)}
                        className="flex items-center gap-3 cursor-pointer"
                      >
                        <img
                          src={req.recipient?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d'}
                          alt={req.recipient?.name}
                          className="w-11 h-11 rounded-full object-cover border border-white/10"
                        />
                        <div>
                          <h4 className="text-sm font-bold text-white hover:text-saffron-400 transition-colors">
                            {req.recipient?.name}
                          </h4>
                          <span className={`text-[11px] px-2 py-0.5 rounded font-mono ${
                            req.status === 'accepted'
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : req.status === 'rejected'
                              ? 'bg-rose-500/20 text-rose-300'
                              : 'bg-amber-500/20 text-amber-300'
                          }`}>
                            {req.status?.toUpperCase()}
                          </span>
                        </div>
                      </div>

                      {req.status === 'accepted' && (
                        <button
                          onClick={() => onOpenInviteModal(req.recipient)}
                          className="px-3 py-1.5 rounded-xl bg-saffron-500 text-white text-xs font-semibold hover:bg-saffron-600 transition-colors"
                        >
                          Invite to Trip
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { 
  Compass, Calendar, MapPin, Users, PlusCircle, CheckCircle, 
  Clock, XCircle, Trash2, ArrowRight, ShieldCheck, Mail
} from 'lucide-react';
import { tripsAPI, invitationsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import TripCard from '../components/TripCard';

export default function MyTrips({ 
  onOpenTripDetail, 
  onOpenCreateTrip, 
  onOpenProfile, 
  onOpenAuth 
}) {
  const { user, isAuthenticated, showToast } = useAuth();

  const [activeTab, setActiveTab] = useState('hosted'); // 'hosted', 'joined', 'invitations'
  const [hostedTrips, setHostedTrips] = useState([]);
  const [joinedTrips, setJoinedTrips] = useState([]);
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      loadMyTripsData();
    }
  }, [isAuthenticated, activeTab]);

  const loadMyTripsData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'hosted') {
        const res = await tripsAPI.getMyHostedTrips();
        if (res && res.trips) setHostedTrips(res.trips);
      } else if (activeTab === 'joined') {
        const res = await tripsAPI.getMyJoinedTrips();
        if (res && res.trips) setJoinedTrips(res.trips);
      } else if (activeTab === 'invitations') {
        const res = await invitationsAPI.getMyInvitations();
        if (res && res.invitations) setInvitations(res.invitations);
      }
    } catch (err) {
      console.error('Failed to load my trips:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRespondInvitation = async (invitationId, status) => {
    setActionLoading(invitationId);
    try {
      await invitationsAPI.respond(invitationId, status);
      showToast(status === 'accepted' ? 'Trip invitation accepted! You joined the expedition.' : 'Invitation declined.', 'success');
      loadMyTripsData();
    } catch (err) {
      showToast(err.message || 'Failed to respond to invitation', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#07090e] text-white pt-36 pb-20 flex items-center justify-center">
        <div className="text-center max-w-md p-8 rounded-3xl bg-[#0e1320] border border-white/10 shadow-2xl">
          <Compass className="w-16 h-16 text-saffron-500 mx-auto mb-4 animate-pulse" />
          <h2 className="text-2xl font-display font-bold text-white mb-2">Sign in to view your expeditions</h2>
          <p className="text-xs text-neutral-400 mb-6">
            Track your hosted trips, ongoing travel buddy expeditions, and incoming trip invitations in one place.
          </p>
          <button
            onClick={onOpenAuth}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-saffron-500 to-amber-500 text-white font-semibold text-sm shadow-lg shadow-saffron-500/25 transition-all"
          >
            Sign In / Register
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#07090e] text-white pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-white">
              My Expeditions & Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-neutral-400 mt-1">
              Manage your hosted journeys, joined itineraries, and co-travel invitations.
            </p>
          </div>

          <button
            onClick={onOpenCreateTrip}
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-saffron-500 to-amber-500 hover:from-saffron-600 hover:to-amber-600 text-white font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-saffron-500/25 transition-all self-start sm:self-auto"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Host New Expedition</span>
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-[#0e1320] border border-white/10 w-fit mb-8 shadow-lg">
          <button
            onClick={() => setActiveTab('hosted')}
            className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'hosted'
                ? 'bg-saffron-500 text-white shadow-md'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Hosted by Me ({hostedTrips.length})
          </button>

          <button
            onClick={() => setActiveTab('joined')}
            className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'joined'
                ? 'bg-saffron-500 text-white shadow-md'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Joined Trips ({joinedTrips.length})
          </button>

          <button
            onClick={() => setActiveTab('invitations')}
            className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'invitations'
                ? 'bg-saffron-500 text-white shadow-md'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Invitations ({invitations.length})</span>
          </button>
        </div>

        {/* Tab Content */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-96 rounded-2xl bg-white/5 animate-pulse border border-white/10" />
            ))}
          </div>
        ) : activeTab === 'hosted' ? (
          hostedTrips.length === 0 ? (
            <div className="text-center py-20 bg-[#0e1320] rounded-3xl border border-white/10 p-8">
              <Compass className="w-12 h-12 text-saffron-500/40 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-white mb-2">You haven't hosted any trips yet</h3>
              <p className="text-xs text-neutral-400 max-w-sm mx-auto mb-6">
                Take the lead! Create an 11-step trip to your dream Indian destination and invite verified companions.
              </p>
              <button
                onClick={onOpenCreateTrip}
                className="px-5 py-2.5 rounded-xl bg-saffron-500 text-white text-xs font-semibold"
              >
                Host an Expedition
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hostedTrips.map(trip => (
                <TripCard
                  key={trip._id}
                  trip={trip}
                  onClick={() => onOpenTripDetail(trip)}
                  onOpenProfile={onOpenProfile}
                />
              ))}
            </div>
          )
        ) : activeTab === 'joined' ? (
          joinedTrips.length === 0 ? (
            <div className="text-center py-20 bg-[#0e1320] rounded-3xl border border-white/10 p-8">
              <Users className="w-12 h-12 text-neutral-500 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-white mb-2">No joined expeditions</h3>
              <p className="text-xs text-neutral-400 max-w-sm mx-auto mb-6">
                Browse ongoing trips created by other travelers and click "Request to Join".
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {joinedTrips.map(trip => (
                <TripCard
                  key={trip._id}
                  trip={trip}
                  onClick={() => onOpenTripDetail(trip)}
                  onOpenProfile={onOpenProfile}
                />
              ))}
            </div>
          )
        ) : (
          /* Invitations Tab */
          invitations.length === 0 ? (
            <div className="text-center py-20 bg-[#0e1320] rounded-3xl border border-white/10 p-8">
              <Mail className="w-12 h-12 text-neutral-500 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-white mb-2">No pending invitations</h3>
              <p className="text-xs text-neutral-400 max-w-sm mx-auto">
                When buddies invite you to their upcoming trips, they will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-4 max-w-3xl">
              {invitations.map(inv => (
                <div
                  key={inv._id}
                  className="p-5 rounded-2xl bg-[#0e1320] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl"
                >
                  <div className="flex items-start gap-4">
                    <img
                      src={inv.sender?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb'}
                      alt={inv.sender?.name}
                      className="w-12 h-12 rounded-full object-cover border border-white/10"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-white">{inv.sender?.name}</h4>
                        <span className="text-xs text-neutral-400">invited you to join:</span>
                      </div>
                      <p 
                        onClick={() => onOpenTripDetail(inv.trip)}
                        className="text-base font-bold text-saffron-400 hover:underline cursor-pointer mt-0.5"
                      >
                        {inv.trip?.title}
                      </p>
                      <p className="text-xs text-neutral-400 mt-1 italic">
                        "{inv.message || 'Hey, let’s travel together on this journey!'}"
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    {inv.status === 'pending' ? (
                      <>
                        <button
                          onClick={() => handleRespondInvitation(inv._id, 'accepted')}
                          disabled={actionLoading === inv._id}
                          className="px-4 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500 text-emerald-300 hover:text-white border border-emerald-500/30 text-xs font-semibold transition-all"
                        >
                          Accept & Join
                        </button>
                        <button
                          onClick={() => handleRespondInvitation(inv._id, 'declined')}
                          disabled={actionLoading === inv._id}
                          className="px-4 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-white border border-rose-500/30 text-xs font-semibold transition-all"
                        >
                          Decline
                        </button>
                      </>
                    ) : (
                      <span className={`px-3 py-1 rounded-xl text-xs font-mono ${
                        inv.status === 'accepted' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-neutral-800 text-neutral-400'
                      }`}>
                        {inv.status?.toUpperCase()}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
}

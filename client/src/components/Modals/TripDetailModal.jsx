import React, { useState } from 'react';
import {
  X,
  MapPin,
  Calendar,
  Clock,
  Users,
  ShieldCheck,
  Send,
  CheckCircle2,
  AlertTriangle,
  Share2,
  Compass,
  ArrowRight
} from 'lucide-react';
import { formatDate, formatMoney, imageUrl, initials } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function TripDetailModal({
  trip,
  onClose,
  onJoin,
  onLeave,
  onInviteBuddy,
  onViewProfile
}) {
  const { user, openAuth, showToast } = useAuth();
  const [actionLoading, setActionLoading] = useState(false);

  if (!trip) return null;

  const isOrganizer = user && String(trip.organizer?._id || trip.organizer) === String(user._id);
  const isMember = user && trip.members?.some((m) => String(m.user?._id || m.user) === String(user._id));
  const memberCount = trip.members?.length || 1;
  const isFull = memberCount >= trip.groupSize;

  const handleJoinClick = async () => {
    if (!user) {
      openAuth('login');
      return;
    }
    setActionLoading(true);
    try {
      await onJoin(trip._id);
    } finally {
      setActionLoading(false);
    }
  };

  const handleLeaveClick = async () => {
    setActionLoading(true);
    try {
      await onLeave(trip._id);
    } finally {
      setActionLoading(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    showToast('Trip link copied to clipboard!', 'success');
  };

  const cover = trip.images?.[0] || 'https://images.unsplash.com/photo-1506461883276-594a12b11cf3?auto=format&fit=crop&w=1200&q=80';

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '780px', padding: 0, overflow: 'hidden' }}
      >
        {/* Hero Header with Imagery */}
        <div style={{ position: 'relative', height: '280px', background: '#0a0e17' }}>
          <img
            src={imageUrl(cover)}
            alt={trip.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(13,19,31,0.95) 100%)' }} />

          {/* Close & Share Top Buttons */}
          <div style={{ position: 'absolute', top: '16px', right: '16px', display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={handleShare}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'rgba(0,0,0,0.6)',
                backdropFilter: 'blur(8px)',
                border: '1px solid var(--border-subtle)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
              title="Share Trip"
            >
              <Share2 size={16} />
            </button>
            <button
              onClick={onClose}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'rgba(0,0,0,0.6)',
                backdropFilter: 'blur(8px)',
                border: '1px solid var(--border-subtle)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <X size={18} />
            </button>
          </div>

          {/* Destination & Title on Hero Bottom */}
          <div style={{ position: 'absolute', bottom: '20px', left: '24px', right: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
              <span className="badge-chip badge-saffron">{trip.travelStyle}</span>
              <span className="badge-chip badge-azure"><MapPin size={12} /> {trip.destination}</span>
            </div>
            <h2 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#ffffff', lineHeight: 1.2 }}>
              {trip.title}
            </h2>
          </div>
        </div>

        {/* Modal Body Container */}
        <div style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          
          {/* Key Metrics Strip */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem', background: 'rgba(255,255,255,0.02)', padding: '1.1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Budget per person</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--saffron)', fontFamily: 'var(--font-display)' }}>
                {formatMoney(trip.budget)}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Dates</div>
              <div style={{ fontSize: '0.92rem', fontWeight: 600, color: '#ffffff' }}>
                {formatDate(trip.startDate)}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>to {formatDate(trip.endDate)}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Group Capacity</div>
              <div style={{ fontSize: '0.92rem', fontWeight: 600, color: '#ffffff' }}>
                {memberCount} / {trip.groupSize} Joined
              </div>
              <div style={{ fontSize: '0.75rem', color: isFull ? '#f87171' : 'var(--emerald)' }}>
                {isFull ? 'Trip is Full' : `${trip.groupSize - memberCount} slots remaining`}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Starting Location</div>
              <div style={{ fontSize: '0.92rem', fontWeight: 600, color: '#ffffff' }}>
                {trip.fromCity}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>to {trip.toCity}</div>
            </div>
          </div>

          {/* Organizer Card */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', background: '#111827', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <div
                onClick={() => onViewProfile && onViewProfile(trip.organizer?._id)}
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #00b4d8 0%, #0077b6 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  color: '#ffffff',
                  overflow: 'hidden',
                  cursor: 'pointer'
                }}
              >
                {trip.organizer?.profileImage ? (
                  <img src={imageUrl(trip.organizer.profileImage)} alt={trip.organizer.fullName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  initials(trip.organizer?.fullName)
                )}
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff' }}>{trip.organizer?.fullName}</span>
                  {trip.organizer?.verified && <ShieldCheck size={15} color="var(--emerald)" />}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Organizer · {trip.organizer?.city} · {trip.organizer?.travelStyle}
                </div>
              </div>
            </div>

            {onViewProfile && (
              <button
                onClick={() => onViewProfile(trip.organizer?._id)}
                className="btn-outline"
                style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem' }}
              >
                View Profile
              </button>
            )}
          </div>

          {/* Description */}
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.6rem' }}>About this Trip</h4>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.7, whiteSpace: 'pre-line' }}>
              {trip.description}
            </p>
          </div>

          {/* Meeting Point */}
          {trip.meetingPoint && (
            <div style={{ background: 'rgba(255, 107, 53, 0.05)', border: '1px solid rgba(255, 107, 53, 0.2)', padding: '0.9rem 1.25rem', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Compass size={20} color="var(--saffron)" />
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--saffron)', textTransform: 'uppercase' }}>Meeting Point</div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 500 }}>{trip.meetingPoint}</div>
              </div>
            </div>
          )}

          {/* Day-by-Day Itinerary Timeline */}
          {trip.itinerary && trip.itinerary.length > 0 && (
            <div>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff', marginBottom: '1rem' }}>
                Day-by-Day Itinerary ({trip.itinerary.length} Days)
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', position: 'relative', paddingLeft: '1.5rem', borderLeft: '2px solid rgba(255, 107, 53, 0.3)' }}>
                {trip.itinerary.map((item, idx) => (
                  <div key={idx} style={{ position: 'relative' }}>
                    <div style={{
                      position: 'absolute',
                      left: '-1.9rem',
                      top: '2px',
                      width: '14px',
                      height: '14px',
                      borderRadius: '50%',
                      background: 'var(--saffron)',
                      border: '3px solid var(--bg-deep)'
                    }} />
                    <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.2rem' }}>
                      Day {item.day || idx + 1}: {item.title}
                    </div>
                    <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                      {item.activity}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Participants Grid */}
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.8rem' }}>
              Travelers in this Gang ({memberCount})
            </h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
              {trip.members?.map((m, idx) => {
                const u = m.user || {};
                return (
                  <div
                    key={idx}
                    onClick={() => onViewProfile && u._id && onViewProfile(u._id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.6rem',
                      background: '#111827',
                      border: '1px solid var(--border-subtle)',
                      padding: '0.45rem 0.85rem',
                      borderRadius: 'var(--radius-full)',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{
                      width: '26px',
                      height: '26px',
                      borderRadius: '50%',
                      background: 'var(--azure)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      color: '#ffffff',
                      overflow: 'hidden'
                    }}>
                      {u.profileImage ? (
                        <img src={imageUrl(u.profileImage)} alt={u.fullName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        initials(u.fullName)
                      )}
                    </div>
                    <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {u.fullName || 'Traveler'}
                    </span>
                    {m.role === 'organizer' && (
                      <span style={{ fontSize: '0.65rem', background: 'var(--saffron-glow)', color: 'var(--saffron)', padding: '0.1rem 0.4rem', borderRadius: '4px', fontWeight: 700 }}>
                        Host
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Action Footer */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem', gap: '1rem' }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Cost to Join</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--saffron)', fontFamily: 'var(--font-display)' }}>
                {formatMoney(trip.budget)}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              {isOrganizer ? (
                <>
                  <button
                    onClick={() => onInviteBuddy && onInviteBuddy(trip)}
                    className="btn-saffron"
                    style={{ padding: '0.65rem 1.25rem', fontSize: '0.88rem' }}
                  >
                    <Send size={15} />
                    <span>Invite a Buddy</span>
                  </button>
                </>
              ) : isMember ? (
                <button
                  onClick={handleLeaveClick}
                  disabled={actionLoading}
                  className="btn-outline"
                  style={{ borderColor: 'rgba(244, 63, 94, 0.4)', color: '#f87171', padding: '0.65rem 1.25rem', fontSize: '0.88rem' }}
                >
                  {actionLoading ? 'Leaving...' : 'Leave Trip'}
                </button>
              ) : isFull ? (
                <button disabled className="btn-outline" style={{ opacity: 0.6 }}>
                  Trip is Full
                </button>
              ) : (
                <button
                  onClick={handleJoinClick}
                  disabled={actionLoading}
                  className="btn-saffron"
                  style={{ padding: '0.65rem 1.5rem', fontSize: '0.92rem' }}
                >
                  {actionLoading ? 'Joining...' : 'Join This Trip'}
                </button>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { MapPin, Calendar, Clock, Users, ArrowRight, ShieldCheck, Heart } from 'lucide-react';
import { formatDate, formatMoney, imageUrl, initials } from '../services/api';

export default function TripCard({
  trip,
  onSelect,
  onJoin,
  onToggleSave,
  isSaved = false,
  isMember = false,
  isOrganizer = false
}) {
  const memberCount = trip.members?.length || 1;
  const isFull = memberCount >= trip.groupSize;
  const coverImage = trip.images?.[0] || 'https://images.unsplash.com/photo-1506461883276-594a12b11cf3?auto=format&fit=crop&w=800&q=80';

  return (
    <div
      className="card-elevated"
      style={{
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      {/* Hero Image Container */}
      <div style={{ position: 'relative', height: '210px', overflow: 'hidden', background: '#0a0e17' }}>
        <img
          src={imageUrl(coverImage)}
          alt={trip.title}
          loading="lazy"
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
          className="trip-card-img"
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(10,14,23,0.85) 100%)' }} />

        {/* Travel Style Badge */}
        <div style={{ position: 'absolute', top: '12px', left: '12px', display: 'flex', gap: '0.4rem' }}>
          <span className="badge-chip badge-saffron">
            {trip.travelStyle}
          </span>
          {isFull ? (
            <span className="badge-chip" style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
              Full
            </span>
          ) : (
            <span className="badge-chip badge-emerald">
              {trip.groupSize - memberCount} slots left
            </span>
          )}
        </div>

        {/* Save Wishlist Button */}
        {onToggleSave && (
          <button
            onClick={(e) => { e.stopPropagation(); onToggleSave(trip._id); }}
            style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              background: 'rgba(0, 0, 0, 0.6)',
              backdropFilter: 'blur(8px)',
              border: '1px solid var(--border-subtle)',
              color: isSaved ? '#f43f5e' : '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
            aria-label="Save Trip"
          >
            <Heart size={16} fill={isSaved ? '#f43f5e' : 'none'} />
          </button>
        )}

        {/* Destination Chip on Image Bottom */}
        <div style={{ position: 'absolute', bottom: '12px', left: '12px', right: '12px', display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#ffffff' }}>
          <MapPin size={15} color="var(--saffron)" />
          <span style={{ fontSize: '0.85rem', fontWeight: 600, textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}>
            {trip.destination}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <h3
          onClick={() => onSelect(trip)}
          style={{
            fontSize: '1.1rem',
            fontWeight: 700,
            color: '#ffffff',
            lineHeight: 1.3,
            marginBottom: '0.6rem',
            cursor: 'pointer'
          }}
          className="hover-saffron"
        >
          {trip.title}
        </h3>

        {/* Route Info & Dates */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '1rem', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Calendar size={14} color="var(--azure)" />
            <span>{formatDate(trip.startDate)} — {formatDate(trip.endDate)}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Clock size={14} color="var(--azure)" />
            <span>{trip.duration || 'Multi-day Trip'} · Ex {trip.fromCity}</span>
          </div>
        </div>

        {/* Organizer & Capacity progress */}
        <div style={{ marginTop: 'auto', paddingTop: '0.85rem', borderTop: '1px solid var(--border-subtle)' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            {/* Organizer Avatar & Name */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                background: '#1e293b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem',
                fontWeight: 700,
                color: '#ffffff',
                overflow: 'hidden'
              }}>
                {trip.organizer?.profileImage ? (
                  <img src={imageUrl(trip.organizer.profileImage)} alt={trip.organizer.fullName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  initials(trip.organizer?.fullName)
                )}
              </div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                {trip.organizer?.fullName?.split(' ')[0] || 'Traveler'}
              </span>
              {trip.organizer?.verified && <ShieldCheck size={13} color="var(--emerald)" />}
            </div>

            {/* Price Tag */}
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--saffron)', fontFamily: 'var(--font-display)' }}>
                {formatMoney(trip.budget)}
              </div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>per person</div>
            </div>
          </div>

          {/* Action Row */}
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => onSelect(trip)}
              className="btn-outline"
              style={{ flex: 1, padding: '0.55rem', fontSize: '0.82rem' }}
            >
              <span>View Itinerary</span>
              <ArrowRight size={14} />
            </button>

            {onJoin && !isMember && !isOrganizer && !isFull && (
              <button
                onClick={(e) => { e.stopPropagation(); onJoin(trip); }}
                className="btn-saffron"
                style={{ padding: '0.55rem 0.9rem', fontSize: '0.82rem' }}
              >
                Join
              </button>
            )}

            {isMember && (
              <span className="badge-chip badge-emerald" style={{ padding: '0.55rem 0.75rem', fontSize: '0.8rem' }}>
                Joined
              </span>
            )}
          </div>

        </div>

      </div>

      <style>{`
        .card-elevated:hover .trip-card-img {
          transform: scale(1.05);
        }
        .hover-saffron:hover {
          color: var(--saffron) !important;
        }
      `}</style>
    </div>
  );
}

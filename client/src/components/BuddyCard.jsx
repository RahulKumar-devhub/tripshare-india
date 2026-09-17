import React, { useState } from 'react';
import {
  MapPin,
  ShieldCheck,
  Sparkles,
  UserPlus,
  Check,
  Clock,
  Luggage,
  Send,
  Eye,
  CheckCheck
} from 'lucide-react';
import { imageUrl, initials, formatMoney } from '../services/api';

export default function BuddyCard({
  match,
  buddy,
  onViewProfile,
  onOpenProfile,
  onConnect,
  onAcceptRequest,
  onInviteToTrip,
  isCurrentUser = false
}) {
  const item = match || buddy || {};
  const user = item.user || (item.fullName ? item : {});
  const compatibility = item.matchScore || item.compatibility || 88;
  const matchReasons = item.matchReasons || [];
  const commonInterests = item.commonInterests || (user.interests || []).slice(0, 3);
  const upcomingTrips = item.upcomingTrips || [];
  const connectionStatus = item.connectionStatus || 'none';
  const handleProfileView = () => {
    if (onViewProfile) onViewProfile(user._id || user);
    else if (onOpenProfile) onOpenProfile(user);
  };
  const [connectLoading, setConnectLoading] = useState(false);

  const handleConnectClick = async () => {
    if (connectLoading) return;
    setConnectLoading(true);
    try {
      if (connectionStatus === 'pending_received' && item.requestId && onAcceptRequest) {
        await onAcceptRequest(item.requestId);
      } else if (onConnect) {
        await onConnect(user._id || user);
      }
    } finally {
      setConnectLoading(false);
    }
  };

  return (
    <div
      className="card-elevated"
      style={{
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
        background: '#0d1322',
        position: 'relative',
        border: compatibility >= 85 ? '1px solid rgba(255, 107, 53, 0.35)' : '1px solid var(--border-subtle)'
      }}
    >
      {/* Top Header: Avatar + Info + Dynamic Compatibility Gauge */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
        
        {/* User Info */}
        <div style={{ display: 'flex', gap: '0.85rem' }}>
          <div
            onClick={handleProfileView}
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #ff7e47 0%, #f25c05 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.15rem',
              fontWeight: 700,
              color: '#ffffff',
              overflow: 'hidden',
              cursor: 'pointer',
              flexShrink: 0,
              boxShadow: '0 4px 14px rgba(0,0,0,0.3)'
            }}
          >
            {user.profileImage ? (
              <img src={imageUrl(user.profileImage)} alt={user.fullName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              initials(user.fullName)
            )}
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <h3
                onClick={handleProfileView}
                style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff', cursor: 'pointer' }}
                className="hover-saffron"
              >
                {user.fullName}
              </h3>
              {user.verified && <ShieldCheck size={16} color="var(--emerald)" />}
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '2px' }}>
              <MapPin size={13} color="var(--saffron)" />
              <span>{user.city}</span>
              <span>·</span>
              <span style={{ color: 'var(--azure)', fontWeight: 600 }}>{user.travelStyle}</span>
            </div>
          </div>
        </div>

        {/* Dynamic Compatibility Score Gauge */}
        <div style={{ textAlign: 'center', flexShrink: 0 }}>
          <div
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '50%',
              background: `conic-gradient(var(--saffron) ${compatibility}%, rgba(255, 255, 255, 0.08) 0)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative'
            }}
          >
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              background: '#0d1322',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.85rem',
              fontWeight: 800,
              fontFamily: 'var(--font-display)',
              color: '#ffffff'
            }}>
              {compatibility}%
            </div>
          </div>
          <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)', marginTop: '3px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Match
          </div>
        </div>

      </div>

      {/* Bio excerpt */}
      {user.bio && (
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
          "{user.bio.length > 120 ? `${user.bio.slice(0, 120)}...` : user.bio}"
        </p>
      )}

      {/* Why You Match Breakdown (Real Database Reasons) */}
      <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
        <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--saffron)', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.45rem' }}>
          <Sparkles size={13} />
          <span>Why you match</span>
        </div>
        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.3rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          {matchReasons.length > 0 ? (
            matchReasons.map((reason, idx) => (
              <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <Check size={13} color="var(--emerald)" />
                <span>{reason}</span>
              </li>
            ))
          ) : (
            <li style={{ color: 'var(--text-muted)' }}>Compatible travel preferences and pace</li>
          )}
        </ul>
      </div>

      {/* Common Interests tags */}
      {user.interests && user.interests.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
          {user.interests.slice(0, 4).map((interest, i) => (
            <span
              key={i}
              className="badge-chip"
              style={{
                background: commonInterests.includes(interest) ? 'rgba(0, 180, 216, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                color: commonInterests.includes(interest) ? '#38bdf8' : 'var(--text-muted)',
                border: commonInterests.includes(interest) ? '1px solid rgba(0, 180, 216, 0.3)' : '1px solid var(--border-subtle)',
                fontSize: '0.72rem'
              }}
            >
              {interest}
            </span>
          ))}
          {user.interests.length > 4 && (
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', alignSelf: 'center' }}>
              +{user.interests.length - 4} more
            </span>
          )}
        </div>
      )}

      {/* Active upcoming trips if any */}
      {upcomingTrips && upcomingTrips.length > 0 && (
        <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.4rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.6rem' }}>
          <Luggage size={14} color="var(--azure)" />
          <span>Heading to <strong>{upcomingTrips[0].destination}</strong></span>
        </div>
      )}

      {/* Actions */}
      <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
        <button
          onClick={handleProfileView}
          className="btn-outline"
          style={{ flex: 1, padding: '0.55rem', fontSize: '0.82rem' }}
        >
          <Eye size={14} />
          <span>Profile</span>
        </button>

        {!isCurrentUser && (
          <>
            {connectionStatus === 'connected' ? (
              <button
                disabled
                className="btn-outline"
                style={{ flex: 1, padding: '0.55rem', fontSize: '0.82rem', borderColor: 'var(--emerald)', color: 'var(--emerald)', background: 'rgba(16, 185, 129, 0.1)' }}
              >
                <CheckCheck size={14} />
                <span>Connected</span>
              </button>
            ) : connectionStatus === 'pending_sent' ? (
              <button
                disabled
                className="btn-outline"
                style={{ flex: 1, padding: '0.55rem', fontSize: '0.82rem', color: 'var(--text-muted)', opacity: 0.8 }}
              >
                <Clock size={14} />
                <span>Requested</span>
              </button>
            ) : connectionStatus === 'pending_received' ? (
              <button
                onClick={handleConnectClick}
                disabled={connectLoading}
                className="btn-saffron"
                style={{ flex: 1, padding: '0.55rem', fontSize: '0.82rem' }}
              >
                <Check size={14} />
                <span>{connectLoading ? 'Accepting...' : 'Accept'}</span>
              </button>
            ) : (
              <button
                onClick={handleConnectClick}
                disabled={connectLoading}
                className="btn-saffron"
                style={{ flex: 1, padding: '0.55rem', fontSize: '0.82rem' }}
              >
                <UserPlus size={14} />
                <span>{connectLoading ? 'Connecting...' : 'Connect'}</span>
              </button>
            )}

            {onInviteToTrip && connectionStatus === 'connected' && (
              <button
                onClick={() => onInviteToTrip(user)}
                className="btn-outline"
                style={{ padding: '0.55rem 0.8rem', fontSize: '0.82rem' }}
                title="Invite to your trip"
              >
                <Send size={14} />
              </button>
            )}
          </>
        )}
      </div>

    </div>
  );
}

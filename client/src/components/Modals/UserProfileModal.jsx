import React, { useState, useEffect } from 'react';
import { X, MapPin, ShieldCheck, Compass, Luggage, Calendar, Heart, Sparkles, Send } from 'lucide-react';
import { api, imageUrl, initials, formatDate, formatMoney } from '../../services/api';

export default function UserProfileModal({ userId, onClose, onSelectTrip, onConnect }) {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      loadProfile();
    }
  }, [userId]);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const data = await api.getUserProfile(userId);
      setProfileData(data);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  if (!userId) return null;

  const user = profileData?.user;
  const createdTrips = profileData?.createdTrips || [];

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '640px', padding: '2rem' }}
      >
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0.5rem' }}>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            Loading traveler profile...
          </div>
        ) : !user ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
            User profile not found.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* Header: Photo + Name + Verified */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              <div style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #00b4d8 0%, #0077b6 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                fontWeight: 800,
                color: '#ffffff',
                overflow: 'hidden',
                flexShrink: 0
              }}>
                {user.profileImage ? (
                  <img src={imageUrl(user.profileImage)} alt={user.fullName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  initials(user.fullName)
                )}
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#ffffff' }}>{user.fullName}</h3>
                  {user.verified && <ShieldCheck size={18} color="var(--emerald)" />}
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '2px' }}>
                  <MapPin size={14} color="var(--saffron)" />
                  <span>{user.city}</span>
                  <span>·</span>
                  <span style={{ color: 'var(--azure)', fontWeight: 600 }}>{user.travelStyle}</span>
                </div>
              </div>
            </div>

            {/* Bio */}
            {user.bio && (
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                "{user.bio}"
              </p>
            )}

            {/* Travel Style & Preferences Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.82rem' }}>
              <div style={{ background: '#111827', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)' }}>
                <span style={{ color: 'var(--text-muted)' }}>Budget Tier:</span>{' '}
                <strong style={{ color: 'var(--saffron)' }}>{user.budgetLevel || 'Moderate'}</strong>
              </div>
              <div style={{ background: '#111827', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)' }}>
                <span style={{ color: 'var(--text-muted)' }}>Adventure Pace:</span>{' '}
                <strong style={{ color: 'var(--azure)' }}>{user.adventureLevel || 'Moderate'}</strong>
              </div>
              <div style={{ background: '#111827', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)' }}>
                <span style={{ color: 'var(--text-muted)' }}>Stay Preference:</span>{' '}
                <strong style={{ color: '#ffffff' }}>{user.accommodationPref || 'Homestays'}</strong>
              </div>
              <div style={{ background: '#111827', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)' }}>
                <span style={{ color: 'var(--text-muted)' }}>Transport:</span>{' '}
                <strong style={{ color: '#ffffff' }}>{user.transportPref || 'Shared Cabs'}</strong>
              </div>
            </div>

            {/* Interests */}
            {user.interests && user.interests.length > 0 && (
              <div>
                <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ffffff', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                  Passions & Interests
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {user.interests.map((item, i) => (
                    <span key={i} className="badge-chip badge-azure">{item}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Bucket List */}
            {user.bucketList && user.bucketList.length > 0 && (
              <div>
                <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ffffff', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                  Indian Bucket List
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {user.bucketList.map((item, i) => (
                    <span key={i} className="badge-chip badge-saffron">{item}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Created Trips */}
            {createdTrips.length > 0 && (
              <div>
                <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ffffff', textTransform: 'uppercase', marginBottom: '0.6rem' }}>
                  Trips Hosted ({createdTrips.length})
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  {createdTrips.map((t) => (
                    <div
                      key={t._id}
                      onClick={() => { onClose(); onSelectTrip(t); }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.75rem 1rem',
                        background: '#111827',
                        borderRadius: 'var(--radius-sm)',
                        cursor: 'pointer',
                        border: '1px solid var(--border-subtle)'
                      }}
                    >
                      <div>
                        <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#ffffff' }}>{t.title}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t.destination} · {formatDate(t.startDate)}</div>
                      </div>
                      <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--saffron)' }}>
                        {formatMoney(t.budget)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
              {onConnect && (
                <button
                  onClick={() => { onConnect(user._id); onClose(); }}
                  className="btn-saffron"
                  style={{ flex: 1 }}
                >
                  <Send size={15} />
                  <span>Send Travel Buddy Request</span>
                </button>
              )}
            </div>

          </div>
        )}

      </div>
    </div>
  );
}

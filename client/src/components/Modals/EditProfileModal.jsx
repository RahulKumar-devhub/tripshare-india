import React, { useState } from 'react';
import { X, Sparkles, Check, AlertCircle } from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const TRAVEL_STYLES = ['Adventure', 'Backpacker', 'Roadtripper', 'Solo Explorer', 'Cultural', 'Weekend Escaper', 'Luxury'];
const BUDGET_LEVELS = ['Budget', 'Moderate', 'Comfort', 'Luxury'];
const ADVENTURE_LEVELS = ['Low', 'Moderate', 'High', 'Extreme'];
const ACCOMMODATIONS = ['Hostels', 'Homestays', 'Boutique Hotels', 'Luxury Resorts', 'Camps'];
const TRANSPORTS = ['Public / Trains', 'Self-Drive / Bikes', 'Flights', 'Shared Cabs'];

const POPULAR_INTERESTS = [
  'Mountains', 'Beaches', 'Trekking', 'Photography', 'Food', 'Nightlife',
  'Culture', 'Spiritual', 'Wildlife', 'Road Trips', 'Camping', 'Heritage'
];

export default function EditProfileModal({ isOpen, onClose }) {
  const { user, refreshUser, showToast } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [fullName, setFullName] = useState(user?.fullName || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [city, setCity] = useState(user?.city || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [travelStyle, setTravelStyle] = useState(user?.travelStyle || 'Adventure');
  const [budgetLevel, setBudgetLevel] = useState(user?.budgetLevel || 'Moderate');
  const [adventureLevel, setAdventureLevel] = useState(user?.adventureLevel || 'Moderate');
  const [accommodationPref, setAccommodationPref] = useState(user?.accommodationPref || 'Homestays');
  const [transportPref, setTransportPref] = useState(user?.transportPref || 'Shared Cabs');
  const [interests, setInterests] = useState(user?.interests || ['Mountains', 'Trekking']);
  const [bucketListStr, setBucketListStr] = useState((user?.bucketList || []).join(', '));
  const [visitedStr, setVisitedStr] = useState((user?.destinationsVisited || []).join(', '));

  if (!isOpen) return null;

  const handleInterestToggle = (item) => {
    setInterests((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.updateProfile({
        fullName,
        phone,
        city,
        bio,
        travelStyle,
        budgetLevel,
        adventureLevel,
        accommodationPref,
        transportPref,
        interests,
        bucketList: bucketListStr.split(',').map((s) => s.trim()).filter(Boolean),
        destinationsVisited: visitedStr.split(',').map((s) => s.trim()).filter(Boolean)
      });
      await refreshUser();
      showToast('Travel profile updated successfully!', 'success');
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '600px', padding: '2rem' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles size={18} color="var(--saffron)" />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff' }}>Edit Travel Profile</h3>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {error && (
          <div style={{ background: 'rgba(244, 63, 94, 0.1)', border: '1px solid rgba(244, 63, 94, 0.3)', color: '#f87171', padding: '0.75rem', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>Full Name</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="input-field"
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>Home City</label>
              <input
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="input-field"
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>Travel Bio</label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell fellow travelers what drives your wanderlust..."
              className="input-field"
              style={{ resize: 'vertical' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>Travel Style</label>
              <select value={travelStyle} onChange={(e) => setTravelStyle(e.target.value)} className="input-field">
                {TRAVEL_STYLES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>Budget Tier</label>
              <select value={budgetLevel} onChange={(e) => setBudgetLevel(e.target.value)} className="input-field">
                {BUDGET_LEVELS.map((b) => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>Accommodation</label>
              <select value={accommodationPref} onChange={(e) => setAccommodationPref(e.target.value)} className="input-field">
                {ACCOMMODATIONS.map((a) => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>Transport Style</label>
              <select value={transportPref} onChange={(e) => setTransportPref(e.target.value)} className="input-field">
                {TRANSPORTS.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>Interests</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
              {POPULAR_INTERESTS.map((item) => {
                const isSelected = interests.includes(item);
                return (
                  <button
                    type="button"
                    key={item}
                    onClick={() => handleInterestToggle(item)}
                    style={{
                      padding: '0.25rem 0.65rem',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.72rem',
                      cursor: 'pointer',
                      background: isSelected ? 'rgba(255,107,53,0.2)' : 'rgba(255,255,255,0.04)',
                      color: isSelected ? 'var(--saffron)' : 'var(--text-muted)',
                      border: isSelected ? '1px solid var(--saffron)' : '1px solid var(--border-subtle)'
                    }}
                  >
                    {item}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
              Bucket List (comma separated destinations)
            </label>
            <input
              type="text"
              value={bucketListStr}
              onChange={(e) => setBucketListStr(e.target.value)}
              placeholder="e.g. Spiti Valley, Meghalaya, Zanskar"
              className="input-field"
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
              Destinations Visited (comma separated)
            </label>
            <input
              type="text"
              value={visitedStr}
              onChange={(e) => setVisitedStr(e.target.value)}
              placeholder="e.g. Goa, Ladakh, Manali, Jaipur"
              className="input-field"
            />
          </div>

          <button type="submit" disabled={loading} className="btn-saffron" style={{ width: '100%', marginTop: '0.5rem' }}>
            {loading ? 'Saving changes...' : 'Save Profile Changes'}
          </button>
        </form>
      </div>
    </div>
  );
}

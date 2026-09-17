import React, { useState, useEffect } from 'react';
import { X, Send, Luggage, CheckCircle2, AlertCircle } from 'lucide-react';
import { api, formatDate, formatMoney } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function InviteBuddyModal({ buddy, isOpen, onClose }) {
  const { showToast } = useAuth();
  const [trips, setTrips] = useState([]);
  const [selectedTripId, setSelectedTripId] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchingTrips, setFetchingTrips] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && buddy) {
      loadMyTrips();
      setMessage(`Hey ${buddy.fullName?.split(' ')[0] || ''}! We'd love for you to join this trip with us!`);
    }
  }, [isOpen, buddy]);

  const loadMyTrips = async () => {
    setFetchingTrips(true);
    try {
      const data = await api.getMyTrips();
      const all = [...(data.organized || []), ...(data.joined || [])];
      setTrips(all);
      if (all.length > 0) setSelectedTripId(all[0]._id);
    } catch {
      // ignore
    } finally {
      setFetchingTrips(false);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!selectedTripId) {
      setError('Please select a trip.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await api.sendTripInvitation({
        tripId: selectedTripId,
        toUserId: buddy._id,
        message
      });
      showToast(`Trip invitation sent to ${buddy.fullName}!`, 'success');
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !buddy) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '480px', padding: '2rem' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Send size={18} color="var(--saffron)" />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff' }}>Invite to Trip</h3>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
          Select one of your active trips to invite <strong>{buddy.fullName}</strong>.
        </p>

        {error && (
          <div style={{ background: 'rgba(244, 63, 94, 0.1)', border: '1px solid rgba(244, 63, 94, 0.3)', color: '#f87171', padding: '0.75rem', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {fetchingTrips ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
            Loading your trips...
          </div>
        ) : trips.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
            <Luggage size={36} style={{ opacity: 0.3, marginBottom: '0.75rem' }} />
            <p style={{ color: 'var(--text-secondary)' }}>You don't have any active trips right now.</p>
            <p style={{ fontSize: '0.8rem' }}>Create or join a trip first, then invite your travel buddies!</p>
          </div>
        ) : (
          <form onSubmit={handleSend} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                Select Trip
              </label>
              <select
                value={selectedTripId}
                onChange={(e) => setSelectedTripId(e.target.value)}
                className="input-field"
              >
                {trips.map((t) => (
                  <option key={t._id} value={t._id}>
                    {t.title} ({t.destination} · {formatDate(t.startDate)})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                Personal Invitation Note
              </label>
              <textarea
                rows={3}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="input-field"
                style={{ resize: 'vertical' }}
              />
            </div>

            <button type="submit" disabled={loading} className="btn-saffron" style={{ width: '100%', marginTop: '0.5rem' }}>
              <Send size={15} />
              <span>{loading ? 'Sending invitation...' : 'Send Trip Invitation'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

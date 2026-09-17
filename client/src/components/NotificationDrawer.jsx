import React, { useState, useEffect } from 'react';
import { X, CheckCheck, Bell, UserPlus, Compass, Heart, CheckCircle2 } from 'lucide-react';
import { api, formatDate } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function NotificationDrawer({ isOpen, onClose, onNavigate }) {
  const { refreshNotifications } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      loadNotifs();
    }
  }, [isOpen]);

  const loadNotifs = async () => {
    setLoading(true);
    try {
      const data = await api.getNotifications();
      setNotifications(data.notifications || []);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await api.markAllNotificationsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      refreshNotifications();
    } catch {
      // ignore
    }
  };

  const handleItemClick = async (notif) => {
    if (!notif.read) {
      try {
        await api.markNotificationRead(notif._id);
        setNotifications((prev) => prev.map((n) => (n._id === notif._id ? { ...n, read: true } : n)));
        refreshNotifications();
      } catch {
        // ignore
      }
    }
    onClose();
    if (notif.type.includes('buddy')) onNavigate('buddy');
    else if (notif.type.includes('trip') || notif.type.includes('invite')) onNavigate('explore');
    else if (notif.type.includes('story')) onNavigate('community');
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="glass-panel"
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: '100%',
          maxWidth: '420px',
          background: '#0a0f1b',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          boxShadow: 'var(--shadow-lg)',
          animation: 'slideInRight 0.25s ease'
        }}
      >
        {/* Header */}
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Bell size={18} color="var(--saffron)" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff' }}>Notifications</h3>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              onClick={handleMarkAllRead}
              className="btn-ghost"
              style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}
              title="Mark all as read"
            >
              <CheckCheck size={16} />
              <span>Read All</span>
            </button>
            <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
              <X size={20} />
            </button>
          </div>
        </div>

        {/* List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
              Loading alerts...
            </div>
          ) : notifications.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 1.5rem', color: 'var(--text-muted)' }}>
              <Bell size={40} style={{ opacity: 0.3, marginBottom: '1rem' }} />
              <h4 style={{ color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>All caught up!</h4>
              <p style={{ fontSize: '0.85rem' }}>When travelers connect with you or invite you to trips, updates will appear here.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {notifications.map((notif) => {
                return (
                  <div
                    key={notif._id}
                    onClick={() => handleItemClick(notif)}
                    style={{
                      padding: '0.9rem 1rem',
                      borderRadius: 'var(--radius-sm)',
                      background: notif.read ? 'rgba(255, 255, 255, 0.02)' : 'rgba(255, 107, 53, 0.07)',
                      border: notif.read ? '1px solid var(--border-subtle)' : '1px solid rgba(255, 107, 53, 0.25)',
                      cursor: 'pointer',
                      transition: 'background 0.2s ease',
                      position: 'relative'
                    }}
                  >
                    {!notif.read && (
                      <span style={{
                        position: 'absolute',
                        top: '1rem',
                        right: '1rem',
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: 'var(--saffron)'
                      }} />
                    )}
                    <div style={{ fontSize: '0.88rem', fontWeight: 600, color: notif.read ? 'var(--text-primary)' : 'var(--saffron)', marginBottom: '0.2rem' }}>
                      {notif.title}
                    </div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.4, marginBottom: '0.4rem' }}>
                      {notif.message}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      {formatDate(notif.createdAt)}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

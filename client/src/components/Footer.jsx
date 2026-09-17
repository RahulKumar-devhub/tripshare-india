import React from 'react';
import { Compass, ShieldCheck, Heart, MapPin, Users, BookOpen } from 'lucide-react';

export default function Footer({ setActiveView }) {
  const navigate = (view) => {
    setActiveView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer style={{ background: '#04070d', borderTop: '1px solid var(--border-subtle)', padding: '4.5rem 0 2.5rem 0', marginTop: '5rem' }}>
      <div className="container-custom">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '3rem', marginBottom: '3.5rem' }}>
          
          {/* Brand Col */}
          <div style={{ maxWidth: '340px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #ff7e47 0%, #f25c05 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Compass color="#ffffff" size={20} />
              </div>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 800, color: '#ffffff' }}>
                TripShare <span style={{ color: 'var(--saffron)' }}>India</span>
              </span>
            </div>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
              India's premier travel companion and trip discovery platform. Connecting passionate travelers, road trippers, and alpine explorers across the subcontinent.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--emerald)' }}>
              <ShieldCheck size={16} />
              <span>100% Real Database-Backed & Verified</span>
            </div>
          </div>

          {/* Subcontinent Trails */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff', marginBottom: '1.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Iconic Routes
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <li>
                <button onClick={() => navigate('explore')} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: '0.88rem', cursor: 'pointer', textAlign: 'left' }}>
                  Spiti Valley Circuit
                </button>
              </li>
              <li>
                <button onClick={() => navigate('explore')} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: '0.88rem', cursor: 'pointer', textAlign: 'left' }}>
                  Ladakh & Pangong Tso
                </button>
              </li>
              <li>
                <button onClick={() => navigate('explore')} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: '0.88rem', cursor: 'pointer', textAlign: 'left' }}>
                  Meghalaya Rainforest Trek
                </button>
              </li>
              <li>
                <button onClick={() => navigate('explore')} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: '0.88rem', cursor: 'pointer', textAlign: 'left' }}>
                  South Goa Coastal Trail
                </button>
              </li>
              <li>
                <button onClick={() => navigate('explore')} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: '0.88rem', cursor: 'pointer', textAlign: 'left' }}>
                  Varanasi Sacred River Ghats
                </button>
              </li>
            </ul>
          </div>

          {/* Product Links */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff', marginBottom: '1.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Platform
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <li>
                <button onClick={() => navigate('explore')} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: '0.88rem', cursor: 'pointer', textAlign: 'left' }}>
                  Browse All Trips
                </button>
              </li>
              <li>
                <button onClick={() => navigate('buddy')} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: '0.88rem', cursor: 'pointer', textAlign: 'left' }}>
                  Find Travel Buddy
                </button>
              </li>
              <li>
                <button onClick={() => navigate('destinations')} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: '0.88rem', cursor: 'pointer', textAlign: 'left' }}>
                  Destination Guides
                </button>
              </li>
              <li>
                <button onClick={() => navigate('community')} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: '0.88rem', cursor: 'pointer', textAlign: 'left' }}>
                  Community Stories
                </button>
              </li>
            </ul>
          </div>

          {/* Trust & Safety */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff', marginBottom: '1.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Safety & Standards
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '1rem' }}>
              TripShare India enforces privacy-first connect requests. Contact details remain strictly protected until mutual connection acceptance.
            </p>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Built for curious travelers across India · © 2026 TripShare India
            </div>
          </div>

        </div>

        <div style={{
          paddingTop: '2rem',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          fontSize: '0.82rem',
          color: 'var(--text-muted)'
        }}>
          <div>
            "Travel is not just about the destination, but the kindred spirits you share the road with."
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span>Made with passion for India</span>
            <Heart size={14} color="var(--saffron)" fill="var(--saffron)" />
          </div>
        </div>
      </div>
    </footer>
  );
}

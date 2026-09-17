import React, { useState } from 'react';
import {
  X,
  ArrowRight,
  ArrowLeft,
  Check,
  Calendar,
  MapPin,
  IndianRupee,
  Compass,
  Users,
  Image as ImageIcon,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { api, formatMoney, formatDate } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const CURATED_DESTINATIONS = [
  'Spiti Valley, Himachal Pradesh',
  'Ladakh (Leh, Pangong & Nubra)',
  'Meghalaya (Cherrapunji & Dawki)',
  'South Goa Coastal Trail',
  'Kashmir Valley & Great Lakes',
  'Varanasi Sacred River Ghats',
  'Jaipur & Thar Desert Safari',
  'Kerala Backwaters & Munnar',
  'Rishikesh & Garhwal Himalayas',
  'Andaman & Nicobar Islands'
];

const CURATED_IMAGES = [
  'https://images.unsplash.com/photo-1578592080911-2902377f49c4?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1506461883276-594a12b11cf3?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1605649487212-47bdab064df8?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80'
];

const TRAVEL_STYLES = [
  'Adventure', 'Backpacker', 'Roadtripper', 'Solo Explorer', 'Cultural', 'Weekend Escaper', 'Luxury'
];

const INTEREST_OPTIONS = [
  'Mountains', 'Beaches', 'Trekking', 'Photography', 'Food', 'Nightlife',
  'Culture', 'Spiritual', 'Wildlife', 'Road Trips', 'Camping', 'Heritage'
];

export default function CreateTripModal({ isOpen, onClose, onTripCreated }) {
  const { user, showToast } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form state
  const [destination, setDestination] = useState('Spiti Valley, Himachal Pradesh');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [fromCity, setFromCity] = useState(user?.city || 'Delhi');
  const [toCity, setToCity] = useState('Kaza');
  const [meetingPoint, setMeetingPoint] = useState('Central ISBT / Airport Terminal');
  const [budget, setBudget] = useState(15000);
  const [travelStyle, setTravelStyle] = useState('Adventure');
  const [interests, setInterests] = useState(['Mountains', 'Trekking', 'Photography']);
  const [groupSize, setGroupSize] = useState(6);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedImage, setSelectedImage] = useState(CURATED_IMAGES[0]);
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [itinerary, setItinerary] = useState([
    { day: 1, title: 'Arrival & Gathering', activity: 'Meet fellow travelers, briefing, and evening welcome meal.' },
    { day: 2, title: 'Trail Exploration', activity: 'Main hike and sightseeing.' }
  ]);

  if (!isOpen) return null;

  const totalSteps = 11;

  const handleInterestToggle = (item) => {
    setInterests((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const handleAddItineraryDay = () => {
    setItinerary((prev) => [
      ...prev,
      { day: prev.length + 1, title: `Day ${prev.length + 1} Activity`, activity: 'Explore local sights and trails.' }
    ]);
  };

  const handleItineraryChange = (index, field, value) => {
    setItinerary((prev) => {
      const copy = [...prev];
      copy[index][field] = value;
      return copy;
    });
  };

  const validateCurrentStep = () => {
    setError('');
    if (step === 1 && !destination.trim()) {
      setError('Please choose or enter a destination.');
      return false;
    }
    if (step === 2) {
      if (!startDate || !endDate) {
        setError('Please select both start and end dates.');
        return false;
      }
      if (new Date(endDate) < new Date(startDate)) {
        setError('End date cannot be before start date.');
        return false;
      }
    }
    if (step === 3 && (!fromCity.trim() || !toCity.trim())) {
      setError('Starting location and destination city are required.');
      return false;
    }
    if (step === 4 && (!budget || budget <= 0)) {
      setError('Please provide a valid budget per person in INR.');
      return false;
    }
    if (step === 6 && interests.length === 0) {
      setError('Please choose at least one travel interest.');
      return false;
    }
    if (step === 8) {
      if (!title.trim() || title.length < 5) {
        setError('Trip title must be at least 5 characters long.');
        return false;
      }
      if (!description.trim() || description.length < 20) {
        setError('Please describe your trip plan (at least 20 characters).');
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      setStep((s) => Math.min(totalSteps, s + 1));
    }
  };

  const handleBack = () => {
    setError('');
    setStep((s) => Math.max(1, s - 1));
  };

  const handlePublish = async () => {
    setLoading(true);
    setError('');

    const finalImage = customImageUrl.trim() || selectedImage;
    const diffDays = Math.max(1, Math.round((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)));
    const calculatedDuration = `${diffDays} Days / ${Math.max(0, diffDays - 1)} Nights`;

    try {
      const payload = {
        title: title.trim(),
        destination: destination.trim(),
        fromCity: fromCity.trim(),
        toCity: toCity.trim(),
        startDate,
        endDate,
        duration: calculatedDuration,
        budget: Number(budget),
        travelStyle,
        interests,
        groupSize: Number(groupSize),
        description: description.trim(),
        itinerary,
        meetingPoint: meetingPoint.trim(),
        images: [finalImage],
        tags: [destination.split(',')[0].trim().toLowerCase(), travelStyle.toLowerCase()]
      };

      const res = await api.createTrip(payload);
      showToast('Trip published successfully to MongoDB!', 'success');
      if (onTripCreated) onTripCreated(res.trip);
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
        style={{ maxWidth: '640px', padding: '2rem' }}
      >
        {/* Header & Progress */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--saffron)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Step {step} of {totalSteps}
              </span>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', marginTop: '2px' }}>
                {step === 1 && 'Where are you traveling?'}
                {step === 2 && 'When is your journey?'}
                {step === 3 && 'Departure & Meeting Hub'}
                {step === 4 && 'Trip Budget per Person'}
                {step === 5 && 'Select Travel Style'}
                {step === 6 && 'Interests & Vibe'}
                {step === 7 && 'Gang Size'}
                {step === 8 && 'Trip Title & Description'}
                {step === 9 && 'Day-by-Day Plan'}
                {step === 10 && 'Cover Photo'}
                {step === 11 && 'Review & Publish to MongoDB'}
              </h3>
            </div>
            <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
              <X size={20} />
            </button>
          </div>

          {/* Progress Bar */}
          <div style={{ height: '4px', background: 'rgba(255,255,255,0.08)', borderRadius: '2px', overflow: 'hidden' }}>
            <div
              style={{
                height: '100%',
                width: `${(step / totalSteps) * 100}%`,
                background: 'linear-gradient(90deg, #ff7e47, #f25c05)',
                transition: 'width 0.3s ease'
              }}
            />
          </div>
        </div>

        {error && (
          <div style={{ background: 'rgba(244, 63, 94, 0.1)', border: '1px solid rgba(244, 63, 94, 0.3)', color: '#f87171', padding: '0.75rem', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* STEP 1: DESTINATION */}
        {step === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Type or pick an iconic Indian travel destination:
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Spiti Valley, Himachal Pradesh"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="input-field"
            />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.5rem' }}>
              {CURATED_DESTINATIONS.map((dest) => (
                <button
                  type="button"
                  key={dest}
                  onClick={() => setDestination(dest)}
                  style={{
                    padding: '0.35rem 0.75rem',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.78rem',
                    cursor: 'pointer',
                    background: destination === dest ? 'rgba(255, 107, 53, 0.2)' : 'rgba(255,255,255,0.04)',
                    color: destination === dest ? 'var(--saffron)' : 'var(--text-secondary)',
                    border: destination === dest ? '1px solid var(--saffron)' : '1px solid var(--border-subtle)'
                  }}
                >
                  {dest}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2: DATES */}
        {step === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                  Departure Date
                </label>
                <input
                  type="date"
                  required
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="input-field"
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                  Return Date
                </label>
                <input
                  type="date"
                  required
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="input-field"
                />
              </div>
            </div>
            {startDate && endDate && (
              <div style={{ background: 'rgba(0,180,216,0.1)', border: '1px solid rgba(0,180,216,0.25)', padding: '0.85rem', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Calendar size={16} />
                <span>Estimated duration: {Math.max(1, Math.round((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)))} Days</span>
              </div>
            )}
          </div>
        )}

        {/* STEP 3: STARTING LOCATION */}
        {step === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                  From City (Origin)
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Delhi / Chandigarh"
                  value={fromCity}
                  onChange={(e) => setFromCity(e.target.value)}
                  className="input-field"
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                  To City / Basecamp
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kaza / Leh"
                  value={toCity}
                  onChange={(e) => setToCity(e.target.value)}
                  className="input-field"
                />
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                Exact Meeting Point
              </label>
              <input
                type="text"
                placeholder="e.g. Chandigarh ISBT Sector 17, Counter 4 at 06:00 AM"
                value={meetingPoint}
                onChange={(e) => setMeetingPoint(e.target.value)}
                className="input-field"
              />
            </div>
          </div>
        )}

        {/* STEP 4: BUDGET */}
        {step === 4 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                Estimated Cost per Person (₹)
              </label>
              <input
                type="number"
                min="500"
                step="500"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="input-field"
                style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--saffron)' }}
              />
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {[8000, 12500, 18500, 25000, 35000].map((amt) => (
                <button
                  type="button"
                  key={amt}
                  onClick={() => setBudget(amt)}
                  style={{
                    padding: '0.4rem 0.85rem',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    background: Number(budget) === amt ? 'var(--saffron)' : 'rgba(255,255,255,0.05)',
                    color: '#ffffff',
                    border: 'none'
                  }}
                >
                  {formatMoney(amt)}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 5: TRAVEL STYLE */}
        {step === 5 && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            {TRAVEL_STYLES.map((style) => (
              <button
                type="button"
                key={style}
                onClick={() => setTravelStyle(style)}
                style={{
                  padding: '1rem',
                  borderRadius: 'var(--radius-sm)',
                  textAlign: 'left',
                  cursor: 'pointer',
                  background: travelStyle === style ? 'rgba(255,107,53,0.15)' : 'rgba(255,255,255,0.03)',
                  border: travelStyle === style ? '1px solid var(--saffron)' : '1px solid var(--border-subtle)',
                  color: travelStyle === style ? 'var(--saffron)' : 'var(--text-primary)',
                  fontWeight: 600,
                  fontSize: '0.92rem'
                }}
              >
                {style}
              </button>
            ))}
          </div>
        )}

        {/* STEP 6: INTERESTS */}
        {step === 6 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {INTEREST_OPTIONS.map((item) => {
              const isSelected = interests.includes(item);
              return (
                <button
                  type="button"
                  key={item}
                  onClick={() => handleInterestToggle(item)}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    background: isSelected ? 'rgba(255, 107, 53, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                    color: isSelected ? 'var(--saffron)' : 'var(--text-secondary)',
                    border: isSelected ? '1px solid var(--saffron)' : '1px solid var(--border-subtle)',
                    fontWeight: isSelected ? 600 : 400
                  }}
                >
                  {item}
                </button>
              );
            })}
          </div>
        )}

        {/* STEP 7: GROUP SIZE */}
        {step === 7 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Maximum travelers in this group (including you):
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <input
                type="range"
                min="2"
                max="20"
                value={groupSize}
                onChange={(e) => setGroupSize(Number(e.target.value))}
                style={{ flex: 1, accentColor: 'var(--saffron)' }}
              />
              <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--saffron)', minWidth: '40px' }}>
                {groupSize}
              </span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Small groups (4-8 people) tend to match 3x faster and have the highest completion rates.
            </p>
          </div>
        )}

        {/* STEP 8: TITLE & DESCRIPTION */}
        {step === 8 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                Trip Title
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Spiti Valley Circuit: High Mountain Passes & Stargazing"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="input-field"
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                Trip Description & Highlights
              </label>
              <textarea
                required
                rows={4}
                placeholder="Describe your itinerary, accommodation, transportation style, and what fellow travelers should bring..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="input-field"
                style={{ resize: 'vertical' }}
              />
            </div>
          </div>
        )}

        {/* STEP 9: ITINERARY BUILDER */}
        {step === 9 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '380px', overflowY: 'auto' }}>
            {itinerary.map((item, idx) => (
              <div key={idx} style={{ background: '#111827', padding: '0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--saffron)' }}>Day {item.day}</span>
                </div>
                <input
                  type="text"
                  placeholder="Day Title (e.g. Drive to Kalpa)"
                  value={item.title}
                  onChange={(e) => handleItineraryChange(idx, 'title', e.target.value)}
                  className="input-field"
                  style={{ padding: '0.4rem 0.65rem', fontSize: '0.85rem' }}
                />
                <textarea
                  rows={2}
                  placeholder="Day Activity description..."
                  value={item.activity}
                  onChange={(e) => handleItineraryChange(idx, 'activity', e.target.value)}
                  className="input-field"
                  style={{ padding: '0.4rem 0.65rem', fontSize: '0.82rem', resize: 'vertical' }}
                />
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddItineraryDay}
              className="btn-outline"
              style={{ padding: '0.5rem', fontSize: '0.82rem' }}
            >
              + Add Day {itinerary.length + 1}
            </button>
          </div>
        )}

        {/* STEP 10: IMAGES */}
        {step === 10 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Select a cover photo or enter an image URL:
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
              {CURATED_IMAGES.map((imgUrl, i) => (
                <div
                  key={i}
                  onClick={() => setSelectedImage(imgUrl)}
                  style={{
                    height: '75px',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    border: selectedImage === imgUrl ? '2px solid var(--saffron)' : '1px solid var(--border-subtle)',
                    opacity: selectedImage === imgUrl ? 1 : 0.6
                  }}
                >
                  <img src={imgUrl} alt="Thumbnail" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ))}
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                Or paste custom Image URL:
              </label>
              <input
                type="url"
                placeholder="https://images.unsplash.com/..."
                value={customImageUrl}
                onChange={(e) => setCustomImageUrl(e.target.value)}
                className="input-field"
              />
            </div>
          </div>
        )}

        {/* STEP 11: REVIEW & PUBLISH */}
        {step === 11 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', background: '#0a0e18', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff' }}>{title || 'Untitled Trip'}</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.85rem' }}>
              <div><strong style={{ color: 'var(--text-muted)' }}>Destination:</strong> <span style={{ color: '#fff' }}>{destination}</span></div>
              <div><strong style={{ color: 'var(--text-muted)' }}>Budget:</strong> <span style={{ color: 'var(--saffron)' }}>{formatMoney(budget)} / person</span></div>
              <div><strong style={{ color: 'var(--text-muted)' }}>Dates:</strong> <span style={{ color: '#fff' }}>{formatDate(startDate)} – {formatDate(endDate)}</span></div>
              <div><strong style={{ color: 'var(--text-muted)' }}>Route:</strong> <span style={{ color: '#fff' }}>{fromCity} → {toCity}</span></div>
              <div><strong style={{ color: 'var(--text-muted)' }}>Style:</strong> <span style={{ color: 'var(--azure)' }}>{travelStyle}</span></div>
              <div><strong style={{ color: 'var(--text-muted)' }}>Group Size:</strong> <span style={{ color: '#fff' }}>Up to {groupSize} Travelers</span></div>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
              {description}
            </p>
          </div>
        )}

        {/* Navigation Buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.75rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
          {step > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              className="btn-outline"
              style={{ padding: '0.6rem 1.25rem' }}
            >
              <ArrowLeft size={16} />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {step < totalSteps ? (
            <button
              type="button"
              onClick={handleNext}
              className="btn-saffron"
              style={{ padding: '0.6rem 1.4rem' }}
            >
              <span>Next</span>
              <ArrowRight size={16} />
            </button>
          ) : (
            <button
              type="button"
              onClick={handlePublish}
              disabled={loading}
              className="btn-saffron"
              style={{ padding: '0.6rem 1.6rem', fontSize: '0.95rem' }}
            >
              <Sparkles size={16} />
              <span>{loading ? 'Publishing to MongoDB...' : 'Publish Trip to India'}</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
}

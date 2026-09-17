import React, { useState, useEffect } from 'react';
import { 
  MapPin, Calendar, Clock, Users, Star, ShieldCheck, 
  Check, X, Heart, Share2, Sparkles, ChevronLeft, ArrowRight,
  Compass, AlertTriangle, Shield, CheckCircle2
} from 'lucide-react';
import { experiencesAPI, savedAPI, formatMoney, formatDate } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function ExperienceDetail({
  experienceId,
  onBack,
  onOpenBooking
}) {
  const { isAuthenticated, showToast } = useAuth();

  const [experience, setExperience] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState('');
  const [guestsCount, setGuestsCount] = useState(1);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (experienceId) {
      loadExperience();
    }
  }, [experienceId]);

  const loadExperience = async () => {
    setLoading(true);
    try {
      const res = await experiencesAPI.getById(experienceId);
      if (res.success && res.event) {
        setExperience(res.event);
        setSelectedImage(res.event.image);
      }
    } catch (err) {
      console.error('Failed to load experience details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSave = async () => {
    if (!isAuthenticated) {
      showToast('Please login to bookmark experiences', 'info');
      return;
    }
    try {
      const res = await savedAPI.toggle({
        itemType: 'experience',
        itemId: experience._id,
        itemData: {
          title: experience.title,
          subtitle: `${experience.category} in ${experience.city}`,
          image: experience.image,
          price: experience.price,
          rating: experience.rating,
          location: experience.city
        }
      });
      if (res.success) {
        setIsSaved(res.saved);
        showToast(res.saved ? 'Saved to wishlist!' : 'Removed from wishlist', 'info');
      }
    } catch (err) {
      showToast('Could not save experience', 'error');
    }
  };

  if (loading || !experience) {
    return (
      <div className="min-h-screen bg-[#060910] text-white pt-32 pb-20 flex items-center justify-center">
        <div className="text-center text-xs text-white/50 flex items-center gap-2">
          <span className="w-4 h-4 border-2 border-saffron-500 border-t-transparent rounded-full animate-spin" />
          <span>Loading expedition details...</span>
        </div>
      </div>
    );
  }

  const galleryImages = [
    experience.image,
    ...(experience.gallery || [])
  ].filter(Boolean);

  const totalPrice = (experience.price || 0) * guestsCount;

  return (
    <div className="min-h-screen bg-[#060910] text-white pt-24 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Bar */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBack}
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-white flex items-center gap-2 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to Experiences</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleSave}
              className={`p-2.5 rounded-xl border border-white/10 transition-colors ${
                isSaved ? 'bg-rose-500/20 text-rose-400 border-rose-500/40' : 'bg-white/5 hover:bg-white/10 text-white'
              }`}
            >
              <Heart className={`w-4 h-4 ${isSaved ? 'fill-rose-400' : ''}`} />
            </button>
          </div>
        </div>

        {/* Title & Metadata */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-saffron-500 text-white">
              {experience.category}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/5 border border-white/10 text-white/70">
              {experience.difficulty || 'Moderate'}
            </span>
            <div className="flex items-center gap-1 text-amber-400 text-xs font-bold ml-2">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span>{experience.rating}</span>
              <span className="text-white/40 font-normal">({experience.reviewCount || 24} reviews)</span>
            </div>
          </div>

          <h1 className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight mb-2">
            {experience.title}
          </h1>

          <p className="text-xs sm:text-sm text-white/60 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-saffron-400" />
            <span>{experience.venue}, {experience.city}, India</span>
            <span>•</span>
            <span>Organised by <strong className="text-white">{experience.organiser}</strong></span>
          </p>
        </div>

        {/* Photo Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 mb-12 rounded-3xl overflow-hidden border border-white/10">
          <div className="md:col-span-8 h-[340px] sm:h-[460px] overflow-hidden relative">
            <img
              src={selectedImage || experience.image}
              alt={experience.title}
              className="w-full h-full object-cover transition-all duration-500"
            />
          </div>

          <div className="md:col-span-4 grid grid-cols-2 md:grid-cols-1 gap-3 h-full">
            {galleryImages.slice(0, 3).map((img, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedImage(img)}
                className={`h-40 sm:h-36 rounded-xl overflow-hidden cursor-pointer border transition-all ${
                  selectedImage === img ? 'border-saffron-500' : 'border-white/10 hover:border-white/30'
                }`}
              >
                <img src={img} alt="Gallery" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* Two-Column Layout: Details + Sticky Booking Widget */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Details, Itinerary, Inclusions */}
          <div className="lg:col-span-8 space-y-10">
            {/* Quick Spec Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-4 bg-[#0c111d] border border-white/10 rounded-2xl">
                <Clock className="w-4 h-4 text-azure-400 mb-1" />
                <span className="text-[10px] text-white/40 uppercase font-bold block">Duration</span>
                <span className="text-xs font-bold text-white">{experience.duration}</span>
              </div>

              <div className="p-4 bg-[#0c111d] border border-white/10 rounded-2xl">
                <Users className="w-4 h-4 text-saffron-400 mb-1" />
                <span className="text-[10px] text-white/40 uppercase font-bold block">Group Size</span>
                <span className="text-xs font-bold text-white">Up to {experience.totalSeats} Explorers</span>
              </div>

              <div className="p-4 bg-[#0c111d] border border-white/10 rounded-2xl">
                <Sparkles className="w-4 h-4 text-amber-400 mb-1" />
                <span className="text-[10px] text-white/40 uppercase font-bold block">Age Limit</span>
                <span className="text-xs font-bold text-white">{experience.ageLimit}</span>
              </div>

              <div className="p-4 bg-[#0c111d] border border-white/10 rounded-2xl">
                <ShieldCheck className="w-4 h-4 text-emerald-400 mb-1" />
                <span className="text-[10px] text-white/40 uppercase font-bold block">Available Seats</span>
                <span className="text-xs font-bold text-emerald-400">{experience.availableSeats} Remaining</span>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-3">
              <h2 className="text-xl font-bold text-white">Overview</h2>
              <p className="text-xs sm:text-sm text-white/70 leading-relaxed">
                {experience.description}
              </p>
            </div>

            {/* Highlights */}
            {experience.highlights?.length > 0 && (
              <div className="space-y-3">
                <h2 className="text-xl font-bold text-white">Expedition Highlights</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {experience.highlights.map((h, i) => (
                    <div key={i} className="p-3 bg-white/5 border border-white/5 rounded-xl flex items-start gap-2.5 text-xs text-white/90">
                      <CheckCircle2 className="w-4 h-4 text-saffron-400 flex-shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Itinerary Timeline */}
            {experience.itineraryTimeline?.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-white">Detailed Day-by-Day Itinerary</h2>
                <div className="space-y-4">
                  {experience.itineraryTimeline.map((item, idx) => (
                    <div key={idx} className="p-5 bg-[#0c111d] border border-white/10 rounded-2xl relative pl-6 border-l-4 border-l-saffron-500">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-saffron-400 block mb-1">
                        Day {item.day}
                      </span>
                      <h4 className="text-sm font-bold text-white mb-1.5">{item.title}</h4>
                      <p className="text-xs text-white/60 leading-relaxed">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* What's Included / What's Excluded */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Included */}
              <div className="p-6 bg-[#0c111d] border border-white/10 rounded-3xl space-y-3">
                <h3 className="text-sm font-bold text-emerald-400 flex items-center gap-2">
                  <Check className="w-4 h-4" /> What's Included
                </h3>
                <ul className="space-y-2 text-xs text-white/70">
                  {(experience.included || [
                    'Wilderness First Responder certified leader',
                    'All permits and entry tickets',
                    'High-grade camping / activity equipment'
                  ]).map((inc, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                      <span>{inc}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Excluded */}
              <div className="p-6 bg-[#0c111d] border border-white/10 rounded-3xl space-y-3">
                <h3 className="text-sm font-bold text-rose-400 flex items-center gap-2">
                  <X className="w-4 h-4" /> What's Excluded
                </h3>
                <ul className="space-y-2 text-xs text-white/70">
                  {(experience.excluded || [
                    'Personal travel to base location',
                    'Personal trekking shoes / clothing',
                    'Personal expenses & insurance'
                  ]).map((exc, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 flex-shrink-0" />
                      <span>{exc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Safety & Cancellation Guidelines */}
            <div className="p-6 bg-[#0c111d] border border-white/10 rounded-3xl space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Shield className="w-4 h-4 text-azure-400" /> Safety & Cancellation Guidelines
              </h3>
              <p className="text-xs text-white/70 leading-relaxed">
                {experience.cancellationPolicy || 'Full refund if cancelled up to 48 hours before the start time.'}
              </p>
              {experience.safetyTips?.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-amber-400 block">Safety Protocol:</span>
                  {experience.safetyTips.map((tip, idx) => (
                    <p key={idx} className="text-xs text-white/60 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                      <span>{tip}</span>
                    </p>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Sticky Booking Widget */}
          <div className="lg:col-span-4">
            <div className="sticky top-32 bg-[#0c111d] border border-white/15 p-6 rounded-3xl shadow-2xl space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <span className="text-[10px] text-white/40 uppercase font-bold block">Expedition Rate</span>
                  <span className="text-2xl font-display font-extrabold text-white font-mono">
                    {formatMoney(experience.price)}
                  </span>
                  <span className="text-[10px] text-white/40"> / explorer</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-emerald-400 font-bold uppercase block">Instant Booking</span>
                  <span className="text-xs text-white/60">Sandbox checkout</span>
                </div>
              </div>

              {/* Guest Selector */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-white/80 block">Number of Travellers</label>
                <div className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-xl">
                  <span className="text-xs text-white">Explorers</span>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setGuestsCount((prev) => Math.max(1, prev - 1))}
                      className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
                    >
                      -
                    </button>
                    <span className="font-bold text-xs w-4 text-center">{guestsCount}</span>
                    <button
                      type="button"
                      onClick={() => setGuestsCount((prev) => Math.min(experience.availableSeats || 10, prev + 1))}
                      className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Price Calculation Summary */}
              <div className="p-4 bg-white/5 rounded-2xl text-xs space-y-2 border border-white/5">
                <div className="flex items-center justify-between text-white/70">
                  <span>{formatMoney(experience.price)} × {guestsCount} Explorer(s)</span>
                  <span className="font-mono text-white">{formatMoney(totalPrice)}</span>
                </div>
                <div className="flex items-center justify-between text-white/70">
                  <span>Taxes & GST (12%)</span>
                  <span className="font-mono text-white">+{formatMoney(Math.round(totalPrice * 0.12))}</span>
                </div>
                <div className="border-t border-white/10 pt-2 flex items-center justify-between text-sm font-bold text-white">
                  <span>Estimated Total</span>
                  <span className="text-saffron-400 font-mono text-base">
                    {formatMoney(Math.round(totalPrice * 1.12))}
                  </span>
                </div>
              </div>

              {/* Reserve Button */}
              <button
                onClick={() => onOpenBooking && onOpenBooking(experience, 'experience')}
                className="w-full btn-saffron py-3.5 px-6 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 shadow-saffron"
              >
                <span>Reserve Expedition</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <p className="text-[10px] text-center text-white/40">
                You won't be charged yet. Test the multi-step flow in sandbox mode.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

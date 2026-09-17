import React, { useState } from 'react';
import { 
  X, Lock, Mail, User, Phone, MapPin, Compass, AlertCircle, 
  Sparkles, Check, Eye, EyeOff, ShieldCheck, CheckCircle2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';

const TRAVEL_STYLES = [
  'Adventure', 'Backpacker', 'Roadtripper', 'Cultural', 'Luxury', 'Solo Explorer', 'Weekend Escaper'
];

const POPULAR_INTERESTS = [
  'Mountains', 'Beaches', 'Trekking', 'Photography', 'Food', 'Nightlife',
  'Culture', 'Spiritual', 'Wildlife', 'Road Trips', 'Camping', 'Heritage'
];

export default function AuthModal({ isOpen, onClose, initialMode = 'login' }) {
  const { login, signup, showToast } = useAuth();
  const [tab, setTab] = useState(initialMode);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Password visibility
  const [showPassword, setShowPassword] = useState(false);

  // Login fields
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Signup fields
  const [fullName, setFullName] = useState('');
  const [suEmail, setSuEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('Delhi');
  const [suPassword, setSuPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [travelStyle, setTravelStyle] = useState('Adventure');
  const [budgetLevel, setBudgetLevel] = useState('Moderate');
  const [selectedInterests, setSelectedInterests] = useState(['Mountains', 'Trekking']);

  // Forgot password
  const [fpEmail, setFpEmail] = useState('');
  const [resetTokenInfo, setResetTokenInfo] = useState(null);
  const [newPassword, setNewPassword] = useState('');

  if (!isOpen) return null;

  // Password strength logic
  const hasMinLength = suPassword.length >= 6;
  const hasUppercase = /[A-Z]/.test(suPassword);
  const hasLowercase = /[a-z]/.test(suPassword);
  const hasNumber = /\d/.test(suPassword);
  const hasSpecial = /[!@#$%^&*()\-_=+{}[\]:;"'<>,.?/~`|\\]/.test(suPassword);

  const passedCount = [hasMinLength, hasUppercase, hasLowercase, hasNumber, hasSpecial].filter(Boolean).length;
  let strengthLabel = 'Weak';
  let strengthColor = 'bg-rose-500 text-rose-400';
  if (passedCount >= 5) {
    strengthLabel = 'Very Strong';
    strengthColor = 'bg-emerald-500 text-emerald-400';
  } else if (passedCount >= 4) {
    strengthLabel = 'Strong';
    strengthColor = 'bg-azure-500 text-azure-400';
  } else if (passedCount >= 3) {
    strengthLabel = 'Fair';
    strengthColor = 'bg-amber-500 text-amber-400';
  }

  const handleInterestToggle = (item) => {
    setSelectedInterests((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(loginEmail, loginPassword);
      showToast('Welcome back to TripShare India!', 'success');
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (passedCount < 5) {
      setError('Please fulfill all password security requirements below.');
      return;
    }
    if (suPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (selectedInterests.length < 2) {
      setError('Please select at least 2 travel interests.');
      return;
    }

    setLoading(true);
    try {
      await signup({
        fullName: fullName.trim(),
        email: suEmail.trim(),
        phone: phone.trim(),
        city: city.trim(),
        password: suPassword,
        confirmPassword,
        travelStyle,
        budgetLevel,
        interests: selectedInterests
      });
      showToast('Account created! Welcome explorer.', 'success');
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.forgotPassword(fpEmail);
      setResetTokenInfo(res.resetToken);
      showToast('Reset verification token generated!', 'info');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.resetPassword({
        email: fpEmail,
        resetToken: resetTokenInfo,
        newPassword
      });
      showToast('Password updated! You can now log in.', 'success');
      setTab('login');
      setResetTokenInfo(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className={`modal-content ${tab === 'signup' ? 'max-w-xl' : 'max-w-md'} bg-[#0c111c] border border-white/15 p-6 sm:p-8 rounded-3xl shadow-2xl relative`}>
        {/* Header Tabs */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
          <div className="flex items-center gap-2 bg-white/5 p-1 rounded-xl border border-white/10">
            <button
              onClick={() => { setTab('login'); setError(''); }}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                tab === 'login' ? 'bg-saffron-500 text-white shadow-saffron' : 'text-white/60 hover:text-white'
              }`}
            >
              Log In
            </button>
            <button
              onClick={() => { setTab('signup'); setError(''); }}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                tab === 'signup' ? 'bg-saffron-500 text-white shadow-saffron' : 'text-white/60 hover:text-white'
              }`}
            >
              Create Account
            </button>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* LOGIN TAB */}
        {tab === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
            <div>
              <label className="text-white/70 block mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input
                  type="email"
                  required
                  placeholder="admin@tripshare.in"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="input-field pl-10 py-3"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-white/70">Password</label>
                <button
                  type="button"
                  onClick={() => { setTab('forgot'); setError(''); }}
                  className="text-[11px] text-saffron-400 hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="input-field pl-10 pr-10 py-3"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-saffron py-3 rounded-2xl text-xs font-bold shadow-saffron flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <span>Log In to TripShare</span>
              )}
            </button>

            <div className="p-3 bg-white/5 border border-white/5 rounded-xl text-[11px] text-white/50 text-center font-mono">
              Demo Admin: admin@tripshare.in • Admin@12345
            </div>
          </form>
        )}

        {/* SIGNUP TAB */}
        {tab === 'signup' && (
          <form onSubmit={handleSignupSubmit} className="space-y-3.5 text-xs max-h-[70vh] overflow-y-auto pr-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-white/70 block mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="Rahul Sen"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="input-field py-2.5"
                />
              </div>

              <div>
                <label className="text-white/70 block mb-1">Home City *</label>
                <input
                  type="text"
                  required
                  placeholder="Delhi / Mumbai / Bangalore"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="input-field py-2.5"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-white/70 block mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="rahul@example.com"
                  value={suEmail}
                  onChange={(e) => setSuEmail(e.target.value)}
                  className="input-field py-2.5"
                />
              </div>

              <div>
                <label className="text-white/70 block mb-1">10-Digit Mobile Phone *</label>
                <input
                  type="tel"
                  required
                  pattern="[0-9]{10}"
                  placeholder="9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="input-field py-2.5"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-white/70 block mb-1">Password *</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Min 6 chars"
                    value={suPassword}
                    onChange={(e) => setSuPassword(e.target.value)}
                    className="input-field py-2.5 pr-9"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-white/70 block mb-1">Confirm Password *</label>
                <input
                  type="password"
                  required
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="input-field py-2.5"
                />
              </div>
            </div>

            {/* Live Password Strength Meter & Checklist */}
            {suPassword && (
              <div className="p-3 bg-black/30 border border-white/5 rounded-xl space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-white/50">Password Strength:</span>
                  <span className={`font-bold font-mono px-2 py-0.5 rounded ${strengthColor}`}>
                    {strengthLabel}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-1 text-[10px] text-white/60">
                  <span className={`flex items-center gap-1 ${hasMinLength ? 'text-emerald-400' : ''}`}>
                    <Check className="w-3 h-3" /> Min 6 characters
                  </span>
                  <span className={`flex items-center gap-1 ${hasUppercase ? 'text-emerald-400' : ''}`}>
                    <Check className="w-3 h-3" /> 1 Uppercase letter
                  </span>
                  <span className={`flex items-center gap-1 ${hasLowercase ? 'text-emerald-400' : ''}`}>
                    <Check className="w-3 h-3" /> 1 Lowercase letter
                  </span>
                  <span className={`flex items-center gap-1 ${hasNumber ? 'text-emerald-400' : ''}`}>
                    <Check className="w-3 h-3" /> 1 Number (0-9)
                  </span>
                  <span className={`flex items-center gap-1 ${hasSpecial ? 'text-emerald-400' : ''}`}>
                    <Check className="w-3 h-3" /> 1 Special character
                  </span>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-white/70 block mb-1">Primary Travel Style</label>
                <select
                  value={travelStyle}
                  onChange={(e) => setTravelStyle(e.target.value)}
                  className="input-field py-2.5 bg-[#080d16]"
                >
                  {TRAVEL_STYLES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-white/70 block mb-1">Budget Preference</label>
                <select
                  value={budgetLevel}
                  onChange={(e) => setBudgetLevel(e.target.value)}
                  className="input-field py-2.5 bg-[#080d16]"
                >
                  <option value="Budget">Budget</option>
                  <option value="Moderate">Moderate</option>
                  <option value="Comfort">Comfort</option>
                  <option value="Luxury">Luxury</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-white/70 block mb-1">Travel Interests (Pick 2+)</label>
              <div className="flex flex-wrap gap-1.5">
                {POPULAR_INTERESTS.map((interest) => {
                  const isSelected = selectedInterests.includes(interest);
                  return (
                    <button
                      type="button"
                      key={interest}
                      onClick={() => handleInterestToggle(interest)}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all ${
                        isSelected
                          ? 'bg-saffron-500 text-white shadow-sm'
                          : 'bg-white/5 text-white/50 border border-white/5 hover:text-white'
                      }`}
                    >
                      {interest}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-saffron py-3 rounded-2xl text-xs font-bold shadow-saffron mt-2"
            >
              {loading ? 'Creating Explorer Account...' : 'Create Free Account'}
            </button>
          </form>
        )}

        {/* FORGOT PASSWORD TAB */}
        {tab === 'forgot' && (
          <div className="space-y-4 text-xs">
            <p className="text-white/60">
              Enter your email address to receive an instant verification reset token.
            </p>

            {!resetTokenInfo ? (
              <form onSubmit={handleForgotSubmit} className="space-y-3">
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={fpEmail}
                  onChange={(e) => setFpEmail(e.target.value)}
                  className="input-field py-3"
                />
                <button type="submit" disabled={loading} className="w-full btn-saffron py-3 rounded-xl font-bold">
                  {loading ? 'Sending...' : 'Generate Reset Token'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleResetSubmit} className="space-y-3">
                <div className="p-3 bg-azure-500/10 border border-azure-500/30 rounded-xl text-azure-300 font-mono text-xs">
                  <strong>Verification Token:</strong> {resetTokenInfo}
                </div>
                <div>
                  <label className="text-white/70 block mb-1">New Secure Password</label>
                  <input
                    type="password"
                    required
                    placeholder="Min 6 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="input-field py-2.5"
                  />
                </div>
                <button type="submit" disabled={loading} className="w-full btn-saffron py-3 rounded-xl font-bold">
                  {loading ? 'Updating...' : 'Set New Password'}
                </button>
              </form>
            )}

            <button
              type="button"
              onClick={() => { setTab('login'); setError(''); }}
              className="btn-ghost text-xs mx-auto block text-white/50 hover:text-white"
            >
              Back to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

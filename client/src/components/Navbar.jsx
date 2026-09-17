import React, { useState, useEffect, useRef } from 'react';
import {
  Compass,
  Users,
  MapPin,
  BookOpen,
  PlusCircle,
  Bell,
  User,
  LogOut,
  Menu,
  X,
  Luggage,
  ChevronDown,
  Sparkles,
  ShieldCheck,
  BedDouble,
  Navigation,
  DollarSign,
  Heart,
  MessageSquare,
  Shield
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { initials } from '../services/api';

export default function Navbar({
  currentView = 'home',
  onNavigate,
  onOpenCreateTrip,
  onOpenNotifications,
  onOpenProfile,
  onOpenEditProfile,
  onOpenAuth
}) {
  const { user, logout, openAuth, unreadNotifsCount } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems = [
    { id: 'home', label: 'Home', icon: Compass },
    { id: 'explore', label: 'Explore', icon: MapPin },
    { id: 'stays', label: 'Stays', icon: BedDouble, badge: 'Hotels' },
    { id: 'buddies', label: 'Find Buddy', icon: Users, badge: 'Match' },
    { id: 'planner', label: 'Planner', icon: Navigation },
    { id: 'expenses', label: 'Expenses', icon: DollarSign },
    { id: 'saved', label: 'Saved', icon: Heart },
    ...(user ? [
      { id: 'connections', label: 'Messages', icon: MessageSquare },
      { id: 'mytrips', label: 'My Trips', icon: Luggage }
    ] : []),
    ...(user?.role === 'admin' ? [
      { id: 'admin', label: 'Admin', icon: Shield, badge: 'Control' }
    ] : [])
  ];

  const handleNav = (viewId) => {
    if (onNavigate) onNavigate(viewId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#060910]/85 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-[72px]">
        {/* Brand Logo */}
        <button
          onClick={() => handleNav('home')}
          className="flex items-center gap-3 text-left focus:outline-none group"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-saffron-500 to-amber-500 flex items-center justify-center shadow-lg shadow-saffron-500/25 group-hover:scale-105 transition-transform">
            <Compass className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-display text-lg sm:text-xl font-extrabold text-white leading-none tracking-tight">
              TripShare <span className="text-saffron-400">India</span>
            </div>
            <div className="text-[10px] text-white/40 tracking-wider uppercase font-semibold mt-0.5">
              Travel & Buddy Ecosystem
            </div>
          </div>
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden xl:flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  isActive
                    ? 'bg-saffron-500/15 text-saffron-400 border border-saffron-500/30'
                    : 'text-white/70 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
                {item.badge && (
                  <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-saffron-500 text-white font-bold">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Action Controls */}
        <div className="flex items-center gap-3">
          {/* Plan Trip CTA */}
          <button
            onClick={onOpenCreateTrip}
            className="hidden sm:flex btn-saffron py-2 px-3.5 rounded-xl text-xs font-bold items-center gap-1.5 shadow-saffron"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Create Trip</span>
          </button>

          {/* User Logged In State */}
          {user ? (
            <div className="flex items-center gap-3">
              {/* Notifications Bell */}
              <button
                onClick={onOpenNotifications}
                className="relative w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white/70 hover:text-white transition-colors"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadNotifsCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-saffron-500 text-white text-[10px] font-bold flex items-center justify-center border-2 border-[#060910]">
                    {unreadNotifsCount}
                  </span>
                )}
              </button>

              {/* User Avatar Chip Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 py-1 pl-1.5 pr-2.5 rounded-xl text-white transition-colors"
                >
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-azure-500 to-indigo-600 flex items-center justify-center text-xs font-bold overflow-hidden">
                    {user.profileImage ? (
                      <img src={user.profileImage} alt={user.fullName} className="w-full h-full object-cover" />
                    ) : (
                      initials(user.fullName)
                    )}
                  </div>
                  <span className="text-xs font-semibold max-w-[100px] truncate hidden md:block">
                    {user.fullName.split(' ')[0]}
                  </span>
                  <ChevronDown className="w-3 h-3 text-white/40" />
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-[#0c111c] border border-white/15 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="p-3 border-b border-white/10 mb-1">
                      <div className="text-xs font-bold text-white truncate">{user.fullName}</div>
                      <div className="text-[10px] text-white/40 truncate">{user.email} • {user.city}</div>
                    </div>

                    <div className="space-y-1 text-xs">
                      <button
                        onClick={() => { setDropdownOpen(false); onOpenProfile(user); }}
                        className="w-full flex items-center gap-2 p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/5 transition-colors text-left"
                      >
                        <User className="w-3.5 h-3.5 text-saffron-400" />
                        <span>Public Travel Profile</span>
                      </button>

                      <button
                        onClick={() => { setDropdownOpen(false); onOpenEditProfile(); }}
                        className="w-full flex items-center gap-2 p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/5 transition-colors text-left"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-azure-400" />
                        <span>Edit Preferences</span>
                      </button>

                      <button
                        onClick={() => { setDropdownOpen(false); handleNav('saved'); }}
                        className="w-full flex items-center gap-2 p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/5 transition-colors text-left"
                      >
                        <Heart className="w-3.5 h-3.5 text-rose-400" />
                        <span>Saved Wishlist</span>
                      </button>

                      {user.role === 'admin' && (
                        <button
                          onClick={() => { setDropdownOpen(false); handleNav('admin'); }}
                          className="w-full flex items-center gap-2 p-2 rounded-xl text-amber-300 hover:bg-amber-500/10 transition-colors text-left font-semibold"
                        >
                          <Shield className="w-3.5 h-3.5" />
                          <span>Admin Dashboard</span>
                        </button>
                      )}

                      <div className="border-t border-white/10 pt-1">
                        <button
                          onClick={() => { setDropdownOpen(false); logout(); }}
                          className="w-full flex items-center gap-2 p-2 rounded-xl text-rose-400 hover:bg-rose-500/10 transition-colors text-left font-semibold"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Log Out</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Guest Auth Buttons */
            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenAuth ? onOpenAuth('login') : openAuth('login')}
                className="btn-outline py-2 px-3.5 rounded-xl text-xs font-semibold"
              >
                Log In
              </button>
              <button
                onClick={() => onOpenAuth ? onOpenAuth('signup') : openAuth('signup')}
                className="btn-saffron py-2 px-3.5 rounded-xl text-xs font-bold shadow-saffron"
              >
                Join Free
              </button>
            </div>
          )}

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-[#0c111c] border-b border-white/10 p-4 space-y-1.5 animate-in fade-in slide-in-from-top-4 max-h-[80vh] overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`w-full p-3 rounded-xl text-xs font-bold flex items-center justify-between transition-colors ${
                  isActive ? 'bg-saffron-500 text-white' : 'text-white/70 hover:bg-white/5 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/20 text-white font-bold">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
}

import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, TrendingUp, Users, Calendar, DollarSign, 
  BedDouble, Compass, Search, Filter, Check, X, ArrowUpRight, 
  RefreshCw, CheckCircle2, AlertTriangle, ChevronRight, Eye
} from 'lucide-react';
import { adminAPI, formatMoney, formatDate } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function AdminDashboard() {
  const { user, isAuthenticated, showToast } = useAuth();

  const [metrics, setMetrics] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [userSearch, setUserSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'users' | 'bookings' | 'system'

  // Bookings management
  const [adminBookings, setAdminBookings] = useState([]);
  const [bookingStatusFilter, setBookingStatusFilter] = useState('all');

  useEffect(() => {
    if (isAuthenticated && user?.role === 'admin') {
      loadAdminData();
    }
  }, [isAuthenticated, user]);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [mRes, aRes, uRes] = await Promise.allSettled([
        adminAPI.getMetrics(),
        adminAPI.getAnalytics(),
        adminAPI.getUsers({ search: userSearch })
      ]);

      if (mRes.status === 'fulfilled' && mRes.value) setMetrics(mRes.value.metrics);
      if (aRes.status === 'fulfilled' && aRes.value) setAnalytics(aRes.value);
      if (uRes.status === 'fulfilled' && uRes.value) setUsersList(uRes.value.users || []);

      // Also fetch bookings list for admin
      const token = localStorage.getItem('ts_token');
      const bRes = await fetch('/api/bookings', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const bData = await bRes.json();
      if (bData.success && bData.bookings) {
        setAdminBookings(bData.bookings);
      }
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleVerifyUser = async (targetUser) => {
    try {
      const res = await adminAPI.updateUser(targetUser._id, { verified: !targetUser.verified });
      if (res.success) {
        showToast(`User ${!targetUser.verified ? 'verified' : 'unverified'} successfully!`, 'success');
        setUsersList(usersList.map((u) => u._id === targetUser._id ? { ...u, verified: !u.verified } : u));
      }
    } catch (err) {
      showToast('Could not update user', 'error');
    }
  };

  const handleUpdateBookingStatus = async (bookingId, status) => {
    try {
      const res = await adminAPI.updateBooking(bookingId, status);
      if (res.success) {
        showToast(`Booking marked as ${status}`, 'success');
        setAdminBookings(adminBookings.map((b) => b._id === bookingId ? { ...b, status } : b));
      }
    } catch (err) {
      showToast('Could not update booking status', 'error');
    }
  };

  if (!isAuthenticated || user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-[#060910] text-white pt-32 pb-20 flex items-center justify-center">
        <div className="text-center max-w-md p-8 bg-[#0c111d] rounded-3xl border border-white/10">
          <ShieldCheck className="w-12 h-12 text-rose-500 mx-auto mb-3" />
          <h2 className="text-2xl font-bold text-white mb-2">Restricted Access</h2>
          <p className="text-xs text-white/60 mb-4">
            The platform command center is restricted to authenticated administrator accounts.
          </p>
          <div className="p-3 bg-white/5 rounded-xl text-[11px] text-white/50 text-left font-mono">
            Demo admin credentials: <br />
            Email: admin@tripshare.in <br />
            Pass: Admin@12345
          </div>
        </div>
      </div>
    );
  }

  const filteredBookings = bookingStatusFilter === 'all'
    ? adminBookings
    : adminBookings.filter((b) => b.status === bookingStatusFilter);

  return (
    <div className="min-h-screen bg-[#060910] text-white pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-6 mb-8 flex-wrap gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-saffron-500/10 border border-saffron-500/30 text-saffron-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Platform Administration & Control</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-white">
              TripShare India Command Center
            </h1>
            <p className="text-xs sm:text-sm text-white/60">
              Live marketplace telemetry, analytics, user verifications, and booking state controls.
            </p>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-2 bg-[#0c111d] p-1.5 rounded-2xl border border-white/10">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'overview' ? 'bg-saffron-500 text-white shadow-saffron' : 'text-white/70 hover:text-white'
              }`}
            >
              Overview & Analytics
            </button>
            <button
              onClick={() => setActiveTab('bookings')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'bookings' ? 'bg-saffron-500 text-white shadow-saffron' : 'text-white/70 hover:text-white'
              }`}
            >
              Bookings ({adminBookings.length})
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'users' ? 'bg-saffron-500 text-white shadow-saffron' : 'text-white/70 hover:text-white'
              }`}
            >
              Users ({usersList.length})
            </button>
          </div>
        </div>

        {/* TAB 1: Overview & Analytics */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* KPI Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 bg-[#0c111d] border border-white/10 rounded-2xl shadow-xl">
                <span className="text-xs text-white/50 block mb-1">Gross Platform GMV</span>
                <span className="text-2xl font-display font-extrabold text-emerald-400 font-mono">
                  {formatMoney(metrics?.totalRevenue || 0)}
                </span>
                <span className="text-[10px] text-white/40 block mt-1">From confirmed bookings</span>
              </div>

              <div className="p-5 bg-[#0c111d] border border-white/10 rounded-2xl shadow-xl">
                <span className="text-xs text-white/50 block mb-1">Total Verified Explorers</span>
                <span className="text-2xl font-display font-extrabold text-white font-mono">
                  {metrics?.totalUsers || 0}
                </span>
                <span className="text-[10px] text-emerald-400 block mt-1">+{metrics?.newUsersWeek || 0} this week</span>
              </div>

              <div className="p-5 bg-[#0c111d] border border-white/10 rounded-2xl shadow-xl">
                <span className="text-xs text-white/50 block mb-1">Active Expeditions</span>
                <span className="text-2xl font-display font-extrabold text-saffron-400 font-mono">
                  {metrics?.activeTrips || 0} Trips
                </span>
                <span className="text-[10px] text-white/40 block mt-1">Published community journeys</span>
              </div>

              <div className="p-5 bg-[#0c111d] border border-white/10 rounded-2xl shadow-xl">
                <span className="text-xs text-white/50 block mb-1">Inventory Portfolio</span>
                <span className="text-2xl font-display font-extrabold text-azure-400 font-mono">
                  {(metrics?.totalExperiences || 0) + (metrics?.totalStays || 0)} Units
                </span>
                <span className="text-[10px] text-white/40 block mt-1">
                  {metrics?.totalExperiences || 0} experiences • {metrics?.totalStays || 0} stays
                </span>
              </div>
            </div>

            {/* Analytics Charts & Distributions */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Monthly Booking Velocity Chart */}
              <div className="lg:col-span-8 bg-[#0c111d] border border-white/10 rounded-3xl p-6 shadow-xl space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400" /> Monthly Revenue & Booking Velocity
                </h3>

                <div className="grid grid-cols-6 gap-2 pt-6 items-end h-56 border-b border-white/10 pb-4">
                  {(analytics?.monthlyBookings || []).map((m, idx) => (
                    <div key={idx} className="flex flex-col items-center gap-2 h-full justify-end">
                      <span className="text-[10px] font-mono text-emerald-400 font-bold">
                        {m.revenue > 0 ? `₹${Math.round(m.revenue / 1000)}k` : '₹0'}
                      </span>
                      <div
                        className="w-full max-w-[36px] bg-gradient-to-t from-azure-500 to-saffron-500 rounded-t-xl transition-all"
                        style={{ height: `${Math.max(15, (m.bookings || 1) * 28)}px` }}
                      />
                      <span className="text-[10px] text-white/40 font-mono">{m.month}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Popular Destinations Breakdown */}
              <div className="lg:col-span-4 bg-[#0c111d] border border-white/10 rounded-3xl p-6 shadow-xl space-y-3">
                <h3 className="text-sm font-bold text-white mb-2">Trending Travel Corridors</h3>
                <div className="space-y-2">
                  {(analytics?.popularDestinations || []).map((d) => (
                    <div key={d.destination} className="p-3 bg-white/5 rounded-xl flex items-center justify-between">
                      <span className="text-xs font-semibold text-white">{d.destination}</span>
                      <span className="text-xs font-mono font-bold text-saffron-400">{d.count} Trips</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Bookings Management */}
        {activeTab === 'bookings' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                {['all', 'confirmed', 'completed', 'cancelled'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setBookingStatusFilter(status)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
                      bookingStatusFilter === status
                        ? 'bg-saffron-500 text-white'
                        : 'bg-[#0f1628] text-white/60 hover:text-white'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-[#0c111d] border border-white/10 rounded-3xl overflow-hidden shadow-xl">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5 text-white/40 font-mono text-[11px] uppercase">
                    <th className="p-4">Reference</th>
                    <th className="p-4">Item & Type</th>
                    <th className="p-4">Customer</th>
                    <th className="p-4">Amount</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredBookings.map((b) => (
                    <tr key={b._id} className="hover:bg-white/5 transition-colors">
                      <td className="p-4 font-mono font-bold text-saffron-400">
                        {b.bookingReference}
                      </td>
                      <td className="p-4">
                        <span className="font-semibold text-white block">
                          {b.event?.title || b.stay?.name || 'Travel Item'}
                        </span>
                        <span className="text-[10px] text-white/40 capitalize">{b.bookingType}</span>
                      </td>
                      <td className="p-4">
                        <span className="text-white block font-medium">{b.customerInfo?.fullName || b.user?.fullName}</span>
                        <span className="text-[10px] text-white/40">{b.customerInfo?.email || b.user?.email}</span>
                      </td>
                      <td className="p-4 font-mono font-bold text-white">
                        {formatMoney(b.totalAmount)}
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold ${
                          b.status === 'confirmed' ? 'bg-emerald-500/20 text-emerald-400' :
                          b.status === 'completed' ? 'bg-azure-500/20 text-azure-400' :
                          'bg-rose-500/20 text-rose-400'
                        }`}>
                          {b.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <select
                          value={b.status}
                          onChange={(e) => handleUpdateBookingStatus(b._id, e.target.value)}
                          className="bg-[#0f1628] border border-white/10 rounded-lg text-[11px] text-white px-2 py-1 focus:outline-none cursor-pointer"
                        >
                          <option value="confirmed">Confirmed</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: Users Management */}
        {activeTab === 'users' && (
          <div className="space-y-4">
            <div className="bg-[#0c111d] border border-white/10 rounded-3xl overflow-hidden shadow-xl">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5 text-white/40 font-mono text-[11px] uppercase">
                    <th className="p-4">Traveller</th>
                    <th className="p-4">City</th>
                    <th className="p-4">Travel Persona</th>
                    <th className="p-4">Verification</th>
                    <th className="p-4">Role</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {usersList.map((u) => (
                    <tr key={u._id} className="hover:bg-white/5 transition-colors">
                      <td className="p-4 flex items-center gap-3">
                        <img
                          src={u.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                          alt={u.fullName}
                          className="w-9 h-9 rounded-full object-cover border border-white/10"
                        />
                        <div>
                          <span className="font-bold text-white block">{u.fullName}</span>
                          <span className="text-[10px] text-white/40">{u.email}</span>
                        </div>
                      </td>
                      <td className="p-4 text-white/80">{u.city || 'India'}</td>
                      <td className="p-4">
                        <span className="text-white/80 block">{u.travelStyle}</span>
                        <span className="text-[10px] text-white/40">{u.budgetLevel}</span>
                      </td>
                      <td className="p-4">
                        {u.verified ? (
                          <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold text-[10px] flex items-center gap-1 w-max">
                            <Check className="w-3 h-3" /> Verified
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded bg-white/10 text-white/50 text-[10px] w-max block">
                            Unverified
                          </span>
                        )}
                      </td>
                      <td className="p-4 font-mono uppercase text-[10px] text-white/60">{u.role}</td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleToggleVerifyUser(u)}
                          className="btn-outline text-[11px] py-1 px-3 rounded-lg"
                        >
                          {u.verified ? 'Revoke Verify' : 'Verify User'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

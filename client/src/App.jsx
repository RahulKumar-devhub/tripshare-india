import React, { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import NotificationDrawer from './components/NotificationDrawer';

// Pages
import Home from './pages/Home';
import Explore from './pages/Explore';
import Stays from './pages/Stays';
import TravelBuddy from './pages/TravelBuddy';
import TripPlanner from './pages/TripPlanner';
import ExpenseManager from './pages/ExpenseManager';
import SavedItems from './pages/SavedItems';
import Connections from './pages/Connections';
import Destinations from './pages/Destinations';
import DestinationDetail from './pages/DestinationDetail';
import ExperienceDetail from './pages/ExperienceDetail';
import Community from './pages/Community';
import MyTrips from './pages/MyTrips';
import AdminDashboard from './pages/AdminDashboard';

// Modals
import AuthModal from './components/Modals/AuthModal';
import TripDetailModal from './components/Modals/TripDetailModal';
import CreateTripModal from './components/Modals/CreateTripModal';
import UserProfileModal from './components/Modals/UserProfileModal';
import EditProfileModal from './components/Modals/EditProfileModal';
import InviteBuddyModal from './components/Modals/InviteBuddyModal';
import MultiStepBookingModal from './components/Modals/MultiStepBookingModal';

export default function App() {
  const { 
    user, 
    isAuthenticated, 
    unreadCount, 
    toasts, 
    removeToast,
    showToast
  } = useAuth();

  // Navigation State
  const [currentView, setCurrentView] = useState('home');
  const [viewFilters, setViewFilters] = useState({});

  // Dynamic Detail State
  const [selectedDestinationSlug, setSelectedDestinationSlug] = useState('manali');
  const [selectedExperienceId, setSelectedExperienceId] = useState(null);

  // Booking Modal State
  const [bookingModal, setBookingModal] = useState({
    isOpen: false,
    item: null,
    itemType: 'experience'
  });

  // Other Modal States
  const [authModal, setAuthModal] = useState({ isOpen: false, mode: 'login' });
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [isCreateTripOpen, setIsCreateTripOpen] = useState(false);
  const [selectedProfileUser, setSelectedProfileUser] = useState(null);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [selectedInviteBuddy, setSelectedInviteBuddy] = useState(null);
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = useState(false);

  // Scroll to top on navigation
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView]);

  const handleNavigate = (view, filters = {}) => {
    setViewFilters(filters);
    setCurrentView(view);
  };

  const handleOpenAuth = (mode = 'login') => {
    setAuthModal({ isOpen: true, mode });
  };

  const handleOpenProfile = (targetUser) => {
    if (!targetUser) return;
    setSelectedProfileUser(targetUser);
  };

  const handleOpenInvite = (buddy) => {
    if (!isAuthenticated) {
      handleOpenAuth('login');
      return;
    }
    setSelectedInviteBuddy(buddy);
  };

  const handleOpenCreateTrip = () => {
    if (!isAuthenticated) {
      handleOpenAuth('login');
      return;
    }
    setIsCreateTripOpen(true);
  };

  const handleOpenBooking = (item, itemType = 'experience') => {
    if (!item) return;
    setBookingModal({
      isOpen: true,
      item,
      itemType
    });
  };

  const handleOpenDestinationDetail = (slug) => {
    setSelectedDestinationSlug(slug);
    setCurrentView('destination-detail');
  };

  const handleOpenExperienceDetail = (id) => {
    setSelectedExperienceId(id);
    setCurrentView('experience-detail');
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-white flex flex-col selection:bg-saffron-500 selection:text-white">
      {/* GLOBAL NAVBAR */}
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
        onOpenAuth={handleOpenAuth}
        onOpenCreateTrip={handleOpenCreateTrip}
        onOpenNotifications={() => setIsNotificationDrawerOpen(true)}
        onOpenEditProfile={() => setIsEditProfileOpen(true)}
        onOpenProfile={handleOpenProfile}
      />

      {/* MAIN VIEW CONTAINER */}
      <main className="flex-grow">
        {currentView === 'home' && (
          <Home
            onOpenTripDetail={(trip) => setSelectedTrip(trip)}
            onOpenCreateTrip={handleOpenCreateTrip}
            onOpenAuth={() => handleOpenAuth('login')}
            onOpenProfile={handleOpenProfile}
            onNavigate={handleNavigate}
            onOpenBooking={handleOpenBooking}
            onOpenDestinationDetail={handleOpenDestinationDetail}
            onOpenExperienceDetail={handleOpenExperienceDetail}
          />
        )}

        {currentView === 'explore' && (
          <Explore
            initialFilters={viewFilters}
            onOpenTripDetail={(trip) => setSelectedTrip(trip)}
            onOpenCreateTrip={handleOpenCreateTrip}
            onOpenProfile={handleOpenProfile}
            onOpenBooking={handleOpenBooking}
            onOpenExperienceDetail={handleOpenExperienceDetail}
          />
        )}

        {currentView === 'stays' && (
          <Stays
            onOpenStayBooking={(stay) => handleOpenBooking(stay, 'stay')}
            onOpenStayDetail={(stay) => handleOpenBooking(stay, 'stay')}
          />
        )}

        {currentView === 'buddies' && (
          <TravelBuddy
            onOpenProfile={handleOpenProfile}
            onOpenConnectModal={handleOpenProfile}
            onOpenInviteModal={handleOpenInvite}
            onOpenAuth={() => handleOpenAuth('login')}
          />
        )}

        {currentView === 'planner' && (
          <TripPlanner
            onTripCreated={(newTrip) => {
              setSelectedTrip(newTrip);
              setCurrentView('mytrips');
            }}
          />
        )}

        {currentView === 'expenses' && (
          <ExpenseManager />
        )}

        {currentView === 'saved' && (
          <SavedItems
            onOpenBooking={handleOpenBooking}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'connections' && (
          <Connections
            initialActiveTab="messages"
            onOpenProfile={handleOpenProfile}
          />
        )}

        {currentView === 'destinations' && (
          <Destinations
            onNavigate={handleNavigate}
            onOpenDestinationDetail={handleOpenDestinationDetail}
          />
        )}

        {currentView === 'destination-detail' && (
          <DestinationDetail
            destinationSlug={selectedDestinationSlug}
            onBack={() => setCurrentView('explore')}
            onOpenBooking={handleOpenBooking}
            onOpenProfile={handleOpenProfile}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'experience-detail' && (
          <ExperienceDetail
            experienceId={selectedExperienceId}
            onBack={() => setCurrentView('explore')}
            onOpenBooking={(item, itemType = 'experience') => handleOpenBooking(item, itemType)}
          />
        )}

        {currentView === 'community' && (
          <Community
            onOpenProfile={handleOpenProfile}
            onOpenAuth={() => handleOpenAuth('login')}
          />
        )}

        {currentView === 'mytrips' && (
          <MyTrips
            onOpenTripDetail={(trip) => setSelectedTrip(trip)}
            onOpenCreateTrip={handleOpenCreateTrip}
            onOpenProfile={handleOpenProfile}
            onOpenAuth={() => handleOpenAuth('login')}
          />
        )}

        {currentView === 'admin' && (
          <AdminDashboard />
        )}
      </main>

      {/* GLOBAL FOOTER */}
      <Footer onNavigate={handleNavigate} />

      {/* NOTIFICATION DRAWER */}
      <NotificationDrawer
        isOpen={isNotificationDrawerOpen}
        onClose={() => setIsNotificationDrawerOpen(false)}
        onNavigate={handleNavigate}
      />

      {/* 7-STEP BOOKING WIZARD MODAL */}
      {bookingModal.isOpen && (
        <MultiStepBookingModal
          isOpen={bookingModal.isOpen}
          item={bookingModal.item}
          itemType={bookingModal.itemType}
          onClose={() => setBookingModal({ isOpen: false, item: null, itemType: 'experience' })}
          onBookingSuccess={(booking) => {
            showToast(`Booking ${booking?.bookingReference || 'confirmed'} created successfully!`, 'success');
          }}
        />
      )}

      {/* AUTH MODAL */}
      {authModal.isOpen && (
        <AuthModal
          isOpen={authModal.isOpen}
          initialMode={authModal.mode}
          onClose={() => setAuthModal({ isOpen: false, mode: 'login' })}
        />
      )}

      {/* TRIP DETAIL MODAL */}
      {selectedTrip && (
        <TripDetailModal
          trip={selectedTrip}
          isOpen={!!selectedTrip}
          onClose={() => setSelectedTrip(null)}
          onOpenProfile={handleOpenProfile}
          onOpenAuth={() => handleOpenAuth('login')}
          onTripUpdated={(updatedTrip) => setSelectedTrip(updatedTrip)}
        />
      )}

      {/* CREATE TRIP MODAL */}
      {isCreateTripOpen && (
        <CreateTripModal
          isOpen={isCreateTripOpen}
          onClose={() => setIsCreateTripOpen(false)}
          onTripCreated={(newTrip) => {
            setIsCreateTripOpen(false);
            setSelectedTrip(newTrip);
            showToast('Expedition created successfully!', 'success');
          }}
        />
      )}

      {/* USER PROFILE MODAL */}
      {selectedProfileUser && (
        <UserProfileModal
          user={selectedProfileUser}
          isOpen={!!selectedProfileUser}
          onClose={() => setSelectedProfileUser(null)}
          onOpenInviteModal={handleOpenInvite}
          onOpenAuth={() => handleOpenAuth('login')}
        />
      )}

      {/* EDIT PROFILE MODAL */}
      {isEditProfileOpen && (
        <EditProfileModal
          isOpen={isEditProfileOpen}
          onClose={() => setIsEditProfileOpen(false)}
        />
      )}

      {/* INVITE BUDDY MODAL */}
      {selectedInviteBuddy && (
        <InviteBuddyModal
          buddy={selectedInviteBuddy}
          isOpen={!!selectedInviteBuddy}
          onClose={() => setSelectedInviteBuddy(null)}
        />
      )}

      {/* TOAST SYSTEM CONTAINER */}
      <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2 max-w-sm pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            onClick={() => removeToast(toast.id)}
            className={`pointer-events-auto px-4 py-3 rounded-xl text-xs font-semibold shadow-2xl flex items-center justify-between gap-3 animate-in slide-in-from-bottom-3 transition-all cursor-pointer ${
              toast.type === 'error'
                ? 'bg-rose-500 text-white shadow-rose-500/30'
                : toast.type === 'success'
                ? 'bg-emerald-600 text-white shadow-emerald-500/30'
                : 'bg-[#151c2e] text-white border border-white/15'
            }`}
          >
            <span>{toast.message}</span>
            <span className="text-white/60 hover:text-white text-sm">×</span>
          </div>
        ))}
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import HowItWorks from './components/HowItWorks';
import ResidentDashboard from './components/ResidentDashboard';
import PickerDashboard from './components/PickerDashboard';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';

export default function App() {
  // Authentication State
  const [currentUser, setCurrentUser] = useState(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login');

  // Eco-Credits Wallet State
  const [walletBalance, setWalletBalance] = useState(120);

  // Pickups State
  const [pickups, setPickups] = useState([
    {
      id: 'pk_initial_1',
      bookingRef: 'IND-7842',
      itemId: 'cardboard_bundle',
      itemName: 'Delivery Cardboard Boxes (3 Pack)',
      itemIcon: '📦',
      stream: 'degradable',
      streamLabel: 'Degradable (Paper Pulp)',
      weightEst: '0.85 kg',
      credits: 15,
      co2Grams: 110,
      pickupDate: '2026-10-09',
      timeSlot: 'Morning (9:00 AM - 12:00 PM)',
      address: 'Flat 402, Green Valley Apartments, New Delhi',
      instructions: 'Flattened and tied with jute string beside door',
      status: 'SCHEDULED',
      createdAt: '2026-10-08T10:00:00Z',
    },
  ]);

  // Real-Time Carbon & Environmental Impact Stats
  const [impactStats, setImpactStats] = useState({
    co2PreventedGrams: 4200, // 4.2 kg
    landfillDivertedGrams: 6500, // 6.5 kg
    itemsSegregated: 18,
  });

  // Navigation Handler
  const handleNavigate = (sectionId) => {
    if (sectionId === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const elem = document.getElementById(sectionId);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Auth Handlers
  const handleOpenAuth = (mode) => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  const handleLoginSuccess = (profile) => {
    setCurrentUser(profile);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const handleUpdateUser = (updatedProfile) => {
    setCurrentUser((prev) => (prev ? { ...prev, ...updatedProfile } : updatedProfile));
  };

  // Pickup Scheduling Handler
  const handleSchedulePickup = (newBooking) => {
    setPickups((prev) => [newBooking, ...prev]);
  };

  // Picker Verification Handler
  const handleCompletePickup = (pickupId, creditsEarned, co2Grams) => {
    setPickups((prev) =>
      prev.map((p) => (p.id === pickupId ? { ...p, status: 'COMPLETED' } : p))
    );

    // Deposit credits to wallet
    setWalletBalance((prev) => prev + (creditsEarned || 20));

    // Update real-time carbon statistics
    setImpactStats((prev) => ({
      ...prev,
      co2PreventedGrams: prev.co2PreventedGrams + (co2Grams || 90),
      landfillDivertedGrams: prev.landfillDivertedGrams + (co2Grams * 1.5 || 135),
      itemsSegregated: prev.itemsSegregated + 1,
    }));
  };

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-stone-900 selection:bg-emerald-500 selection:text-white flex flex-col justify-between">
      <div>
        {/* Top Navigation Bar with Login & Sign In buttons - ONLY SHOWN WHEN LOGGED OUT */}
        {!currentUser && (
          <Navbar
            user={currentUser}
            walletBalance={walletBalance}
            onOpenAuth={handleOpenAuth}
            onLogout={handleLogout}
            onNavigate={handleNavigate}
          />
        )}

        {/* CONDITION 1: LOGGED IN AS RESIDENT */}
        {currentUser && currentUser.role !== 'Picker' && (
          <ResidentDashboard
            user={currentUser}
            walletBalance={walletBalance}
            pickups={pickups}
            impactStats={impactStats}
            onSchedulePickup={handleSchedulePickup}
            onSimulatePickerComplete={handleCompletePickup}
            onLogout={handleLogout}
            onUpdateUser={handleUpdateUser}
          />
        )}

        {/* CONDITION 2: LOGGED IN AS ECO-PICKER */}
        {currentUser && currentUser.role === 'Picker' && (
          <PickerDashboard
            user={currentUser}
            pickups={pickups}
            onCompletePickup={handleCompletePickup}
            onLogout={handleLogout}
          />
        )}

        {/* CONDITION 3: NOT LOGGED IN -> CLEAN LANDING PAGE */}
        {!currentUser && (
          <>
            {/* Hero Section with user's authentic Indian recycling image */}
            <Hero
              onGetStarted={() => handleOpenAuth('signin')}
              onExploreHowItWorks={() => handleNavigate('how-it-works')}
            />

            {/* How IndoHood Works (Closed-Loop Lifecycle) */}
            <HowItWorks
              onGetStarted={() => handleOpenAuth('signin')}
            />
          </>
        )}
      </div>

      {/* Professional Normal Footer - ONLY SHOWN WHEN LOGGED OUT */}
      {!currentUser && <Footer onNavigate={handleNavigate} />}

      {/* Auth Modal for Login and Sign In */}
      <AuthModal
        isOpen={authModalOpen}
        initialMode={authModalMode}
        onClose={() => setAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
}

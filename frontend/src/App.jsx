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
  const [walletBalance, setWalletBalance] = useState(0);

  // Pickups State (Starts empty for real user data)
  const [pickups, setPickups] = useState([]);

  // Real-Time Carbon & Environmental Impact Stats (Starts at zero for real data tracking)
  const [impactStats, setImpactStats] = useState({
    co2PreventedGrams: 0,
    landfillDivertedGrams: 0,
    itemsSegregated: 0,
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
  const handleCompletePickup = (pickupId, creditsEarned, co2Grams, weightGrams) => {
    let resolvedWeightGrams = weightGrams;
    const targetPickup = pickups.find((p) => p.id === pickupId);
    if (!resolvedWeightGrams && targetPickup) {
      if (typeof targetPickup.weightGrams === 'number' && targetPickup.weightGrams > 0) {
        resolvedWeightGrams = targetPickup.weightGrams;
      } else if (targetPickup.weightEst) {
        const val = parseFloat(targetPickup.weightEst) || 0.5;
        resolvedWeightGrams = targetPickup.weightEst.includes('kg') ? Math.round(val * 1000) : Math.round(val);
      } else {
        resolvedWeightGrams = 500;
      }
    }
    const resolvedCo2 = co2Grams || targetPickup?.co2Grams || Math.round((resolvedWeightGrams || 500) * 1.8);
    const resolvedCredits = creditsEarned || targetPickup?.credits || 20;

    setPickups((prev) =>
      prev.map((p) => (p.id === pickupId ? { ...p, status: 'COMPLETED' } : p))
    );

    // Deposit credits to wallet
    setWalletBalance((prev) => prev + resolvedCredits);

    // Update real-time carbon statistics
    setImpactStats((prev) => ({
      ...prev,
      co2PreventedGrams: prev.co2PreventedGrams + resolvedCo2,
      landfillDivertedGrams: prev.landfillDivertedGrams + (resolvedWeightGrams || 500),
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

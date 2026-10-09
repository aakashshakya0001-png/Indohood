import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import HowItWorks from './components/HowItWorks';
import ResidentDashboard from './components/ResidentDashboard';
import PickerDashboard from './components/PickerDashboard';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import { api } from './services/api';

export default function App() {
  // Authentication State (persisted in localStorage to keep user logged in on page refresh)
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('indohood_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login');

  // Eco-Credits Wallet State (persisted across page refresh)
  const [walletBalance, setWalletBalance] = useState(() => {
    try {
      const savedBalance = localStorage.getItem('indohood_wallet');
      return savedBalance !== null ? Number(savedBalance) : 0;
    } catch {
      return 0;
    }
  });

  // Pickups State (persisted across page refresh, starts empty for real user data)
  const [pickups, setPickups] = useState(() => {
    try {
      const savedPickups = localStorage.getItem('indohood_pickups');
      return savedPickups ? JSON.parse(savedPickups) : [];
    } catch {
      return [];
    }
  });

  // Real-Time Carbon & Environmental Impact Stats (persisted across page refresh)
  const [impactStats, setImpactStats] = useState(() => {
    try {
      const savedImpact = localStorage.getItem('indohood_impact');
      return savedImpact
        ? JSON.parse(savedImpact)
        : {
            co2PreventedGrams: 0,
            landfillDivertedGrams: 0,
            itemsSegregated: 0,
          };
    } catch {
      return {
        co2PreventedGrams: 0,
        landfillDivertedGrams: 0,
        itemsSegregated: 0,
      };
    }
  });

  // Automatically sync user session to localStorage
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem('indohood_user', JSON.stringify(currentUser));
      } else {
        localStorage.removeItem('indohood_user');
      }
    } catch (e) {
      console.warn('Failed to persist user session:', e);
    }
  }, [currentUser]);

  // Sync wallet balance to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('indohood_wallet', walletBalance.toString());
    } catch (e) {
      console.warn('Failed to persist wallet balance:', e);
    }
  }, [walletBalance]);

  // Sync pickups list to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('indohood_pickups', JSON.stringify(pickups));
    } catch (e) {
      console.warn('Failed to persist pickups:', e);
    }
  }, [pickups]);

  // Sync environmental impact stats to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('indohood_impact', JSON.stringify(impactStats));
    } catch (e) {
      console.warn('Failed to persist impact stats:', e);
    }
  }, [impactStats]);

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
    try {
      localStorage.setItem('indohood_user', JSON.stringify(profile));
    } catch (e) {
      console.warn('Failed to store user profile:', e);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('indohood_user');
      localStorage.removeItem('indohood_active_tab');
    } catch (e) {
      console.warn('Failed to clear session on logout:', e);
    }
  };

  const handleUpdateUser = (updatedProfile) => {
    setCurrentUser((prev) => {
      const updated = prev ? { ...prev, ...updatedProfile } : updatedProfile;
      try {
        localStorage.setItem('indohood_user', JSON.stringify(updated));
      } catch (e) {
        console.warn('Failed to store updated profile:', e);
      }
      return updated;
    });

    if (currentUser?.id) {
      api.updateUserProfile(currentUser.id, updatedProfile);
    }
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

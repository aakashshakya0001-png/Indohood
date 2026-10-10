import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import HowItWorks from './components/HowItWorks';
import ResidentDashboard from './components/ResidentDashboard';
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

  // Cross-device cloud sync: Fetch all community pickups from AWS DynamoDB on app launch and user login
  useEffect(() => {
    let isMounted = true;
    const fetchCloudPickups = async () => {
      try {
        const cloudPickups = await api.getPickups();
        if (isMounted && Array.isArray(cloudPickups)) {
          setPickups(cloudPickups);
        }
      } catch (err) {
        console.warn('[App] Could not fetch cloud pickups from DynamoDB:', err.message);
      }
    };
    fetchCloudPickups();
    return () => { isMounted = false; };
  }, [currentUser?.id, currentUser?.email]);

  // Dynamically compute user-specific environmental impact stats from user's own pickups
  useEffect(() => {
    if (!currentUser) {
      setImpactStats({
        co2PreventedGrams: 0,
        landfillDivertedGrams: 0,
        itemsSegregated: 0,
      });
      return;
    }

    const myPickups = (pickups || []).filter((p) => {
      const matchId = currentUser.id && p.userId && (p.userId === currentUser.id || p.userId === currentUser.email);
      const matchEmail = currentUser.email && p.userEmail && p.userEmail.toLowerCase() === currentUser.email.toLowerCase();
      return matchId || matchEmail;
    });

    const userCo2 = myPickups.reduce((sum, p) => sum + (Number(p.co2Grams) || 110), 0);
    const userLandfill = myPickups.reduce((sum, p) => {
      if (typeof p.weightGrams === 'number' && p.weightGrams > 0) return sum + p.weightGrams;
      if (p.weightEst) {
        const val = parseFloat(p.weightEst) || 0.5;
        return sum + (p.weightEst.includes('kg') ? Math.round(val * 1000) : Math.round(val));
      }
      return sum + 500;
    }, 0);
    const userItems = myPickups.length;

    setImpactStats({
      co2PreventedGrams: userCo2,
      landfillDivertedGrams: userLandfill,
      itemsSegregated: userItems,
    });
  }, [pickups, currentUser]);

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

  // Detect Password Reset URL token from inbound email
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get('resetToken')) {
        setAuthModalMode('forgot');
        setAuthModalOpen(true);
      }
    } catch (e) {
      // ignore
    }
  }, []);

  // Auth Handlers
  const handleOpenAuth = (mode) => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  const handleLoginSuccess = (profile) => {
    setCurrentUser(profile);
    setWalletBalance(Number(profile?.walletBalance) || 0);
    try {
      localStorage.setItem('indohood_user', JSON.stringify(profile));
      localStorage.setItem('indohood_wallet', (Number(profile?.walletBalance) || 0).toString());
    } catch (e) {
      console.warn('Failed to store user profile:', e);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setWalletBalance(0);
    setImpactStats({
      co2PreventedGrams: 0,
      landfillDivertedGrams: 0,
      itemsSegregated: 0,
    });
    try {
      localStorage.removeItem('indohood_user');
      localStorage.removeItem('indohood_wallet');
      localStorage.removeItem('indohood_impact');
      localStorage.removeItem('indohood_active_tab');
      localStorage.removeItem('indohood_pickups');
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
    if (newBooking) {
      api.schedulePickup(newBooking).catch((err) => console.warn('[App] Cloud pickup sync:', err.message));
    }
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

        {/* LOGGED IN AS RESIDENT CITIZEN */}
        {currentUser && (
          <ResidentDashboard
            user={{ ...currentUser, role: 'Resident' }}
            walletBalance={walletBalance}
            pickups={pickups}
            impactStats={impactStats}
            onSchedulePickup={handleSchedulePickup}
            onSimulatePickerComplete={handleCompletePickup}
            onLogout={handleLogout}
            onUpdateUser={handleUpdateUser}
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

import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import HowItWorks from './components/HowItWorks';
import RewardsStoreSection from './components/RewardsStoreSection';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';

export default function App() {
  // Authentication State
  const [currentUser, setCurrentUser] = useState(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login');

  // Eco-Credits Wallet State
  const [walletBalance, setWalletBalance] = useState(120);

  // Navigation Smooth Scroll Handler
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

  // Rewards Store Handler
  const handleRedeemItem = (creditsDeducted) => {
    setWalletBalance((prev) => Math.max(0, prev - creditsDeducted));
  };

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-stone-900 selection:bg-emerald-500 selection:text-white">
      {/* Top Navigation Bar with Login & Sign In buttons */}
      <Navbar
        user={currentUser}
        walletBalance={walletBalance}
        onOpenAuth={handleOpenAuth}
        onLogout={handleLogout}
        onNavigate={handleNavigate}
      />

      {/* Hero Section with user's authentic Indian recycling image */}
      <Hero
        onGetStarted={() => handleOpenAuth('signin')}
        onExploreHowItWorks={() => handleNavigate('how-it-works')}
      />

      {/* How Indohood Works (Closed-Loop Lifecycle) */}
      <HowItWorks
        onGetStarted={() => handleOpenAuth('signin')}
        onExploreStore={() => handleNavigate('store')}
      />

      {/* Indohood Direct Rewards Store */}
      <RewardsStoreSection
        walletBalance={walletBalance}
        onRedeemItem={handleRedeemItem}
      />

      {/* Professional Footer */}
      <Footer onNavigate={handleNavigate} />

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

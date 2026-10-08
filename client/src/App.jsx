import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import HowItWorks from './components/HowItWorks';
import ScannerSection from './components/ScannerSection';
import PickupsSection from './components/PickupsSection';
import PickupModal from './components/PickupModal';
import ImpactDashboard from './components/ImpactDashboard';
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

  // Pickups State (with 1 initial realistic scheduled item)
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
      instructions: 'Flattened and tied with jute string',
      status: 'SCHEDULED',
      createdAt: '2026-10-08T10:00:00Z',
    },
  ]);

  // Modal State for Booking Pickup
  const [pickupModalOpen, setPickupModalOpen] = useState(false);
  const [selectedItemForPickup, setSelectedItemForPickup] = useState(null);

  // Real-Time Carbon & Environmental Impact Stats
  const [impactStats, setImpactStats] = useState({
    co2PreventedGrams: 4200, // 4.2 kg
    landfillDivertedGrams: 6500, // 6.5 kg
    itemsSegregated: 18,
  });

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

  // Pickup Scheduling Handlers
  const handleScheduleNew = () => {
    setSelectedItemForPickup({
      id: 'custom_waste',
      name: 'Mixed Recyclable Batch',
      icon: '♻️',
      category: 'non-degradable',
      categoryLabel: 'Non-Degradable (Blue Bin)',
      binName: 'Blue Recyclables Bin',
      creditsAwarded: 20,
      co2PreventedGrams: 100,
      weightGrams: 500,
    });
    setPickupModalOpen(true);
  };

  const handleSchedulePickupForItem = (item) => {
    setSelectedItemForPickup(item);
    setPickupModalOpen(true);
  };

  const handleConfirmBooking = (newPickup) => {
    setPickups((prev) => [newPickup, ...prev]);
    // Scroll to pickups section so user sees their new booking
    setTimeout(() => {
      handleNavigate('pickups');
    }, 200);
  };

  // Simulator for Eco-Picker Verification
  const handleSimulateCompletePickup = (pickupId, creditsEarned, co2Grams) => {
    setPickups((prev) =>
      prev.map((p) => (p.id === pickupId ? { ...p, status: 'COMPLETED' } : p))
    );

    // Add credits to wallet
    setWalletBalance((prev) => prev + creditsEarned);

    // Update real-time carbon reduction stats
    setImpactStats((prev) => ({
      ...prev,
      co2PreventedGrams: prev.co2PreventedGrams + (co2Grams || 80),
      landfillDivertedGrams: prev.landfillDivertedGrams + (co2Grams * 1.5 || 120),
      itemsSegregated: prev.itemsSegregated + 1,
    }));
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
        onStartScan={() => handleNavigate('scanner')}
        onExplorePickups={() => handleNavigate('pickups')}
      />

      {/* How Indohood Works (Closed-Loop Lifecycle) */}
      <HowItWorks
        onStartScan={() => handleNavigate('scanner')}
        onSchedulePickup={() => handleNavigate('pickups')}
      />

      {/* AI Waste Scanner Section (Bedrock Multimodal Classification) */}
      <ScannerSection
        onSchedulePickupForItem={handleSchedulePickupForItem}
      />

      {/* Pickup Schedule & Picker Verification Section */}
      <PickupsSection
        pickups={pickups}
        onScheduleNew={handleScheduleNew}
        onSimulateCompletePickup={handleSimulateCompletePickup}
        currentUser={currentUser}
      />

      {/* Real-Time Carbon Emission ($CO_2$) & Environmental Impact Dashboard */}
      <ImpactDashboard
        impactStats={impactStats}
        currentUser={currentUser}
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

      {/* Pickup Booking Modal */}
      <PickupModal
        isOpen={pickupModalOpen}
        item={selectedItemForPickup}
        currentUser={currentUser}
        onClose={() => setPickupModalOpen(false)}
        onConfirmBooking={handleConfirmBooking}
      />
    </div>
  );
}

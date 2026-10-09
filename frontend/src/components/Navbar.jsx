import React, { useState, useEffect } from 'react';

export default function Navbar({ user, walletBalance, onOpenAuth, onLogout, onNavigate }) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 inset-x-0 z-40 transition-all duration-300 ${
        isScrolled 
          ? 'bg-stone-50/95 backdrop-blur-md border-b border-stone-200/70 shadow-2xs' 
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
        
        {/* Brand Name & Dynamic Scroll-triggered Logo */}
        <div 
          onClick={() => onNavigate('hero')}
          className="flex items-center cursor-pointer group select-none"
        >
          {/* Logo: Always shown on mobile phone screen; on desktop (sm:), responds to scroll dynamically */}
          <div 
            className={`transition-all duration-300 ease-in-out overflow-hidden flex items-center shrink-0 ${
              isScrolled 
                ? 'w-9 h-9 sm:w-11 sm:h-11 opacity-100 scale-100 mr-0 sm:mr-2.5' 
                : 'w-9 h-9 opacity-100 scale-100 mr-0 sm:w-0 sm:h-11 sm:opacity-0 sm:scale-75 sm:pointer-events-none sm:mr-0'
            }`}
          >
            <img
              src="/logo.png"
              alt="IndoHood Logo"
              className="w-9 h-9 sm:w-11 sm:h-11 object-contain group-hover:scale-105 transition-transform shrink-0"
            />
          </div>
          <span className="hidden sm:inline text-xl sm:text-2xl font-black tracking-tight text-stone-900 font-sans">
            IndoHood
          </span>
        </div>

        {/* Right Top Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {user ? (
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Wallet Pill */}
              <div 
                className="px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-amber-50/90 backdrop-blur-xs border border-amber-200 text-amber-900 text-[11px] sm:text-xs font-bold"
              >
                {walletBalance} Credits
              </div>

              {/* User Profile */}
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-stone-100/90 backdrop-blur-xs border border-stone-200 text-stone-700 text-xs font-medium">
                <span className="font-semibold text-stone-900">{user.name}</span>
                <span className="text-emerald-800 font-bold text-[10px] bg-emerald-100/80 px-2 py-0.5 rounded-full">🌱 Resident</span>
              </div>

              {/* Logout Button */}
              <button
                onClick={onLogout}
                className="px-2.5 sm:px-3 py-1 sm:py-1.5 text-xs font-bold text-stone-600 hover:text-stone-900 hover:bg-white/80 rounded-xl transition-colors cursor-pointer border border-stone-200"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 sm:gap-2.5">
              {/* Login Button */}
              <button
                onClick={() => onOpenAuth('login')}
                className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-stone-800 hover:text-stone-900 bg-white/60 hover:bg-white/90 backdrop-blur-xs rounded-xl transition-all cursor-pointer border border-stone-300/70 shadow-2xs"
              >
                Login
              </button>

              {/* Sign In Button */}
              <button
                onClick={() => onOpenAuth('signin')}
                className="px-3.5 sm:px-5 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 rounded-xl shadow-md shadow-emerald-600/25 transition-all cursor-pointer hover:shadow-lg active:scale-95"
              >
                Sign In
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

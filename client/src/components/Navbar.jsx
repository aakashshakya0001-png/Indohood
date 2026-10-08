import React from 'react';
import { Leaf, Coins, Calendar, Sparkles, User, LogOut, CheckCircle } from 'lucide-react';

export default function Navbar({ user, walletBalance, onOpenAuth, onLogout, onNavigate }) {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-stone-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <div 
          onClick={() => onNavigate('hero')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <Leaf className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black tracking-tight text-stone-900 font-sans">
                Indohood
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                इण्डोहूड 🌱
              </span>
            </div>
            <p className="text-[11px] font-medium text-stone-500 hidden sm:block">
              AI Waste Segregation & Green Credits
            </p>
          </div>
        </div>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-stone-600">
          <button 
            onClick={() => onNavigate('how-it-works')} 
            className="hover:text-emerald-600 transition-colors cursor-pointer"
          >
            How It Works
          </button>
          <button 
            onClick={() => onNavigate('store')} 
            className="hover:text-emerald-600 transition-colors cursor-pointer"
          >
            Green Store
          </button>
        </nav>

        {/* Right Top Action Buttons */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              {/* Wallet Pill */}
              <div 
                onClick={() => onNavigate('store')}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200/80 text-amber-900 shadow-xs cursor-pointer hover:bg-amber-100/80 transition-all"
                title="Your Eco-Credits Balance"
              >
                <Coins className="w-4 h-4 text-amber-500 animate-pulse" />
                <span className="text-xs font-bold tracking-tight">
                  <span className="text-amber-600 font-extrabold mr-1">🪙</span>
                  {walletBalance} Credits
                </span>
              </div>

              {/* User Profile */}
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-stone-100 border border-stone-200 text-stone-700 text-xs font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span className="font-semibold text-stone-900">{user.name}</span>
                <span className="text-stone-400">({user.role})</span>
              </div>

              {/* Logout Button */}
              <button
                onClick={onLogout}
                className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-full transition-colors cursor-pointer"
                title="Log out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              {/* Login Button */}
              <button
                onClick={() => onOpenAuth('login')}
                className="px-4 py-2 text-sm font-semibold text-stone-700 hover:text-stone-900 hover:bg-stone-100 rounded-xl transition-all cursor-pointer border border-stone-200 shadow-2xs"
              >
                Login
              </button>

              {/* Sign In / Sign Up Button */}
              <button
                onClick={() => onOpenAuth('signin')}
                className="px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 rounded-xl shadow-md shadow-emerald-600/25 transition-all cursor-pointer hover:shadow-lg hover:shadow-emerald-600/30 active:scale-95"
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

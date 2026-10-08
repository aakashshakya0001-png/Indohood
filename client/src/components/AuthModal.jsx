import React, { useState } from 'react';
import { X, User, Lock, Mail, Sparkles, ShieldCheck, CheckCircle } from 'lucide-react';

export default function AuthModal({ isOpen, initialMode, onClose, onLoginSuccess }) {
  const [mode, setMode] = useState(initialMode || 'login'); // 'login' or 'signin'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('Resident');

  if (!isOpen) return null;

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    const resolvedName = name || (email ? email.split('@')[0] : 'Community Member');
    onLoginSuccess({
      name: resolvedName,
      email: email || 'user@indohood.eco',
      role: role,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    });
    onClose();
  };

  const handleQuickDemoLogin = (profile) => {
    onLoginSuccess(profile);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden transform transition-all">
        
        {/* Header decoration */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 pt-6 pb-5 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl">🌱</span>
            <h3 className="text-xl font-black tracking-tight">
              {mode === 'login' ? 'Welcome Back to Indohood' : 'Create an Indohood Account'}
            </h3>
          </div>
          <p className="text-xs font-medium text-emerald-100">
            {mode === 'login' 
              ? 'Sign in to access your Eco-Credits wallet and pickups'
              : 'Join thousands of Indian homes eliminating landfill waste'}
          </p>

          {/* Mode Switcher Tabs */}
          <div className="mt-4 flex rounded-xl bg-black/15 p-1">
            <button
              onClick={() => setMode('login')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                mode === 'login'
                  ? 'bg-white text-emerald-800 shadow-sm'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setMode('signin')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                mode === 'signin'
                  ? 'bg-white text-emerald-800 shadow-sm'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              Sign In (Register)
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          
          {/* Quick Demo Logins for Hackathon Judges */}
          <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/90 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-800 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                1-Click Quick Demo Login (For Judges)
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin({
                  name: 'Aakash',
                  email: 'aakash@indohood.eco',
                  role: 'Resident',
                  address: 'Flat 402, Green Valley Apartments, New Delhi',
                })}
                className="p-2.5 rounded-xl bg-white hover:bg-emerald-50 border border-amber-200 hover:border-emerald-300 text-left transition-all cursor-pointer group shadow-2xs"
              >
                <p className="text-xs font-bold text-stone-900 group-hover:text-emerald-700">
                  🏠 Resident: Aakash
                </p>
                <p className="text-[10px] text-stone-500">
                  Wallet: 100 Credits
                </p>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin({
                  name: 'Raju (Eco-Picker)',
                  email: 'raju.picker@indohood.eco',
                  role: 'Picker',
                  zone: 'South Delhi Sector 4',
                })}
                className="p-2.5 rounded-xl bg-white hover:bg-teal-50 border border-amber-200 hover:border-teal-300 text-left transition-all cursor-pointer group shadow-2xs"
              >
                <p className="text-xs font-bold text-stone-900 group-hover:text-teal-700">
                  🚛 Eco-Picker: Raju
                </p>
                <p className="text-[10px] text-stone-500">
                  Verifies Collections
                </p>
              </button>
            </div>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-stone-200 w-full"></div>
            <span className="bg-white px-3 text-[11px] font-semibold text-stone-400 uppercase tracking-wider">
              Or continue with email
            </span>
          </div>

          {/* Form */}
          <form onSubmit={handleCustomSubmit} className="space-y-3.5">
            {mode === 'signin' && (
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Priya Sharma"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-hidden focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 text-sm transition-all"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-hidden focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 text-sm transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-hidden focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 text-sm transition-all"
                />
              </div>
            </div>

            {mode === 'signin' && (
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">I want to join as</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole('Resident')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      role === 'Resident'
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-800'
                        : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    🏠 Household Resident
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('Picker')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      role === 'Picker'
                        ? 'bg-teal-50 border-teal-500 text-teal-800'
                        : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    🚛 Eco-Picker (Collector)
                  </button>
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-md shadow-emerald-600/25 transition-all cursor-pointer hover:shadow-lg active:scale-98"
            >
              {mode === 'login' ? 'Log In to Indohood' : 'Create My Account'}
            </button>
          </form>

        </div>

      </div>
    </div>
  );
}

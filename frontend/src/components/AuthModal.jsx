import React, { useState, useEffect } from 'react';
import { X, User, Lock, Mail, CheckCircle2, ArrowLeft } from 'lucide-react';

export default function AuthModal({ isOpen, initialMode, onClose, onLoginSuccess }) {
  const [mode, setMode] = useState(initialMode || 'login'); // 'login' | 'signin' | 'forgot'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);

  useEffect(() => {
    if (initialMode) {
      setMode(initialMode === 'phone' ? 'login' : initialMode);
      setForgotSuccess(false);
    }
  }, [initialMode, isOpen]);

  useEffect(() => {
    if (email) {
      setForgotEmail(email);
    }
  }, [email]);

  if (!isOpen) return null;

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    const resolvedName = name || (email ? email.split('@')[0] : 'Community Resident');
    onLoginSuccess({
      name: resolvedName,
      email: email || 'resident@indohood.eco',
      role: 'Resident',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    });
    onClose();
  };

  const handleGoogleAuth = () => {
    onLoginSuccess({
      name: 'Aakash Shakya',
      email: 'aakash.shakya@gmail.com',
      role: 'Resident',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      provider: 'google',
    });
    onClose();
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    setForgotSuccess(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      {/* Standard auth card with mobile responsive sizing */}
      <div className="relative w-full max-w-[440px] min-h-[520px] max-h-[94vh] bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col justify-between transform transition-all">
        
        {/* Header decoration */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-5 sm:px-6 pt-5 sm:pt-6 pb-4 sm:pb-5 text-white relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 sm:top-5 right-4 sm:right-5 p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5 mb-1">
            <img
              src="/logo.png"
              alt="IndoHood Logo"
              className="w-8 h-8 object-contain bg-white/95 rounded-xl p-0.5 shadow-xs"
            />
            <h3 className="text-lg sm:text-xl font-black tracking-tight">
              {mode === 'login' && 'Welcome Back to IndoHood'}
              {mode === 'signin' && 'Create an IndoHood Account'}
              {mode === 'forgot' && 'Reset Password'}
            </h3>
          </div>

          {/* Mode Switcher Tabs */}
          {mode !== 'forgot' ? (
            <div className="mt-3.5 flex rounded-xl bg-black/15 p-1 gap-1">
              <button
                type="button"
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
                type="button"
                onClick={() => setMode('signin')}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  mode === 'signin'
                    ? 'bg-white text-emerald-800 shadow-sm'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                Sign In
              </button>
            </div>
          ) : (
            <div className="mt-4">
              <button
                type="button"
                onClick={() => {
                  setForgotSuccess(false);
                  setMode('login');
                }}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-white/90 hover:text-white transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back to Login
              </button>
            </div>
          )}
        </div>

        {/* Modal Body */}
        {mode === 'forgot' ? (
          <div className="flex-1 p-6 sm:p-7 flex flex-col justify-between overflow-y-auto">
            {!forgotSuccess ? (
              <form onSubmit={handleForgotSubmit} className="space-y-4">
                <p className="text-xs text-stone-600 leading-relaxed">
                  Enter the email address linked to your IndoHood account. We will send you a secure verification link to reset your password.
                </p>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                    <input
                      type="email"
                      required
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-hidden focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 text-sm transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-md shadow-emerald-600/25 transition-all cursor-pointer hover:shadow-lg active:scale-98"
                >
                  Send Reset Link
                </button>
              </form>
            ) : (
              <div className="space-y-4 text-center my-auto py-2">
                <div className="w-12 h-12 mx-auto rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-stone-900">Check Your Email</h4>
                  <p className="text-xs text-stone-600 mt-1">
                    We sent a password reset link to:
                  </p>
                  <p className="text-xs font-bold text-emerald-800 mt-0.5">
                    {forgotEmail || 'your email'}
                  </p>
                </div>
                <p className="text-[11px] text-stone-500">
                  Didn't receive the email? Check your spam folder or try again.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setForgotSuccess(false);
                    setMode('login');
                  }}
                  className="w-full py-2.5 px-4 rounded-xl font-bold text-xs text-stone-700 bg-stone-100 hover:bg-stone-200 transition-colors cursor-pointer"
                >
                  Return to Login
                </button>
              </div>
            )}

            <div className="pt-2 text-center text-xs text-stone-500">
              Remember your password?{' '}
              <button
                type="button"
                onClick={() => {
                  setForgotSuccess(false);
                  setMode('login');
                }}
                className="font-bold text-emerald-700 hover:text-emerald-800 cursor-pointer"
              >
                Log In
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleCustomSubmit} className="flex-1 p-6 sm:p-7 flex flex-col justify-between overflow-y-auto">
            <div className="space-y-3.5">
              {/* 1-Click Google Auth Button */}
              <button
                type="button"
                onClick={handleGoogleAuth}
                className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl border border-stone-300 hover:border-stone-400 bg-white hover:bg-stone-50 text-stone-700 text-sm font-semibold transition-all shadow-2xs cursor-pointer active:scale-98"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>

              {/* Centered Divider with 'Or' right in the middle */}
              <div className="flex items-center my-2.5">
                <div className="grow border-t border-stone-200"></div>
                <span className="shrink-0 px-3 text-xs font-medium text-stone-400">Or</span>
                <div className="grow border-t border-stone-200"></div>
              </div>

              {/* Input Fields */}
              <div className="space-y-3">
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
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-stone-700">Password</label>
                    {mode === 'login' && (
                      <button
                        type="button"
                        onClick={() => {
                          setForgotEmail(email);
                          setForgotSuccess(false);
                          setMode('forgot');
                        }}
                        className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 cursor-pointer"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
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
              </div>
            </div>

            {/* Bottom Actions: Submit button & Mode toggle */}
            <div className="space-y-3 pt-3">
              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-md shadow-emerald-600/25 transition-all cursor-pointer hover:shadow-lg active:scale-98"
              >
                {mode === 'login' ? 'Log In to IndoHood' : 'Create My Account'}
              </button>

              <div className="text-center text-xs text-stone-500">
                {mode === 'login' ? (
                  <p>
                    Don't have an account?{' '}
                    <button
                      type="button"
                      onClick={() => setMode('signin')}
                      className="font-bold text-emerald-700 hover:text-emerald-800 cursor-pointer"
                    >
                      Sign In
                    </button>
                  </p>
                ) : (
                  <p>
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => setMode('login')}
                      className="font-bold text-emerald-700 hover:text-emerald-800 cursor-pointer"
                    >
                      Log In
                    </button>
                  </p>
                )}
              </div>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}

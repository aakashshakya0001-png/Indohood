import React, { useState, useEffect } from 'react';
import { X, User, Lock, Mail, CheckCircle2, ArrowLeft, KeyRound, ShieldCheck, AlertCircle, Loader2, Sparkles } from 'lucide-react';
import { api } from '../services/api';

export default function AuthModal({ isOpen, initialMode, onClose, onLoginSuccess }) {
  const [mode, setMode] = useState(initialMode || 'login'); // 'login' | 'signin' | 'forgot'
  const [registerStep, setRegisterStep] = useState('form'); // 'form' | 'otp' | 'success'
  const role = 'resident'; // Strictly Resident Citizen for hackathon platform
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [otp, setOtp] = useState('');
  const [sentOtpPreview, setSentOtpPreview] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successNotice, setSuccessNotice] = useState('');
  
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);

  useEffect(() => {
    if (initialMode) {
      setMode(initialMode === 'phone' ? 'login' : initialMode);
      setRegisterStep('form');
      setForgotSuccess(false);
      setErrorMessage('');
      setSuccessNotice('');
    }
  }, [initialMode, isOpen]);

  useEffect(() => {
    if (email) {
      setForgotEmail(email);
    }
  }, [email]);

  if (!isOpen) return null;

  // Clear errors when switching tabs
  const switchMode = (newMode) => {
    setMode(newMode);
    setRegisterStep('form');
    setErrorMessage('');
    setSuccessNotice('');
  };

  // Step 1: Send Verification OTP to Email
  const handleInitiateRegistration = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      const res = await api.sendVerificationOtp(email);
      if (res && res.success) {
        setSentOtpPreview(res.otp || '');
        setRegisterStep('otp');
      } else {
        setErrorMessage(res?.message || 'Failed to send verification code. Please check your email.');
      }
    } catch (err) {
      setErrorMessage(err.message || 'Error sending verification code');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP and Register Account
  const handleVerifyOtpAndRegister = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      const res = await api.verifyAndRegister({
        name,
        email,
        password,
        otp,
        role: 'resident'
      });

      if (res && res.success) {
        setRegisterStep('success');
      } else {
        setErrorMessage(res?.message || 'Verification failed. Please check the code and try again.');
      }
    } catch (err) {
      setErrorMessage(err.message || 'Verification error');
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Transition from Registration Success to Login (Login in second time)
  const handleProceedToLogin = () => {
    setRegisterStep('form');
    setMode('login');
    setPassword('');
    setOtp('');
    setSuccessNotice('Account verified! Please enter your password to log in.');
  };

  // Log In Handler (Second time after registration or for returning users)
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      const res = await api.loginUser(email, password);
      if (res && res.success && res.data) {
        const userProfile = {
          id: res.data.id || `usr_${Date.now()}`,
          name: res.data.name || email.split('@')[0],
          email: res.data.email || email,
          role: 'Resident',
          walletBalance: res.data.walletBalance ?? 0,
          tier: res.data.tier || 'Tier 1 Green Starter',
          avatar: res.data.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
          location: res.data.location || '',
          bio: res.data.bio || '',
          address: res.data.address || ''
        };

        onLoginSuccess(userProfile);
        onClose();
      } else {
        setErrorMessage(res?.message || 'Invalid email or password. Please try again.');
      }
    } catch (err) {
      setErrorMessage(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    setForgotSuccess(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-[440px] min-h-[530px] max-h-[94vh] bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col justify-between transform transition-all">
        
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
              {mode === 'login' && 'Log In to IndoHood'}
              {mode === 'signin' && (
                registerStep === 'otp' ? 'Verify Your Email' :
                registerStep === 'success' ? 'Registration Complete' :
                'Register as Resident'
              )}
              {mode === 'forgot' && 'Reset Password'}
            </h3>
          </div>

          {/* Mode Switcher Tabs */}
          {mode !== 'forgot' && registerStep !== 'otp' && registerStep !== 'success' ? (
            <div className="mt-3.5 flex rounded-xl bg-black/15 p-1 gap-1">
              <button
                type="button"
                onClick={() => switchMode('login')}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  mode === 'login'
                    ? 'bg-white text-emerald-800 shadow-sm'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                Log In
              </button>
              <button
                type="button"
                onClick={() => switchMode('signin')}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  mode === 'signin'
                    ? 'bg-white text-emerald-800 shadow-sm'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                Register
              </button>
            </div>
          ) : mode === 'forgot' ? (
            <div className="mt-4">
              <button
                type="button"
                onClick={() => {
                  setForgotSuccess(false);
                  switchMode('login');
                }}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-white/90 hover:text-white transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back to Login
              </button>
            </div>
          ) : registerStep === 'otp' ? (
            <div className="mt-3 text-xs text-white/90 flex items-center justify-between">
              <span>Step 2 of 2: OTP Verification</span>
              <button
                type="button"
                onClick={() => {
                  setRegisterStep('form');
                  setErrorMessage('');
                }}
                className="underline hover:text-white cursor-pointer font-medium"
              >
                Edit Details
              </button>
            </div>
          ) : null}
        </div>

        {/* Global Error Notice */}
        {errorMessage && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Success Notice */}
        {successNotice && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{successNotice}</span>
          </div>
        )}

        {/* ===================== FORGOT PASSWORD TAB ===================== */}
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
                  <p className="text-xs text-stone-600 mt-1">We sent a password reset link to:</p>
                  <p className="text-xs font-bold text-emerald-800 mt-0.5">{forgotEmail || 'your email'}</p>
                </div>
                <p className="text-[11px] text-stone-500">
                  Didn't receive the email? Check your spam folder or try again.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setForgotSuccess(false);
                    switchMode('login');
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
                  switchMode('login');
                }}
                className="font-bold text-emerald-700 hover:text-emerald-800 cursor-pointer"
              >
                Log In
              </button>
            </div>
          </div>

        /* ===================== REGISTRATION: OTP VERIFY STEP ===================== */
        ) : mode === 'signin' && registerStep === 'otp' ? (
          <form onSubmit={handleVerifyOtpAndRegister} className="flex-1 p-6 sm:p-7 flex flex-col justify-between overflow-y-auto">
            <div className="space-y-4 my-auto">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-700 shadow-xs">
                <KeyRound className="w-6 h-6" />
              </div>

              <div className="text-center">
                <h4 className="text-base font-black text-stone-900">Enter Verification Code</h4>
                <p className="text-xs text-stone-600 mt-1">
                  We've generated a 6-digit verification code for:
                </p>
                <p className="text-xs font-bold text-emerald-800 mt-0.5 bg-emerald-50 py-1 px-2.5 rounded-lg inline-block border border-emerald-100">
                  {email}
                </p>
              </div>

              {/* Instant Verification Code Helper */}
              {sentOtpPreview && (
                <div className="p-2.5 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 text-xs text-center flex items-center justify-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                  <span>
                    Your verification code is: <strong className="font-mono text-sm tracking-wider font-bold text-teal-900">{sentOtpPreview}</strong>
                  </span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5 text-center">
                  6-Digit OTP Code
                </label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="• • • • • •"
                  className="w-full text-center tracking-[0.4em] font-mono text-lg py-3 px-4 rounded-xl border border-stone-200 focus:outline-hidden focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all font-bold text-stone-800"
                />
              </div>

              <p className="text-[11px] text-stone-500 text-center">
                Enter the code above to verify your email address and create your IndoHood account.
              </p>
            </div>

            <div className="space-y-2 pt-4">
              <button
                type="submit"
                disabled={loading || otp.length < 6}
                className="w-full py-3 px-4 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-md shadow-emerald-600/25 transition-all cursor-pointer hover:shadow-lg active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                Verify Email & Register
              </button>

              <button
                type="button"
                onClick={() => setRegisterStep('form')}
                className="w-full py-2 text-xs font-bold text-stone-500 hover:text-stone-800 transition-colors cursor-pointer"
              >
                Back to registration form
              </button>
            </div>
          </form>

        /* ===================== REGISTRATION: SUCCESS STEP ===================== */
        ) : mode === 'signin' && registerStep === 'success' ? (
          <div className="flex-1 p-6 sm:p-7 flex flex-col justify-between overflow-y-auto">
            <div className="space-y-4 text-center my-auto py-2">
              <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shadow-sm animate-bounce-subtle">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h4 className="text-lg font-black text-stone-900">Email Verified Successfully!</h4>
                <p className="text-xs text-stone-600 mt-1 max-w-[280px] mx-auto">
                  Your IndoHood account has been created and securely saved in the cloud.
                </p>
              </div>

              <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-3.5 text-left text-xs text-emerald-900 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-stone-500">Account:</span>
                  <span className="font-bold">{email}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-stone-500">Account Type:</span>
                  <span className="font-bold text-emerald-800">🌱 Resident Citizen</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-stone-500">Status:</span>
                  <span className="font-bold text-emerald-700">Verified & Active ✅</span>
                </div>
              </div>

              <p className="text-[11px] text-stone-500">
                As per security policy, please log in with your credentials to access your dashboard.
              </p>
            </div>

            <button
              type="button"
              onClick={handleProceedToLogin}
              className="w-full py-3 px-4 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-md shadow-emerald-600/25 transition-all cursor-pointer hover:shadow-lg active:scale-98"
            >
              Proceed to Log In
            </button>
          </div>

        /* ===================== REGISTRATION: STEP 1 (FORM) ===================== */
        ) : mode === 'signin' ? (
          <form onSubmit={handleInitiateRegistration} className="flex-1 p-6 sm:p-7 flex flex-col justify-between overflow-y-auto">
            <div className="space-y-3.5">
              
              {/* Full Name */}
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

              {/* Email Address */}
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
                <p className="text-[11px] text-stone-500 mt-1">A 6-digit verification code will be sent to this email.</p>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Create Password</label>
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

            {/* Bottom Actions */}
            <div className="space-y-3 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-md shadow-emerald-600/25 transition-all cursor-pointer hover:shadow-lg active:scale-98 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
                Send Verification Code
              </button>

              <div className="text-center text-xs text-stone-500">
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => switchMode('login')}
                  className="font-bold text-emerald-700 hover:text-emerald-800 cursor-pointer"
                >
                  Log In
                </button>
              </div>
            </div>
          </form>

        /* ===================== LOGIN TAB (SECOND TIME / RETURNING) ===================== */
        ) : (
          <form onSubmit={handleLoginSubmit} className="flex-1 p-6 sm:p-7 flex flex-col justify-between overflow-y-auto">
            <div className="space-y-3.5">
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
                  <button
                    type="button"
                    onClick={() => {
                      setForgotEmail(email);
                      setForgotSuccess(false);
                      switchMode('forgot');
                    }}
                    className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 cursor-pointer"
                  >
                    Forgot password?
                  </button>
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

            {/* Bottom Actions */}
            <div className="space-y-3 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-md shadow-emerald-600/25 transition-all cursor-pointer hover:shadow-lg active:scale-98 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                Log In to IndoHood
              </button>

              <div className="text-center text-xs text-stone-500">
                Don't have an account yet?{' '}
                <button
                  type="button"
                  onClick={() => switchMode('signin')}
                  className="font-bold text-emerald-700 hover:text-emerald-800 cursor-pointer"
                >
                  Register with Email
                </button>
              </div>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}

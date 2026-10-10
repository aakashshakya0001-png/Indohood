import React from 'react';
import heroImage from '../assets/hero-image.jpg';

export default function Hero({ onGetStarted, onExploreHowItWorks }) {
  return (
    <section className="relative overflow-hidden min-h-[580px] sm:min-h-[600px] lg:min-h-[720px] flex items-center isolate">
      {/* Background Image: Indian family in courtyard */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <img
          src={heroImage || '/hero-image.jpg'}
          onError={(e) => {
            if (e.currentTarget.src !== window.location.origin + '/hero-image.jpg') {
              e.currentTarget.src = '/hero-image.jpg';
            }
          }}
          alt="Household waste segregation in an Indian courtyard"
          className="w-full h-full object-cover object-[28%_center] sm:object-center select-none sm:[transform:scaleX(-1)]"
        />

        {/* Mobile: White transparent sheet layer over the background image */}
        <div className="sm:hidden absolute inset-0 bg-white/60 backdrop-blur-[1px]"></div>

        {/* Desktop gradient overlay */}
        <div className="hidden sm:block absolute inset-0 bg-gradient-to-r from-stone-50/90 via-stone-50/35 via-50% to-transparent"></div>
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-stone-50 to-transparent"></div>
      </div>

      {/* Hero Content placed on top of the transparent sheet */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-24 sm:pt-32 lg:pt-36 pb-12 sm:pb-16 lg:pb-24">
        <div className="max-w-2xl space-y-4 sm:space-y-6 text-left">
          
          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-stone-900 tracking-tight leading-[1.15]">
            One more use.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-700 via-teal-700 to-amber-700">
              One less ending.
            </span>
          </h1>

          {/* Subheading / Brand Quote */}
          <p className="text-sm sm:text-xl font-medium text-stone-800 leading-relaxed">
            <span className="text-emerald-900 font-semibold italic">
              “Change the way things move.”
            </span>
            <br />
            From your home to their next purpose, Indohood makes every handoff smarter, easier, and more rewarding.
          </p>

          {/* Clean CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-1 sm:pt-2">
            <button
              onClick={onGetStarted}
              className="w-full sm:w-auto px-7 sm:px-8 py-3.5 rounded-2xl font-bold text-sm sm:text-base text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg shadow-emerald-600/30 hover:shadow-xl hover:shadow-emerald-600/40 active:scale-98 transition-all cursor-pointer text-center"
            >
              Get Started
            </button>

            <button
              onClick={onExploreHowItWorks}
              className="w-full sm:w-auto px-6 sm:px-7 py-3.5 rounded-2xl font-bold text-sm sm:text-base text-stone-800 bg-white/90 hover:bg-white border border-stone-200/90 shadow-xs hover:border-emerald-300 hover:text-emerald-700 transition-all cursor-pointer text-center"
            >
              How It Works
            </button>
          </div>

          {/* Key Micro-Metrics */}
          <div className="pt-4 sm:pt-6 border-t border-stone-300/70 grid grid-cols-3 gap-2 sm:gap-6">
            <div className="text-center sm:text-left min-w-0">
              <p className="text-lg sm:text-3xl font-black text-emerald-800 tracking-tight">100%</p>
              <p className="text-[10px] sm:text-xs font-semibold text-stone-700 sm:text-stone-600 leading-tight">Segregated</p>
            </div>
            <div className="text-center sm:text-left min-w-0">
              <p className="text-lg sm:text-3xl font-black text-teal-800 tracking-tight">4.2 Tons</p>
              <p className="text-[10px] sm:text-xs font-semibold text-stone-700 sm:text-stone-600 leading-tight">CO₂ Avoided</p>
            </div>
            <div className="text-center sm:text-left min-w-0">
              <p className="text-lg sm:text-3xl font-black text-amber-700 tracking-tight">35,000+</p>
              <p className="text-[10px] sm:text-xs font-semibold text-stone-700 sm:text-stone-600 leading-tight">Credits Awarded</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

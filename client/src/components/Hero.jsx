import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Calendar, Coins, Recycle, Trees } from 'lucide-react';

export default function Hero({ onStartScan, onExplorePickups }) {
  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:py-20 bg-gradient-to-b from-amber-50/40 via-stone-50 to-emerald-50/20">
      {/* Decorative ambient background glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-200/30 rounded-full blur-3xl pointer-events-none -z-10"></div>
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-emerald-200/25 rounded-full blur-3xl pointer-events-none -z-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Headline, Mission, Badges & CTA */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            {/* Hackathon Track & Mission Badges */}
            <div className="inline-flex flex-wrap items-center justify-center lg:justify-start gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-emerald-100/90 text-emerald-800 border border-emerald-300 shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                Track 03: Waste & Energy
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100/90 text-amber-900 border border-amber-300 shadow-2xs">
                🇮🇳 Bharat Builds Tour
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-stone-900 tracking-tight leading-[1.12]">
              Kachra alag karo,{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-amber-600">
                Eco-Credits pao!
              </span>
            </h1>

            {/* Subheading / Cultural Quote */}
            <p className="text-lg sm:text-xl font-medium text-stone-700 leading-relaxed max-w-xl mx-auto lg:mx-0">
              <span className="text-emerald-800 font-semibold italic">
                "Jo tumhare liye kabaad hai, wo kisi ke liye zaroorat hai."
              </span>
              <br />
              Scan household waste with AI, schedule doorstep collection, reduce carbon emissions, and redeem real rewards at the Indohood Store.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={onStartScan}
                className="w-full sm:w-auto px-7 py-3.5 rounded-2xl font-bold text-base text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg shadow-emerald-600/30 hover:shadow-xl hover:shadow-emerald-600/40 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-5 h-5 text-emerald-200" />
                Scan Waste with AI Now
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onExplorePickups}
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl font-bold text-base text-stone-800 bg-white hover:bg-stone-50 border border-stone-200 shadow-sm hover:border-emerald-300 hover:text-emerald-700 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Calendar className="w-5 h-5 text-teal-600" />
                Schedule a Pickup
              </button>
            </div>

            {/* Key Micro-Metrics */}
            <div className="pt-6 border-t border-stone-200/80 grid grid-cols-3 gap-4 text-center lg:text-left">
              <div>
                <p className="text-2xl font-black text-emerald-700 tracking-tight">100%</p>
                <p className="text-xs font-semibold text-stone-500">Source Segregated</p>
              </div>
              <div>
                <p className="text-2xl font-black text-teal-700 tracking-tight">4.2 Tons</p>
                <p className="text-xs font-semibold text-stone-500">CO₂ Avoided</p>
              </div>
              <div>
                <p className="text-2xl font-black text-amber-600 tracking-tight">35,000+</p>
                <p className="text-xs font-semibold text-stone-500">Credits Awarded</p>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Image with Cultural Framing & Floating Badges */}
          <div className="lg:col-span-6 relative">
            <div className="relative mx-auto max-w-lg lg:max-w-none">
              
              {/* Outer decorative ring */}
              <div className="absolute -inset-2 sm:-inset-3 rounded-3xl bg-gradient-to-tr from-amber-400/40 via-emerald-400/30 to-teal-400/40 blur-xl opacity-75"></div>

              {/* The Hero Image Container */}
              <div className="relative rounded-3xl overflow-hidden border-4 border-white/90 shadow-2xl shadow-stone-800/20 bg-stone-100">
                <img
                  src="/hero-image.jpg"
                  alt="Mother and daughter happily segregating household recyclables on an Indian sunlit terrace with green bins"
                  className="w-full h-[380px] sm:h-[460px] lg:h-[500px] object-cover object-center transform hover:scale-102 transition-transform duration-700"
                />

                {/* Subtle warm gradient overlay at the base */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none"></div>

                {/* Overlay Caption Banner */}
                <div className="absolute bottom-4 left-4 right-4 p-3.5 rounded-2xl bg-white/95 backdrop-blur-md border border-white/40 shadow-lg flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shrink-0 shadow-sm">
                      <Recycle className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-stone-900 leading-tight">
                        Indian Household Segregation in Action
                      </p>
                      <p className="text-[11px] font-medium text-stone-600">
                        Kitchen peels & recyclable glass sorted before doorstep collection
                      </p>
                    </div>
                  </div>
                  <span className="hidden sm:inline-flex text-[11px] font-bold px-2 py-1 bg-emerald-100 text-emerald-800 rounded-lg shrink-0">
                    +20 Credits
                  </span>
                </div>
              </div>

              {/* Floating Badge 1: Top-Left (AI Stream Recognition) */}
              <div className="absolute -top-4 -left-3 sm:-left-6 p-3 rounded-2xl bg-white/95 backdrop-blur-md border border-stone-200/80 shadow-xl flex items-center gap-2.5 animate-bounce-slow">
                <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 ring-4 ring-emerald-100 animate-pulse"></span>
                <div className="text-left">
                  <p className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700">Bedrock AI Vision</p>
                  <p className="text-xs font-bold text-stone-800">🟢 98% Degradable Match</p>
                </div>
              </div>

              {/* Floating Badge 2: Right-Top (Eco-Credits Deposited) */}
              <div className="absolute top-12 -right-3 sm:-right-6 p-3 rounded-2xl bg-amber-50/95 backdrop-blur-md border border-amber-200/90 shadow-xl flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-700 flex items-center justify-center font-bold text-sm">
                  🪙
                </div>
                <div className="text-left">
                  <p className="text-[10px] font-extrabold uppercase tracking-wider text-amber-700">Instant Wallet Drop</p>
                  <p className="text-xs font-bold text-stone-900">+30 Eco-Credits</p>
                </div>
              </div>

              {/* Floating Badge 3: Bottom-Right (Pickup Verified) */}
              <div className="hidden sm:flex absolute -bottom-3 -right-3 p-3 rounded-2xl bg-teal-50/95 backdrop-blur-md border border-teal-200/90 shadow-xl items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-teal-600" />
                <div className="text-left">
                  <p className="text-[10px] font-extrabold uppercase tracking-wider text-teal-700">Pickup Confirmed</p>
                  <p className="text-xs font-bold text-stone-900">Picker Raju Verified ✅</p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

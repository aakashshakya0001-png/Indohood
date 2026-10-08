import React from 'react';
import { Trees, CloudRain, Zap, Award, Share2, CheckCircle2, ArrowUpRight, Flame } from 'lucide-react';

export default function ImpactDashboard({ impactStats, currentUser }) {
  // Convert co2 from grams to kg
  const co2Kg = (impactStats.co2PreventedGrams / 1000).toFixed(2);
  const landfillKg = (impactStats.landfillDivertedGrams / 1000).toFixed(2);
  const treesEquivalent = (impactStats.co2PreventedGrams / 21000).toFixed(2); // 1 mature tree absorbs ~21kg CO2/year
  const waterLiters = Math.round(impactStats.co2PreventedGrams * 0.45);

  return (
    <section id="impact" className="py-20 bg-stone-900 text-stone-100 border-b border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-400 bg-emerald-950 px-3.5 py-1 rounded-full border border-emerald-800">
            Real-Time Carbon & Environmental Impact
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            How Much Carbon Emission Have You Reduced?
          </h2>
          <p className="text-sm sm:text-base text-stone-400">
            Every segregated plastic pouch, composted kitchen peel, and collected cable translates directly into verified greenhouse gas reduction.
          </p>
        </div>

        {/* 4 Main Impact Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          
          {/* Metric 1: CO2 Avoided */}
          <div className="relative bg-stone-800/80 rounded-3xl p-6 border border-emerald-500/30 shadow-lg overflow-hidden group hover:border-emerald-400 transition-all">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl pointer-events-none"></div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                CO₂ Emissions Avoided
              </span>
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                🌿
              </div>
            </div>
            <p className="text-4xl font-black text-white tracking-tight">
              {co2Kg} <span className="text-lg font-bold text-emerald-400">kg</span>
            </p>
            <p className="text-xs text-stone-400 mt-2">
              Prevented from entering Earth's atmosphere
            </p>
          </div>

          {/* Metric 2: Landfill Diverted */}
          <div className="relative bg-stone-800/80 rounded-3xl p-6 border border-teal-500/30 shadow-lg overflow-hidden group hover:border-teal-400 transition-all">
            <div className="absolute top-0 right-0 w-24 h-24 bg-teal-500/10 rounded-full blur-xl pointer-events-none"></div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-400">
                Landfill Diverted
              </span>
              <div className="w-10 h-10 rounded-2xl bg-teal-500/20 text-teal-400 flex items-center justify-center">
                🚯
              </div>
            </div>
            <p className="text-4xl font-black text-white tracking-tight">
              {landfillKg} <span className="text-lg font-bold text-teal-400">kg</span>
            </p>
            <p className="text-xs text-stone-400 mt-2">
              100% segregated out of municipal dumps
            </p>
          </div>

          {/* Metric 3: Trees Equivalent */}
          <div className="relative bg-stone-800/80 rounded-3xl p-6 border border-amber-500/30 shadow-lg overflow-hidden group hover:border-amber-400 transition-all">
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-xl pointer-events-none"></div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Trees Equivalent
              </span>
              <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <Trees className="w-5 h-5 text-amber-400" />
              </div>
            </div>
            <p className="text-4xl font-black text-white tracking-tight">
              {treesEquivalent} <span className="text-lg font-bold text-amber-400">Tree-Yrs</span>
            </p>
            <p className="text-xs text-stone-400 mt-2">
              Annual carbon absorption equivalent
            </p>
          </div>

          {/* Metric 4: Water Conserved */}
          <div className="relative bg-stone-800/80 rounded-3xl p-6 border border-cyan-500/30 shadow-lg overflow-hidden group hover:border-cyan-400 transition-all">
            <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/10 rounded-full blur-xl pointer-events-none"></div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                Water Conserved
              </span>
              <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                <CloudRain className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
            <p className="text-4xl font-black text-white tracking-tight">
              {waterLiters} <span className="text-lg font-bold text-cyan-400">Liters</span>
            </p>
            <p className="text-xs text-stone-400 mt-2">
              Saved from industrial raw material mining
            </p>
          </div>

        </div>

        {/* Civic Citizen Badge Card */}
        <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-tr from-stone-800 via-stone-850 to-emerald-950 border border-emerald-500/30 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-3xl shadow-inner shrink-0">
              🏅
            </div>
            <div>
              <div className="flex items-center justify-center md:justify-start gap-2">
                <h3 className="text-xl font-bold text-white">
                  {currentUser?.name || 'Aakash Shakya'} — Green Civic Champion
                </h3>
                <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-900 text-emerald-300 border border-emerald-700">
                  Level 2
                </span>
              </div>
              <p className="text-xs text-stone-300 mt-1 max-w-xl">
                Verified source segregation streak active! Your household is in the <strong>Top 5% of eco-conscious homes</strong> in your neighborhood.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => alert(`Copied share link! Aakash has saved ${co2Kg}kg of CO2 with Indohood!`)}
              className="px-5 py-2.5 rounded-xl font-bold text-xs text-stone-200 bg-stone-700 hover:bg-stone-600 border border-stone-600 transition-all cursor-pointer flex items-center gap-2 active:scale-95"
            >
              <Share2 className="w-4 h-4" />
              Share Impact
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}

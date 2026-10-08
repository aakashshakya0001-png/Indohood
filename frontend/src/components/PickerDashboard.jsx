import React, { useState } from 'react';
import { Truck, CheckCircle2, MapPin, Calendar, Clock, Scale, ShieldCheck, Coins, RefreshCw, LogOut } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function PickerDashboard({ user, pickups, onCompletePickup, onLogout }) {
  const [activeFilter, setActiveFilter] = useState('pending');

  const handleVerify = (item) => {
    confetti({
      particleCount: 90,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#0d9488', '#059669', '#f59e0b'],
    });

    onCompletePickup(item.id, item.credits, item.co2Grams);
  };

  const pending = pickups.filter((p) => p.status !== 'COMPLETED');
  const completed = pickups.filter((p) => p.status === 'COMPLETED');
  const displayList = activeFilter === 'pending' ? pending : completed;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-20 sm:pb-8 space-y-6 sm:space-y-8 animate-fade-in">
      
      {/* Picker Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-teal-900 via-stone-900 to-emerald-950 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2.5">
            <img
              src="/logo.png"
              alt="IndoHood Logo"
              className="w-8 h-8 object-contain bg-white/95 rounded-xl p-0.5 shadow-xs shrink-0"
            />
            <span className="text-xs font-extrabold uppercase tracking-wider px-3 py-1 rounded-full bg-teal-500/30 text-teal-300 border border-teal-400/30 flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5" />
              Eco-Collector Portal
            </span>
            <span className="text-xs text-stone-300">
              Zone: {user?.zone || 'Sector 4, New Delhi'}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Eco-Picker: {user?.name || 'Raju'} 🚛
          </h1>
          <p className="text-xs sm:text-sm text-stone-300 max-w-xl">
            Inspect household bags at doorstep, verify stream sorting, and award Eco-Credits to residents.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-center min-w-[120px] flex-1 sm:flex-none">
            <p className="text-[11px] font-bold text-amber-300 uppercase tracking-wider">Pending Stops</p>
            <p className="text-3xl font-black text-white mt-0.5">{pending.length}</p>
          </div>
          <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-center min-w-[120px] flex-1 sm:flex-none">
            <p className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider">Verified Today</p>
            <p className="text-3xl font-black text-white mt-0.5">{completed.length}</p>
          </div>
        </div>
      </div>

      {/* Filter Tabs - Mobile swipe friendly */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-2 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveFilter('pending')}
          className={`px-4 sm:px-5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
            activeFilter === 'pending'
              ? 'bg-teal-700 text-white shadow-sm'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <span className="sm:hidden">Pending ({pending.length})</span>
          <span className="hidden sm:inline">Pending Doorstep Collections ({pending.length})</span>
        </button>
        <button
          onClick={() => setActiveFilter('completed')}
          className={`px-4 sm:px-5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
            activeFilter === 'completed'
              ? 'bg-emerald-700 text-white shadow-sm'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <span className="sm:hidden">Completed ({completed.length})</span>
          <span className="hidden sm:inline">Completed & Weighed ({completed.length})</span>
        </button>
      </div>

      {/* Pickups List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayList.map((item) => (
          <div
            key={item.id}
            className={`p-6 rounded-3xl border flex flex-col justify-between transition-all ${
              item.status === 'COMPLETED'
                ? 'bg-emerald-50/50 border-emerald-200'
                : 'bg-white border-stone-200 shadow-sm hover:shadow-md'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono font-bold text-stone-400">#{item.bookingRef}</span>
                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                  item.stream === 'degradable' ? 'bg-emerald-100 text-emerald-800' :
                  item.stream === 'non-degradable' ? 'bg-blue-100 text-blue-800' : 'bg-rose-100 text-rose-800'
                }`}>
                  {item.streamLabel}
                </span>
              </div>

              <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2 mb-2">
                <span className="text-2xl">{item.itemIcon}</span>
                {item.itemName}
              </h3>

              <div className="space-y-1.5 p-3 rounded-2xl bg-stone-50 border border-stone-200 text-xs text-stone-600 mb-4">
                <p className="flex items-center gap-1.5 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>{item.address}</span>
                </p>
                <p className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{item.pickupDate} • {item.timeSlot}</span>
                </p>
                {item.instructions && (
                  <p className="text-[11px] text-stone-500 italic mt-1">
                    Note: "{item.instructions}"
                  </p>
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-stone-200">
              {item.status === 'COMPLETED' ? (
                <div className="flex items-center justify-between text-xs font-bold text-emerald-800">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Verified & Paid
                  </span>
                  <span className="text-stone-500">+{item.credits} Credits Given</span>
                </div>
              ) : (
                <button
                  onClick={() => handleVerify(item)}
                  className="w-full py-3 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-98"
                >
                  <Scale className="w-4 h-4" />
                  Verify Bag, Weigh & Issue Credits
                </button>
              )}
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}

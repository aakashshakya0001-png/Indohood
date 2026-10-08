import React, { useState } from 'react';
import { Calendar, Clock, MapPin, CheckCircle2, ShieldCheck, Truck, Plus, Sparkles, Coins, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function PickupsSection({ 
  pickups, 
  onScheduleNew, 
  onSimulateCompletePickup, 
  currentUser 
}) {
  const [activeTab, setActiveTab] = useState('all');

  const handleCompletePickup = (pickupId, credits, co2Grams) => {
    // Fire festive celebratory confetti!
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#059669', '#10b981', '#f59e0b', '#3b82f6'],
    });

    onSimulateCompletePickup(pickupId, credits, co2Grams);
  };

  const filteredPickups = pickups.filter((p) => {
    if (activeTab === 'pending') return p.status !== 'COMPLETED';
    if (activeTab === 'completed') return p.status === 'COMPLETED';
    return true;
  });

  return (
    <section id="pickups" className="py-20 bg-white border-b border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-2">
            <span className="text-xs font-extrabold uppercase tracking-widest text-teal-800 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
              Doorstep Collection Logistics
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight">
              Pickup Schedule & Picker Verification
            </h2>
            <p className="text-sm text-stone-600 max-w-xl">
              Scheduled waste pickups for your household. When your eco-picker completes collection, your Eco-Credits and carbon savings unlock automatically!
            </p>
          </div>

          <button
            onClick={onScheduleNew}
            className="px-6 py-3.5 rounded-2xl font-bold text-sm text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-600/20 transition-all cursor-pointer flex items-center gap-2 shrink-0 active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            Schedule New Pickup
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 mb-8 border-b border-stone-200 pb-3">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'all'
                ? 'bg-stone-900 text-white'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            All Bookings ({pickups.length})
          </button>
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'pending'
                ? 'bg-amber-500 text-white'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            Pending / In Route ({pickups.filter((p) => p.status !== 'COMPLETED').length})
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'completed'
                ? 'bg-emerald-600 text-white'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            Completed & Verified ({pickups.filter((p) => p.status === 'COMPLETED').length})
          </button>
        </div>

        {/* Pickups List */}
        {filteredPickups.length === 0 ? (
          <div className="text-center py-16 bg-stone-50 rounded-3xl border border-dashed border-stone-300 space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-stone-200 text-stone-500 flex items-center justify-center mx-auto">
              <Calendar className="w-7 h-7" />
            </div>
            <h4 className="text-base font-bold text-stone-800">No pickups in this category</h4>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              Scan a waste item or click "Schedule New Pickup" to set your first collection date!
            </p>
            <button
              onClick={onScheduleNew}
              className="px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-emerald-600 hover:bg-emerald-700 transition-all cursor-pointer"
            >
              Book Pickup Now
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPickups.map((item) => (
              <div
                key={item.id}
                className={`rounded-3xl p-6 border transition-all duration-300 flex flex-col justify-between ${
                  item.status === 'COMPLETED'
                    ? 'bg-emerald-50/40 border-emerald-200/80 shadow-xs'
                    : 'bg-white border-stone-200 shadow-sm hover:shadow-md hover:border-teal-300'
                }`}
              >
                <div>
                  {/* Status Bar */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono font-bold text-stone-400">
                      #{item.bookingRef}
                    </span>

                    {item.status === 'COMPLETED' ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Collected & Verified ✅
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-amber-100 text-amber-900 border border-amber-300 animate-pulse">
                        <Truck className="w-3.5 h-3.5 text-amber-700" />
                        Pickup Scheduled
                      </span>
                    )}
                  </div>

                  {/* Waste Item Title */}
                  <div className="mb-4">
                    <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                      <span className="text-2xl">{item.itemIcon}</span>
                      {item.itemName}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                        item.stream === 'degradable' ? 'bg-emerald-100 text-emerald-800' :
                        item.stream === 'non-degradable' ? 'bg-blue-100 text-blue-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {item.streamLabel}
                      </span>
                      <span className="text-[11px] font-semibold text-stone-500">
                        Approx: {item.weightEst}
                      </span>
                    </div>
                  </div>

                  {/* Scheduled Details */}
                  <div className="space-y-2 p-3.5 rounded-2xl bg-stone-50/80 border border-stone-200/80 text-xs text-stone-600 mb-5">
                    <div className="flex items-center gap-2 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span><strong>Date:</strong> {item.pickupDate}</span>
                    </div>
                    <div className="flex items-center gap-2 font-medium">
                      <Clock className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                      <span><strong>Slot:</strong> {item.timeSlot}</span>
                    </div>
                    <div className="flex items-center gap-2 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span className="line-clamp-1"><strong>Address:</strong> {item.address}</span>
                    </div>
                  </div>
                </div>

                {/* Footer Action / Status Result */}
                <div className="pt-4 border-t border-stone-200/80">
                  {item.status === 'COMPLETED' ? (
                    <div className="flex items-center justify-between text-xs font-bold text-emerald-800">
                      <span className="flex items-center gap-1">
                        <Coins className="w-4 h-4 text-amber-500" />
                        +{item.credits} Credits Added
                      </span>
                      <span className="text-stone-500 text-[11px]">
                        -{item.co2Grams}g CO₂ Offset
                      </span>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs font-semibold text-stone-500 mb-1">
                        <span>Reward on Collection:</span>
                        <span className="font-extrabold text-amber-600">+{item.credits} Credits</span>
                      </div>

                      {/* Demo Action Button for Judges / Pitching */}
                      <button
                        onClick={() => handleCompletePickup(item.id, item.credits, item.co2Grams)}
                        className="w-full py-2.5 px-3 rounded-xl text-xs font-extrabold text-white bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 shadow-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 active:scale-98"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        Simulate Picker Collection & Weigh
                      </button>
                    </div>
                  )}
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}

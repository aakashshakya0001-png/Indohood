import React, { useState } from 'react';
import { X, Calendar, Clock, MapPin, Truck, CheckCircle2, Coins } from 'lucide-react';

export default function PickupModal({ isOpen, item, currentUser, onClose, onConfirmBooking }) {
  if (!isOpen || !item) return null;

  // Set default date to tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultDateStr = tomorrow.toISOString().split('T')[0];

  const [pickupDate, setPickupDate] = useState(defaultDateStr);
  const [timeSlot, setTimeSlot] = useState('Morning (9:00 AM - 12:00 PM)');
  const [address, setAddress] = useState(
    currentUser?.address || 'Flat 402, Green Valley Apartments, New Delhi'
  );
  const [instructions, setInstructions] = useState('Segregated in marked bag beside door');

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirmBooking({
      id: 'pk_' + Date.now(),
      bookingRef: 'IND-' + Math.floor(1000 + Math.random() * 9000),
      itemId: item.id,
      itemName: item.name,
      itemIcon: item.icon || '📦',
      stream: item.category,
      streamLabel: item.categoryLabel || item.name,
      weightEst: (item.weightGrams ? (item.weightGrams / 1000).toFixed(2) : '0.50') + ' kg',
      credits: item.creditsAwarded || 20,
      co2Grams: item.co2PreventedGrams || 100,
      pickupDate: pickupDate,
      timeSlot: timeSlot,
      address: address,
      instructions: instructions,
      status: 'SCHEDULED',
      createdAt: new Date().toISOString(),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-700 via-emerald-700 to-teal-800 px-6 py-5 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-1">
            <Calendar className="w-5 h-5 text-teal-300" />
            <h3 className="text-xl font-black tracking-tight">
              Schedule Doorstep Waste Pickup
            </h3>
          </div>
          <p className="text-xs text-teal-100">
            Selected Item: <span className="font-bold text-white">{item.name}</span>
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Summary Box */}
          <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{item.icon || '📦'}</span>
              <div>
                <p className="text-xs font-bold text-stone-900">{item.name}</p>
                <p className="text-[11px] text-stone-500">{item.binName || 'Segregated Stream'}</p>
              </div>
            </div>
            <div className="text-right">
              <span className="inline-flex items-center gap-1 text-xs font-black text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                <Coins className="w-3.5 h-3.5 text-amber-500" />
                +{item.creditsAwarded || 20} Credits
              </span>
              <p className="text-[10px] text-stone-400 mt-0.5">On picker verification</p>
            </div>
          </div>

          {/* Pickup Date Picker */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-emerald-600" />
              Pickup Date *
            </label>
            <input
              type="date"
              required
              min={new Date().toISOString().split('T')[0]}
              value={pickupDate}
              onChange={(e) => setPickupDate(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:outline-hidden focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 text-sm font-semibold text-stone-800 transition-all cursor-pointer"
            />
          </div>

          {/* Time Slot Selector */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-teal-600" />
              Preferred Time Slot *
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setTimeSlot('Morning (9:00 AM - 12:00 PM)')}
                className={`p-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer text-left ${
                  timeSlot.includes('Morning')
                    ? 'bg-teal-50 border-teal-500 text-teal-900 ring-1 ring-teal-200'
                    : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                }`}
              >
                🌅 Morning
                <span className="block text-[10px] font-normal text-stone-500">9:00 AM - 12:00 PM</span>
              </button>

              <button
                type="button"
                onClick={() => setTimeSlot('Afternoon (2:00 PM - 5:00 PM)')}
                className={`p-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer text-left ${
                  timeSlot.includes('Afternoon')
                    ? 'bg-teal-50 border-teal-500 text-teal-900 ring-1 ring-teal-200'
                    : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                }`}
              >
                ☀️ Afternoon
                <span className="block text-[10px] font-normal text-stone-500">2:00 PM - 5:00 PM</span>
              </button>
            </div>
          </div>

          {/* Pickup Address */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-amber-600" />
              Pickup Address *
            </label>
            <input
              type="text"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="House/Apartment, Street, Landmark, City"
              className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:outline-hidden focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 text-sm transition-all"
            />
          </div>

          {/* Instructions for Picker */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Note for Eco-Picker Raju (Optional)
            </label>
            <input
              type="text"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="e.g. Ring bell or keep in blue bag outside gate"
              className="w-full px-4 py-2 rounded-xl border border-stone-200 focus:outline-hidden focus:border-emerald-500 text-xs transition-all text-stone-700"
            />
          </div>

          {/* Confirm Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 shadow-md shadow-teal-700/20 transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-98"
            >
              <Truck className="w-4 h-4" />
              Confirm Pickup Booking
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { ShoppingBag, Coins, Gift, CheckCircle2, Sparkles, Tag, ArrowRight, X } from 'lucide-react';
import confetti from 'canvas-confetti';

const STORE_ITEMS = [
  {
    id: 'prod_pen',
    title: 'Plantable Seed Pen Pack (Set of 5)',
    description: 'Made from 100% recycled newspaper. Plant the bottom cap to grow basil & tomato herbs!',
    creditsRequired: 40,
    cashCopay: 0,
    mrp: 150,
    category: 'Free with Credits',
    image: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=400&auto=format&fit=crop&q=80',
    tag: '100% Free',
    tagColor: 'bg-emerald-100 text-emerald-800',
  },
  {
    id: 'prod_diary',
    title: 'Recycled Kraft Paper Spiral Notebook',
    description: 'Unbleached natural paper made from agro-waste pulp. 120 ruled zero-chemical pages.',
    creditsRequired: 80,
    cashCopay: 0,
    mrp: 299,
    category: 'Free with Credits',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&auto=format&fit=crop&q=80',
    tag: '100% Free',
    tagColor: 'bg-emerald-100 text-emerald-800',
  },
  {
    id: 'prod_tote',
    title: 'Pure Organic Cotton Grocery Tote Bag',
    description: 'Heavy duty 12oz canvas replaces up to 500 single-use plastic bags over its lifetime.',
    creditsRequired: 120,
    cashCopay: 0,
    mrp: 350,
    category: 'Free with Credits',
    image: 'https://images.unsplash.com/photo-1597484662317-9bd7bdda2907?w=400&auto=format&fit=crop&q=80',
    tag: '100% Free',
    tagColor: 'bg-emerald-100 text-emerald-800',
  },
  {
    id: 'prod_bottle',
    title: 'Grade 304 Stainless Steel Insulated Bottle',
    description: 'Double-walled vacuum flask keeps water cold for 24 hrs. Lifetime alternative to plastic bottles.',
    creditsRequired: 100,
    cashCopay: 149,
    mrp: 599,
    category: 'Deep Co-Pay Discount',
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&auto=format&fit=crop&q=80',
    tag: 'Save ₹450 with Credits',
    tagColor: 'bg-amber-100 text-amber-900',
  },
  {
    id: 'prod_compost',
    title: 'Home Bokashi Indoor Kitchen Composter',
    description: 'Zero-odor anaerobic compost bin with Bokashi microbial bran. Convert food waste in 14 days.',
    creditsRequired: 150,
    cashCopay: 299,
    mrp: 899,
    category: 'Deep Co-Pay Discount',
    image: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?w=400&auto=format&fit=crop&q=80',
    tag: 'Save ₹600 with Credits',
    tagColor: 'bg-teal-100 text-teal-900',
  },
  {
    id: 'prod_grocery',
    title: 'Farm Fresh Organic Essentials Hamper',
    description: 'Naturally grown stone-ground whole wheat, organic jaggery, and unpolished lentils.',
    creditsRequired: 200,
    cashCopay: 249,
    mrp: 750,
    category: 'Deep Co-Pay Discount',
    image: 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=400&auto=format&fit=crop&q=80',
    tag: 'Save ₹501 with Credits',
    tagColor: 'bg-amber-100 text-amber-900',
  },
];

export default function RewardsStoreSection({ walletBalance, onRedeemItem }) {
  const [selectedVoucher, setSelectedVoucher] = useState(null);

  const handleRedeem = (item) => {
    if (walletBalance < item.creditsRequired) {
      alert(`You need ${item.creditsRequired} Eco-Credits to redeem this item. Complete a waste pickup to earn more!`);
      return;
    }

    // Fire confetti!
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.5 },
      colors: ['#f59e0b', '#10b981', '#065f46', '#3b82f6'],
    });

    onRedeemItem(item.creditsRequired);

    setSelectedVoucher({
      item,
      voucherCode: 'INDO-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
      redeemedAt: new Date().toLocaleDateString(),
    });
  };

  return (
    <section id="store" className="py-20 bg-stone-50 border-b border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div className="space-y-2">
            <span className="text-xs font-extrabold uppercase tracking-widest text-amber-800 bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
              Circular Green Economy
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight">
              Indohood Direct Rewards Store
            </h2>
            <p className="text-sm text-stone-600 max-w-xl">
              Spend your earned Eco-Credits! Claim zero-waste household items for 100% free or unlock deep co-pay discounts.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-white border border-amber-200/80 shadow-xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-xl">
              🪙
            </div>
            <div>
              <p className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">Your Balance</p>
              <p className="text-xl font-black text-stone-900">
                {walletBalance} <span className="text-xs font-bold text-amber-600">Eco-Credits</span>
              </p>
            </div>
          </div>
        </div>

        {/* Store Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {STORE_ITEMS.map((item) => {
            const canAfford = walletBalance >= item.creditsRequired;

            return (
              <div
                key={item.id}
                className="bg-white rounded-3xl overflow-hidden border border-stone-200 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Product Image */}
                  <div className="relative aspect-16/10 overflow-hidden bg-stone-100">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3">
                      <span className={`text-[11px] font-extrabold px-3 py-1 rounded-full shadow-xs ${item.tagColor}`}>
                        {item.tag}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 space-y-3">
                    <h3 className="text-lg font-bold text-stone-900 line-clamp-1">
                      {item.title}
                    </h3>
                    <p className="text-xs text-stone-600 leading-relaxed line-clamp-2">
                      {item.description}
                    </p>

                    {/* Price and Credits Required */}
                    <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-1.5 text-base font-black text-amber-600">
                          <Coins className="w-4 h-4 text-amber-500" />
                          <span>{item.creditsRequired} Credits</span>
                        </div>
                        <p className="text-[11px] text-stone-400">
                          {item.cashCopay === 0 ? '₹0 Cash Required' : `+ ₹${item.cashCopay} Co-Pay (MRP ₹${item.mrp})`}
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="text-xs line-through text-stone-400">₹{item.mrp}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Redeem CTA */}
                <div className="p-6 pt-0">
                  <button
                    onClick={() => handleRedeem(item)}
                    className={`w-full py-3 px-4 rounded-xl font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-98 ${
                      canAfford
                        ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-md shadow-emerald-600/20'
                        : 'bg-stone-100 text-stone-400 hover:bg-stone-200 cursor-not-allowed'
                    }`}
                  >
                    <Gift className="w-4 h-4" />
                    {canAfford ? 'Redeem with Eco-Credits' : `Need ${item.creditsRequired - walletBalance} More Credits`}
                  </button>
                </div>

              </div>
            );
          })}
        </div>

      </div>

      {/* Voucher Confirmation Modal */}
      {selectedVoucher && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden text-center p-8 space-y-5">
            <button
              onClick={() => setSelectedVoucher(null)}
              className="absolute top-5 right-5 p-1.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-3xl mx-auto shadow-inner">
              🎉
            </div>

            <div className="space-y-1">
              <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-600">
                Redemption Successful!
              </span>
              <h3 className="text-2xl font-black text-stone-900">
                {selectedVoucher.item.title}
              </h3>
              <p className="text-xs text-stone-500">
                {selectedVoucher.item.creditsRequired} Eco-Credits deducted from your wallet
              </p>
            </div>

            {/* Voucher Slip */}
            <div className="p-4 rounded-2xl bg-amber-50 border border-dashed border-amber-300 space-y-2">
              <p className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">
                Claim / Delivery Slip Code
              </p>
              <p className="text-2xl font-black font-mono tracking-widest text-amber-900">
                {selectedVoucher.voucherCode}
              </p>
              <p className="text-[10px] text-stone-500">
                Show to your Eco-Picker during next visit or enter at partner counter
              </p>
            </div>

            <button
              onClick={() => setSelectedVoucher(null)}
              className="w-full py-3 px-4 rounded-xl font-bold text-xs text-white bg-stone-900 hover:bg-stone-800 transition-all cursor-pointer"
            >
              Done & Return to Store
            </button>
          </div>
        </div>
      )}

    </section>
  );
}

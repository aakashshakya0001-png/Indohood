import React from 'react';

export default function HowItWorks({ onGetStarted }) {
  const steps = [
    {
      title: 'Scan Item with AI',
      desc: 'Point your phone camera or upload a picture. Amazon Bedrock Multimodal Vision instantly identifies the material and stream in under 1 second.',
      image: '/step-scan-phone.jpg',
    },
    {
      title: 'Select Pickup Date',
      desc: 'Choose your preferred collection day and morning or afternoon time slot. Our smart routing pairs you with your neighborhood eco-collector.',
      image: '/step-select-date.jpg',
    },
    {
      title: 'Picker Collects & Verifies',
      desc: 'Your eco-picker arrives, validates that items are segregated into correct bins/bags, and records weight on their digital scale.',
      image: '/step-picker-collect.jpg',
    },
    {
      title: 'Credits & Carbon Impact',
      desc: 'Eco-Credits immediately drop into your wallet. See live metrics of CO₂ avoided and landfill diverted, ready to spend in the Green Store!',
      image: '/step-eco-credits.jpg',
    },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-stone-50/50 border-y border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <h2 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight">
            Turns into tangible value
          </h2>
          <p className="text-base text-stone-600">
            A seamless 4-step civic flow engineered for Indian households to maximize recycling and eliminate landfill dumping.
          </p>
        </div>

        {/* Steps Grid - Clean cards with real authentic imagery and no numbers */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {steps.map((item, idx) => (
            <div
              key={idx}
              className="relative bg-white rounded-3xl overflow-hidden border border-stone-200 hover:border-emerald-300 transition-all duration-300 hover:shadow-xl group flex flex-col justify-between"
            >
              <div>
                {/* Real Image container */}
                <div className="relative h-48 overflow-hidden bg-stone-100">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>

                {/* Card Content */}
                <div className="p-6">
                  <h3 className="text-lg font-bold text-stone-900 mb-2 group-hover:text-emerald-800 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs leading-relaxed text-stone-600">
                    {item.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Action Strip */}
        <div className="mt-14 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-900 via-stone-900 to-teal-950 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-xl font-bold">
              Ready to test the flow yourself?
            </h4>
            <p className="text-xs text-stone-300 max-w-lg">
              Sign in to scan household items with Bedrock AI, or schedule a doorstep pickup for tomorrow!
            </p>
          </div>
          <div>
            <button
              onClick={onGetStarted}
              className="px-7 py-3 rounded-xl font-bold text-xs text-stone-900 bg-emerald-400 hover:bg-emerald-300 transition-all cursor-pointer shadow-md active:scale-95"
            >
              Join IndoHood Today
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}

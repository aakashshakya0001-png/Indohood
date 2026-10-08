import React from 'react';
import { Camera, Calendar, CheckCircle2, TrendingUp, Sparkles, ArrowRight } from 'lucide-react';

export default function HowItWorks({ onGetStarted, onExploreStore }) {
  const steps = [
    {
      step: '01',
      title: 'Scan Item with AI',
      desc: 'Point your phone camera or upload a picture. Amazon Bedrock Multimodal Vision instantly identifies the material and stream in under 1 second.',
      icon: Camera,
      color: 'from-emerald-500 to-teal-600',
      tag: 'Amazon Bedrock Vision',
      tagColor: 'bg-emerald-100 text-emerald-800',
    },
    {
      step: '02',
      title: 'Select Pickup Date',
      desc: 'Choose your preferred collection day and morning or afternoon time slot. Our smart routing pairs you with your neighborhood eco-collector.',
      icon: Calendar,
      color: 'from-teal-500 to-cyan-600',
      tag: 'Doorstep Convenience',
      tagColor: 'bg-teal-100 text-teal-800',
    },
    {
      step: '03',
      title: 'Picker Collects & Verifies',
      desc: 'Your eco-picker arrives, validates that items are segregated into correct bins/bags, and records weight on their digital scale.',
      icon: CheckCircle2,
      color: 'from-blue-500 to-indigo-600',
      tag: 'Verified Segregation',
      tagColor: 'bg-blue-100 text-blue-800',
    },
    {
      step: '04',
      title: 'Credits & Carbon Impact',
      desc: 'Eco-Credits immediately drop into your wallet. See live metrics of CO₂ avoided and landfill diverted, ready to spend in the Green Store!',
      icon: TrendingUp,
      color: 'from-amber-500 to-orange-600',
      tag: '+15 to +30 Credits & ESG Impact',
      tagColor: 'bg-amber-100 text-amber-800',
    },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-white border-y border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            The Indohood Closed-Loop
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight">
            How Indohood Turns Trash Into Tangible Value
          </h2>
          <p className="text-base text-stone-600">
            A seamless 4-step civic flow engineered for Indian households to maximize recycling and eliminate landfill dumping.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="relative bg-stone-50/80 rounded-3xl p-6 border border-stone-200/80 hover:border-emerald-300 hover:bg-emerald-50/20 transition-all duration-300 hover:shadow-xl group flex flex-col justify-between"
              >
                <div>
                  {/* Step Number & Badge */}
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-3xl font-black text-stone-300 group-hover:text-emerald-500 transition-colors font-mono">
                      {item.step}
                    </span>
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${item.tagColor}`}>
                      {item.tag}
                    </span>
                  </div>

                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${item.color} flex items-center justify-center text-white shadow-md shadow-stone-400/20 mb-5 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6" />
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-bold text-stone-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs leading-relaxed text-stone-600 mb-4">
                    {item.desc}
                  </p>
                </div>

                <div className="pt-2 border-t border-stone-200/60 flex items-center text-xs font-semibold text-emerald-700">
                  <span>Step {idx + 1} of 4</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Strip */}
        <div className="mt-14 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-900 via-stone-900 to-teal-950 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-xl font-bold flex items-center justify-center sm:justify-start gap-2">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              Ready to test the flow yourself?
            </h4>
            <p className="text-xs text-stone-300 max-w-lg">
              Try scanning a household item with Bedrock AI right now, or schedule a pickup for tomorrow!
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onGetStarted}
              className="px-5 py-2.5 rounded-xl font-bold text-xs text-stone-900 bg-emerald-400 hover:bg-emerald-300 transition-all cursor-pointer shadow-md active:scale-95"
            >
              Join Indohood Now
            </button>
            <button
              onClick={onExploreStore}
              className="px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-white/10 hover:bg-white/20 border border-white/20 transition-all cursor-pointer"
            >
              Explore Green Store
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}

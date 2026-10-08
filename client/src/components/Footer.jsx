import React from 'react';
import { Leaf, Heart, ExternalLink, ShieldCheck } from 'lucide-react';

export default function Footer({ onNavigate }) {
  return (
    <footer className="bg-stone-900 text-stone-300 pt-16 pb-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-stone-800">
          
          {/* Column 1 & 2: Brand & Purpose */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-stone-900 font-bold shadow-md">
                <Leaf className="w-5 h-5 stroke-[2.2] text-white" />
              </div>
              <span className="text-2xl font-black tracking-tight text-white">
                Indohood
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800">
                इण्डोहूड
              </span>
            </div>

            <p className="text-stone-400 text-sm leading-relaxed max-w-sm">
              Empowering Indian households to segregate at source, eliminate landfill waste through Amazon Bedrock multimodal AI, and turn civic responsibility into tangible Eco-Credits.
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-stone-800/80 border border-stone-700/80 text-xs font-medium text-stone-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Built for <strong className="text-white">WeMakeDevs & AWS Environmental Hacks</strong>
            </div>
          </div>

          {/* Column 3: Platform Navigation */}
          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-stone-100 mb-4">
              Platform
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button onClick={() => onNavigate('how-it-works')} className="hover:text-emerald-400 transition-colors cursor-pointer">
                  How It Works
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('hero')} className="hover:text-emerald-400 transition-colors cursor-pointer">
                  Back to Top
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: 3-Stream Segregation Guide */}
          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-stone-100 mb-4">
              3 Streams Guide
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span>🟢 Degradable (Green Bin)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                <span>🔵 Non-Degradable (Blue Bin)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                <span>🔴 Landfill-Only (Red Bin)</span>
              </li>
            </ul>
          </div>

          {/* Column 5: AWS Cloud Stack */}
          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-stone-100 mb-4">
              AWS Infrastructure
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li className="flex items-center gap-1.5">
                <span className="text-amber-400">☁️</span> Amazon Bedrock (Claude / Nova)
              </li>
              <li className="flex items-center gap-1.5">
                <span className="text-amber-400">🪣</span> Amazon S3 Proof Storage
              </li>
              <li className="flex items-center gap-1.5">
                <span className="text-amber-400">🚀</span> AWS Amplify / App Runner
              </li>
              <li className="flex items-center gap-1.5">
                <span className="text-amber-400">🔒</span> AWS IAM (hackathon-dev)
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Note */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>
            © {new Date().getFullYear()} <strong>Indohood</strong>. All rights reserved.
          </p>

          <p className="flex items-center gap-1">
            Made with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for Indian Communities & Planet Earth 🌍
          </p>
        </div>
      </div>
    </footer>
  );
}

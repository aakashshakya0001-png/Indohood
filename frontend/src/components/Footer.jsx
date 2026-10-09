import React from 'react';

export default function Footer({ onNavigate }) {
  return (
    <footer className="bg-stone-900 text-stone-300 pt-16 pb-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-stone-800">
          
          {/* Column 1 & 2: Brand & Purpose */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/logo.png"
                alt="IndoHood Logo"
                className="w-10 h-10 object-contain rounded-xl bg-white/10 p-1 shadow-xs shrink-0"
              />
              <span className="text-2xl font-black tracking-tight text-white">
                IndoHood
              </span>
            </div>

            <p className="text-stone-400 text-sm leading-relaxed max-w-sm">
              Empowering Indian households to segregate at source, eliminate landfill waste through Amazon Bedrock multimodal AI, and turn civic responsibility into tangible Eco-Credits.
            </p>

            <div className="inline-flex items-center px-3 py-1.5 rounded-xl bg-stone-800/80 border border-stone-700/80 text-xs font-medium text-stone-300">
              Powered by <strong className="text-white ml-1">WeMakeDevs & Amazon Web Services</strong>
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
            <ul className="space-y-2.5 text-sm text-stone-400">
              <li className="hover:text-stone-200 transition-colors">
                Degradable (+15 Credits)
              </li>
              <li className="hover:text-stone-200 transition-colors">
                Non-Degradable (+25 Credits)
              </li>
              <li className="hover:text-stone-200 transition-colors">
                Mix (+5 Credits)
              </li>
            </ul>
          </div>

          {/* Column 5: AWS Cloud Stack */}
          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-stone-100 mb-4">
              AWS Infrastructure
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>Amazon Bedrock (Claude & Nova)</li>
              <li>Amazon S3 Proof Storage</li>
              <li>AWS Amplify / App Runner</li>
              <li>AWS IAM (dev role)</li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Clean Text */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>
            © {new Date().getFullYear()} <strong>IndoHood</strong>. All rights reserved.
          </p>

          <p>
            Civic Sustainability for Indian Communities & Planet Earth.
          </p>
        </div>
      </div>
    </footer>
  );
}

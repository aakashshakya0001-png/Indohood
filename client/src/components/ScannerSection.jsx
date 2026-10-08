import React, { useState } from 'react';
import { Camera, Upload, Sparkles, CheckCircle2, AlertTriangle, ArrowRight, RefreshCw, Calendar, Coins } from 'lucide-react';

const DEMO_ITEMS = [
  {
    id: 'plastic_bottle',
    name: 'Plastic Water Bottle',
    icon: '🥤',
    category: 'non-degradable',
    categoryLabel: 'Non-Degradable (Recyclable)',
    binColor: 'blue',
    binName: 'Blue Dry Recyclables Bin',
    creditsAwarded: 20,
    co2PreventedGrams: 85,
    weightGrams: 30,
    disposalTip: 'Empty residual water, crush bottle flat to save truck space, and place cap in blue bag.',
    image: 'https://images.unsplash.com/photo-1562243061-204550d8a2c9?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'veggie_peels',
    name: 'Kitchen Vegetable Peels & Food Scraps',
    icon: '🥕',
    category: 'degradable',
    categoryLabel: 'Degradable (Compostable)',
    binColor: 'green',
    binName: 'Green Wet Compost Bin',
    creditsAwarded: 15,
    co2PreventedGrams: 140,
    weightGrams: 250,
    disposalTip: 'Drain excess water. Do not mix with plastic wrappers or staples. Great for municipal biogas & compost!',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'cardboard_box',
    name: 'Delivery Box / Brown Cardboard',
    icon: '📦',
    category: 'degradable',
    categoryLabel: 'Degradable (Paper Pulp Stream)',
    binColor: 'green',
    binName: 'Green / Dry Paper Pulp Stream',
    creditsAwarded: 15,
    co2PreventedGrams: 110,
    weightGrams: 180,
    disposalTip: 'Peel off synthetic plastic packing tape, flatten the box flat, and bundle together.',
    image: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'usb_cable',
    name: 'Discarded USB Cable & Charger',
    icon: '🔌',
    category: 'non-degradable',
    categoryLabel: 'Non-Degradable (E-Waste Stream)',
    binColor: 'blue',
    binName: 'Blue Dedicated E-Waste Bin',
    creditsAwarded: 30,
    co2PreventedGrams: 320,
    weightGrams: 90,
    disposalTip: 'High value copper and plastics! Keep separate from wet waste for certified smelter recovery.',
    image: 'https://images.unsplash.com/photo-1588508065123-287b28e013da?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'used_tissue',
    name: 'Used Tissues & Food Napkins',
    icon: '🧻',
    category: 'landfill',
    categoryLabel: 'Landfill-Only (Sanitary Non-Recyclable)',
    binColor: 'rose',
    binName: 'Red/Black Domestic Refuse Bin',
    creditsAwarded: 5,
    co2PreventedGrams: 20,
    weightGrams: 15,
    disposalTip: 'Used tissues have broken fibers and soiled oils — cannot be recycled. Dispose in closed refuse bin.',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'medicine_strip',
    name: 'Expired Medicine Blister Pack',
    icon: '💊',
    category: 'landfill',
    categoryLabel: 'Landfill-Only (Hazardous Composite)',
    binColor: 'rose',
    binName: 'Red/Black Hazardous Bin',
    creditsAwarded: 5,
    co2PreventedGrams: 45,
    weightGrams: 20,
    disposalTip: 'Multi-layer plastic & aluminum foil contaminated with pharma compounds. Keep dry for high-heat incineration.',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&auto=format&fit=crop&q=80',
  },
];

export default function ScannerSection({ onSchedulePickupForItem }) {
  const [selectedDemo, setSelectedDemo] = useState(DEMO_ITEMS[0]);
  const [customImage, setCustomImage] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(DEMO_ITEMS[0]);

  const handleSelectDemo = (item) => {
    setSelectedDemo(item);
    setCustomImage(null);
    triggerScan(item);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCustomImage(url);
      // Run AI Scan simulation
      triggerScan({
        id: 'custom_scanned',
        name: file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ') || 'Scanned Household Item',
        icon: '📸',
        category: 'non-degradable',
        categoryLabel: 'Non-Degradable (Recyclable)',
        binColor: 'blue',
        binName: 'Blue Dry Recyclables Bin',
        creditsAwarded: 20,
        co2PreventedGrams: 90,
        weightGrams: 50,
        disposalTip: 'Rinse if necessary and store dry for verified eco-pickup.',
        image: url,
      });
    }
  };

  const triggerScan = (item) => {
    setIsScanning(true);
    setTimeout(() => {
      setScanResult(item);
      setIsScanning(false);
    }, 700);
  };

  const getStreamBadge = (category) => {
    if (category === 'degradable') {
      return {
        bg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
        dot: 'bg-emerald-500',
        name: '🟢 Degradable (Green Bin)',
      };
    }
    if (category === 'non-degradable') {
      return {
        bg: 'bg-blue-100 text-blue-800 border-blue-300',
        dot: 'bg-blue-500',
        name: '🔵 Non-Degradable (Blue Bin)',
      };
    }
    return {
      bg: 'bg-rose-100 text-rose-800 border-rose-300',
      dot: 'bg-rose-500',
      name: '🔴 Landfill-Only (Red Bin)',
    };
  };

  const badge = getStreamBadge(scanResult.category);

  return (
    <section id="scanner" className="py-20 bg-stone-100/70 border-b border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-800 bg-emerald-100 px-3.5 py-1 rounded-full border border-emerald-300">
            Powered by Amazon Bedrock Multimodal AI
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight">
            Household Waste Scanner & Stream Classifier
          </h2>
          <p className="text-sm sm:text-base text-stone-600">
            Point camera or choose a preset test item to see instant stream classification, carbon diversion stats, and credit allocation.
          </p>
        </div>

        {/* 1-Click Demo Items Row for Pitching */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Quick-Test Preset Items (Zero-Fail Pitch Demos)
            </span>
            <span className="text-xs text-stone-400">Click any card to analyze</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {DEMO_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => handleSelectDemo(item)}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  selectedDemo.id === item.id && !customImage
                    ? 'bg-white border-emerald-500 shadow-md ring-2 ring-emerald-200'
                    : 'bg-white/80 hover:bg-white border-stone-200/90 shadow-2xs hover:border-emerald-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">{item.icon}</span>
                  <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-full ${
                    item.category === 'degradable' ? 'bg-emerald-100 text-emerald-800' :
                    item.category === 'non-degradable' ? 'bg-blue-100 text-blue-800' : 'bg-rose-100 text-rose-800'
                  }`}>
                    {item.category === 'degradable' ? 'Green' : item.category === 'non-degradable' ? 'Blue' : 'Red'}
                  </span>
                </div>
                <div>
                  <p className="text-xs font-bold text-stone-900 line-clamp-1 leading-snug">
                    {item.name}
                  </p>
                  <p className="text-[11px] font-semibold text-amber-600 mt-1">
                    +{item.creditsAwarded} Credits
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Main Scanner Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Camera / Image Box */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                <Camera className="w-4 h-4 text-emerald-600" />
                Live Camera / Image Feed
              </h3>
              <label className="text-xs font-bold text-emerald-700 hover:text-emerald-800 cursor-pointer flex items-center gap-1">
                <Upload className="w-3.5 h-3.5" />
                Upload Photo
                <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
              </label>
            </div>

            {/* Viewfinder Preview */}
            <div className="relative rounded-2xl overflow-hidden aspect-4/3 bg-stone-900 flex items-center justify-center border border-stone-200">
              <img
                src={customImage || selectedDemo.image}
                alt="Scanned item preview"
                className="w-full h-full object-cover"
              />

              {/* Scanning Laser Line when active */}
              {isScanning && (
                <div className="absolute inset-0 bg-emerald-500/20 backdrop-blur-2xs flex items-center justify-center">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-400 animate-pulse shadow-lg shadow-emerald-500"></div>
                  <div className="px-4 py-2 rounded-xl bg-stone-900/90 text-white text-xs font-bold flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" />
                    Bedrock Multimodal Analyzing...
                  </div>
                </div>
              )}

              {/* Viewfinder Corner Overlays */}
              <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-emerald-400"></div>
              <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-emerald-400"></div>
              <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-emerald-400"></div>
              <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-emerald-400"></div>
            </div>

            <p className="text-xs text-stone-500 text-center">
              Target household items: Plastic bottles, cardboard, kitchen scraps, e-waste, or sanitaries.
            </p>
          </div>

          {/* Right: AI Result Analysis Card */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
            
            {/* Top Bar with Stream Badge */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-stone-200">
              <div>
                <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-extrabold border ${badge.bg}`}>
                  <span className={`w-2 h-2 rounded-full ${badge.dot}`}></span>
                  {badge.name}
                </span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold">
                <Coins className="w-4 h-4 text-amber-500" />
                +{scanResult.creditsAwarded} Eco-Credits on Pickup
              </div>
            </div>

            {/* Identified Item Title */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-1">
                AI Identified Item
              </p>
              <h3 className="text-2xl font-black text-stone-900 flex items-center gap-2">
                <span>{scanResult.icon}</span>
                {scanResult.name}
              </h3>
            </div>

            {/* Step-by-Step Segregation Instructions */}
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Segregation & Disposal Guideline
              </h4>
              <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                {scanResult.disposalTip}
              </p>
            </div>

            {/* Environmental Impact Breakdown */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200">
                <p className="text-[11px] font-bold text-emerald-800">CO₂ Avoided</p>
                <p className="text-xl font-black text-emerald-700 mt-0.5">
                  -{scanResult.co2PreventedGrams} g
                </p>
                <p className="text-[10px] text-emerald-600">Greenhouse gas offset</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-blue-50/60 border border-blue-200">
                <p className="text-[11px] font-bold text-blue-800">Weight Diverted</p>
                <p className="text-xl font-black text-blue-700 mt-0.5">
                  ~{scanResult.weightGrams} g
                </p>
                <p className="text-[10px] text-blue-600">From dumping ground</p>
              </div>

              <div className="col-span-2 sm:col-span-1 p-3.5 rounded-2xl bg-teal-50/60 border border-teal-200">
                <p className="text-[11px] font-bold text-teal-800">Target Bin</p>
                <p className="text-xs font-black text-teal-900 mt-1 line-clamp-1">
                  {scanResult.binName}
                </p>
                <p className="text-[10px] text-teal-600">Municipal compliance</p>
              </div>
            </div>

            {/* Direct CTA: Schedule Pickup */}
            <div className="pt-2">
              <button
                onClick={() => onSchedulePickupForItem(scanResult)}
                className="w-full py-4 px-6 rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-800 shadow-lg shadow-emerald-600/25 hover:shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2 group active:scale-98"
              >
                <Calendar className="w-5 h-5 text-emerald-200" />
                Schedule Doorstep Pickup for this Item
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

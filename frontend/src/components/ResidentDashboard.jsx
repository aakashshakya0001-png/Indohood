import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, Camera, Calendar, Clock, MapPin, Truck, CheckCircle2, 
  Coins, ArrowRight, Upload, RefreshCw, Trees, CloudRain, ShieldCheck, 
  Plus, X, AlertTriangle, ArrowUpRight, Leaf, History,
  Award, Download, Printer, BookOpen, Lightbulb, Share2, Recycle,
  Check, ChevronRight, Droplets, Flame, Tag, DollarSign, Filter,
  ExternalLink, Layers, Sparkle, Info, Compass, PlusSquare, User, Bell, Edit3,
  Grid3X3, Bookmark, Medal, Zap, Trophy, Activity, Heart, MessageSquare, Send, ThumbsUp,
  Image as ImageIcon
} from 'lucide-react';
import confetti from 'canvas-confetti';

const DEMO_ITEMS = [
  {
    id: 'plastic_bottle',
    name: 'Plastic PET Bottles & Jars',
    icon: '🥤',
    category: 'non-degradable',
    categoryLabel: 'Non-Degradable (Recyclable)',
    scrapRate: '₹18 / kg (35 Credits)',
    binColor: 'blue',
    binName: 'Blue Dry Recyclables Bin',
    creditsAwarded: 25,
    co2PreventedGrams: 85,
    weightGrams: 40,
    disposalTip: 'Empty residual liquid, crush bottle flat to save collection space, and keep caps together.',
    image: 'https://images.unsplash.com/photo-1562243061-204550d8a2c9?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'cardboard_box',
    name: 'Amazon Delivery Cardboard Box',
    icon: '📦',
    category: 'non-degradable',
    categoryLabel: 'Non-Degradable (Paper Pulp)',
    scrapRate: '₹14 / kg (28 Credits)',
    binColor: 'blue',
    binName: 'Blue / Dry Paper Pulp Stream',
    creditsAwarded: 20,
    co2PreventedGrams: 110,
    weightGrams: 180,
    disposalTip: 'Peel off synthetic plastic tape, flatten the box flat, and bundle with jute cord.',
    image: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'usb_cable',
    name: 'Discarded Charger & Copper Wires',
    icon: '🔌',
    category: 'non-degradable',
    categoryLabel: 'Non-Degradable (E-Waste / Metal)',
    scrapRate: '₹45 / kg (90 Credits)',
    binColor: 'blue',
    binName: 'Blue Dedicated E-Waste Stream',
    creditsAwarded: 35,
    co2PreventedGrams: 320,
    weightGrams: 90,
    disposalTip: 'High-purity copper conductors inside! Keep dry and separate for certified smelting recovery.',
    image: 'https://images.unsplash.com/photo-1588508065123-287b28e013da?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'aluminum_can',
    name: 'Aluminum Beverage Cans',
    icon: '🥫',
    category: 'non-degradable',
    categoryLabel: 'Non-Degradable (High Scrap Value)',
    scrapRate: '₹95 / kg (190 Credits)',
    binColor: 'blue',
    binName: 'Blue Dry Recyclables Bin',
    creditsAwarded: 30,
    co2PreventedGrams: 280,
    weightGrams: 50,
    disposalTip: 'Rinse to remove sticky soda residue and crush flat. 100% infinitely recyclable metal.',
    image: 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'newspaper_stack',
    name: 'Old Newspaper & Magazine Raddi',
    icon: '📰',
    category: 'non-degradable',
    categoryLabel: 'Non-Degradable (Clean Paper Stream)',
    scrapRate: '₹16 / kg (32 Credits)',
    binColor: 'blue',
    binName: 'Blue Dry Recyclables Bin',
    creditsAwarded: 25,
    co2PreventedGrams: 160,
    weightGrams: 500,
    disposalTip: 'Stack newspapers dry and tie firmly with string. Re-pulped into carton packaging.',
    image: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'glass_bottle',
    name: 'Clean Sauce & Beverage Glass Bottle',
    icon: '🍾',
    category: 'non-degradable',
    categoryLabel: 'Non-Degradable (Glass Container)',
    scrapRate: '₹5 / kg (10 Credits)',
    binColor: 'blue',
    binName: 'Blue Dry Recyclables Bin',
    creditsAwarded: 15,
    co2PreventedGrams: 95,
    weightGrams: 350,
    disposalTip: 'Rinse clean with water and remove metal lids. Glass is melted into new bottles without degradation.',
    image: 'https://images.unsplash.com/photo-1562243061-204550d8a2c9?w=400&auto=format&fit=crop&q=80',
  },
];

const DIY_HOME_IDEAS = [
  {
    id: 'balcony-compost',
    title: 'Terracotta Balcony Pot Composting (Khamba Method)',
    category: 'balcony',
    time: '30–45 Days',
    difficulty: 'Beginner',
    wasteUsed: 'Kitchen veggie peels, tea grounds, dry leaves & cocopeat',
    benefit: 'Stops methane in landfills & creates 100% organic manure for potted plants',
    image: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb22524?w=600&auto=format&fit=crop&q=80',
    materials: [
      '1 Earthen terracotta pot or bucket with lid',
      'Dry cocopeat brick or dried brown leaves',
      'Daily chopped vegetable and fruit skins',
      '2 tbsp sour buttermilk (chaas) as microbial accelerator'
    ],
    steps: [
      'Place 2 inches of dried leaves or cocopeat at the pot base for bottom drainage and aeration.',
      'Add daily kitchen scraps chopped into 1-inch pieces (avoid cooked oily foods and bones).',
      'Cover with a light handful of cocopeat each day to prevent fruit flies, odor, and moisture buildup.',
      'Sprinkle a splash of sour buttermilk weekly to introduce active composting bacteria.',
      'In 4-6 weeks, the heap turns into dark, crumbly, earthy compost ready for your balcony plants!'
    ]
  },
  {
    id: 'bio-enzyme',
    title: 'Citrus Peel Bio-Enzyme Multi-Purpose Cleaner',
    category: 'kitchen',
    time: '90 Days fermentation',
    difficulty: 'Easy',
    wasteUsed: 'Lemon, orange, and sweet lime (mosambi) peels + jaggery',
    benefit: 'Replaces chemical floor cleaners, unclogs sinks, and reduces chemical runoff',
    image: 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=600&auto=format&fit=crop&q=80',
    materials: [
      '1 Part Jaggery (Gur) – 100 grams',
      '3 Parts Citrus Peels (Lemon/Orange) – 300 grams',
      '10 Parts Water – 1 Liter',
      '1 Airtight plastic bottle (do not use glass due to gas release)'
    ],
    steps: [
      'Dissolve 100g jaggery in 1 liter clean water inside the plastic bottle.',
      'Add 300g freshly discarded citrus peels, leaving 15% empty headspace for fermentation gases.',
      'Cap tightly. During the first 30 days, unscrew the cap daily for 2 seconds to vent CO₂ pressure.',
      'Keep in a dark, shaded shelf for 90 days. The liquid gradually clarifies into a pleasant amber hue.',
      'Filter liquid through a cloth. Dilute 1:10 with water for sparkling tiles, greasy counters, and mirrors!'
    ]
  },
  {
    id: 'pet-planter',
    title: 'Self-Watering Sub-Irrigated Herb Planter',
    category: 'balcony',
    time: '15 Minutes',
    difficulty: 'Very Easy',
    wasteUsed: 'Discarded 1L or 2L plastic cold drink / water bottles',
    benefit: 'Keeps mint (pudina) and coriander hydrated automatically for 7+ days',
    image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=600&auto=format&fit=crop&q=80',
    materials: [
      '1 Empty 2-Litre PET bottle',
      'Thick cotton wick cord or clean shoelace (15 cm)',
      'Garden potting soil mix',
      'Fresh mint (pudina) stems or herb seeds'
    ],
    steps: [
      'Cut the plastic bottle horizontally into two halves with scissors.',
      'Poke a 5mm hole in the bottle screw cap and thread the cotton wick through it.',
      'Invert the funnel-shaped top half into the bottom reservoir base.',
      'Fill the bottom base with water, and the top funnel with rich potting soil.',
      'Plant mint cuttings or seeds. The cotton wick acts as a natural siphon, keeping soil perfectly moist!'
    ]
  },
  {
    id: 'seed-tray',
    title: 'Biodegradable Egg-Carton Seedling Starters',
    category: 'balcony',
    time: '10 Minutes',
    difficulty: 'Beginner',
    wasteUsed: 'Cardboard egg delivery trays or toilet roll cores',
    benefit: 'Zero plastic nursery pots; paper pulp naturally dissolves straight into garden soil',
    image: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=600&auto=format&fit=crop&q=80',
    materials: [
      '1 Pulp cardboard egg carton or paper roll core',
      'Seed starter cocopeat & compost mix',
      'Vegetable seeds (cherry tomato, green chili, basil, coriander)'
    ],
    steps: [
      'Poke a tiny pinhole at the bottom of each egg cup for drainage.',
      'Fill each cup 3/4 full with seed starter cocopeat mix.',
      'Plant 1-2 seeds per cup and gently mist with a water spray bottle daily.',
      'Keep in morning sun. Once seedlings develop their second set of true leaves, cut cups apart.',
      'Transplant the entire cardboard cup directly into garden pots—it decomposes naturally without transplant shock!'
    ]
  },
  {
    id: 'coconut-planter',
    title: 'Upcycled Coconut Shell Succulent & Bird Feeder',
    category: 'household',
    time: '20 Minutes',
    difficulty: 'Easy',
    wasteUsed: 'Discarded dry coconut (nariyal) halves',
    benefit: '100% natural, weather-proof balcony decor that feeds urban birds',
    image: 'https://images.unsplash.com/photo-1545241047-6083a3684587?w=600&auto=format&fit=crop&q=80',
    materials: [
      '1 Cleaned half coconut shell',
      'Sandpaper or scouring pad',
      'Natural jute twine rope',
      'Bird grain seeds (millet/bajra) or succulent plant'
    ],
    steps: [
      'Scrape internal residual coconut meat and lightly sand outer shell smooth.',
      'Drill or poke 3 small holes around the upper rim 1 cm from the edge.',
      'Thread 3 equal lengths of jute twine and tie together at the top knot.',
      'Fill with bajra and sunflower seeds for neighborhood sparrows, or add soil for a hardy hanging succulent.',
      'Hang from your balcony grill or tree branch for beautiful eco-friendly decor!'
    ]
  },
  {
    id: 'newspaper-bin-liner',
    title: 'Origami Newspaper Dustbin Liners',
    category: 'household',
    time: '5 Minutes',
    difficulty: 'Very Easy',
    wasteUsed: 'Old morning newspaper sheets (Raddi)',
    benefit: 'Completely eliminates single-use black plastic garbage bags',
    image: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=600&auto=format&fit=crop&q=80',
    materials: [
      '2-3 Full broadsheet newspaper spreads'
    ],
    steps: [
      'Lay 2 double sheets together for dual-layer durability.',
      'Fold diagonally into a large triangle, pointing downward.',
      'Fold the left corner across horizontally to meet the right edge.',
      'Fold the right corner across horizontally to meet the left edge.',
      'Fold down the top triangular flaps on either side to tuck and lock the origami pocket.',
      'Open the center cavity and insert directly into your dustbin—sturdy, leak-absorbent, and 100% compostable!'
    ]
  }
];

const SEGREGATION_STREAMS = [
  {
    color: 'emerald',
    badge: '🟢 Wet / Degradable Stream',
    title: 'Green Bin: Organic & Wet Kitchen Waste',
    desc: 'Decomposes naturally within 30-60 days. Must never be sent to landfills where it ferments anaerobically into greenhouse methane gas.',
    accepted: [
      'Fruit & vegetable peels, cuttings, and cores',
      'Cooked food leftovers, rice, and roti crumbs',
      'Used tea leaves, coffee grounds & egg shells',
      'Garden leaves, cut flowers & balcony clippings'
    ],
    forbidden: [
      'NO plastic carry bags or wrappers',
      'NO milk packets or metallized chips bags',
      'NO sanitary pads or diapers'
    ],
    actionTip: 'Drain extra curry/gravy water before dumping. Use for home balcony composting or handover daily.'
  },
  {
    color: 'blue',
    badge: '🔵 Dry / Recyclable Stream',
    title: 'Blue Bin: Dry Recyclables & High-Value Scrap',
    desc: 'Non-degradable commodities that feed the circular economy. You earn direct Eco-Credits when Raju the Eco-Picker collects this stream!',
    accepted: [
      'Clean PET water and beverage bottles',
      'Delivery cardboard boxes and corrugated cartons',
      'Newspapers, magazines, flyers & textbooks',
      'Aluminum soda cans, tin food cans & scrap metal',
      'Old chargers, USB cables, batteries & small e-waste'
    ],
    forbidden: [
      'NO wet food-stained paper or pizza oil boxes',
      'NO broken ceramics or mirror shards',
      'NO used medical blister strips'
    ],
    actionTip: 'Rinse milk & drink containers dry. Flatten cardboard boxes to save space before doorstep collection.'
  },
  {
    color: 'rose',
    badge: '🔴 Hazardous & Refuse Stream',
    title: 'Red/Black Bin: Sanitary & Hazardous Refuse',
    desc: 'Items that carry infectious pathogens or toxic heavy metal laminates. Scientifically routed to authorized municipal incinerators.',
    accepted: [
      'Sanitary napkins, baby diapers & incontinence pads',
      'Expired pharmaceutical blister tablets & syrups',
      'Broken glass thermometers & fluorescent bulbs',
      'Chemical floor cleaner containers & pesticide bottles'
    ],
    forbidden: [
      'NEVER mix with green kitchen peels',
      'NEVER mix with dry recyclable paper/plastic'
    ],
    actionTip: 'Wrap sanitary items securely in marked newspaper with a red cross. Protects sanitation workers from bio-hazards.'
  }
];

const DEFAULT_NOTIFICATIONS = [
  {
    id: 'notif_1',
    title: 'Eco-Picker Assigned for Doorstep Collection',
    desc: 'Raju the Eco-Collector is assigned for tomorrow morning (9:00 AM - 12:00 PM). Please keep your dry recyclables bundled beside your door.',
    time: '10 mins ago',
    type: 'pickup',
    icon: '🚛',
    unread: true,
  },
  {
    id: 'notif_2',
    title: '+25 Eco-Credits Deposited!',
    desc: 'Verification completed for PET Plastic Bottles. 85g CO₂ emissions prevented from Ghazipur landfill. Balance updated.',
    time: '2 hours ago',
    type: 'credits',
    icon: '🪙',
    unread: true,
  },
  {
    id: 'notif_3',
    title: 'Bedrock Multimodal AI Vision Milestone',
    desc: 'Amazon Bedrock successfully identified copper cable e-waste with 99.4% confidence and recommended certified recovery.',
    time: 'Yesterday',
    type: 'ai',
    icon: '✨',
    unread: false,
  },
  {
    id: 'notif_4',
    title: 'Tier 3 Master Recycler Certificate Ready',
    desc: 'Your Green Citizen Commendation certificate has been updated with your latest carbon abatement total of 4.2 kg CO₂.',
    time: '2 days ago',
    type: 'cert',
    icon: '🎖️',
    unread: false,
  },
  {
    id: 'notif_5',
    title: 'Society Clean Air Champion',
    desc: 'Green Valley Apartments residents collectively diverted over 120 kg of dry scrap from municipal landfills this week!',
    time: '3 days ago',
    type: 'community',
    icon: '🌱',
    unread: false,
  },
];

const COMMUNITY_ACTIVITIES = [
  {
    id: 'act_1',
    userName: 'Aarav Sharma',
    userLocation: 'Flat 302, Tower B',
    society: 'Green Valley Apartments',
    userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
    actionTitle: 'Recycled 14 kg of Flattened Amazon & Flipkart Cartons',
    category: 'Dry Scrap',
    badgeColor: 'blue',
    impactStat: '8.4 kg CO₂ Prevented',
    creditsEarned: 70,
    timeAgo: '15m ago',
    image: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=600&auto=format&fit=crop&q=80',
    verified: true,
    cheers: 24,
    notes: 'Removed all synthetic packing tape, bundled firmly with jute cord, and handed over at the doorstep.'
  },
  {
    id: 'act_2',
    userName: 'Priya Nair',
    userLocation: 'Villa 14, Lotus Enclave',
    society: 'Lotus Enclave, Sector 45',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
    actionTitle: 'Harvested 12 kg of Balcony Organic Compost',
    category: 'Composting',
    badgeColor: 'emerald',
    impactStat: '15.2 kg Methane Neutralized',
    creditsEarned: 60,
    timeAgo: '45m ago',
    image: 'https://images.unsplash.com/photo-1584473457406-6240486418e9?w=600&auto=format&fit=crop&q=80',
    verified: true,
    cheers: 38,
    notes: 'Zero odor using 2:1 dry leaves to kitchen peels ratio! Now feeding our tomato and basil planters.'
  },
  {
    id: 'act_3',
    userName: 'Vikram Malhotra',
    userLocation: 'Flat 804, Orchid Heights',
    society: 'Orchid Heights',
    userAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=120&auto=format&fit=crop&q=80',
    actionTitle: 'Diverted 5 Broken Phone Chargers & Copper Cable Scrap',
    category: 'E-Waste',
    badgeColor: 'amber',
    impactStat: '450g High-Purity Copper Recovered',
    creditsEarned: 95,
    timeAgo: '2h ago',
    image: 'https://images.unsplash.com/photo-1588508065123-287b28e013da?w=600&auto=format&fit=crop&q=80',
    verified: true,
    cheers: 19,
    notes: 'Cleared our family gadget drawer. Kept heavy metals out of municipal soil leachate.'
  },
  {
    id: 'act_4',
    userName: 'Green Valley Eco-Club',
    userLocation: 'Central Clubhouse Lawn',
    society: 'Green Valley Society',
    userAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&auto=format&fit=crop&q=80',
    actionTitle: 'Society Zero-Plastic Sunday: 165 kg PET Bottles Crushed',
    category: 'Community Drives',
    badgeColor: 'teal',
    impactStat: '210 kg CO₂ Equivalent Diverted',
    creditsEarned: 350,
    timeAgo: '5h ago',
    image: 'https://images.unsplash.com/photo-1562243061-204550d8a2c9?w=600&auto=format&fit=crop&q=80',
    verified: true,
    cheers: 62,
    notes: '38 resident families joined together to collect, empty, and flatten beverage bottles for bulk circular recycling.'
  },
  {
    id: 'act_5',
    userName: 'Rohan Mehta',
    userLocation: 'Flat 102, Block A',
    society: 'Surya Residency',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    actionTitle: 'Upcycled 6 Glass Pickle & Sauce Jars into Self-Watering Pots',
    category: 'Upcycling DIY',
    badgeColor: 'purple',
    impactStat: '6 Glass Containers Reused',
    creditsEarned: 40,
    timeAgo: 'Yesterday',
    image: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=600&auto=format&fit=crop&q=80',
    verified: true,
    cheers: 45,
    notes: 'Cleaned off labels with warm water and converted them into zero-cost indoor kitchen herb planters.'
  }
];

const WASTE_AWARENESS_ARTICLES = [
  {
    id: 'art_1',
    title: 'Why Mixed Waste Triggers Summer Landfill Fires',
    topic: 'Landfill Crisis',
    readTime: '1 min read',
    summary: 'When wet kitchen waste mixes with dry plastic in Ghazipur and Deonar landfills, trapped anaerobic bacteria generate flammable methane gas pockets that combust in summer heat.',
    takeaways: [
      'Decomposing organic food scraps heat up surrounding dry plastics to over 70°C.',
      'Segregating wet waste into green bins deprives landfill fires of fuel and stops toxic smog.',
      'Composting at home or society level cuts municipal transportation diesel emissions by 60%.'
    ],
    goldenRule: 'Never toss organic kitchen scraps in plastic bags into the dry bin.'
  },
  {
    id: 'art_2',
    title: 'The 7 Plastic Codes: Which Ones Actually Have Scrap Value?',
    topic: 'Plastic Recycling',
    readTime: '2 min read',
    summary: 'Not all plastic is equal. Scrap dealers pay high cash rates for Type 1 (PET) and Type 2 (HDPE), while multilayer packaging requires special industrial recovery.',
    takeaways: [
      'Type 1 (PET): Transparent water & soda bottles. Recycled into polyester apparel fiber.',
      'Type 2 (HDPE): Sturdy milk bottles, shampoo jugs. Recycled into municipal pipes and bins.',
      'Type 7 (Multilayer Packaging): Metallic chips packets. Processed into industrial refuse-derived fuel.'
    ],
    goldenRule: 'Rinse liquid containers cleanly; sour milk or oily residue spoils entire bales of dry scrap.'
  },
  {
    id: 'art_3',
    title: 'The Hidden Gold in Broken Cables: Why E-Waste Must Be Separated',
    topic: 'E-Waste Awareness',
    readTime: '1 min read',
    summary: 'Old mobile chargers, laptop adapters, and copper wires contain 99.8% virgin copper and precious trace metals, but release lead and cadmium when exposed to monsoon rain.',
    takeaways: [
      'Recycling scrap copper consumes 85% less energy than open-pit ore mining.',
      'When thrown into household trash, heavy metals leach into groundwater tables.',
      'Certified e-waste collection guarantees authorized smelter recovery without toxic burning.'
    ],
    goldenRule: 'Keep a small designated shoe-box at home for old electronics and dead cables.'
  },
  {
    id: 'art_4',
    title: 'The 2:1 Golden Rule of Odor-Free Balcony Composting',
    topic: 'Home Composting',
    readTime: '1 min read',
    summary: 'You do not need a garden to turn kitchen waste into nutrient-dense fertilizer. Maintaining the balance of browns (carbon) and greens (nitrogen) ensures zero foul smells.',
    takeaways: [
      'Greens (Nitrogen): Fruit peels, tea leaves, vegetable ends, coffee grounds.',
      'Browns (Carbon): Shredded egg cartons, dry leaves, brown carton scraps, coconut coir.',
      'Add 2 handfuls of dry browns for every 1 handful of wet kitchen greens to keep moisture balanced.'
    ],
    goldenRule: 'Never add cooked gravies, dairy, or meat bones to residential balcony composters.'
  },
  {
    id: 'art_5',
    title: 'Battery Safety Protocol: Preventing Garbage Compactor Fires',
    topic: 'Hazardous Waste',
    readTime: '1 min read',
    summary: 'Lithium-ion cells and button batteries catch fire under hydraulic compaction in municipal collection trucks, sparking dangerous electrical fires.',
    takeaways: [
      'Household batteries belong exclusively in Red Bins (Domestic Hazardous Stream).',
      'Placing clear adhesive tape over battery contact terminals prevents accidental short-circuits.',
      'Valuable cobalt, nickel, and lithium are extracted and reused in new battery production.'
    ],
    goldenRule: 'Tape terminals of dead button cells and collect them in a dedicated glass jar.'
  },
  {
    id: 'art_6',
    title: 'Circular Fabric Life: Giving Torn Cotton Clothes a Second Life',
    topic: 'Circular Economy',
    readTime: '1 min read',
    summary: 'Textile waste makes up 8% of city dump volume. Pure cotton scraps can be pulped into handmade tree-free paper or upcycled into industrial wiping rags.',
    takeaways: [
      'Recycling 1 kg of cotton fabric saves 20,000 liters of agricultural irrigation water.',
      'Blended synthetic fibers (polyester) are re-spun into thermal insulation for vehicles.',
      'Clean dry cloth rags retain fiber length, making them easy for mechanized shredding.'
    ],
    goldenRule: 'Ensure torn clothes are clean and completely dry before handing over to recyclers.'
  }
];

export default function ResidentDashboard({ 
  user, 
  walletBalance, 
  pickups, 
  impactStats, 
  onSchedulePickup,
  onSimulatePickerComplete,
  onLogout,
  onUpdateUser
}) {
  const [activeTab, setActiveTab] = useState('explore'); // 'explore' -> 'upload' -> 'notification' -> 'profile'

  // Profile Customization State (Edit Profile: Bio, Avatar, Name)
  const [profileName, setProfileName] = useState(user?.name || 'Resident Citizen');
  const [profileImage, setProfileImage] = useState(user?.avatar || null);
  const [profileBio, setProfileBio] = useState(user?.bio || 'Eco-conscious citizen driving zero-waste living and source segregation 🌱');
  const [profileSubTab, setProfileSubTab] = useState('activity'); // 'activity' | 'certificate'

  // Explore Tab State (Sub-tabs: Activity & Articles)
  const [exploreSubTab, setExploreSubTab] = useState('activity'); // 'activity' | 'articles'
  const [activityCategoryFilter, setActivityCategoryFilter] = useState('All');
  const [articleTopicFilter, setArticleTopicFilter] = useState('All');
  const [communityActivitiesList, setCommunityActivitiesList] = useState(COMMUNITY_ACTIVITIES);
  const [cheeredMap, setCheeredMap] = useState({});
  const [activeArticleModal, setActiveArticleModal] = useState(null);

  const handleToggleCheer = (actId) => {
    setCheeredMap(prev => ({
      ...prev,
      [actId]: !prev[actId]
    }));
  };

  // Derive user-performed doorstep collection & recycling activities from pickups prop
  const userPickupActivities = (pickups || []).map((p) => {
    const isCompleted = p.status === 'COMPLETED';
    let category = 'Dry Scrap';
    const label = ((p.streamLabel || '') + ' ' + (p.itemName || '')).toLowerCase();
    if (label.includes('paper') || label.includes('cardboard') || label.includes('carton') || label.includes('box')) {
      category = 'Dry Scrap';
    } else if (label.includes('compost') || label.includes('organic') || label.includes('wet') || label.includes('peel') || label.includes('food')) {
      category = 'Composting';
    } else if (label.includes('cable') || label.includes('phone') || label.includes('electronic') || label.includes('e-waste') || label.includes('wire') || label.includes('charger')) {
      category = 'E-Waste';
    } else if (label.includes('drive') || label.includes('clean') || label.includes('society')) {
      category = 'Community Drives';
    } else if (label.includes('bottle') || label.includes('plastic') || label.includes('upcycling') || label.includes('diy') || label.includes('jar')) {
      category = 'Upcycling DIY';
    }

    let image = 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=600&auto=format&fit=crop&q=80';
    if (p.itemId?.includes('bottle') || p.itemName?.toLowerCase().includes('bottle') || p.itemName?.toLowerCase().includes('plastic')) {
      image = 'https://images.unsplash.com/photo-1562243061-204550d8a2c9?w=600&auto=format&fit=crop&q=80';
    } else if (p.itemId?.includes('cable') || p.itemName?.toLowerCase().includes('cable') || p.itemName?.toLowerCase().includes('charger') || p.itemName?.toLowerCase().includes('wire')) {
      image = 'https://images.unsplash.com/photo-1588508065123-287b28e013da?w=600&auto=format&fit=crop&q=80';
    } else if (p.itemId?.includes('cardboard') || p.itemName?.toLowerCase().includes('box') || p.itemName?.toLowerCase().includes('carton')) {
      image = 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=600&auto=format&fit=crop&q=80';
    }

    return {
      id: `user_pck_${p.id}`,
      pickupId: p.id,
      isCurrentUser: true,
      userName: profileName || user?.name || 'You (Resident Citizen)',
      userLocation: user?.address ? user?.address.split(',')[0] : 'Flat 402, Green Valley Apartments',
      society: 'Green Valley Society',
      userAvatar: profileImage || user?.avatar || null,
      actionTitle: isCompleted
        ? `Recycled & Handed Over: ${p.itemName}`
        : `Scheduled Doorstep Handover for ${p.itemName}`,
      category,
      badgeColor: isCompleted ? 'emerald' : 'amber',
      impactStat: `${p.co2Grams ? (p.co2Grams / 1000).toFixed(2) : ((p.credits || 25) * 0.08).toFixed(2)} kg CO₂ Prevented`,
      creditsEarned: p.credits || 25,
      timeAgo: p.pickupDate ? (isCompleted ? `Verified (${p.pickupDate})` : `Scheduled (${p.pickupDate})`) : 'Recent',
      image,
      verified: isCompleted,
      status: p.status || 'SCHEDULED',
      cheers: isCompleted ? 14 : 5,
      notes: p.instructions || `Booking #${p.bookingRef || 'IND-7842'}. Slot: ${p.timeSlot || 'Morning'}. Segregated at home and scheduled for doorstep collection.`,
      rawPickup: p,
    };
  });

  const allActivities = [...userPickupActivities, ...communityActivitiesList];
  const userActivitiesCount = userPickupActivities.length + communityActivitiesList.filter(a => a.isCurrentUser).length;

  const filteredActivities = allActivities.filter((act) => {
    if (activityCategoryFilter === 'All') return true;
    if (activityCategoryFilter === 'My Activities') return act.isCurrentUser;
    return act.category === activityCategoryFilter;
  });

  // Edit Profile Modal State
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [tempName, setTempName] = useState('');
  const [tempBio, setTempBio] = useState('');
  const [avatarPreview, setAvatarPreview] = useState(null);

  const openEditModal = () => {
    setTempName(profileName);
    setTempBio(profileBio);
    setAvatarPreview(profileImage);
    setIsEditProfileModalOpen(true);
  };

  const lastAvatarTapRef = useRef(0);
  const handleAvatarDoubleTap = () => {
    const now = Date.now();
    if (now - lastAvatarTapRef.current < 400 && now - lastAvatarTapRef.current > 40) {
      openEditModal();
      lastAvatarTapRef.current = 0;
    } else {
      lastAvatarTapRef.current = now;
    }
  };

  const handleAvatarFile = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAvatarPreview(url);
    }
  };

  const handleSaveProfile = (e) => {
    if (e) e.preventDefault();
    const updatedName = tempName.trim() || profileName;
    const updatedBio = tempBio.trim();
    const updatedAvatar = avatarPreview;

    setProfileName(updatedName);
    setProfileBio(updatedBio);
    setProfileImage(updatedAvatar);
    setIsEditProfileModalOpen(false);

    if (onUpdateUser) {
      onUpdateUser({
        name: updatedName,
        bio: updatedBio,
        avatar: updatedAvatar,
      });
    }

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#10b981', '#14b8a6', '#f59e0b'],
    });
  };
  
  // Notification State
  const [notifications, setNotifications] = useState(DEFAULT_NOTIFICATIONS);
  const [notifFilter, setNotifFilter] = useState('all');

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const filteredNotifications = notifFilter === 'all'
    ? notifications
    : notifications.filter((n) => n.type === notifFilter);

  // DIY Filter State
  const [diyCategory, setDiyCategory] = useState('all');
  const [activeDiyModal, setActiveDiyModal] = useState(null);

  // AI Scanner & Sell State
  const [selectedDemo, setSelectedDemo] = useState(DEMO_ITEMS[0]);
  const [customImage, setCustomImage] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(DEMO_ITEMS[0]);

  // Modal State for scheduling pickup / sell
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [pickupDate, setPickupDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [timeSlot, setTimeSlot] = useState('Morning (9:00 AM - 12:00 PM)');
  const [address, setAddress] = useState(user?.address || 'Flat 402, Green Valley Apartments, New Delhi');
  const [notes, setNotes] = useState('Clean & bundled for Raju the Eco-Picker');

  const triggerScan = (item) => {
    setIsScanning(true);
    setTimeout(() => {
      setScanResult(item);
      setIsScanning(false);
    }, 600);
  };

  const handleSelectDemo = (item) => {
    setSelectedDemo(item);
    setCustomImage(null);
    triggerScan(item);
  };

  const [isDragging, setIsDragging] = useState(false);

  // Live Camera Scanner State
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraLoading, setCameraLoading] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [facingMode, setFacingMode] = useState('environment');
  const videoRef = useRef(null);
  const mobileVideoRef = useRef(null);
  const streamRef = useRef(null);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    if (mobileVideoRef.current) {
      mobileVideoRef.current.srcObject = null;
    }
    setIsCameraOpen(false);
    setCameraLoading(false);
    setCameraError(null);
  };

  useEffect(() => {
    let activeStream = null;
    if (isCameraOpen) {
      setCameraLoading(true);
      setCameraError(null);

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCameraLoading(false);
        setCameraError('Camera API is not supported in this browser. Please upload a photo file instead.');
        return;
      }

      navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      })
      .then((stream) => {
        activeStream = stream;
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch((err) => console.log('Video play error:', err));
        }
        if (mobileVideoRef.current) {
          mobileVideoRef.current.srcObject = stream;
          mobileVideoRef.current.play().catch((err) => console.log('Mobile video play error:', err));
        }
        setCameraLoading(false);
      })
      .catch((err) => {
        console.error('Camera access error:', err);
        setCameraLoading(false);
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          setCameraError('Camera permission was denied. Please allow camera permissions in your browser URL bar.');
        } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
          setCameraError('No camera found on your system. Please connect a webcam or upload a file.');
        } else {
          setCameraError('Unable to access camera: ' + (err.message || 'Check connection or permissions.'));
        }
      });
    }

    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isCameraOpen, facingMode]);

  // Automatically activate live camera when user enters upload tab without scanned image
  useEffect(() => {
    if (activeTab === 'upload' && !customImage) {
      setIsCameraOpen(true);
    } else if (activeTab !== 'upload' && isCameraOpen) {
      stopCamera();
    }
  }, [activeTab, customImage]);

  const capturePhoto = () => {
    const video = mobileVideoRef.current || videoRef.current;
    if (!video) return;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);

    stopCamera();
    setCustomImage(dataUrl);

    const scrapOptions = [
      {
        name: 'Scanned PET Plastic Scrap',
        icon: '🥤',
        category: 'non-degradable',
        categoryLabel: 'Non-Degradable (Rigid Plastic)',
        scrapRate: '₹22 / kg (45 Credits)',
        binColor: 'blue',
        binName: 'Blue Dry Recyclables Bin',
        creditsAwarded: 28,
        co2PreventedGrams: 95,
        weightGrams: 45,
        disposalTip: 'Rinse residual liquids, crush flat, and keep caps attached for doorstep collection.',
      },
      {
        name: 'Scanned Cardboard Packaging',
        icon: '📦',
        category: 'non-degradable',
        categoryLabel: 'Non-Degradable (Paper Pulp)',
        scrapRate: '₹14 / kg (28 Credits)',
        binColor: 'blue',
        binName: 'Blue / Dry Paper Pulp Stream',
        creditsAwarded: 22,
        co2PreventedGrams: 110,
        weightGrams: 160,
        disposalTip: 'Remove synthetic adhesive tape and flatten flat for doorstep pickup.',
      },
      {
        name: 'Scanned Aluminum Beverage Can',
        icon: '🥫',
        category: 'non-degradable',
        categoryLabel: 'Non-Degradable (High Scrap Metal)',
        scrapRate: '₹95 / kg (190 Credits)',
        binColor: 'blue',
        binName: 'Blue Dedicated Metal Bin',
        creditsAwarded: 35,
        co2PreventedGrams: 280,
        weightGrams: 55,
        disposalTip: 'Rinse sticky residue and crush flat. 100% infinitely recyclable metal.',
      },
      {
        name: 'Scanned Electronic Wire & E-Waste',
        icon: '🔌',
        category: 'non-degradable',
        categoryLabel: 'Non-Degradable (E-Waste / Metal)',
        scrapRate: '₹45 / kg (90 Credits)',
        binColor: 'blue',
        binName: 'Blue Dedicated E-Waste Stream',
        creditsAwarded: 40,
        co2PreventedGrams: 340,
        weightGrams: 110,
        disposalTip: 'Contains high-purity copper. Keep dry and bundle for certified recycling pickup.',
      }
    ];

    const chosen = scrapOptions[Math.floor(Math.random() * scrapOptions.length)];
    triggerScan({
      id: 'scan_' + Date.now(),
      name: chosen.name,
      icon: chosen.icon,
      category: chosen.category,
      categoryLabel: chosen.categoryLabel,
      scrapRate: chosen.scrapRate,
      binColor: chosen.binColor,
      binName: chosen.binName,
      creditsAwarded: chosen.creditsAwarded,
      co2PreventedGrams: chosen.co2PreventedGrams,
      weightGrams: chosen.weightGrams,
      disposalTip: chosen.disposalTip,
      image: dataUrl,
    });
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      stopCamera();
      const url = URL.createObjectURL(file);
      setCustomImage(url);
      triggerScan({
        id: 'custom_' + Date.now(),
        name: file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ') || 'Household Recyclable Scrap',
        icon: '📸',
        category: 'non-degradable',
        categoryLabel: 'Non-Degradable (Recyclable Scrap)',
        scrapRate: '₹20 / kg (40 Credits)',
        binColor: 'blue',
        binName: 'Blue Recyclables Bin',
        creditsAwarded: 25,
        co2PreventedGrams: 115,
        weightGrams: 120,
        disposalTip: 'Rinse dry and pack in blue designated bag for doorstep collection and payout.',
        image: url,
      });
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer?.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCustomImage(url);
      triggerScan({
        id: 'custom_' + Date.now(),
        name: file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ') || 'Household Recyclable Scrap',
        icon: '📸',
        category: 'non-degradable',
        categoryLabel: 'Non-Degradable (Recyclable Scrap)',
        scrapRate: '₹20 / kg (40 Credits)',
        binColor: 'blue',
        binName: 'Blue Recyclables Bin',
        creditsAwarded: 25,
        co2PreventedGrams: 115,
        weightGrams: 120,
        disposalTip: 'Rinse dry and pack in blue designated bag for doorstep collection and payout.',
        image: url,
      });
    }
  };

  const handleConfirmPickupBooking = (e) => {
    e.preventDefault();
    onSchedulePickup({
      id: 'pk_' + Date.now(),
      bookingRef: 'IND-' + Math.floor(1000 + Math.random() * 9000),
      itemId: scanResult.id,
      itemName: scanResult.name,
      itemIcon: scanResult.icon,
      stream: scanResult.category,
      streamLabel: scanResult.categoryLabel,
      weightEst: (scanResult.weightGrams / 1000).toFixed(2) + ' kg',
      credits: scanResult.creditsAwarded,
      co2Grams: scanResult.co2PreventedGrams,
      pickupDate: pickupDate,
      timeSlot: timeSlot,
      address: address,
      instructions: notes,
      status: 'SCHEDULED',
      createdAt: new Date().toISOString(),
    });

    setIsScheduleModalOpen(false);
    setActiveTab('explore');
    setExploreSubTab('activity');
    setActivityCategoryFilter('My Activities');
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 }
    });
  };

  const handleCompletePickupTrigger = (pickupId, credits, co2Grams) => {
    confetti({
      particleCount: 90,
      spread: 75,
      origin: { y: 0.6 },
      colors: ['#059669', '#10b981', '#f59e0b', '#3b82f6'],
    });
    onSimulatePickerComplete(pickupId, credits, co2Grams);
  };

  const co2Kg = (impactStats.co2PreventedGrams / 1000).toFixed(2);
  const landfillKg = (impactStats.landfillDivertedGrams / 1000).toFixed(2);
  const treesEq = (impactStats.co2PreventedGrams / 21000).toFixed(2);

  const filteredDiyIdeas = diyCategory === 'all'
    ? DIY_HOME_IDEAS
    : DIY_HOME_IDEAS.filter((idea) => idea.category === diyCategory);

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col md:flex-row font-sans">
      
      {/* MOBILE TOP BAR (Only visible on phone screen) */}
      <header className="md:hidden flex items-center justify-between px-4 py-3 bg-white/90 backdrop-blur-md border-b border-stone-200/60 sticky top-0 z-30">
        <div className="flex items-center gap-2.5">
          <img
            src="/logo.png"
            alt="IndoHood Logo"
            className="w-8 h-8 object-contain"
          />
          <h2 className="text-lg font-black text-stone-900 tracking-tight leading-none">IndoHood</h2>
        </div>
        {/* Notification Button */}
        <button
          onClick={() => setActiveTab('notification')}
          aria-label="Notifications"
          className={`relative p-2 rounded-2xl transition-all cursor-pointer active:scale-95 ${
            activeTab === 'notification'
              ? 'bg-emerald-100 text-emerald-800 shadow-xs'
              : 'text-stone-700 hover:text-stone-900 hover:bg-stone-100 bg-stone-100/70 border border-stone-200/80'
          }`}
        >
          <Bell className="w-5 h-5" />
          {notifications.some((n) => n.unread) && (
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white animate-pulse"></span>
          )}
        </button>
      </header>

      {/* ============================================================ */}
      {/* DESKTOP PERMANENT LEFT SIDEBAR NAVIGATION                    */}
      {/* Completely transparent sidebar with hover-revealed icon names*/}
      {/* ============================================================ */}
      <aside className="hidden md:block w-52 lg:w-56 bg-transparent border-r border-stone-200/40 h-screen sticky top-0 px-4 lg:px-5 py-8 shrink-0 z-30 select-none">
        <div className="space-y-8">
          {/* Brand Header with Official Logo - only shows logo by default, reveals IndoHood on hover */}
          <div className="flex items-center gap-3.5 px-3 py-2 cursor-pointer group bg-transparent select-none">
            <img
              src="/logo.png"
              alt="IndoHood Logo"
              className="w-10 h-10 object-contain shrink-0 group-hover:scale-105 transition-transform"
            />
            <span className="text-xl font-black text-stone-900 tracking-tight leading-none opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-200 whitespace-nowrap">
              IndoHood
            </span>
          </div>

          {/* Navigation Links in Strict Sequence: Explore -> Upload -> Profile */}
          <nav className="space-y-2">
            {/* 1. Explore Tab */}
            <button
              onClick={() => setActiveTab('explore')}
              className="w-full flex items-center gap-3.5 px-3 py-3 rounded-2xl transition-all cursor-pointer text-left group bg-transparent hover:bg-stone-200/20"
            >
              <Compass className={`w-6 h-6 shrink-0 transition-transform ${activeTab === 'explore' ? 'scale-110 text-emerald-600 stroke-[2.4]' : 'text-stone-500 group-hover:text-stone-900 stroke-[1.8]'}`} />
              <span className={`text-base font-bold tracking-tight opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-200 whitespace-nowrap ${activeTab === 'explore' ? 'text-emerald-700' : 'text-stone-800'}`}>
                Explore
              </span>
            </button>

            {/* 2. Upload Tab */}
            <button
              onClick={() => setActiveTab('upload')}
              className="w-full flex items-center gap-3.5 px-3 py-3 rounded-2xl transition-all cursor-pointer text-left group bg-transparent hover:bg-stone-200/20"
            >
              <PlusSquare className={`w-6 h-6 shrink-0 transition-transform ${activeTab === 'upload' ? 'scale-110 text-emerald-600 stroke-[2.4]' : 'text-stone-500 group-hover:text-stone-900 stroke-[1.8]'}`} />
              <span className={`text-base font-bold tracking-tight opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-200 whitespace-nowrap ${activeTab === 'upload' ? 'text-emerald-700' : 'text-stone-800'}`}>
                Upload
              </span>
            </button>

            {/* 3. Notification Tab */}
            <button
              onClick={() => setActiveTab('notification')}
              className="w-full flex items-center gap-3.5 px-3 py-3 rounded-2xl transition-all cursor-pointer text-left group bg-transparent hover:bg-stone-200/20"
            >
              <div className="relative shrink-0">
                <Bell className={`w-6 h-6 transition-transform ${activeTab === 'notification' ? 'scale-110 text-emerald-600 stroke-[2.4]' : 'text-stone-500 group-hover:text-stone-900 stroke-[1.8]'}`} />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-stone-50 animate-pulse"></span>
              </div>
              <span className={`text-base font-bold tracking-tight opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-200 whitespace-nowrap ${activeTab === 'notification' ? 'text-emerald-700' : 'text-stone-800'}`}>
                Notification
              </span>
            </button>

            {/* 4. Profile Tab */}
            <button
              onClick={() => setActiveTab('profile')}
              className="w-full flex items-center gap-3.5 px-3 py-3 rounded-2xl transition-all cursor-pointer text-left group bg-transparent hover:bg-stone-200/20"
            >
              <User className={`w-6 h-6 shrink-0 transition-transform ${activeTab === 'profile' ? 'scale-110 text-emerald-600 stroke-[2.4]' : 'text-stone-500 group-hover:text-stone-900 stroke-[1.8]'}`} />
              <span className={`text-base font-bold tracking-tight opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-200 whitespace-nowrap ${activeTab === 'profile' ? 'text-emerald-700' : 'text-stone-800'}`}>
                Profile
              </span>
            </button>
          </nav>
        </div>
      </aside>

      {/* MOBILE BOTTOM NAVIGATION BAR (Instagram mobile style) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-stone-200/80 px-4 py-2 flex items-center justify-around shadow-lg">
        <button
          onClick={() => setActiveTab('explore')}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
            activeTab === 'explore' ? 'text-emerald-700 font-bold' : 'text-stone-500'
          }`}
        >
          <Compass className={`w-6 h-6 ${activeTab === 'explore' ? 'text-emerald-600 stroke-[2.4]' : 'stroke-[1.8]'}`} />
          <span className="text-[11px] font-semibold">Explore</span>
        </button>
        <button
          onClick={() => setActiveTab('upload')}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
            activeTab === 'upload' ? 'text-emerald-700 font-bold' : 'text-stone-500'
          }`}
        >
          <PlusSquare className={`w-6 h-6 ${activeTab === 'upload' ? 'text-emerald-600 stroke-[2.4]' : 'stroke-[1.8]'}`} />
          <span className="text-[11px] font-semibold">Upload</span>
        </button>
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
            activeTab === 'profile' ? 'text-emerald-700 font-bold' : 'text-stone-500'
          }`}
        >
          <User className={`w-6 h-6 ${activeTab === 'profile' ? 'text-emerald-600 stroke-[2.4]' : 'stroke-[1.8]'}`} />
          <span className="text-[11px] font-semibold">Profile</span>
        </button>
      </nav>

      {/* ============================================================ */}
      {/* DESKTOP & MOBILE CONTENT WORKSPACE                           */}
      {/* ============================================================ */}
      <main className="flex-1 min-w-0 px-4 sm:px-6 md:px-8 lg:px-12 py-6 md:py-8 space-y-8 overflow-y-auto pb-24 md:pb-8">

      {/* ============================================================ */}
      {/* TAB 1: EXPLORE (AWARENESS & HOW TO USE WASTE AT HOME)        */}
      {/* ============================================================ */}
      {activeTab === 'explore' && (
        <div className="space-y-6 animate-fade-in">
          
          {/* ============================================================ */}
          {/* EXPLORE SUB-TAB DIVIDER: ACTIVITY & ARTICLES                 */}
          {/* ============================================================ */}
          <div className="border-b border-stone-200 pb-0">
            <div className="flex items-center justify-center gap-10 sm:gap-14">
              {/* Tab 1: Activity (Community actions done by people) */}
              <button
                type="button"
                onClick={() => setExploreSubTab('activity')}
                className={`flex items-center gap-2 py-3 px-3 text-xs uppercase tracking-widest font-black transition-all cursor-pointer border-b-2 -mb-px ${
                  exploreSubTab === 'activity'
                    ? 'border-stone-900 text-stone-900'
                    : 'border-transparent text-stone-400 hover:text-stone-700'
                }`}
              >
                <Activity className="w-4 h-4 stroke-[2.2]" />
                <span>Activity</span>
              </button>

              {/* Tab 2: Articles (Waste awareness in short form) */}
              <button
                type="button"
                onClick={() => setExploreSubTab('articles')}
                className={`flex items-center gap-2 py-3 px-3 text-xs uppercase tracking-widest font-black transition-all cursor-pointer border-b-2 -mb-px ${
                  exploreSubTab === 'articles'
                    ? 'border-stone-900 text-stone-900'
                    : 'border-transparent text-stone-400 hover:text-stone-700'
                }`}
              >
                <BookOpen className="w-4 h-4 stroke-[2.2]" />
                <span>Articles</span>
              </button>
            </div>
          </div>

          {/* ============================================================ */}
          {/* SUB-TAB 1: ACTIVITY (Actions & Contributions Done by People) */}
          {/* ============================================================ */}
          {exploreSubTab === 'activity' && (
            <div className="space-y-6 animate-fade-in">
              {/* Filter Chips */}
              <div className="flex flex-wrap gap-2">
                {['All', 'My Activities', 'Dry Scrap', 'Composting', 'E-Waste', 'Community Drives', 'Upcycling DIY'].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setActivityCategoryFilter(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      activityCategoryFilter === cat
                        ? 'bg-stone-900 text-white shadow-2xs'
                        : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    <span>{cat}</span>
                    {cat === 'My Activities' && (
                      <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${
                        activityCategoryFilter === 'My Activities'
                          ? 'bg-emerald-500 text-white'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {userActivitiesCount}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Feed of Activities done by people */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {filteredActivities.map((act) => {
                  const isCheered = !!cheeredMap[act.id];
                  const cheerCount = act.cheers + (isCheered ? 1 : 0);

                  return (
                    <div
                      key={act.id}
                      className={`bg-white rounded-3xl border p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 ${
                        act.isCurrentUser ? 'border-emerald-300 ring-1 ring-emerald-200/60' : 'border-stone-200'
                      }`}
                    >
                      <div className="space-y-3">
                        {/* User Header */}
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3 min-w-0">
                            {act.userAvatar ? (
                              <img
                                src={act.userAvatar}
                                alt={act.userName}
                                className="w-10 h-10 rounded-2xl object-cover border border-stone-200 shrink-0"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-black text-sm flex items-center justify-center shrink-0">
                                {act.userName?.[0] || 'U'}
                              </div>
                            )}
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="text-sm font-bold text-stone-900 truncate">{act.userName}</p>
                                {act.isCurrentUser && (
                                  <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 shrink-0">
                                    Your Activity
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-stone-500 truncate">{act.userLocation} • {act.timeAgo}</p>
                            </div>
                          </div>

                          <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-stone-100 text-stone-700 border border-stone-200 shrink-0">
                            {act.category}
                          </span>
                        </div>

                        {/* Action Headline */}
                        <h3 className="text-sm font-black text-stone-900 leading-snug">
                          {act.actionTitle}
                        </h3>

                        {/* User Notes */}
                        {act.notes && (
                          <p className="text-xs text-stone-600 leading-relaxed bg-stone-50/70 p-3 rounded-2xl border border-stone-100">
                            "{act.notes}"
                          </p>
                        )}

                        {/* Action Image Thumbnail */}
                        {act.image && (
                          <div className="h-44 rounded-2xl overflow-hidden bg-stone-100 border border-stone-100">
                            <img
                              src={act.image}
                              alt={act.actionTitle}
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                            />
                          </div>
                        )}

                        {/* Impact Metrics Pill Row */}
                        <div className="flex flex-wrap items-center gap-2 pt-1">
                          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                            🌱 {act.impactStat}
                          </span>
                          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                            🪙 +{act.creditsEarned} Credits
                          </span>
                          <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                            act.status === 'COMPLETED' || act.verified
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {act.status === 'COMPLETED' || act.verified ? 'Verified ✅' : 'Scheduled 🚚'}
                          </span>
                        </div>

                        {/* Interactive Handover for Scheduled User Pickups */}
                        {act.isCurrentUser && act.rawPickup && act.status !== 'COMPLETED' && (
                          <div className="pt-2">
                            <button
                              type="button"
                              onClick={() => handleCompletePickupTrigger(act.pickupId, act.creditsEarned, act.rawPickup.co2Grams)}
                              className="w-full py-2.5 px-3 rounded-xl text-xs font-black text-white bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs active:scale-98"
                            >
                              <ShieldCheck className="w-4 h-4" />
                              Simulate Handover & Claim +{act.creditsEarned} Credits
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Card Footer: Cheer Button */}
                      <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() => handleToggleCheer(act.id)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            isCheered
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 scale-105'
                              : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                          }`}
                        >
                          <span>👏</span>
                          <span>{cheerCount} {cheerCount === 1 ? 'Cheer' : 'Cheers'}</span>
                        </button>

                        <span className="text-[11px] font-medium text-stone-400">
                          {act.isCurrentUser ? 'Your Doorstep Action' : 'IndoHood Neighborhood Stream'}
                        </span>
                      </div>
                    </div>
                  );
                })}

                {filteredActivities.length === 0 && (
                  <div className="col-span-full p-12 text-center bg-white rounded-3xl border border-stone-200 space-y-3">
                    <div className="w-12 h-12 mx-auto rounded-2xl bg-stone-100 text-stone-400 flex items-center justify-center text-xl">
                      📦
                    </div>
                    <h4 className="text-sm font-bold text-stone-800">No activities found</h4>
                    <p className="text-xs text-stone-500 max-w-sm mx-auto">
                      {activityCategoryFilter === 'My Activities'
                        ? "You haven't scheduled any scrap handovers yet. Sell recyclable scrap in the Upload tab to record your impact!"
                        : "No community activities recorded for this category yet."}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* SUB-TAB 2: ARTICLES (Short-Form Waste Awareness Content)     */}
          {/* ============================================================ */}
          {exploreSubTab === 'articles' && (
            <div className="space-y-6 animate-fade-in">
              {/* Topic Filters */}
              <div className="flex flex-wrap gap-2">
                {['All', 'Landfill Crisis', 'Plastic Recycling', 'E-Waste Awareness', 'Home Composting', 'Hazardous Waste', 'Circular Economy'].map((topic) => (
                  <button
                    key={topic}
                    type="button"
                    onClick={() => setArticleTopicFilter(topic)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      articleTopicFilter === topic
                        ? 'bg-stone-900 text-white shadow-2xs'
                        : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    {topic}
                  </button>
                ))}
              </div>

              {/* Short-Form Articles Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {WASTE_AWARENESS_ARTICLES
                  .filter((art) => articleTopicFilter === 'All' || art.topic === articleTopicFilter)
                  .map((art) => (
                    <div
                      key={art.id}
                      className="bg-white rounded-3xl border border-stone-200 p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                    >
                      <div className="space-y-3">
                        {/* Topic Tag & Read Time */}
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
                            {art.topic}
                          </span>
                          <span className="text-[11px] font-bold text-stone-400">
                            ⏱ {art.readTime}
                          </span>
                        </div>

                        {/* Title */}
                        <h3 className="text-base font-black text-stone-900 leading-snug">
                          {art.title}
                        </h3>

                        {/* Short Summary Highlight */}
                        <p className="text-xs text-stone-600 leading-relaxed font-medium">
                          {art.summary}
                        </p>

                        {/* Key Takeaways in Short Form */}
                        <div className="space-y-1.5 pt-1">
                          <p className="text-[10px] font-black uppercase tracking-wider text-stone-400">
                            Key Takeaways:
                          </p>
                          <ul className="space-y-1.5 text-xs text-stone-700">
                            {art.takeaways.map((point, idx) => (
                              <li key={idx} className="flex items-start gap-1.5 leading-snug">
                                <span className="text-emerald-600 font-bold shrink-0 mt-0.5">•</span>
                                <span>{point}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Golden Rule Callout Footer */}
                      <div className="pt-3 border-t border-stone-100">
                        <div className="p-2.5 rounded-xl bg-amber-50/80 border border-amber-200/80">
                          <p className="text-[11px] font-bold text-amber-900 leading-snug">
                            <strong>Golden Rule:</strong> {art.goldenRule}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>

              {/* 3-Stream Quick Segregation Lookup Footer inside Articles */}
              <div className="pt-6 border-t border-stone-200 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black uppercase tracking-wider text-stone-700">
                    Quick Household Reference: 3-Bin Segregation Rules
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {SEGREGATION_STREAMS.map((stream, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-white border border-stone-200 space-y-2 text-xs"
                    >
                      <span className={`inline-block text-[10px] font-black px-2.5 py-0.5 rounded-full border ${
                        stream.color === 'emerald' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' :
                        stream.color === 'blue' ? 'bg-blue-100 text-blue-800 border-blue-300' : 'bg-rose-100 text-rose-800 border-rose-300'
                      }`}>
                        {stream.badge}
                      </span>
                      <h4 className="font-bold text-stone-900 text-sm">{stream.title}</h4>
                      <p className="text-stone-500 text-[11px]">{stream.desc}</p>
                      <p className="text-[11px] font-semibold text-emerald-700 pt-1">
                        <strong>Rule:</strong> {stream.actionTip}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 2: UPLOAD (SCAN & SELL RECYCLABLES FOR ECO-CREDITS)      */}
      {/* ============================================================ */}
      {activeTab === 'upload' && (
        <div className="animate-fade-in">
          
          {/* ============================================================ */}
          {/* DESKTOP SCREEN: SINGLE LARGE CENTERED OPTION TO UPLOAD/SCAN  */}
          {/* ============================================================ */}
          <div className="hidden md:flex flex-col items-center justify-center min-h-[70vh] py-6">
            {!customImage ? (
              isCameraOpen ? (
                /* LIVE CAMERA SCANNER VIEW */
                <div className="w-full max-w-2xl mx-auto bg-stone-900 rounded-3xl p-6 lg:p-8 text-white shadow-2xl border border-stone-800 flex flex-col items-center transition-all animate-fade-in">
                  {/* Top Bar */}
                  <div className="w-full flex items-center justify-between pb-4 border-b border-stone-800">
                    <div className="flex items-center gap-2.5">
                      <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                      </span>
                      <span className="text-xs font-black uppercase tracking-wider text-emerald-400">
                        Live Camera Scanner
                      </span>
                      <span className="text-[11px] text-stone-400 font-medium hidden sm:inline">
                        • Bedrock Vision Reticle
                      </span>
                    </div>

                    <button
                      onClick={stopCamera}
                      className="p-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition-all cursor-pointer"
                      title="Close Camera"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Camera Viewport or Error */}
                  {cameraError ? (
                    <div className="w-full my-6 p-8 rounded-2xl bg-stone-800/90 border border-amber-500/30 text-center flex flex-col items-center justify-center space-y-4">
                      <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                        <AlertTriangle className="w-8 h-8" />
                      </div>
                      <div>
                        <h4 className="text-base font-bold text-white mb-1">Camera Access Notice</h4>
                        <p className="text-xs text-stone-400 max-w-md leading-relaxed">{cameraError}</p>
                      </div>
                      <div className="flex items-center gap-3 pt-2">
                        <button
                          onClick={() => {
                            setCameraError(null);
                            setIsCameraOpen(false);
                            setTimeout(() => setIsCameraOpen(true), 150);
                          }}
                          className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-2"
                        >
                          <RefreshCw className="w-4 h-4" />
                          <span>Retry Camera</span>
                        </button>
                        <label className="px-5 py-2.5 rounded-xl bg-stone-700 hover:bg-stone-600 text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-2">
                          <Upload className="w-4 h-4" />
                          <span>Upload File Instead</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              stopCamera();
                              handleFileUpload(e);
                            }}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                  ) : (
                    <div className="relative w-full aspect-16/10 sm:aspect-16/9 my-5 rounded-2xl overflow-hidden bg-black border border-stone-800 flex items-center justify-center shadow-inner">
                      {/* Video element */}
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-cover"
                      />

                      {/* Loading spinner */}
                      {cameraLoading && (
                        <div className="absolute inset-0 bg-stone-900/95 flex flex-col items-center justify-center space-y-3 z-20">
                          <RefreshCw className="w-8 h-8 animate-spin text-emerald-400" />
                          <p className="text-xs font-bold text-stone-300">Initializing camera feed...</p>
                        </div>
                      )}

                      {/* Targeting Corners (Reticle) */}
                      <div className="absolute top-4 left-4 w-7 h-7 border-t-3 border-l-3 border-emerald-400 rounded-tl-sm pointer-events-none z-10" />
                      <div className="absolute top-4 right-4 w-7 h-7 border-t-3 border-r-3 border-emerald-400 rounded-tr-sm pointer-events-none z-10" />
                      <div className="absolute bottom-4 left-4 w-7 h-7 border-b-3 border-l-3 border-emerald-400 rounded-bl-sm pointer-events-none z-10" />
                      <div className="absolute bottom-4 right-4 w-7 h-7 border-b-3 border-r-3 border-emerald-400 rounded-br-sm pointer-events-none z-10" />

                      {/* Animated Laser Scanning Line */}
                      <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_#10b981] animate-bounce pointer-events-none z-10" />

                      {/* Center Guidance Hint */}
                      <div className="absolute bottom-3 inset-x-0 flex justify-center pointer-events-none z-10">
                        <span className="px-3.5 py-1.5 rounded-full bg-stone-950/80 backdrop-blur-md text-[11px] font-bold text-stone-200 border border-white/10 shadow-lg">
                          Center scrap item in camera view
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Bottom Controls Bar */}
                  {!cameraError && (
                    <div className="w-full flex items-center justify-between pt-2">
                      <button
                        onClick={stopCamera}
                        className="px-5 py-2.5 rounded-xl text-xs font-bold text-stone-400 hover:text-white hover:bg-stone-800 transition-all cursor-pointer"
                      >
                        Cancel
                      </button>

                      {/* Big Capture & Scan button */}
                      <button
                        onClick={capturePhoto}
                        disabled={cameraLoading}
                        className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 disabled:opacity-50 text-white font-black text-sm shadow-lg shadow-emerald-500/30 transition-all cursor-pointer flex items-center gap-2.5 active:scale-95 group"
                      >
                        <Camera className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        <span>Capture & Scan Item</span>
                      </button>

                      {/* Camera Flip / Switch */}
                      <button
                        onClick={() => setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'))}
                        className="p-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition-all cursor-pointer flex items-center gap-1.5 text-xs font-bold"
                        title="Switch Camera (Front / Back)"
                      >
                        <RefreshCw className="w-4 h-4" />
                        <span className="hidden sm:inline">Flip</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                /* DEFAULT CENTERED DROPZONE WITH UPLOAD / SCAN BUTTONS */
                <div
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  className={`w-full max-w-2xl mx-auto rounded-3xl border-2 border-dashed p-12 lg:p-16 text-center transition-all flex flex-col items-center justify-center ${
                    isDragging
                      ? 'border-emerald-500 bg-emerald-50/40 scale-[1.01]'
                      : 'border-stone-300 hover:border-emerald-500 bg-white/80 hover:bg-white shadow-sm hover:shadow-lg'
                  }`}
                >
                  {/* Large Center Upload / Scan Glowing Icon */}
                  <div className="w-24 h-24 rounded-3xl bg-emerald-100/80 text-emerald-700 flex items-center justify-center mb-6 shadow-xs border border-emerald-200">
                    <Upload className="w-12 h-12 stroke-[1.8]" />
                  </div>

                  <h2 className="text-2xl lg:text-3xl font-black text-stone-900 tracking-tight mb-2">
                    Upload or Scan Waste Image
                  </h2>
                  <p className="text-sm text-stone-500 max-w-md mb-8 leading-relaxed">
                    Drag and drop your photo here, or select an option below to analyze recyclable scrap with Amazon Bedrock AI.
                  </p>

                  {/* Single Large Centered Option Action Buttons */}
                  <div className="flex items-center gap-4">
                    <label className="px-7 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-sm shadow-md shadow-emerald-600/25 transition-all cursor-pointer flex items-center gap-2.5 active:scale-95">
                      <Upload className="w-5 h-5" />
                      <span>Upload Image</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>

                    <button
                      type="button"
                      onClick={() => {
                        setCameraError(null);
                        setIsCameraOpen(true);
                      }}
                      className="px-7 py-3.5 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-sm border border-stone-200 transition-all cursor-pointer flex items-center gap-2.5 active:scale-95"
                    >
                      <Camera className="w-5 h-5 text-emerald-600" />
                      <span>Scan Image</span>
                    </button>
                  </div>

                  <p className="text-xs text-stone-400 mt-6">
                    Supports Webcam live scanning or JPG, PNG, WEBP upload • Automatic valuation
                  </p>
                </div>
              )
            ) : (
              /* When an image has been uploaded or scanned, show valuation result in center */
              <div className="w-full max-w-2xl mx-auto bg-white rounded-3xl p-8 lg:p-10 border border-stone-200 shadow-md space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-stone-100">
                  <span className="text-xs font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                    AI Scrap Analysis Result ✨
                  </span>
                  <button
                    onClick={() => setCustomImage(null)}
                    className="text-xs font-bold text-stone-500 hover:text-stone-800 transition-colors cursor-pointer"
                  >
                    ← Upload Another Image
                  </button>
                </div>

                {isScanning ? (
                  <div className="py-16 flex flex-col items-center justify-center space-y-4">
                    <RefreshCw className="w-8 h-8 animate-spin text-emerald-600" />
                    <p className="text-sm font-bold text-stone-700">Analyzing scrap material with Bedrock AI...</p>
                  </div>
                ) : (
                  <>
                    <div className="flex flex-col sm:flex-row items-center gap-6">
                      <div className="w-44 h-44 rounded-2xl overflow-hidden bg-stone-100 shrink-0 border border-stone-200 shadow-inner">
                        <img src={customImage} alt="Uploaded item" className="w-full h-full object-cover" />
                      </div>

                      <div className="flex-1 space-y-3 text-left w-full">
                        <h3 className="text-xl font-black text-stone-900 flex items-center gap-2">
                          <span>{scanResult.icon}</span>
                          <span>{scanResult.name}</span>
                        </h3>
                        <p className="text-xs text-stone-500 leading-relaxed">
                          {scanResult.disposalTip}
                        </p>

                        <div className="grid grid-cols-2 gap-3 pt-1">
                          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
                            <p className="text-[10px] font-bold text-amber-900">Scrap Valuation</p>
                            <p className="text-sm font-black text-amber-700">+{scanResult.creditsAwarded} Credits</p>
                          </div>
                          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                            <p className="text-[10px] font-bold text-emerald-900">Avoided CO₂</p>
                            <p className="text-sm font-black text-emerald-700">-{scanResult.co2PreventedGrams} g</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 flex items-center gap-3">
                      <button
                        onClick={() => setIsScheduleModalOpen(true)}
                        className="flex-1 py-3.5 px-4 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-md shadow-emerald-600/25 transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-98"
                      >
                        <Calendar className="w-4 h-4" />
                        <span>Sell Item & Schedule Pickup</span>
                      </button>

                      <button
                        onClick={() => setCustomImage(null)}
                        className="py-3.5 px-4 rounded-xl font-bold text-sm text-stone-700 bg-stone-100 hover:bg-stone-200 transition-all cursor-pointer border border-stone-200"
                      >
                        Scan Another
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* ============================================================ */}
          {/* MOBILE PHONE SCREEN (Preserves mobile photo capture flow)    */}
          {/* ============================================================ */}
          {/* ============================================================ */}
          {/* MOBILE PHONE SCREEN (Live camera viewfinder + gallery scan)  */}
          {/* ============================================================ */}
          <div className="md:hidden space-y-4 animate-fade-in">
            {!customImage ? (
              /* ACTIVE CAMERA / SCANNER SCREEN ON MOBILE */
              cameraError ? (
                /* Camera Error / Permission Fallback Card */
                <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-sm text-center space-y-4 my-2">
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                    <AlertTriangle className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-stone-900">Camera Access</h3>
                    <p className="text-xs text-stone-500 leading-relaxed mt-1 max-w-xs mx-auto">
                      {cameraError}
                    </p>
                  </div>

                  <div className="flex flex-col gap-2.5 pt-2">
                    <label className="w-full py-3.5 px-4 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-md shadow-emerald-600/20 transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95">
                      <ImageIcon className="w-4 h-4" />
                      <span>Choose from Gallery to Scan</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          stopCamera();
                          handleFileUpload(e);
                        }}
                        className="hidden"
                      />
                    </label>

                    <button
                      type="button"
                      onClick={() => {
                        setCameraError(null);
                        setIsCameraOpen(false);
                        setTimeout(() => setIsCameraOpen(true), 150);
                      }}
                      className="w-full py-2.5 px-4 rounded-xl font-bold text-xs text-stone-700 bg-stone-100 hover:bg-stone-200 transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <RefreshCw className="w-4 h-4" />
                      <span>Retry Camera</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* LIVE CAMERA VIEWFINDER */
                <div className="relative w-full aspect-[3/4] max-h-[70vh] rounded-3xl overflow-hidden bg-black shadow-2xl border border-stone-800 flex items-center justify-center">
                  {/* Live Video Feed */}
                  <video
                    ref={mobileVideoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />

                  {/* Initializing Spinner */}
                  {cameraLoading && (
                    <div className="absolute inset-0 bg-stone-950/90 flex flex-col items-center justify-center space-y-3 z-30">
                      <RefreshCw className="w-8 h-8 animate-spin text-emerald-400" />
                      <p className="text-xs font-bold text-stone-300">Starting camera...</p>
                    </div>
                  )}

                  {/* Top Status Bar inside Viewfinder */}
                  <div className="absolute top-4 inset-x-4 flex items-center justify-between z-20 pointer-events-none">
                    <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-[11px] font-bold text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5 shadow-lg">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                      <span>AI Scanner Active</span>
                    </span>

                    <span className="px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-md text-[10px] font-semibold text-stone-300 border border-white/10">
                      Bedrock Vision
                    </span>
                  </div>

                  {/* Reticle / Targeting Corners */}
                  <div className="absolute top-14 left-6 w-8 h-8 border-t-3 border-l-3 border-emerald-400 rounded-tl-sm pointer-events-none z-10" />
                  <div className="absolute top-14 right-6 w-8 h-8 border-t-3 border-r-3 border-emerald-400 rounded-tr-sm pointer-events-none z-10" />
                  <div className="absolute bottom-24 left-6 w-8 h-8 border-b-3 border-l-3 border-emerald-400 rounded-bl-sm pointer-events-none z-10" />
                  <div className="absolute bottom-24 right-6 w-8 h-8 border-b-3 border-r-3 border-emerald-400 rounded-br-sm pointer-events-none z-10" />

                  {/* Animated Laser Scan Beam */}
                  <div className="absolute inset-x-8 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_#10b981] animate-bounce pointer-events-none z-10" />

                  {/* Center Guidance Hint */}
                  <div className="absolute top-1/2 -translate-y-12 inset-x-0 flex justify-center pointer-events-none z-10">
                    <span className="px-3.5 py-1 rounded-full bg-stone-950/70 backdrop-blur-md text-[11px] font-semibold text-stone-200 border border-white/10 shadow-md">
                      Frame scrap item in camera
                    </span>
                  </div>

                  {/* Bottom Controls Bar (Gallery, Capture Shutter, Flip Camera) */}
                  <div className="absolute bottom-4 inset-x-0 px-8 flex items-center justify-between z-20">
                    {/* Option: Gallery Picker */}
                    <label className="flex flex-col items-center gap-1 cursor-pointer group active:scale-95 transition-transform">
                      <div className="w-13 h-13 rounded-2xl bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/25 flex items-center justify-center text-white shadow-xl">
                        <ImageIcon className="w-6 h-6 stroke-[2]" />
                      </div>
                      <span className="text-[10px] font-bold text-white tracking-wide drop-shadow-md">
                        Gallery
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          stopCamera();
                          handleFileUpload(e);
                        }}
                        className="hidden"
                      />
                    </label>

                    {/* Button: Capture Shutter */}
                    <button
                      type="button"
                      onClick={capturePhoto}
                      disabled={cameraLoading}
                      className="relative w-20 h-20 rounded-full border-4 border-white/90 bg-white/20 backdrop-blur-xs flex items-center justify-center cursor-pointer active:scale-90 transition-transform shadow-2xl disabled:opacity-50"
                      aria-label="Capture and scan item"
                    >
                      <div className="w-15 h-15 rounded-full bg-emerald-500 hover:bg-emerald-600 transition-colors flex items-center justify-center text-white shadow-inner">
                        <Camera className="w-7 h-7 stroke-[2.2]" />
                      </div>
                    </button>

                    {/* Button: Camera Flip (Front/Back) */}
                    <button
                      type="button"
                      onClick={() => setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'))}
                      className="flex flex-col items-center gap-1 cursor-pointer group active:scale-95 transition-transform text-white"
                      aria-label="Flip Camera"
                    >
                      <div className="w-13 h-13 rounded-2xl bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/25 flex items-center justify-center shadow-xl">
                        <RefreshCw className="w-5 h-5 stroke-[2.2]" />
                      </div>
                      <span className="text-[10px] font-bold text-white tracking-wide drop-shadow-md">
                        Flip
                      </span>
                    </button>
                  </div>
                </div>
              )
            ) : (
              /* SCAN RESULT OR SCANNING STATE */
              <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-sm space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                  <span className="text-xs font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                    AI Scrap Analysis ✨
                  </span>
                  <button
                    onClick={() => {
                      setCustomImage(null);
                      setIsCameraOpen(true);
                    }}
                    className="text-xs font-bold text-stone-500 hover:text-stone-800 transition-colors cursor-pointer"
                  >
                    ← Scan Another
                  </button>
                </div>

                {isScanning ? (
                  <div className="py-12 flex flex-col items-center justify-center space-y-3">
                    <RefreshCw className="w-8 h-8 animate-spin text-emerald-600" />
                    <p className="text-xs font-bold text-stone-700">Analyzing scrap material with Bedrock AI...</p>
                  </div>
                ) : (
                  <>
                    {/* Item preview + Name */}
                    <div className="flex items-start gap-4">
                      <div className="w-24 h-24 rounded-2xl overflow-hidden bg-stone-100 shrink-0 border border-stone-200 shadow-inner">
                        <img src={customImage} alt="Scanned item" className="w-full h-full object-cover" />
                      </div>

                      <div className="flex-1 min-w-0 space-y-1">
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                          Dry Recyclable Scrap
                        </span>
                        <h3 className="text-base font-black text-stone-900 flex items-center gap-1.5 pt-1">
                          <span>{scanResult.icon}</span>
                          <span className="truncate">{scanResult.name}</span>
                        </h3>
                        <p className="text-[11px] text-stone-500 line-clamp-2">
                          {scanResult.disposalTip}
                        </p>
                      </div>
                    </div>

                    {/* Valuation Grid */}
                    <div className="grid grid-cols-2 gap-2.5">
                      <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200">
                        <p className="text-[10px] font-bold text-amber-900 uppercase">Credits Awarded</p>
                        <p className="text-base font-black text-amber-700">+{scanResult.creditsAwarded} Credits</p>
                        <p className="text-[10px] text-stone-400">{scanResult.scrapRate || '₹20 / kg'}</p>
                      </div>
                      <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200">
                        <p className="text-[10px] font-bold text-emerald-900 uppercase">CO₂ Prevented</p>
                        <p className="text-base font-black text-emerald-700">-{scanResult.co2PreventedGrams} g</p>
                        <p className="text-[10px] text-stone-400">~{scanResult.weightGrams} g weight</p>
                      </div>
                    </div>

                    {/* Handover Tip */}
                    <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200 text-xs text-stone-700 flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <p className="leading-relaxed text-[11px] font-medium">{scanResult.disposalTip}</p>
                    </div>

                    {/* Actions */}
                    <div className="space-y-2 pt-1">
                      <button
                        onClick={() => setIsScheduleModalOpen(true)}
                        className="w-full py-3.5 px-4 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-md shadow-emerald-600/25 transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-98"
                      >
                        <Calendar className="w-4 h-4" />
                        <span>Sell Item & Schedule Pickup</span>
                      </button>

                      <button
                        onClick={() => {
                          setCustomImage(null);
                          setIsCameraOpen(true);
                        }}
                        className="w-full py-2.5 px-4 rounded-xl font-bold text-xs text-stone-700 bg-stone-100 hover:bg-stone-200 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <Camera className="w-4 h-4" />
                        <span>Scan Another Scrap Item</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

      </div>
    )}

      {/* ============================================================ */}
      {/* TAB 3: NOTIFICATION (ACTIVITY FEED, PICKUPS & ALERTS)        */}
      {/* ============================================================ */}
      {activeTab === 'notification' && (
        <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
          {/* Header (Desktop only - removed on mobile phone screens) */}
          <div className="hidden md:flex items-center justify-between gap-3 pb-3 border-b border-stone-200/60">
            <h2 className="text-xl sm:text-2xl font-black text-stone-900">
              Notifications
            </h2>

            <button
              onClick={handleMarkAllRead}
              className="px-4 py-2 rounded-xl text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-all cursor-pointer"
            >
              Mark all as read
            </button>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 scrollbar-none">
            <div className="flex items-center gap-2 shrink-0">
              {['all', 'pickup', 'credits', 'community'].map((tabKey) => (
                <button
                  key={tabKey}
                  onClick={() => setNotifFilter(tabKey)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer capitalize shrink-0 ${
                    notifFilter === tabKey
                      ? 'bg-stone-900 text-white shadow-xs'
                      : 'bg-white hover:bg-stone-100 text-stone-600 border border-stone-200'
                  }`}
                >
                  {tabKey === 'all' ? 'All' : tabKey}
                </button>
              ))}
            </div>

            {/* Mobile Mark all as read */}
            {notifications.some((n) => n.unread) && (
              <button
                onClick={handleMarkAllRead}
                className="md:hidden shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-all cursor-pointer whitespace-nowrap ml-auto"
              >
                Mark read
              </button>
            )}
          </div>

          {/* Notification List */}
          <div className="space-y-3">
            {filteredNotifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => {
                  setNotifications((prev) =>
                    prev.map((n) => (n.id === notif.id ? { ...n, unread: false } : n))
                  );
                }}
                className={`p-4 sm:p-5 rounded-2xl border transition-all flex items-start gap-4 cursor-pointer ${
                  notif.unread
                    ? 'bg-white border-emerald-300 shadow-sm ring-1 ring-emerald-200/60'
                    : 'bg-white/70 border-stone-200 hover:bg-white'
                }`}
              >
                <div className="text-2xl sm:text-3xl shrink-0 p-2.5 rounded-2xl bg-stone-50 border border-stone-100">
                  {notif.icon}
                </div>

                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-sm sm:text-base font-bold text-stone-900 flex items-center gap-2">
                      <span>{notif.title}</span>
                      {notif.unread && (
                        <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
                      )}
                    </h4>
                    <span className="text-[11px] font-semibold text-stone-400 shrink-0">
                      {notif.time}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                    {notif.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 4: PROFILE (CARBON POINTS, WORK DONE & CERTIFICATES)    */}
      {/* ============================================================ */}
      {activeTab === 'profile' && (
        <div className="space-y-8 animate-fade-in">
          
          {/* Resident Identity & Wallet Card */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white border border-stone-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-5 sm:gap-6">
            <div className="flex items-center gap-4 sm:gap-5 w-full md:w-auto">
              {/* Profile Avatar on Left Side (Double-click or double-tap to edit profile) */}
              <div
                onDoubleClick={openEditModal}
                onTouchEnd={handleAvatarDoubleTap}
                className="relative group/avatar shrink-0 cursor-pointer select-none"
                title="Double-click photo to edit profile"
              >
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt={profileName}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover shadow-md border-2 border-emerald-500/40 group-hover/avatar:ring-2 group-hover/avatar:ring-emerald-500/50 group-hover/avatar:scale-[1.02] transition-all"
                  />
                ) : (
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-black text-2xl sm:text-3xl flex items-center justify-center shadow-md group-hover/avatar:ring-2 group-hover/avatar:ring-emerald-500/50 group-hover/avatar:scale-[1.02] transition-all">
                    {profileName?.[0] || 'R'}
                  </div>
                )}

                {/* Edit Indicator Badge */}
                <div 
                  onClick={(e) => {
                    e.stopPropagation();
                    openEditModal();
                  }}
                  className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-stone-900/90 text-white flex items-center justify-center border-2 border-white shadow-xs group-hover/avatar:scale-110 transition-transform cursor-pointer"
                  title="Double-click photo to edit profile"
                >
                  <Edit3 className="w-3 h-3 text-emerald-400 stroke-[2.5]" />
                </div>
              </div>

              {/* User Name & Bio beside Profile Image */}
              <div className="space-y-1 sm:space-y-1.5 flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-xl sm:text-2xl font-black text-stone-900 truncate">
                    {profileName}
                  </h3>
                </div>

                {/* Profile Bio Section */}
                <p className="text-xs text-stone-600 leading-relaxed max-w-lg font-medium line-clamp-2 sm:line-clamp-none">
                  {profileBio || 'Eco-conscious citizen driving zero-waste living and source segregation 🌱'}
                </p>
              </div>
            </div>

            {/* Credits Section */}
            <div className="w-full md:w-auto p-4 rounded-2xl bg-amber-50/80 border border-amber-200 shrink-0">
              <p className="text-[11px] font-bold text-amber-900 uppercase tracking-wider">Eco-Credits Balance</p>
              <p className="text-2xl font-black text-amber-700">{walletBalance} Credits</p>
            </div>
          </div>

          {/* Section 3A: Carbon Emission Points & Impact */}
          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-wider text-stone-500">
              Carbon Emission Points & Ecological Impact
            </h3>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-2xs space-y-1.5">
                <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">CO₂ Prevented</span>
                <p className="text-2xl sm:text-3xl font-black text-emerald-600">
                  {co2Kg} <span className="text-sm font-bold text-stone-500">kg</span>
                </p>
                <p className="text-[11px] text-stone-500">From landfill greenhouse emissions</p>
              </div>

              <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-2xs space-y-1.5">
                <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">Landfill Diverted</span>
                <p className="text-2xl sm:text-3xl font-black text-teal-600">
                  {landfillKg} <span className="text-sm font-bold text-stone-500">kg</span>
                </p>
                <p className="text-[11px] text-stone-500">Clean circular raw material</p>
              </div>

              <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-2xs space-y-1.5">
                <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">Tree Equivalent</span>
                <p className="text-2xl sm:text-3xl font-black text-amber-600">
                  {treesEq} <span className="text-sm font-bold text-stone-500">Tree-Yrs</span>
                </p>
                <p className="text-[11px] text-stone-500">Equivalent atmospheric cleaning</p>
              </div>

              <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-2xs space-y-1.5">
                <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">Society Rank</span>
                <p className="text-2xl sm:text-3xl font-black text-stone-900">
                  #4 <span className="text-sm font-bold text-stone-500">in Society</span>
                </p>
                <p className="text-[11px] text-stone-500">98.4% Zero-contamination score</p>
              </div>
            </div>
          </div>

          {/* ============================================================ */}
          {/* INSTAGRAM-STYLE PROFILE SUB-TABS: ACTIVITY & CERTIFICATE     */}
          {/* ============================================================ */}
          <div className="border-t border-stone-200 mt-6 pt-0">
            <div className="flex items-center justify-center gap-10 sm:gap-14">
              {/* Tab 1: Activity (Grid Icon matching user's image) */}
              <button
                type="button"
                onClick={() => setProfileSubTab('activity')}
                className={`flex items-center gap-2 py-3 px-3 text-xs uppercase tracking-widest font-black transition-all cursor-pointer border-t-2 -mt-px ${
                  profileSubTab === 'activity'
                    ? 'border-stone-900 text-stone-900'
                    : 'border-transparent text-stone-400 hover:text-stone-700'
                }`}
              >
                <Grid3X3 className="w-4 h-4 stroke-[2.2]" />
                <span>Activity</span>
              </button>

              {/* Tab 2: Certificate (Medal Icon) */}
              <button
                type="button"
                onClick={() => setProfileSubTab('certificate')}
                className={`flex items-center gap-2 py-3 px-3 text-xs uppercase tracking-widest font-black transition-all cursor-pointer border-t-2 -mt-px ${
                  profileSubTab === 'certificate'
                    ? 'border-stone-900 text-stone-900'
                    : 'border-transparent text-stone-400 hover:text-stone-700'
                }`}
              >
                <Medal className="w-4 h-4 stroke-[2.2]" />
                <span>Certificate</span>
              </button>
            </div>
          </div>

          {/* ============================================================ */}
          {/* SUB-TAB 1: ACTIVITY (User Actions & Civic Milestones)        */}
          {/* ============================================================ */}
          {profileSubTab === 'activity' && (
            <div className="space-y-8 animate-fade-in">
              {/* User Activities Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black uppercase tracking-wider text-stone-500">
                    Your Waste Segregation & Circular Activities ({userPickupActivities.length})
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {userPickupActivities.map((act) => {
                    const isCheered = !!cheeredMap[act.id];
                    const cheerCount = act.cheers + (isCheered ? 1 : 0);

                    return (
                      <div
                        key={act.id}
                        className="bg-white rounded-3xl border border-emerald-300 ring-1 ring-emerald-200/60 p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                      >
                        <div className="space-y-3">
                          {/* User Header */}
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3 min-w-0">
                              {act.userAvatar ? (
                                <img
                                  src={act.userAvatar}
                                  alt={act.userName}
                                  className="w-10 h-10 rounded-2xl object-cover border border-stone-200 shrink-0"
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-black text-sm flex items-center justify-center shrink-0">
                                  {act.userName?.[0] || 'U'}
                                </div>
                              )}
                              <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  <p className="text-sm font-bold text-stone-900 truncate">{act.userName}</p>
                                  <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 shrink-0">
                                    Your Activity
                                  </span>
                                </div>
                                <p className="text-[11px] text-stone-500 truncate">{act.userLocation} • {act.timeAgo}</p>
                              </div>
                            </div>

                            <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-stone-100 text-stone-700 border border-stone-200 shrink-0">
                              {act.category}
                            </span>
                          </div>

                          {/* Action Headline */}
                          <h3 className="text-sm font-black text-stone-900 leading-snug">
                            {act.actionTitle}
                          </h3>

                          {/* User Notes */}
                          {act.notes && (
                            <p className="text-xs text-stone-600 leading-relaxed bg-stone-50/70 p-3 rounded-2xl border border-stone-100">
                              "{act.notes}"
                            </p>
                          )}

                          {/* Action Image Thumbnail */}
                          {act.image && (
                            <div className="h-44 rounded-2xl overflow-hidden bg-stone-100 border border-stone-100">
                              <img
                                src={act.image}
                                alt={act.actionTitle}
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                              />
                            </div>
                          )}

                          {/* Impact Metrics Pill Row */}
                          <div className="flex flex-wrap items-center gap-2 pt-1">
                            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                              🌱 {act.impactStat}
                            </span>
                            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                              🪙 +{act.creditsEarned} Credits
                            </span>
                            <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                              act.status === 'COMPLETED' || act.verified
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}>
                              {act.status === 'COMPLETED' || act.verified ? 'Verified ✅' : 'Scheduled 🚚'}
                            </span>
                          </div>

                          {/* Interactive Handover for Scheduled User Pickups */}
                          {act.rawPickup && act.status !== 'COMPLETED' && (
                            <div className="pt-2">
                              <button
                                type="button"
                                onClick={() => handleCompletePickupTrigger(act.pickupId, act.creditsEarned, act.rawPickup.co2Grams)}
                                className="w-full py-2.5 px-3 rounded-xl text-xs font-black text-white bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs active:scale-98"
                              >
                                <ShieldCheck className="w-4 h-4" />
                                Simulate Handover & Claim +{act.creditsEarned} Credits
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Card Footer: Cheer Button */}
                        <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                          <button
                            type="button"
                            onClick={() => handleToggleCheer(act.id)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                              isCheered
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 scale-105'
                                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                            }`}
                          >
                            <span>👏</span>
                            <span>{cheerCount} {cheerCount === 1 ? 'Cheer' : 'Cheers'}</span>
                          </button>

                          <span className="text-[11px] font-medium text-stone-400">
                            Your Doorstep Action
                          </span>
                        </div>
                      </div>
                    );
                  })}

                  {userPickupActivities.length === 0 && (
                    <div className="col-span-full p-10 text-center bg-white rounded-3xl border border-stone-200 space-y-2">
                      <div className="text-3xl">📦</div>
                      <h4 className="text-sm font-bold text-stone-800">No activities recorded yet</h4>
                      <p className="text-xs text-stone-500">
                        Scan and sell recyclable waste in the Upload tab to showcase your eco-contributions here!
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Civic Milestone Badges */}
              <div className="space-y-3 pt-2">
                <h3 className="text-sm font-black uppercase tracking-wider text-stone-500">
                  Civic Milestone Badges
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="p-4 rounded-3xl bg-white border border-stone-200 shadow-2xs text-center flex flex-col items-center justify-between min-h-[140px] space-y-2">
                    <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100/60">
                      <Award className="w-5 h-5 stroke-[2.2]" />
                    </div>
                    <h4 className="text-xs font-bold text-stone-900 leading-tight">Segregation Champion</h4>
                    <span className="inline-block text-[9px] font-black px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      Unlocked
                    </span>
                  </div>

                  <div className="p-4 rounded-3xl bg-white border border-stone-200 shadow-2xs text-center flex flex-col items-center justify-between min-h-[140px] space-y-2">
                    <div className="w-11 h-11 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center border border-teal-100/60">
                      <Leaf className="w-5 h-5 stroke-[2.2]" />
                    </div>
                    <h4 className="text-xs font-bold text-stone-900 leading-tight">Methane Neutralizer</h4>
                    <span className="inline-block text-[9px] font-black px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      Unlocked
                    </span>
                  </div>

                  <div className="p-4 rounded-3xl bg-white border border-stone-200 shadow-2xs text-center flex flex-col items-center justify-between min-h-[140px] space-y-2">
                    <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100/60">
                      <Zap className="w-5 h-5 stroke-[2.2]" />
                    </div>
                    <h4 className="text-xs font-bold text-stone-900 leading-tight">E-Waste Guardian</h4>
                    <span className="inline-block text-[9px] font-black px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      Unlocked
                    </span>
                  </div>

                  <div className="p-4 rounded-3xl bg-white border border-stone-200 shadow-2xs text-center flex flex-col items-center justify-between min-h-[140px] space-y-2">
                    <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center border border-amber-100/60">
                      <Trophy className="w-5 h-5 stroke-[2.2]" />
                    </div>
                    <h4 className="text-xs font-bold text-stone-900 leading-tight">Top 5% Recycler</h4>
                    <span className="inline-block text-[9px] font-black px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      Unlocked
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* SUB-TAB 2: CERTIFICATE (Official Commendation Document)     */}
          {/* ============================================================ */}
          {profileSubTab === 'certificate' && (
            <div className="space-y-6 animate-fade-in">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black uppercase tracking-wider text-stone-500">
                    Official IndoHood Green Citizen Certificate
                  </h3>
                  <button
                    onClick={() => window.print()}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-stone-700 bg-stone-100 hover:bg-stone-200 transition-all cursor-pointer border border-stone-200"
                  >
                    Print / Save PDF
                  </button>
                </div>

                {/* Framed Certificate Document */}
                <div className="relative rounded-3xl bg-gradient-to-b from-amber-50/50 via-white to-amber-50/30 border-4 border-amber-300/80 p-6 sm:p-10 shadow-lg text-center overflow-hidden">
                  {/* Ornamental corner corners */}
                  <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-amber-500"></div>
                  <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-amber-500"></div>
                  <div className="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 border-amber-500"></div>
                  <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-amber-500"></div>

                  <div className="max-w-2xl mx-auto space-y-4">
                    <div className="flex items-center justify-center">
                      <span className="text-xs font-extrabold tracking-widest uppercase text-emerald-800">
                        IndoHood Circular Waste Mission
                      </span>
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight font-serif">
                      Certificate of Green Citizenship
                    </h3>

                    <p className="text-xs uppercase tracking-widest text-stone-400 font-bold">
                      Awarded for Source Segregation & Carbon Abatement
                    </p>

                    <div className="py-2">
                      <p className="text-xs text-stone-500">This is to proudly certify that</p>
                      <p className="text-2xl sm:text-3xl font-black text-emerald-800 underline decoration-amber-400 decoration-2 underline-offset-8 mt-1">
                        {profileName}
                      </p>
                      <p className="text-xs text-stone-500 mt-2">
                        Resident of {user?.address || 'Flat 402, Green Valley Apartments, New Delhi'}
                      </p>
                    </div>

                    <p className="text-xs sm:text-sm text-stone-700 leading-relaxed max-w-xl mx-auto">
                      Has demonstrated exceptional civic responsibility by separating dry and organic waste at source, preventing an estimated <strong className="text-emerald-700">{co2Kg} kg of CO₂</strong> emissions and diverting <strong className="text-teal-700">{landfillKg} kg of recyclable commodities</strong> from municipal landfills.
                    </p>

                    <div className="pt-4 border-t border-amber-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
                      <div className="text-left">
                        <p className="font-bold text-stone-800">Certificate ID: #IND-CERT-{Math.floor(100000 + Math.random() * 900000)}</p>
                        <p className="text-[11px]">Valid across municipal civic authorities</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="w-10 h-10 rounded-full bg-emerald-600 text-white font-black text-xs flex items-center justify-center shadow-xs">
                          SEAL
                        </span>
                        <div className="text-left">
                          <p className="font-bold text-stone-800">Verified by IndoHood</p>
                          <p className="text-[11px]">Date: {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      )}

      {/* ============================================================ */}
      {/* DIY STEP-BY-STEP RECIPE MODAL                                */}
      {/* ============================================================ */}
      {activeDiyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden max-h-[90vh] flex flex-col">
            <div className="bg-gradient-to-r from-emerald-800 to-teal-800 px-6 py-5 text-white relative">
              <button
                onClick={() => setActiveDiyModal(null)}
                className="absolute top-5 right-5 p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-5 h-5 text-amber-300" />
                <h3 className="text-lg font-black tracking-tight">{activeDiyModal.title}</h3>
              </div>
              <p className="text-xs text-emerald-200">Time: {activeDiyModal.time} • Difficulty: {activeDiyModal.difficulty}</p>
            </div>

            <div className="p-6 space-y-5 overflow-y-auto">
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 leading-relaxed">
                <strong>Environmental Benefit:</strong> {activeDiyModal.benefit}
              </div>

              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-stone-700 mb-2">
                  Materials Required from Home:
                </h4>
                <ul className="space-y-1.5 text-xs text-stone-700">
                  {activeDiyModal.materials.map((mat, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0"></span>
                      <span>{mat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-stone-700 mb-2">
                  Step-by-Step Instructions:
                </h4>
                <ol className="space-y-2.5 text-xs text-stone-700">
                  {activeDiyModal.steps.map((st, i) => (
                    <li key={i} className="flex items-start gap-2.5 p-2 rounded-xl bg-stone-50 border border-stone-100">
                      <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-black text-[10px] flex items-center justify-center shrink-0">
                        {i + 1}
                      </span>
                      <span className="leading-relaxed">{st}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <button
                onClick={() => setActiveDiyModal(null)}
                className="w-full py-3 rounded-xl font-bold text-xs text-white bg-emerald-700 hover:bg-emerald-800 transition-all cursor-pointer"
              >
                Close Guide
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* SCHEDULE PICKUP & SELL MODAL                                 */}
      {/* ============================================================ */}
      {isScheduleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden">
            <div className="bg-gradient-to-r from-teal-700 to-emerald-700 px-6 py-5 text-white relative">
              <button
                onClick={() => setIsScheduleModalOpen(false)}
                className="absolute top-5 right-5 p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="w-5 h-5 text-teal-300" />
                <h3 className="text-xl font-black tracking-tight">Schedule Doorstep Scrap Handover</h3>
              </div>
              <p className="text-xs text-teal-100">Item: {scanResult.name} • Reward: +{scanResult.creditsAwarded} Eco-Credits</p>
            </div>

            <form onSubmit={handleConfirmPickupBooking} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Pickup Date *</label>
                <input
                  type="date"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm font-semibold text-stone-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Preferred Time Slot *</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setTimeSlot('Morning (9:00 AM - 12:00 PM)')}
                    className={`p-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      timeSlot.includes('Morning')
                        ? 'bg-teal-50 border-teal-500 text-teal-900 ring-1 ring-teal-200'
                        : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    🌅 Morning (9-12)
                  </button>
                  <button
                    type="button"
                    onClick={() => setTimeSlot('Afternoon (2:00 PM - 5:00 PM)')}
                    className={`p-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      timeSlot.includes('Afternoon')
                        ? 'bg-teal-50 border-teal-500 text-teal-900 ring-1 ring-teal-200'
                        : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    ☀️ Afternoon (2-5)
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Pickup Address *</label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Note for Eco-Picker Raju</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-stone-200 text-xs text-stone-700"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-4 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-98"
              >
                <Truck className="w-4 h-4" />
                Confirm Doorstep Sale & Handover
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* EDIT PROFILE MODAL (Upload Picture, Bio, Display Name)       */}
      {/* ============================================================ */}
      {isEditProfileModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col p-6 sm:p-7 space-y-5">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div>
                <h3 className="text-lg font-black text-stone-900 flex items-center gap-2">
                  <Edit3 className="w-5 h-5 text-emerald-600" />
                  <span>Edit Profile</span>
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Personalize your avatar image, sustainability bio, and name.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsEditProfileModalOpen(false)}
                className="p-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-600 hover:text-stone-900 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              {/* Profile Photo Uploader */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-2">
                  Profile Photo
                </label>
                <div className="flex items-center gap-4">
                  {/* Photo Preview */}
                  <div className="w-20 h-20 rounded-2xl overflow-hidden bg-stone-100 border-2 border-dashed border-stone-300 flex items-center justify-center shrink-0 shadow-inner">
                    {avatarPreview ? (
                      <img
                        src={avatarPreview}
                        alt="Avatar preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-black text-2xl flex items-center justify-center">
                        {tempName?.[0] || 'R'}
                      </div>
                    )}
                  </div>

                  {/* Upload and Remove Buttons */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <label className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center cursor-pointer shadow-xs transition-all active:scale-95">
                        <span>Upload Photo</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarFile}
                          className="hidden"
                        />
                      </label>

                      {avatarPreview && (
                        <button
                          type="button"
                          onClick={() => setAvatarPreview(null)}
                          className="px-3 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-600 font-bold text-xs transition-all cursor-pointer"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    <p className="text-[11px] text-stone-400">
                      JPG, PNG or WEBP (Max 5MB)
                    </p>
                  </div>
                </div>
              </div>

              {/* Display Name Input */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  placeholder="Your Name"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 text-sm font-semibold text-stone-900 bg-white"
                  required
                />
              </div>

              {/* Bio Textarea */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-stone-700">
                    Sustainability Bio
                  </label>
                  <span className="text-[10px] text-stone-400 font-medium">
                    {tempBio.length}/160
                  </span>
                </div>
                <textarea
                  rows={3}
                  maxLength={160}
                  value={tempBio}
                  onChange={(e) => setTempBio(e.target.value)}
                  placeholder="Share a short bio about your segregation habits, composting, or green goals..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 text-xs font-medium text-stone-800 bg-white leading-relaxed resize-none"
                />

                {/* Quick Bio Suggestion Chips */}
                <div className="pt-2">
                  <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1.5">
                    Quick suggestions:
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      'Zero-waste balcony composter',
                      'Dedicated dry scrap recycler',
                      'Clean neighborhood advocate',
                      'Terrace gardener & organic lover',
                    ].map((suggestion, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setTempBio(suggestion)}
                        className="text-[11px] px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-emerald-50 hover:text-emerald-800 text-stone-700 border border-stone-200 transition-colors cursor-pointer text-left"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 flex items-center justify-end gap-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsEditProfileModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-md shadow-emerald-600/20 transition-all cursor-pointer flex items-center justify-center active:scale-95"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      </main>

    </div>
  );
}

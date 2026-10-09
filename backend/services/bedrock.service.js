import { BedrockRuntimeClient, ConverseCommand } from '@aws-sdk/client-bedrock-runtime';
import { calculateDynamicCredits, normalizeCategory, matchMaterialKey } from './scrap-market.service.js';

// Fallback baseline items adhering strictly to Indian 3-stream segregation
const FALLBACK_TAXONOMY = [
  {
    keywords: ['peel', 'vegetable', 'fruit', 'kitchen', 'food', 'banana', 'organic', 'wet', 'compost', 'leaf', 'flower', 'tea', 'egg'],
    name: 'Kitchen Vegetable & Fruit Peels',
    icon: '🍌',
    category: 'Degradable',
    categoryLabel: 'Degradable',
    binColor: 'emerald',
    binName: 'Green Bin (Degradable)',
    defaultWeightGrams: 250,
    disposalTip: '100% biodegradable wet organics under SWM Rules 2016. Decomposes naturally into rich soil compost.'
  },
  {
    keywords: ['cardboard', 'box', 'carton', 'paper', 'package', 'amazon', 'pulp', 'raddi'],
    name: 'Biodegradable Cardboard & Pulp Box',
    icon: '📦',
    category: 'Degradable',
    categoryLabel: 'Degradable',
    binColor: 'emerald',
    binName: 'Green Bin (Degradable)',
    defaultWeightGrams: 300,
    disposalTip: 'Biodegradable paper and cardboard pulp. Keep dry for natural composting or circular pulp processing.'
  },
  {
    keywords: ['bottle', 'pet', 'plastic', 'jar', 'container', 'wrapper', 'polythene'],
    name: 'Plastic PET Bottles & Recyclables',
    icon: '🥤',
    category: 'Non-Degradable',
    categoryLabel: 'Non-Degradable',
    binColor: 'blue',
    binName: 'Blue Bin (Non-Degradable)',
    defaultWeightGrams: 40,
    disposalTip: 'Non-biodegradable synthetic polymers under Plastic Waste Rules 2022. Collect clean and dry for circular recycling.'
  },
  {
    keywords: ['cable', 'wire', 'charger', 'usb', 'electronic', 'cord', 'copper', 'e-waste'],
    name: 'Discarded Charger & Copper Wires',
    icon: '🔌',
    category: 'Non-Degradable',
    categoryLabel: 'Non-Degradable',
    binColor: 'blue',
    binName: 'Blue Bin (Non-Degradable)',
    defaultWeightGrams: 90,
    disposalTip: 'High-value non-biodegradable e-waste conductors under E-Waste Rules 2022. Keep dry for certified metallic recovery.'
  },
  {
    keywords: ['can', 'tin', 'aluminum', 'soda', 'beverage', 'beer', 'metal', 'loha', 'iron'],
    name: 'Aluminium Beverage Can & Scrap Metals',
    icon: '🥫',
    category: 'Non-Degradable',
    categoryLabel: 'Non-Degradable',
    binColor: 'blue',
    binName: 'Blue Bin (Non-Degradable)',
    defaultWeightGrams: 50,
    disposalTip: 'Non-biodegradable metal alloy. Rinse residue and crush flat for clean circular metal recovery.'
  },
  {
    keywords: ['medical', 'medicine', 'tablet', 'blister', 'syrup', 'strip', 'pharma', 'drug', 'bandage', 'pill', 'syringe'],
    name: 'Medical Blister Packs & Expired Medicine',
    icon: '💊',
    category: 'Mix',
    categoryLabel: 'Mix',
    binColor: 'rose',
    binName: 'Red/Black Bin (Mix)',
    defaultWeightGrams: 35,
    disposalTip: 'Cannot degrade and cannot be recycled. Hazardous pharmaceutical waste routed to municipal high-temperature incineration.'
  },
  {
    keywords: ['sanitary', 'napkin', 'pad', 'diaper', 'hygiene', 'hazard', 'biohazard', 'soiled'],
    name: 'Sanitary Napkins & Biohazard Refuse',
    icon: '🩹',
    category: 'Mix',
    categoryLabel: 'Mix',
    binColor: 'rose',
    binName: 'Red/Black Bin (Mix)',
    defaultWeightGrams: 60,
    disposalTip: 'Non-degradable biohazard sanitary waste. Under Bio-Medical Waste Rules, wrap securely in marked newspaper with a red cross.'
  }
];

/**
 * Classifies an uploaded or camera-captured waste image.
 * Uses Amazon Bedrock Multimodal Vision when configured, with a smart statutory fallback.
 */
export async function classifyWasteImage({ imageBase64, itemHint }) {
  const region = process.env.AWS_REGION || 'us-east-1';
  const modelId = process.env.BEDROCK_MODEL_ID || 'anthropic.claude-3-5-sonnet-20241022-v2:0';

  if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY && imageBase64) {
    try {
      const client = new BedrockRuntimeClient({ region });
      const prompt = `You are IndoHood AI, an expert municipal waste segregation engine in India, strictly grounded in:
1. Solid Waste Management Rules, 2016 (MoEFCC)
2. Plastic Waste Management Rules, 2016 & 2022
3. E-Waste (Management) Rules, 2022
4. Bio-Medical Waste Management Rules, 2016

CRITICAL STATUTORY CATEGORY MANDATE:
Our platform classifies all items into ONLY 3 categories with strictly these exact words:
1. "Degradable": All biodegradable wet organics and natural fibers (kitchen vegetable/fruit peels, leftover food, tea grounds, garden leaves, compostable paper/cardboard pulp).
2. "Non-Degradable": All non-biodegradable recyclable items (plastics, PET bottles, scrap metals, aluminium cans, copper wiring, e-waste, chargers, glass).
3. "Mix": All items that CANNOT degrade and CANNOT be recycled, classified as hazardous or sanitary waste (medical blister packs, expired tablets/medicines, sanitary napkins, diapers, biohazard soiled waste).

NO OTHER CATEGORY NAMES ARE PERMITTED.

CRITICAL WEIGHT ESTIMATION & CREDIT INTEGRITY:
To prevent users from gaming the platform by breaking items into smaller pieces:
- Estimate the realistic visual weight of the item in grams (weightGrams). For example: an empty 500ml PET bottle is ~20g; a 1L bottle is ~35g; a small cardboard box is ~150g; 1kg carton is ~1000g; a tablet strip is ~30g.
- Do NOT output any raw scrap rupee prices or currency in your response.

Respond with valid JSON only in this exact structure:
{
  "name": "Specific Item Name",
  "icon": "Relevant single emoji",
  "category": "Degradable" or "Non-Degradable" or "Mix",
  "categoryLabel": "Degradable" or "Non-Degradable" or "Mix",
  "binColor": "emerald" (for Degradable) or "blue" (for Non-Degradable) or "rose" (for Mix),
  "binName": "Green Bin (Degradable)" or "Blue Bin (Non-Degradable)" or "Red/Black Bin (Mix)",
  "weightGrams": estimated weight in grams as a number,
  "disposalTip": "Actionable segregation advice referencing India's waste management rules"
}`;

      // Clean base64 string
      const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');
      const imageBytes = Uint8Array.from(atob(cleanBase64), c => c.charCodeAt(0));

      const command = new ConverseCommand({
        modelId,
        messages: [
          {
            role: 'user',
            content: [
              {
                image: {
                  format: 'jpeg',
                  source: { bytes: imageBytes }
                }
              },
              { text: prompt }
            ]
          }
        ]
      });

      const response = await client.send(command);
      const textOutput = response.output?.message?.content?.[0]?.text;
      if (textOutput) {
        const jsonMatch = textOutput.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          const normCategory = normalizeCategory(parsed.category);
          parsed.category = normCategory;
          parsed.categoryLabel = normCategory;

          // Assign correct bin styling
          if (normCategory === 'Degradable') {
            parsed.binColor = 'emerald';
            parsed.binName = 'Green Bin (Degradable)';
          } else if (normCategory === 'Mix') {
            parsed.binColor = 'rose';
            parsed.binName = 'Red/Black Bin (Mix)';
          } else {
            parsed.binColor = 'blue';
            parsed.binName = 'Blue Bin (Non-Degradable)';
          }

          const weightGrams = typeof parsed.weightGrams === 'number' && parsed.weightGrams > 0 
            ? parsed.weightGrams 
            : 80;

          // Compute dynamic credits and CO2 based on Indian scrap benchmarks
          const valuation = await calculateDynamicCredits({
            category: normCategory,
            itemName: parsed.name || normCategory,
            weightGrams,
          });

          parsed.weightGrams = valuation.weightGrams;
          parsed.creditsAwarded = valuation.creditsAwarded;
          parsed.co2PreventedGrams = valuation.co2PreventedGrams;

          return parsed;
        }
      }
    } catch (err) {
      console.warn('[Bedrock Service] Remote model call fallback triggered:', err.message);
    }
  }

  // Resilient Local Statutory Fallback Engine
  const hintLower = (itemHint || '').toLowerCase();
  let matchedItem = FALLBACK_TAXONOMY[2]; // Default: Non-Degradable plastic

  for (const item of FALLBACK_TAXONOMY) {
    if (item.keywords.some(kw => hintLower.includes(kw))) {
      matchedItem = item;
      break;
    }
  }

  // Parse any weight hint from filename (e.g. "500g", "1kg", "200g")
  let estimatedWeight = matchedItem.defaultWeightGrams;
  const weightMatch = hintLower.match(/(\d+)\s*(kg|g)/);
  if (weightMatch) {
    const val = parseInt(weightMatch[1], 10);
    estimatedWeight = weightMatch[2] === 'kg' ? val * 1000 : val;
  }

  const valuation = await calculateDynamicCredits({
    category: matchedItem.category,
    itemName: matchedItem.name,
    weightGrams: estimatedWeight,
  });

  return {
    name: matchedItem.name,
    icon: matchedItem.icon,
    category: matchedItem.category,
    categoryLabel: matchedItem.categoryLabel,
    binColor: matchedItem.binColor,
    binName: matchedItem.binName,
    weightGrams: valuation.weightGrams,
    creditsAwarded: valuation.creditsAwarded,
    co2PreventedGrams: valuation.co2PreventedGrams,
    disposalTip: matchedItem.disposalTip,
  };
}

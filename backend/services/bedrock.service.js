import { BedrockRuntimeClient, ConverseCommand } from '@aws-sdk/client-bedrock-runtime';

const FALLBACK_TAXONOMY = [
  {
    keywords: ['bottle', 'pet', 'plastic', 'jar', 'container'],
    name: 'Plastic PET Bottles & Recyclables',
    icon: '🥤',
    category: 'non-degradable',
    categoryLabel: 'Non-Degradable (Recyclable)',
    scrapRate: '₹18 / kg (35 Credits)',
    binColor: 'blue',
    binName: 'Blue Dry Recyclables Bin',
    creditsAwarded: 25,
    co2PreventedGrams: 85,
    weightGrams: 40,
    disposalTip: 'Empty residual liquid, crush bottle flat to save collection space, and keep caps together.'
  },
  {
    keywords: ['cardboard', 'box', 'carton', 'paper', 'package', 'amazon'],
    name: 'Delivery Cardboard Box & Paper Pulp',
    icon: '📦',
    category: 'degradable',
    categoryLabel: 'Degradable (Paper Pulp)',
    scrapRate: '₹14 / kg (28 Credits)',
    binColor: 'blue',
    binName: 'Blue / Dry Paper Pulp Stream',
    creditsAwarded: 20,
    co2PreventedGrams: 110,
    weightGrams: 180,
    disposalTip: 'Peel off synthetic plastic tape, flatten the box flat, and bundle with jute cord.'
  },
  {
    keywords: ['cable', 'wire', 'charger', 'usb', 'electronic', 'cord', 'copper'],
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
    disposalTip: 'High-purity copper conductors inside! Keep dry and separate for certified smelting recovery.'
  },
  {
    keywords: ['can', 'tin', 'aluminum', 'soda', 'beverage', 'beer'],
    name: 'Aluminium Beverage Can',
    icon: '🥫',
    category: 'non-degradable',
    categoryLabel: 'Non-Degradable (Metal Scrap)',
    scrapRate: '₹95 / kg (190 Credits)',
    binColor: 'blue',
    binName: 'Blue Dry Recyclables Bin',
    creditsAwarded: 30,
    co2PreventedGrams: 410,
    weightGrams: 15,
    disposalTip: 'Rinse sweet liquid residue, crush cylindrical body flat, and preserve tab ring.'
  },
  {
    keywords: ['food', 'peel', 'vegetable', 'fruit', 'kitchen', 'waste', 'banana'],
    name: 'Kitchen Vegetable & Fruit Peels',
    icon: '🍌',
    category: 'degradable',
    categoryLabel: 'Degradable (Organic Compostable)',
    scrapRate: '₹0 (100% Soil Compost Value)',
    binColor: 'green',
    binName: 'Green Wet Organics Bin',
    creditsAwarded: 15,
    co2PreventedGrams: 125,
    weightGrams: 250,
    disposalTip: 'Do not mix with plastic wrappers! Add to balcony planter or community aerobic compost pit.'
  }
];

export async function classifyWasteImage({ imageBase64, itemHint }) {
  const region = process.env.AWS_REGION || 'us-east-1';
  const modelId = process.env.BEDROCK_MODEL_ID || 'anthropic.claude-3-5-sonnet-20241022-v2:0';

  if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY && imageBase64) {
    try {
      const client = new BedrockRuntimeClient({ region });
      const prompt = `You are IndoHood AI, an expert municipal waste segregation engine in India.
Analyze this item and respond with valid JSON only in this exact structure:
{
  "name": "Item Name",
  "icon": "Emoji",
  "category": "degradable" or "non-degradable" or "landfill",
  "categoryLabel": "String category label",
  "scrapRate": "e.g. ₹18 / kg",
  "binColor": "green" or "blue" or "black",
  "binName": "e.g. Blue Dry Recyclables Bin",
  "creditsAwarded": number between 15 and 40,
  "co2PreventedGrams": number between 50 and 500,
  "weightGrams": estimated weight in grams,
  "disposalTip": "Actionable segregation advice"
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
          return JSON.parse(jsonMatch[0]);
        }
      }
    } catch (err) {
      console.warn('[Bedrock Service] Remote model call fallback triggered:', err.message);
    }
  }

  // Resilient Local Semantic Fallback
  const hintLower = (itemHint || '').toLowerCase();
  for (const item of FALLBACK_TAXONOMY) {
    if (item.keywords.some(kw => hintLower.includes(kw))) {
      return item;
    }
  }

  return FALLBACK_TAXONOMY[0];
}

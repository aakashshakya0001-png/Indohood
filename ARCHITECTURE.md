# Indohood (इण्डोहूड) — System Architecture 🏛️

**Indohood** is an AI-powered household waste segregation and civic green-credits ecosystem designed for **Track 03 (Waste & Energy)** of the **WeMakeDevs & AWS Environmental Hacks**.

---

## 1. High-Level System Architecture

```mermaid
graph TB
    subgraph ClientLayer ["Client Layer (Web & Mobile Browser)"]
        UI["Indohood Web App\n(React + Vite + Tailwind CSS)"]
        Cam["Live Camera / File Upload\n+ Instant Quick-Test Demo Items"]
        WalletUI["Eco-Credits Wallet\n& Transaction Ledger"]
        StoreUI["Indohood Green Store\n(Free Items + Co-Pay Discounts)"]
    end

    subgraph APILayer ["Application & API Layer (Node.js / Express)"]
        Router["Express API Gateway"]
        ClassifyEp["/api/ai/classify-waste"]
        WalletEp["/api/wallet"]
        StoreEp["/api/store"]
        FallbackEngine["Resilient Offline Mock/Cache Engine\n(Zero-Failure Demo Guarantee)"]
    end

    subgraph AWSLayer ["AWS Cloud & AI Services"]
        Bedrock["Amazon Bedrock\n(Multimodal Vision: Claude 3.5 Sonnet / Amazon Nova Pro)"]
        S3["Amazon S3\n(Waste Evidence & Audit Storage)"]
        IAM["AWS IAM\n(Least-Privilege hackathon-dev Role)"]
        Amplify["AWS Amplify / App Runner\n(Fullstack Hosting & CDN)"]
    end

    %% Flow connections
    Cam -->|1. Base64 / Image Data| UI
    UI -->|2. POST /api/ai/classify-waste| Router
    Router --> ClassifyEp
    ClassifyEp -->|3. InvokeModel / Converse API| Bedrock
    ClassifyEp -.->|Fallback on timeout/error| FallbackEngine
    Bedrock -->|4. JSON Classification + Guidance + Impact| ClassifyEp
    ClassifyEp -->|5. Result + Eco-Credits Awarded| UI
    UI -->|6. Sync Ledger| WalletEp
    WalletEp --> WalletUI
    WalletUI -->|7. Spend Credits| StoreEp
    StoreEp --> StoreUI
    StoreUI -->|8. Generate Voucher / Slip| UI
```

---

## 2. Waste Classification Streams & Credit Economics

Indohood categorizes every scanned item into **3 strictly separated streams**:

```mermaid
flowchart LR
    A[Scanned Item] --> B{AI Vision Engine}
    B -->|Kitchen peels, food scraps, paper, cardboard| C[🟢 Degradable\nGreen Bin\n+10 to +15 Credits]
    B -->|Plastics, e-waste, glass, metal, textiles| D[🔵 Non-Degradable\nBlue Bin\n+15 to +30 Credits]
    B -->|Used tissues, sanitary pads, expired pills| E[🔴 Landfill-Only\nBlack/Red Bin\n+5 Credits]

    C --> F[Composted / Recycled into Pulp]
    D --> G[Authorized Scrap Recyclers]
    E --> H[Scientific Landfill / Incineration]

    C & D & E --> I[🪙 Indohood Wallet]
    I --> J[🛒 Spend in Green Store]
```

### Stream Details:
1. 🟢 **Degradable (Green Bin)**:
   - *Items*: Kitchen waste, vegetable peels, leftover food, paper bags, cardboard, tea leaves, fallen leaves.
   - *Impact*: Diverted from methane-producing landfills to aerobic compost or paper recycling.
   - *Reward*: **+10 to +15 Eco-Credits**
2. 🔵 **Non-Degradable (Blue Bin)**:
   - *Items*: Single-use plastic bottles, milk pouches, glass bottles, aluminum cans, cables, discarded electronics, worn fabrics.
   - *Impact*: Diverted to circular material recycling streams.
   - *Reward*: **+15 to +30 Eco-Credits** (higher incentive for high-durability pollutants like e-waste & plastic).
3. 🔴 **Mixed / Landfill-Only (Red/Black Bin)**:
   - *Items*: Expired medicines (blister packs), sanitary napkins, used tissues, multi-layer laminated chip packets that cannot be separated.
   - *Impact*: Prevented from contaminating organic compost; marked for safe incineration or controlled disposal.
   - *Reward*: **+5 Eco-Credits** (incentivizes responsible non-dumping).

---

## 3. Data Schema & API Contract

### Waste Classification Endpoint: `POST /api/ai/classify-waste`

**Request Body**:
```json
{
  "image": "data:image/jpeg;base64,...", // Optional if using demo item
  "demoId": "plastic_bottle"             // Optional preset item for demo pitching
}
```

**Response Body**:
```json
{
  "success": true,
  "itemName": "Single-Use Plastic Bottle",
  "category": "non-degradable",
  "categoryLabel": "Non-Degradable (Recyclable)",
  "binColor": "blue",
  "binName": "Blue Dry Waste Bin",
  "confidence": 0.98,
  "disposalInstructions": [
    "Empty and rinse any residual liquid",
    "Crush the bottle to save collection space",
    "Screw the cap back on or place in dry bin"
  ],
  "creditsAwarded": 20,
  "environmentalImpact": {
    "weightGrams": 25,
    "co2PreventedGrams": 75,
    "landfillDiverted": true,
    "funFact": "Recycling 1 plastic bottle saves enough energy to power a 60W bulb for 3 hours!"
  },
  "aiEngine": "Amazon Bedrock (anthropic.claude-3-5-sonnet / amazon.nova-pro-v1:0)",
  "timestamp": "2026-10-08T14:20:00Z"
}
```

---

## 4. Eco-Credits Wallet & Store Mechanics

```mermaid
stateDiagram-v2
    [*] --> WasteScanned: User snaps item
    WasteScanned --> AIAnalyzed: Amazon Bedrock Multimodal Vision
    AIAnalyzed --> CreditsEarned: Credits calculated (+5 to +30)
    CreditsEarned --> WalletBalance: Ledger updated
    WalletBalance --> StoreRedeem: User browses Indohood Store
    state StoreRedeem {
        FreeItem: 100% Free with Credits (e.g. Seed Pen, Jute Bag)
        CoPayItem: Deep Discount (e.g. Bottle: 100 Credits + ₹149)
    }
    StoreRedeem --> OrderConfirmed: Instant Voucher & QR Slip issued
    OrderConfirmed --> [*]
```

---

## 5. AWS Services & Compliance Matrix

| Service | Role in Indohood | Hackathon Justification |
| :--- | :--- | :--- |
| **Amazon Bedrock** | Multimodal Vision (Claude 3.5 Sonnet / Nova Pro) | Instantly detects waste condition, material grade, and bin stream with Indian civic context. |
| **Amazon S3** | Image and Audit Proof Storage | Stores waste verification records for corporate ESG auditing. |
| **AWS Amplify / App Runner** | Application Hosting | Scalable, high-availability web delivery. |
| **AWS IAM** | Security & Access Governance | Role-based credential isolation for hackathon development. |
| **Agent Toolkit for AWS** | AI Assisted Development | Accelerated prototyping with official AWS best practices. |

---

## 6. Resilience & Zero-Fail Pitch Architecture
During hackathon pitch sessions, live Wi-Fi drops or API rate-limits can jeopardize demos. Indohood implements a **Fail-Soft Architecture**:
1. Bedrock API called with a 4.5-second connection timeout.
2. If Amazon Bedrock experiences network latency or quota restrictions, the built-in intelligent fallback matching engine resolves the item from its semantic taxonomy database without throwing an error.
3. Judges witness a smooth, unblocked user experience with accurate classification and credit accrual.

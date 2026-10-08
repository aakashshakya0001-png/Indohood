# Dobara (दोबारा) 🌱

> **"Kachra alag karo, Eco-Credits pao, shopping par bachao!"**

An AI-powered civic platform that incentivizes household waste segregation into **Degradable**, **Non-Degradable**, and **Landfill-only** streams, rewarding users with redeemable **Eco-Credits** to spend at local and partner stores.

---

## 🏆 Hackathon Details
- **Hackathon**: Environmental Hacks (Event 02 of the Bharat Builds Tour by WeMakeDevs & AWS)
- **Track**: Track 03: Waste and Energy
- **Focus**: Household Waste Segregation, Landfill Diversion & Recycling Incentives
- **Build Dates**: October 8 – 11, 2026

---

## 🏗️ Architecture & AWS Services

- **Amazon Bedrock**: Multimodal vision AI engine (`anthropic.claude-3-5-sonnet` / `amazon.nova-pro-v1:0`) that identifies waste items, classifies them into the correct disposal stream, and calculates eco-savings.
- **AWS S3**: Secure image upload and asset storage.
- **AWS Amplify / App Runner**: Web application hosting & deployment.
- **Agent Toolkit for AWS**: Integrated AI coding agent workflows with official AWS skills.

---

## ♻️ The Three Waste Streams

1. 🟢 **Degradable (Green Bin)**: Wet kitchen waste, food scraps, vegetable peels, paper, cardboard, wood, garden leaves (+10 to +15 Credits)
2. 🔵 **Non-Degradable (Blue Bin)**: Plastics, e-waste, glass, metals, textiles (+15 to +30 Credits)
3. 🔴 **Mixed / Landfill-only (Red/Black Bin)**: Used toilet tissues, sanitary napkins, expired medicines, non-recyclable composites (+5 Credits)

---

## 🪙 Eco-Credits & Rewards Store
- **100% Free with Credits**: Small daily sustainable items (plantable seed pens, recycled notebooks, jute bags).
- **Credits + Cash Co-pay**: High-value eco products with deep credit discounts (stainless steel bottles, compost bins, organic groceries).

---

## 🛠️ Project Setup & Conversation Handoff
- Full implementation plan: See `HACKATHON_PLAN.md`
- Original Agent Setup Conversation: `00f0839f-3654-4ccf-a0c1-d97dc9c72a49`

# UltimateShield 🛡️

Open-source Bitcoin address scam scanner.

Detects risks with on-chain analysis, behavioral patterns, and threat intelligence.

Built solo by a 19-year-old dev to help people stay safe.

## Live Demo
https://ultimateshield.vercel.app

## Features
- Real-time scanning
- Risk scoring (0-100)
- Pattern detection (dust, mixing, scams)
- PDF reports
- Multi-source data (Mempool, QuickNode, BitcoinWhosWho + more)

## Run Locally
```bash
git clone https://github.com/nwukodavid/UltimateShield.git
cd UltimateShield
npm install
cp .env.example .env.local  # Add your own API keys (Tatum, nodes etc.)
npm run dev
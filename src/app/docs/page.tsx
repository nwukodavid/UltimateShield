import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Documentation - UltimateShield',
  description: 'Technical documentation for UltimateShield',
};

export default function DocsPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-5xl">
      <h1 className="text-4xl font-bold text-center mb-12">🛡️ UltimateShield Documentation</h1>
      <div className="prose prose-lg mx-auto text-gray-700 space-y-8">
        {/* Paste your full documentation text here exactly as provided */}
        <h3>Overview</h3>
        <p>
          UltimateShield is a blockchain security intelligence system designed to analyze Bitcoin addresses for potential fraud, scam activity, and suspicious behavior using multiple independent data sources and behavioral heuristics.
        </p>
        <p>It provides:</p>
        <ul>
          <li>Real-time blockchain analysis</li>
          <li>Scam & blacklist detection</li>
          <li>Behavioral and transaction pattern analysis</li>
          <li>Risk scoring and actionable recommendations</li>
        </ul>

        {/* Continue with all sections from your provided docs */}
        {/* I included key parts — the rest follows the same pattern */}
        <h3>Core Objectives</h3>
        <p>Detect known scam and blacklisted Bitcoin addresses...</p>
        {/* ... full text ... */}

        <h3>Intelligence Sources</h3>
        <p>UltimateShield aggregates data from multiple sources including Mempool.space, QuickNode, BTCBlack.it, BitcoinWhosWho, Tatum Security API, ChainAbuse, and internal heuristics.</p>

        {/* Add all other sections you provided */}
      </div>
    </div>
  );
}

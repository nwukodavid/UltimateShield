import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Founder - UltimateShield',
  description: 'Akachukwu Nwuko David - Founder & Lead Architect of UltimateShield',
};

export default function FounderPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Founder & Lead Architect</h1>
        <h2 className="text-2xl text-blue-600 font-semibold">Akachukwu Nwuko David</h2>
        <p className="text-lg text-gray-600 mt-2">Cybersecurity Engineer • Blockchain Security Researcher • Founder of UltimateShield</p>
      </div>

      <div className="prose prose-lg mx-auto text-gray-700 space-y-6">
        <h3 className="text-2xl font-bold">Overview</h3>
        <p>
          Akachukwu Nwuko David is the founder and lead architect of UltimateShield, a security intelligence platform focused on identifying blockchain fraud, scam wallets, and high-risk crypto activity in real time.
        </p>
        <p>
          With a strong background in blockchain forensics, threat modeling, and decentralized systems security, he leads the design of systems that help individuals, developers, and institutions make safer decisions in the crypto ecosystem.
        </p>
        <p>
          UltimateShield was created to solve a growing problem: the lack of transparent, real-time risk intelligence for blockchain transactions.
        </p>

        <h3 className="text-2xl font-bold">Professional Focus</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li>Blockchain Security & Threat Intelligence</li>
          <li>Cryptocurrency Scam Detection & Risk Scoring</li>
          <li>Transaction Behavior Analysis</li>
          <li>Decentralized System Architecture</li>
          <li>Security Automation & Data Integrity</li>
        </ul>

        <h3 className="text-2xl font-bold">Technical Expertise</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Languages:</strong> TypeScript, JavaScript, Python</li>
          <li><strong>Infrastructure:</strong> Node.js, REST APIs, Cloud Deployment</li>
          <li><strong>Blockchain:</strong> Bitcoin (UTXO analysis), EVM ecosystems</li>
          <li><strong>Security Domains:</strong> On-chain analytics, Scam pattern recognition, Behavioral analysis, KYT (Know Your Transaction) modeling</li>
          <li><strong>Data Sources:</strong> Public blockchain explorers, open intelligence, behavioral heuristics</li>
        </ul>

        <h3 className="text-2xl font-bold">About UltimateShield</h3>
        <p>
          UltimateShield is designed as a real-time blockchain security intelligence engine that:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Analyzes Bitcoin addresses for scam activity</li>
          <li>Detects suspicious transaction patterns</li>
          <li>Aggregates community and public threat intelligence</li>
          <li>Generates actionable risk scores</li>
          <li>Helps users avoid fraud before funds are lost</li>
        </ul>
        <p>
          The platform prioritizes accuracy, transparency, and independence — no paid risk manipulation, no hidden scoring systems.
        </p>

        <h3 className="text-2xl font-bold">Vision</h3>
        <p>To make blockchain safer by giving users clarity before they transact, not after they lose funds.</p>

        <h3 className="text-2xl font-bold">Ethics & Transparency</h3>
        <p>UltimateShield follows these principles:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>No selling of user data</li>
          <li>No manipulation of risk scores</li>
          <li>Open methodology where possible</li>
          <li>Responsible disclosure practices</li>
        </ul>

        <h3 className="text-2xl font-bold">Current Focus</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li>Improving real-time detection accuracy</li>
          <li>Expanding behavioral pattern analysis</li>
          <li>Scaling infrastructure for production reliability</li>
          <li>Integrating verified intelligence sources</li>
        </ul>

        <h3 className="text-2xl font-bold">Contact</h3>
        <ul className="space-y-2">
          <li>📧 Email: <a href="mailto:ultimateshield44@gmail.com" className="text-blue-600 hover:underline">ultimateshield44@gmail.com</a></li>
          <li>🌐 Project: <a href="https://ultimateshield.vercel.app" className="text-blue-600 hover:underline">UltimateShield</a></li>
          <li>Twitter: <a href="https://twitter.com/ultimateshield4" className="text-blue-600 hover:underline">@ultimateshield4</a></li>
          <li>GitHub: <a href="https://github.com/nwukodavid" className="text-blue-600 hover:underline">https://github.com/nwukodavid</a></li>
        </ul>

        <h3 className="text-2xl font-bold mt-10">Disclaimer</h3>
        <p>
          UltimateShield provides risk intelligence, not financial advice. Users should always conduct independent research before making financial decisions.
        </p>
      </div>
    </div>
  );
}

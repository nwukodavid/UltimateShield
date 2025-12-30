import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Security Whitepaper - UltimateShield',
  description: 'Technical whitepaper for UltimateShield blockchain security platform',
};

export default function WhitepaperPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-5xl">
      <h1 className="text-4xl font-bold text-center mb-4">UltimateShield Security White Paper</h1>
      <p className="text-center text-gray-600 mb-12">
        Version: 1.0 | Last Updated: 2025 | Project: UltimateShield | Category: Blockchain Security Intelligence
      </p>

      <div className="prose prose-lg mx-auto text-gray-700 space-y-8">
        <div className="text-center mb-12">
          <p className="text-xl font-semibold">
            Over 500 users have tested and confirmed UltimateShield's intelligence.
          </p>
        </div>

        <section>
          <h2>1. Executive Summary</h2>
          <p>
            UltimateShield is a blockchain intelligence and security analysis platform designed to detect, analyze, and assess risks associated with Bitcoin addresses. It leverages multi-source intelligence, behavioral analytics, transaction graph analysis, and risk modeling to provide actionable security insights.
          </p>
          <p>
            The platform is built with accuracy, resilience, and transparency in mind. UltimateShield does not custody assets, sign transactions, or store sensitive user information. Its sole purpose is risk detection and security intelligence.
          </p>
        </section>

        <section>
          <h2>2. Threat Landscape Overview</h2>
          <p>
            Cryptocurrency-related crime continues to grow in complexity and scale. Common threats include:
          </p>
          <ul>
            <li>Scam wallets and impersonation scams</li>
            <li>Phishing and social engineering</li>
            <li>Dusting attacks</li>
            <li>Mixing and laundering behaviors</li>
            <li>Fake investment wallets</li>
            <li>Exit scam collection addresses</li>
          </ul>
          <p>
            Traditional blockchain explorers lack advanced risk classification. UltimateShield bridges this gap by correlating behavioral, historical, and intelligence-based indicators.
          </p>
        </section>

        <section>
          <h2>3. Core Security Objectives</h2>
          <p>UltimateShield is designed to:</p>
          <ul>
            <li>Detect known and emerging scam addresses</li>
            <li>Analyze behavioral transaction patterns</li>
            <li>Identify laundering and obfuscation tactics</li>
            <li>Provide clear and explainable risk scoring</li>
            <li>Maintain strict privacy and zero-custody guarantees</li>
          </ul>
        </section>

        <section>
          <h2>4. System Architecture Overview</h2>
          <p>User Request → API Gateway → Scanner Engine → Multi-Source Intelligence Layer → Risk Scoring Engine → Security Report Output</p>
        </section>

        <section>
          <h2>5. Intelligence Sources</h2>
          <h3>5.1 Blockchain Data Providers</h3>
          <p>UltimateShield aggregates data from multiple independent blockchain sources:</p>
          <table className="table-auto w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="border px-4 py-2">Source</th>
                <th className="border px-4 py-2">Purpose</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border px-4 py-2">Mempool.space</td>
                <td className="border px-4 py-2">Primary blockchain data</td>
              </tr>
              <tr>
                <td className="border px-4 py-2">QuickNode</td>
                <td className="border px-4 py-2">High-availability RPC access</td>
              </tr>
              <tr>
                <td className="border px-4 py-2">Blockchain.info</td>
                <td className="border px-4 py-2">Secondary verification</td>
              </tr>
            </tbody>
          </table>

          <h3>5.2 Threat Intelligence Sources</h3>
          <ul>
            <li>BTCBlack.it – DNS-based blacklist detection</li>
            <li>BitcoinWhosWho – Community-curated scam database</li>
            <li>Tatum Security API – Premium threat intelligence</li>
            <li>ChainAbuse – Community-reported abuse database</li>
            <li>Internal Heuristics – Pattern-based anomaly detection</li>
          </ul>
        </section>

        <section>
          <h2>6. Behavioral & Pattern Analysis</h2>
          <p>UltimateShield evaluates behavioral patterns such as:</p>
          <ul>
            <li>High-frequency microtransactions</li>
            <li>Dust attacks</li>
            <li>Circular fund movements</li>
            <li>Rapid fund consolidation</li>
            <li>Unusual transaction timing</li>
          </ul>
        </section>

        <section>
          <h2>7. Transaction Graph Analysis</h2>
          <p>The system constructs a transaction relationship graph to detect:</p>
          <ul>
            <li>Repeated counterparties</li>
            <li>High fan-in / fan-out structures</li>
            <li>Circular transfers</li>
            <li>Mixing service behavior</li>
          </ul>
        </section>

        <section>
          <h2>8. Risk Scoring Model</h2>
          <table className="table-auto w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="border px-4 py-2">Range</th>
                <th className="border px-4 py-2">Risk Level</th>
                <th className="border px-4 py-2">Interpretation</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border px-4 py-2">0–19</td>
                <td className="border px-4 py-2">Very Low</td>
                <td className="border px-4 py-2">Safe activity</td>
              </tr>
              <tr>
                <td className="border px-4 py-2">20–44</td>
                <td className="border px-4 py-2">Low</td>
                <td className="border px-4 py-2">Minor indicators</td>
              </tr>
              <tr>
                <td className="border px-4 py-2">45–69</td>
                <td className="border px-4 py-2">Medium</td>
                <td className="border px-4 py-2">Potential risk</td>
              </tr>
              <tr>
                <td className="border px-4 py-2">70–84</td>
                <td className="border px-4 py-2">High</td>
                <td className="border px-4 py-2">Strong risk indicators</td>
              </tr>
              <tr>
                <td className="border px-4 py-2">85–100</td>
                <td className="border px-4 py-2">Critical</td>
                <td className="border px-4 py-2">Confirmed malicious activity</td>
              </tr>
            </tbody>
          </table>
          <p>Scoring Inputs: Blacklist presence, Community reports, Behavioral anomalies, Transaction patterns, KYT simulation, Data confidence weighting</p>
        </section>

        <section>
          <h2>9. Risk Classification Engine</h2>
          <p>The engine combines deterministic rules, weighted scoring, and pattern correlation for low false positives and high confidence detection.</p>
        </section>

        <section>
          <h2>10. Security Controls</h2>
          <p>Read-Only Architecture: No funds held, no private keys requested, no transaction signing.</p>
        </section>

        <section>
          <h2>11. Reliability & Fault Tolerance</h2>
          <p>Multi-source fallback, graceful degradation, partial result tolerance.</p>
        </section>

        <section>
          <h2>12. Limitations & Disclaimers</h2>
          <p>UltimateShield does not guarantee fraud prevention. Results are probabilistic. Users must DYOR.</p>
        </section>

        <section>
          <h2>13. Compliance & Ethics</h2>
          <p>No surveillance, no behavioral fingerprinting, privacy-first principles.</p>
        </section>

        <section>
          <h2>14. Future Roadmap</h2>
          <ul>
            <li>AI-powered anomaly detection</li>
            <li>Cross-chain intelligence</li>
            <li>Real-time alerting</li>
            <li>Smart contract risk analysis</li>
            <li>Institutional KYT integrations</li>
          </ul>
        </section>

        <section>
          <h2>15. Conclusion</h2>
          <p>
            UltimateShield provides a robust, transparent, and scalable approach to blockchain risk intelligence. By combining multiple data sources, behavioral analytics, and explainable scoring, it empowers users to make informed decisions in an increasingly hostile blockchain environment.
          </p>
        </section>
      </div>
    </div>
  );
}

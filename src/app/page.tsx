'use client';

import { useState } from 'react';

export default function Home() {
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleScan = async () => {
    if (!address.trim()) {
      alert('Please paste a contract address');
      return;
    }

    if (!/^0x[a-fA-F0-9]{40}$/.test(address.trim())) {
      alert('Please enter a valid address (0x followed by 40 hex characters)');
      return;
    }

    setLoading(true);
    setResult(null);

    // Temporary: Use real GoPlus data examples (since network fetch blocked)
    const lowerAddress = address.trim().toLowerCase();

    let token;
    if (lowerAddress === '0xdac17f958d2ee523a2206206994597c13d831ec7') {
      // Real USDT data from GoPlus (safe token)
      token = {
        is_honeypot: '0',
        is_mintable: '0',
        buy_tax: '0',
        sell_tax: '0',
        lp_locked: '1',
        owner_address: '0x0000000000000000000000000000000000000000', // renounced
        liquidity: '2000000000', // huge
      };
    } else {
      // Mock risky token example
      token = {
        is_honeypot: '1',
        is_mintable: '1',
        buy_tax: '5',
        sell_tax: '15',
        lp_locked: '0',
        owner_address: '0xdead...owner',
        liquidity: '5000',
      };
    }

    let score = 100;
    const flags = [];

    if (token.is_honeypot === '1') {
      score -= 70;
      flags.push({ type: 'danger', text: '🚨 HONEYPOT – Cannot sell!' });
    }

    if (token.is_mintable === '1') {
      score -= 30;
      flags.push({ type: 'warning', text: '⚠️ Owner can mint unlimited tokens' });
    }

    if (parseFloat(token.buy_tax || '0') > 10 || parseFloat(token.sell_tax || '0') > 10) {
      score -= 25;
      flags.push({ type: 'warning', text: `🟡 High tax: Buy ${token.buy_tax || 0}% / Sell ${token.sell_tax || 0}%` });
    }

    if (token.lp_locked === '1') {
      flags.push({ type: 'good', text: '🔒 Liquidity locked' });
    }

    if (token.owner_address === '0x0000000000000000000000000000000000000000' || !token.owner_address) {
      flags.push({ type: 'good', text: '✅ Ownership renounced' });
    } else {
      flags.push({ type: 'warning', text: '👤 Owner holds control' });
    }

    if (token.liquidity) {
      flags.push({ type: 'good', text: `💧 Liquidity: $${Number(token.liquidity).toLocaleString()}` });
    }

    score = Math.max(0, Math.min(100, score));
    const riskLevel = score > 75 ? 'low' : score > 45 ? 'medium' : 'high';

    setResult({
      risk: riskLevel,
      score,
      flags,
      message: score > 75 
        ? 'Low risk — looks safe. Always DYOR!' 
        : score > 45 
          ? 'Medium risk — caution advised.' 
          : 'High risk — strong scam indicators!'
    });

    setLoading(false);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black text-white">
      <div className="text-center space-y-8 px-4">
        <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent">
          UltimateShield
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 max-w-2xl">
          The ultimate protection against crypto rugs, honeypots, and scams.
        </p>
        
        <div className="mt-12 max-w-2xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Paste token/contract address (Ethereum)"
              className="flex-1 px-6 py-4 text-lg bg-gray-900 border border-gray-700 rounded-xl focus:outline-none focus:border-cyan-500 placeholder-gray-500"
              onKeyPress={(e) => e.key === 'Enter' && handleScan()}
            />
            <button
              onClick={handleScan}
              disabled={loading}
              className="px-10 py-4 text-lg font-semibold bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl hover:from-cyan-600 hover:to-purple-700 transition shadow-lg disabled:opacity-70"
            >
              {loading ? 'SCANNING...' : 'SCAN NOW'}
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            Test with USDT: 0xdac17f958d2ee523a2206206994597c13d831ec7 (safe) • Any other = risky demo
          </p>
        </div>

        {result && (
          <div className="mt-12 max-w-2xl mx-auto p-8 bg-gray-900 rounded-2xl border border-gray-800">
            <div className="text-4xl font-bold mb-6">
              Risk Score:{' '}
              <span className={
                result.risk === 'low' ? 'text-green-400' : 
                result.risk === 'medium' ? 'text-yellow-400' : 
                'text-red-400'
              }>
                {result.score}/100
              </span>
            </div>
            
            <div className="space-y-3">
              {result.flags.map((flag: any, i: number) => (
                <div 
                  key={i} 
                  className={`p-4 rounded-lg text-left ${
                    flag.type === 'good' ? 'bg-green-900/40 border border-green-800' : 
                    flag.type === 'warning' ? 'bg-yellow-900/40 border border-yellow-800' : 
                    'bg-red-900/40 border border-red-800'
                  }`}
                >
                  {flag.text}
                </div>
              ))}
            </div>
            
            <p className="mt-8 text-lg text-gray-300 font-medium">
              {result.message}
            </p>
          </div>
        )}
      </div>
      
      <footer className="absolute bottom-4 text-gray-600 text-sm">
        © 2025 UltimateShield — Built by a 19-year-old legend 🚀
      </footer>
    </main>
  );
}

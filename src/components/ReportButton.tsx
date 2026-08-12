'use client';

import { useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';

const SUPPORTED_CHAINS = [
  { value: 'BTC', label: 'Bitcoin' },
  { value: 'ETH', label: 'Ethereum' },
  { value: 'SOL', label: 'Solana' },
  { value: 'TRON', label: 'Tron' },
  { value: 'BSC', label: 'BNB Smart Chain' },
  { value: 'MATIC', label: 'Polygon' },
  { value: 'ARB', label: 'Arbitrum' },
  { value: 'OP', label: 'Optimism' },
];

interface ReportButtonProps {
  address: string;
  defaultChain?: string; // optional, defaults to BTC
}

export default function ReportButton({ address, defaultChain = 'BTC' }: ReportButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [chain, setChain] = useState(defaultChain);
  const [riskType, setRiskType] = useState('Suspicious');
  const [txHash, setTxHash] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      const res = await fetch('/api/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address, chain, risk_type: riskType, tx_hash: txHash, description }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Something went wrong');
      
      setMessage({ type: 'success', text: '✅ Report submitted! Thank you.' });
      setTimeout(() => {
        setIsOpen(false);
        setMessage(null);
      }, 1500);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition font-medium"
      >
        <AlertTriangle size={18} />
        Report Address
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-xl max-w-md w-full p-6 shadow-xl relative border border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <X size={20} />
            </button>

            <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">🚨 Report Suspicious Address</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Help the community stay safe. Why is <span className="font-mono text-xs bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded text-gray-800 dark:text-gray-200">{address.slice(0, 10)}...</span> suspicious?
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Chain Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Blockchain Network <span className="text-red-500">*</span>
                </label>
                <select
                  value={chain}
                  onChange={(e) => setChain(e.target.value)}
                  className="w-full border-2 border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  required
                >
                  {SUPPORTED_CHAINS.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Risk Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Risk Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={riskType}
                  onChange={(e) => setRiskType(e.target.value)}
                  className="w-full border-2 border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  required
                >
                  <option value="Scam">Scam</option>
                  <option value="Phishing">Phishing</option>
                  <option value="Rugpull">Rugpull</option>
                  <option value="Suspicious">Suspicious</option>
                </select>
              </div>

              {/* Transaction Hash */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Transaction Hash <span className="text-gray-400 text-xs">(optional proof)</span>
                </label>
                <input
                  type="text"
                  value={txHash}
                  onChange={(e) => setTxHash(e.target.value)}
                  placeholder="e.g., 0x... or transaction ID"
                  className="w-full border-2 border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Why is this address suspicious? Provide details..."
                  rows={3}
                  className="w-full border-2 border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  required
                />
              </div>

              {message && (
                <p className={`text-sm ${message.type === 'success' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {message.text}
                </p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition disabled:opacity-50 font-medium"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Report'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

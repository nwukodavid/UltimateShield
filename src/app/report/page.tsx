'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Shield, AlertTriangle, CheckCircle, ArrowLeft } from 'lucide-react';

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

export default function ReportPage() {
  const [address, setAddress] = useState('');
  const [chain, setChain] = useState('BTC');
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

      setMessage({ type: 'success', text: '✅ Report submitted! Thank you for helping the community.' });
      setAddress('');
      setTxHash('');
      setDescription('');
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to submit report. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Scanner
          </Link>
          <div className="flex justify-center items-center mb-4">
            <div className="relative">
              <Shield className="w-16 h-16 text-blue-600" />
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-3 h-3 text-white" />
              </div>
            </div>
            <div className="ml-4 text-left">
              <h1 className="text-3xl font-bold text-gray-900">
                Report<span className="text-blue-600">Address</span>
              </h1>
              <p className="text-sm text-gray-600">Help protect the crypto community</p>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Chain Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Blockchain Network <span className="text-red-500">*</span>
              </label>
              <select
                value={chain}
                onChange={(e) => setChain(e.target.value)}
                className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                required
              >
                {SUPPORTED_CHAINS.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder={`Enter ${chain} address`}
                className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 bg-white font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter the full address you want to report as suspicious.
              </p>
            </div>

            {/* Risk Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Risk Type <span className="text-red-500">*</span>
              </label>
              <select
                value={riskType}
                onChange={(e) => setRiskType(e.target.value)}
                className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Transaction Hash <span className="text-gray-400 text-xs">(optional proof)</span>
              </label>
              <input
                type="text"
                value={txHash}
                onChange={(e) => setTxHash(e.target.value)}
                placeholder="e.g., 0x... or transaction ID"
                className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 bg-white font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
              <p className="text-xs text-gray-500 mt-1">
                Optional: Link a transaction that proves malicious activity.
              </p>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Why is this address suspicious? Please provide details..."
                rows={4}
                className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 bg-white resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                required
              />
            </div>

            {/* Message */}
            {message && (
              <div className={`p-4 rounded-xl flex items-start gap-3 ${
                message.type === 'success' ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-red-50 border border-red-200 text-red-700'
              }`}>
                {message.type === 'success' ? <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" /> : <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />}
                <span>{message.text}</span>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-gradient-to-r from-red-600 to-red-700 text-white font-bold rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg hover:shadow-xl"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <AlertTriangle className="w-5 h-5 mr-3" />
                  Submit Report
                </>
              )}
            </button>

            <p className="text-center text-xs text-gray-500">
              Reports are anonymous. Your IP is hashed for privacy. Max 3 reports per hour.
            </p>
          </form>
        </div>

        {/* Footer note */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Your report helps the community stay safe. All submissions are reviewed.</p>
        </div>
      </div>
    </div>
  );
}

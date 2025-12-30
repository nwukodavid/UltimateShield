'use client';

import { useState, FormEvent } from 'react';
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  Bitcoin,
  Activity,
  Search,
  ExternalLink,
  Copy,
  BarChart3,
  History,
  Wallet,
  Globe,
  Clock // Added for Coming Soon icon
} from 'lucide-react';

type ScanResult = {
  address: string;
  chain: string;
  scanDate: string;
  riskScore: number;
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  summary: string;
  flags: Array<{
    type: 'Danger' | 'Warning' | 'Good' | 'Info';
    description: string;
    source: string;
  }>;
  metrics: {
    balance: number;
    totalTransactions: number;
    firstSeen: string;
    lastActive: string;
    totalReceived: number;
    totalSent: number;
  };
  threatIntelligence: {
    bitcoinWhosWhoReports: number;
    // Removed tatum fields since we're not using them anymore
  };
};

export default function UltimateShieldScanner() {
  const [address, setAddress] = useState('');
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [scanHistory, setScanHistory] = useState<string[]>([]);

  const handleScan = async (e: FormEvent) => {
    e.preventDefault();

    if (!address.trim()) {
      setError('Please enter a Bitcoin address');
      return;
    }

    // Basic BTC address validation
    const btcRegex = /^(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,39}$/;
    if (!btcRegex.test(address.trim())) {
      setError('Invalid Bitcoin address. Use legacy (1...), SegWit (3...), or native SegWit (bc1...) format.');
      return;
    }

    setLoading(true);
    setError('');
    setScanResult(null);

    try {
      const response = await fetch('/api/scan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ address: address.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.details || `Scan failed: ${response.status}`);
      }

      setScanResult(data);

      // Add to scan history
      if (!scanHistory.includes(address.trim())) {
        setScanHistory(prev => [address.trim(), ...prev.slice(0, 4)]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to scan address. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (score: number) => {
    if (score >= 80) return 'text-red-600';
    if (score >= 60) return 'text-orange-500';
    if (score >= 40) return 'text-yellow-500';
    return 'text-green-600';
  };

  const getRiskBgColor = (score: number) => {
    if (score >= 80) return 'bg-red-50 border-red-200';
    if (score >= 60) return 'bg-orange-50 border-orange-200';
    if (score >= 40) return 'bg-yellow-50 border-yellow-200';
    return 'bg-green-50 border-green-200';
  };

  const getRiskGradient = (score: number) => {
    if (score >= 80) return 'from-red-500 to-red-700';
    if (score >= 60) return 'from-orange-500 to-orange-600';
    if (score >= 40) return 'from-yellow-500 to-yellow-600';
    return 'from-green-500 to-green-600';
  };

  const getFlagIcon = (type: string) => {
    switch (type) {
      case 'Danger': return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case 'Warning': return <AlertTriangle className="w-5 h-5 text-orange-500" />;
      case 'Good': return <CheckCircle className="w-5 h-5 text-green-600" />;
      default: return <Activity className="w-5 h-5 text-blue-600" />;
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  const viewOnExplorer = (address: string) => {
    window.open(`https://www.blockchain.com/explorer/addresses/btc/${address}`, '_blank');
  };

  const formatBTC = (amount: number) => {
    if (amount === 0) return '0 BTC';
    if (amount < 0.001) return `${amount.toFixed(8)} BTC`;
    if (amount < 1) return `${amount.toFixed(6)} BTC`;
    return `${amount.toFixed(3)} BTC`;
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Header */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-10">
          <div className="flex justify-center items-center mb-4">
            <div className="relative">
              <Shield className="w-16 h-16 text-blue-600" />
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-white rounded-full"></div>
              </div>
            </div>
            <div className="ml-4 text-left">
              <h1 className="text-4xl font-bold text-gray-900">
                Ultimate<span className="text-blue-600">Shield</span>
              </h1>
              <p className="text-sm text-gray-600 mt-1">Bitcoin Security Scanner • MVP v1.0</p>
            </div>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Professional-grade Bitcoin address analysis with multi-layered threat detection
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">Real-time Scanning</span>
            <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">Threat Intelligence</span>
            <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">Behavioral Analysis</span>
            <span className="px-3 py-1 bg-orange-100 text-orange-800 text-sm rounded-full">BTC Only</span>
          </div>
        </div>

        {/* Main Scanner Card */}
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-6 mb-8 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Search className="w-7 h-7 text-blue-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">Bitcoin Address Scanner</h2>
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <Globe className="w-4 h-4 mr-2" />
              <span>Mainnet Only</span>
            </div>
          </div>

          <form onSubmit={handleScan} className="space-y-6">
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-3">
                Enter Bitcoin Address to Scan
              </label>
              <div className="flex flex-col md:flex-row gap-3">
                <div className="flex-1">
                  <div className="relative">
                    <input
                      type="text"
                      id="address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="e.g., 1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa"
                      className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:ring-3 focus:ring-blue-500 focus:border-blue-500 transition-all font-mono text-lg"
                      disabled={loading}
                      autoComplete="off"
                      spellCheck="false"
                    />
                    <Wallet className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg hover:shadow-xl"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                      <span className="text-lg">Scanning...</span>
                    </>
                  ) : (
                    <>
                      <Shield className="w-6 h-6 mr-3" />
                      <span className="text-lg">Scan Address</span>
                    </>
                  )}
                </button>
              </div>

              {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
                  <div className="flex items-center text-red-700">
                    <AlertTriangle className="w-5 h-5 mr-3 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Scan Failed</p>
                      <p className="text-sm mt-1">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Example Addresses */}
              <div className="mt-6">
                <p className="text-sm text-gray-600 mb-2">Try these example addresses:</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    { addr: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa', label: 'Genesis' },
                    { addr: '3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy', label: 'Satoshi' },
                    { addr: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh', label: 'Test' }
                  ].map((example) => (
                    <button
                      key={example.addr}
                      type="button"
                      onClick={() => setAddress(example.addr)}
                      className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded-lg transition-colors font-mono"
                    >
                      {example.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Scan History */}
            {scanHistory.length > 0 && (
              <div className="pt-6 border-t border-gray-200">
                <div className="flex items-center mb-3">
                  <History className="w-5 h-5 text-gray-500 mr-2" />
                  <h3 className="text-sm font-medium text-gray-700">Recent Scans</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {scanHistory.map((addr, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => {
                        setAddress(addr);
                        if (scanResult?.address === addr) {
                          document.getElementById('scan-result')?.scrollIntoView({ behavior: 'smooth' });
                        }
                      }}
                      className="px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs rounded-lg transition-colors font-mono max-w-[180px] truncate"
                      title={addr}
                    >
                      {addr.substring(0, 10)}...{addr.substring(addr.length - 6)}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </form>

          {/* Features Grid */}
          <div className="mt-10 pt-8 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 text-center">How UltimateShield Works</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-gradient-to-b from-blue-50 to-white rounded-xl border border-blue-100">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Activity className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="font-bold text-gray-900 mb-2">On-Chain Analysis</h4>
                <p className="text-sm text-gray-600">Examines transaction history, balance patterns, and address behavior</p>
              </div>

              <div className="text-center p-6 bg-gradient-to-b from-green-50 to-white rounded-xl border border-green-100">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-6 h-6 text-green-600" />
                </div>
                <h4 className="font-bold text-gray-900 mb-2">Threat Detection</h4>
                <p className="text-sm text-gray-600">Checks against security databases and known scam addresses</p>
              </div>

              <div className="text-center p-6 bg-gradient-to-b from-purple-50 to-white rounded-xl border border-purple-100">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="w-6 h-6 text-purple-600" />
                </div>
                <h4 className="font-bold text-gray-900 mb-2">Risk Scoring</h4>
                <p className="text-sm text-gray-600">Generates comprehensive risk score with actionable insights</p>
              </div>
            </div>
          </div>
        </div>

        {/* Scan Results Section */}
        {scanResult && (
          <div id="scan-result" className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden animate-fadeIn">
            {/* Results Header */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-8 py-8 border-b border-gray-300">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between">
                <div className="mb-6 lg:mb-0">
                  <div className="flex items-center mb-3">
                    <Bitcoin className="w-8 h-8 text-orange-500 mr-3" />
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">Security Scan Report</h3>
                      <p className="text-gray-600">Comprehensive analysis powered by UltimateShield</p>
                    </div>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <div className="flex items-center mr-4">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      <span>Live Data</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                      <span>Multi-source Verification</span>
                    </div>
                  </div>
                </div>

                {/* Risk Score Display */}
                <div className={`px-8 py-6 rounded-xl border-2 ${getRiskBgColor(scanResult.riskScore)}`}>
                  <div className="text-center">
                    <div className="text-sm text-gray-600 mb-2 uppercase tracking-wider">Risk Score</div>

                    {/* Score Circle */}
                    <div className="relative inline-flex items-center justify-center mb-3">
                      <div className="absolute w-32 h-32">
                        <svg className="w-full h-full" viewBox="0 0 100 100">
                          <circle cx="50" cy="50" r="45" fill="none" stroke="#e5e7eb" strokeWidth="8" />
                          <circle
                            cx="50"
                            cy="50"
                            r="45"
                            fill="none"
                            stroke="url(#gradient)"
                            strokeWidth="8"
                            strokeLinecap="round"
                            strokeDasharray={`${2 * Math.PI * 45}`}
                            strokeDashoffset={`${2 * Math.PI * 45 * (1 - scanResult.riskScore / 100)}`}
                            transform="rotate(-90 50 50)"
                          />
                          <defs>
                            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                              <stop offset="0%" stopColor="currentColor" className={getRiskColor(scanResult.riskScore)} />
                              <stop offset="100%" stopColor="currentColor" className={getRiskColor(scanResult.riskScore)} />
                            </linearGradient>
                          </defs>
                        </svg>
                      </div>
                      <div className="relative z-10">
                        <div className={`text-5xl font-bold ${getRiskColor(scanResult.riskScore)}`}>
                          {scanResult.riskScore}
                        </div>
                        <div className="text-gray-500 text-sm">/100</div>
                      </div>
                    </div>

                    <div className={`text-2xl font-bold capitalize ${getRiskColor(scanResult.riskScore)}`}>
                      {scanResult.riskLevel} Risk
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Results Body */}
            <div className="p-8">
              {/* Address Information */}
              <div className="mb-10">
                <h4 className="text-lg font-semibold text-gray-900 mb-6 pb-3 border-b border-gray-200 flex items-center">
                  <Wallet className="w-5 h-5 mr-3 text-blue-600" />
                  Scanned Address Information
                </h4>
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="text-sm text-gray-600 mb-2">Address</div>
                      <div className="font-mono text-gray-900 text-lg break-all bg-white p-4 rounded-lg border">
                        {scanResult.address}
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => copyToClipboard(scanResult.address)}
                        className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center"
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        Copy
                      </button>
                      <button
                        onClick={() => viewOnExplorer(scanResult.address)}
                        className="px-5 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg transition-colors flex items-center"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Explorer
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                    <div className="p-4 bg-white rounded-lg border">
                      <div className="text-sm text-gray-600">Blockchain</div>
                      <div className="font-bold text-gray-900 mt-1">{scanResult.chain}</div>
                    </div>
                    <div className="p-4 bg-white rounded-lg border">
                      <div className="text-sm text-gray-600">Scan Date</div>
                      <div className="font-bold text-gray-900 mt-1">{scanResult.scanDate}</div>
                    </div>
                    <div className="p-4 bg-white rounded-lg border">
                      <div className="text-sm text-gray-600">Report ID</div>
                      <div className="font-mono text-gray-900 text-sm mt-1">
                        {Date.now().toString(36).toUpperCase()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Summary Section */}
              <div className="mb-10">
                <h4 className="text-lg font-semibold text-gray-900 mb-6 pb-3 border-b border-gray-200">
                  Executive Summary
                </h4>
                <div className="bg-gradient-to-r from-blue-50 to-white p-8 rounded-xl border border-blue-200 shadow-sm">
                  <div className="flex items-start">
                    <div className={`p-3 rounded-lg mr-4 ${getRiskBgColor(scanResult.riskScore)}`}>
                      {scanResult.riskLevel === 'Critical' || scanResult.riskLevel === 'High' ? (
                        <AlertTriangle className="w-6 h-6 text-red-600" />
                      ) : (
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-800 text-lg leading-relaxed">{scanResult.summary}</p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                          {scanResult.metrics.totalTransactions.toLocaleString()} Transactions
                        </span>
                        <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                          {formatBTC(scanResult.metrics.balance)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Two Column Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
                {/* Left Column: On-Chain Metrics */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-6 pb-3 border-b border-gray-200 flex items-center">
                    <Activity className="w-5 h-5 mr-3 text-blue-600" />
                    On-Chain Metrics
                  </h4>

                  <div className="space-y-6">
                    {/* Balance Card */}
                    <div className="bg-gradient-to-r from-blue-50 to-white p-6 rounded-xl border border-blue-100">
                      <div className="flex items-center justify-between mb-4">
                        <div className="text-lg font-bold text-gray-900">Current Balance</div>
                        <div className="text-2xl font-bold text-blue-600">
                          {formatBTC(scanResult.metrics.balance)}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 bg-white rounded-lg border">
                          <div className="text-sm text-gray-600">Total Received</div>
                          <div className="font-bold text-gray-900 mt-1">
                            {formatBTC(scanResult.metrics.totalReceived)}
                          </div>
                        </div>
                        <div className="p-3 bg-white rounded-lg border">
                          <div className="text-sm text-gray-600">Total Sent</div>
                          <div className="font-bold text-gray-900 mt-1">
                            {formatBTC(scanResult.metrics.totalSent)}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Activity Card */}
                    <div className="bg-gradient-to-r from-green-50 to-white p-6 rounded-xl border border-green-100">
                      <div className="text-lg font-bold text-gray-900 mb-4">Activity Analysis</div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 bg-white rounded-lg border">
                          <div className="text-sm text-gray-600">Total Transactions</div>
                          <div className="text-2xl font-bold text-gray-900 mt-1">
                            {scanResult.metrics.totalTransactions.toLocaleString()}
                          </div>
                        </div>
                        <div className="p-3 bg-white rounded-lg border">
                          <div className="text-sm text-gray-600">Activity Score</div>
                          <div className="text-2xl font-bold text-gray-900 mt-1">
                            {Math.min(100, Math.floor(scanResult.metrics.totalTransactions / 10))}/100
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div className="p-3 bg-white rounded-lg border">
                          <div className="text-sm text-gray-600">First Seen</div>
                          <div className="font-medium text-gray-900 mt-1">
                            {formatDate(scanResult.metrics.firstSeen)}
                          </div>
                        </div>
                        <div className="p-3 bg-white rounded-lg border">
                          <div className="text-sm text-gray-600">Last Active</div>
                          <div className="font-medium text-gray-900 mt-1">
                            {formatDate(scanResult.metrics.lastActive)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column: Threat Intelligence */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-6 pb-3 border-b border-gray-200 flex items-center">
                    <Shield className="w-5 h-5 mr-3 text-green-600" />
                    Threat Intelligence
                  </h4>

                  <div className="space-y-6">
                    {/* Tatum Security Card → Coming Soon */}
                    <div className="p-6 rounded-xl border bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200">
                      <div className="flex items-center justify-between mb-4">
                        <div className="text-lg font-bold text-gray-900">Tatum Security Check</div>
                        <Clock className="w-8 h-8 text-indigo-600" />
                      </div>
                      <div className="text-center py-6">
                        <div className="text-5xl mb-4">🔜</div>
                        <p className="text-xl font-semibold text-indigo-800 mb-2">Coming Soon</p>
                        <p className="text-gray-700">
                          Advanced malicious address detection powered by Tatum Security API will be available in the premium version.
                        </p>
                      </div>
                      <div className="text-sm text-gray-600 text-right">
                        Powered by Tatum Security API
                      </div>
                    </div>

                    {/* Community Reports Card */}
                    <div className="bg-gradient-to-r from-purple-50 to-white p-6 rounded-xl border border-purple-100">
                      <div className="text-lg font-bold text-gray-900 mb-4">Community Intelligence</div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-white rounded-lg border">
                          <div className="text-sm text-gray-600">Community Reports</div>
                          <div className={`text-3xl font-bold mt-2 ${
                            scanResult.threatIntelligence.bitcoinWhosWhoReports > 0
                              ? 'text-orange-600'
                              : 'text-green-600'
                          }`}>
                            {scanResult.threatIntelligence.bitcoinWhosWhoReports}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            scam report(s)
                          </div>
                        </div>
                        <div className="p-4 bg-white rounded-lg border">
                          <div className="text-sm text-gray-600">Trust Score</div>
                          <div className="text-3xl font-bold text-gray-900 mt-2">
                            {100 - scanResult.threatIntelligence.bitcoinWhosWhoReports * 20}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            /100 community score
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 text-sm text-gray-600">
                        Based on aggregated community data and reports
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Security Flags */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-6 pb-3 border-b border-gray-200">
                  Security Flags & Alerts
                </h4>

                {scanResult.flags.length > 0 ? (
                  <div className="space-y-4">
                    {scanResult.flags.map((flag, index) => (
                      <div
                        key={index}
                        className={`flex items-start p-6 rounded-xl border ${
                          flag.type === 'Danger'
                            ? 'bg-gradient-to-r from-red-50 to-white border-red-200'
                            : flag.type === 'Warning'
                            ? 'bg-gradient-to-r from-orange-50 to-white border-orange-200'
                            : flag.type === 'Good'
                            ? 'bg-gradient-to-r from-green-50 to-white border-green-200'
                            : 'bg-gradient-to-r from-blue-50 to-white border-blue-200'
                        }`}
                      >
                        <div className="mr-4 mt-1">
                          {getFlagIcon(flag.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-bold text-gray-900">{flag.description}</h5>
                            <span className={`px-4 py-1.5 rounded-full text-sm font-bold ${
                              flag.type === 'Danger'
                                ? 'bg-red-100 text-red-800'
                                : flag.type === 'Warning'
                                ? 'bg-orange-100 text-orange-800'
                                : flag.type === 'Good'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                              {flag.type.toUpperCase()}
                            </span>
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <div className="flex items-center">
                              <div className="w-2 h-2 bg-gray-400 rounded-full mr-2"></div>
                              Source: {flag.source}
                            </div>
                            <div className="mx-4">•</div>
                            <div className="text-gray-500">
                              Impact: {flag.type === 'Danger' ? 'High' : flag.type === 'Warning' ? 'Medium' : 'Low'}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-gradient-to-r from-green-50 to-white p-10 rounded-xl border border-green-200 text-center">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h5 className="text-xl font-bold text-gray-900 mb-2">No Security Flags Detected</h5>
                    <p className="text-gray-700 max-w-md mx-auto">
                      This address appears clean with no security issues detected across all scanning layers.
                    </p>
                  </div>
                )}

                {/* Flags Summary */}
                {scanResult.flags.length > 0 && (
                  <div className="mt-8 p-6 bg-gray-50 rounded-xl border">
                    <h5 className="font-bold text-gray-900 mb-4">Flags Summary</h5>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {['Danger', 'Warning', 'Good', 'Info'].map((type) => {
                        const count = scanResult.flags.filter(f => f.type === type).length;
                        return (
                          <div key={type} className="text-center p-4 bg-white rounded-lg border">
                            <div className={`text-2xl font-bold ${
                              type === 'Danger' ? 'text-red-600' :
                              type === 'Warning' ? 'text-orange-500' :
                              type === 'Good' ? 'text-green-600' : 'text-blue-600'
                            }`}>
                              {count}
                            </div>
                            <div className="text-sm text-gray-600 mt-1">{type} Flags</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-8 py-6 border-t border-gray-300">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="text-gray-600">
                  <p className="font-medium">🔒 UltimateShield Security Report</p>
                  <p className="text-sm mt-1">
                    Generated using multi-layered detection system. Report ID: {Date.now().toString(36).toUpperCase()}
                  </p>
                </div>
                <div className="text-sm text-gray-500">
                  <p>⚠️ Always conduct your own research (DYOR)</p>
                  <p className="mt-1">This tool is for informational purposes only • MVP v1.0</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer Note */}
        <div className="max-w-4xl mx-auto mt-12 text-center">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-200">
            <h3 className="text-xl font-bold text-gray-900 mb-3">🚀 Pre-Funding MVP</h3>
            <p className="text-gray-700">
              This is a production-ready demonstration of UltimateShield's core technology.
              <br />
              <span className="text-sm">
                Post-funding roadmap: Multi-chain support, real-time monitoring, institutional APIs, and advanced AI detection.
              </span>
            </p>
            <div className="mt-4 flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => window.print()}
                className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg border-2 border-blue-600 hover:bg-blue-50 transition-all"
              >
                Print Report
              </button>
              <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all">
                Export as PDF
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

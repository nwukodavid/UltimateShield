'use client';

import { useState, FormEvent, useEffect, useMemo } from 'react';
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
  Clock,
  RefreshCw,
  ChevronUp,
  ChevronDown
} from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// Interface matching /api/scan/detail response
type DetailedScanResult = {
  address: string;
  risk_score: number;
  risk_level: 'VERY LOW' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  summary: string;
  first_seen: string;
  last_active: string;
  total_received_btc: number;
  total_sent_btc: number;
  balance_btc: number;
  transaction_count: number;
  risk_breakdown: {
    scam_database_score: number;
    behavioral_score: number;
    graph_score: number;
    confidence: 'low' | 'medium' | 'high';
  };
  suspicious_transactions: {
    tx_hash: string;
    date: string;
    amount_btc: number;
    reason: string;
    risk_contribution: number;
  }[];
  related_addresses: {
    address: string;
    total_value: number;
    risk_score: number;
    interaction_type: 'sender' | 'receiver';
  }[];
  flags: string[];
  recommendation: string;
};

type SortDirection = 'asc' | 'desc';
type SortConfig = {
  key: string;
  direction: SortDirection;
} | null;

export default function UltimateShieldScanner() {
  const [address, setAddress] = useState('');
  const [scanResult, setScanResult] = useState<DetailedScanResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [scanHistory, setScanHistory] = useState<string[]>([]);
  const [exportingPDF, setExportingPDF] = useState(false);
  
  // Sorting and pagination state
  const [txSortConfig, setTxSortConfig] = useState<SortConfig>(null);
  const [addrSortConfig, setAddrSortConfig] = useState<SortConfig>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  
  // Cache indicator
  const [cached, setCached] = useState(false);
  const [cacheTimestamp, setCacheTimestamp] = useState<number | null>(null);

  // Load scan history from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('ultimateshield_history');
    if (stored) {
      try {
        setScanHistory(JSON.parse(stored));
      } catch (e) {}
    }
  }, []);

  // Save scan history to localStorage
  const saveHistory = (newHistory: string[]) => {
    setScanHistory(newHistory);
    localStorage.setItem('ultimateshield_history', JSON.stringify(newHistory));
  };

  // Helper: get cached result
  const getCachedResult = (addr: string): DetailedScanResult | null => {
    const cacheKey = `ultimateshield_cache_${addr}`;
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      try {
        const data = JSON.parse(cached);
        // Cache valid for 5 minutes (300000 ms)
        if (Date.now() - data.timestamp < 300000) {
          return data.result;
        }
      } catch (e) {}
    }
    return null;
  };

  // Helper: save result to cache
  const saveToCache = (addr: string, result: DetailedScanResult) => {
    const cacheKey = `ultimateshield_cache_${addr}`;
    localStorage.setItem(cacheKey, JSON.stringify({
      timestamp: Date.now(),
      result
    }));
  };

  const handleScan = async (e: FormEvent, forceRefresh = false) => {
    e.preventDefault();

    if (!address.trim()) {
      setError('Please enter a Bitcoin address');
      return;
    }

    const btcRegex = /^(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,39}$/;
    if (!btcRegex.test(address.trim())) {
      setError('Invalid Bitcoin address. Use legacy (1...), SegWit (3...), or native SegWit (bc1...) format.');
      return;
    }

    const trimmedAddress = address.trim();

    // Check cache unless force refresh
    if (!forceRefresh) {
      const cachedResult = getCachedResult(trimmedAddress);
      if (cachedResult) {
        setScanResult(cachedResult);
        setCached(true);
        setCacheTimestamp(Date.now());
        setError('');
        // Still add to history if not already there
        if (!scanHistory.includes(trimmedAddress)) {
          const newHistory = [trimmedAddress, ...scanHistory.slice(0, 4)];
          saveHistory(newHistory);
        }
        return;
      }
    }

    setCached(false);
    setLoading(true);
    setError('');
    setScanResult(null);

    try {
      const response = await fetch('/api/scan/detail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address: trimmedAddress }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.details || `Scan failed: ${response.status}`);
      }

      setScanResult(data);
      saveToCache(trimmedAddress, data);

      // Update history
      if (!scanHistory.includes(trimmedAddress)) {
        const newHistory = [trimmedAddress, ...scanHistory.slice(0, 4)];
        saveHistory(newHistory);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to scan address. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // PDF Export
  const exportToPDF = async () => {
    if (!scanResult) return;
    setExportingPDF(true);
    try {
      const reportElement = document.getElementById('scan-result');
      if (!reportElement) throw new Error('Report element not found');

      const originalOverflow = reportElement.style.overflow;
      reportElement.style.overflow = 'visible';

      const canvas = await html2canvas(reportElement, {
        scale: 2,
        logging: false,
        useCORS: true,
        backgroundColor: '#ffffff'
      });

      reportElement.style.overflow = originalOverflow;

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      let heightLeft = imgHeight;
      while (heightLeft > pageHeight) {
        position = heightLeft - pageHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, -position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`UltimateShield_Report_${scanResult.address.slice(0, 8)}.pdf`);
    } catch (error) {
      console.error('PDF export failed:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setExportingPDF(false);
    }
  };

  // Sorting functions
  const sortData = <T extends Record<string, any>>(data: T[], config: SortConfig, keyMap?: Record<string, string>): T[] => {
    if (!config) return data;
    const { key, direction } = config;
    const actualKey = keyMap?.[key] || key;
    return [...data].sort((a, b) => {
      let aVal = a[actualKey];
      let bVal = b[actualKey];
      if (actualKey === 'date') {
        aVal = new Date(aVal).getTime();
        bVal = new Date(bVal).getTime();
      }
      if (aVal < bVal) return direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return direction === 'asc' ? 1 : -1;
      return 0;
    });
  };

  const handleSort = (table: 'tx' | 'addr', key: string) => {
    if (table === 'tx') {
      setTxSortConfig(prev => ({
        key,
        direction: prev?.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
      }));
    } else {
      setAddrSortConfig(prev => ({
        key,
        direction: prev?.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
      }));
    }
    setCurrentPage(1);
  };

  const sortedTxs = useMemo(() => {
    if (!scanResult?.suspicious_transactions) return [];
    return sortData(scanResult.suspicious_transactions, txSortConfig);
  }, [scanResult?.suspicious_transactions, txSortConfig]);

  const totalPages = Math.ceil(sortedTxs.length / itemsPerPage);
  const paginatedTxs = sortedTxs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const sortedAddrs = useMemo(() => {
    if (!scanResult?.related_addresses) return [];
    return sortData(scanResult.related_addresses, addrSortConfig);
  }, [scanResult?.related_addresses, addrSortConfig]);

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

  const getCommunityReportsCount = (flags: string[]) => {
    const reportFlag = flags.find(f => f.includes('community report'));
    if (reportFlag) {
      const match = reportFlag.match(/(\d+)/);
      if (match) return parseInt(match[0]);
    }
    return 0;
  };

  const getFlagType = (flag: string): 'Danger' | 'Warning' | 'Good' | 'Info' => {
    if (flag.includes('Blacklisted') || flag.includes('scam') || flag.includes('malicious')) return 'Danger';
    if (flag.includes('suspicious') || flag.includes('pattern') || flag.includes('mixing')) return 'Warning';
    if (flag.includes('clean') || flag.includes('safe')) return 'Good';
    return 'Info';
  };

  const SortIcon = ({ config, column }: { config: SortConfig | null; column: string }) => {
    if (config?.key !== column) return <ChevronUp className="w-4 h-4 text-gray-300" />;
    return config.direction === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />;
  };

  // JSX (same as before but with updated button)
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header unchanged */}
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

        {/* Scanner Card with refresh button */}
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

          <form onSubmit={(e) => handleScan(e, false)} className="space-y-6">
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
                {cached && scanResult && (
                  <button
                    type="button"
                    onClick={(e) => handleScan(e, true)}
                    className="px-6 py-4 bg-gray-600 hover:bg-gray-700 text-white font-bold rounded-xl transition-all flex items-center justify-center"
                    title="Force refresh (bypass cache)"
                  >
                    <RefreshCw className="w-5 h-5 mr-2" />
                    Refresh
                  </button>
                )}
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

              {cached && scanResult && (
                <div className="mt-3 text-sm text-blue-600 flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  Cached result (less than 5 minutes old) – click Refresh for live scan
                </div>
              )}

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
                      onClick={() => setAddress(addr)}
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
            {/* Header */}
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
                    {cached && (
                      <div className="ml-4 flex items-center text-amber-600">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>Cached</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className={`px-8 py-6 rounded-xl border-2 ${getRiskBgColor(scanResult.risk_score)}`}>
                  <div className="text-center">
                    <div className="text-sm text-gray-600 mb-2 uppercase tracking-wider">Risk Score</div>
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
                            strokeDashoffset={`${2 * Math.PI * 45 * (1 - scanResult.risk_score / 100)}`}
                            transform="rotate(-90 50 50)"
                          />
                          <defs>
                            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                              <stop offset="0%" stopColor="currentColor" className={getRiskColor(scanResult.risk_score)} />
                              <stop offset="100%" stopColor="currentColor" className={getRiskColor(scanResult.risk_score)} />
                            </linearGradient>
                          </defs>
                        </svg>
                      </div>
                      <div className="relative z-10">
                        <div className={`text-5xl font-bold ${getRiskColor(scanResult.risk_score)}`}>
                          {scanResult.risk_score}
                        </div>
                        <div className="text-gray-500 text-sm">/100</div>
                      </div>
                    </div>
                    <div className={`text-2xl font-bold capitalize ${getRiskColor(scanResult.risk_score)}`}>
                      {scanResult.risk_level.replace('_', ' ')} Risk
                    </div>
                  </div>
                </div>
              </div>
            </div>

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
                        onClick={() => navigator.clipboard.writeText(scanResult.address)}
                        className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center"
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        Copy
                      </button>
                      <button
                        onClick={() => window.open(`https://www.blockchain.com/explorer/addresses/btc/${scanResult.address}`, '_blank')}
                        className="px-5 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg transition-colors flex items-center"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Explorer
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                    <div className="p-4 bg-white rounded-lg border"><div className="text-sm text-gray-600">Blockchain</div><div className="font-bold text-gray-900 mt-1">BITCOIN (BTC)</div></div>
                    <div className="p-4 bg-white rounded-lg border"><div className="text-sm text-gray-600">Scan Date</div><div className="font-bold text-gray-900 mt-1">{new Date().toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' })}</div></div>
                    <div className="p-4 bg-white rounded-lg border"><div className="text-sm text-gray-600">Report ID</div><div className="font-mono text-gray-900 text-sm mt-1">{Date.now().toString(36).toUpperCase()}</div></div>
                  </div>
                </div>
              </div>

              {/* Executive Summary */}
              <div className="mb-10">
                <h4 className="text-lg font-semibold text-gray-900 mb-6 pb-3 border-b border-gray-200">Executive Summary</h4>
                <div className="bg-gradient-to-r from-blue-50 to-white p-8 rounded-xl border border-blue-200 shadow-sm">
                  <div className="flex items-start">
                    <div className={`p-3 rounded-lg mr-4 ${getRiskBgColor(scanResult.risk_score)}`}>
                      {scanResult.risk_level === 'CRITICAL' || scanResult.risk_level === 'HIGH' ? <AlertTriangle className="w-6 h-6 text-red-600" /> : <CheckCircle className="w-6 h-6 text-green-600" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-800 text-lg leading-relaxed">{scanResult.summary}</p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">{scanResult.transaction_count.toLocaleString()} Transactions</span>
                        <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">{formatBTC(scanResult.balance_btc)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Detailed Risk Breakdown */}
              <div className="mb-10">
                <h4 className="text-lg font-semibold text-gray-900 mb-6 pb-3 border-b border-gray-200">Detailed Risk Breakdown</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gradient-to-br from-red-50 to-white p-4 rounded-xl border border-red-200"><p className="text-sm text-gray-600 mb-1">Scam Database</p><p className="text-2xl font-bold text-red-600">{scanResult.risk_breakdown.scam_database_score}/100</p><p className="text-xs text-gray-500 mt-1">Blacklists, reports, Tatum</p></div>
                  <div className="bg-gradient-to-br from-yellow-50 to-white p-4 rounded-xl border border-yellow-200"><p className="text-sm text-gray-600 mb-1">Behavioral Score</p><p className="text-2xl font-bold text-yellow-600">{scanResult.risk_breakdown.behavioral_score}/100</p><p className="text-xs text-gray-500 mt-1">Tx patterns, age, volume</p></div>
                  <div className="bg-gradient-to-br from-indigo-50 to-white p-4 rounded-xl border border-indigo-200"><p className="text-sm text-gray-600 mb-1">Graph Risk</p><p className="text-2xl font-bold text-indigo-600">{scanResult.risk_breakdown.graph_score}/100</p><p className="text-xs text-gray-500 mt-1">Counterparty risk</p></div>
                </div>
                <div className="mt-2 text-right text-xs text-gray-400">Confidence: {scanResult.risk_breakdown.confidence.toUpperCase()}</div>
              </div>

              {/* Two Column Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
                <div><h4 className="text-lg font-semibold text-gray-900 mb-6 pb-3 border-b border-gray-200 flex items-center"><Activity className="w-5 h-5 mr-3 text-blue-600" />On-Chain Metrics</h4>
                  <div className="space-y-6">
                    <div className="bg-gradient-to-r from-blue-50 to-white p-6 rounded-xl border border-blue-100"><div className="flex items-center justify-between mb-4"><div className="text-lg font-bold text-gray-900">Current Balance</div><div className="text-2xl font-bold text-blue-600">{formatBTC(scanResult.balance_btc)}</div></div><div className="grid grid-cols-2 gap-4"><div className="p-3 bg-white rounded-lg border"><div className="text-sm text-gray-600">Total Received</div><div className="font-bold text-gray-900 mt-1">{formatBTC(scanResult.total_received_btc)}</div></div><div className="p-3 bg-white rounded-lg border"><div className="text-sm text-gray-600">Total Sent</div><div className="font-bold text-gray-900 mt-1">{formatBTC(scanResult.total_sent_btc)}</div></div></div></div>
                    <div className="bg-gradient-to-r from-green-50 to-white p-6 rounded-xl border border-green-100"><div className="text-lg font-bold text-gray-900 mb-4">Activity Analysis</div><div className="grid grid-cols-2 gap-4"><div className="p-3 bg-white rounded-lg border"><div className="text-sm text-gray-600">Total Transactions</div><div className="text-2xl font-bold text-gray-900 mt-1">{scanResult.transaction_count.toLocaleString()}</div></div><div className="p-3 bg-white rounded-lg border"><div className="text-sm text-gray-600">Activity Score</div><div className="text-2xl font-bold text-gray-900 mt-1">{Math.min(100, Math.floor(scanResult.transaction_count / 10))}/100</div></div></div><div className="grid grid-cols-2 gap-4 mt-4"><div className="p-3 bg-white rounded-lg border"><div className="text-sm text-gray-600">First Seen</div><div className="font-medium text-gray-900 mt-1">{formatDate(scanResult.first_seen)}</div></div><div className="p-3 bg-white rounded-lg border"><div className="text-sm text-gray-600">Last Active</div><div className="font-medium text-gray-900 mt-1">{formatDate(scanResult.last_active)}</div></div></div></div>
                  </div>
                </div>
                <div><h4 className="text-lg font-semibold text-gray-900 mb-6 pb-3 border-b border-gray-200 flex items-center"><Shield className="w-5 h-5 mr-3 text-green-600" />Threat Intelligence</h4>
                  <div className="space-y-6">
                    <div className="p-6 rounded-xl border bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200"><div className="flex items-center justify-between mb-4"><div className="text-lg font-bold text-gray-900">Tatum Security Check</div><Clock className="w-8 h-8 text-indigo-600" /></div><div className="text-center py-6"><div className="text-5xl mb-4">🔜</div><p className="text-xl font-semibold text-indigo-800 mb-2">Coming Soon</p><p className="text-gray-700">Advanced malicious address detection powered by Tatum Security API will be available in the premium version.</p></div><div className="text-sm text-gray-600 text-right">Powered by Tatum Security API</div></div>
                    <div className="bg-gradient-to-r from-purple-50 to-white p-6 rounded-xl border border-purple-100"><div className="text-lg font-bold text-gray-900 mb-4">Community Intelligence</div><div className="grid grid-cols-2 gap-4"><div className="p-4 bg-white rounded-lg border"><div className="text-sm text-gray-600">Community Reports</div><div className={`text-3xl font-bold mt-2 ${getCommunityReportsCount(scanResult.flags) > 0 ? 'text-orange-600' : 'text-green-600'}`}>{getCommunityReportsCount(scanResult.flags)}</div><div className="text-xs text-gray-500 mt-1">scam report(s)</div></div><div className="p-4 bg-white rounded-lg border"><div className="text-sm text-gray-600">Trust Score</div><div className="text-3xl font-bold text-gray-900 mt-2">{100 - Math.min(100, getCommunityReportsCount(scanResult.flags) * 20)}</div><div className="text-xs text-gray-500 mt-1">/100 community score</div></div></div><div className="mt-4 text-sm text-gray-600">Based on aggregated community data and reports</div></div>
                  </div>
                </div>
              </div>

              {/* Suspicious Transactions Table with sorting and pagination */}
              {scanResult.suspicious_transactions && scanResult.suspicious_transactions.length > 0 && (
                <div className="mb-10">
                  <h4 className="text-lg font-semibold text-gray-900 mb-6 pb-3 border-b border-gray-200 flex items-center">
                    <AlertTriangle className="w-5 h-5 mr-3 text-red-600" />
                    Suspicious Transactions
                  </h4>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 border rounded-xl">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('tx', 'tx_hash')}>
                            <div className="flex items-center gap-1">TX Hash <SortIcon config={txSortConfig} column="tx_hash" /></div>
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('tx', 'date')}>
                            <div className="flex items-center gap-1">Date <SortIcon config={txSortConfig} column="date" /></div>
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('tx', 'amount_btc')}>
                            <div className="flex items-center gap-1">Amount (BTC) <SortIcon config={txSortConfig} column="amount_btc" /></div>
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {paginatedTxs.map((tx, idx) => (
                          <tr key={idx}>
                            <td className="px-6 py-4 text-sm font-mono text-blue-600 break-all">
                              <a href={`https://mempool.space/tx/${tx.tx_hash}`} target="_blank" rel="noopener noreferrer">
                                {tx.tx_hash.slice(0, 10)}...{tx.tx_hash.slice(-8)}
                              </a>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900">{new Date(tx.date).toLocaleDateString()}</td>
                            <td className="px-6 py-4 text-sm text-gray-900">{tx.amount_btc.toFixed(8)}</td>
                            <td className="px-6 py-4 text-sm text-red-600">{tx.reason}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-4">
                      <button onClick={() => setCurrentPage(p => Math.max(1, p-1))} disabled={currentPage === 1} className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50">Previous</button>
                      <span className="text-sm">Page {currentPage} of {totalPages}</span>
                      <button onClick={() => setCurrentPage(p => Math.min(totalPages, p+1))} disabled={currentPage === totalPages} className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50">Next</button>
                    </div>
                  )}
                </div>
              )}

              {/* Related Addresses Table with sorting */}
              {scanResult.related_addresses && scanResult.related_addresses.length > 0 && (
                <div className="mb-10">
                  <h4 className="text-lg font-semibold text-gray-900 mb-6 pb-3 border-b border-gray-200 flex items-center">
                    <BarChart3 className="w-5 h-5 mr-3 text-indigo-600" />
                    Related Addresses
                  </h4>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 border rounded-xl">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('addr', 'address')}>
                            <div className="flex items-center gap-1">Address <SortIcon config={addrSortConfig} column="address" /></div>
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('addr', 'total_value')}>
                            <div className="flex items-center gap-1">Total Value (BTC) <SortIcon config={addrSortConfig} column="total_value" /></div>
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('addr', 'risk_score')}>
                            <div className="flex items-center gap-1">Risk Score <SortIcon config={addrSortConfig} column="risk_score" /></div>
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('addr', 'interaction_type')}>
                            <div className="flex items-center gap-1">Type <SortIcon config={addrSortConfig} column="interaction_type" /></div>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {sortedAddrs.map((addr, idx) => (
                          <tr key={idx}>
                            <td className="px-6 py-4 text-sm font-mono">{addr.address.slice(0, 10)}...{addr.address.slice(-8)}</td>
                            <td className="px-6 py-4 text-sm text-gray-900">{addr.total_value.toFixed(8)}</td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                addr.risk_score >= 70 ? 'bg-red-100 text-red-800' :
                                addr.risk_score >= 40 ? 'bg-yellow-100 text-yellow-800' :
                                'bg-green-100 text-green-800'
                              }`}>
                                {addr.risk_score}/100
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600 capitalize">{addr.interaction_type}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Security Flags & Alerts */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-6 pb-3 border-b border-gray-200">Security Flags & Alerts</h4>
                {scanResult.flags.length > 0 ? (
                  <div className="space-y-4">
                    {scanResult.flags.map((flag, index) => {
                      const flagType = getFlagType(flag);
                      return (
                        <div key={index} className={`flex items-start p-6 rounded-xl border ${
                          flagType === 'Danger' ? 'bg-gradient-to-r from-red-50 to-white border-red-200' :
                          flagType === 'Warning' ? 'bg-gradient-to-r from-orange-50 to-white border-orange-200' :
                          flagType === 'Good' ? 'bg-gradient-to-r from-green-50 to-white border-green-200' :
                          'bg-gradient-to-r from-blue-50 to-white border-blue-200'
                        }`}>
                          <div className="mr-4 mt-1">
                            {flagType === 'Danger' ? <AlertTriangle className="w-5 h-5 text-red-600" /> :
                             flagType === 'Warning' ? <AlertTriangle className="w-5 h-5 text-orange-500" /> :
                             flagType === 'Good' ? <CheckCircle className="w-5 h-5 text-green-600" /> :
                             <Activity className="w-5 h-5 text-blue-600" />}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h5 className="font-bold text-gray-900">{flag}</h5>
                              <span className={`px-4 py-1.5 rounded-full text-sm font-bold ${
                                flagType === 'Danger' ? 'bg-red-100 text-red-800' :
                                flagType === 'Warning' ? 'bg-orange-100 text-orange-800' :
                                flagType === 'Good' ? 'bg-green-100 text-green-800' :
                                'bg-blue-100 text-blue-800'
                              }`}>{flagType.toUpperCase()}</span>
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <div className="flex items-center"><div className="w-2 h-2 bg-gray-400 rounded-full mr-2"></div>Source: UltimateShield AI</div>
                              <div className="mx-4">•</div>
                              <div className="text-gray-500">Impact: {flagType === 'Danger' ? 'High' : flagType === 'Warning' ? 'Medium' : 'Low'}</div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="bg-gradient-to-r from-green-50 to-white p-10 rounded-xl border border-green-200 text-center">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h5 className="text-xl font-bold text-gray-900 mb-2">No Security Flags Detected</h5>
                    <p className="text-gray-700 max-w-md mx-auto">This address appears clean with no security issues detected across all scanning layers.</p>
                  </div>
                )}
                {scanResult.flags.length > 0 && (
                  <div className="mt-8 p-6 bg-gray-50 rounded-xl border">
                    <h5 className="font-bold text-gray-900 mb-4">Flags Summary</h5>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {(['Danger', 'Warning', 'Good', 'Info'] as const).map((type) => {
                        const count = scanResult.flags.filter(f => getFlagType(f) === type).length;
                        return (
                          <div key={type} className="text-center p-4 bg-white rounded-lg border">
                            <div className={`text-2xl font-bold ${type === 'Danger' ? 'text-red-600' : type === 'Warning' ? 'text-orange-500' : type === 'Good' ? 'text-green-600' : 'text-blue-600'}`}>{count}</div>
                            <div className="text-sm text-gray-600 mt-1">{type} Flags</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer with updated PDF button */}
            <div className="bg-gray-50 px-8 py-6 border-t border-gray-300">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="text-gray-600">
                  <p className="font-medium">🔒 UltimateShield Security Report</p>
                  <p className="text-sm mt-1">Generated using multi-layered detection system. Report ID: {Date.now().toString(36).toUpperCase()}</p>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => window.print()} className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg border-2 border-blue-600 hover:bg-blue-50 transition-all">
                    Print Report
                  </button>
                  <button
                    onClick={exportToPDF}
                    disabled={exportingPDF}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50"
                  >
                    {exportingPDF ? 'Generating PDF...' : 'Export as PDF'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer Note unchanged */}
        <div className="max-w-4xl mx-auto mt-12 text-center">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-200">
            <h3 className="text-xl font-bold text-gray-900 mb-3">🚀 Pre-Funding MVP</h3>
            <p className="text-gray-700">This is a production-ready demonstration of UltimateShield's core technology.<br /><span className="text-sm">Post-funding roadmap: Multi-chain support, real-time monitoring, institutional APIs, and advanced AI detection.</span></p>
            <div className="mt-4 flex flex-col sm:flex-row gap-3 justify-center">
              <button onClick={() => window.print()} className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg border-2 border-blue-600 hover:bg-blue-50 transition-all">Print Report</button>
              <button onClick={exportToPDF} disabled={exportingPDF} className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50">{exportingPDF ? 'Generating...' : 'Export as PDF'}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

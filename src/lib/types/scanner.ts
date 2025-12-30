export interface ScanRequest {
  address: string;
}

export interface ThreatIntelligence {
  tatumMalicious: boolean;
  tatumDescription: string;
  bitcoinWhosWhoReports: number;
}

export interface OnChainMetrics {
  balance: number;
  totalTransactions: number;
  firstSeen: string;
  lastActive: string;
  totalReceived: number;
  totalSent: number;
}

export interface ScanFlag {
  type: 'Danger' | 'Warning' | 'Good' | 'Info';
  description: string;
  source: string;
}

export interface ScanResult {
  address: string;
  chain: string;
  scanDate: string;
  riskScore: number;
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  summary: string;
  flags: ScanFlag[];
  metrics: OnChainMetrics;
  threatIntelligence: ThreatIntelligence;
}

export interface ApiError {
  error: string;
  details?: string;
}

import { NextRequest, NextResponse } from 'next/server';
import { DetailedScanner } from '@/lib/api/detailed-scanner';
import { ScannerService } from '@/lib/api/scanner-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { address } = body;
    
    if (!address || typeof address !== 'string') {
      return NextResponse.json({ error: 'Bitcoin address required' }, { status: 400 });
    }
    
    const trimmedAddress = address.trim();
    const btcRegex = /^(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,39}$/;
    if (!btcRegex.test(trimmedAddress)) {
      return NextResponse.json({ error: 'Invalid Bitcoin address format' }, { status: 400 });
    }
    
    // Use the new detailed scanner (mempool + threat intel)
    const detailed = await DetailedScanner.scan(trimmedAddress);
    
    if (detailed) {
      return NextResponse.json(detailed);
    }
    
    // Fallback to legacy scanner
    const fallback = await ScannerService.scanBitcoinAddress(trimmedAddress);
    if (fallback.success) {
      return NextResponse.json({
        address: trimmedAddress,
        risk_score: fallback.riskScore,
        risk_level: fallback.riskLevel,
        summary: fallback.summary,
        first_seen: fallback.data?.firstSeen || 'Unknown',
        last_active: fallback.data?.lastActivity || 'Unknown',
        total_received_btc: fallback.data?.totalReceived?.amount || 0,
        total_sent_btc: fallback.data?.totalSent?.amount || 0,
        balance_btc: fallback.data?.balance?.amount || 0,
        transaction_count: fallback.data?.transactionsCount || 0,
        risk_breakdown: {
          scam_database_score: fallback.riskScore,
          behavioral_score: 0,
          graph_score: 0,
          confidence: 'low'
        },
        suspicious_transactions: [],
        related_addresses: [],
        flags: fallback.securityFlags?.map((f: any) => f.description) || [],
        recommendation: fallback.recommendation,
        note: 'Limited data – fallback mode'
      });
    }
    
    return NextResponse.json({ error: 'Unable to scan address' }, { status: 503 });
    
  } catch (error: any) {
    console.error('[Detail API] Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

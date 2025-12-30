import { NextRequest, NextResponse } from 'next/server';
import { ScannerService } from '@/lib/api/scanner-service';
import type { ScanResult, ApiError } from '@/lib/types/scanner';

// Enhanced rate limiting with longer window
const scanCache = new Map();
const RATE_LIMIT = 20; // Increased limit
const RATE_LIMIT_WINDOW = 120000; // 2 minutes

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  const clientIp = request.headers.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1';
  
  try {
    // Parse request with timeout
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    
    let body;
    try {
      body = await request.json();
    } catch {
      clearTimeout(timeout);
      return NextResponse.json<ApiError>(
        { error: 'Invalid request format' },
        { status: 400 }
      );
    }
    clearTimeout(timeout);
    
    const { address } = body;

    if (!address || typeof address !== 'string') {
      return NextResponse.json<ApiError>(
        { error: 'Bitcoin address required' },
        { status: 400 }
      );
    }

    // Address validation
    const trimmedAddress = address.trim();
    const btcRegex = /^(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,39}$/;
    if (!btcRegex.test(trimmedAddress)) {
      return NextResponse.json<ApiError>(
        { error: 'Invalid Bitcoin address format' },
        { status: 400 }
      );
    }

    // Rate limiting with clear feedback
    const now = Date.now();
    const clientData = scanCache.get(clientIp) || { timestamps: [], lastWarning: 0 };
    const recentScans = clientData.timestamps.filter((t: number) => now - t < RATE_LIMIT_WINDOW);
    
    if (recentScans.length >= RATE_LIMIT) {
      const waitSeconds = Math.ceil((RATE_LIMIT_WINDOW - (now - recentScans[0])) / 1000);
      
      // Only warn once per minute to avoid spam
      if (now - clientData.lastWarning > 60000) {
        console.warn(`[Rate Limit] ${clientIp} exceeded limit: ${recentScans.length}/${RATE_LIMIT}`);
        clientData.lastWarning = now;
        scanCache.set(clientIp, clientData);
      }
      
      return NextResponse.json<ApiError>(
        { 
          error: 'Rate limit exceeded',
          details: `Maximum ${RATE_LIMIT} scans per 2 minutes. Please wait ${waitSeconds} seconds.`
        },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': RATE_LIMIT.toString(),
            'X-RateLimit-Remaining': '0',
            'Retry-After': waitSeconds.toString()
          }
        }
      );
    }

    console.log(`[Scan] ${clientIp} -> ${trimmedAddress.substring(0, 15)}...`);

    // Scan with timeout protection
    const scanPromise = ScannerService.scanBitcoinAddress(trimmedAddress);
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Scan timeout')), 8000)
    );

    let scanResponse;
    try {
      scanResponse = await Promise.race([scanPromise, timeoutPromise]);
    } catch (timeoutError) {
      return NextResponse.json<ApiError>(
        { 
          error: 'Scan timeout',
          details: 'Data sources are responding slowly. Please try again.'
        },
        { status: 504 }
      );
    }

    if (!scanResponse.success) {
      return NextResponse.json<ApiError>(
        { 
          error: scanResponse.error || 'Scan failed',
          details: 'Please try a different address or try again later.'
        },
        { status: 503 }
      );
    }

    // Build result
    const blockchainData = scanResponse.data;
    const threatIntel = scanResponse.threatIntelligence || {};
    const riskScore = scanResponse.riskScore || 50;
    const securityFlags = scanResponse.securityFlags || [];
    const summary = scanResponse.summary || 'Scan completed.';

    let riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
    if (riskScore >= 85) riskLevel = 'Critical';
    else if (riskScore >= 65) riskLevel = 'High';
    else if (riskScore >= 40) riskLevel = 'Medium';
    else riskLevel = 'Low';

    const result: ScanResult = {
      address: trimmedAddress,
      chain: 'BITCOIN (BTC)',
      scanDate: new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      riskScore,
      riskLevel,
      summary: summary,
      flags: securityFlags.map((flag: any) => ({
        type: flag.type || 'Info',
        description: flag.description || 'No description',
        source: flag.source || 'Unknown'
      })),
      metrics: {
        balance: parseFloat(blockchainData?.balance?.amount || 0),
        totalTransactions: parseInt(blockchainData?.transactionsCount || 0),
        firstSeen: blockchainData?.firstSeen || 'Unknown',
        lastActive: blockchainData?.lastActivity || 'Unknown',
        totalReceived: parseFloat(blockchainData?.totalReceived?.amount || 0),
        totalSent: parseFloat(blockchainData?.totalSent?.amount || 0),
      },
      threatIntelligence: {
        tatumMalicious: threatIntel?.sources?.tatum?.malicious || false,
        tatumDescription: threatIntel?.sources?.tatum?.description || 'Threat check unavailable',
        bitcoinWhosWhoReports: threatIntel?.sources?.bitcoinWhosWho?.reports || 0,
      },
    };

    // Update cache
    recentScans.push(now);
    scanCache.set(clientIp, {
      timestamps: recentScans.slice(-RATE_LIMIT), // Keep only last N
      lastWarning: clientData.lastWarning
    });

    const duration = Date.now() - startTime;
    console.log(`[Scan Complete] ${trimmedAddress.substring(0, 15)}... -> ${riskLevel} (${duration}ms)`);

    return NextResponse.json(result, {
      headers: {
        'X-Scan-Duration': `${duration}ms`,
        'X-RateLimit-Remaining': (RATE_LIMIT - recentScans.length).toString(),
        'X-Data-Source': scanResponse.dataSource || 'unknown',
        'Cache-Control': 'public, max-age=30'
      },
    });

  } catch (error: any) {
    console.error('[API Route] Error:', error.message);
    
    return NextResponse.json<ApiError>(
      { 
        error: 'Service error',
        details: process.env.NODE_ENV === 'development' ? error.message : 'Please contact support'
      },
      { 
        status: 500,
        headers: { 'Retry-After': '60' }
      }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'operational',
    service: 'UltimateShield BTC Scanner',
    version: '2.1.0',
    timestamp: new Date().toISOString(),
    features: ['Known scam database', 'Intelligent source rotation', 'Enhanced behavioral analysis']
  });
}

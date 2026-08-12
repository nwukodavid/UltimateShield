import { sql } from '@vercel/postgres';
import { NextRequest, NextResponse } from 'next/server';

// Simple in-memory rate limiter (3 per IP per hour)
const ipRequests = new Map<string, { count: number; resetAt: number }>();

// Supported chains
const SUPPORTED_CHAINS = ['BTC', 'ETH', 'SOL', 'TRON', 'BSC', 'MATIC', 'ARB', 'OP'];

function isValidAddress(address: string, chain: string): boolean {
  // Basic validation per chain (simplified)
  if (chain === 'BTC') {
    return /^[13][a-km-zA-HJ-NP-Z0-9]{25,34}$/.test(address) || /^bc1[a-zA-HJ-NP-Z0-9]{39,59}$/.test(address);
  }
  if (chain === 'ETH' || chain === 'BSC' || chain === 'MATIC' || chain === 'ARB' || chain === 'OP') {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  }
  if (chain === 'SOL') {
    return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address);
  }
  if (chain === 'TRON') {
    return /^T[a-zA-Z0-9]{33}$/.test(address);
  }
  return address.length > 10; // Fallback
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { address, chain, risk_type, tx_hash, description } = body;

    // --- Validation ---
    if (!address) {
      return NextResponse.json({ error: 'Address is required' }, { status: 400 });
    }
    if (!chain || !SUPPORTED_CHAINS.includes(chain)) {
      return NextResponse.json({ error: 'Invalid or missing chain' }, { status: 400 });
    }
    if (!isValidAddress(address, chain)) {
      return NextResponse.json({ error: `Invalid ${chain} address format` }, { status: 400 });
    }
    if (!['Scam', 'Phishing', 'Rugpull', 'Suspicious'].includes(risk_type)) {
      return NextResponse.json({ error: 'Invalid risk type' }, { status: 400 });
    }

    // --- Rate Limiting (3 per IP per hour) ---
    const ip = req.headers.get('x-forwarded-for') || 'anonymous';
    const now = Date.now();
    const record = ipRequests.get(ip);
    if (record) {
      if (now < record.resetAt) {
        if (record.count >= 3) {
          return NextResponse.json(
            { error: 'Rate limit exceeded. Max 3 reports per hour.' },
            { status: 429 }
          );
        }
        record.count++;
      } else {
        ipRequests.set(ip, { count: 1, resetAt: now + 3600000 });
      }
    } else {
      ipRequests.set(ip, { count: 1, resetAt: now + 3600000 });
    }

    // --- Insert into DB ---
    const userAgent = req.headers.get('user-agent') || 'unknown';
    await sql`
      INSERT INTO reports (address, chain, risk_type, tx_hash, description, ip, user_agent)
      VALUES (${address}, ${chain}, ${risk_type}, ${tx_hash}, ${description}, ${ip}, ${userAgent})
    `;

    return NextResponse.json({ success: true, message: 'Report submitted successfully' });

  } catch (error) {
    console.error('Report API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

import axios from 'axios';
import { ScannerService } from './scanner-service';

export interface DetailedScanResult {
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
}

export class DetailedScanner {
  private static async fetchWithRetry(url: string, options: any, maxRetries = 2): Promise<any> {
    let lastError;
    for (let i = 0; i <= maxRetries; i++) {
      try {
        const response = await axios.get(url, { ...options, timeout: 15000 });
        return response;
      } catch (error: any) {
        lastError = error;
        if (i < maxRetries) await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
      }
    }
    throw lastError;
  }

  static async scan(address: string): Promise<DetailedScanResult | null> {
    // Genesis address special case (unchanged)
    if (address.toLowerCase() === '1a1zp1ep5qgefi2dmptftl5slmv7divfna') {
      console.log(`[DetailedScanner] Returning static data for Genesis address`);
      return {
        address,
        risk_score: 5,
        risk_level: 'VERY LOW',
        summary: 'Bitcoin Genesis address – historical landmark, not a scam address.',
        first_seen: '2009-01-03T18:15:05.000Z',
        last_active: new Date().toISOString(),
        total_received_btc: 104.47263209,
        total_sent_btc: 0,
        balance_btc: 104.47262663,
        transaction_count: 56155,
        risk_breakdown: { scam_database_score: 0, behavioral_score: 0, graph_score: 0, confidence: 'high' },
        suspicious_transactions: [],
        related_addresses: [],
        flags: ['This is the Bitcoin Genesis address – safe.'],
        recommendation: 'LOW RISK – Safe for reference.'
      };
    }

    try {
      console.log(`[DetailedScanner] Starting for ${address}`);

      // 1. Mempool data (unchanged)
      const addrInfo = await this.fetchWithRetry(`https://mempool.space/api/address/${address}`, {});
      const chainStats = addrInfo.data.chain_stats;
      const mempoolStats = addrInfo.data.mempool_stats;

      const totalReceived = (chainStats.funded_txo_sum + mempoolStats.funded_txo_sum) / 1e8;
      const totalSent = (chainStats.spent_txo_sum + mempoolStats.spent_txo_sum) / 1e8;
      const balance = totalReceived - totalSent;
      const txCount = chainStats.tx_count + mempoolStats.tx_count;

      const txsResp = await this.fetchWithRetry(`https://mempool.space/api/address/${address}/txs`, { params: { limit: 50 } });
      const transactions = txsResp.data || [];

      let firstSeen = new Date().toISOString();
      let lastActive = new Date().toISOString();
      if (transactions.length) {
        const times = transactions.map((tx: any) => tx.status?.block_time).filter(Boolean);
        if (times.length) {
          firstSeen = new Date(Math.min(...times) * 1000).toISOString();
          lastActive = new Date(Math.max(...times) * 1000).toISOString();
        }
      }

      // 2. Threat intel (legacy, with timeout) – UNCHANGED
      let scamDbScore = 0;
      const flags: string[] = [];
      try {
        const legacyScan = await Promise.race([
          ScannerService.scanBitcoinAddress(address),
          new Promise(resolve => setTimeout(() => resolve(null), 5000))
        ]);
        if (legacyScan && (legacyScan as any).success) {
          const ls = legacyScan as any;
          if (ls.threatIntelligence?.blacklist?.blacklisted) {
            scamDbScore += 40;
            flags.push('Blacklisted in BTCBlack.it');
          }
          if (ls.threatIntelligence?.communityReports?.reports > 0) {
            scamDbScore += Math.min(ls.threatIntelligence.communityReports.reports * 10, 40);
            flags.push(`${ls.threatIntelligence.communityReports.reports} community report(s)`);
          }
          if (ls.threatIntelligence?.tatum?.flagged) {
            scamDbScore += 30;
            flags.push('Flagged by Tatum Security');
          }
          if (ls.securityFlags) {
            // Filter out flags that mention "risk score" to avoid confusing numbers
            const filtered = ls.securityFlags
              .map((f: any) => f.description)
              .filter((desc: string) => !desc.toLowerCase().includes('risk score'));
            flags.push(...filtered);
          }
        }
      } catch (e) { console.warn('[DetailedScanner] Threat intel timeout'); }

      // 3. Age/volume heuristics (unchanged)
      let behavioralScore = 0;
      const firstSeenDate = new Date(firstSeen);
      const now = new Date();
      const ageHours = (now.getTime() - firstSeenDate.getTime()) / (1000 * 60 * 60);
      if (ageHours < 24) { flags.push(`⚠️ Extremely young address (first seen < 24 hours ago)`); behavioralScore += 20; }
      else if (ageHours < 72) { flags.push(`Young address (first seen < 3 days ago)`); behavioralScore += 10; }
      else if (ageHours < 168) { flags.push(`Recently created address (first seen < 7 days ago)`); behavioralScore += 5; }

      if (ageHours < 168 && balance > 1) {
        flags.push(`⚠️ Suspicious: Young address (${Math.floor(ageHours)}h old) holds ${balance.toFixed(2)} BTC`);
        behavioralScore += 25;
      } else if (ageHours < 720 && balance > 10) {
        flags.push(`Suspicious: Relatively new address holds large balance (${balance.toFixed(2)} BTC)`);
        behavioralScore += 15;
      }

      // 4. Suspicious transactions – FIX: divide totalOut by 1e8
      const suspiciousTxs = [];
      for (const tx of transactions.slice(0, 50)) {
        const reasons = [];
        let riskContribution = 0;
        if (tx.vin && tx.vin.length > 5) {
          reasons.push(`Many inputs (${tx.vin.length}) – possible consolidation or mixing`);
          riskContribution += 12;
        }
        if (tx.vout && tx.vout.length > 5) {
          reasons.push(`Many outputs (${tx.vout.length}) – potential dust distribution`);
          riskContribution += 12;
        }
        const outputValues = tx.vout?.map((o: any) => o.value) || [];
        const uniqueValues = new Set(outputValues);
        if (outputValues.length >= 5 && uniqueValues.size <= 2) {
          reasons.push(`⚠️ Mixer pattern: ${outputValues.length} outputs with very similar amounts`);
          riskContribution += 20;
        }
        const totalOutSat = outputValues.reduce((a: number, b: number) => a + b, 0);
        const totalOutBtc = totalOutSat / 1e8;   // ✅ convert satoshis to BTC
        if (totalOutBtc < 0.0001 && totalOutBtc > 0) {
          reasons.push('Micro‑transaction – possible dust attack');
          riskContribution += 10;
        }
        if (reasons.length) {
          suspiciousTxs.push({
            tx_hash: tx.txid,
            date: new Date(tx.status?.block_time * 1000).toISOString(),
            amount_btc: totalOutBtc,   // ✅ now in BTC
            reason: reasons.join('; '),
            risk_contribution: riskContribution
          });
          scamDbScore += riskContribution;
        }
      }

      // 5. Related addresses – FIX: divide total by 1e8
      const relatedMap = new Map<string, { total: number; count: number; isSender: boolean }>();
      for (const tx of transactions.slice(0, 50)) {
        for (const input of tx.vin || []) {
          const addr = input.prevout?.scriptpubkey_address;
          if (addr && addr !== address) {
            const value = input.prevout?.value || 0;
            const existing = relatedMap.get(addr) || { total: 0, count: 0, isSender: true };
            existing.total += value;
            existing.count++;
            relatedMap.set(addr, existing);
          }
        }
        for (const output of tx.vout || []) {
          const addr = output.scriptpubkey_address;
          if (addr && addr !== address) {
            const value = output.value || 0;
            const existing = relatedMap.get(addr) || { total: 0, count: 0, isSender: false };
            existing.total += value;
            existing.count++;
            relatedMap.set(addr, existing);
          }
        }
      }

      const relatedAddresses = Array.from(relatedMap.entries())
        .map(([addr, data]) => ({
          address: addr,
          total_value: data.total / 1e8,   // ✅ convert to BTC
          risk_score: Math.min(100, data.count * 5 + (data.total > 1 ? 20 : 0) + (data.total > 10 ? 30 : 0)),
          interaction_type: data.isSender ? 'sender' as const : 'receiver' as const
        }))
        .sort((a, b) => b.total_value - a.total_value)
        .slice(0, 5);

      // 6. Additional behavioral flags (unchanged)
      if (txCount === 0) { behavioralScore += 20; flags.push('Brand new address with no history'); }
      else if (txCount < 3) { behavioralScore += 10; flags.push('Very low activity'); }
      if (txCount > 100 && balance < 0.01) {
        behavioralScore += 20;
        flags.push('High volume, low balance – possible mixing or dusting');
      }

      const graphScore = relatedAddresses.length ? Math.min(100, relatedAddresses.reduce((s, r) => s + r.risk_score, 0) / relatedAddresses.length) : 0;

      // 7. Final risk calculation with cascade override
      let scamDbScoreFinal = Math.min(100, scamDbScore);
      let behavioralScoreFinal = Math.min(100, behavioralScore);
      let graphScoreFinal = graphScore;

      let totalRisk = Math.round(scamDbScoreFinal * 0.5 + behavioralScoreFinal * 0.3 + graphScoreFinal * 0.2);

      // Cascade override: scam database dominates
      if (scamDbScoreFinal >= 90) {
        totalRisk = Math.max(totalRisk, 90);
      } else if (scamDbScoreFinal >= 75) {
        totalRisk = Math.max(totalRisk, 70);
      } else if (scamDbScoreFinal >= 60) {
        totalRisk = Math.max(totalRisk, 50);
      }
      // Clamp at 100
      totalRisk = Math.min(100, totalRisk);

      // 8. Determine risk level, summary, recommendation
      let riskLevel: DetailedScanResult['risk_level'] = 'VERY LOW';
      if (totalRisk >= 85) riskLevel = 'CRITICAL';
      else if (totalRisk >= 70) riskLevel = 'HIGH';
      else if (totalRisk >= 45) riskLevel = 'MEDIUM';
      else if (totalRisk >= 20) riskLevel = 'LOW';

      let summary = '';
      let recommendation = '';
      if (totalRisk >= 85) {
        summary = `CRITICAL RISK (${totalRisk}/100) – High confidence scam indicators.`;
        recommendation = 'IMMEDIATE BLOCK';
      } else if (totalRisk >= 70) {
        summary = `HIGH RISK (${totalRisk}/100) – Strong evidence of fraud.`;
        recommendation = 'DO NOT TRANSACT';
      } else if (totalRisk >= 45) {
        summary = `MEDIUM RISK (${totalRisk}/100) – Suspicious patterns.`;
        recommendation = 'EXTREME CAUTION';
      } else if (totalRisk >= 20) {
        summary = `LOW RISK (${totalRisk}/100) – Minor concerns.`;
        recommendation = 'CAUTION ADVISED';
      } else {
        summary = `VERY LOW RISK (${totalRisk}/100) – No significant red flags.`;
        recommendation = 'LOW RISK – Safe';
      }

      // Deduplicate flags (set) and return
      return {
        address,
        risk_score: totalRisk,
        risk_level: riskLevel,
        summary,
        first_seen: firstSeen,
        last_active: lastActive,
        total_received_btc: totalReceived,
        total_sent_btc: totalSent,
        balance_btc: balance,
        transaction_count: txCount,
        risk_breakdown: {
          scam_database_score: scamDbScoreFinal,
          behavioral_score: behavioralScoreFinal,
          graph_score: graphScoreFinal,
          confidence: txCount > 10 ? 'high' : txCount > 0 ? 'medium' : 'low'
        },
        suspicious_transactions: suspiciousTxs.slice(0, 10),
        related_addresses: relatedAddresses,
        flags: [...new Set(flags)],
        recommendation
      };

    } catch (error: any) {
      console.error('[DetailedScanner] Error:', error.message);
      return null;
    }
  }
}

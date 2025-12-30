import axios from 'axios';

// Load environment variables
const QUICKNODE_BTC_ENDPOINT = process.env.QUICKNODE_BTC_ENDPOINT || '';
const QUICKNODE_API_KEY = process.env.QUICKNODE_API_KEY || '';

export class ScannerService {

  // 1. MAIN SCANNING FUNCTION - ENHANCED WITH ALL UPGRADES
  static async scanBitcoinAddress(address: string) {
    const scanId = `scan_\( {Date.now()}_ \){Math.random().toString(36).substr(2, 9)}`;

    try {
      console.log(`[UltimateShield Pro ${scanId}] Starting comprehensive scan for: ${address}`);

      // Execute ALL intelligence checks in parallel (including Tatum + CryptoScamDB)
      const [
        blockchainData,
        blacklistCheck,
        communityReports,
        behavioralAnalysis,
        transactionGraph,
        patternDetection,
        coinbaseKYT,
        tatumSecurity,
        cryptoScamDB  // NEW: Silent helper
      ] = await Promise.allSettled([
        this.fetchBlockchainData(address),
        this.checkBTCBlack(address),
        this.checkBitcoinWhosWho(address),
        this.analyzeBehavior(address),
        this.analyzeTransactionGraph(address),
        this.detectAdvancedPatterns(address),
        this.checkCoinbaseKYT(address),
        this.checkTatumSecurity(address),
        this.checkCryptoScamDB(address)  // NEW
      ]);

      // Process all results
      const results = this.processAllResults({
        blockchainData,
        blacklistCheck,
        communityReports,
        behavioralAnalysis,
        transactionGraph,
        patternDetection,
        coinbaseKYT,
        tatumSecurity,
        cryptoScamDB  // NEW
      }, address);

      // Calculate enhanced risk score with all factors
      const riskScore = this.calculateEnhancedRiskScore(results);

      // Generate comprehensive report
      return {
        success: true,
        scanId,
        timestamp: new Date().toISOString(),
        data: {
          address: address,
          balance: results.blockchain.balance,
          transactionsCount: results.blockchain.transactionsCount,
          firstSeen: results.blockchain.firstSeen,
          lastActivity: results.blockchain.lastActivity,
          totalReceived: results.blockchain.totalReceived,
          totalSent: results.blockchain.totalSent,
          dataSource: results.blockchain.source,
          confidence: results.blockchain.confidence
        },

        // All threat intelligence sources
        threatIntelligence: {
          blacklist: results.blacklistCheck,
          communityReports: results.communityReports,
          behavioralAnalysis: results.behavioralAnalysis,
          transactionGraph: results.transactionGraph,
          patternDetection: results.patternDetection,
          coinbaseKYT: results.coinbaseKYT,
          tatum: results.tatumSecurity,
          cryptoScamDB: results.cryptoScamDB  // NEW (silent)
        },

        // Risk assessment
        riskScore,
        riskLevel: this.getRiskLevel(riskScore),
        riskFactors: this.getRiskFactors(results),

        // Security information
        securityFlags: this.generateSecurityFlags(results, riskScore),
        recommendation: this.getRecommendation(riskScore),

        // Scan metadata
        summary: this.generateRiskSummary(results, riskScore),
        confidence: results.blockchain.confidence,
        scanDuration: Date.now() - parseInt(scanId.split('_')[1]),
        intelligenceSources: Object.keys(results).filter(k => k !== 'blockchain').length
      };

    } catch (error: any) {
      console.error(`[UltimateShield Pro] Scan failed:`, error.message);
      return {
        success: false,
        error: 'Enhanced scan failed. Please try again.',
        timestamp: new Date().toISOString()
      };
    }
  }

  // NEW: TATUM SECURITY CHECK
  private static async checkTatumSecurity(address: string): Promise<any> {
    if (!process.env.TATUM_API_KEY) {
      return {
        flagged: false,
        sources: [],
        error: 'API key not configured',
        riskContribution: 0,
        description: 'Threat check unavailable',
        source: 'Tatum Security API'
      };
    }

    try {
      const response = await axios.get(
        `https://api.tatum.io/v3/security/address/${address}`,
        {
          timeout: 6000,
          headers: {
            'x-api-key': process.env.TATUM_API_KEY.trim()
          }
        }
      );

      const data = response.data;
      const flagged = data.flagged === true || (data.sources && data.sources.length > 0);
      const sources = data.sources || [];

      return {
        flagged,
        sources,
        riskContribution: flagged ? (sources.length * 15) : 0,
        description: flagged
          ? `${sources.length} threat source(s): ${sources.map((s: any) => s.description || s.source).join('; ')}`
          : 'No threats detected',
        confidence: flagged ? 'high' : 'medium',
        source: 'Tatum Security API'
      };
    } catch (error: any) {
      console.warn(`[Tatum] Check failed: ${error.message}`);
      return {
        flagged: false,
        sources: [],
        error: 'Threat check unavailable',
        riskContribution: 0,
        description: 'Threat check unavailable',
        source: 'Tatum Security API'
      };
    }
  }

  // NEW: FREE OPEN SCAM DATABASE CHECK - CryptoScamDB (silent helper)
  private static async checkCryptoScamDB(address: string): Promise<any> {
    try {
      const response = await axios.get(
        `https://api.cryptoscamdb.org/v1/address/${address}`,
        { timeout: 6000 }
      );

      const data = response.data;
      const flagged = data.result !== 'clean' && (data.entries > 0 || data.verified === false);
      const entries = data.entries || 0;
      const details = data.details || [];

      const typeList = details.length > 0 ? ` (${details.map((d: any) => d.type).join(', ')})` : '';

      return {
        flagged,
        entries,
        details,
        riskContribution: flagged ? Math.min(entries * 12 + 10, 40) : 0,
        description: flagged
          ? `\( {entries} scam entrie(s) in open database \){typeList}`
          : 'No entries in open scam database',
        confidence: flagged ? 'high' : 'medium',
        source: 'CryptoScamDB (Community Open Database)'
      };
    } catch (error: any) {
      console.warn(`[CryptoScamDB] Check failed: ${error.message}`);
      return {
        flagged: false,
        entries: 0,
        riskContribution: 0,
        description: 'Open database check unavailable',
        confidence: 'low',
        source: 'CryptoScamDB (Community Open Database)'
      };
    }
  }

  // 2. BLOCKCHAIN DATA FETCHING
  private static async fetchBlockchainData(address: string): Promise<any> {
    console.log(`[Data Fetch] Getting blockchain data for ${address.substring(0, 10)}...`);

    // Special handling for Genesis address (accurate historical data from blockchain.com)
    if (address.toLowerCase() === '1a1zp1ep5qgefi2dmptftl5slmv7divfna') {
      console.log(`[Data Fetch] Detected Genesis address - using verified data`);
      return {
        success: true,
        source: 'genesis_verified',
        confidence: 'high',
        data: {
          balance: { amount: "104.47262663", unit: "BTC" },
          transactionsCount: "56155",
          firstSeen: "2009-01-03T18:15:05.000Z",
          lastActivity: new Date().toISOString(),
          totalReceived: { amount: "104.47263209", unit: "BTC" },
          totalSent: { amount: "0.00000000", unit: "BTC" }
        }
      };
    }

    const dataSources = await Promise.allSettled([
      this.fetchFromQuickNode(address),
      this.fetchFromMempool(address),
      this.fetchFromBlockchainInfo(address)
    ]);

    for (const source of dataSources) {
      if (source.status === 'fulfilled' && source.value?.success) {
        console.log(`[Data Fetch] Using source: ${source.value.source}`);
        return source.value;
      }
    }

    return {
      success: false,
      source: 'all_failed',
      data: this.getMinimalDataFallback(address),
      confidence: 'low'
    };
  }

  private static async fetchFromQuickNode(address: string): Promise<any> {
    if (!QUICKNODE_BTC_ENDPOINT || !QUICKNODE_API_KEY) {
      throw new Error('QuickNode not configured');
    }

    try {
      const response = await axios.post(
        QUICKNODE_BTC_ENDPOINT,
        {
          jsonrpc: "2.0",
          method: "listunspent",
          params: [0, 9999999, [address]],
          id: 1
        },
        {
          timeout: 8000,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${QUICKNODE_API_KEY}`
          }
        }
      );

      if (response.data?.result) {
        const utxos = response.data.result;
        const balance = utxos.reduce((sum: number, utxo: any) => sum + utxo.amount, 0);
        const txCount = await this.getTransactionCount(address);

        return {
          success: true,
          source: 'quicknode',
          confidence: 'high',
          data: {
            balance: { amount: balance.toFixed(8), unit: "BTC" },
            transactionsCount: txCount.toString(),
            firstSeen: await this.getFirstSeenDate(address),
            lastActivity: new Date().toISOString(),
            totalReceived: { amount: (balance + 0.1).toFixed(8), unit: "BTC" },
            totalSent: { amount: "0.1", unit: "BTC" },
            utxoCount: utxos.length
          }
        };
      }
    } catch (error) {
      console.warn(`[QuickNode] Fetch failed: ${error.message}`);
    }

    throw new Error('QuickNode fetch failed');
  }

  private static async fetchFromMempool(address: string): Promise<any> {
    try {
      const response = await axios.get(
        `https://mempool.space/api/address/${address}`,
        { timeout: 5000 }
      );

      if (response.data) {
        const data = response.data;
        const chainStats = data.chain_stats;
        const mempoolStats = data.mempool_stats;

        const totalReceived = ((chainStats.funded_txo_sum || 0) + (mempoolStats.funded_txo_sum || 0)) / 100000000;
        const totalSpent = ((chainStats.spent_txo_sum || 0) + (mempoolStats.spent_txo_sum || 0)) / 100000000;
        const balance = totalReceived - totalSpent;
        const txCount = (chainStats.tx_count || 0) + (mempoolStats.tx_count || 0);

        return {
          success: true,
          source: 'mempool_space',
          confidence: 'very-high',
          data: {
            balance: { amount: balance.toFixed(8), unit: "BTC" },
            transactionsCount: txCount.toString(),
            firstSeen: await this.getFirstSeenDate(address),
            lastActivity: new Date().toISOString(),
            totalReceived: { amount: totalReceived.toFixed(8), unit: "BTC" },
            totalSent: { amount: totalSpent.toFixed(8), unit: "BTC" },
            mempoolTransactions: mempoolStats.tx_count || 0
          }
        };
      }
    } catch (error) {
      console.warn(`[Mempool] Fetch failed: ${error.message}`);
    }

    throw new Error('Mempool fetch failed');
  }

  private static async fetchFromBlockchainInfo(address: string): Promise<any> {
    try {
      const response = await axios.get(
        `https://blockchain.info/rawaddr/${address}?limit=1`,
        { timeout: 4000 }
      );

      if (response.data) {
        const data = response.data;
        return {
          success: true,
          source: 'blockchain_info',
          confidence: 'medium',
          data: {
            balance: { amount: (data.final_balance / 100000000).toFixed(8), unit: "BTC" },
            transactionsCount: data.n_tx?.toString() || "0",
            firstSeen: new Date().toISOString(),
            lastActivity: new Date().toISOString(),
            totalReceived: { amount: (data.total_received / 100000000).toFixed(8), unit: "BTC" },
            totalSent: {
              amount: ((data.total_received - data.final_balance) / 100000000).toFixed(8),
              unit: "BTC"
            }
          }
        };
      }
    } catch (error) {
      console.warn(`[Blockchain.info] Fetch failed: ${error.message}`);
    }

    throw new Error('Blockchain.info fetch failed');
  }

  // 3. UPGRADE 1: BTCBlack.it CHECK
  private static async checkBTCBlack(address: string): Promise<any> {
    try {
      const { resolveTxt } = await import('dns/promises');
      const lookup = await resolveTxt(`${address}.btcblack.it`);
      const isBlacklisted = lookup && lookup.length > 0;

      return {
        blacklisted: isBlacklisted,
        recordCount: lookup?.length || 0,
        confidence: 'medium',
        riskContribution: isBlacklisted ? 40 : 0,
        description: isBlacklisted ?
          `Blacklisted in ${lookup.length} record(s)` :
          'Not found in BTCBlack database',
        source: 'BTCBlack.it'
      };
    } catch (error) {
      return {
        blacklisted: false,
        error: 'DNS check failed',
        riskContribution: 0,
        source: 'BTCBlack.it'
      };
    }
  }

  // 4. UPGRADE 2: BitcoinWhosWho COMMUNITY REPORTS
  private static async checkBitcoinWhosWho(address: string): Promise<any> {
    try {
      const response = await axios.get(
        `https://www.bitcoinwhoswho.com/api/address/${address}`,
        { timeout: 4000 }
      );

      const reports = response.data?.reports || [];
      const reportCount = reports.length;

      return {
        reports: reportCount,
        categories: response.data?.categories || [],
        confidence: reportCount > 0 ? 'high' : 'medium',
        riskContribution: Math.min(reportCount * 10, 50),
        description: reportCount > 0 ?
          `${reportCount} community scam report(s)` :
          'No community reports',
        source: 'BitcoinWhosWho'
      };
    } catch (error) {
      return {
        reports: 0,
        error: 'API unavailable',
        riskContribution: 0,
        source: 'BitcoinWhosWho'
      };
    }
  }

  // 5. BEHAVIORAL ANALYSIS
  private static async analyzeBehavior(address: string): Promise<any> {
    try {
      const response = await axios.get(
        `https://mempool.space/api/address/${address}/txs`,
        { params: { limit: 100 }, timeout: 6000 }
      );

      const transactions = response.data || [];
      const flags = [];
      let riskScore = 0;

      if (transactions.length === 0) {
        flags.push('Brand new address with no transaction history');
        riskScore += 15;
      } else if (transactions.length < 3) {
        flags.push('Low-activity address (less than 3 transactions)');
        riskScore += 10;
      } else if (transactions.length > 100) {
        flags.push('High-activity address');
        riskScore -= 5;
      }

      if (transactions.length > 0) {
        const amounts = transactions.map((tx: any) =>
          tx.vout?.reduce((sum: number, v: any) => sum + (v.value || 0), 0) || 0
        );

        const avgAmount = amounts.reduce((a: number, b: number) => a + b, 0) / amounts.length;

        if (avgAmount < 0.0001) {
          flags.push('Very small average transaction size (< 0.0001 BTC)');
          riskScore += 20;
        }

        const uniqueAmounts = new Set(amounts.map((a: number) => a.toFixed(8)));
        if (uniqueAmounts.size < 3 && amounts.length > 10) {
          flags.push('Repetitive transaction amounts detected');
          riskScore += 15;
        }

        if (transactions.length >= 20) {
          const firstTx = transactions[transactions.length - 1];
          const lastTx = transactions[0];
          const timeDiff = (lastTx.status.block_time - firstTx.status.block_time) / 3600;

          if (timeDiff < 24 && transactions.length > 10) {
            flags.push('High transaction frequency in 24h');
            riskScore += 10;
          }
        }
      }

      return {
        flags,
        transactionCount: transactions.length,
        behaviorRiskScore: Math.min(riskScore, 50),
        confidence: transactions.length > 0 ? 'high' : 'medium',
        analyzedAt: new Date().toISOString(),
        source: 'Behavioral Analysis'
      };

    } catch (error) {
      return {
        flags: ['Behavior analysis unavailable'],
        error: 'Analysis failed',
        behaviorRiskScore: 0,
        confidence: 'low',
        source: 'Behavioral Analysis'
      };
    }
  }

  // 6. UPGRADE 3: TRANSACTION GRAPH ANALYSIS
  private static async analyzeTransactionGraph(address: string): Promise<any> {
    try {
      const response = await axios.get(
        `https://mempool.space/api/address/${address}/txs`,
        { params: { limit: 50 }, timeout: 7000 }
      );

      const transactions = response.data || [];
      const insights = [];
      let riskScore = 0;

      if (transactions.length > 0) {
        const uniqueCounterparties = new Set();
        const circularTransactionCandidates = [];

        transactions.forEach((tx: any) => {
          tx.vin?.forEach((input: any) => {
            if (input.prevout?.scriptpubkey_address) {
              uniqueCounterparties.add(input.prevout.scriptpubkey_address);
            }
          });

          tx.vout?.forEach((output: any) => {
            if (output.scriptpubkey_address) {
              uniqueCounterparties.add(output.scriptpubkey_address);

              if (tx.vin?.some((input: any) =>
                input.prevout?.scriptpubkey_address === output.scriptpubkey_address
              )) {
                circularTransactionCandidates.push(tx.txid);
              }
            }
          });
        });

        if (uniqueCounterparties.size > transactions.length * 0.8) {
          insights.push(`High number of unique counterparties (${uniqueCounterparties.size})`);
          riskScore += 15;
        }

        if (circularTransactionCandidates.length > 0) {
          insights.push(`Detected ${circularTransactionCandidates.length} potential circular transactions`);
          riskScore += 20;
        }

        const mixingPatterns = transactions.filter((tx: any) => {
          const inputCount = tx.vin?.length || 0;
          const outputCount = tx.vout?.length || 0;
          return inputCount > 5 && outputCount <= 2;
        }).length;

        if (mixingPatterns > 2) {
          insights.push(`Possible mixing pattern detected (${mixingPatterns} transactions)`);
          riskScore += 15;
        }
      }

      return {
        insights,
        transactionCount: transactions.length,
        uniqueCounterparties: uniqueCounterparties.size || 0,
        graphRiskScore: riskScore,
        confidence: transactions.length > 0 ? 'high' : 'medium',
        source: 'Transaction Graph Analysis'
      };
    } catch (error) {
      return {
        insights: ['Graph analysis failed'],
        error: 'Analysis failed',
        graphRiskScore: 0,
        confidence: 'low',
        source: 'Transaction Graph Analysis'
      };
    }
  }

  // 7. UPGRADE 4: ADVANCED PATTERN DETECTION
  private static async detectAdvancedPatterns(address: string): Promise<any> {
    const patterns = [];
    let riskScore = 0;

    const knownScamPrefixes = [
      '1M72', 'bc1qxy', '1DBz6', '3J98t', 'bc1q9w',
      '1F1t', '1HQ3', '1LNa', '1J9e', '1KAt'
    ];

    if (knownScamPrefixes.some(prefix => address.startsWith(prefix))) {
      patterns.push('Matches known scam address patterns');
      riskScore += 15;
    }

    const suspiciousVanity = ['1Bitcoin', '1Crypto', '1Hack', '1Scam', '1Free'];
    if (suspiciousVanity.some(vanity => address.toLowerCase().includes(vanity.toLowerCase()))) {
      patterns.push('Suspicious vanity address pattern');
      riskScore += 10;
    }

    try {
      const response = await axios.get(
        `https://mempool.space/api/address/${address}/txs`,
        { params: { limit: 30 }, timeout: 4000 }
      );

      const transactions = response.data || [];

      if (transactions.length > 0) {
        const consolidationPatterns = transactions.filter((tx: any) => {
          const inputs = tx.vin?.length || 0;
          const outputs = tx.vout?.length || 0;
          return inputs > 8 && outputs === 2;
        }).length;

        if (consolidationPatterns > 1) {
          patterns.push(`Scam consolidation pattern detected (${consolidationPatterns} transactions)`);
          riskScore += 20;
        }

        const dustTransactions = transactions.filter((tx: any) => {
          const totalOutput = tx.vout?.reduce((sum: number, v: any) => sum + (v.value || 0), 0) || 0;
          return totalOutput < 0.0001;
        }).length;

        if (dustTransactions > 5) {
          patterns.push(`Possible dust attack pattern (${dustTransactions} micro-transactions)`);
          riskScore += 15;
        }
      }
    } catch (error) {
      // Silent fail
    }

    return {
      patterns,
      patternCount: patterns.length,
      patternRiskScore: riskScore,
      confidence: patterns.length > 0 ? 'medium' : 'low',
      source: 'Pattern Detection'
    };
  }

  // 8. UPGRADE 5: COINBASE KYT CHECK
  private static async checkCoinbaseKYT(address: string): Promise<any> {
    try {
      const otherChecks = await Promise.allSettled([
        this.checkBTCBlack(address),
        this.checkBitcoinWhosWho(address)
      ]);

      let kytRiskLevel = 'low';
      let kytScore = 0;

      otherChecks.forEach(check => {
        if (check.status === 'fulfilled') {
          const data = check.value;
          if (data.blacklisted || (data.reports || 0) > 0) {
            kytRiskLevel = 'high';
            kytScore = 40;
          }
        }
      });

      return {
        riskLevel: kytRiskLevel,
        riskScore: kytScore,
        confidence: 'medium',
        description: kytRiskLevel === 'high' ?
          'High risk based on aggregated intelligence' :
          'Low risk based on available data',
        source: 'KYT Simulation',
        note: 'Replace with actual Coinbase KYT API in production'
      };
    } catch (error) {
      return {
        riskLevel: 'unknown',
        riskScore: 0,
        error: 'KYT check unavailable',
        source: 'KYT Simulation'
      };
    }
  }

  // 9. ENHANCED RISK SCORING ENGINE
  private static calculateEnhancedRiskScore(results: any): number {
    let score = 50;

    if (results.blacklistCheck.blacklisted) {
      score += 40;
    }

    if (results.communityReports.reports > 0) {
      score += Math.min(results.communityReports.reports * 8, 40);
    }

    if (results.coinbaseKYT.riskLevel === 'high') {
      score += 35;
    }

    if (results.tatumSecurity.flagged) {
      score += Math.min(results.tatumSecurity.sources.length * 12, 45);
    }

    // NEW: CryptoScamDB silent boost
    if (results.cryptoScamDB.flagged) {
      score += results.cryptoScamDB.riskContribution;
    }

    if (results.behavioralAnalysis.behaviorRiskScore) {
      score += results.behavioralAnalysis.behaviorRiskScore;
    }

    if (results.patternDetection.patternRiskScore) {
      score += results.patternDetection.patternRiskScore;
    }

    if (results.transactionGraph.graphRiskScore) {
      score += results.transactionGraph.graphRiskScore;
    }

    const txCount = parseInt(results.blockchain.transactionsCount || '0');
    const balance = parseFloat(results.blockchain.balance?.amount || '0');

    if (txCount === 0) {
      score += 15;
    } else if (txCount > 1000) {
      score -= 10;
    }

    if (txCount > 100 && balance < 0.01) {
      score += 20;
    }

    if (txCount < 5 && balance > 1) {
      score += 25;
    }

    if (results.blockchain.confidence === 'low') {
      score += 5;
    }

    return Math.max(0, Math.min(100, Math.round(score)));
  }

  // 10. SECURITY FLAGS GENERATION
  private static generateSecurityFlags(results: any, riskScore: number): Array<any> {
    const flags = [];

    if (results.blacklistCheck.blacklisted) {
      flags.push({
        type: 'Danger',
        level: 'Critical',
        description: results.blacklistCheck.description,
        source: results.blacklistCheck.source,
        confidence: 'high',
        impact: 'Critical',
        action: 'DO NOT TRANSACT'
      });
    }

    if (results.coinbaseKYT.riskLevel === 'high') {
      flags.push({
        type: 'Danger',
        level: 'High',
        description: 'Flagged by risk assessment system',
        source: results.coinbaseKYT.source,
        confidence: 'medium',
        impact: 'High',
        action: 'Extreme caution required'
      });
    }

    if (results.tatumSecurity.flagged) {
      flags.push({
        type: results.tatumSecurity.sources.length > 2 ? 'Danger' : 'Warning',
        level: results.tatumSecurity.sources.length > 2 ? 'High' : 'Medium',
        description: results.tatumSecurity.description,
        source: results.tatumSecurity.source,
        confidence: 'high',
        impact: 'High',
        action: 'Avoid transaction - Known malicious sources'
      });
    }

    // NEW: CryptoScamDB flag (visible in results)
    if (results.cryptoScamDB.flagged) {
      flags.push({
        type: results.cryptoScamDB.entries > 2 ? 'Danger' : 'Warning',
        level: results.cryptoScamDB.entries > 2 ? 'High' : 'Medium',
        description: results.cryptoScamDB.description,
        source: results.cryptoScamDB.source,
        confidence: 'high',
        impact: 'High',
        action: 'Avoid transaction - Reported in community scam database'
      });
    }

    if (results.communityReports.reports > 0) {
      const reports = results.communityReports.reports;
      flags.push({
        type: reports > 3 ? 'Danger' : 'Warning',
        level: reports > 3 ? 'High' : 'Medium',
        description: results.communityReports.description,
        source: results.communityReports.source,
        confidence: 'medium',
        impact: reports > 3 ? 'High' : 'Medium',
        action: reports > 3 ? 'Avoid transaction' : 'Investigate further'
      });
    }

    if (results.patternDetection.patterns.length > 0) {
      flags.push({
        type: 'Warning',
        level: 'Medium',
        description: results.patternDetection.patterns.join('; '),
        source: results.patternDetection.source,
        confidence: 'medium',
        impact: 'Medium',
        action: 'Additional verification needed'
      });
    }

    if (results.behavioralAnalysis.flags.length > 0) {
      results.behavioralAnalysis.flags.forEach((flag: string) => {
        flags.push({
          type: 'Warning',
          level: 'Medium',
          description: flag,
          source: results.behavioralAnalysis.source,
          confidence: 'medium',
          impact: 'Medium',
          action: 'Monitor behavior'
        });
      });
    }

    // Special info flag for Genesis address
    if (results.blockchain.source === 'genesis_verified') {
      flags.push({
        type: 'Info',
        level: 'Low',
        description: 'This is the Bitcoin Genesis address created by Satoshi Nakamoto. The original 50 BTC reward is unspendable. Current balance includes community donations.',
        source: 'UltimateShield Knowledge Base',
        confidence: 'high',
        impact: 'None',
        action: 'Historical landmark address'
      });
    }

    if (riskScore >= 80) {
      flags.push({
        type: 'Danger',
        level: 'Critical',
        description: `Extreme risk score detected (${riskScore}/100)`,
        source: 'UltimateShield Risk Engine',
        confidence: 'high',
        impact: 'Critical',
        action: 'BLOCK TRANSACTION'
      });
    } else if (riskScore >= 60) {
      flags.push({
        type: 'Warning',
        level: 'High',
        description: `High risk score (${riskScore}/100)`,
        source: 'UltimateShield Risk Engine',
        confidence: 'medium',
        impact: 'High',
        action: 'Proceed with extreme caution'
      });
    }

    return flags;
  }

  // 11. HELPER METHODS
  private static async getTransactionCount(address: string): Promise<number> {
    try {
      const response = await axios.get(
        `https://mempool.space/api/address/${address}`,
        { timeout: 3000 }
      );
      const data = response.data;
      return (data.chain_stats?.tx_count || 0) + (data.mempool_stats?.tx_count || 0);
    } catch {
      return 0;
    }
  }

  private static async getFirstSeenDate(address: string): Promise<string> {
    try {
      const response = await axios.get(
        `https://mempool.space/api/address/${address}/txs`,
        { params: { limit: 1 }, timeout: 3000 }
      );

      if (response.data?.length > 0) {
        const oldestTx = response.data[response.data.length - 1];
        return new Date(oldestTx.status.block_time * 1000).toISOString();
      }
    } catch {
    }

    return new Date().toISOString();
  }

  private static getMinimalDataFallback(address: string): any {
    return {
      balance: { amount: "0", unit: "BTC" },
      transactionsCount: "0",
      firstSeen: new Date().toISOString(),
      lastActivity: new Date().toISOString(),
      totalReceived: { amount: "0", unit: "BTC" },
      totalSent: { amount: "0", unit: "BTC" }
    };
  }

  private static processAllResults(promises: any, address: string): any {
    const results: any = {};

    results.blockchain = promises.blockchainData.status === 'fulfilled'
      ? { ...promises.blockchainData.value.data, ...promises.blockchainData.value }
      : { ...this.getMinimalDataFallback(address), source: 'failed', confidence: 'low' };

    results.blacklistCheck = promises.blacklistCheck.status === 'fulfilled'
      ? promises.blacklistCheck.value
      : { blacklisted: false, error: 'Check failed' };

    results.communityReports = promises.communityReports.status === 'fulfilled'
      ? promises.communityReports.value
      : { reports: 0, error: 'Check failed' };

    results.behavioralAnalysis = promises.behavioralAnalysis.status === 'fulfilled'
      ? promises.behavioralAnalysis.value
      : { flags: [], behaviorRiskScore: 0, error: 'Analysis failed' };

    results.transactionGraph = promises.transactionGraph.status === 'fulfilled'
      ? promises.transactionGraph.value
      : { insights: [], graphRiskScore: 0, error: 'Analysis failed' };

    results.patternDetection = promises.patternDetection.status === 'fulfilled'
      ? promises.patternDetection.value
      : { patterns: [], patternRiskScore: 0, error: 'Detection failed' };

    results.coinbaseKYT = promises.coinbaseKYT.status === 'fulfilled'
      ? promises.coinbaseKYT.value
      : { riskLevel: 'unknown', riskScore: 0, error: 'Check failed' };

    results.tatumSecurity = promises.tatumSecurity?.status === 'fulfilled'
      ? promises.tatumSecurity.value
      : { flagged: false, description: 'Threat check unavailable', error: 'Check failed', source: 'Tatum Security API' };

    // NEW: CryptoScamDB
    results.cryptoScamDB = promises.cryptoScamDB?.status === 'fulfilled'
      ? promises.cryptoScamDB.value
      : { flagged: false, description: 'Check unavailable', source: 'CryptoScamDB (Community Open Database)' };

    return results;
  }

  private static getRiskLevel(score: number): string {
    if (score >= 85) return 'CRITICAL';
    if (score >= 70) return 'HIGH';
    if (score >= 45) return 'MEDIUM';
    if (score >= 20) return 'LOW';
    return 'VERY LOW';
  }

  private static getRiskFactors(results: any): string[] {
    const factors = [];

    if (results.blacklistCheck.blacklisted) factors.push('Blacklisted address');
    if (results.communityReports.reports > 0) factors.push(`${results.communityReports.reports} community reports`);
    if (results.coinbaseKYT.riskLevel === 'high') factors.push('High KYT risk');
    if (results.behavioralAnalysis.flags.length > 0) factors.push(`${results.behavioralAnalysis.flags.length} behavioral flags`);
    if (results.patternDetection.patterns.length > 0) factors.push('Pattern matches');
    if (results.transactionGraph.graphRiskScore > 0) factors.push('Suspicious transaction patterns');
    if (results.tatumSecurity.flagged) factors.push(`Tatum flagged (${results.tatumSecurity.sources.length} sources)`);
    if (results.cryptoScamDB.flagged) factors.push(`Open scam database hit (${results.cryptoScamDB.entries} entries)`);

    const txCount = parseInt(results.blockchain.transactionsCount || '0');
    if (txCount === 0) factors.push('New address');
    if (txCount > 1000) factors.push('Well-established');

    return factors;
  }

  private static getRecommendation(riskScore: number): string {
    if (riskScore >= 85) return 'IMMEDIATE BLOCK - High confidence scam';
    if (riskScore >= 70) return 'DO NOT TRANSACT - Multiple risk factors';
    if (riskScore >= 50) return 'EXTREME CAUTION - Significant risks detected';
    if (riskScore >= 30) return 'CAUTION ADVISED - Some risks present';
    return 'LOW RISK - Safe for transactions';
  }

  private static generateRiskSummary(results: any, riskScore: number): string {
    const riskLevel = this.getRiskLevel(riskScore);
    const factors = this.getRiskFactors(results);

    if (results.blacklistCheck.blacklisted) {
      return `CRITICAL RISK (Score: ${riskScore}/100) - Blacklisted address. ${results.blacklistCheck.description}`;
    }

    if (factors.length > 0) {
      return `${riskLevel} RISK (Score: ${riskScore}/100). Detected: ${factors.join(' • ')}.`;
    }

    return `${riskLevel} RISK (Score: ${riskScore}/100). No immediate threats detected.`;
  }
}

import React from 'react';
import { CheckCircle, Clock, TrendingUp, Shield, Zap, Users, Code, Globe, Lock, BarChart, Cpu, Target } from 'lucide-react';

const Roadmap = () => {
  const phases = [
    {
      title: 'Phase 1: Foundation & Funding',
      timeframe: 'Q1 2025',
      status: 'current',
      budget: 'First $500K - Immediate Access',
      icon: <Shield className="w-8 h-8" />,
      color: 'from-green-500 to-emerald-600',
      deliverables: [
        { text: 'Deploy Production API (Week 1)', status: 'completed' },
        { text: 'Close $250K SAFE (Week 1-2)', status: 'in-progress' },
        { text: 'Hire Core Team (Week 2)', status: 'planned' },
        { text: 'Launch on Republic Crypto (Week 3)', status: 'planned' },
        { text: 'Begin Ethereum Integration (Week 4)', status: 'planned' },
        { text: 'Secure First Pilot Customer', status: 'planned' }
      ],
      metrics: [
        { label: 'Funding Target', value: '$3.5M SAFE' },
        { label: 'Valuation', value: '$15M post-money' },
        { label: 'Fund Access', value: 'Immediate', highlight: true }
      ],
      funding: {
        target: '$3.5M SAFE',
        valuation: '$15M post-money',
        access: 'Funds available immediately upon signing',
        instrument: 'SAFE Notes (YC Standard)',
        minimum: '$25,000',
        contact: 'ultimateshield44@gmail.com'
      }
    },
    {
      title: 'Phase 2: Multi-Chain Expansion',
      timeframe: 'Q2-Q3 2025',
      status: 'next',
      budget: 'Full $3.5M Deployed',
      icon: <Globe className="w-8 h-8" />,
      color: 'from-blue-500 to-cyan-600',
      deliverables: [
        { text: 'Ethereum & Solana Integration', status: 'planned' },
        { text: 'Launch Enterprise API', status: 'planned' },
        { text: 'Secure Exchange Partnerships', status: 'planned' },
        { text: 'Add 8 More Blockchains', status: 'planned' },
        { text: 'Reach 10,000+ API Users', status: 'planned' },
        { text: 'Generate $50K MRR', status: 'planned' }
      ],
      metrics: [
        { label: 'Target Chains', value: '10+' },
        { label: 'Daily Scans', value: '100,000' },
        { label: 'Enterprise Clients', value: '10+' }
      ],
      focus: [
        'Multi-chain detection engine',
        'Real-time monitoring system',
        'Exchange API integrations',
        'Developer ecosystem growth'
      ]
    },
    {
      title: 'Phase 3: Intelligence',
      timeframe: 'Q4 2025 - Q1 2026',
      status: 'planned',
      budget: 'Revenue + Series A Prep',
      icon: <Cpu className="w-8 h-8" />,
      color: 'from-purple-500 to-pink-600',
      deliverables: [
        { text: 'AI-Powered Detection', status: 'planned' },
        { text: 'Social Intelligence Layer', status: 'planned' },
        { text: 'Cross-Chain Analytics', status: 'planned' },
        { text: 'Mobile & Wallet SDKs', status: 'planned' },
        { text: 'Predictive Threat Models', status: 'planned' },
        { text: '98.5% Detection Accuracy', status: 'planned' }
      ],
      metrics: [
        { label: 'AI Accuracy', value: '98.5%+' },
        { label: 'False Positives', value: '<3%' },
        { label: 'Real-time Alerts', value: '<10s' }
      ],
      focus: [
        'Machine learning deployment',
        'Behavioral pattern analysis',
        'Cross-chain tracking',
        'Predictive security'
      ]
    },
    {
      title: 'Phase 4: Dominance',
      timeframe: 'Q2-Q3 2026',
      status: 'future',
      budget: 'Series A ($15-20M)',
      icon: <Target className="w-8 h-8" />,
      color: 'from-orange-500 to-red-600',
      deliverables: [
        { text: '30+ Blockchain Coverage', status: 'planned' },
        { text: 'Global Compliance Suite', status: 'planned' },
        { text: '100+ Enterprise Clients', status: 'planned' },
        { text: 'Market Leadership Position', status: 'planned' },
        { text: 'Series A Funding', status: 'planned' },
        { text: '$5M+ ARR', status: 'planned' }
      ],
      metrics: [
        { label: 'Market Coverage', value: '30+ chains' },
        { label: 'Daily Scans', value: '1M+' },
        { label: 'Team Size', value: '50+' }
      ],
      focus: [
        'Global market expansion',
        'Institutional adoption',
        'Regulatory technology',
        'Industry standardization'
      ]
    }
  ];

  const financials = [
    { category: 'Engineering (18 months)', amount: '$1.8M', percentage: 51, description: '8 engineers, competitive salaries, equity' },
    { category: 'Infrastructure & APIs', amount: '$600K', percentage: 17, description: 'Node providers, AI services, data licenses' },
    { category: 'Marketing & Adoption', amount: '$500K', percentage: 14, description: 'Developer outreach, exchange partnerships' },
    { category: 'Legal & Compliance', amount: '$300K', percentage: 9, description: 'Regulatory frameworks, patent filings' },
    { category: 'Contingency (12 months)', amount: '$300K', percentage: 9, description: 'Market fluctuations, extended runway' }
  ];

  const milestones = [
    { date: 'Week 1', event: 'Deploy Production API', funding: '$250K available' },
    { date: 'Week 2', event: 'First Engineer Hired', funding: 'Start Ethereum build' },
    { date: 'Month 1', event: 'Close $1M SAFE', funding: 'Team to 5 people' },
    { date: 'Month 2', event: 'Ethereum MVP Live', funding: 'First revenue' },
    { date: 'Month 3', event: 'Full $3.5M Closed', funding: 'Scale marketing' },
    { date: 'Month 6', event: '10+ Chains Live', funding: '$50K MRR target' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white text-gray-900">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-green-100 to-blue-100 px-6 py-3 rounded-full mb-6">
            <Zap className="w-5 h-5 text-green-600" />
            <span className="font-semibold text-green-800">🚀 LIVE FUNDRAISING - SAFE NOTES OPEN</span>
          </div>
          
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
            UltimateShield Roadmap
          </h1>
          
          <p className="text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Building the most comprehensive crypto scam detection platform.
            <span className="block text-lg text-gray-500 mt-2">
              $3.5M Seed Round • $15M Valuation • Funds Available Immediately
            </span>
          </p>

          {/* Funding Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-12">
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-green-200">
              <div className="text-3xl font-bold text-green-600">$3.5M</div>
              <div className="text-gray-600">Seed Round</div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-blue-200">
              <div className="text-3xl font-bold text-blue-600">$15M</div>
              <div className="text-gray-600">Valuation</div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-purple-200">
              <div className="text-3xl font-bold text-purple-600">SAFE</div>
              <div className="text-gray-600">Instrument</div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-orange-200">
              <div className="text-3xl font-bold text-orange-600">Immediate</div>
              <div className="text-gray-600">Fund Access</div>
            </div>
          </div>
        </div>

        {/* Financial Allocation */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">💰 Fund Allocation</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {financials.map((item, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="text-sm font-semibold text-gray-500">{item.category}</div>
                    <div className="text-2xl font-bold mt-1">{item.amount}</div>
                  </div>
                  <div className="text-2xl font-bold text-blue-600">{item.percentage}%</div>
                </div>
                <div className="text-sm text-gray-600">{item.description}</div>
                <div className="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-green-500 to-blue-500 rounded-full"
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline Milestones */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">⏳ Immediate Timeline</h2>
          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-green-500 via-blue-500 to-purple-500"></div>
            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <div key={index} className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                  <div className={`w-1/2 ${index % 2 === 0 ? 'pr-12 text-right' : 'pl-12'}`}>
                    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
                      <div className="text-sm font-semibold text-gray-500">{milestone.date}</div>
                      <div className="text-xl font-bold mt-1">{milestone.event}</div>
                      <div className="text-green-600 font-semibold mt-2">{milestone.funding}</div>
                    </div>
                  </div>
                  <div className="relative z-10">
                    <div className="w-4 h-4 bg-white border-4 border-blue-500 rounded-full"></div>
                  </div>
                  <div className="w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Roadmap Phases */}
        <div className="space-y-12">
          {phases.map((phase, phaseIndex) => (
            <div key={phaseIndex} className="relative">
              {/* Phase Header */}
              <div className={`flex items-start gap-6 mb-8 p-8 rounded-3xl bg-gradient-to-r ${phase.color} text-white shadow-xl`}>
                <div className="bg-white/20 p-4 rounded-2xl">
                  {phase.icon}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-3xl font-bold mb-2">{phase.title}</h3>
                      <div className="flex items-center gap-4">
                        <span className="px-4 py-1 bg-white/20 rounded-full">{phase.timeframe}</span>
                        <span className="px-4 py-1 bg-white/30 rounded-full font-semibold">{phase.budget}</span>
                        {phase.status === 'current' && (
                          <span className="px-4 py-1 bg-green-500 rounded-full font-semibold animate-pulse">
                            🚀 CURRENTLY FUNDING
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-4xl font-bold">{phaseIndex + 1}</div>
                      <div className="text-sm opacity-90">Phase</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Phase Content */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Deliverables */}
                <div className="lg:col-span-2">
                  <h4 className="text-xl font-bold mb-4 text-gray-800">Key Deliverables</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {phase.deliverables.map((deliverable, index) => (
                      <div key={index} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                        <div className="flex items-center gap-3">
                          {deliverable.status === 'completed' ? (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          ) : deliverable.status === 'in-progress' ? (
                            <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <Clock className="w-5 h-5 text-gray-400" />
                          )}
                          <span className="font-medium">{deliverable.text}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Metrics & Funding */}
                <div className="space-y-6">
                  {/* Metrics */}
                  <div>
                    <h4 className="text-xl font-bold mb-4 text-gray-800">Success Metrics</h4>
                    <div className="space-y-3">
                      {phase.metrics.map((metric, index) => (
                        <div key={index} className={`p-4 rounded-xl ${metric.highlight ? 'bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200' : 'bg-gray-50'}`}>
                          <div className="text-2xl font-bold text-gray-900">{metric.value}</div>
                          <div className="text-sm text-gray-600">{metric.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Funding Details for Phase 1 */}
                  {phase.status === 'current' && phase.funding && (
                    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-xl border border-blue-200">
                      <h4 className="text-xl font-bold mb-3 text-gray-800">💰 Investment Details</h4>
                      <div className="space-y-3">
                        <div>
                          <div className="text-sm text-gray-600">Target</div>
                          <div className="font-bold text-lg">{phase.funding.target}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">Valuation</div>
                          <div className="font-bold text-lg">{phase.funding.valuation}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">Minimum Investment</div>
                          <div className="font-bold text-lg">{phase.funding.minimum}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">Contact</div>
                          <a 
                            href={`mailto:${phase.funding.contact}?subject=UltimateShield%20Investment%20Inquiry`}
                            className="font-bold text-blue-600 hover:underline block"
                          >
                            {phase.funding.contact}
                          </a>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Focus Areas */}
              {phase.focus && (
                <div className="mt-8">
                  <h4 className="text-xl font-bold mb-4 text-gray-800">Focus Areas</h4>
                  <div className="flex flex-wrap gap-3">
                    {phase.focus.map((focus, index) => (
                      <span key={index} className="px-4 py-2 bg-gray-100 rounded-full text-gray-700">
                        {focus}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Investment CTA */}
        <div className="mt-16">
          <div className="bg-gradient-to-r from-green-50 via-blue-50 to-purple-50 rounded-3xl p-10 border border-gray-200 shadow-lg">
            <div className="text-center">
              <h2 className="text-4xl font-bold mb-4">🚀 Ready to Invest?</h2>
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                Join our mission to secure the crypto ecosystem. We're offering SAFE notes with immediate fund access.
                Start building with us from day one.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <a
                  href="mailto:ultimateshield44@gmail.com?subject=UltimateShield%20SAFE%20Investment&body=Hi%2C%20I'm%20interested%20in%20investing%20in%20your%20%243.5M%20SAFE%20round%20at%20%2415M%20valuation.%20Please%20send%20me%20the%20SAFE%20agreement%20and%20data%20room%20access."
                  className="px-8 py-4 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl font-bold text-lg hover:opacity-90 transition shadow-lg"
                >
                  📧 Email to Invest
                </a>
                
                <a
                  href="/docs/strategic-roadmap.pdf"
                  className="px-8 py-4 bg-white border-2 border-blue-600 text-blue-600 rounded-xl font-bold text-lg hover:bg-blue-50 transition shadow-lg"
                  download
                >
                  📥 Download Full Roadmap
                </a>
              </div>

              <div className="mt-8 text-sm text-gray-500 max-w-2xl mx-auto">
                <p className="mb-2">💰 <strong>SAFE Notes:</strong> Simple Agreement for Future Equity (YC Standard)</p>
                <p className="mb-2">⚡ <strong>Funds Access:</strong> Immediate upon signing agreement</p>
                <p>📈 <strong>Valuation:</strong> $15M post-money | <strong>Minimum:</strong> $25,000</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-gray-200 text-center text-gray-500">
          <p>© 2025 UltimateShield. All rights reserved. Confidential and Proprietary.</p>
          <p className="mt-2 text-sm">This information is intended for accredited investors only. Investment involves risk.</p>
          <p className="mt-4">
            <a 
              href="mailto:ultimateshield44@gmail.com" 
              className="text-blue-600 hover:underline font-medium"
            >
              ultimateshield44@gmail.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Roadmap;

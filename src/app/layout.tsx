import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ChevronDown } from 'lucide-react'; // Added for accordion
import './globals.css';

const inter = Inter({
  subsets: ['latin'],                                   display: 'swap',                                      variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'UltimateShield | Bitcoin Security Scanner',
  description: 'Professional-grade Bitcoin address security scanner with multi-layered threat detection and risk analysis.',
  keywords: ['bitcoin', 'crypto', 'security', 'scanner', 'blockchain', 'safety', 'address', 'risk', 'analysis', 'threat detection'],
  authors: [{ name: 'UltimateShield' }],
  creator: 'UltimateShield',
  publisher: 'UltimateShield',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://ultimateshield.com'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://ultimateshield.com',
    title: 'UltimateShield | Bitcoin Security Scanner',
    description: 'Professional-grade Bitcoin address security scanner',
    siteName: 'UltimateShield',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'UltimateShield Bitcoin Security Scanner',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'UltimateShield | Bitcoin Security Scanner',
    description: 'Professional-grade Bitcoin address security scanner',
    images: ['/og-image.png'],
    creator: '@ultimateshield',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'verification_token',
    yandex: 'verification_token',
    yahoo: 'verification_token',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} scroll-smooth`}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="theme-color" content="#2563eb" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />

        {/* Preload critical resources */}
        <link
          rel="preload"
          href="/_next/static/css/app/layout.css"
          as="style"
        />

        {/* Security headers would be added in production */}
        <meta httpEquiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';" />
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-Frame-Options" content="DENY" />
        <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
        <meta httpEquiv="Referrer-Policy" content="strict-origin-when-cross-origin" />

        {/* Performance optimizations */}
        <link rel="preconnect" href="https://api.cryptoapis.io" />
        <link rel="preconnect" href="https://api.tatum.io" />
        <link rel="dns-prefetch" href="https://api.cryptoapis.io" />
        <link rel="dns-prefetch" href="https://api.tatum.io" />

        {/* Structured data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebApplication',
              name: 'UltimateShield',
              description: 'Bitcoin Security Scanner',
              url: 'https://ultimateshield.com',
              applicationCategory: 'SecurityApplication',
              operatingSystem: 'Any',
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'USD',
              },
              author: {
                '@type': 'Organization',
                name: 'UltimateShield',
              },
            }),
          }}
        />
      </head>
      <body className={`${inter.className} antialiased bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen`}>
        {/* Skip to main content for accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-s Oh-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-lg"
        >
          Skip to main content
        </a>

        {/* Main layout */}
        <div className="min-h-screen flex flex-col">
          {/* Optional header/navigation can be added here in future */}
          <main id="main-content" className="flex-1 w-full">
            {children}
          </main>

          {/* New Professional Dark Footer */}
          <footer className="bg-gray-900 text-gray-300 mt-20">
            <div className="container mx-auto px-4 py-12">
              {/* Desktop Grid */}
              <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-5 gap-10">
                {/* Product */}
                <div>
                  <h3 className="text-white font-bold text-lg mb-6">Product</h3>
                  <ul className="space-y-3">
                    <li><a href="/" className="hover:text-white transition">Bitcoin Scanner</a></li>
                    <li className="text-gray-500">Multi-Chain <span className="text-xs bg-gray-700 px-2 py-1 rounded ml-2">Coming Soon</span></li>
                    <li className="text-gray-500">DeFi Protection <span className="text-xs bg-gray-700 px-2 py-1 rounded ml-2">Coming Soon</span></li>
                    <li className="text-gray-500">NFT Security <span className="text-xs bg-gray-700 px-2 py-1 rounded ml-2">Coming Soon</span></li>
                    <li className="text-gray-500">Real-time Monitoring <span className="text-xs bg-gray-700 px-2 py-1 rounded ml-2">Coming Soon</span></li>
                    <li className="text-gray-500">API Access <span className="text-xs bg-gray-700 px-2 py-1 rounded ml-2">Coming Soon</span></li>
                  </ul>
                </div>

                {/* Resources */}
                <div>
                  <h3 className="text-white font-bold text-lg mb-6">Resources</h3>
                  <ul className="space-y-3">
                    <li><a href="/docs" className="hover:text-white transition">Documentation</a></li>
                    <li><a href="/api" className="hover:text-white transition">API Reference</a></li>
                    <li><a href="/whitepaper" className="hover:text-white transition">Security Whitepaper</a></li>
                    <li><a href="/guide" className="hover:text-white transition">Integration Guide</a></li>
                  </ul>
                </div>

                {/* Company */}
                <div>
                  <h3 className="text-white font-bold text-lg mb-6">Company</h3>
                  <ul className="space-y-3">
                    <li><a href="/team" className="hover:text-white transition">Team</a></li>
                    <li><a href="/founder" className="hover:text-white transition">Founder</a></li>
                    <li><a href="/contact" className="hover:text-white transition">Contact</a></li>
                  </ul>
                </div>

                {/* Legal */}
                <div>
                  <h3 className="text-white font-bold text-lg mb-6">Legal</h3>
                  <ul className="space-y-3">
                    <li><a href="/legal/terms" className="hover:text-white transition">Terms of Service</a></li>
                    <li><a href="/legal/privacy" className="hover:text-white transition">Privacy Policy</a></li>
                    <li><a href="/legal/disclaimer" className="hover:text-white transition">Disclaimer</a></li>
                    <li><a href="/legal/compliance" className="hover:text-white transition">Compliance</a></li>
                  </ul>
                </div>

                {/* Roadmap & Investment */}
                <div>
                  <h3 className="text-white font-bold text-lg mb-6">Roadmap & Investment</h3>
                  <ul className="space-y-3">
                    <li>
                      <a href="https://ultimateshieldroadmap.vercel.app" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">
                        View Roadmap
                      </a>
                    </li>
                    <li>
                      <a href="https://docs.google.com/document/d/1-tEqO5t-mK2ZJKvrklZfEU_17UxDZjQcQ_DLxLLx8d8/edit?usp=drivesdk" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">
                        Investor Documents
                      </a>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Mobile Accordion */}
              <div className="md:hidden space-y-4">
                <details className="bg-gray-800 rounded-xl">
                  <summary className="text-white font-bold py-5 px-6 cursor-pointer flex justify-between items-center">
                    Product
                    <ChevronDown className="w-5 h-5 transition-transform duration-300" />
                  </summary>
                  <ul className="px-6 pb-5 space-y-3">
                    <li><a href="/" className="hover:text-white block">Bitcoin Scanner</a></li>
                    <li className="text-gray-500">Multi-Chain <span className="text-xs bg-gray-700 px-2 py-1 rounded ml-2">Coming Soon</span></li>
                    <li className="text-gray-500">DeFi Protection <span className="text-xs bg-gray-700 px-2 py-1 rounded ml-2">Coming Soon</span></li>
                    <li className="text-gray-500">NFT Security <span className="text-xs bg-gray-700 px-2 py-1 rounded ml-2">Coming Soon</span></li>
                    <li className="text-gray-500">Real-time Monitoring <span className="text-xs bg-gray-700 px-2 py-1 rounded ml-2">Coming Soon</span></li>
                    <li className="text-gray-500">API Access <span className="text-xs bg-gray-700 px-2 py-1 rounded ml-2">Coming Soon</span></li>
                  </ul>
                </details>

                <details className="bg-gray-800 rounded-xl">
                  <summary className="text-white font-bold py-5 px-6 cursor-pointer flex justify-between items-center">
                    Resources
                    <ChevronDown className="w-5 h-5 transition-transform duration-300" />
                  </summary>
                  <ul className="px-6 pb-5 space-y-3">
                    <li><a href="/docs" className="hover:text-white block">Documentation</a></li>
                    <li><a href="/api" className="hover:text-white block">API Reference</a></li>
                    <li><a href="/whitepaper" className="hover:text-white block">Security Whitepaper</a></li>
                    <li><a href="/guide" className="hover:text-white block">Integration Guide</a></li>
                  </ul>
                </details>

                <details className="bg-gray-800 rounded-xl">
                  <summary className="text-white font-bold py-5 px-6 cursor-pointer flex justify-between items-center">
                    Company
                    <ChevronDown className="w-5 h-5 transition-transform duration-300" />
                  </summary>
                  <ul className="px-6 pb-5 space-y-3">
                    <li><a href="/team" className="hover:text-white block">Team</a></li>
                    <li><a href="/founder" className="hover:text-white block">Founder</a></li>
                    <li><a href="/contact" className="hover:text-white block">Contact</a></li>
                  </ul>
                </details>

                <details className="bg-gray-800 rounded-xl">
                  <summary className="text-white font-bold py-5 px-6 cursor-pointer flex justify-between items-center">
                    Legal
                    <ChevronDown className="w-5 h-5 transition-transform duration-300" />
                  </summary>
                  <ul className="px-6 pb-5 space-y-3">
                    <li><a href="/legal/terms" className="hover:text-white block">Terms of Service</a></li>
                    <li><a href="/legal/privacy" className="hover:text-white block">Privacy Policy</a></li>
                    <li><a href="/legal/disclaimer" className="hover:text-white block">Disclaimer</a></li>
                    <li><a href="/legal/compliance" className="hover:text-white block">Compliance</a></li>
                  </ul>
                </details>

                <details className="bg-gray-800 rounded-xl">
                  <summary className="text-white font-bold py-5 px-6 cursor-pointer flex justify-between items-center">
                    Roadmap & Investment
                    <ChevronDown className="w-5 h-5 transition-transform duration-300" />
                  </summary>
                  <ul className="px-6 pb-5 space-y-3">
                    <li><a href="https://ultimateshieldroadmap.vercel.app" target="_blank" rel="noopener noreferrer" className="hover:text-white block">View Roadmap</a></li>
                    <li><a href="https://docs.google.com/document/d/1-tEqO5t-mK2ZJKvrklZfEU_17UxDZjQcQ_DLxLLx8d8/edit?usp=drivesdk" target="_blank" rel="noopener noreferrer" className="hover:text-white block">Investor Documents</a></li>
                  </ul>
                </details>
              </div>

              {/* Bottom Copyright */}
              <div className="border-t border-gray-800 pt-8 mt-12 text-center text-sm">
                <p className="text-gray-500">© 2025 UltimateShield. All rights reserved. • Pre-Funding MVP</p>
                <p className="text-gray-600 mt-2">
                  Disclaimer: UltimateShield provides security analysis for informational purposes only. Always conduct your own research (DYOR).
                </p>
              </div>
            </div>
          </footer>
        </div>

        {/* Global loading indicator (optional) */}
        <div id="global-loader" className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50 hidden">
          <div className="h-full bg-gradient-to-r from-blue-600 to-purple-600 animate-pulse-slow"></div>
        </div>

        {/* Toast notifications container (optional) */}
        <div id="toast-container" className="fixed top-4 right-4 z-50 space-y-2 max-w-sm"></div>

        {/* Scripts can be added here if needed */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Global performance monitoring
              if (typeof window !== 'undefined') {
                window.addEventListener('load', function() {
                  const timing = performance.timing;
                  const loadTime = timing.loadEventEnd - timing.navigationStart;
                  console.log('Page load time:', loadTime + 'ms');
                  sessionStorage.setItem('pageLoadTime', loadTime);
                });

                if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
                  window.addEventListener('load', function() {
                    navigator.serviceWorker.register('/sw.js').catch(function(error) {
                      console.log('ServiceWorker registration failed:', error);
                    });
                  });
                }

                window.addEventListener('error', function(event) {
                  console.error('Global error:', event.error);
                });

                window.addEventListener('beforeunload', function() {
                  // Cleanup or send analytics
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}

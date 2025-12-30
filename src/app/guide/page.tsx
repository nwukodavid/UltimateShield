import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Integration Guide - UltimateShield',
  description: 'Step-by-step guide for integrating UltimateShield',
};

export default function GuidePage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="text-4xl font-bold text-center mb-12">Integration Guide</h1>
      <div className="bg-white rounded-2xl shadow-xl p-10">
        <div className="prose prose-lg mx-auto text-gray-700">
          <p className="text-xl leading-relaxed text-center mb-10">
            Step-by-step guide for integrating UltimateShield into wallets, dApps, and exchanges — coming soon.
          </p>
          <p className="text-center">
            Public API and SDKs will be available with the premium launch.
          </p>
          <p className="text-center mt-8">
            Contact us at{' '}
            <a href="mailto:ultimateshield44@gmail.com" className="text-blue-600 hover:underline">
              ultimateshield44@gmail.com
            </a>{' '}
            for early integration access.
          </p>
        </div>
      </div>
    </div>
  );
}

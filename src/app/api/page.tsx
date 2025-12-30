import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'API Reference - UltimateShield',
  description: 'Public API access for developers',
};

export default function APIPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="text-4xl font-bold text-center mb-12">UltimateShield API Reference</h1>
      <div className="bg-white rounded-2xl shadow-xl p-10">
        <div className="prose prose-lg mx-auto text-gray-700">
          <p className="text-xl leading-relaxed text-center mb-10">
            Public API access for developers coming soon with the premium launch.
          </p>
          <p className="text-lg">
            Features:
          </p>
          <ul className="list-disc pl-8 space-y-3 text-lg">
            <li>Address risk scoring</li>
            <li>Batch scanning</li>
            <li>Webhook alerts</li>
            <li>Wallet integration</li>
          </ul>
          <p className="mt-10 text-center">
            Join the waitlist or contact us at{' '}
            <a href="mailto:ultimateshield44@gmail.com" className="text-blue-600 hover:underline">
              ultimateshield44@gmail.com
            </a>{' '}
            for early access.
          </p>
        </div>
      </div>
    </div>
  );
}

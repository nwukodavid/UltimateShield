import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Compliance - UltimateShield',
};

export default function CompliancePage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Compliance</h1>
      <div className="prose prose-lg text-gray-700">
        <p>
          UltimateShield operates as a public blockchain analysis tool and complies with applicable laws.
        </p>
        <p>
          We do not facilitate money transmission, custody assets, or provide regulated financial services.
        </p>
        <p>
          All data used is from public sources. No sanctioned entities are targeted.
        </p>
        <p>
          For compliance inquiries: <a href="mailto:ultimateshield44@gmail.com">ultimateshield44@gmail.com</a>
        </p>
      </div>
    </div>
  );
}

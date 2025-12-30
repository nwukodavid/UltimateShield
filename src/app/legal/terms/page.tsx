import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service - UltimateShield',
};

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
      <div className="prose prose-lg text-gray-700">
        <p className="text-sm text-gray-500">Last updated: December 2025</p>
        <p>
          By accessing or using UltimateShield ("the Service"), you agree to be bound by these Terms of Service ("Terms").
        </p>
        <h2>1. Use of Service</h2>
        <p>
          UltimateShield provides blockchain address risk analysis for informational purposes only. The Service is provided "as is" without warranty of any kind.
        </p>
        <h2>2. No Financial Advice</h2>
        <p>
          The Service does not provide financial, investment, or legal advice. All risk scores and recommendations are informational only.
        </p>
        <h2>3. Limitation of Liability</h2>
        <p>
          UltimateShield and its operators shall not be liable for any losses resulting from use of the Service.
        </p>
        <h2>4. Contact</h2>
        <p>
          For questions: <a href="mailto:ultimateshield44@gmail.com">ultimateshield44@gmail.com</a>
        </p>
      </div>
    </div>
  );
}

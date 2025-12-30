import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy - UltimateShield',
};

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
      <div className="prose prose-lg text-gray-700">
        <p className="text-sm text-gray-500 mb-8">Last updated: December 2025</p>
        <p>
          UltimateShield respects your privacy. We do not collect personal data, track users, or store wallet information.
        </p>
        <h2>Data Collection</h2>
        <p>
          Only public blockchain addresses submitted for scanning are processed temporarily. No logs of user IP or identity are retained.
        </p>
        <h2>Cookies</h2>
        <p>No cookies or tracking technologies are used.</p>
        <h2>Contact</h2>
        <p>
          Privacy concerns: <a href="mailto:ultimateshield44@gmail.com">ultimateshield44@gmail.com</a>
        </p>
      </div>
    </div>
  );
}

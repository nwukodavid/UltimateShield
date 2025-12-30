import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Disclaimer - UltimateShield',
};

export default function DisclaimerPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Disclaimer</h1>
      <div className="prose prose-lg text-gray-700">
        <p>
          UltimateShield provides blockchain security analysis for informational purposes only.
        </p>
        <p>
          Risk scores and recommendations are not financial advice. Cryptocurrency involves significant risk.
        </p>
        <p>
          We are not responsible for any financial losses resulting from use of this tool.
        </p>
        <p className="font-bold">
          Always conduct your own research (DYOR).
        </p>
      </div>
    </div>
  );
}

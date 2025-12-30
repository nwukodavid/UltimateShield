import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact - UltimateShield',
  description: 'Get in touch with the UltimateShield team',
};

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="text-4xl font-bold text-center mb-12">Contact Us</h1>
      <div className="bg-white rounded-2xl shadow-xl p-10">
        <div className="space-y-6 text-lg">
          <div className="flex items-center">
            <span className="font-semibold mr-4">Email:</span>
            <a href="mailto:ultimateshield44@gmail.com" className="text-blue-600 hover:underline">
              ultimateshield44@gmail.com
            </a>
          </div>
          <div className="flex items-center">
            <span className="font-semibold mr-4">Phone:</span>
            <span>+2349064745446</span>
          </div>
          <div className="flex items-center">
            <span className="font-semibold mr-4">Twitter:</span>
            <a href="https://twitter.com/ultimateshield4" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              @ultimateshield4
            </a>
          </div>
          <div className="flex items-center">
            <span className="font-semibold mr-4">GitHub:</span>
            <a href="https://github.com/nwukodavid" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              https://github.com/nwukodavid
            </a>
          </div>
        </div>
        <p className="mt-10 text-gray-600">
          We typically respond within 24-48 hours. For urgent security reports or partnership inquiries, please use email.
        </p>
      </div>
    </div>
  );
}

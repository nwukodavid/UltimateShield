import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Team - UltimateShield',
  description: 'Meet the team behind UltimateShield',
};

export default function TeamPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="text-4xl font-bold text-center mb-12">Our Team</h1>
      <div className="prose prose-lg mx-auto text-gray-700">
        <p className="text-xl leading-relaxed">
          UltimateShield is built by a dedicated team of blockchain security experts committed to protecting the crypto community from scams and high-risk activity.
        </p>
        <p className="mt-6">
          Our team combines deep expertise in on-chain analytics, threat intelligence, behavioral modeling, and decentralized systems to deliver accurate, transparent, and real-time risk assessment tools.
        </p>
        <p className="mt-6">
          We are driven by a shared mission: to make blockchain transactions safer for everyone — from individual users to institutional players.
        </p>
        <p className="mt-6 font-semibold">
          Together, we are building the future of proactive blockchain security.
        </p>
      </div>
    </div>
  );
}

// src/app/privacy/page.tsx
import { Metadata } from 'next';
import { SITE_NAME, CONTACT_EMAIL } from '@/lib/constants';

export const metadata: Metadata = {
  title: `Privacy Policy | ${SITE_NAME}`,
  description: 'Learn how we collect, use, and protect your personal information.',
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-12 text-center">
        <h1 className="font-serif text-4xl font-bold text-gray-900 sm:text-5xl">
          Privacy Policy
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-lg text-gray-500">
          Last updated: January 1, 2024
        </p>
      </div>

      <div className="prose prose-lg max-w-none space-y-12 text-gray-600">
        <section>
          <h2 className="font-serif text-2xl font-bold text-gray-900">Information We Collect</h2>
          <p>
            When you visit our website, we may collect certain information about you, including
            your name, email address, phone number, shipping address, and payment information
            when you make a purchase. We also collect information about your browsing behavior
            through cookies and similar technologies.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl font-bold text-gray-900">How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Process and fulfill your orders</li>
            <li>Communicate with you about your orders and account</li>
            <li>Send marketing communications (with your consent)</li>
            <li>Improve our website and customer experience</li>
            <li>Comply with legal obligations</li>
          </ul>
        </section>

        <section>
          <h2 className="font-serif text-2xl font-bold text-gray-900">Information Sharing</h2>
          <p>
            We do not sell, trade, or otherwise transfer your personal information to third
            parties without your consent, except for trusted third parties who assist us in
            operating our website, conducting our business, or servicing you. These parties
            agree to keep your information confidential.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl font-bold text-gray-900">Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at{' '}
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-gold-600 hover:underline">
              {CONTACT_EMAIL}
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}

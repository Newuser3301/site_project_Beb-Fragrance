// src/app/terms/page.tsx
import { Metadata } from 'next';
import { SITE_NAME, CONTACT_EMAIL } from '@/lib/constants';

export const metadata: Metadata = {
  title: `Terms of Service | ${SITE_NAME}`,
  description: 'Read our terms and conditions for using our website and services.',
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-12 text-center">
        <h1 className="font-serif text-4xl font-bold text-gray-900 sm:text-5xl">
          Terms of Service
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-lg text-gray-500">
          Last updated: January 1, 2024
        </p>
      </div>

      <div className="prose prose-lg max-w-none space-y-12 text-gray-600">
        <section>
          <h2 className="font-serif text-2xl font-bold text-gray-900">Acceptance of Terms</h2>
          <p>
            By accessing or using the {SITE_NAME} website, you agree to be bound by these Terms
            of Service. If you do not agree to these terms, please do not use our website.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl font-bold text-gray-900">Products and Pricing</h2>
          <p>
            We strive to display our products and pricing accurately. However, we reserve the
            right to correct any errors and to change prices at any time without prior notice.
            All prices are in USD.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl font-bold text-gray-900">Payments</h2>
          <p>
            All payments are processed securely through our payment partners. By providing a
            payment method, you represent that you are authorized to use that payment method.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl font-bold text-gray-900">Contact</h2>
          <p>
            For questions about these Terms, please contact us at{' '}
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-gold-600 hover:underline">
              {CONTACT_EMAIL}
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}

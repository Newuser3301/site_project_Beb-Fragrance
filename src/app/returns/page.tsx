// src/app/returns/page.tsx
import { Metadata } from 'next';
import { SITE_NAME } from '@/lib/constants';

export const metadata: Metadata = {
  title: `Returns & Refunds | ${SITE_NAME}`,
  description: 'Learn about our return and refund policy.',
};

export default function ReturnsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-12 text-center">
        <h1 className="font-serif text-4xl font-bold text-gray-900 sm:text-5xl">
          Returns & Refunds
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-lg text-gray-500">
          We want you to love your fragrance. Here&apos;s our return policy.
        </p>
      </div>

      <div className="prose prose-lg max-w-none space-y-12">
        <section>
          <h2 className="font-serif text-2xl font-bold text-gray-900">Return Window</h2>
          <p className="mt-4 text-gray-600">
            You have 30 calendar days from the date of delivery to return an item. To be eligible
            for a return, the item must be unused, unopened, and in the same condition that you
            received it. It must also be in the original packaging with all seals intact.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl font-bold text-gray-900">Return Process</h2>
          <ol className="mt-4 list-decimal space-y-3 pl-5 text-gray-600">
            <li>Contact our customer service team at info@bebfragrance.com to initiate a return.</li>
            <li>You will receive a Return Authorization Number (RMA) and return shipping label.</li>
            <li>Package the item securely in its original packaging.</li>
            <li>Ship the item back using the provided return label.</li>
            <li>Once received, we will inspect the item and process your refund.</li>
          </ol>
        </section>

        <section>
          <h2 className="font-serif text-2xl font-bold text-gray-900">Refund Timeline</h2>
          <p className="mt-4 text-gray-600">
            Refunds are processed within 5-10 business days after we receive and inspect the
            returned item. The refund will be credited to the original payment method. Please
            note that shipping charges are non-refundable.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl font-bold text-gray-900">Exceptions</h2>
          <p className="mt-4 text-gray-600">
            For hygiene reasons, we cannot accept returns on opened or used fragrances. Gift
            cards are non-returnable. Sale items are final sale and cannot be returned.
          </p>
        </section>
      </div>
    </div>
  );
}

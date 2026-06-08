// src/app/shipping/page.tsx
import { Metadata } from 'next';
import { SITE_NAME, SHIPPING_FREE_THRESHOLD, SHIPPING_COST } from '@/lib/constants';
import { Truck, Globe, Clock, Package } from 'lucide-react';

export const metadata: Metadata = {
  title: `Shipping Policy | ${SITE_NAME}`,
  description: 'Learn about our shipping rates, delivery times, and policies.',
};

export default function ShippingPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-12 text-center">
        <h1 className="font-serif text-4xl font-bold text-gray-900 sm:text-5xl">
          Shipping Policy
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-lg text-gray-500">
          Everything you need to know about our shipping process.
        </p>
      </div>

      <div className="prose prose-lg max-w-none space-y-12">
        <section>
          <h2 className="font-serif text-2xl font-bold text-gray-900">Processing Time</h2>
          <p className="mt-4 text-gray-600">
            All orders are processed within 1-2 business days (excluding weekends and holidays).
            You will receive a confirmation email once your order has been shipped.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl font-bold text-gray-900">Shipping Rates</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-gray-200 bg-white p-6">
              <Truck className="h-8 w-8 text-gold-600" />
              <h3 className="mt-3 font-semibold text-gray-900">Standard Shipping</h3>
              <p className="mt-1 text-sm text-gray-500">5-7 business days</p>
              <p className="mt-2 text-2xl font-bold text-gold-600">
                Free over 
              </p>
              <p className="text-sm text-gray-400">
                 for orders under 
              </p>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-6">
              <Clock className="h-8 w-8 text-gold-600" />
              <h3 className="mt-3 font-semibold text-gray-900">Express Shipping</h3>
              <p className="mt-1 text-sm text-gray-500">2-3 business days</p>
              <p className="mt-2 text-2xl font-bold text-gold-600">.99</p>
              <p className="text-sm text-gray-400">Flat rate for all orders</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="font-serif text-2xl font-bold text-gray-900">International Shipping</h2>
          <p className="mt-4 text-gray-600">
            We ship to over 50 countries worldwide. International shipping rates are calculated
            at checkout based on destination and package weight. Delivery typically takes 7-14
            business days. Please note that international orders may be subject to customs fees
            and import duties.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl font-bold text-gray-900">Order Tracking</h2>
          <p className="mt-4 text-gray-600">
            Once your order ships, you will receive a confirmation email with a tracking number.
            You can track your package through our website or directly on the carrier&apos;s website.
          </p>
        </section>
      </div>
    </div>
  );
}

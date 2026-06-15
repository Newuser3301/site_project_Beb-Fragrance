// src/app/faq/page.tsx
import { Metadata } from 'next';
import { SITE_NAME } from '@/lib/constants';

export const metadata: Metadata = {
  title: `FAQ | ${SITE_NAME}`,
  description: 'Frequently asked questions about our fragrances, shipping, returns, and more.',
};

const faqs = [
  {
    question: 'How do I choose the right fragrance?',
    answer: 'Start by identifying your preferred scent family: floral, oriental, woody, or fresh. Our product pages include detailed descriptions and notes to help you decide. You can also contact our fragrance experts for personalized recommendations.',
  },
  {
    question: 'What are top, heart, and base notes?',
    answer: 'Top notes are the initial scents you smell immediately after application (lasting 15-30 minutes). Heart notes emerge as top notes fade (lasting 2-4 hours). Base notes are the foundation of the fragrance (lasting 4-8+ hours).',
  },
  {
    question: 'How long does perfume last?',
    answer: 'Eau de Parfum (EDP) typically lasts 4-8 hours, while Eau de Toilette (EDT) lasts 2-4 hours. Longevity depends on skin type, application method, and environmental factors. Apply to pulse points for best results.',
  },
  {
    question: 'Do you offer free shipping?',
    answer: 'Yes! We offer free standard shipping on all orders over  within the United States. Orders under  have a flat shipping rate of .99.',
  },
  {
    question: 'What is your return policy?',
    answer: 'We accept returns within 30 days of purchase. Items must be unopened and in original packaging. To initiate a return, please contact our customer service team. Refunds are processed within 5-10 business days.',
  },
  {
    question: 'Are your products authentic?',
    answer: 'Absolutely. Every fragrance we sell is 100% authentic and sourced directly from the manufacturer or authorized distributors. We guarantee the authenticity of all our products.',
  },
  {
    question: 'Do you ship internationally?',
    answer: 'Yes, we ship to over 50 countries worldwide. International shipping rates vary by destination. Please see our Shipping page for more details.',
  },
  {
    question: 'How can I track my order?',
    answer: 'Once your order is shipped, you will receive a confirmation email with a tracking number. You can also view your order status in the "My Orders" section of your account.',
  },
  {
    question: 'Can I cancel or modify my order?',
    answer: 'Orders can be cancelled or modified within 1 hour of placement. After that, the order enters processing and cannot be changed. Please contact us immediately if you need to make changes.',
  },
  {
    question: 'Do you offer gift wrapping?',
    answer: 'Yes, we offer complimentary gift wrapping on all orders. Simply select the gift wrap option at checkout and include a personalized message.',
  },
  {
    question: 'How do I store my perfume?',
    answer: 'Store your fragrance in a cool, dry place away from direct sunlight and heat sources. Keep the bottle tightly closed when not in use. Proper storage can extend the life of your fragrance.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards (Visa, Mastercard, American Express, Discover), PayPal, Apple Pay, and Google Pay. All transactions are secure and encrypted.',
  },
];

export default function FAQPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-12 text-center">
        <h1 className="font-serif text-4xl font-bold text-gray-900 sm:text-5xl">
          Frequently Asked Questions
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-lg text-gray-500">
          Find answers to common questions about our products and services.
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <details
            key={index}
            className="group rounded-2xl border border-gray-200 bg-white transition-all hover:shadow-md"
          >
            <summary className="flex cursor-pointer items-center justify-between px-6 py-5 text-lg font-semibold text-gray-900">
              {faq.question}
              <svg
                className="ml-4 h-5 w-5 shrink-0 text-gray-400 transition-transform group-open:rotate-180"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <div className="px-6 pb-5 text-gray-600">
              <p>{faq.answer}</p>
            </div>
          </details>
        ))}
      </div>

      <div className="mt-12 text-center">
        <p className="text-gray-500">
          Still have questions?{' '}
          <a href="/contact" className="text-gold-600 hover:underline font-medium">
            Contact us
          </a>
        </p>
      </div>
    </div>
  );
}

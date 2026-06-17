// src/app/faq/page.tsx
import { getTranslator } from '@/lib/i18n-server';

export async function generateMetadata() {
  const t = await getTranslator();
  return {
    title: `${t('faqPage.title')} | Beb Fragrance`,
    description: t('faqPage.description'),
  };
}

export default async function FAQPage() {
  const t = await getTranslator();

  const faqs = [
    {
      question: t('faqPage.q1'),
      answer: t('faqPage.a1'),
    },
    {
      question: t('faqPage.q2'),
      answer: t('faqPage.a2'),
    },
    {
      question: t('faqPage.q3'),
      answer: t('faqPage.a3'),
    },
    {
      question: t('faqPage.q4'),
      answer: t('faqPage.a4'),
    },
    {
      question: t('faqPage.q5'),
      answer: t('faqPage.a5'),
    },
    {
      question: t('faqPage.q6'),
      answer: t('faqPage.a6'),
    },
    {
      question: t('faqPage.q7'),
      answer: t('faqPage.a7'),
    },
    {
      question: t('faqPage.q8'),
      answer: t('faqPage.a8'),
    },
    {
      question: t('faqPage.q9'),
      answer: t('faqPage.a9'),
    },
    {
      question: t('faqPage.q10'),
      answer: t('faqPage.a10'),
    },
    {
      question: t('faqPage.q11'),
      answer: t('faqPage.a11'),
    },
    {
      question: t('faqPage.q12'),
      answer: t('faqPage.a12'),
    },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-12 text-center">
        <h1 className="font-serif text-4xl font-bold text-gray-900 dark:text-white sm:text-5xl">
          {t('faqPage.title')}
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-lg text-gray-500 dark:text-gray-400">
          {t('faqPage.description')}
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <details
            key={index}
            className="group rounded-2xl border border-gray-200 bg-white transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
          >
            <summary className="flex cursor-pointer items-center justify-between px-6 py-5 text-lg font-semibold text-gray-900 dark:text-slate-100">
              {faq.question}
              <svg
                className="ml-4 h-5 w-5 shrink-0 text-gray-400 transition-transform group-open:rotate-180 dark:text-slate-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <div className="px-6 pb-5 text-gray-600 dark:text-gray-400">
              <p>{faq.answer}</p>
            </div>
          </details>
        ))}
      </div>

      <div className="mt-12 text-center">
        <p className="text-gray-500 dark:text-gray-400">
          {t('faqPage.stillQuestions')}{' '}
          <a href="/contact" className="text-gold-600 hover:underline font-medium dark:text-gold-400">
            {t('common.contact')}
          </a>
        </p>
      </div>
    </div>
  );
}

// src/app/shipping/page.tsx
import { Truck, Clock } from 'lucide-react';
import { getTranslator } from '@/lib/i18n-server';

export async function generateMetadata() {
  const t = await getTranslator();
  return {
    title: `${t('shippingPage.title')} | Beb Fragrance`,
    description: t('shippingPage.description'),
  };
}

export default async function ShippingPage() {
  const t = await getTranslator();

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-12 text-center">
        <h1 className="font-serif text-4xl font-bold text-gray-900 dark:text-white sm:text-5xl">
          {t('shippingPage.title')}
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-lg text-slate-500 dark:text-slate-400">
          {t('shippingPage.description')}
        </p>
      </div>

      <div className="prose prose-lg max-w-none space-y-12">
        <section>
          <h2 className="font-serif text-2xl font-bold text-gray-900 dark:text-white">{t('shippingPage.s1Title')}</h2>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            {t('shippingPage.s1Desc')}
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl font-bold text-gray-900 dark:text-white">{t('shippingPage.s2Title')}</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
              <Truck className="h-8 w-8 text-gold-600 dark:text-gold-400" />
              <h3 className="mt-3 font-semibold text-gray-900 dark:text-white">{t('shippingPage.standardTitle')}</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{t('shippingPage.standardTime')}</p>
              <p className="mt-2 text-2xl font-bold text-gold-600 dark:text-gold-400">
                {t('shippingPage.standardPriceFree')}
              </p>
              <p className="text-sm text-gray-450 dark:text-slate-500">
                {t('shippingPage.standardPriceFlat')}
              </p>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
              <Clock className="h-8 w-8 text-gold-600 dark:text-gold-400" />
              <h3 className="mt-3 font-semibold text-gray-900 dark:text-white">{t('shippingPage.expressTitle')}</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{t('shippingPage.expressTime')}</p>
              <p className="mt-2 text-2xl font-bold text-gold-600 dark:text-gold-400">{t('shippingPage.expressPrice')}</p>
              <p className="text-sm text-gray-450 dark:text-slate-500">{t('shippingPage.expressPriceSub')}</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="font-serif text-2xl font-bold text-gray-900 dark:text-white">{t('shippingPage.s3Title')}</h2>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            {t('shippingPage.s3Desc')}
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl font-bold text-gray-900 dark:text-white">{t('shippingPage.s4Title')}</h2>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            {t('shippingPage.s4Desc')}
          </p>
        </section>
      </div>
    </div>
  );
}

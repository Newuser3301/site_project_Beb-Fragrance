// src/app/returns/page.tsx
import { getTranslator } from '@/lib/i18n-server';

export async function generateMetadata() {
  const t = await getTranslator();
  return {
    title: `${t('returnsPage.title')} | Beb Fragrance`,
    description: t('returnsPage.description'),
  };
}

export default async function ReturnsPage() {
  const t = await getTranslator();

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-12 text-center">
        <h1 className="font-serif text-4xl font-bold text-gray-900 dark:text-white sm:text-5xl">
          {t('returnsPage.title')}
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-lg text-slate-500 dark:text-slate-400">
          {t('returnsPage.description')}
        </p>
      </div>

      <div className="prose prose-lg max-w-none space-y-12">
        <section>
          <h2 className="font-serif text-2xl font-bold text-gray-900 dark:text-white">{t('returnsPage.s1Title')}</h2>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            {t('returnsPage.s1Desc')}
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl font-bold text-gray-900 dark:text-white">{t('returnsPage.s2Title')}</h2>
          <ol className="mt-4 list-decimal space-y-3 pl-5 text-gray-600 dark:text-gray-400">
            <li>{t('returnsPage.step1')}</li>
            <li>{t('returnsPage.step2')}</li>
            <li>{t('returnsPage.step3')}</li>
            <li>{t('returnsPage.step4')}</li>
            <li>{t('returnsPage.step5')}</li>
          </ol>
        </section>

        <section>
          <h2 className="font-serif text-2xl font-bold text-gray-900 dark:text-white">{t('returnsPage.s3Title')}</h2>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            {t('returnsPage.s3Desc')}
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl font-bold text-gray-900 dark:text-white">{t('returnsPage.s4Title')}</h2>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            {t('returnsPage.s4Desc')}
          </p>
        </section>
      </div>
    </div>
  );
}

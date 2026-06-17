// src/app/privacy/page.tsx
import { getTranslator } from '@/lib/i18n-server';

export async function generateMetadata() {
  const t = await getTranslator();
  return {
    title: `${t('privacyPage.title')} | Beb Fragrance`,
    description: t('privacyPage.s1Desc').slice(0, 150),
  };
}

export default async function PrivacyPage() {
  const t = await getTranslator();

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-12 text-center">
        <h1 className="font-serif text-4xl font-bold text-gray-900 dark:text-white sm:text-5xl">
          {t('privacyPage.title')}
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-lg text-slate-500 dark:text-slate-400">
          {t('privacyPage.lastUpdated')}
        </p>
      </div>

      <div className="prose prose-lg max-w-none space-y-12 text-gray-600 dark:text-gray-450">
        <section>
          <h2 className="font-serif text-2xl font-bold text-gray-900 dark:text-white mb-2">{t('privacyPage.s1Title')}</h2>
          <p>{t('privacyPage.s1Desc')}</p>
        </section>

        <section>
          <h2 className="font-serif text-2xl font-bold text-gray-900 dark:text-white mb-2">{t('privacyPage.s2Title')}</h2>
          <p>{t('privacyPage.s2Desc')}</p>
        </section>

        <section>
          <h2 className="font-serif text-2xl font-bold text-gray-900 dark:text-white mb-2">{t('privacyPage.s3Title')}</h2>
          <p>{t('privacyPage.s3Desc')}</p>
        </section>

        <section>
          <h2 className="font-serif text-2xl font-bold text-gray-900 dark:text-white mb-2">{t('privacyPage.s4Title')}</h2>
          <p>{t('privacyPage.s4Desc')}</p>
        </section>
      </div>
    </div>
  );
}

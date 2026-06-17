// src/app/about/page.tsx
import { Award, Shield, Sparkles, Heart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { getTranslator } from '@/lib/i18n-server';

export async function generateMetadata() {
  const t = await getTranslator();
  return {
    title: `${t('aboutPage.title')} | Beb Fragrance`,
    description: t('aboutPage.description'),
  };
}

export default async function AboutPage() {
  const t = await getTranslator();

  const values = [
    {
      icon: Award,
      title: t('aboutPage.value1Title'),
      description: t('aboutPage.value1Desc'),
    },
    {
      icon: Shield,
      title: t('aboutPage.value2Title'),
      description: t('aboutPage.value2Desc'),
    },
    {
      icon: Sparkles,
      title: t('aboutPage.value3Title'),
      description: t('aboutPage.value3Desc'),
    },
    {
      icon: Heart,
      title: t('aboutPage.value4Title'),
      description: t('aboutPage.value4Desc'),
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      {/* Hero */}
      <div className="mb-16 text-center">
        <h1 className="font-serif text-4xl font-bold text-gray-900 dark:text-white sm:text-5xl">
          {t('aboutPage.title')}
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-500 dark:text-gray-400">
          {t('aboutPage.description')}
        </p>
      </div>

      {/* Story */}
      <div className="mb-16 grid gap-12 lg:grid-cols-2">
        <div>
          <h2 className="font-serif text-3xl font-bold text-gray-900 dark:text-white">{t('aboutPage.storyTitle')}</h2>
          <div className="mt-6 space-y-4 text-gray-600 dark:text-gray-400">
            <p>{t('aboutPage.storyP1')}</p>
            <p>{t('aboutPage.storyP2')}</p>
            <p>{t('aboutPage.storyP3')}</p>
            <p>{t('aboutPage.storyP4')}</p>
          </div>
        </div>
        <div className="flex items-center justify-center">
          <div className="h-96 w-full rounded-3xl bg-gradient-to-br from-gold-100 to-cream-200 p-1 dark:from-slate-800 dark:to-slate-900">
            <div className="flex h-full w-full items-center justify-center rounded-3xl bg-white dark:bg-slate-900">
              <div className="text-center">
                <div className="text-8xl">🌸</div>
                <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">{t('aboutPage.badgeText')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Values */}
      <div className="mb-16">
        <h2 className="text-center font-serif text-3xl font-bold text-gray-900 dark:text-white">
          {t('aboutPage.valuesTitle')}
        </h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((value) => (
            <Card key={value.title} className="text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <CardContent className="p-6">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gold-50 dark:bg-gold-500/10">
                  <value.icon className="h-7 w-7 text-gold-600 dark:text-gold-400" />
                </div>
                <h3 className="mt-4 font-semibold text-gray-900 dark:text-white">{value.title}</h3>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{value.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="rounded-3xl bg-gradient-to-r from-gold-500 to-gold-600 p-10 text-center text-white">
        <h2 className="font-serif text-3xl font-bold">{t('aboutPage.ctaTitle')}</h2>
        <p className="mt-3 text-lg text-white/90">
          {t('aboutPage.ctaDesc')}
        </p>
        <a
          href="/products"
          className="mt-6 inline-block rounded-full bg-white px-8 py-3 font-semibold text-gold-600 hover:bg-slate-50 transition-all hover:shadow-lg"
        >
          {t('aboutPage.ctaButton')}
        </a>
      </div>
    </div>
  );
}

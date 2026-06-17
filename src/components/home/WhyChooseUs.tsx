// src/components/home/WhyChooseUs.tsx
'use client';

import { Shield, Truck, Lock, RotateCcw } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { ScrollReveal } from '@/components/home/ScrollReveal';

export function WhyChooseUs() {
  const t = useTranslations('whyChooseUs');

  const features = [
    {
      icon: Shield,
      title: t('features.authentic.title'),
      description: t('features.authentic.description'),
    },
    {
      icon: Truck,
      title: t('features.shipping.title'),
      description: t('features.shipping.description'),
    },
    {
      icon: Lock,
      title: t('features.payment.title'),
      description: t('features.payment.description'),
    },
    {
      icon: RotateCcw,
      title: t('features.returns.title'),
      description: t('features.returns.description'),
    },
  ];

  return (
    <section className="py-10 md:py-14">
      <div className="container-beb">
        <ScrollReveal className="mb-10 text-center">
          <p className="eyebrow mb-3">{t('eyebrow')}</p>
          <h2 className="section-title">
            {t('title')}
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-[#7d6874]">
            {t('description')}
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <ScrollReveal key={feature.title} delay={index * 0.1}>
                <div className="flex h-full flex-col items-center rounded-[24px] border border-[rgba(106,53,83,0.08)] bg-[#fff8fa] p-8 text-center transition-shadow hover:shadow-[0_18px_40px_rgba(81,42,63,0.08)] dark:border-slate-800 dark:bg-slate-900">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-sm dark:bg-slate-800">
                    <Icon className="h-6 w-6 text-[#7d4b66] dark:text-gold-500" />
                  </div>
                  <h3 className="font-serif text-lg font-semibold text-[#2f1d28] dark:text-slate-100">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#7d6874] dark:text-slate-400">
                    {feature.description}
                  </p>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

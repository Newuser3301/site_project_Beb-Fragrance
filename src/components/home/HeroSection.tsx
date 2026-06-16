'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function HeroSection() {
  const t = useTranslations('hero');
  const bottles = [
    {
      src: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=500&h=700&fit=crop',
      className: 'left-[4%] top-[44%] h-[170px] w-[118px] -rotate-[6deg]',
    },
    {
      src: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=500&h=760&fit=crop',
      className: 'left-[22%] top-[18%] h-[238px] w-[164px] rotate-[1deg]',
    },
    {
      src: 'https://images.unsplash.com/photo-1615634260162-c5170a9bbf62?w=500&h=760&fit=crop',
      className: 'left-[49%] top-[28%] h-[204px] w-[140px] -rotate-[5deg]',
    },
    {
      src: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=500&h=760&fit=crop',
      className: 'right-[3%] top-[20%] h-[222px] w-[152px] rotate-[5deg]',
    },
  ];

  return (
    <section className="pb-6 pt-4 md:pb-8 md:pt-6">
      <div className="container-beb">
        <div className="relative overflow-hidden rounded-[32px] border border-[rgba(106,53,83,0.08)] bg-[linear-gradient(180deg,#ffffff_0%,#fbfbfc_55%,#f6f7f8_100%)] px-6 py-6 shadow-[0_24px_60px_rgba(86,43,66,0.08)] md:px-10 md:py-10 lg:px-14 lg:py-12">
          <div className="absolute inset-y-0 right-0 w-[58%] bg-gradient-to-l from-[rgba(234,236,239,0.75)] via-[rgba(255,255,255,0.35)] to-transparent" />
          <div className="absolute inset-x-0 top-0 h-10 bg-[linear-gradient(180deg,rgba(186,191,198,0.10),transparent)]" />
          <div className="absolute left-[42%] top-10 h-36 w-36 rounded-full bg-white/80 blur-3xl" />
          <div className="absolute bottom-6 right-12 h-28 w-28 rounded-full bg-[#e7e9ee] blur-2xl" />
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-[linear-gradient(180deg,transparent,rgba(241,243,245,0.85))]" />

          <div className="relative z-10 grid items-center gap-8 lg:grid-cols-[1.02fr_1fr]">
            <div className="max-w-xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-4 inline-flex items-center gap-2 rounded-full border border-[rgba(106,53,83,0.10)] bg-white px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#6d415c]"
              >
                <Sparkles className="h-3.5 w-3.5" />
                {t('eyebrow')}
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="max-w-[480px] font-serif text-4xl font-semibold leading-[0.97] text-[#2f1d28] md:text-5xl lg:text-[58px]"
              >
                {t('titleLine1')}
                <br />
                {t('titleLine2')}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="mt-4 max-w-md text-sm leading-7 text-[#5f5860] md:text-base"
              >
                {t('description')}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.35 }}
                className="mt-7 flex flex-col gap-3 sm:flex-row"
              >
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#55324b] px-7 py-3.5 text-sm font-semibold uppercase tracking-[0.16em] text-white transition-all hover:bg-[#43253a]"
                >
                  {t('shopNow')}
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/products?featured=true"
                  className="inline-flex items-center gap-2 rounded-xl border border-[rgba(85,50,75,0.18)] bg-white/80 px-7 py-3.5 text-sm font-semibold uppercase tracking-[0.16em] text-[#55324b] transition-all hover:bg-white"
                >
                  {t('exploreBestSellers')}
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.45 }}
                className="mt-6 grid max-w-lg grid-cols-3 gap-3"
              >
                {[
                  { label: t('stats.brands'), value: '120+' },
                  { label: t('stats.giftReady'), value: '24h' },
                  { label: t('stats.signaturePicks'), value: 'Top 50' },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-2xl border border-white/45 bg-white/45 px-4 py-3 backdrop-blur-sm"
                  >
                    <p className="font-serif text-xl text-[#2f1d28]">{item.value}</p>
                    <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#7c5668]">
                      {item.label}
                    </p>
                  </div>
                ))}
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative hidden min-h-[320px] lg:block"
            >
              <div className="absolute left-[6%] top-[48%] h-24 w-24 rounded-full bg-white/70 blur-xl" />
              <div className="absolute bottom-[8%] left-[12%] h-28 w-28 rounded-full bg-[#eef0f3] blur-lg" />
              {bottles.map((item, index) => (
                <motion.div
                  key={item.src}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.75, delay: 0.18 + index * 0.1 }}
                  className={`absolute overflow-hidden rounded-[26px] border border-white/55 bg-white/45 shadow-[0_18px_40px_rgba(112,118,130,0.16)] backdrop-blur-sm ${item.className}`}
                >
                  <Image
                    src={item.src}
                    alt={t('bottleAlt')}
                    fill
                    className="object-cover"
                    sizes="220px"
                  />
                </motion.div>
              ))}
              <div className="absolute bottom-[8%] right-[8%] rounded-[24px] border border-white/70 bg-white/80 px-5 py-4 backdrop-blur-md">
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#73475f]">
                  {t('newSeason')}
                </p>
                <p className="mt-2 font-serif text-2xl text-[#2f1d28]">{t('shelfMood')}</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

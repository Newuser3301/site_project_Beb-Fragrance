'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';

export function HeroSection() {
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
    <section className="pb-8 pt-6 md:pb-10 md:pt-8">
      <div className="container-beb">
        <div className="relative overflow-hidden rounded-[32px] border border-[rgba(106,53,83,0.08)] bg-[linear-gradient(90deg,#f6c4cf_0%,#f8bcc7_28%,#f7b4c3_100%)] px-6 py-8 shadow-[0_28px_70px_rgba(86,43,66,0.10)] md:px-10 md:py-14 lg:px-14 lg:py-16">
          <div className="absolute inset-y-0 right-0 w-[58%] bg-gradient-to-l from-[rgba(255,255,255,0.26)] via-[rgba(255,255,255,0.08)] to-transparent" />
          <div className="absolute inset-x-0 top-0 h-10 bg-[linear-gradient(180deg,rgba(109,65,92,0.10),transparent)]" />
          <div className="absolute left-[42%] top-12 h-44 w-44 rounded-full bg-white/35 blur-3xl" />
          <div className="absolute bottom-10 right-16 h-32 w-32 rounded-full bg-[#dfa0af] blur-2xl" />
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-[linear-gradient(180deg,transparent,rgba(255,255,255,0.18))]" />

          <div className="relative z-10 grid items-center gap-10 lg:grid-cols-[1.05fr_1fr]">
            <div className="max-w-xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/55 bg-white/55 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#73475f] backdrop-blur-sm"
              >
                <Sparkles className="h-3.5 w-3.5" />
                Timeless Elegance
              </motion.div>
{/*
 spacing preserved intentionally for readable motion blocks
*/}
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="max-w-[480px] font-serif text-5xl font-semibold leading-[0.95] text-[#2f1d28] md:text-6xl lg:text-[72px]"
              >
                Fragrance For
                <br />
                Every Occasion
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="mt-6 max-w-md text-base leading-7 text-[#583849] md:text-lg"
              >
                Discover romantic florals, elegant musks, and statement evening scents curated for daily rituals and unforgettable moments.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.35 }}
                className="mt-10 flex flex-col gap-4 sm:flex-row"
              >
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#55324b] px-7 py-3.5 text-sm font-semibold uppercase tracking-[0.16em] text-white transition-all hover:bg-[#43253a]"
                >
                  Shop Now
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/products?featured=true"
                  className="inline-flex items-center gap-2 rounded-xl border border-[rgba(85,50,75,0.18)] bg-white/80 px-7 py-3.5 text-sm font-semibold uppercase tracking-[0.16em] text-[#55324b] transition-all hover:bg-white"
                >
                  Explore Best Sellers
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.45 }}
                className="mt-8 grid max-w-lg grid-cols-3 gap-3"
              >
                {[
                  { label: 'Luxury Brands', value: '120+' },
                  { label: 'Gift Ready', value: '24h' },
                  { label: 'Signature Picks', value: 'Top 50' },
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
              className="relative hidden min-h-[420px] lg:block"
            >
              <div className="absolute left-[6%] top-[48%] h-24 w-24 rounded-full bg-white/70 blur-xl" />
              <div className="absolute bottom-[8%] left-[12%] h-28 w-28 rounded-full bg-[#efc1cb] blur-lg" />
              {bottles.map((item, index) => (
                <motion.div
                  key={item.src}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.75, delay: 0.18 + index * 0.1 }}
                  className={`absolute overflow-hidden rounded-[26px] border border-white/35 bg-white/20 shadow-[0_24px_50px_rgba(120,67,90,0.18)] backdrop-blur-sm ${item.className}`}
                >
                  <Image
                    src={item.src}
                    alt="Luxury perfume bottle"
                    fill
                    className="object-cover"
                    sizes="220px"
                  />
                </motion.div>
              ))}
              <div className="absolute bottom-[8%] right-[8%] rounded-[24px] border border-white/40 bg-white/35 px-5 py-4 backdrop-blur-md">
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#73475f]">
                  New Season Edit
                </p>
                <p className="mt-2 font-serif text-2xl text-[#2f1d28]">Soft pink shelf mood</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

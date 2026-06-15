'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="pb-8 pt-6 md:pb-10 md:pt-8">
      <div className="container-beb">
        <div className="relative overflow-hidden rounded-[30px] bg-[#f8b7c2] px-6 py-10 md:px-10 md:py-14 lg:px-14 lg:py-16">
          <div className="absolute inset-y-0 right-0 w-[55%] bg-gradient-to-l from-[rgba(255,255,255,0.22)] to-transparent" />
          <div className="absolute left-[42%] top-12 h-44 w-44 rounded-full bg-white/30 blur-3xl" />
          <div className="absolute bottom-10 right-16 h-32 w-32 rounded-full bg-[#dfa0af] blur-2xl" />

          <div className="relative z-10 grid items-center gap-10 lg:grid-cols-[1.05fr_1fr]">
            <div className="max-w-xl">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
                className="eyebrow mb-5 text-[#73475f]"
          >
                Timeless Elegance
          </motion.p>

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
        </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative hidden min-h-[420px] lg:block"
            >
              <div className="absolute left-[6%] top-[48%] h-24 w-24 rounded-full bg-white/70 blur-xl" />
              <div className="absolute bottom-[8%] left-[12%] h-28 w-28 rounded-full bg-[#efc1cb] blur-lg" />
              {[
                {
                  src: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=500&h=700&fit=crop',
                  className: 'left-[8%] top-[34%] h-[180px] w-[128px] -rotate-[4deg]',
                },
                {
                  src: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=500&h=760&fit=crop',
                  className: 'left-[28%] top-[18%] h-[230px] w-[160px] rotate-[2deg]',
                },
                {
                  src: 'https://images.unsplash.com/photo-1615634260162-c5170a9bbf62?w=500&h=760&fit=crop',
                  className: 'left-[52%] top-[26%] h-[210px] w-[144px] -rotate-[3deg]',
                },
                {
                  src: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=500&h=760&fit=crop',
                  className: 'right-[2%] top-[24%] h-[218px] w-[150px] rotate-[5deg]',
                },
              ].map((item, index) => (
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
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

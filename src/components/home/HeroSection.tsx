'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden bg-[#F5F0E8]">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-[rgba(212,168,67,0.08)] blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-[rgba(232,53,74,0.05)] blur-3xl" />
      </div>

      <div className="container-beb relative z-10 py-24">
        <div className="max-w-2xl">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-[#D4A843]"
          >
            Premium Fragrance Collection
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-['Playfair_Display',_serif] text-5xl font-bold leading-tight text-[#1A1A1A] md:text-6xl lg:text-7xl"
          >
            Discover Your
            <br />
            <span className="italic text-[#D4A843]">Signature Scent</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-6 max-w-lg text-base leading-relaxed text-[#6B6B6B] md:text-lg"
          >
            Explore our curated collection of premium fragrances crafted for those who appreciate the art of luxury perfumery and timeless elegance.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="mt-10 flex flex-col gap-4 sm:flex-row"
          >
            <Link
              href="/products"
              className="inline-flex items-center gap-2 rounded-full bg-[#1A1A1A] px-8 py-3.5 text-sm font-semibold text-white transition-all hover:bg-[#2D2D2D]"
            >
              Shop Now
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/categories/floral"
              className="inline-flex items-center gap-2 rounded-full border border-[#D0D0D0] bg-white px-8 py-3.5 text-sm font-medium text-[#1A1A1A] transition-all hover:border-[#1A1A1A]"
            >
              Explore Collections
              <Sparkles className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Decorative floating element */}
      <motion.div
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute right-[8%] top-1/4 hidden h-48 w-48 rounded-full border border-[rgba(212,168,67,0.15)] bg-gradient-to-b from-[rgba(212,168,67,0.06)] to-transparent lg:flex items-center justify-center"
      >
        <Sparkles className="h-12 w-12 text-[rgba(212,168,67,0.3)]" />
      </motion.div>
    </section>
  );
}

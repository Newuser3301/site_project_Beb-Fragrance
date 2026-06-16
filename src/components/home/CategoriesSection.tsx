'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { ScrollReveal } from '@/components/home/ScrollReveal';

const categoryCards = [
  {
    title: 'Women Perfumes',
    subtitle: '7 items',
    href: '/products?gender=FEMALE',
    image:
      'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=1200&h=900&fit=crop',
    span: 'md:col-span-2',
  },
  {
    title: 'Men Cologne',
    subtitle: '8 items',
    href: '/products?gender=MALE',
    image:
      'https://images.unsplash.com/photo-1541643600914-78b084683601?w=900&h=900&fit=crop',
  },
  {
    title: 'Gift Sets',
    subtitle: '10 items',
    href: '/products?gender=UNISEX',
    image:
      'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=900&h=900&fit=crop',
  },
];

export function CategoriesSection() {
  return (
    <section className="pb-8 pt-2 md:pb-10">
      <div className="container-beb">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow mb-2">Signature Families</p>
            <h2 className="font-serif text-[30px] leading-tight text-[#2f1d28] md:text-[38px]">
              Boutique shelves arranged by mood, gift, and daily ritual
            </h2>
          </div>
          <Link
            href="/products"
            className="hidden rounded-full border border-[rgba(106,53,83,0.12)] bg-white px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#6d415c] transition-colors hover:bg-[#fff7fa] md:inline-flex"
          >
            View All
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-4">
          {categoryCards.map((card, index) => (
            <ScrollReveal key={card.title} delay={index * 0.1}>
              <Link
                href={card.href}
                className={`group block ${card.span ?? ''}`}
              >
                <motion.div
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden rounded-[26px] border border-[rgba(106,53,83,0.08)] bg-white shadow-[0_16px_35px_rgba(81,42,63,0.05)]"
                >
                  <div className="relative aspect-[1.4/1] overflow-hidden bg-[#fdf2f5] md:aspect-[1.08/1]">
                    <div className="absolute inset-0 z-[1] bg-gradient-to-t from-[rgba(54,27,42,0.35)] via-transparent to-transparent" />
                    <Image
                      src={card.image}
                      alt={card.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <div className="absolute bottom-4 left-4 z-[2] rounded-full bg-white/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#6d415c]">
                      {card.subtitle}
                    </div>
                  </div>
                  <div className="flex items-center justify-between px-5 py-4">
                    <div>
                      <h3 className="font-serif text-lg font-semibold text-[#2f1d28]">
                        {card.title}
                      </h3>
                      <p className="mt-1 max-w-[18rem] text-sm text-[#8c6d7d]">
                        Discover curated perfumes tailored to this scent mood.
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#7d4b66] transition-colors group-hover:text-[#55324b]">
                      Shop
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </motion.div>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { ScrollReveal } from '@/components/home/ScrollReveal';

const categoryCards = [
  {
    title: 'For Her',
    subtitle: 'Elegant floral & oriental scents',
    href: '/products?gender=WOMEN',
    image:
      'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800&h=1000&fit=crop',
    gradient: 'from-perfume-600/80 to-perfume-900/90',
    hoverBorder: 'hover:border-perfume-300',
  },
  {
    title: 'For Him',
    subtitle: 'Bold woody & fresh fragrances',
    href: '/products?gender=MEN',
    image:
      'https://images.unsplash.com/photo-1615634260162-c5170a9bbf62?w=800&h=1000&fit=crop',
    gradient: 'from-oud-600/80 to-oud-900/90',
    hoverBorder: 'hover:border-oud-300',
  },
  {
    title: 'Unisex',
    subtitle: 'Timeless scents for everyone',
    href: '/products?gender=UNISEX',
    image:
      'https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&h=1000&fit=crop',
    gradient: 'from-gold-600/80 to-gold-900/90',
    hoverBorder: 'hover:border-gold-300',
  },
];

export function CategoriesSection() {
  return (
    <section className="bg-cream-50 py-24">
      <div className="container-beb">
        <ScrollReveal className="mb-12 text-center">
          <h2 className="font-serif text-3xl font-bold text-foreground md:text-4xl">
            Shop by Category
          </h2>
          <p className="mt-3 text-muted-foreground">
            Find your perfect fragrance
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {categoryCards.map((card, index) => (
            <ScrollReveal key={card.title} delay={index * 0.1}>
              <Link href={card.href} className="group block">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                  className={`relative aspect-[4/5] overflow-hidden rounded-2xl border border-transparent shadow-luxury ${card.hoverBorder}`}
                >
                  <Image
                    src={card.image}
                    alt={card.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div
                    className={`absolute inset-0 bg-gradient-to-t ${card.gradient}`}
                  />
                  <div className="absolute inset-0 flex flex-col justify-end p-8 text-white">
                    <h3 className="font-serif text-2xl font-bold">
                      {card.title}
                    </h3>
                    <p className="mt-2 text-sm text-white/80">{card.subtitle}</p>
                    <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-gold-300 transition-colors group-hover:text-gold-200">
                      Shop Now
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
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

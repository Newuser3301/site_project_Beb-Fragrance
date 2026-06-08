'use client';

import { Shield, Truck, Lock, RotateCcw } from 'lucide-react';
import { ScrollReveal } from '@/components/home/ScrollReveal';

const features = [
  {
    icon: Shield,
    title: 'Authentic Products',
    description: '100% genuine fragrances from authorized distributors',
  },
  {
    icon: Truck,
    title: 'Free Shipping',
    description: 'On orders over $100 worldwide',
  },
  {
    icon: Lock,
    title: 'Secure Payment',
    description: 'Encrypted transactions for your peace of mind',
  },
  {
    icon: RotateCcw,
    title: 'Easy Returns',
    description: '30-day return policy on unopened items',
  },
];

export function WhyChooseUs() {
  return (
    <section className="bg-white py-24">
      <div className="container-beb">
        <ScrollReveal className="mb-12 text-center">
          <h2 className="font-serif text-3xl font-bold text-foreground md:text-4xl">
            Why Choose Beb Fragrance
          </h2>
          <p className="mt-3 text-muted-foreground">
            The luxury experience you deserve
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <ScrollReveal key={feature.title} delay={index * 0.1}>
                <div className="flex flex-col items-center rounded-xl border border-border bg-cream-50 p-8 text-center transition-shadow hover:shadow-luxury">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gold-100">
                    <Icon className="h-7 w-7 text-gold-600" />
                  </div>
                  <h3 className="font-serif text-lg font-semibold text-foreground">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
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

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
    <section className="py-10 md:py-14">
      <div className="container-beb">
        <ScrollReveal className="mb-10 text-center">
          <p className="eyebrow mb-3">Only High Quality Is The Only Way</p>
          <h2 className="section-title">
            Premium service wrapped in a soft luxury shopping experience
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-[#7d6874]">
            From authentic perfumes to gift-ready packaging, every detail is tailored to feel elegant, smooth, and trustworthy.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <ScrollReveal key={feature.title} delay={index * 0.1}>
                <div className="flex h-full flex-col items-center rounded-[24px] border border-[rgba(106,53,83,0.08)] bg-[#fff8fa] p-8 text-center transition-shadow hover:shadow-[0_18px_40px_rgba(81,42,63,0.08)]">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-sm">
                    <Icon className="h-6 w-6 text-[#7d4b66]" />
                  </div>
                  <h3 className="font-serif text-lg font-semibold text-[#2f1d28]">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#7d6874]">
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

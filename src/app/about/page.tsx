// src/app/about/page.tsx
import { Metadata } from 'next';
import { motion } from 'framer-motion';
import { Award, Shield, Sparkles, Heart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { SITE_NAME } from '@/lib/constants';

export const metadata: Metadata = {
  title: `About Us | ${SITE_NAME}`,
  description: `Learn about ${SITE_NAME}, our passion for luxury fragrances and commitment to authenticity.`,
};

export default function AboutPage() {
  const values = [
    {
      icon: Award,
      title: 'Quality',
      description: 'We source only the finest ingredients from renowned perfume houses around the world.',
    },
    {
      icon: Shield,
      title: 'Authenticity',
      description: 'Every fragrance in our collection is 100% authentic and comes directly from the manufacturer.',
    },
    {
      icon: Sparkles,
      title: 'Elegance',
      description: 'We believe that fragrance is an art form, and we curate our collection with an eye for sophistication.',
    },
    {
      icon: Heart,
      title: 'Passion',
      description: 'Our team of fragrance experts is dedicated to helping you find your signature scent.',
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      {/* Hero */}
      <div className="mb-16 text-center">
        <h1 className="font-serif text-4xl font-bold text-gray-900 sm:text-5xl">
          About {SITE_NAME}
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-500">
          Your destination for premium, authentic fragrances. We bring the world&apos;s most
          exquisite scents to your doorstep.
        </p>
      </div>

      {/* Story */}
      <div className="mb-16 grid gap-12 lg:grid-cols-2">
        <div>
          <h2 className="font-serif text-3xl font-bold text-gray-900">Our Story</h2>
          <div className="mt-6 space-y-4 text-gray-600">
            <p>
              Founded in 2020, {SITE_NAME} was born from a simple passion: the love of
              extraordinary fragrances. What started as a small boutique has grown into one
              of the most trusted names in luxury perfumery.
            </p>
            <p>
              We believe that a fragrance is more than just a scent—it&apos;s a memory, an
              emotion, a statement. That&apos;s why we travel the world to find the most
              captivating perfumes from both legendary houses and emerging artisans.
            </p>
            <p>
              Our commitment to authenticity means that every bottle we sell is guaranteed
              genuine. We work directly with manufacturers and authorized distributors to
              ensure that what you receive is exactly what the perfumer intended.
            </p>
            <p>
              Today, we are proud to serve thousands of customers who trust us to deliver
              not just products, but experiences that last a lifetime.
            </p>
          </div>
        </div>
        <div className="flex items-center justify-center">
          <div className="h-96 w-full rounded-3xl bg-gradient-to-br from-gold-100 to-cream-200 p-1">
            <div className="flex h-full w-full items-center justify-center rounded-3xl bg-white">
              <div className="text-center">
                <div className="text-8xl">🌸</div>
                <p className="mt-4 text-lg text-gray-500">Premium Fragrances Since 2020</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Values */}
      <div className="mb-16">
        <h2 className="text-center font-serif text-3xl font-bold text-gray-900">
          Our Values
        </h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((value) => (
            <Card key={value.title} className="text-center">
              <CardContent className="p-6">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gold-50">
                  <value.icon className="h-7 w-7 text-gold-600" />
                </div>
                <h3 className="mt-4 font-semibold text-gray-900">{value.title}</h3>
                <p className="mt-2 text-sm text-gray-500">{value.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="rounded-3xl bg-gradient-to-r from-gold-500 to-gold-600 p-10 text-center text-white">
        <h2 className="font-serif text-3xl font-bold">Find Your Signature Scent</h2>
        <p className="mt-3 text-lg text-white/90">
          Explore our curated collection of premium fragrances
        </p>
        <a
          href="/products"
          className="mt-6 inline-block rounded-full bg-white px-8 py-3 font-semibold text-gold-600 transition-all hover:shadow-lg"
        >
          Shop Now
        </a>
      </div>
    </div>
  );
}

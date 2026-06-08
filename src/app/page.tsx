// src/app/page.tsx
import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { HeroSection } from '@/components/home/HeroSection';
import { CategoriesSection } from '@/components/home/CategoriesSection';
import { WhyChooseUs } from '@/components/home/WhyChooseUs';
import { TestimonialsSection } from '@/components/home/TestimonialsSection';
import { ScrollReveal } from '@/components/home/ScrollReveal';
import { ProductGrid } from '@/components/product/ProductGrid';
import { Newsletter } from '@/components/layout/Newsletter';
import { LoadingSkeleton } from '@/components/shared/LoadingSkeleton';
import { ArrowRight } from 'lucide-react';
import {
  fetchBestsellerProducts,
  fetchFeaturedProducts,
} from '@/lib/products-server';

export const metadata: Metadata = {
  title: 'Beb Fragrance | Premium Perfume Store',
  description:
    'Discover luxury fragrances at Beb Fragrance. Shop premium perfumes for men and women from the world\'s finest brands. Free shipping on orders over $100.',
  openGraph: {
    title: 'Beb Fragrance | Premium Perfume Store',
    description:
      'Discover luxury fragrances at Beb Fragrance. Shop premium perfumes for men and women.',
    type: 'website',
  },
};

async function FeaturedProductsSection() {
  const products = await fetchFeaturedProducts(6);

  return (
    <section className="py-20 lg:py-28">
      <div className="container-beb">
        <ScrollReveal className="mb-12 text-center">
          <h2 className="font-serif text-3xl font-bold uppercase tracking-wide text-[#1A1A1A] md:text-4xl">
            Featured Collection
          </h2>
          <p className="mt-3 text-sm text-[#6B6B6B]">
            Handpicked favorites by our fragrance experts
          </p>
        </ScrollReveal>

        <ProductGrid products={products} />

        <div className="mt-12 text-center">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 rounded-full border border-[#D0D0D0] bg-white px-8 py-3 text-sm font-medium text-[#1A1A1A] transition-all hover:border-[#1A1A1A]"
          >
            View All Fragrances
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

async function BestSellersSection() {
  const products = await fetchBestsellerProducts(6);

  return (
    <section className="py-20 lg:py-28">
      <div className="container-beb">
        <ScrollReveal className="mb-12 text-center">
          <h2 className="font-serif text-3xl font-bold uppercase tracking-wide text-[#1A1A1A] md:text-4xl">
            Best Sellers <span className="italic text-[#D4A843]">& Trending</span>
          </h2>
          <p className="mt-3 text-sm text-[#6B6B6B]">
            Our most loved fragrances, chosen by thousands of customers worldwide
          </p>
        </ScrollReveal>

        <ProductGrid products={products} />

        <div className="mt-12 text-center">
          <Link
            href="/products?sort=bestseller"
            className="inline-flex items-center gap-2 rounded-full bg-[#1A1A1A] px-8 py-3 text-sm font-semibold text-white transition-all hover:bg-[#2D2D2D]"
          >
            Explore Best Sellers
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function ProductsFallback() {
  return (
    <section className="py-20 lg:py-28">
      <div className="container-beb">
        <div className="mb-12 space-y-3 text-center">
          <div className="mx-auto h-3 w-28 animate-pulse rounded bg-[rgba(0,0,0,0.08)]" />
          <div className="mx-auto h-8 w-64 animate-pulse rounded bg-[rgba(0,0,0,0.06)]" />
          <div className="mx-auto h-4 w-48 animate-pulse rounded bg-[rgba(0,0,0,0.06)]" />
        </div>
        <LoadingSkeleton variant="product-card" count={6} />
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <HeroSection />

      {/* Categories Section */}
      <CategoriesSection />

      {/* Featured Products */}
      <Suspense fallback={<ProductsFallback />}>
        <FeaturedProductsSection />
      </Suspense>

      {/* Best Sellers */}
      <Suspense
        fallback={
          <section className="py-20 lg:py-28">
            <div className="container-beb">
              <LoadingSkeleton variant="product-card" count={6} />
            </div>
          </section>
        }
      >
        <BestSellersSection />
      </Suspense>

      {/* Why Choose Us */}
      <WhyChooseUs />

      {/* Newsletter */}
      <section className="py-20 lg:py-28">
        <div className="container-beb">
          <ScrollReveal className="mx-auto max-w-2xl text-center">
            <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-[0.3em] text-[#D4A843]">
              Stay Connected
            </span>
            <h2 className="font-serif text-3xl font-bold uppercase tracking-wide text-[#1A1A1A] md:text-4xl">
              Join the Club
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-[#6B6B6B]">
              Be the first to know about new arrivals, exclusive offers, and fragrance tips from our experts.
            </p>
            <div className="mt-10">
              <Newsletter />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Testimonials */}
      <TestimonialsSection />
    </>
  );
}

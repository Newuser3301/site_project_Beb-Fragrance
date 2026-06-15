import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';
import { ArrowRight, Play } from 'lucide-react';
import { HeroSection } from '@/components/home/HeroSection';
import { CategoriesSection } from '@/components/home/CategoriesSection';
import { WhyChooseUs } from '@/components/home/WhyChooseUs';
import { TestimonialsSection } from '@/components/home/TestimonialsSection';
import { ScrollReveal } from '@/components/home/ScrollReveal';
import { ProductGrid } from '@/components/product/ProductGrid';
import { Newsletter } from '@/components/layout/Newsletter';
import { LoadingSkeleton } from '@/components/shared/LoadingSkeleton';
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

function HomeSectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <ScrollReveal className="mb-8 text-center md:mb-10">
      <p className="eyebrow mb-3">{eyebrow}</p>
      <h2 className="section-title">{title}</h2>
      {description ? (
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-[#7d6874]">
          {description}
        </p>
      ) : null}
    </ScrollReveal>
  );
}

async function FeaturedProductsSection() {
  const products = await fetchFeaturedProducts(4);

  return (
    <section className="py-10 md:py-14">
      <div className="container-beb">
        <HomeSectionHeading
          eyebrow="Our Best Sellers"
          title="A soft edit of signature bottles for women, men, and gift moments"
        />

        <div className="mb-8 flex items-center justify-center gap-5 text-xs font-semibold uppercase tracking-[0.18em] text-[#8c6d7d]">
          <span className="text-[#55324b]">Women</span>
          <span>Men</span>
          <span>Kids</span>
        </div>

        <ProductGrid products={products} />
      </div>
    </section>
  );
}

async function BestSellersSection() {
  const products = await fetchBestsellerProducts(8);

  return (
    <section className="py-10 md:py-14">
      <div className="container-beb">
        <HomeSectionHeading
          eyebrow="Popular Perfumes"
          title="Curated bottles with a polished department-store feel"
          description="A clean pastel grid inspired by classic fragrance boutiques, made to spotlight the bottle first."
        />

        <ProductGrid products={products} />
      </div>
    </section>
  );
}

function EditorialBannerSection() {
  return (
    <section className="py-10 md:py-14">
      <div className="container-beb">
        <div className="overflow-hidden rounded-[30px] bg-[#f5eadf] p-6 md:p-8">
          <p className="eyebrow mb-3">Your Signature Scent</p>
          <div className="grid gap-6 lg:grid-cols-[0.86fr_1.14fr] lg:items-center">
            <div className="max-w-xl">
              <h2 className="section-title">
                Find the perfect perfume to express your unique style
              </h2>
              <p className="mt-4 text-sm leading-7 text-[#7d6874]">
                Warm amber evenings, soft rose mornings, and elegant fresh notes for daily rituals. Explore the moods behind each scent family.
              </p>
              <Link
                href="/products"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#55324b] px-6 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-white transition-colors hover:bg-[#43253a]"
              >
                Shop The Collection
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="relative min-h-[250px] overflow-hidden rounded-[24px] bg-gradient-to-br from-[#24182e] via-[#40284e] to-[#8b5673] p-6 shadow-[0_24px_50px_rgba(48,20,41,0.18)]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.18),transparent_30%)]" />
              <div className="absolute left-[16%] top-[18%] h-36 w-24 rounded-[18px] bg-[#bfa8cb]/25 shadow-[0_30px_40px_rgba(0,0,0,0.25)] backdrop-blur-sm" />
              <div className="absolute left-[38%] top-[12%] h-44 w-28 rounded-[20px] bg-[#f5d7df]/20 shadow-[0_35px_45px_rgba(0,0,0,0.28)] backdrop-blur-sm" />
              <div className="absolute left-[60%] top-[27%] h-28 w-20 rounded-[18px] bg-[#ffedf5]/18 shadow-[0_25px_35px_rgba(0,0,0,0.22)] backdrop-blur-sm" />
              <button
                type="button"
                className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur-sm"
                aria-label="Play brand film"
              >
                <Play className="ml-0.5 h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ScentJournalSection() {
  const articles = [
    {
      title: 'How to choose a daytime fragrance',
      image:
        'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=900&h=700&fit=crop',
    },
    {
      title: 'Romantic florals for elegant gifting',
      image:
        'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=900&h=700&fit=crop',
    },
    {
      title: 'Layering scents for a lasting signature',
      image:
        'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=900&h=700&fit=crop',
    },
  ];

  return (
    <section className="py-10 md:py-14">
      <div className="container-beb">
        <HomeSectionHeading
          eyebrow="News & Blog Updates"
          title="Soft editorial moments inspired by boutique perfume magazines"
        />

        <div className="grid gap-6 md:grid-cols-3">
          {articles.map((article) => (
            <article
              key={article.title}
              className="overflow-hidden rounded-[24px] border border-[rgba(106,53,83,0.08)] bg-white shadow-[0_16px_35px_rgba(81,42,63,0.04)]"
            >
              <div className="relative aspect-[1.35/1] overflow-hidden bg-[#fdf2f5]">
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div className="p-5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8c6d7d]">
                  Fragrance Journal
                </p>
                <h3 className="mt-2 font-serif text-xl text-[#2f1d28]">
                  {article.title}
                </h3>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductsFallback() {
  return (
    <section className="py-10 md:py-14">
      <div className="container-beb">
        <div className="mb-8 space-y-3 text-center">
          <div className="mx-auto h-3 w-28 animate-pulse rounded bg-[#edd5df]" />
          <div className="mx-auto h-8 w-64 animate-pulse rounded bg-[#f3dfe6]" />
          <div className="mx-auto h-4 w-48 animate-pulse rounded bg-[#f3dfe6]" />
        </div>
        <LoadingSkeleton variant="product-card" count={4} />
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <CategoriesSection />

      <Suspense fallback={<ProductsFallback />}>
        <FeaturedProductsSection />
      </Suspense>

      <EditorialBannerSection />

      <Suspense fallback={<ProductsFallback />}>
        <BestSellersSection />
      </Suspense>

      <WhyChooseUs />

      <section className="py-10 md:py-14">
        <div className="container-beb">
          <div className="overflow-hidden rounded-[30px] bg-[#f8b7c2] px-6 py-12 text-center md:px-12">
            <ScrollReveal className="mx-auto max-w-2xl">
              <p className="eyebrow mb-3 text-[#73475f]">Stay Connected</p>
              <h2 className="section-title">Join the club for new arrivals and exclusive offers</h2>
              <p className="mt-4 text-sm leading-7 text-[#583849]">
                Receive launches, restock alerts, and perfume notes from our fragrance desk.
              </p>
              <div className="mx-auto mt-8 max-w-xl">
                <Newsletter />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <TestimonialsSection />
      <ScentJournalSection />
    </>
  );
}

// src/app/not-found.tsx
import Link from 'next/link';
import { Home, ShoppingBag, Search } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="relative flex min-h-[80vh] flex-col items-center justify-center overflow-hidden px-4 text-center">
      {/* Background decorations */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 top-1/4 h-64 w-64 rounded-full bg-gold-100 opacity-50 blur-3xl" />
        <div className="absolute -right-32 bottom-1/4 h-64 w-64 rounded-full bg-perfume-100 opacity-50 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-lg">
        {/* 404 Number */}
        <div className="relative mb-6">
          <p className="select-none font-serif text-[8rem] font-bold leading-none tracking-tight text-gold-100 md:text-[10rem]">
            404
          </p>
          <p className="absolute inset-0 flex items-center justify-center font-serif text-[8rem] font-bold leading-none tracking-tight text-gold-400/30 blur-sm md:text-[10rem]">
            404
          </p>
          {/* Overlay text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Search className="h-16 w-16 text-gold-400 md:h-20 md:w-20" />
          </div>
        </div>

        {/* Headline */}
        <h1 className="font-serif text-3xl font-bold text-foreground md:text-4xl">
          Page Not Found
        </h1>

        {/* Divider */}
        <div className="mx-auto my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <div className="h-1.5 w-1.5 rotate-45 bg-gold-400" />
          <div className="h-px flex-1 bg-border" />
        </div>

        {/* Description */}
        <p className="text-base leading-relaxed text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
          Let&apos;s get you back on track.
        </p>

        {/* Suggestions */}
        <p className="mt-4 text-sm text-muted-foreground">
          You might want to check out our{' '}
          <Link
            href="/products"
            className="font-medium text-gold-600 underline-offset-2 hover:underline"
          >
            full collection
          </Link>{' '}
          or go back to the{' '}
          <Link
            href="/"
            className="font-medium text-gold-600 underline-offset-2 hover:underline"
          >
            homepage
          </Link>
          .
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button variant="luxury" size="lg" asChild>
            <Link href="/" id="not-found-home-btn">
              <Home className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/products" id="not-found-shop-btn">
              <ShoppingBag className="mr-2 h-4 w-4" />
              Continue Shopping
            </Link>
          </Button>
        </div>

        {/* Popular links */}
        <div className="mt-10">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Popular Categories
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              { label: 'For Her', href: '/products?gender=WOMEN' },
              { label: 'For Him', href: '/products?gender=MEN' },
              { label: 'Unisex', href: '/products?gender=UNISEX' },
              { label: 'Best Sellers', href: '/products?sort=bestseller' },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-full border border-border bg-white px-4 py-1.5 text-sm text-muted-foreground transition-colors hover:border-gold-300 hover:text-gold-600"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// src/components/cart/EmptyCart.tsx
'use client';

import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';

export function EmptyCart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center py-24 text-center"
    >
      {/* Icon */}
      <div className="relative mb-6">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-cream-100 to-cream-200">
          <ShoppingBag className="h-12 w-12 text-muted-foreground/40" />
        </div>
        <div className="absolute -right-1 -top-1 flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-gold-400 to-gold-600 text-xs font-bold text-white shadow-md">
          0
        </div>
      </div>

      {/* Text */}
      <h2 className="font-serif text-2xl font-bold text-foreground md:text-3xl">
        Your cart is empty
      </h2>
      <p className="mt-3 max-w-sm text-base leading-relaxed text-muted-foreground">
        Looks like you haven&apos;t added anything to your cart yet. Explore our
        luxury fragrance collection.
      </p>

      {/* Divider */}
      <div className="my-8 flex items-center gap-3">
        <div className="h-px w-16 bg-border" />
        <div className="h-1.5 w-1.5 rotate-45 bg-gold-400" />
        <div className="h-px w-16 bg-border" />
      </div>

      {/* CTA */}
      <Button variant="luxury" size="lg" asChild>
        <Link href="/products">Start Shopping</Link>
      </Button>

      {/* Quick links */}
      <div className="mt-8">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Popular Categories
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {[
            { label: 'For Her', href: '/products?gender=WOMEN' },
            { label: 'For Him', href: '/products?gender=MEN' },
            { label: 'Best Sellers', href: '/products?sort=bestseller' },
            { label: 'New Arrivals', href: '/products?sort=newest' },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full border border-border bg-white px-4 py-1.5 text-sm text-muted-foreground transition-all hover:border-gold-300 hover:text-gold-600 hover:shadow-sm"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

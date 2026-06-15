// src/components/checkout/OrderSummary.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { CartItem } from '@/store/useCartStore';
import { formatPrice } from '@/lib/utils';
import { cn } from '@/lib/utils';

const FREE_SHIPPING_THRESHOLD = 100;
const SHIPPING_COST = 9.99;
const TAX_RATE = 0.08;

interface OrderSummaryProps {
  items: CartItem[];
  className?: string;
}

export function OrderSummary({ items, className }: OrderSummaryProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const tax = subtotal * TAX_RATE;
  const total = subtotal + shipping + tax;
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className={cn('rounded-2xl border border-border bg-white p-6 shadow-sm', className)}>
      {/* Header with toggle for mobile */}
      <button
        type="button"
        onClick={() => setIsExpanded((prev) => !prev)}
        className="flex w-full items-center justify-between md:cursor-default"
        aria-expanded={isExpanded}
      >
        <div className="flex items-center gap-2">
          <h2 className="font-serif text-lg font-bold text-foreground">
            Order Summary
          </h2>
          <span className="rounded-full bg-gold-100 px-2 py-0.5 text-xs font-semibold text-gold-700">
            {itemCount} {itemCount === 1 ? 'item' : 'items'}
          </span>
        </div>
        <div className="flex items-center gap-2 md:hidden">
          <span className="font-serif font-bold text-gold-600">
            {formatPrice(total, 'USD', 'en-US')}
          </span>
          {isExpanded ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
      </button>

      {/* Items list — always visible on desktop, toggle on mobile */}
      <div className={cn('md:block', isExpanded ? 'block' : 'hidden')}>
        <AnimatePresence>
          <motion.div
            initial={false}
            animate={{ opacity: 1 }}
            className="mt-4 space-y-3"
          >
            {items.map((item) => (
              <div key={item.productId} className="flex items-center gap-3">
                {/* Product image with quantity badge */}
                <div className="relative shrink-0">
                  <div className="relative h-14 w-14 overflow-hidden rounded-lg bg-cream-100">
                    <Image
                      src={item.image || '/placeholder-perfume.jpg'}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                  </div>
                  <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-oud-700 text-[10px] font-bold text-white">
                    {item.quantity}
                  </span>
                </div>

                {/* Name & price */}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">
                    {item.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {item.brand} · {item.volume}
                  </p>
                </div>

                <span className="shrink-0 text-sm font-semibold text-foreground">
                  {formatPrice(item.price * item.quantity, 'USD', 'en-US')}
                </span>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Price breakdown */}
        <div className="mt-5 border-t border-border pt-5 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-medium">{formatPrice(subtotal, 'USD', 'en-US')}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Shipping</span>
            <span className={cn('font-medium', shipping === 0 ? 'text-emerald-600' : '')}>
              {shipping === 0 ? 'Free' : formatPrice(shipping, 'USD', 'en-US')}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Tax (8%)</span>
            <span className="font-medium">{formatPrice(tax, 'USD', 'en-US')}</span>
          </div>
        </div>

        <div className="mt-4 flex justify-between border-t border-border pt-4">
          <span className="font-serif font-bold text-foreground">Total</span>
          <span className="font-serif text-xl font-bold text-gold-600">
            {formatPrice(total, 'USD', 'en-US')}
          </span>
        </div>
      </div>

      {/* Always visible total on mobile when collapsed */}
      <div className={cn('hidden md:hidden', !isExpanded && 'block')}>
        <div className="mt-4 flex justify-between border-t border-border pt-4">
          <span className="text-sm text-muted-foreground">Total</span>
          <span className="font-serif font-bold text-gold-600">
            {formatPrice(total, 'USD', 'en-US')}
          </span>
        </div>
      </div>
    </div>
  );
}

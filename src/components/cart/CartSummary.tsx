// src/components/cart/CartSummary.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Tag, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { formatPrice } from '@/lib/utils';
import { cn } from '@/lib/utils';

const FREE_SHIPPING_THRESHOLD = 100;

interface CartSummaryProps {
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  itemCount: number;
  className?: string;
}

export function CartSummary({
  subtotal,
  shipping,
  tax,
  total,
  itemCount,
  className,
}: CartSummaryProps) {
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState('');
  const [promoLoading, setPromoLoading] = useState(false);
  const toFreeShipping = FREE_SHIPPING_THRESHOLD - subtotal;

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) return;
    setPromoLoading(true);
    setPromoError('');
    await new Promise((r) => setTimeout(r, 800));
    setPromoLoading(false);
    setPromoError('Invalid promo code. Please try again.');
  };

  const handleRemovePromo = () => {
    setPromoCode('');
    setPromoApplied(false);
    setPromoError('');
  };

  return (
    <div className={cn('rounded-2xl border border-border bg-white p-6 shadow-sm', className)}>
      <h2 className="font-serif text-xl font-bold text-foreground">
        Order Summary
      </h2>
      <p className="mt-0.5 text-sm text-muted-foreground">
        {itemCount} {itemCount === 1 ? 'item' : 'items'}
      </p>

      {/* Free shipping progress */}
      {toFreeShipping > 0 && (
        <div className="mt-4 rounded-xl bg-cream-50 p-3">
          <p className="text-xs text-muted-foreground">
            Add{' '}
            <span className="font-semibold text-gold-600">
              {formatPrice(toFreeShipping, 'USD', 'en-US')}
            </span>{' '}
            more for free shipping!
          </p>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-cream-200">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-gold-400 to-gold-600"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100)}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>
        </div>
      )}

      {/* Price breakdown */}
      <div className="mt-5 space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="font-medium text-foreground">
            {formatPrice(subtotal, 'USD', 'en-US')}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Shipping</span>
          <span
            className={cn(
              'font-medium',
              shipping === 0 ? 'text-emerald-600' : 'text-foreground'
            )}
          >
            {shipping === 0 ? 'Free' : formatPrice(shipping, 'USD', 'en-US')}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            Tax{' '}
            <span className="text-xs">(8%)</span>
          </span>
          <span className="font-medium text-foreground">
            {formatPrice(tax, 'USD', 'en-US')}
          </span>
        </div>
      </div>

      {/* Promo code */}
      <div className="mt-5">
        <AnimatePresence mode="wait">
          {!promoApplied ? (
            <motion.div
              key="promo-input"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex gap-2"
            >
              <div className="relative flex-1">
                <Tag className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => {
                    setPromoCode(e.target.value.toUpperCase());
                    setPromoError('');
                  }}
                  placeholder="Promo code"
                  className="h-10 w-full rounded-lg border border-border bg-cream-50 pl-9 pr-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-gold-400 focus:ring-1 focus:ring-gold-400"
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleApplyPromo}
                isLoading={promoLoading}
                disabled={!promoCode.trim() || promoLoading}
                className="h-10 shrink-0"
              >
                Apply
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="promo-applied"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-between rounded-lg bg-emerald-50 px-3 py-2 text-sm"
            >
              <span className="font-medium text-emerald-700">
                ✓ Promo applied
              </span>
              <button
                type="button"
                onClick={handleRemovePromo}
                className="text-emerald-600 hover:text-emerald-800"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
        {promoError && (
          <p className="mt-1.5 text-xs text-destructive">{promoError}</p>
        )}
      </div>

      {/* Divider */}
      <div className="my-5 h-px bg-border" />

      {/* Total */}
      <div className="flex items-center justify-between">
        <span className="font-serif text-base font-semibold text-foreground">
          Total
        </span>
        <div className="text-right">
          <p className="font-serif text-2xl font-bold text-gold-600">
            {formatPrice(total, 'USD', 'en-US')}
          </p>
          <p className="text-xs text-muted-foreground">Including taxes</p>
        </div>
      </div>

      {/* Checkout button */}
      <Button
        variant="luxury"
        size="lg"
        className="mt-5 w-full gap-2"
        asChild
      >
        <Link href="/checkout">
          Proceed to Checkout
          <ArrowRight className="h-4 w-4" />
        </Link>
      </Button>

      {/* Continue shopping */}
      <div className="mt-4 text-center">
        <Link
          href="/products"
          className="text-sm text-muted-foreground underline-offset-2 transition-colors hover:text-gold-600 hover:underline"
        >
          Continue Shopping
        </Link>
      </div>

      {/* Security badges */}
      <div className="mt-5 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        Secure checkout · SSL encrypted
      </div>
    </div>
  );
}

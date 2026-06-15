// src/app/checkout/cancel/page.tsx
'use client';

import Link from 'next/link';
import { XCircle, RotateCcw, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';

export default function CheckoutCancelPage() {
  return (
    <div className="relative flex min-h-[70vh] flex-col items-center justify-center overflow-hidden px-4 py-16 text-center">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/3 h-64 w-64 -translate-x-1/2 rounded-full bg-amber-100 opacity-50 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-md">
        {/* Icon */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
          className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-amber-100 ring-8 ring-amber-50"
        >
          <XCircle className="h-12 w-12 text-amber-500" />
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h1 className="font-serif text-3xl font-bold text-foreground md:text-4xl">
            Payment Cancelled
          </h1>
          <div className="mx-auto my-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <div className="h-1.5 w-1.5 rotate-45 bg-amber-400" />
            <div className="h-px flex-1 bg-border" />
          </div>
          <p className="text-base leading-relaxed text-muted-foreground">
            Your payment was not processed and no charges were made. Your cart
            items are still saved.
          </p>
        </motion.div>

        {/* Info box */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800"
        >
          💡 If you encountered an issue, please try again or contact our support
          team for assistance.
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center"
        >
          <Button variant="luxury" size="lg" asChild>
            <Link href="/checkout">
              <RotateCcw className="mr-2 h-4 w-4" />
              Try Again
            </Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/products">
              <ShoppingBag className="mr-2 h-4 w-4" />
              Continue Shopping
            </Link>
          </Button>
        </motion.div>

        {/* Support */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-8 text-sm text-muted-foreground"
        >
          Need help?{' '}
          <a
            href="mailto:support@bebfragrance.com"
            className="font-medium text-gold-600 underline-offset-2 hover:underline"
          >
            Contact support
          </a>
        </motion.p>
      </div>
    </div>
  );
}

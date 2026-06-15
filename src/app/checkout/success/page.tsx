// src/app/checkout/success/page.tsx
'use client';

import { useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Package, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { useCartStore } from '@/store/useCartStore';

function ConfettiParticle({ delay }: { delay: number }) {
  const colors = ['bg-gold-400', 'bg-perfume-400', 'bg-oud-400', 'bg-gold-300', 'bg-emerald-400'];
  const color = colors[Math.floor(Math.random() * colors.length)];
  const left = `${Math.random() * 100}%`;
  const size = Math.random() > 0.5 ? 'h-2 w-2' : 'h-1.5 w-3';

  return (
    <motion.div
      className={`absolute ${color} ${size} rounded-sm opacity-0`}
      style={{ left, top: '-10px' }}
      animate={{
        y: ['0vh', '110vh'],
        opacity: [0, 1, 1, 0],
        rotate: [0, Math.random() * 360 - 180],
        x: [0, (Math.random() - 0.5) * 200],
      }}
      transition={{
        duration: 2.5 + Math.random() * 1.5,
        delay,
        ease: 'easeIn',
      }}
    />
  );
}

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const clearCart = useCartStore((s) => s.clearCart);
  const cleared = useRef(false);

  useEffect(() => {
    if (!cleared.current) {
      cleared.current = true;
      clearCart();
    }
  }, [clearCart]);

  const particles = Array.from({ length: 30 }, (_, i) => i);

  return (
    <div className="relative flex min-h-[80vh] flex-col items-center justify-center overflow-hidden px-4 py-16 text-center">
      {/* Confetti */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {particles.map((i) => (
          <ConfettiParticle key={i} delay={i * 0.06} />
        ))}
      </div>

      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/4 h-64 w-64 -translate-x-1/2 rounded-full bg-emerald-100 opacity-60 blur-3xl" />
        <div className="absolute left-1/3 top-1/2 h-48 w-48 -translate-y-1/2 rounded-full bg-gold-100 opacity-60 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-md">
        {/* Success icon */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
          className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-2xl shadow-emerald-200"
        >
          <CheckCircle className="h-12 w-12 text-white" />
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h1 className="font-serif text-3xl font-bold text-foreground md:text-4xl">
            Payment Successful!
          </h1>
          <div className="mx-auto my-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <div className="h-1.5 w-1.5 rotate-45 bg-emerald-400" />
            <div className="h-px flex-1 bg-border" />
          </div>
          <p className="text-base leading-relaxed text-muted-foreground">
            Thank you for your purchase! Your order has been confirmed and is
            being prepared for shipment. You&apos;ll receive a confirmation email
            shortly.
          </p>
        </motion.div>

        {/* Order info */}
        {sessionId && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-6 rounded-xl bg-cream-50 p-4 text-sm"
          >
            <p className="text-muted-foreground">
              Session ID:{' '}
              <span className="font-mono text-xs text-foreground">
                {sessionId.slice(0, 20)}...
              </span>
            </p>
          </motion.div>
        )}

        {/* What's next */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-6 space-y-3 rounded-2xl border border-border bg-white p-5 text-left"
        >
          <p className="text-sm font-semibold text-foreground">What happens next?</p>
          <div className="space-y-2.5">
            {[
              { icon: '📧', text: 'Confirmation email sent to your inbox' },
              { icon: '📦', text: 'Order will be processed within 24 hours' },
              { icon: '🚚', text: 'Shipping notification when dispatched' },
            ].map((step, i) => (
              <div key={i} className="flex items-center gap-3 text-sm text-muted-foreground">
                <span className="text-base">{step.icon}</span>
                {step.text}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center"
        >
          <Button variant="luxury" size="lg" asChild>
            <Link href="/orders">
              <Package className="mr-2 h-4 w-4" />
              View My Orders
            </Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/products">
              <ShoppingBag className="mr-2 h-4 w-4" />
              Continue Shopping
            </Link>
          </Button>
        </motion.div>
      </div>
    </div>
  );
}

// src/app/checkout/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { CheckoutForm } from '@/components/checkout/CheckoutForm';
import { useCartStore } from '@/store/useCartStore';

export default function CheckoutPage() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);

  useEffect(() => {
    if (items.length === 0) {
      router.replace('/cart');
    }
  }, [items, router]);

  if (items.length === 0) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gold-100">
            <Loader2 className="h-7 w-7 animate-spin text-gold-600" />
          </div>
          <p className="text-sm text-muted-foreground">Preparing checkout...</p>
        </div>
      </div>
    );
  }

  return <CheckoutForm />;
}

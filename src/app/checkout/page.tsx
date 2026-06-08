// src/app/checkout/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Loader2 } from 'lucide-react';
import { CheckoutForm } from '@/components/checkout/CheckoutForm';
import { useCartStore } from '@/store/useCartStore';

export default function CheckoutPage() {
  const { status } = useSession();
  const router = useRouter();
  const items = useCartStore((s) => s.items);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/auth/login?callbackUrl=/checkout');
    }
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated' && items.length === 0) {
      router.replace('/cart');
    }
  }, [status, items, router]);

  if (status === 'loading') {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gold-100">
            <Loader2 className="h-7 w-7 animate-spin text-gold-600" />
          </div>
          <p className="text-sm text-muted-foreground">Loading checkout...</p>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated' || items.length === 0) {
    return null;
  }

  return <CheckoutForm />;
}

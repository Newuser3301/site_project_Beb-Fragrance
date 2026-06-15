'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

export function LoginForm() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();

  const callbackUrl = searchParams.get('callbackUrl') ?? '/';

  useEffect(() => {
    if (status === 'authenticated') {
      router.replace(callbackUrl);
    }
  }, [status, router, callbackUrl]);

  if (status === 'loading') {
    return (
      <div className="flex min-h-[80vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gold-600" />
      </div>
    );
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-gradient-to-br from-cream-50 via-cream-100 to-oud-50 px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md rounded-2xl border border-border bg-white p-8 shadow-luxury-lg md:p-10"
      >
        <div className="mb-8 text-center">
          <p className="font-serif text-xl font-bold tracking-[0.25em] text-gold-500">
            BEB FRAGRANCE
          </p>
          <h1 className="mt-6 font-serif text-3xl font-bold text-foreground">
            Welcome Back
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Email and password sign-in is available on the main auth page.
          </p>
        </div>
        <p className="text-center text-sm text-muted-foreground">
          Use <span className="font-medium text-foreground">/auth/login</span> for customer access.
        </p>
      </motion.div>
    </div>
  );
}

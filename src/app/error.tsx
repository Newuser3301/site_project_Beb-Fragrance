// src/app/error.tsx
'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error('[GlobalError]', error);
  }, [error]);

  const isDevelopment = process.env.NODE_ENV === 'development';

  return (
    <div className="relative flex min-h-[70vh] flex-col items-center justify-center overflow-hidden px-4 text-center">
      {/* Background decorations */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/4 top-1/4 h-48 w-48 rounded-full bg-destructive/5 blur-3xl" />
        <div className="absolute right-1/4 bottom-1/4 h-48 w-48 rounded-full bg-gold-100/50 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-md">
        {/* Icon */}
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10 ring-8 ring-destructive/5">
          <AlertTriangle className="h-10 w-10 text-destructive" />
        </div>

        {/* Title */}
        <h1 className="font-serif text-3xl font-bold text-foreground md:text-4xl">
          Something Went Wrong
        </h1>

        {/* Divider */}
        <div className="mx-auto my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <div className="h-1.5 w-1.5 rotate-45 bg-destructive/40" />
          <div className="h-px flex-1 bg-border" />
        </div>

        {/* Development error message */}
        {isDevelopment && error.message && (
          <div className="mb-6 overflow-hidden rounded-xl border border-destructive/20 bg-destructive/5 px-5 py-4 text-left">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-destructive">
              Error Details (Dev Only)
            </p>
            <p className="break-all font-mono text-sm text-destructive/80">
              {error.message}
            </p>
            {error.digest && (
              <p className="mt-2 text-xs text-muted-foreground">
                Digest: {error.digest}
              </p>
            )}
          </div>
        )}

        {/* Production message */}
        {!isDevelopment && (
          <p className="mb-6 text-base leading-relaxed text-muted-foreground">
            An unexpected error occurred. Our team has been notified. Please try
            again or return to the homepage.
          </p>
        )}

        {/* Actions */}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button
            variant="luxury"
            size="lg"
            onClick={reset}
            id="error-retry-btn"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/" id="error-home-btn">
              <Home className="mr-2 h-4 w-4" />
              Go Home
            </Link>
          </Button>
        </div>

        {/* Help text */}
        <p className="mt-8 text-sm text-muted-foreground">
          If the problem persists,{' '}
          <Link
            href="mailto:support@bebfragrance.com"
            className="font-medium text-gold-600 underline-offset-2 hover:underline"
          >
            contact our support team
          </Link>
          .
        </p>
      </div>
    </div>
  );
}

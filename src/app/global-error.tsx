// src/app/global-error.tsx
'use client';

import { Button } from '@/components/ui/Button';
import { SITE_NAME } from '@/lib/constants';
import { AlertTriangle, ArrowLeft, RefreshCw } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
          <div className="w-full max-w-md text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
              <AlertTriangle className="h-10 w-10 text-red-500" />
            </div>
            <h1 className="font-serif text-3xl font-bold text-gray-900">
              Something Went Wrong
            </h1>
            <p className="mt-3 text-gray-500">
              We apologize for the inconvenience. Please try again or contact
              support if the problem persists.
            </p>
            {error.digest && (
              <p className="mt-2 text-xs text-gray-400">
                Error ID: {error.digest}
              </p>
            )}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button variant="luxury" onClick={reset}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
              <a href="/">
                <Button variant="outline">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Home
                </Button>
              </a>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}

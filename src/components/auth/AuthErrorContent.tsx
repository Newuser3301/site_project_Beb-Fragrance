'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const errorMessages: Record<string, string> = {
  Configuration: 'There is a problem with the server configuration.',
  AccessDenied: 'You do not have permission to sign in.',
  Verification: 'The verification link has expired or has already been used.',
  OAuthSignin: 'Error starting the sign-in process. Please try again.',
  OAuthCallback: 'Error during sign-in callback. Please try again.',
  OAuthCreateAccount: 'Could not create account. Please try again.',
  EmailCreateAccount: 'Could not create account. Please try again.',
  Callback: 'Error during authentication callback.',
  OAuthAccountNotLinked:
    'This email is already linked to another account. Please sign in with the original provider.',
  SessionRequired: 'Please sign in to access this page.',
  Default: 'An authentication error occurred. Please try again.',
};

export function AuthErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error') ?? 'Default';
  const message = errorMessages[error] ?? errorMessages.Default;

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-4 text-center">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
        <AlertTriangle className="h-8 w-8 text-destructive" />
      </div>
      <h1 className="font-serif text-3xl font-semibold text-foreground">
        Authentication Error
      </h1>
      <p className="mt-4 max-w-md text-muted-foreground">{message}</p>
      {error !== 'Default' && (
        <p className="mt-2 text-xs text-muted-foreground">
          Error code: {error}
        </p>
      )}
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button variant="luxury" asChild>
          <Link href="/auth/login">Try Again</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/">Back to Home</Link>
        </Button>
      </div>
    </div>
  );
}

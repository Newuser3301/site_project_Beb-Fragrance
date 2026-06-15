'use client';

import { SessionProvider } from 'next-auth/react';
import { Toaster } from 'sonner';
import type { Session } from 'next-auth';

export interface ProvidersProps {
  children: React.ReactNode;
  session?: Session | null;
}

export function Providers({ children, session }: ProvidersProps) {
  return (
    <SessionProvider session={session}>
      {children}
      <Toaster position="top-right" richColors closeButton />
    </SessionProvider>
  );
}

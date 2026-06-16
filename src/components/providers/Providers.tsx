'use client';

import { useEffect } from 'react';
import { SessionProvider } from 'next-auth/react';
import { Toaster } from 'sonner';
import type { Session } from 'next-auth';

export interface ProvidersProps {
  children: React.ReactNode;
  session?: Session | null;
}

export function Providers({ children, session }: ProvidersProps) {
  useEffect(() => {
    const storedTheme = window.localStorage.getItem('beb-theme');
    const theme = storedTheme === 'dark' ? 'dark' : 'light';

    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
    document.documentElement.style.colorScheme = theme;
  }, []);

  return (
    <SessionProvider session={session}>
      {children}
      <Toaster position="top-right" richColors closeButton />
    </SessionProvider>
  );
}

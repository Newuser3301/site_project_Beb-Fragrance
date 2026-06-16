'use client';

import { useEffect } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { SessionProvider } from 'next-auth/react';
import { Toaster } from 'sonner';
import type { Session } from 'next-auth';
import type { AppLocale, AppMessages } from '@/lib/i18n';

export interface ProvidersProps {
  children: React.ReactNode;
  session?: Session | null;
  locale: AppLocale;
  messages: AppMessages;
}

export function Providers({
  children,
  session,
  locale,
  messages,
}: ProvidersProps) {
  useEffect(() => {
    const storedTheme = window.localStorage.getItem('beb-theme');
    const theme = storedTheme === 'dark' ? 'dark' : 'light';

    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
    document.documentElement.style.colorScheme = theme;
  }, []);

  return (
    <SessionProvider session={session}>
      <NextIntlClientProvider locale={locale} messages={messages}>
        {children}
        <Toaster position="top-right" richColors closeButton />
      </NextIntlClientProvider>
    </SessionProvider>
  );
}

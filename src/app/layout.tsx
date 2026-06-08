// src/app/layout.tsx
import type { Metadata, Viewport } from 'next';
import { DM_Sans, Playfair_Display } from 'next/font/google';
import { auth } from '@/lib/auth';
import { Providers } from '@/components/providers/Providers';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/layout/CartDrawer';
import { ScrollToTop } from '@/components/shared/ScrollToTop';
import './globals.css';

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-jost',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Beb Fragrance | Premium Perfume Store',
    template: '%s | Beb Fragrance',
  },
  description:
    'Discover luxury fragrances at Beb Fragrance. Shop premium perfumes for men and women from the world\'s finest brands.',
  keywords: [
    'perfume',
    'fragrance',
    'luxury perfume',
    'designer fragrance',
    'Beb Fragrance',
    'premium scents',
    'women perfume',
    'men perfume',
    'oud',
    'oriental fragrance',
  ],
  authors: [{ name: 'Beb Fragrance' }],
  creator: 'Beb Fragrance',
  publisher: 'Beb Fragrance',
  category: 'Shopping',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    siteName: 'Beb Fragrance',
    title: 'Beb Fragrance | Premium Perfume Store',
    description:
      'Discover luxury fragrances at Beb Fragrance. Shop premium perfumes for men and women.',
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: 'Beb Fragrance - Premium Perfume Store',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Beb Fragrance | Premium Perfume Store',
    description:
      'Discover luxury fragrances at Beb Fragrance. Shop premium perfumes for men and women.',
    images: [
      `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/og-image.jpg`,
    ],
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#581c87',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${playfair.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-[#F5F0E8] font-sans text-[#1A1A1A] antialiased">
        <Providers session={session}>
          <Header user={session?.user} />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <CartDrawer />
          <ScrollToTop />
        </Providers>
      </body>
    </html>
  );
}

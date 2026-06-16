'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { MapPin, ShieldCheck, Sparkles, SprayCan, Truck } from 'lucide-react';
import {
  CONTACT_ADDRESS,
  CONTACT_PHONE,
  SITE_NAME,
} from '@/lib/constants';

interface AuthShellProps {
  title: string;
  description: string;
  footer?: React.ReactNode;
  children: React.ReactNode;
}

export function AuthShell({
  title,
  description,
  footer,
  children,
}: AuthShellProps) {
  const highlights = [
    {
      icon: Sparkles,
      title: 'Curated Luxury',
      text: 'Handpicked niche and designer fragrances with a refined boutique feel.',
    },
    {
      icon: Truck,
      title: 'Fast Delivery',
      text: 'Orders are prepared quickly with careful packaging and secure shipping.',
    },
    {
      icon: ShieldCheck,
      title: 'Trusted Checkout',
      text: 'Clean customer flow for login, orders, wishlist, and account access.',
    },
  ];

  return (
    <div className="relative overflow-hidden bg-[linear-gradient(180deg,#fff8fa_0%,#fffaf7_48%,#ffffff_100%)] px-4 py-10 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-8%] top-16 h-56 w-56 rounded-full bg-[#f4bfd0]/35 blur-3xl" />
        <div className="absolute right-[-10%] top-24 h-64 w-64 rounded-full bg-[#d9b9c9]/30 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-[#f3e2cf]/45 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="relative mx-auto grid min-h-[calc(100vh-5rem)] w-full max-w-6xl overflow-hidden rounded-[34px] border border-[rgba(106,53,83,0.08)] bg-white shadow-[0_30px_90px_rgba(88,43,70,0.14)] lg:grid-cols-[1.05fr_0.95fr]"
      >
        <div className="relative hidden overflow-hidden bg-[linear-gradient(145deg,#6d415c_0%,#8f5874_42%,#f1bac8_100%)] p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.28),transparent_24%),radial-gradient(circle_at_bottom_left,rgba(255,244,230,0.22),transparent_30%)]" />
          <div className="relative">
            <Link href="/" className="inline-flex flex-col">
              <span className="font-serif text-[28px] font-semibold tracking-[0.14em] text-[#2e1b27]">
                <span className="text-white">{SITE_NAME.toUpperCase()}</span>
              </span>
              <span className="text-[10px] uppercase tracking-[0.34em] text-white/70">
                Premium Perfume Store
              </span>
            </Link>

            <div className="mt-16 max-w-md">
              <p className="text-[11px] font-semibold uppercase tracking-[0.38em] text-white/70">
                Signature Access
              </p>
              <h2 className="mt-4 font-serif text-5xl leading-[1.05] text-white">
                Enter a fragrance world built like a real boutique product.
              </h2>
              <p className="mt-5 max-w-sm text-sm leading-7 text-white/78">
                Elegant browsing, clean account flows, and a premium storefront
                atmosphere designed for modern perfume retail.
              </p>
            </div>

            <div className="mt-10 space-y-4">
              {highlights.map(({ icon: Icon, title, text }) => (
                <div
                  key={title}
                  className="flex items-start gap-4 rounded-2xl border border-white/12 bg-white/10 px-4 py-4 backdrop-blur-sm"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/14">
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{title}</p>
                    <p className="mt-1 text-sm leading-6 text-white/72">{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative rounded-[26px] border border-white/12 bg-[rgba(255,255,255,0.10)] p-5 backdrop-blur-sm">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-2xl bg-white/16">
                <MapPin className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Boutique Contact</p>
                <p className="mt-1 text-sm leading-6 text-white/74">{CONTACT_ADDRESS}</p>
                <p className="mt-3 text-sm text-white/88">{CONTACT_PHONE}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center bg-white/90 p-5 sm:p-8 lg:p-10">
          <div className="w-full max-w-md">
            <div className="mb-8 text-center lg:hidden">
              <Link href="/" className="inline-flex flex-col items-center">
                <span className="font-serif text-[28px] font-semibold tracking-[0.14em] text-[#2e1b27]">
                  {SITE_NAME.toUpperCase()}
                </span>
                <span className="text-[10px] uppercase tracking-[0.32em] text-[#8e6880]">
                  Premium Perfume Store
                </span>
              </Link>
            </div>

            <div className="rounded-[30px] border border-[rgba(106,53,83,0.08)] bg-white p-7 shadow-[0_20px_60px_rgba(109,65,92,0.10)] sm:p-8">
              <div className="mb-8 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#f3b3c7] via-[#d6809f] to-[#6d415c] text-white shadow-[0_12px_24px_rgba(109,65,92,0.22)]">
                  <SprayCan className="h-7 w-7" />
                </div>
                <h1 className="mt-5 font-serif text-3xl font-semibold text-[#2e1b27]">
                  {title}
                </h1>
                <p className="mt-2 text-sm leading-6 text-[#7f6474]">{description}</p>
              </div>

              {children}

              {footer ? <div className="mt-6">{footer}</div> : null}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

'use client';

import Link from 'next/link';
import { Clock3, Mail, Phone } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface FooterProps {
  className?: string;
  settings?: Record<string, string>;
}

export function Footer({ className, settings }: FooterProps) {
  return (
    <footer className={cn('bg-[#0d1b2a] text-[#d7deea] dark:bg-slate-950', className)}>
      <div className="container-beb py-14">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="text-lg font-semibold text-white">Ilovani yuklab oling</h3>
            <div className="mt-5 flex flex-wrap gap-3">
              <button
                type="button"
                className="rounded-xl border border-white/20 px-4 py-2 text-sm font-medium text-white transition-colors hover:border-white/40"
              >
                App Store
              </button>
              <button
                type="button"
                className="rounded-xl border border-white/20 px-4 py-2 text-sm font-medium text-white transition-colors hover:border-white/40"
              >
                Google Play
              </button>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white">Ma&apos;lumotlar</h3>
            <ul className="mt-5 space-y-2 text-sm">
              <li>
                <Link href="/about" className="transition-colors hover:text-white">
                  Biz haqimizda (Manzillarimiz)
                </Link>
              </li>
              <li>
                <Link href="/contact" className="transition-colors hover:text-white">
                  Aloqa / Kontaktlar
                </Link>
              </li>
              <li>
                <Link href="/faq" className="transition-colors hover:text-white">
                  Ko&apos;p so&apos;raladigan savollar (FAQ)
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white">Foydali havolalar</h3>
            <ul className="mt-5 space-y-2 text-sm">
              <li>
                <Link href="/terms" className="transition-colors hover:text-white">
                  Foydalanish shartlari
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="transition-colors hover:text-white">
                  Maxfiylik siyosati
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="transition-colors hover:text-white">
                  Yetkazib berish shartlari
                </Link>
              </li>
              <li>
                <Link href="/returns" className="transition-colors hover:text-white">
                  Qaytarish shartlari
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white">Bog&apos;lanish</h3>
            <div className="mt-5 space-y-3 text-sm">
              <a href={`tel:${settings?.contact_phone || '+998711234567'}`} className="flex items-center gap-3 transition-colors hover:text-white">
                <Phone className="h-4 w-4 text-[#c8d1df]" />
                <span>{settings?.contact_phone || '+998 (71) 123 45 67'}</span>
              </a>
              <div className="flex items-center gap-3">
                <Clock3 className="h-4 w-4 text-[#c8d1df]" />
                <span>Har kuni 9:00 - 22:00</span>
              </div>
              <a href={`mailto:${settings?.contact_email || 'info@bebfragrance.uz'}`} className="flex items-center gap-3 transition-colors hover:text-white">
                <Mail className="h-4 w-4 text-[#c8d1df]" />
                <span>{settings?.contact_email || 'info@bebfragrance.uz'}</span>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-5 text-center text-xs text-[#a8b4c7]">
          © 2026 {settings?.site_name || 'BEB Fragrance'}. Barcha huquqlar himoyalangan.
        </div>
      </div>
    </footer>
  );
}

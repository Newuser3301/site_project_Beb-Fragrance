'use client';

import Link from 'next/link';
import { Clock3, Mail, Phone } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface FooterProps {
  className?: string;
}

export function Footer({ className }: FooterProps) {
  return (
    <footer className={cn('bg-[#0d1b2a] text-[#d7deea]', className)}>
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
            <div className="mt-5">
              <Link href="/about" className="text-sm transition-colors hover:text-white">
                Bizning manzillar
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white">Foydali havolalar</h3>
            <div className="mt-5">
              <Link href="/terms" className="text-sm transition-colors hover:text-white">
                Sayt ofertasi
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white">Bog&apos;lanish</h3>
            <div className="mt-5 space-y-3 text-sm">
              <a href="tel:+998711234567" className="flex items-center gap-3 transition-colors hover:text-white">
                <Phone className="h-4 w-4 text-[#c8d1df]" />
                <span>+998 (71) 123 45 67</span>
              </a>
              <div className="flex items-center gap-3">
                <Clock3 className="h-4 w-4 text-[#c8d1df]" />
                <span>Har kuni 9:00 - 22:00</span>
              </div>
              <a href="mailto:info@bebfragrance.uz" className="flex items-center gap-3 transition-colors hover:text-white">
                <Mail className="h-4 w-4 text-[#c8d1df]" />
                <span>info@bebfragrance.uz</span>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-5 text-center text-xs text-[#a8b4c7]">
          © 2026 BEB Fragrance. Barcha huquqlar himoyalangan.
        </div>
      </div>
    </footer>
  );
}

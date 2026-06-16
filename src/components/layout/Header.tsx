'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Globe,
  Heart,
  Menu,
  Moon,
  Search,
  ShoppingBag,
  SunMedium,
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { SearchBar } from '@/components/layout/SearchBar';
import { UserMenu } from '@/components/layout/UserMenu';
import { MobileMenu } from '@/components/layout/MobileMenu';
import { useCartStore } from '@/store/useCartStore';
import { useUIStore } from '@/store/useUIStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { cn } from '@/lib/utils';
import { CONTACT_EMAIL, CONTACT_PHONE } from '@/lib/constants';

export interface HeaderProps {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  } | null;
}

export function Header({ user }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [language, setLanguage] = useState<'uz' | 'ru' | 'en'>('uz');
  const { openCart, openMobileMenu } = useUIStore();
  const itemsCount = useCartStore((state) =>
    state.items.reduce((count, item) => count + item.quantity, 0)
  );
  const wishlistCount = useWishlistStore((state) => state.items.length);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const storedTheme = window.localStorage.getItem('beb-theme');
    const storedLanguage = window.localStorage.getItem('beb-language') as
      | 'uz'
      | 'ru'
      | 'en'
      | null;

    if (storedTheme === 'dark' || storedTheme === 'light') {
      setTheme(storedTheme);
      document.documentElement.classList.toggle('dark', storedTheme === 'dark');
    }

    if (storedLanguage === 'uz' || storedLanguage === 'ru' || storedLanguage === 'en') {
      setLanguage(storedLanguage);
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    document.documentElement.classList.toggle('dark', nextTheme === 'dark');
    window.localStorage.setItem('beb-theme', nextTheme);
  };

  const changeLanguage = (nextLanguage: 'uz' | 'ru' | 'en') => {
    setLanguage(nextLanguage);
    window.localStorage.setItem('beb-language', nextLanguage);
  };

  const languageOptions = {
    uz: "O'zbek",
    ru: 'Русский',
    en: 'English',
  } as const;

  return (
    <>
      <header
        className={cn(
          'sticky top-0 z-50 w-full border-b border-[rgba(13,28,48,0.08)] bg-white/95 backdrop-blur-xl transition-all duration-300 dark:border-slate-800 dark:bg-slate-950/90',
          isScrolled && 'shadow-[0_18px_40px_rgba(41,61,94,0.12)]'
        )}
      >
        <div className="border-b border-[rgba(13,28,48,0.08)] bg-[#0f1b2d] text-white dark:border-slate-800 dark:bg-slate-980">
          <div className="container-beb flex h-9 items-center justify-between gap-4 text-[11px]">
            <p className="truncate tracking-[0.06em] text-white/80">
              Onlayn buyurtma va aloqa: {CONTACT_PHONE}
            </p>
            <div className="ml-auto hidden items-center gap-4 text-white/80 sm:flex">
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="transition-colors hover:text-white"
              >
                {CONTACT_EMAIL}
              </a>
            </div>
          </div>
        </div>

        <div className="container-beb">
          <div className="grid min-h-[88px] grid-cols-[auto_1fr_auto] items-center gap-3 py-4 lg:grid-cols-[220px_minmax(320px,1fr)_auto]">
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[rgba(13,28,48,0.10)] bg-[#f7f9fd] text-[#163050] lg:hidden"
                onClick={openMobileMenu}
                aria-label="Open menu"
              >
                <Menu className="h-4 w-4" />
              </button>
              <Link href="/" className="flex flex-col text-left">
                <span className="font-serif text-[24px] font-semibold tracking-[0.10em] text-[#12315c] dark:text-white">
                  BEB FRAGRANCE
                </span>
                <span className="text-[10px] uppercase tracking-[0.30em] text-[#6e7f96] dark:text-slate-400">
                  premium perfume store
                </span>
              </Link>
            </div>

            <div className="px-1 sm:px-3">
              <SearchBar className="mx-auto w-full max-w-[760px]" />
            </div>

            <div className="flex items-center justify-end gap-2">
              <div className="hidden items-center gap-2 md:flex">
                <button
                  type="button"
                  onClick={toggleTheme}
                  className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[rgba(13,28,48,0.08)] bg-[#f7f9fd] text-[#17355d] transition-colors hover:bg-[#edf4ff] dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
                  aria-label="Toggle color mode"
                >
                  {theme === 'light' ? (
                    <Moon className="h-4 w-4" />
                  ) : (
                    <SunMedium className="h-4 w-4" />
                  )}
                </button>

                <div className="relative">
                  <Globe className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#547197]" />
                  <select
                    value={language}
                    onChange={(event) =>
                      changeLanguage(event.target.value as 'uz' | 'ru' | 'en')
                    }
                    className="h-11 rounded-2xl border border-[rgba(13,28,48,0.08)] bg-[#f7f9fd] pl-9 pr-8 text-sm font-medium text-[#17355d] outline-none transition-colors hover:bg-[#edf4ff] dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
                    aria-label="Til tanlash"
                  >
                    {Object.entries(languageOptions).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <Link
                href="/wishlist"
                className="relative hidden h-11 w-11 items-center justify-center rounded-2xl border border-[rgba(13,28,48,0.08)] bg-[#f7f9fd] text-[#17355d] transition-colors hover:bg-[#edf4ff] md:flex dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
                aria-label="Wishlist"
              >
                <Heart className="h-4 w-4" />
                {wishlistCount > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#1d4ed8] px-1 text-[9px] font-bold text-white">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              <button
                type="button"
                className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-[rgba(13,28,48,0.08)] bg-[#f7f9fd] text-[#17355d] transition-colors hover:bg-[#edf4ff] dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
                onClick={openCart}
                aria-label="Open cart"
              >
                <ShoppingBag className="h-4 w-4" />
                {itemsCount > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#8b5cf6] px-1 text-[9px] font-bold text-white">
                    {itemsCount}
                  </span>
                )}
              </button>

              <div className="hidden sm:block">
                <UserMenu user={user} className="rounded-2xl" />
              </div>

              <div className="flex gap-2 md:hidden">
                <button
                  type="button"
                  onClick={toggleTheme}
                  className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[rgba(13,28,48,0.08)] bg-[#f7f9fd] text-[#17355d]"
                  aria-label="Toggle color mode"
                >
                  {theme === 'light' ? (
                    <Moon className="h-4 w-4" />
                  ) : (
                    <SunMedium className="h-4 w-4" />
                  )}
                </button>
                <div className="sm:hidden">
                  <UserMenu user={user} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-[rgba(13,28,48,0.08)] bg-[#f8fbff] dark:border-slate-800 dark:bg-slate-950">
          <div className="container-beb py-3">
            <Navbar />
          </div>
        </div>
      </header>

      <MobileMenu user={user} />
    </>
  );
}

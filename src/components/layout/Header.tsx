'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Heart, Menu, ShoppingBag, Search, User } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { SearchBar } from '@/components/layout/SearchBar';
import { UserMenu } from '@/components/layout/UserMenu';
import { MobileMenu } from '@/components/layout/MobileMenu';
import { Button } from '@/components/ui/Button';
import { useCartStore } from '@/store/useCartStore';
import { useUIStore } from '@/store/useUIStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { cn } from '@/lib/utils';

export interface HeaderProps {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  } | null;
}

export function Header({ user }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
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

  return (
    <>
      <header
        className={cn(
          'sticky top-0 z-50 w-full border-b border-[rgba(106,53,83,0.08)] bg-white/95 backdrop-blur-xl transition-all duration-300',
          isScrolled && 'shadow-[0_18px_40px_rgba(88,43,70,0.08)]'
        )}
      >
        <div className="border-b border-[rgba(255,255,255,0.08)] bg-[#6d415c] text-white">
          <div className="container-beb flex h-9 items-center justify-between gap-4 text-[11px]">
            <p className="hidden tracking-[0.06em] text-white/80 sm:block">
              Order Online Call Us 01234 456789
            </p>
            <div className="ml-auto flex items-center gap-4 text-white/80">
              <Link href="/contact" className="transition-colors hover:text-white">
                Find a Store
              </Link>
              <a
                href="mailto:demo@arome.com"
                className="transition-colors hover:text-white"
              >
                demo@arome.com
              </a>
            </div>
          </div>
        </div>

        <div className="container-beb">
          <div className="flex min-h-[88px] items-center justify-between gap-4 py-4">
            <div className="flex items-center gap-4 lg:w-[28%]">
              <button
                type="button"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(106,53,83,0.12)] bg-[#fff8fa] lg:hidden"
                onClick={openMobileMenu}
                aria-label="Open menu"
              >
                <Menu className="h-4 w-4" />
              </button>

              <Navbar className="hidden lg:flex" />
            </div>

            <Link
              href="/"
              className="flex flex-col items-center text-center"
            >
              <span className="font-serif text-[28px] font-semibold tracking-[0.14em] text-[#2e1b27]">
                BEB FRAGRANCE
              </span>
              <span className="text-[10px] uppercase tracking-[0.34em] text-[#8e6880]">
                Perfume Shop
              </span>
            </Link>

            <div className="flex items-center justify-end gap-2 lg:w-[28%]">
              <button
                type="button"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(106,53,83,0.12)] bg-[#fff8fa] md:hidden"
                aria-label="Search"
              >
                <Search className="h-4 w-4" />
              </button>

              <div className="hidden md:block">
                <SearchBar className="w-48 lg:w-64" />
              </div>

              <div className="hidden sm:block">
                <UserMenu user={user} />
              </div>

              <Link
                href="/wishlist"
                className="relative flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(106,53,83,0.12)] bg-[#fff8fa] text-[#34202b] transition-colors hover:bg-[#fcecf1]"
                aria-label="Wishlist"
              >
                <Heart className="h-4 w-4" />
                {wishlistCount > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#6d415c] px-1 text-[9px] font-bold text-white">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              <button
                type="button"
                className="relative flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(106,53,83,0.12)] bg-[#fff8fa] text-[#34202b] transition-colors hover:bg-[#fcecf1]"
                onClick={openCart}
                aria-label="Open cart"
              >
                <ShoppingBag className="h-4 w-4" />
                {itemsCount > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#e88ba4] px-1 text-[9px] font-bold text-white">
                    {itemsCount}
                  </span>
                )}
              </button>

              <div className="sm:hidden">
                <UserMenu user={user} />
              </div>
            </div>
          </div>
        </div>
      </header>

      <MobileMenu user={user} />
    </>
  );
}

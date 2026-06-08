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
          'sticky top-0 z-50 w-full border-b border-[rgba(0,0,0,0.08)] bg-[#F5F0E8] transition-all duration-300',
          isScrolled && 'shadow-sm'
        )}
      >
        <div className="container-beb">
          <div className="flex h-[60px] items-center justify-between gap-4">
            {/* Left: Mobile menu + Logo */}
            <div className="flex items-center gap-4">
              <button
                type="button"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/80 backdrop-blur-sm lg:hidden"
                onClick={openMobileMenu}
                aria-label="Open menu"
              >
                <Menu className="h-4 w-4" />
              </button>

              <Link
                href="/"
                className="font-serif text-lg font-bold tracking-[0.3em] text-[#1A1A1A] transition-colors hover:text-[#D4A843] sm:text-xl"
              >
                BEB FRAGRANCE
              </Link>
            </div>

            {/* Center: Navigation */}
            <Navbar />

            {/* Right: Icons */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Search icon (mobile) */}
              <button
                type="button"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/80 backdrop-blur-sm md:hidden"
                aria-label="Search"
              >
                <Search className="h-4 w-4" />
              </button>

              {/* Search bar (desktop) */}
              <div className="hidden md:block">
                <SearchBar className="w-48 lg:w-56" />
              </div>

              {/* User */}
              <div className="hidden sm:block">
                <UserMenu user={user} />
              </div>

              {/* Wishlist */}
              <Link
                href="/wishlist"
                className="relative flex h-9 w-9 items-center justify-center rounded-full bg-white/80 backdrop-blur-sm transition-colors hover:bg-white"
                aria-label="Wishlist"
              >
                <Heart className="h-4 w-4" />
                {wishlistCount > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#E8354A] px-1 text-[9px] font-bold text-white">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <button
                type="button"
                className="relative flex h-9 w-9 items-center justify-center rounded-full bg-white/80 backdrop-blur-sm transition-colors hover:bg-white"
                onClick={openCart}
                aria-label="Open cart"
              >
                <ShoppingBag className="h-4 w-4" />
                {itemsCount > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#1A1A1A] px-1 text-[9px] font-bold text-white">
                    {itemsCount}
                  </span>
                )}
              </button>

              {/* User (mobile) */}
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

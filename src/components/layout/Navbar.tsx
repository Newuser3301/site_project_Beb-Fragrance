'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import {
  Droplets,
  Flower2,
  Gift,
  Grid2x2,
  Sparkles,
  Trees,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { mockCategories } from '@/lib/mock-store';

const navLinks = [
  { key: 'home', href: '/' },
  { key: 'shop', href: '/products' },
  { key: 'about', href: '/about' },
  { key: 'faq', href: '/faq' },
  { key: 'contact', href: '/contact' },
];

const iconMap = {
  floral: Flower2,
  woody: Trees,
  fresh: Droplets,
  oriental: Sparkles,
} as const;

const categories = [
  ...mockCategories.map((category) => ({
    key: category.slug,
    href: `/categories/${category.slug}`,
    icon:
      iconMap[category.slug as keyof typeof iconMap] ??
      Sparkles,
  })),
  { key: 'giftSets', href: '/products?gender=UNISEX', icon: Gift },
  { key: 'all', href: '/products', icon: Grid2x2 },
];

export interface NavbarProps {
  className?: string;
  onLinkClick?: () => void;
}

export function Navbar({ className, onLinkClick }: NavbarProps) {
  const pathname = usePathname();
  const tNav = useTranslations('nav');

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href.split('?')[0]);
  };

  return (
    <nav className={cn('flex items-center gap-3 overflow-x-auto scrollbar-hide', className)}>
      {categories.map((category) => {
        const Icon = category.icon;
        const active = isActive(category.href);
        const label = tNav(`categories.${category.key}`);

        return (
          <Link
            key={category.href}
            href={category.href}
            onClick={onLinkClick}
            className={cn(
              'inline-flex min-w-max items-center gap-2 rounded-2xl border px-4 py-3 text-sm font-medium transition-all',
              active
                ? 'border-[#2a68f3] bg-[#1d4ed8] text-white shadow-[0_12px_24px_rgba(29,78,216,0.24)]'
                : 'border-[rgba(13,28,48,0.08)] bg-white text-[#1a2a3d] hover:border-[#c7d8f9] hover:bg-[#f4f8ff]'
            )}
          >
            <Icon className="h-4 w-4" />
            <span>{label}</span>
          </Link>
        );
      })}

      <div className="ml-auto hidden items-center gap-4 pl-4 xl:flex">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={onLinkClick}
            className={cn(
              'text-xs font-semibold uppercase tracking-[0.14em] text-[#4d6077] transition-colors hover:text-[#1d4ed8]',
              isActive(link.href) && 'text-[#1d4ed8]'
            )}
          >
            {tNav(`links.${link.key}`)}
          </Link>
        ))}
      </div>
    </nav>
  );
}

export { categories, navLinks };

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Droplets, Flower2, Sparkles, Trees } from 'lucide-react';
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

const categories = mockCategories.map((category) => ({
  key: category.slug,
  href: `/categories/${category.slug}`,
  icon: iconMap[category.slug as keyof typeof iconMap] ?? Sparkles,
}));

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
    <nav
      className={cn(
        'flex items-center gap-6 overflow-x-auto scrollbar-hide',
        className
      )}
    >
      {navLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          onClick={onLinkClick}
          className={cn(
            'min-w-max text-sm font-medium text-[#465a74] transition-colors hover:text-[#1d4ed8]',
            isActive(link.href) && 'text-[#1d4ed8]'
          )}
        >
          {tNav(`links.${link.key}`)}
        </Link>
      ))}
    </nav>
  );
}

export { categories, navLinks };

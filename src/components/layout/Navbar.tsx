'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { mockCategories } from '@/lib/mock-store';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Shop', href: '/products' },
  { label: 'About', href: '/about' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Contact', href: '/contact' },
];

const categories = [
  ...mockCategories.map((category) => ({
    label: category.name,
    href: `/categories/${category.slug}`,
  })),
  { label: 'All Perfumes', href: '/products' },
];

export interface NavbarProps {
  className?: string;
  onLinkClick?: () => void;
}

export function Navbar({ className, onLinkClick }: NavbarProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href.split('?')[0]);
  };

  return (
    <nav className={cn('hidden items-center gap-6 xl:gap-8 lg:flex', className)}>
      {navLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          onClick={onLinkClick}
          className={cn(
            'text-[11px] font-semibold uppercase tracking-[0.18em] text-[#34202b] transition-colors duration-200 hover:text-[#7d4b66]',
            isActive(link.href) && 'text-[#7d4b66]'
          )}
        >
          {link.label}
        </Link>
      ))}

      <div className="group relative">
        <button
          type="button"
          className={cn(
            'flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#34202b] transition-colors duration-200 hover:text-[#7d4b66]',
            (pathname.startsWith('/products') || pathname.startsWith('/categories')) && 'text-[#7d4b66]'
          )}
        >
          Categories
          <ChevronDown className="h-3 w-3 transition-transform duration-200 group-hover:rotate-180" />
        </button>

        <div className="invisible absolute left-0 top-full z-50 mt-3 min-w-[200px] translate-y-2 rounded-2xl border border-[rgba(106,53,83,0.08)] bg-white p-2 opacity-0 shadow-[0_18px_40px_rgba(88,43,70,0.12)] transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
          {categories.map((category) => (
            <Link
              key={category.href}
              href={category.href}
              onClick={onLinkClick}
              className="block rounded-xl px-4 py-3 text-sm text-[#34202b] transition-colors hover:bg-[#fdf3f5] hover:text-[#7d4b66]"
            >
              {category.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}

export { categories, navLinks };

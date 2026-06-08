'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Shop', href: '/products' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

const categories = [
  { label: 'Oriental', href: '/categories/oriental' },
  { label: 'Floral', href: '/categories/floral' },
  { label: 'Woody', href: '/categories/woody' },
  { label: 'Fresh', href: '/categories/fresh' },
  { label: 'All', href: '/products' },
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
    <nav className={cn('hidden items-center gap-8 lg:flex', className)}>
      {navLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          onClick={onLinkClick}
          className={cn(
            'text-[13px] font-medium tracking-[0.05em] text-[#1A1A1A] transition-colors duration-200 hover:text-[#D4A843]',
            isActive(link.href) && 'text-[#D4A843]'
          )}
        >
          {link.label}
        </Link>
      ))}

      <div className="group relative">
        <button
          type="button"
          className={cn(
            'flex items-center gap-1 text-[13px] font-medium tracking-[0.05em] text-[#1A1A1A] transition-colors duration-200 hover:text-[#D4A843]',
            (pathname.startsWith('/products') || pathname.startsWith('/categories')) && 'text-[#D4A843]'
          )}
        >
          Categories
          <ChevronDown className="h-3 w-3 transition-transform duration-200 group-hover:rotate-180" />
        </button>

        <div className="invisible absolute left-0 top-full z-50 mt-2 min-w-[180px] translate-y-2 rounded-xl border border-[rgba(0,0,0,0.08)] bg-white p-2 opacity-0 shadow-lg transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
          {categories.map((category) => (
            <Link
              key={category.href}
              href={category.href}
              onClick={onLinkClick}
              className="block rounded-md px-3 py-2 text-sm text-[#1A1A1A] transition-colors hover:bg-[#F5F0E8] hover:text-[#D4A843]"
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

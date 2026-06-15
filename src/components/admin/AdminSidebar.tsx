// src/components/admin/AdminSidebar.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Folder,
  Users,
  Settings,
  ExternalLink,
  X,
  Menu,
  Gem,
} from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import { cn } from '@/lib/utils';
import { getInitials } from '@/lib/utils';

const NAV_LINKS = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/products', label: 'Products', icon: Package, exact: false },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingBag, exact: false },
  { href: '/admin/categories', label: 'Categories', icon: Folder, exact: false },
  { href: '/admin/customers', label: 'Customers', icon: Users, exact: false },
  { href: '/admin/settings', label: 'Settings', icon: Settings, exact: false },
];

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();

  const isActive = (href: string, exact: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-slate-900 transition-transform duration-300',
          'lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between border-b border-slate-700/50 px-6 py-5">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-gold-400 to-gold-600">
                <Gem className="h-4 w-4 text-white" />
              </div>
              <span className="font-serif text-base font-bold tracking-wider text-gold-400">
                BEB FRAGRANCE
              </span>
            </div>
            <p className="mt-0.5 pl-10 text-[10px] font-semibold uppercase tracking-widest text-slate-500">
              Admin Panel
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest text-slate-600">
            Navigation
          </p>
          <ul className="space-y-0.5">
            {NAV_LINKS.map(({ href, label, icon: Icon, exact }) => {
              const active = isActive(href, exact);
              return (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={onClose}
                    className={cn(
                      'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150',
                      active
                        ? 'bg-gradient-to-r from-gold-500/20 to-gold-600/10 text-gold-400 ring-1 ring-gold-500/30'
                        : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                    )}
                    aria-current={active ? 'page' : undefined}
                  >
                    <Icon
                      className={cn(
                        'h-4.5 w-4.5 shrink-0',
                        active ? 'text-gold-400' : 'text-slate-500'
                      )}
                    />
                    {label}
                    {active && (
                      <span className="ml-auto h-1.5 w-1.5 rounded-full bg-gold-400" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Bottom section */}
        <div className="border-t border-slate-700/50 p-4 space-y-3">
          {/* Back to store */}
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-slate-500 transition-colors hover:bg-slate-800 hover:text-slate-300"
          >
            <ExternalLink className="h-4 w-4" />
            Back to Store
          </Link>

          {/* User info */}
          {session?.user && (
            <div className="flex items-center gap-3 rounded-xl bg-slate-800/60 px-3 py-2.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-gold-400 to-gold-600 text-xs font-bold text-white">
                {session.user.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={session.user.image}
                    alt={session.user.name ?? ''}
                    className="h-full w-full rounded-full object-cover"
                  />
                ) : (
                  getInitials(session.user.name ?? 'A')
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold text-slate-200">
                  {session.user.name ?? 'Admin'}
                </p>
                <p className="truncate text-[10px] text-slate-500">
                  {session.user.email}
                </p>
              </div>
              <button
                type="button"
                onClick={() => signOut({ callbackUrl: '/' })}
                className="shrink-0 rounded-lg p-1 text-slate-500 transition-colors hover:text-destructive"
                title="Sign out"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}

// Mobile toggle button
export function AdminMenuToggle({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 lg:hidden"
      aria-label="Open navigation menu"
    >
      <Menu className="h-5 w-5" />
    </button>
  );
}

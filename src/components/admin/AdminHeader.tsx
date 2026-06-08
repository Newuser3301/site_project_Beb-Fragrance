// src/components/admin/AdminHeader.tsx
'use client';

import { useState } from 'react';
import { Bell, ChevronDown, LogOut, User } from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { AdminMenuToggle } from './AdminSidebar';
import { getInitials } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface AdminHeaderProps {
  onMenuToggle: () => void;
  title?: string;
}

export function AdminHeader({ onMenuToggle, title }: AdminHeaderProps) {
  const { data: session } = useSession();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 shadow-sm sm:px-6">
      {/* Left: hamburger + title */}
      <div className="flex items-center gap-3">
        <AdminMenuToggle onClick={onMenuToggle} />
        {title && (
          <h1 className="hidden font-serif text-lg font-semibold text-gray-900 sm:block">
            {title}
          </h1>
        )}
      </div>

      {/* Right: notifications + user */}
      <div className="flex items-center gap-2">
        {/* Notification bell */}
        <button
          type="button"
          className="relative rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 flex h-2 w-2 items-center justify-center rounded-full bg-gold-500" />
        </button>

        {/* User menu */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsUserMenuOpen((o) => !o)}
            className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-sm transition-colors hover:bg-gray-50"
            aria-expanded={isUserMenuOpen}
            aria-haspopup="menu"
          >
            {/* Avatar */}
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-gold-400 to-gold-600 text-[11px] font-bold text-white overflow-hidden">
              {session?.user?.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={session.user.image}
                  alt={session.user.name ?? ''}
                  className="h-full w-full object-cover"
                />
              ) : (
                getInitials(session?.user?.name ?? 'A')
              )}
            </div>
            <span className="hidden max-w-[120px] truncate text-sm font-medium text-gray-700 sm:block">
              {session?.user?.name ?? 'Admin'}
            </span>
            <ChevronDown
              className={cn(
                'h-4 w-4 text-gray-400 transition-transform duration-200',
                isUserMenuOpen && 'rotate-180'
              )}
            />
          </button>

          {/* Dropdown */}
          <AnimatePresence>
            {isUserMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setIsUserMenuOpen(false)}
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -8 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 z-20 mt-2 w-56 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-luxury"
                  role="menu"
                >
                  {/* User info */}
                  <div className="border-b border-gray-100 px-4 py-3">
                    <p className="text-sm font-semibold text-gray-900">
                      {session?.user?.name ?? 'Admin'}
                    </p>
                    <p className="truncate text-xs text-gray-500">
                      {session?.user?.email}
                    </p>
                  </div>

                  {/* Menu items */}
                  <div className="p-1">
                    <button
                      type="button"
                      role="menuitem"
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50"
                      onClick={() => {
                        setIsUserMenuOpen(false);
                      }}
                    >
                      <User className="h-4 w-4 text-gray-400" />
                      My Profile
                    </button>
                    <button
                      type="button"
                      role="menuitem"
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-destructive transition-colors hover:bg-red-50"
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        signOut({ callbackUrl: '/' });
                      }}
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}

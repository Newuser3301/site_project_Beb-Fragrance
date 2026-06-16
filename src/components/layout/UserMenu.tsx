'use client';

import Link from 'next/link';
import { Heart, LogOut, Package } from 'lucide-react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { signOut } from 'next-auth/react';
import { cn } from '@/lib/utils';

export interface UserMenuProps {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  } | null;
  className?: string;
}

export function UserMenu({ user, className }: UserMenuProps) {
  if (!user) {
    return (
      <Button variant="outline" size="sm" className={className} asChild>
        <Link href="/auth/login">Sign In</Link>
      </Button>
    );
  }

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          className={cn(
            'rounded-full outline-none ring-offset-background transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2',
            className
          )}
          aria-label="User menu"
        >
          <Avatar size="sm">
            <AvatarImage src={user.image ?? undefined} alt={user.name ?? 'User'} />
            <AvatarFallback name={user.name ?? user.email ?? 'User'} />
          </Avatar>
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="z-50 min-w-[200px] overflow-hidden rounded-lg border border-border bg-background p-1 shadow-luxury-lg animate-in fade-in-0 zoom-in-95"
          sideOffset={8}
          align="end"
        >
          <div className="border-b border-border px-3 py-2">
            <p className="text-sm font-medium">{user.name}</p>
            <p className="truncate text-xs text-muted-foreground">{user.email}</p>
          </div>

          <DropdownMenu.Item asChild>
            <Link
              href="/orders"
              className="flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm outline-none transition-colors hover:bg-cream-100 focus:bg-cream-100"
            >
              <Package className="h-4 w-4" />
              My Orders
            </Link>
          </DropdownMenu.Item>

          <DropdownMenu.Item asChild>
            <Link
              href="/wishlist"
              className="flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm outline-none transition-colors hover:bg-cream-100 focus:bg-cream-100"
            >
              <Heart className="h-4 w-4" />
              Wishlist
            </Link>
          </DropdownMenu.Item>

          <DropdownMenu.Separator className="my-1 h-px bg-border" />

          <DropdownMenu.Item
            className="flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm text-destructive outline-none transition-colors hover:bg-destructive/10 focus:bg-destructive/10"
            onSelect={() => signOut({ callbackUrl: '/' })}
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogOut, Package, Heart, User } from 'lucide-react';
import { useTranslations } from 'next-intl';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/Sheet';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Separator } from '@/components/ui/Separator';
import { useUIStore } from '@/store/useUIStore';
import { categories, navLinks } from '@/components/layout/Navbar';
import { signOut } from 'next-auth/react';
import { cn } from '@/lib/utils';

export interface MobileMenuUser {
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

export interface MobileMenuProps {
  user?: MobileMenuUser | null;
}

export function MobileMenu({ user }: MobileMenuProps) {
  const pathname = usePathname();
  const { isMobileMenuOpen, closeMobileMenu } = useUIStore();
  const tCommon = useTranslations('common');
  const tNav = useTranslations('nav');

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href.split('?')[0]);
  };

  return (
    <Sheet
      open={isMobileMenuOpen}
      onOpenChange={(open) => {
        if (!open) closeMobileMenu();
      }}
    >
      <SheetContent side="left" className="w-full max-w-xs p-0">
        <SheetHeader className="border-b border-border px-6 py-5">
          <SheetTitle className="font-serif text-xl tracking-[0.2em] text-gold-500">
            BEB FRAGRANCE
          </SheetTitle>
        </SheetHeader>

        <div className="flex h-[calc(100%-4rem)] flex-col overflow-y-auto px-4 py-6">
          {user && (
            <div className="mb-6 flex items-center gap-3 rounded-lg bg-cream-50 p-4">
              <Avatar size="md">
                <AvatarImage src={user.image ?? undefined} alt={user.name ?? 'User'} />
                <AvatarFallback name={user.name ?? user.email ?? 'User'} />
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{user.name ?? 'User'}</p>
                <p className="truncate text-xs text-muted-foreground">{user.email}</p>
              </div>
            </div>
          )}

          <nav className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMobileMenu}
                className={cn(
                  'block rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover:bg-cream-100 hover:text-gold-600',
                  isActive(link.href) && 'bg-cream-100 text-gold-600'
                )}
              >
                {tNav(`links.${link.key}`)}
              </Link>
            ))}

            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="categories" className="border-none">
                <AccordionTrigger className="rounded-md px-3 py-2.5 text-sm font-medium hover:bg-cream-100 hover:text-gold-600 hover:no-underline">
                  {tNav('categoryMenu')}
                </AccordionTrigger>
                <AccordionContent className="pb-0 pl-3">
                  {categories.map((category) => (
                    <Link
                      key={category.href}
                      href={category.href}
                      onClick={closeMobileMenu}
                      className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-cream-100 hover:text-gold-600"
                    >
                      <category.icon className="h-3.5 w-3.5" />
                      {tNav(`categories.${category.key}`)}
                    </Link>
                  ))}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </nav>

          {user && (
            <>
              <Separator className="my-6" />
              <div className="space-y-1">
                <Link
                  href="/profile"
                  onClick={closeMobileMenu}
                  className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover:bg-cream-100 hover:text-gold-600"
                >
                  <User className="h-4 w-4" />
                  {tCommon('myProfile')}
                </Link>
                <Link
                  href="/orders"
                  onClick={closeMobileMenu}
                  className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover:bg-cream-100 hover:text-gold-600"
                >
                  <Package className="h-4 w-4" />
                  {tCommon('myOrders')}
                </Link>
                <Link
                  href="/wishlist"
                  onClick={closeMobileMenu}
                  className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover:bg-cream-100 hover:text-gold-600"
                >
                  <Heart className="h-4 w-4" />
                  {tCommon('wishlist')}
                </Link>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 px-3 text-destructive hover:bg-destructive/10 hover:text-destructive"
                  onClick={() => {
                    closeMobileMenu();
                    signOut({ callbackUrl: '/' });
                  }}
                >
                  <LogOut className="h-4 w-4" />
                  {tCommon('signOut')}
                </Button>
              </div>
            </>
          )}

          {!user && (
            <div className="mt-auto pt-8">
              <Button variant="luxury" className="w-full" asChild>
                <Link href="/auth/login" onClick={closeMobileMenu}>
                  {tCommon('signIn')}
                </Link>
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

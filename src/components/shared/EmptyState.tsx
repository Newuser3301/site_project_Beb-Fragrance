'use client';

import {
  Heart,
  Package,
  Search,
  ShoppingBag,
  ShoppingCart,
  Star,
  type LucideIcon,
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

export type EmptyStateVariant =
  | 'cart'
  | 'orders'
  | 'wishlist'
  | 'products'
  | 'search'
  | 'reviews';

export interface EmptyStateProps {
  variant?: EmptyStateVariant;
  title?: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  className?: string;
}

const variantConfig: Record<
  EmptyStateVariant,
  { icon: LucideIcon; title: string; description: string; actionLabel: string; actionHref: string }
> = {
  cart: {
    icon: ShoppingCart,
    title: 'Your cart is empty',
    description: 'Discover our exquisite collection of premium fragrances and add your favorites.',
    actionLabel: 'Start Shopping',
    actionHref: '/products',
  },
  orders: {
    icon: Package,
    title: 'No orders yet',
    description: 'When you place an order, it will appear here for easy tracking.',
    actionLabel: 'Browse Fragrances',
    actionHref: '/products',
  },
  wishlist: {
    icon: Heart,
    title: 'Your wishlist is empty',
    description: 'Save your favorite fragrances to your wishlist and shop them later.',
    actionLabel: 'Explore Collection',
    actionHref: '/products',
  },
  products: {
    icon: ShoppingBag,
    title: 'No products found',
    description: 'We could not find any products matching your criteria.',
    actionLabel: 'View All Products',
    actionHref: '/products',
  },
  search: {
    icon: Search,
    title: 'No results found',
    description: 'Try adjusting your search terms or browse our full collection.',
    actionLabel: 'View All Products',
    actionHref: '/products',
  },
  reviews: {
    icon: Star,
    title: 'No reviews yet',
    description: 'Be the first to share your experience with this fragrance.',
    actionLabel: 'Write a Review',
    actionHref: '#',
  },
};

export function EmptyState({
  variant = 'products',
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
  className,
}: EmptyStateProps) {
  const config = variantConfig[variant];
  const Icon = config.icon;

  const displayTitle = title ?? config.title;
  const displayDescription = description ?? config.description;
  const displayActionLabel = actionLabel ?? config.actionLabel;
  const displayActionHref = actionHref ?? config.actionHref;

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center px-4 py-16 text-center',
        className
      )}
    >
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-cream-100">
        <Icon className="h-10 w-10 text-gold-500" strokeWidth={1.5} />
      </div>
      <h3 className="font-serif text-xl font-semibold text-foreground">
        {displayTitle}
      </h3>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
        {displayDescription}
      </p>
      {(onAction || displayActionHref) && (
        <div className="mt-6">
          {onAction ? (
            <Button variant="luxury" onClick={onAction}>
              {displayActionLabel}
            </Button>
          ) : (
            <Button variant="luxury" asChild>
              <Link href={displayActionHref}>{displayActionLabel}</Link>
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

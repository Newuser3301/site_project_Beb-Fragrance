'use client';

import { Skeleton } from '@/components/ui/Skeleton';
import { cn } from '@/lib/utils';

export type LoadingSkeletonVariant =
  | 'product-card'
  | 'product-detail'
  | 'cart'
  | 'orders';

export interface LoadingSkeletonProps {
  variant?: LoadingSkeletonVariant;
  count?: number;
  className?: string;
}

function ProductCardSkeleton() {
  return (
    <div className="space-y-4 rounded-lg border border-border p-4">
      <Skeleton className="aspect-[3/4] w-full rounded-lg" />
      <div className="space-y-2">
        <Skeleton className="h-3 w-1/3" />
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/4" />
      </div>
    </div>
  );
}

function ProductDetailSkeleton() {
  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <Skeleton className="aspect-square w-full rounded-xl" />
      <div className="space-y-6">
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-10 w-3/4" />
        <Skeleton className="h-6 w-1/3" />
        <div className="flex gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} circle width={20} height={20} />
          ))}
        </div>
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    </div>
  );
}

function CartSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex gap-4 rounded-lg border border-border p-4">
          <Skeleton className="h-20 w-20 shrink-0 rounded-md" />
          <div className="flex flex-1 flex-col justify-between space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/4" />
            <div className="flex items-center justify-between">
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function OrdersSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="rounded-lg border border-border p-6">
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
          <div className="mt-4 flex gap-4">
            <Skeleton className="h-16 w-16 rounded-md" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-3 w-1/3" />
            </div>
            <Skeleton className="h-5 w-20" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function LoadingSkeleton({
  variant = 'product-card',
  count = 4,
  className,
}: LoadingSkeletonProps) {
  if (variant === 'product-detail') {
    return (
      <div className={cn('w-full', className)}>
        <ProductDetailSkeleton />
      </div>
    );
  }

  if (variant === 'cart') {
    return (
      <div className={cn('w-full', className)}>
        <CartSkeleton />
      </div>
    );
  }

  if (variant === 'orders') {
    return (
      <div className={cn('w-full', className)}>
        <OrdersSkeleton />
      </div>
    );
  }

  return (
    <div
      className={cn(
        'grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4',
        className
      )}
    >
      {Array.from({ length: count }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
}

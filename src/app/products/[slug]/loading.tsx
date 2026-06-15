// src/app/products/[slug]/loading.tsx
import { Skeleton } from '@/components/ui/Skeleton';
import { LoadingSkeleton } from '@/components/shared/LoadingSkeleton';

export default function ProductDetailLoading() {
  return (
    <>
      {/* Breadcrumb skeleton */}
      <div className="border-b border-border bg-cream-50">
        <div className="container-beb py-3">
          <Skeleton className="h-4 w-72" />
        </div>
      </div>

      {/* Product detail skeleton */}
      <div className="container-beb py-10">
        <div className="grid gap-10 lg:grid-cols-2">
          {/* Gallery skeleton */}
          <div className="space-y-4">
            <Skeleton className="aspect-[4/5] w-full max-w-lg rounded-2xl" />
            <div className="flex gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-20 w-20 rounded-xl" />
              ))}
            </div>
          </div>

          {/* Product info skeleton */}
          <div className="space-y-5">
            {/* Brand */}
            <Skeleton className="h-3 w-24" />
            {/* Title */}
            <div className="space-y-2">
              <Skeleton className="h-9 w-3/4" />
              <Skeleton className="h-9 w-1/2" />
            </div>
            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-4 w-4 rounded-sm" />
                ))}
              </div>
              <Skeleton className="h-4 w-24" />
            </div>
            {/* Price */}
            <Skeleton className="h-10 w-36" />
            {/* Notes */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-7 w-20 rounded-full" />
                ))}
              </div>
            </div>
            {/* Volume selector */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <div className="flex gap-2">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-10 w-20 rounded-lg" />
                ))}
              </div>
            </div>
            {/* Quantity + Cart */}
            <div className="flex gap-3">
              <Skeleton className="h-12 w-32" />
              <Skeleton className="h-12 flex-1" />
            </div>
            <Skeleton className="h-12 w-full" />
            {/* Shipping info */}
            <Skeleton className="h-14 w-full rounded-xl" />
          </div>
        </div>

        {/* Tabs skeleton */}
        <div className="mt-14">
          <div className="mb-6 flex gap-1 border-b border-border">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-10 w-28 rounded-t-lg" />
            ))}
          </div>
          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </div>

      {/* Related products skeleton */}
      <div className="border-t border-border bg-cream-50">
        <div className="container-beb py-12">
          <div className="mb-8 space-y-2">
            <Skeleton className="h-7 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
          <LoadingSkeleton variant="product-card" count={4} />
        </div>
      </div>
    </>
  );
}

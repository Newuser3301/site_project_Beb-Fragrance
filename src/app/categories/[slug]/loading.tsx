// src/app/categories/[slug]/loading.tsx
import { Skeleton } from '@/components/ui/Skeleton';
import { LoadingSkeleton } from '@/components/shared/LoadingSkeleton';

export default function CategoryLoading() {
  return (
    <div className="container-beb py-10">
      {/* Breadcrumb skeleton */}
      <div className="mb-8 space-y-3">
        <Skeleton className="h-4 w-56" />
        <Skeleton className="h-10 w-72" />
        <Skeleton className="h-5 w-full max-w-xl" />
        <Skeleton className="h-4 w-40" />
      </div>

      {/* Filter bar skeleton */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 gap-3">
          <Skeleton className="h-10 max-w-md flex-1" />
          <Skeleton className="h-10 w-24 sm:hidden" />
        </div>
        <Skeleton className="h-10 w-44" />
      </div>

      {/* Main area */}
      <div className="flex gap-8">
        {/* Sidebar skeleton */}
        <div className="hidden w-64 shrink-0 space-y-4 lg:block">
          <Skeleton className="h-6 w-32" />
          <div className="rounded-xl border border-border p-5 space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4 rounded-full" />
                  <Skeleton className="h-4 w-20" />
                </div>
              ))}
            </div>
            <Skeleton className="h-px w-full" />
            <div className="space-y-3">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-full" />
              <div className="flex gap-2">
                <Skeleton className="h-9 flex-1" />
                <Skeleton className="h-9 flex-1" />
              </div>
            </div>
            <Skeleton className="h-px w-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4 rounded" />
                  <Skeleton className="h-4 w-24" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Products grid skeleton */}
        <div className="min-w-0 flex-1">
          <LoadingSkeleton variant="product-card" count={8} />

          {/* Pagination skeleton */}
          <div className="mt-10 flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-9 w-9 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

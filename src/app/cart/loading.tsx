// src/app/cart/loading.tsx
import { Skeleton } from '@/components/ui/Skeleton';

export default function CartLoading() {
  return (
    <div className="container-beb py-10">
      {/* Breadcrumb */}
      <Skeleton className="mb-6 h-4 w-40" />

      {/* Title */}
      <div className="mb-8 flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-9 w-56" />
          <Skeleton className="h-4 w-32" />
        </div>
        <Skeleton className="h-9 w-28" />
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_380px]">
        {/* Cart items skeleton */}
        <div className="rounded-2xl border border-border bg-white">
          <div className="border-b border-border px-6 py-4">
            <Skeleton className="h-4 w-32" />
          </div>
          <div className="divide-y divide-border px-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-4 py-5">
                <Skeleton className="h-24 w-24 shrink-0 rounded-xl" />
                <div className="flex flex-1 flex-col justify-between">
                  <div className="space-y-2">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-5 w-48" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-9 w-28 rounded-lg" />
                    <Skeleton className="h-6 w-20" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary skeleton */}
        <div className="rounded-2xl border border-border bg-white p-6 space-y-4">
          <Skeleton className="h-6 w-36" />
          <Skeleton className="h-4 w-24" />
          <div className="space-y-3 pt-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-16" />
              </div>
            ))}
          </div>
          <Skeleton className="h-px w-full" />
          <div className="flex justify-between">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-7 w-24" />
          </div>
          <Skeleton className="h-12 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}

// src/app/orders/[id]/loading.tsx
import { Skeleton } from '@/components/ui/Skeleton';

export default function OrderDetailLoading() {
  return (
    <div className="container-beb py-10">
      <Skeleton className="mb-6 h-4 w-56" />
      <div className="mb-8 flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-4 w-40" />
        </div>
        <Skeleton className="h-7 w-24 rounded-full" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          {/* Order items skeleton */}
          <div className="rounded-2xl border border-border bg-white">
            <div className="border-b border-border px-6 py-4">
              <Skeleton className="h-6 w-36" />
            </div>
            <div className="divide-y divide-border">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-4 p-5">
                  <Skeleton className="h-16 w-16 shrink-0 rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-1/3" />
                  </div>
                  <Skeleton className="h-5 w-16" />
                </div>
              ))}
            </div>
          </div>

          {/* Timeline skeleton */}
          <div className="rounded-2xl border border-border bg-white p-6">
            <Skeleton className="mb-5 h-6 w-36" />
            <div className="space-y-6 pl-10">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="space-y-1">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-48" />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Summary skeleton */}
          <div className="rounded-2xl border border-border bg-white p-6 space-y-3">
            <Skeleton className="mb-4 h-6 w-36" />
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex justify-between">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-16" />
              </div>
            ))}
            <Skeleton className="h-px w-full" />
            <div className="flex justify-between pt-1">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-7 w-24" />
            </div>
          </div>

          {/* Address skeleton */}
          <div className="rounded-2xl border border-border bg-white p-6 space-y-3">
            <Skeleton className="mb-4 h-6 w-36" />
            <div className="flex gap-2.5">
              <Skeleton className="h-4 w-4 shrink-0 mt-0.5" />
              <div className="space-y-1.5">
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// src/app/checkout/loading.tsx
import { Skeleton } from '@/components/ui/Skeleton';

export default function CheckoutLoading() {
  return (
    <div className="container-beb py-10">
      {/* Breadcrumb */}
      <Skeleton className="mb-6 h-4 w-52" />
      <Skeleton className="mb-8 h-10 w-40" />

      {/* Steps */}
      <div className="mb-8 flex items-center gap-0">
        {[1, 2, 3].map((i, idx) => (
          <div key={i} className="flex flex-1 items-center">
            <div className="flex flex-col items-center gap-1.5">
              <Skeleton className="h-9 w-9 rounded-full" />
              <Skeleton className="h-3 w-16" />
            </div>
            {idx < 2 && <div className="mb-5 h-0.5 flex-1 bg-border" />}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_400px]">
        {/* Form skeleton */}
        <div className="rounded-2xl border border-border bg-white p-6 md:p-8">
          <Skeleton className="mb-1 h-7 w-48" />
          <Skeleton className="mb-6 h-4 w-72" />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2 space-y-1.5">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-11 w-full rounded-xl" />
            </div>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="space-y-1.5">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-11 w-full rounded-xl" />
              </div>
            ))}
          </div>
        </div>

        {/* Order summary skeleton */}
        <div className="rounded-2xl border border-border bg-white p-6 space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-36" />
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-14 w-14 shrink-0 rounded-lg" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
                <Skeleton className="h-4 w-14" />
              </div>
            ))}
          </div>
          <Skeleton className="h-px w-full" />
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex justify-between">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-16" />
              </div>
            ))}
          </div>
          <div className="flex justify-between pt-2">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-7 w-24" />
          </div>
        </div>
      </div>
    </div>
  );
}

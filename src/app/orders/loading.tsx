// src/app/orders/loading.tsx
import { Skeleton } from '@/components/ui/Skeleton';

export default function OrdersLoading() {
  return (
    <div className="container-beb py-10">
      <Skeleton className="mb-6 h-4 w-40" />
      <Skeleton className="mb-2 h-10 w-40" />
      <Skeleton className="mb-8 h-4 w-24" />

      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-2xl border border-border bg-white p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-5 w-36" />
                  <Skeleton className="h-5 w-20 rounded-full" />
                </div>
                <Skeleton className="h-4 w-48" />
                <div className="flex gap-2">
                  {[1, 2, 3].map((j) => (
                    <Skeleton key={j} className="h-12 w-12 rounded-lg" />
                  ))}
                </div>
              </div>
              <div className="flex flex-col items-end gap-3">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-9 w-28 rounded-xl" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

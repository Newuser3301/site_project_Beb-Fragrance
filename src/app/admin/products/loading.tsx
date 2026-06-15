// src/app/admin/products/loading.tsx
import { Skeleton } from '@/components/ui/Skeleton';

export default function AdminProductsLoading() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1.5">
          <Skeleton className="h-8 w-36" />
          <Skeleton className="h-4 w-28" />
        </div>
        <Skeleton className="h-10 w-40 rounded-xl" />
      </div>

      {/* Search */}
      <Skeleton className="h-10 w-72 rounded-xl" />

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
        <div className="border-b border-gray-100 bg-gray-50 px-4 py-3">
          <div className="flex gap-12">
            {['Product', 'Category', 'Price', 'Stock', 'Status', 'Actions'].map((h) => (
              <Skeleton key={h} className="h-3 w-16" />
            ))}
          </div>
        </div>
        <div className="divide-y divide-gray-100">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 px-4 py-3">
              <div className="flex items-center gap-3">
                <Skeleton className="h-12 w-12 shrink-0 rounded-xl" />
                <div className="space-y-1.5">
                  <Skeleton className="h-4 w-36" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-6 w-16 rounded-full" />
              <div className="ml-auto flex gap-2">
                <Skeleton className="h-8 w-16 rounded-lg" />
                <Skeleton className="h-8 w-16 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

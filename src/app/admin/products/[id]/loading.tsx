// src/app/admin/products/[id]/loading.tsx
import { Skeleton } from '@/components/ui/Skeleton';

export default function EditProductLoading() {
  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Skeleton className="h-4 w-72" />

      {/* Title */}
      <div className="space-y-2">
        <Skeleton className="h-9 w-72" />
        <Skeleton className="h-4 w-52" />
      </div>

      {/* Basic info card */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 space-y-4">
        <Skeleton className="mb-5 h-6 w-44" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2 space-y-1.5">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-10 w-full rounded-xl" />
          </div>
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-1.5">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full rounded-xl" />
            </div>
          ))}
          <div className="sm:col-span-2 space-y-1.5">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-28 w-full rounded-xl" />
          </div>
        </div>
      </div>

      {/* Pricing card */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 space-y-4">
        <Skeleton className="mb-5 h-6 w-36" />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-1.5">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full rounded-xl" />
            </div>
          ))}
        </div>
      </div>

      {/* Images card */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 space-y-4">
        <Skeleton className="h-6 w-36" />
        <Skeleton className="h-36 w-full rounded-2xl" />
      </div>

      {/* Actions */}
      <div className="flex justify-between rounded-2xl border border-gray-200 bg-white p-4">
        <Skeleton className="h-10 w-24 rounded-xl" />
        <Skeleton className="h-11 w-40 rounded-xl" />
      </div>
    </div>
  );
}

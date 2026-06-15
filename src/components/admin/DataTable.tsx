// src/components/admin/DataTable.tsx
'use client';

import { useState } from 'react';
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Skeleton } from '@/components/ui/Skeleton';
import { cn } from '@/lib/utils';

export interface Column<T> {
  key: string;
  header: string;
  accessor: (row: T) => React.ReactNode;
  sortable?: boolean;
  width?: string;
  className?: string;
}

interface DataTableProps<T extends { id: string }> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  onRowClick?: (row: T) => void;
  emptyMessage?: string;
  emptyDescription?: string;
  skeletonRows?: number;
}

type SortDir = 'asc' | 'desc' | null;

export function DataTable<T extends { id: string }>({
  columns,
  data,
  isLoading = false,
  onRowClick,
  emptyMessage = 'No data found',
  emptyDescription = 'There are no items to display.',
  skeletonRows = 8,
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>(null);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir((prev) => (prev === 'asc' ? 'desc' : prev === 'desc' ? null : 'asc'));
      if (sortDir === 'desc') setSortKey(null);
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const SortIcon = ({ colKey }: { colKey: string }) => {
    if (sortKey !== colKey) return <ChevronsUpDown className="h-3.5 w-3.5 text-gray-400" />;
    return sortDir === 'asc' ? (
      <ChevronUp className="h-3.5 w-3.5 text-gold-600" />
    ) : (
      <ChevronDown className="h-3.5 w-3.5 text-gold-600" />
    );
  };

  if (isLoading) {
    return (
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500"
                    style={col.width ? { width: col.width } : undefined}
                  >
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {Array.from({ length: skeletonRows }).map((_, i) => (
                <tr key={i}>
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3">
                      <Skeleton className="h-4 w-full max-w-[120px]" />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500"
                    style={col.width ? { width: col.width } : undefined}
                  >
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
          </table>
        </div>
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-3 text-4xl">📭</div>
          <p className="font-semibold text-gray-700">{emptyMessage}</p>
          <p className="mt-1 text-sm text-gray-400">{emptyDescription}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={cn(
                    'px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500',
                    col.sortable && 'cursor-pointer select-none hover:text-gray-700',
                    col.className
                  )}
                  style={col.width ? { width: col.width } : undefined}
                  onClick={col.sortable ? () => handleSort(col.key) : undefined}
                >
                  <div className="flex items-center gap-1.5">
                    {col.header}
                    {col.sortable && <SortIcon colKey={col.key} />}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            <AnimatePresence initial={false}>
              {data.map((row, idx) => (
                <motion.tr
                  key={row.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2, delay: idx * 0.02 }}
                  onClick={() => onRowClick?.(row)}
                  className={cn(
                    'transition-colors',
                    onRowClick && 'cursor-pointer hover:bg-gold-50/50',
                    !onRowClick && 'hover:bg-gray-50/60'
                  )}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={cn(
                        'whitespace-nowrap px-4 py-3 text-sm text-gray-700',
                        col.className
                      )}
                    >
                      {col.accessor(row)}
                    </td>
                  ))}
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  );
}

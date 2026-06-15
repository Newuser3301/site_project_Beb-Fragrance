// src/components/admin/StatusBadge.tsx
'use client';

import type { OrderStatus } from '@prisma/client';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: OrderStatus;
  className?: string;
}

const STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; classes: string; dot: string }
> = {
  PENDING:    { label: 'Pending',    classes: 'bg-yellow-50 text-yellow-800 ring-yellow-200',   dot: 'bg-yellow-400' },
  CONFIRMED:  { label: 'Confirmed',  classes: 'bg-blue-50 text-blue-800 ring-blue-200',         dot: 'bg-blue-400' },
  PROCESSING: { label: 'Processing', classes: 'bg-indigo-50 text-indigo-800 ring-indigo-200',   dot: 'bg-indigo-400' },
  SHIPPED:    { label: 'Shipped',    classes: 'bg-purple-50 text-purple-800 ring-purple-200',   dot: 'bg-purple-400' },
  DELIVERED:  { label: 'Delivered',  classes: 'bg-green-50 text-green-800 ring-green-200',      dot: 'bg-green-400' },
  CANCELLED:  { label: 'Cancelled',  classes: 'bg-red-50 text-red-800 ring-red-200',            dot: 'bg-red-400' },
  REFUNDED:   { label: 'Refunded',   classes: 'bg-gray-100 text-gray-700 ring-gray-200',        dot: 'bg-gray-400' },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status];

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ring-1',
        config.classes,
        className
      )}
    >
      <span className={cn('h-1.5 w-1.5 rounded-full', config.dot)} />
      {config.label}
    </span>
  );
}

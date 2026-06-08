// src/components/admin/OrderTimeline.tsx
'use client';

import { motion } from 'framer-motion';
import { CheckCircle, Circle, XCircle, Clock } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import type { OrderStatus } from '@prisma/client';

interface TimelineStep {
  status: OrderStatus;
  label: string;
  description: string;
}

const TIMELINE_STEPS: TimelineStep[] = [
  { status: 'PENDING',    label: 'Order Placed',  description: 'Customer placed the order' },
  { status: 'CONFIRMED',  label: 'Confirmed',     description: 'Order confirmed by team' },
  { status: 'PROCESSING', label: 'Processing',    description: 'Preparing for shipment' },
  { status: 'SHIPPED',    label: 'Shipped',       description: 'Package on its way' },
  { status: 'DELIVERED',  label: 'Delivered',     description: 'Successfully delivered' },
];

const STATUS_ORDER: OrderStatus[] = [
  'PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED',
];

interface OrderTimelineProps {
  status: OrderStatus;
  dates?: Partial<Record<OrderStatus, Date | string>>;
}

export function OrderTimeline({ status, dates = {} }: OrderTimelineProps) {
  const isCancelled = status === 'CANCELLED' || status === 'REFUNDED';
  const currentIndex = STATUS_ORDER.indexOf(status);

  if (isCancelled) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-5">
        <div className="flex items-center gap-3">
          <XCircle className="h-6 w-6 text-red-500" />
          <div>
            <p className="font-semibold text-red-800">
              Order {status === 'CANCELLED' ? 'Cancelled' : 'Refunded'}
            </p>
            <p className="text-sm text-red-600">
              This order has been {status.toLowerCase()}.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-0">
      {TIMELINE_STEPS.map((step, idx) => {
        const stepIndex = STATUS_ORDER.indexOf(step.status);
        const isCompleted = currentIndex >= stepIndex;
        const isCurrent = currentIndex === stepIndex;
        const isLast = idx === TIMELINE_STEPS.length - 1;
        const date = dates[step.status];

        return (
          <div key={step.status} className="flex gap-4">
            {/* Left: dot + line */}
            <div className="flex flex-col items-center">
              <div
                className={`relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                  isCompleted
                    ? 'border-emerald-500 bg-emerald-500'
                    : isCurrent
                    ? 'border-blue-400 bg-white'
                    : 'border-gray-200 bg-white'
                }`}
              >
                {isCompleted ? (
                  <CheckCircle className="h-5 w-5 text-white" />
                ) : isCurrent ? (
                  <motion.div
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <Clock className="h-4 w-4 text-blue-500" />
                  </motion.div>
                ) : (
                  <Circle className="h-4 w-4 text-gray-300" />
                )}
              </div>

              {/* Connecting line */}
              {!isLast && (
                <div className="relative mt-0.5 w-0.5 flex-1" style={{ minHeight: '32px' }}>
                  <div className="absolute inset-0 bg-gray-200" />
                  {isCompleted && (
                    <motion.div
                      className="absolute inset-0 origin-top bg-emerald-500"
                      initial={{ scaleY: 0 }}
                      animate={{ scaleY: 1 }}
                      transition={{ duration: 0.4, delay: idx * 0.1 }}
                    />
                  )}
                </div>
              )}
            </div>

            {/* Right: content */}
            <div className={`pb-6 ${isLast ? 'pb-0' : ''}`}>
              <p
                className={`text-sm font-semibold ${
                  isCompleted
                    ? 'text-emerald-700'
                    : isCurrent
                    ? 'text-blue-700'
                    : 'text-gray-400'
                }`}
              >
                {step.label}
                {isCurrent && (
                  <span className="ml-2 rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-blue-700">
                    Current
                  </span>
                )}
              </p>
              <p
                className={`mt-0.5 text-xs ${
                  isCompleted ? 'text-gray-500' : 'text-gray-400'
                }`}
              >
                {step.description}
              </p>
              {date && (
                <p className="mt-0.5 text-[11px] text-gray-400">
                  {formatDate(
                    typeof date === 'string' ? new Date(date) : date,
                    { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' },
                    'en-US'
                  )}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

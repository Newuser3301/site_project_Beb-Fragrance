// src/components/admin/StatsCard.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  prefix?: string;
  suffix?: string;
  change?: number;
  changeType?: 'increase' | 'decrease' | 'neutral';
  changeLabel?: string;
  color?: 'gold' | 'blue' | 'green' | 'purple';
  formatValue?: (v: number) => string;
}

const COLOR_MAP = {
  gold: {
    iconBg: 'bg-gradient-to-br from-gold-400 to-gold-600',
    iconText: 'text-white',
    glow: 'shadow-gold/20',
  },
  blue: {
    iconBg: 'bg-gradient-to-br from-blue-400 to-blue-600',
    iconText: 'text-white',
    glow: 'shadow-blue-200/50',
  },
  green: {
    iconBg: 'bg-gradient-to-br from-emerald-400 to-emerald-600',
    iconText: 'text-white',
    glow: 'shadow-emerald-200/50',
  },
  purple: {
    iconBg: 'bg-gradient-to-br from-oud-400 to-oud-600',
    iconText: 'text-white',
    glow: 'shadow-oud-200/50',
  },
};

function useCountUp(target: number, duration = 1200) {
  const [current, setCurrent] = useState(0);
  const frameRef = useRef<number>(0);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    const animate = (timestamp: number) => {
      if (!startRef.current) startRef.current = timestamp;
      const elapsed = timestamp - startRef.current;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutQuart
      const eased = 1 - Math.pow(1 - progress, 4);
      setCurrent(Math.floor(eased * target));
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      } else {
        setCurrent(target);
      }
    };
    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, [target, duration]);

  return current;
}

export function StatsCard({
  title,
  value,
  icon: Icon,
  prefix = '',
  suffix = '',
  change,
  changeType = 'neutral',
  changeLabel = 'vs last month',
  color = 'gold',
  formatValue,
}: StatsCardProps) {
  const numericValue = typeof value === 'number' ? value : 0;
  const animated = useCountUp(numericValue);
  const colors = COLOR_MAP[color];

  const displayValue =
    typeof value === 'string'
      ? value
      : formatValue
      ? formatValue(animated)
      : animated.toLocaleString('en-US');

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn(
        'group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6',
        'transition-shadow duration-300 hover:shadow-xl',
        colors.glow
      )}
    >
      {/* Background decoration */}
      <div className="pointer-events-none absolute -right-4 -top-4 h-24 w-24 rounded-full bg-gray-50 opacity-60 transition-transform duration-500 group-hover:scale-150" />

      <div className="relative flex items-start justify-between">
        {/* Icon */}
        <div
          className={cn(
            'flex h-12 w-12 items-center justify-center rounded-xl shadow-md',
            colors.iconBg
          )}
        >
          <Icon className={cn('h-6 w-6', colors.iconText)} />
        </div>

        {/* Change indicator */}
        {change !== undefined && (
          <div
            className={cn(
              'flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold',
              changeType === 'increase'
                ? 'bg-emerald-50 text-emerald-700'
                : changeType === 'decrease'
                ? 'bg-red-50 text-red-700'
                : 'bg-gray-100 text-gray-600'
            )}
          >
            {changeType === 'increase' ? (
              <TrendingUp className="h-3 w-3" />
            ) : changeType === 'decrease' ? (
              <TrendingDown className="h-3 w-3" />
            ) : null}
            {change > 0 ? '+' : ''}
            {change}%
          </div>
        )}
      </div>

      <div className="mt-4">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="mt-1 font-serif text-3xl font-bold tracking-tight text-gray-900">
          {prefix}
          {displayValue}
          {suffix}
        </p>
        {changeLabel && change !== undefined && (
          <p className="mt-1 text-xs text-gray-400">{changeLabel}</p>
        )}
      </div>
    </motion.div>
  );
}

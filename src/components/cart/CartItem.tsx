// src/components/cart/CartItem.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, X } from 'lucide-react';
import { motion } from 'framer-motion';
import type { CartItem as CartItemType } from '@/store/useCartStore';
import { formatPrice } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
}

export function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
  const lineTotal = item.price * item.quantity;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -30, height: 0, marginBottom: 0, padding: 0 }}
      transition={{ duration: 0.25 }}
      className="flex gap-4 py-5 sm:gap-5"
    >
      {/* Product image */}
      <Link
        href={`/products/${item.id}`}
        className="relative shrink-0 overflow-hidden rounded-xl bg-cream-100"
      >
        <div className="relative h-20 w-20 sm:h-24 sm:w-24">
          <Image
            src={item.image || '/placeholder-perfume.jpg'}
            alt={item.name}
            fill
            className="object-cover transition-transform duration-500 hover:scale-105"
            sizes="(max-width: 640px) 80px, 96px"
          />
        </div>
      </Link>

      {/* Product info */}
      <div className="flex min-w-0 flex-1 flex-col justify-between">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wider text-gold-500">
              {item.brand}
            </p>
            <Link
              href={`/products/${item.id}`}
              className="mt-0.5 block truncate font-serif text-base font-semibold text-foreground transition-colors hover:text-gold-600"
            >
              {item.name}
            </Link>
            <p className="mt-1 text-sm text-muted-foreground">{item.volume}</p>
          </div>

          {/* Remove button */}
          <button
            type="button"
            onClick={() => onRemove(item.productId)}
            className="shrink-0 rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
            aria-label={`Remove ${item.name} from cart`}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Quantity + Price */}
        <div className="mt-3 flex items-center justify-between gap-3">
          {/* Quantity selector */}
          <div className="flex items-center rounded-lg border border-border bg-white">
            <button
              type="button"
              onClick={() => onUpdateQuantity(item.productId, item.quantity - 1)}
              disabled={item.quantity <= 1}
              className={cn(
                'flex h-8 w-8 items-center justify-center rounded-l-lg transition-colors',
                item.quantity <= 1
                  ? 'cursor-not-allowed text-muted-foreground/40'
                  : 'text-foreground hover:bg-cream-100'
              )}
              aria-label="Decrease quantity"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>

            <span className="flex h-8 w-9 items-center justify-center border-x border-border text-sm font-semibold tabular-nums">
              {item.quantity}
            </span>

            <button
              type="button"
              onClick={() => onUpdateQuantity(item.productId, item.quantity + 1)}
              className="flex h-8 w-8 items-center justify-center rounded-r-lg text-foreground transition-colors hover:bg-cream-100"
              aria-label="Increase quantity"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Price */}
          <div className="text-right">
            <p className="font-serif text-base font-bold text-gold-600">
              {formatPrice(lineTotal, 'USD', 'en-US')}
            </p>
            {item.quantity > 1 && (
              <p className="text-xs text-muted-foreground">
                {formatPrice(item.price, 'USD', 'en-US')} each
              </p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

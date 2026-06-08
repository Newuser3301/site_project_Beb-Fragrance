// src/app/cart/page.tsx
'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { AnimatePresence } from 'framer-motion';
import { Trash2, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { CartItem } from '@/components/cart/CartItem';
import { CartSummary } from '@/components/cart/CartSummary';
import { EmptyCart } from '@/components/cart/EmptyCart';
import { useCartStore } from '@/store/useCartStore';

const FREE_SHIPPING_THRESHOLD = 100;
const SHIPPING_COST = 9.99;
const TAX_RATE = 0.08;

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, getTotal, getItemsCount } =
    useCartStore();

  const subtotal = getTotal();
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const tax = subtotal * TAX_RATE;
  const total = subtotal + shipping + tax;
  const itemCount = getItemsCount();

  const isEmpty = items.length === 0;

  return (
    <div className="min-h-[70vh]">
      <div className="container-beb py-10">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/" className="transition-colors hover:text-gold-600">
            Home
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="font-medium text-foreground">Shopping Cart</span>
        </nav>

        {/* Page title */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-serif text-3xl font-bold text-foreground md:text-4xl">
              Shopping Cart
            </h1>
            {!isEmpty && (
              <p className="mt-1.5 text-sm text-muted-foreground">
                {itemCount} {itemCount === 1 ? 'item' : 'items'} in your cart
              </p>
            )}
          </div>

          {!isEmpty && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearCart}
              className="gap-2 text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
              <span className="hidden sm:inline">Clear cart</span>
            </Button>
          )}
        </div>

        {/* Empty state */}
        {isEmpty ? (
          <EmptyCart />
        ) : (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_380px]">
            {/* Cart items */}
            <div>
              <div className="rounded-2xl border border-border bg-white">
                <div className="border-b border-border px-6 py-4">
                  <div className="grid grid-cols-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    <span className="col-span-2">Product</span>
                    <span className="text-right">Total</span>
                  </div>
                </div>

                <div className="divide-y divide-border px-6">
                  <AnimatePresence initial={false}>
                    {items.map((item) => (
                      <CartItem
                        key={item.productId}
                        item={item}
                        onUpdateQuantity={updateQuantity}
                        onRemove={removeItem}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              </div>

              {/* Continue shopping */}
              <div className="mt-4">
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-gold-600"
                >
                  ← Continue Shopping
                </Link>
              </div>
            </div>

            {/* Cart summary — sticky */}
            <div>
              <div className="sticky top-24">
                <CartSummary
                  subtotal={subtotal}
                  shipping={shipping}
                  tax={tax}
                  total={total}
                  itemCount={itemCount}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

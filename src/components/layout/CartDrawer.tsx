'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/Sheet';
import { Button } from '@/components/ui/Button';
import { ScrollArea } from '@/components/ui/ScrollArea';
import { Separator } from '@/components/ui/Separator';
import { EmptyState } from '@/components/shared/EmptyState';
import { useCartStore } from '@/store/useCartStore';
import { useUIStore } from '@/store/useUIStore';
import { formatPrice } from '@/lib/utils';

const FREE_SHIPPING_THRESHOLD = 100;

export function CartDrawer() {
  const { isCartOpen, closeCart } = useUIStore();
  const { items, updateQuantity, removeItem, getTotal, getItemsCount } =
    useCartStore();

  const subtotal = getTotal();
  const itemsCount = getItemsCount();
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 15;
  const total = subtotal + shipping;

  return (
    <Sheet open={isCartOpen} onOpenChange={(open) => !open && closeCart()}>
      <SheetContent side="right" className="flex w-full flex-col p-0 sm:max-w-md">
        <SheetHeader className="border-b border-border px-6 py-5">
          <SheetTitle className="font-serif text-xl">
            Shopping Cart
            {itemsCount > 0 && (
              <span className="ml-2 text-sm font-normal text-muted-foreground">
                ({itemsCount} {itemsCount === 1 ? 'item' : 'items'})
              </span>
            )}
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 items-center justify-center">
            <EmptyState variant="cart" onAction={closeCart} />
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 px-6">
              <AnimatePresence initial={false}>
                <ul className="space-y-4 py-4">
                  {items.map((item) => (
                    <motion.li
                      key={item.productId}
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="flex gap-4 rounded-lg border border-border p-3"
                    >
                      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md bg-cream-100">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      </div>

                      <div className="flex min-w-0 flex-1 flex-col">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium">
                              {item.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {item.brand} · {item.volume}
                            </p>
                            <p className="mt-1 text-sm font-semibold text-gold-600">
                              {formatPrice(item.price, 'USD', 'en-US')}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeItem(item.productId)}
                            className="shrink-0 rounded-md p-1 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                            aria-label={`Remove ${item.name}`}
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="mt-auto flex items-center justify-between pt-2">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() =>
                                updateQuantity(item.productId, item.quantity - 1)
                              }
                              aria-label="Decrease quantity"
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-6 text-center text-sm font-medium">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() =>
                                updateQuantity(item.productId, item.quantity + 1)
                              }
                              aria-label="Increase quantity"
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          <span className="text-sm font-semibold">
                            {formatPrice(
                              item.price * item.quantity,
                              'USD',
                              'en-US'
                            )}
                          </span>
                        </div>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              </AnimatePresence>
            </ScrollArea>

            <div className="border-t border-border bg-cream-50/50 px-6 py-5">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">
                    {formatPrice(subtotal, 'USD', 'en-US')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="font-medium">
                    {shipping === 0 ? (
                      <span className="text-emerald-600">Free</span>
                    ) : (
                      formatPrice(shipping, 'USD', 'en-US')
                    )}
                  </span>
                </div>
                {subtotal < FREE_SHIPPING_THRESHOLD && (
                  <p className="text-xs text-muted-foreground">
                    Free shipping on orders over{' '}
                    {formatPrice(FREE_SHIPPING_THRESHOLD, 'USD', 'en-US')}
                  </p>
                )}
                <Separator className="my-3" />
                <div className="flex justify-between text-base">
                  <span className="font-semibold">Total</span>
                  <span className="font-serif font-bold text-gold-600">
                    {formatPrice(total, 'USD', 'en-US')}
                  </span>
                </div>
              </div>

              <Button variant="luxury" className="mt-4 w-full" asChild>
                <Link href="/checkout" onClick={closeCart}>
                  Checkout
                </Link>
              </Button>
              <Button
                variant="ghost"
                className="mt-2 w-full text-muted-foreground"
                onClick={closeCart}
                asChild
              >
                <Link href="/products">Continue Shopping</Link>
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useCartStore } from '@/store/useCartStore';
import { useUIStore } from '@/store/useUIStore';
import { cn } from '@/lib/utils';

export interface AddToCartProduct {
  id: string;
  name: string;
  price: number;
  image: string;
  volume: string;
  brand: string;
  stock?: number;
}

export interface AddToCartButtonProps {
  product: AddToCartProduct;
  quantity?: number;
  variant?: 'primary' | 'secondary' | 'icon';
  className?: string;
}

export function AddToCartButton({
  product,
  quantity = 1,
  variant = 'primary',
  className,
}: AddToCartButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const addItem = useCartStore((state) => state.addItem);
  const openCart = useUIStore((state) => state.openCart);

  const isOutOfStock = product.stock !== undefined && product.stock <= 0;

  const handleAddToCart = async () => {
    if (isOutOfStock) return;

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 300));

    addItem({
      id: product.id,
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      volume: product.volume,
      brand: product.brand,
      quantity,
    });

    setIsLoading(false);
    setShowToast(true);
    openCart();

    setTimeout(() => setShowToast(false), 3000);
  };

  if (variant === 'icon') {
    return (
      <>
        <motion.div whileTap={{ scale: 0.9 }}>
          <Button
            variant="secondary"
            size="icon"
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            isLoading={isLoading}
            className={cn('rounded-full', className)}
            aria-label={isOutOfStock ? 'Sold out' : 'Add to cart'}
          >
            {!isLoading && <ShoppingBag className="h-4 w-4" />}
          </Button>
        </motion.div>
        <Toast
          show={showToast}
          message={`Added "${product.name}" to cart!`}
        />
      </>
    );
  }

  return (
    <>
      <motion.div whileTap={{ scale: 0.98 }} className={className}>
        <Button
          variant={variant === 'primary' ? 'luxury' : 'outline'}
          className="w-full"
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          isLoading={isLoading}
        >
          {!isLoading && <ShoppingBag className="h-4 w-4" />}
          {isOutOfStock ? 'Sold Out' : 'Add to Cart'}
        </Button>
      </motion.div>
      <Toast show={showToast} message={`Added "${product.name}" to cart!`} />
    </>
  );
}

function Toast({ show, message }: { show: boolean; message: string }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          className="fixed bottom-6 left-1/2 z-[100] flex -translate-x-1/2 items-center gap-2 rounded-full bg-oud-900 px-5 py-3 text-sm font-medium text-white shadow-luxury-lg"
        >
          <Check className="h-4 w-4 text-gold-400" />
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

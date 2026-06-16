'use client';

import { motion } from 'framer-motion';
import {
  ProductCard,
  type ProductCardProduct,
} from '@/components/product/ProductCard';
import { EmptyState } from '@/components/shared/EmptyState';
import { Skeleton } from '@/components/ui/Skeleton';
import { cn } from '@/lib/utils';

export interface ProductGridProps {
  products: ProductCardProduct[];
  isLoading?: boolean;
  className?: string;
}

function ProductCardSkeleton() {
  return (
    <div className="space-y-4 rounded-[24px] border border-[rgba(13,28,48,0.08)] bg-white p-4">
      <Skeleton className="aspect-[1.05/1] w-full rounded-[20px] bg-[#eef5ff]" />
      <Skeleton className="h-5 w-3/4 bg-[#dfe9f8]" />
      <Skeleton className="h-4 w-1/2 bg-[#dfe9f8]" />
      <Skeleton className="h-10 w-full rounded-2xl bg-[#dfe9f8]" />
    </div>
  );
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function ProductGrid({
  products,
  isLoading = false,
  className,
}: ProductGridProps) {
  if (isLoading) {
    return (
      <div className={cn('grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4', className)}>
        {Array.from({ length: 6 }).map((_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return <EmptyState variant="products" />;
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={cn('grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4', className)}
    >
      {products.map((product) => (
        <motion.div key={product.id} variants={itemVariants}>
          <ProductCard product={product} />
        </motion.div>
      ))}
    </motion.div>
  );
}

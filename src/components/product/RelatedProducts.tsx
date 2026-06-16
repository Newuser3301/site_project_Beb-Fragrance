'use client';

import { useEffect, useState } from 'react';
import {
  ProductCard,
  type ProductCardProduct,
} from '@/components/product/ProductCard';
import { Skeleton } from '@/components/ui/Skeleton';
import { cn } from '@/lib/utils';

export interface RelatedProductsProps {
  currentProductId: string;
  categoryId: string;
  categorySlug?: string;
  className?: string;
}

export function RelatedProducts({
  currentProductId,
  categoryId,
  categorySlug,
  className,
}: RelatedProductsProps) {
  const [products, setProducts] = useState<ProductCardProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRelated = async () => {
      setIsLoading(true);
      try {
        const categoryParam = categorySlug ?? categoryId;
        const response = await fetch(
          `/api/products?category=${encodeURIComponent(categoryParam)}&limit=4&exclude=${encodeURIComponent(currentProductId)}`
        );
        if (response.ok) {
          const data = await response.json();
          const filtered = (data.items ?? []).filter(
            (item: ProductCardProduct) => item.id !== currentProductId
          );
          setProducts(filtered.slice(0, 3));
        }
      } catch {
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRelated();
  }, [currentProductId, categoryId, categorySlug]);

  if (!isLoading && products.length === 0) {
    return null;
  }

  return (
    <section className={cn('container-beb space-y-6 py-12', className)}>
      <h2 className="font-serif text-2xl font-semibold text-[#10233e]">
        O&apos;xshash mahsulotlar
      </h2>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="space-y-3">
              <Skeleton className="aspect-[3/4] w-full rounded-lg" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {products.map((product) => (
            <div key={product.id}>
              <ProductCard product={product} variant="simple" />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

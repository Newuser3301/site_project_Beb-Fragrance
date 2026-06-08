'use client';

import { useEffect, useState, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  ProductCard,
  type ProductCardProduct,
} from '@/components/product/ProductCard';
import { Button } from '@/components/ui/Button';
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
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchRelated = async () => {
      setIsLoading(true);
      try {
        const categoryParam = categorySlug ?? categoryId;
        const response = await fetch(
          `/api/products?category=${encodeURIComponent(categoryParam)}&limit=5&exclude=${encodeURIComponent(currentProductId)}`
        );
        if (response.ok) {
          const data = await response.json();
          const filtered = (data.items ?? []).filter(
            (item: ProductCardProduct) => item.id !== currentProductId
          );
          setProducts(filtered.slice(0, 4));
        }
      } catch {
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRelated();
  }, [currentProductId, categoryId, categorySlug]);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const scrollAmount = 300;
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  if (!isLoading && products.length === 0) {
    return null;
  }

  return (
    <section className={cn('space-y-6', className)}>
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-2xl font-semibold text-foreground">
          You May Also Like
        </h2>
        <div className="hidden gap-2 sm:flex">
          <Button
            variant="outline"
            size="icon"
            onClick={() => scroll('left')}
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => scroll('right')}
            aria-label="Scroll right"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="space-y-3">
              <Skeleton className="aspect-[3/4] w-full rounded-lg" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      ) : (
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory"
        >
          {products.map((product) => (
            <div
              key={product.id}
              className="w-[240px] shrink-0 snap-start sm:w-[260px]"
            >
              <ProductCard product={product} variant="simple" />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

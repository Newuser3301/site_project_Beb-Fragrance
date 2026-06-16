'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
  variant?: 'default' | 'inline';
}

export function RelatedProducts({
  currentProductId,
  categoryId,
  categorySlug,
  className,
  variant = 'default',
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

  const formatUzPrice = (val: number) => {
    return val >= 1000
      ? val.toLocaleString('en-US') + " so'm"
      : (val * 1000).toLocaleString('en-US') + " so'm";
  };

  const getPrimaryImage = (images: any[]): string => {
    if (!images || images.length === 0) return '/placeholder-product.jpg';
    const first = images[0];
    if (typeof first === 'string') return first;
    return first.url || '/placeholder-product.jpg';
  };

  if (variant === 'inline') {
    return (
      <div className={cn('mt-8 pt-8 border-t border-gray-100 space-y-5', className)}>
        <h3 className="font-bold text-lg text-[#10233e]">
          O&apos;xshash mahsulotlar
        </h3>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="space-y-3 bg-white border border-gray-100 rounded-[12px] p-3">
                <Skeleton className="aspect-square w-full rounded-lg" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {products.map((prod) => {
              const imgUrl = getPrimaryImage(prod.images);
              const discountPercent = prod.comparePrice && prod.comparePrice > prod.price
                ? Math.round(((prod.comparePrice - prod.price) / prod.comparePrice) * 100)
                : 0;
              const badgeLabel = prod.isNewArrival
                ? 'YANGI'
                : prod.isBestseller
                  ? 'HIT'
                  : discountPercent > 0
                    ? `-${discountPercent}%`
                    : 'SALE';
              const ratingVal = prod.averageRating ?? 4.8;

              return (
                <Link
                  key={prod.id}
                  href={`/products/${prod.slug}`}
                  className="group bg-white border border-gray-200 rounded-[12px] overflow-hidden p-3 flex flex-col justify-between hover:shadow-md hover:border-blue-200 transition-all duration-200"
                >
                  <div className="relative aspect-square w-full rounded-lg bg-[#f8fbff] overflow-hidden mb-3">
                    <Image
                      src={imgUrl}
                      alt={prod.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="150px"
                    />
                  </div>
                  <div className="space-y-1.5 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                        {prod.name}
                      </h4>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="text-amber-500 text-xs font-bold flex items-center gap-0.5">
                          ⭐ {ratingVal.toFixed(1)}
                        </span>
                        <span className="text-[9px] bg-slate-900 text-white px-1.5 py-0.5 rounded font-semibold uppercase tracking-wider">
                          {badgeLabel}
                        </span>
                      </div>
                    </div>
                    <div className="text-sm font-bold text-gray-900 mt-2">
                      {formatUzPrice(prod.price)}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    );
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

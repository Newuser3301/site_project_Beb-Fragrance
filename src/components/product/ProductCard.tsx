'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, Info, Star } from 'lucide-react';
import { AddToCartButton } from '@/components/product/AddToCartButton';
import { useWishlistStore } from '@/store/useWishlistStore';
import { formatPrice, cn } from '@/lib/utils';

export type ProductCardProduct = {
  id: string;
  name: string;
  slug: string;
  price: number;
  comparePrice?: number | null;
  stock: number;
  images: Array<{ url: string; alt?: string | null } | string>;
  brand?: string;
  gender?: string;
  fragranceFamily?: string | null;
  isFeatured?: boolean;
  isNewArrival?: boolean;
  isBestseller?: boolean;
  averageRating?: number;
  reviewCount?: number;
};

export interface ProductCardProps {
  product: ProductCardProduct;
  variant?: 'default' | 'simple';
  className?: string;
}

function getPrimaryImage(images: ProductCardProduct['images']): string {
  if (images.length === 0) return '/placeholder-product.jpg';
  const first = images[0];
  if (typeof first === 'string') return first;
  return first.url || '/placeholder-product.jpg';
}

function getDiscountPercent(price: number, comparePrice?: number | null): number {
  if (!comparePrice || comparePrice <= 0 || price >= comparePrice) return 0;
  return Math.round(((comparePrice - price) / comparePrice) * 100);
}

function getBadgeLabel(product: ProductCardProduct, discountPercent: number) {
  if (product.isNewArrival) return 'NEW';
  if (discountPercent > 0) return 'SALE';
  if (product.isBestseller) return 'HOT';
  if (product.isFeatured) return 'PREMIUM';
  return 'PREMIUM';
}

export function ProductCard({ product, className }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { addItem, removeItem, isInWishlist } = useWishlistStore();
  const inWishlist = isInWishlist(product.id);

  const primaryImage = getPrimaryImage(product.images);
  const isOutOfStock = product.stock <= 0;
  const discountPercent = getDiscountPercent(product.price, product.comparePrice);
  const ratingValue = product.averageRating ?? 4.8;
  const badgeLabel = getBadgeLabel(product, discountPercent);

  const formatUzPrice = (val: number) => {
    return val >= 1000
      ? val.toLocaleString('en-US') + " so'm"
      : (val * 12800).toLocaleString('en-US') + " so'm";
  };

  const toggleWishlist = () => {
    if (inWishlist) {
      removeItem(product.id);
    } else {
      addItem(product.id, product.name, primaryImage, product.price);
    }
  };

  return (
    <article
      className={cn('group relative', className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={cn(
          'overflow-hidden rounded-[26px] border border-[rgba(13,28,48,0.08)] bg-white shadow-[0_16px_35px_rgba(38,61,99,0.08)] transition-all duration-300',
          isHovered && '-translate-y-1 shadow-[0_24px_50px_rgba(38,61,99,0.14)]'
        )}
      >
        <div className="relative aspect-[1.05/1] overflow-hidden bg-[#f8fbff]">
          <Link href={`/products/${product.slug}`} className="absolute inset-0 z-[1]">
            <span className="sr-only">{product.name}</span>
          </Link>
          <Image
            src={primaryImage}
            alt={product.name}
            fill
            className={cn('object-cover transition-transform duration-500', isHovered && 'scale-105')}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />

          <span className="absolute left-4 top-4 z-[2] rounded-full bg-[#1e293b] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-white">
            {badgeLabel}
          </span>

          <button
            type="button"
            onClick={toggleWishlist}
            className="absolute right-4 top-4 z-[2] flex h-10 w-10 items-center justify-center rounded-full border border-white/60 bg-white/90 transition-all hover:scale-110"
            aria-label={inWishlist ? "Sevimlilardan olib tashlash" : "Sevimlilarga qo'shish"}
          >
            <Heart
              className={cn(
                'h-4 w-4 transition-all',
                inWishlist ? 'fill-[#ec4899] text-[#ec4899]' : 'text-[#ec4899]'
              )}
            />
          </button>

          {isOutOfStock && (
            <div className="absolute inset-0 z-[2] flex items-center justify-center bg-slate-900/30">
              <span className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900">
                Sotuvda yo&apos;q
              </span>
            </div>
          )}
        </div>

        <div className="space-y-3 px-4 pb-5 pt-4">
          <Link href={`/products/${product.slug}`} className="block">
            <h3 className="line-clamp-2 text-lg font-bold text-[#10233e] transition-colors hover:text-[#1d4ed8]">
              {product.name}
            </h3>
          </Link>

          <div className="flex items-center justify-between gap-3 text-sm">
            <div className="flex items-center gap-1 text-[#f59e0b]">
              <Star className="h-4 w-4 fill-current" />
              <span className="font-medium text-[#10233e]">{ratingValue.toFixed(1)}</span>
            </div>
            <span className="text-[#60738f]">Bor: {product.stock} ta</span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-[#10233e]">
              {formatUzPrice(product.price)}
            </span>
            {product.comparePrice && product.comparePrice > product.price ? (
              <span className="text-sm text-[#8a9ab0] line-through">
                {formatUzPrice(product.comparePrice)}
              </span>
            ) : null}
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <Link
              href={`/products/${product.slug}`}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#c7d8f9] px-4 py-3 text-sm font-semibold text-[#163050] transition-colors hover:border-[#93c5fd] hover:bg-[#f8fbff]"
            >
              <Info className="h-4 w-4" />
              Batafsil
            </Link>
            <AddToCartButton
              product={{
                id: product.id,
                name: product.name,
                price: product.price,
                image: primaryImage,
                volume: '100ml',
                brand: product.brand ?? 'Beb Fragrance',
                stock: product.stock,
              }}
              className="w-full"
            />
          </div>
        </div>
      </div>
    </article>
  );
}

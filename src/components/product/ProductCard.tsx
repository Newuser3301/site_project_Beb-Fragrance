'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, Star } from 'lucide-react';
import { useTranslations } from 'next-intl';
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

export function ProductCard({
  product,
  className,
}: ProductCardProps) {
  const t = useTranslations('productCard');
  const [isHovered, setIsHovered] = useState(false);
  const { addItem, removeItem, isInWishlist } = useWishlistStore();
  const inWishlist = isInWishlist(product.id);

  const primaryImage = getPrimaryImage(product.images);
  const isOutOfStock = product.stock <= 0;
  const discountPercent = getDiscountPercent(product.price, product.comparePrice);
  const isNew = product.isNewArrival;
  const isBestseller = product.isBestseller || product.isFeatured;

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
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
      <Link href={`/products/${product.slug}`} className="block">
        <div
          className={cn(
            'overflow-hidden rounded-[24px] border border-[rgba(106,53,83,0.08)] bg-white shadow-[0_16px_35px_rgba(81,42,63,0.05)] transition-all duration-300',
            isHovered && '-translate-y-1 shadow-[0_22px_45px_rgba(81,42,63,0.1)]'
          )}
        >
          <div className="relative aspect-[0.92/1] overflow-hidden bg-[#fcf1f4]">
            <div className="absolute inset-x-8 bottom-4 top-8 rounded-[22px] bg-gradient-to-b from-white/95 to-[#f7e1e8]" />
            <Image
              src={primaryImage}
              alt={product.name}
              fill
              className={cn(
                'object-contain p-8 transition-transform duration-500',
                isHovered && 'scale-105'
              )}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />

            {isOutOfStock && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                <span className="rounded-full bg-white px-4 py-2 text-sm font-semibold uppercase tracking-wider text-[#1A1A1A]">
                  {t('soldOut')}
                </span>
              </div>
            )}

            {isBestseller && (
              <span className="absolute left-4 top-4 rounded-full bg-[#6d415c] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white">
                {t('best')}
              </span>
            )}

            {isNew && !isBestseller && (
              <span className="absolute left-4 top-4 rounded-full bg-[#e88ba4] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white">
                {t('new')}
              </span>
            )}

            {discountPercent > 0 && (
              <span className="absolute left-4 top-4 rounded-full bg-[#55324b] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white">
                -{discountPercent}%
              </span>
            )}

            <button
              type="button"
              onClick={toggleWishlist}
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-[rgba(106,53,83,0.08)] bg-white/90 transition-all hover:scale-110"
              aria-label={inWishlist ? t('removeWishlist') : t('addWishlist')}
            >
              <Heart
                className={cn(
                  'h-4 w-4 transition-all',
                  inWishlist
                    ? 'fill-[#E8354A] text-[#E8354A]'
                    : 'text-[#6d415c]'
                )}
              />
            </button>
          </div>

          <div className="space-y-2 px-4 pb-5 pt-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8c6d7d]">
              {product.brand || product.gender || t('luxury')}
            </p>
            <h3 className="line-clamp-1 font-serif text-lg font-semibold text-[#2f1d28]">
              {product.name}
            </h3>
            <div className="flex items-center gap-1 text-[#d18aa0]">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star
                  key={index}
                  className={cn(
                    'h-3.5 w-3.5',
                    index < Math.round(product.averageRating ?? 4)
                      ? 'fill-current'
                      : 'fill-transparent opacity-35'
                  )}
                />
              ))}
            </div>
            <div className="flex items-baseline gap-2 pt-1">
              <span className="text-base font-semibold text-[#2f1d28]">
                {formatPrice(product.price, 'USD', 'en-US')}
              </span>
              {product.comparePrice && product.comparePrice > product.price ? (
                <span className="text-sm text-[#a58b98] line-through">
                  {formatPrice(product.comparePrice, 'USD', 'en-US')}
                </span>
              ) : null}
            </div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-[#8c6d7d]">
              {product.fragranceFamily || t('luxuryPerfume')}
            </p>
          </div>
        </div>
      </Link>
    </article>
  );
}

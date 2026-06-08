'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, ArrowRight } from 'lucide-react';
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

// 6 gradient styles for cards
const cardGradients = [
  'linear-gradient(135deg, #1B3A6B 0%, #0D1F3C 100%)',
  'linear-gradient(135deg, #1A1A1A 0%, #2D2D2D 100%)',
  'linear-gradient(135deg, #C68B2A 0%, #8B5E1A 100%)',
  'linear-gradient(135deg, #4A1A6B 0%, #2D0D4A 100%)',
  'linear-gradient(135deg, #C4185A 0%, #8B0D3A 100%)',
  'linear-gradient(135deg, #0D4A4A 0%, #1A2D2D 100%)',
];

function getCardGradient(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  return cardGradients[Math.abs(hash) % cardGradients.length];
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
  variant = 'default',
  className,
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { addItem, removeItem, isInWishlist } = useWishlistStore();
  const inWishlist = isInWishlist(product.id);

  const primaryImage = getPrimaryImage(product.images);
  const isOutOfStock = product.stock <= 0;
  const discountPercent = getDiscountPercent(product.price, product.comparePrice);
  const gradient = getCardGradient(product.id);
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

  // SCENTORA card style
  const nameColor = 'text-white';
  const notesColor = 'text-[rgba(255,255,255,0.65)]';

  return (
    <article
      className={cn('group relative', className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ borderRadius: '16px', overflow: 'hidden' }}
    >
      <Link href={`/products/${product.slug}`} className="block">
        <div
          style={{
            background: gradient,
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          }}
          className={cn(
            isHovered && 'translate-y-[-4px]',
          )}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = '0 16px 48px rgba(0,0,0,0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.12)';
          }}
        >
          {/* Image area - top ~65% */}
          <div className="relative" style={{ aspectRatio: '3/4' }}>
            <Image
              src={primaryImage}
              alt={product.name}
              fill
              className={cn(
                'object-cover transition-transform duration-500',
                isHovered && 'scale-105'
              )}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />

            {isOutOfStock && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <span className="rounded-full bg-white px-4 py-2 text-sm font-semibold uppercase tracking-wider text-[#1A1A1A]">
                  Sold Out
                </span>
              </div>
            )}

            {/* HOT Badge - SCENTORA style */}
            {isBestseller && (
              <span
                className="absolute left-3 top-3 rounded bg-[#E8354A] px-2 py-0.5 text-[10px] font-bold uppercase text-white"
                style={{ letterSpacing: '0.08em' }}
              >
                Hot
              </span>
            )}

            {/* NEW Badge */}
            {isNew && !isBestseller && (
              <span
                className="absolute left-3 top-3 rounded bg-[#D4A843] px-2 py-0.5 text-[10px] font-bold uppercase text-white"
                style={{ letterSpacing: '0.08em' }}
              >
                New
              </span>
            )}

            {/* Discount Badge */}
            {discountPercent > 0 && (
              <span
                className="absolute left-3 top-3 rounded bg-[#E8354A] px-2 py-0.5 text-[10px] font-bold uppercase text-white"
                style={{ letterSpacing: '0.08em' }}
              >
                -{discountPercent}%
              </span>
            )}

            {/* Wishlist icon - SCENTORA style */}
            <button
              type="button"
              onClick={toggleWishlist}
              className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-[8px] transition-all hover:scale-110"
              style={{ background: 'rgba(255,255,255,0.15)' }}
              aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <Heart
                className={cn(
                  'h-4 w-4 transition-all',
                  inWishlist
                    ? 'fill-[#E8354A] text-[#E8354A]'
                    : 'text-white'
                )}
              />
            </button>
          </div>

          {/* Info area - bottom ~35% */}
          <div className="px-3.5 pb-2 pt-2.5">
            <p className="text-[11px] text-[rgba(255,255,255,0.7)]">
              {product.brand || (product.gender ? `${product.gender}` : 'Luxury')}
            </p>
            <h3 className="mt-0.5 line-clamp-1 text-sm font-semibold text-white">
              {product.name}
            </h3>
            {product.fragranceFamily && (
              <p className="mt-0.5 text-[11px] text-[rgba(255,255,255,0.65)]">
                {product.fragranceFamily} · Premium
              </p>
            )}
          </div>

          {/* Buy Now button - SCENTORA style */}
          <div
            className="mx-3 mb-3 flex items-center justify-between rounded-lg px-3 py-2 text-[13px]"
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              backdropFilter: 'blur(4px)',
            }}
            onClick={(e) => e.preventDefault()}
          >
            <span className="font-bold text-white">
              {formatPrice(product.price, 'USD', 'en-US')}
              {product.comparePrice && product.comparePrice > product.price && (
                <span className="ml-1.5 text-[11px] text-[rgba(255,255,255,0.5)] line-through">
                  {formatPrice(product.comparePrice, 'USD', 'en-US')}
                </span>
              )}
            </span>
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-[#1A1A1A]">
              <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}

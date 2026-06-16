'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Expand,
  Heart,
  Share2,
  ShieldCheck,
  ShoppingCart,
  Star,
  Timer,
  Truck,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { ProductReviews } from '@/components/product/ProductReviews';
import { AddToCartButton } from '@/components/product/AddToCartButton';
import { ProductStructuredData } from '@/components/product/ProductStructuredData';
import { useWishlistStore } from '@/store/useWishlistStore';
import {
  calculateDiscountPercent,
  type ProductDisplay,
} from '@/lib/product-helpers';
import { formatPrice, cn } from '@/lib/utils';
import type { ReviewWithUser } from '@/types';

export type ProductDetailsProduct = ProductDisplay & {
  averageRating?: number;
  reviewCount?: number;
  reviews?: ReviewWithUser[];
};

export interface ProductDetailsProps {
  product: ProductDetailsProduct;
  className?: string;
}

export function ProductDetails({ product, className }: ProductDetailsProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const { addItem, removeItem, isInWishlist } = useWishlistStore();
  const inWishlist = isInWishlist(product.id);

  const primaryImage = product.images[0] ?? '';
  const activeImage = product.images[activeImageIndex] ?? primaryImage;
  const volumeLabel = product.variants[0]?.size ?? `${product.volume}ml`;
  const isOutOfStock = product.stock <= 0;
  const discountPercent = calculateDiscountPercent(
    product.price,
    product.comparePrice
  );
  const ratingValue = product.averageRating ?? 4.8;
  const reviewCount = product.reviewCount ?? product.reviews?.length ?? 0;
  const badgeLabel = product.isNewArrival
    ? 'NEW'
    : product.isBestseller
      ? 'HOT'
      : discountPercent > 0
        ? 'SALE'
        : 'PREMIUM';

  const toggleWishlist = () => {
    if (inWishlist) {
      removeItem(product.id);
    } else {
      addItem(product.id, product.name, primaryImage, product.price);
    }
  };

  const openFullscreen = () => {
    window.open(activeImage, '_blank', 'noopener,noreferrer');
  };

  const shareProduct = async () => {
    const shareUrl = window.location.href;

    try {
      if (navigator.share) {
        await navigator.share({
          title: product.name,
          text: product.shortDescription ?? product.description,
          url: shareUrl,
        });
        return;
      }

      await navigator.clipboard.writeText(shareUrl);
    } catch {}
  };

  return (
    <div className={cn('space-y-10', className)}>
      <ProductStructuredData product={product} />

      <div className="grid gap-10 xl:grid-cols-[minmax(0,1.05fr)_420px]">
        <div className="space-y-6">
          <div className="rounded-[30px] border border-[rgba(13,28,48,0.08)] bg-white p-5 shadow-[0_20px_50px_rgba(38,61,99,0.08)]">
            <div className="relative overflow-hidden rounded-[24px] bg-[#f7fbff]">
              <div className="absolute right-4 top-4 z-10 flex items-center gap-2">
                <button
                  type="button"
                  onClick={openFullscreen}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/92 text-[#17355d] shadow-sm"
                  aria-label="To'liq ekran"
                >
                  <Expand className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={shareProduct}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/92 text-[#17355d] shadow-sm"
                  aria-label="Ulashish"
                >
                  <Share2 className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={toggleWishlist}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/92 text-[#17355d] shadow-sm"
                  aria-label="Sevimlilar"
                >
                  <Heart className={cn('h-4 w-4', inWishlist && 'fill-[#ec4899] text-[#ec4899]')} />
                </button>
              </div>

              <div className="relative aspect-square">
                <Image
                  src={activeImage}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1200px) 100vw, 60vw"
                />
              </div>
            </div>

            <div className="mt-4 grid grid-cols-4 gap-3">
              {(product.images.length > 0
                ? product.images
                : [primaryImage, primaryImage, primaryImage, primaryImage]
              )
                .slice(0, 4)
                .map((image, index) => (
                  <button
                    key={`${image}-${index}`}
                    type="button"
                    onClick={() => setActiveImageIndex(index)}
                    className={cn(
                      'relative aspect-square overflow-hidden rounded-2xl border-2 bg-[#f7fbff]',
                      index === activeImageIndex ? 'border-[#3B82F6]' : 'border-transparent'
                    )}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="120px"
                    />
                  </button>
                ))}
            </div>
          </div>

          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-4 rounded-2xl bg-[#f4f8ff] p-1">
              <TabsTrigger value="description" className="rounded-xl data-[state=active]:bg-white">
                Tavsif
              </TabsTrigger>
              <TabsTrigger value="specs" className="rounded-xl data-[state=active]:bg-white">
                Specs
              </TabsTrigger>
              <TabsTrigger value="reviews" className="rounded-xl data-[state=active]:bg-white">
                Sharhlar
              </TabsTrigger>
              <TabsTrigger value="delivery" className="rounded-xl data-[state=active]:bg-white">
                Yetkazish
              </TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="mt-5 rounded-[24px] border border-[rgba(13,28,48,0.08)] bg-white p-5 text-sm leading-7 text-[#53657f]">
              {product.shortDescription ?? product.description}
            </TabsContent>
            <TabsContent value="specs" className="mt-5 rounded-[24px] border border-[rgba(13,28,48,0.08)] bg-white p-5">
              <div className="grid gap-3 text-sm text-[#53657f] sm:grid-cols-2">
                <div><span className="font-semibold text-[#10233e]">Brend:</span> {product.brand}</div>
                <div><span className="font-semibold text-[#10233e]">Hajm:</span> {volumeLabel}</div>
                <div><span className="font-semibold text-[#10233e]">Kategoriya:</span> {product.category.name}</div>
                <div><span className="font-semibold text-[#10233e]">SKU:</span> {product.sku}</div>
              </div>
            </TabsContent>
            <TabsContent value="reviews" className="mt-5">
              <ProductReviews
                productId={product.id}
                initialReviews={product.reviews}
              />
            </TabsContent>
            <TabsContent value="delivery" className="mt-5 rounded-[24px] border border-[rgba(13,28,48,0.08)] bg-white p-5 text-sm leading-7 text-[#53657f]">
              Toshkent bo&apos;ylab 24-48 soat ichida tez yetkazib beriladi. Hududlarga buyurtmalar ham ishonchli qadoqlash bilan yuboriladi.
            </TabsContent>
          </Tabs>

          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { title: 'Kafolat', text: 'Original mahsulot' },
              { title: 'Yetkazish', text: '24-48 soat' },
              { title: 'Sifat', text: 'Premium tanlov' },
              { title: 'Reyting', text: `${ratingValue.toFixed(1)} / 5` },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-[22px] border border-[rgba(13,28,48,0.08)] bg-white p-4"
              >
                <p className="text-sm font-semibold text-[#10233e]">{item.title}</p>
                <p className="mt-1 text-sm text-[#60738f]">{item.text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <nav className="text-sm text-[#60738f]">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link href="/" className="transition-colors hover:text-[#2563EB]">
                  Bosh sahifa
                </Link>
              </li>
              <li>&gt;</li>
              <li>
                <Link href="/products" className="transition-colors hover:text-[#2563EB]">
                  Katalog
                </Link>
              </li>
              <li>&gt;</li>
              <li>
                <Link href={`/categories/${product.category.slug}`} className="transition-colors hover:text-[#2563EB]">
                  {product.category.name}
                </Link>
              </li>
              <li>&gt;</li>
              <li className="font-medium text-[#10233e]">{product.name}</li>
            </ol>
          </nav>

          <div className="rounded-[30px] border border-[rgba(13,28,48,0.08)] bg-white p-6 shadow-[0_20px_50px_rgba(38,61,99,0.08)]">
            <div className="flex items-center justify-between gap-3">
              <span className="rounded-full bg-[#111827] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-white">
                {badgeLabel}
              </span>
              <span className="text-sm text-[#60738f]"># ID: {product.id.slice(-1)}</span>
            </div>

            <h1 className="mt-4 text-3xl font-bold tracking-tight text-[#10233e] md:text-4xl">
              {product.name}
            </h1>

            <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
              <div className="flex items-center gap-1 text-[#f59e0b]">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star
                    key={index}
                    className={cn(
                      'h-4 w-4',
                      index < Math.round(ratingValue) ? 'fill-current' : 'opacity-30'
                    )}
                  />
                ))}
                <span className="ml-1 text-[#10233e]">{reviewCount} sharh</span>
              </div>
              <span className={cn(
                'rounded-full px-3 py-1 font-medium',
                isOutOfStock ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'
              )}>
                {isOutOfStock ? "Sotuvda yo'q" : `Bor: ${product.stock} ta`}
              </span>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <span className="text-4xl font-bold text-[#10233e]">
                {formatPrice(product.price, 'USD', 'en-US').replace('US$', '$')}
              </span>
              {product.comparePrice && product.comparePrice > product.price ? (
                <span className="text-xl text-[#8a9ab0] line-through">
                  {formatPrice(product.comparePrice, 'USD', 'en-US').replace('US$', '$')}
                </span>
              ) : null}
              {discountPercent > 0 && (
                <span className="rounded-full bg-pink-50 px-3 py-1 text-sm font-semibold text-pink-600">
                  -{discountPercent}%
                </span>
              )}
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <AddToCartButton
                product={{
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  image: primaryImage,
                  volume: volumeLabel,
                  brand: product.brand,
                  stock: product.stock,
                }}
                className="w-full"
              />
              <Button
                variant="outline"
                className="h-11 rounded-2xl border-[#c7d8f9] text-[#163050]"
                asChild
              >
                <Link href="/cart">
                  <ShoppingCart className="h-4 w-4" />
                  Savatni ko&apos;rish
                </Link>
              </Button>
            </div>

            <div className="mt-6 rounded-[24px] border border-[rgba(13,28,48,0.08)] bg-[#f8fbff] p-4">
              <div className="flex flex-col gap-4 text-sm text-[#53657f]">
                <div className="flex items-start gap-3">
                  <Truck className="mt-0.5 h-4 w-4 text-[#3B82F6]" />
                  <p>
                    <span className="font-semibold text-[#10233e]">Tez yetkazish</span> - 24-48 soat (Toshkent)
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <ShieldCheck className="mt-0.5 h-4 w-4 text-[#3B82F6]" />
                  <p>
                    <span className="font-semibold text-[#10233e]">Original</span> - BEB Fragrance kafolati
                  </p>
                </div>
              </div>
            </div>

            <Button
              variant="outline"
              className="mt-4 h-11 w-full rounded-2xl border-[#c7d8f9] text-[#163050]"
            >
              <Timer className="h-4 w-4" />
              Yetkazish haqida batafsil
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

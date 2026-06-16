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
  Award,
  Droplet,
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
import { RelatedProducts } from '@/components/product/RelatedProducts';
import { useWishlistStore } from '@/store/useWishlistStore';
import {
  calculateDiscountPercent,
  type ProductDisplay,
} from '@/lib/product-helpers';
import { cn } from '@/lib/utils';
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

  const mainBadge = discountPercent > 0
    ? `-${discountPercent}%`
    : product.isNewArrival
      ? 'YANGI'
      : product.isBestseller
        ? 'HIT'
        : 'YANGI';

  const toggleWishlist = () => {
    if (inWishlist) {
      removeItem(product.id);
    } else {
      addItem(product.id, product.name, primaryImage, product.price);
    }
  };

  const openFullscreen = () => {
    if (activeImage) {
      window.open(activeImage, '_blank', 'noopener,noreferrer');
    }
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

  const formatUzPrice = (val: number) => {
    return val >= 1000
      ? val.toLocaleString('en-US') + " so'm"
      : (val * 1000).toLocaleString('en-US') + " so'm";
  };

  const dynamicVolumeLabel = product.variants && product.variants.length > 0
    ? product.variants.map(v => v.size).join(' / ')
    : `${product.volume}ml`;

  return (
    <div className={cn('space-y-10', className)}>
      <ProductStructuredData product={product} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left Column */}
        <div className="lg:col-span-7 space-y-6">
          {/* Large main product image (full width, rounded card, white bg) */}
          <div className="relative overflow-hidden rounded-[12px] border border-gray-200 bg-white p-5 shadow-sm">
            <div className="relative overflow-hidden rounded-[8px] bg-[#f7fbff] aspect-square">
              {/* Top-left: badge pill */}
              {mainBadge && (
                <span className="absolute left-4 top-4 z-10 rounded-full bg-slate-900 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wider text-white shadow-sm">
                  {mainBadge}
                </span>
              )}

              {/* Top-right icons: fullscreen ⛶, share ⤴, wishlist ♡ (pink) */}
              <div className="absolute right-4 top-4 z-10 flex items-center gap-2">
                <button
                  type="button"
                  onClick={openFullscreen}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white border border-gray-100 text-slate-700 shadow-sm hover:scale-105 active:scale-95 transition-all"
                  aria-label="To'liq ekran"
                >
                  <span className="text-sm font-bold">⛶</span>
                </button>
                <button
                  type="button"
                  onClick={shareProduct}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white border border-gray-100 text-slate-700 shadow-sm hover:scale-105 active:scale-95 transition-all"
                  aria-label="Ulashish"
                >
                  <span className="text-sm font-bold">⤴</span>
                </button>
                <button
                  type="button"
                  onClick={toggleWishlist}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white border border-gray-100 text-[#ec4899] shadow-sm hover:scale-105 active:scale-95 transition-all"
                  aria-label="Sevimlilar"
                >
                  <Heart className={cn('h-4.5 w-4.5 text-[#ec4899]', inWishlist && 'fill-[#ec4899]')} />
                </button>
              </div>

              <Image
                src={activeImage || '/placeholder-product.jpg'}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 1200px) 100vw, 60vw"
                priority
              />
            </div>

            {/* Below image: 4 thumbnail images in a horizontal strip, first one active/selected with border */}
            <div className="mt-4 grid grid-cols-4 gap-3">
              {(product.images.length > 0
                ? product.images
                : [primaryImage, primaryImage, primaryImage, primaryImage]
              )
                .slice(0, 4)
                .map((image, index) => {
                  const imgUrl = image;
                  return (
                    <button
                      key={`${imgUrl}-${index}`}
                      type="button"
                      onClick={() => setActiveImageIndex(index)}
                      className={cn(
                        'relative aspect-square overflow-hidden rounded-lg border-2 bg-[#f7fbff] transition-all',
                        index === activeImageIndex ? 'border-[#2563eb]' : 'border-transparent hover:border-gray-200'
                      )}
                    >
                      <Image
                        src={imgUrl}
                        alt={`${product.name} ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="120px"
                      />
                    </button>
                  );
                })}
            </div>
          </div>

          {/* Tab bar with 4 tabs: Tavsif | Specs | Sharhlar | Yetkazish */}
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-4 rounded-xl bg-gray-100 p-1">
              <TabsTrigger value="description" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm text-sm font-semibold">
                Tavsif
              </TabsTrigger>
              <TabsTrigger value="specs" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm text-sm font-semibold">
                Specs
              </TabsTrigger>
              <TabsTrigger value="reviews" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm text-sm font-semibold">
                Sharhlar
              </TabsTrigger>
              <TabsTrigger value="delivery" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm text-sm font-semibold">
                Yetkazish
              </TabsTrigger>
            </TabsList>

            {/* Active tab content box (rounded border: radius 12px, border-gray-200, bg-white) */}
            <TabsContent
              value="description"
              className="mt-5 rounded-[12px] border border-gray-200 bg-white p-5 text-sm leading-7 text-gray-600 shadow-sm"
            >
              <h3 className="text-base font-bold text-gray-900 mb-2">Qisqacha tavsif ✨</h3>
              <p className="font-semibold text-gray-800 mb-5">
                {product.shortDescription ?? product.description}
              </p>

              {/* 2×2 info grid inside same box */}
              <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-5 mt-4">
                {/* Cell 1: Brendi — Original sertifikat */}
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-purple-50 border border-purple-100">
                    <Award className="h-4.5 w-4.5 text-purple-600" />
                  </div>
                  <div>
                    <span className="block text-[11px] uppercase tracking-wider font-semibold text-gray-400">Brendi</span>
                    <span className="block text-xs sm:text-sm font-bold text-gray-900">Original sertifikat</span>
                  </div>
                </div>

                {/* Cell 2: Yetkazish — 24–48 soat (Toshkent) */}
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 border border-blue-100">
                    <Truck className="h-4.5 w-4.5 text-blue-600" />
                  </div>
                  <div>
                    <span className="block text-[11px] uppercase tracking-wider font-semibold text-gray-400">Yetkazish</span>
                    <span className="block text-xs sm:text-sm font-bold text-gray-900">24–48 soat (Toshkent)</span>
                  </div>
                </div>

                {/* Cell 3: Hajmi — dynamically mapped size(s) */}
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-pink-50 border border-pink-100">
                    <Droplet className="h-4.5 w-4.5 text-pink-600" />
                  </div>
                  <div>
                    <span className="block text-[11px] uppercase tracking-wider font-semibold text-gray-400">Hajmi</span>
                    <span className="block text-xs sm:text-sm font-bold text-gray-900">{dynamicVolumeLabel}</span>
                  </div>
                </div>

                {/* Cell 4: Reyting — rating value / 5.0 */}
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-50 border border-amber-100">
                    <Star className="h-4.5 w-4.5 text-amber-500 fill-current" />
                  </div>
                  <div>
                    <span className="block text-[11px] uppercase tracking-wider font-semibold text-gray-400">Reyting</span>
                    <span className="block text-xs sm:text-sm font-bold text-gray-900">{ratingValue.toFixed(1)} / 5.0</span>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent
              value="specs"
              className="mt-5 rounded-[12px] border border-gray-200 bg-white p-5 text-sm leading-7 text-gray-600 shadow-sm"
            >
              <div className="grid gap-3 sm:grid-cols-2">
                <div><span className="font-semibold text-gray-900">Brend:</span> {product.brand}</div>
                <div><span className="font-semibold text-gray-900">Hajm:</span> {volumeLabel}</div>
                <div><span className="font-semibold text-gray-900">Kategoriya:</span> {product.category.name}</div>
                <div><span className="font-semibold text-gray-900">SKU:</span> {product.sku}</div>
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="mt-5">
              <ProductReviews
                productId={product.id}
                initialReviews={product.reviews}
              />
            </TabsContent>

            <TabsContent
              value="delivery"
              className="mt-5 rounded-[12px] border border-gray-200 bg-white p-5 text-sm leading-7 text-gray-600 shadow-sm"
            >
              Toshkent bo&apos;ylab 24–48 soat ichida tez yetkazib beriladi. Hududlarga buyurtmalar ham ishonchli qadoqlash bilan yuboriladi.
            </TabsContent>
          </Tabs>

          {/* O'xshash mahsulotlar section below inside the left column */}
          <RelatedProducts
            currentProductId={product.id}
            categoryId={product.categoryId}
            categorySlug={product.category.slug}
            variant="inline"
          />
        </div>

        {/* Right Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-[12px] border border-gray-200 bg-white p-6 shadow-sm">
            {/* Breadcrumb: Bosh sahifa › Katalog › [Category] › [Product name] */}
            <nav className="text-xs sm:text-sm text-[#60738f] mb-4">
              <ol className="flex flex-wrap items-center gap-1.5">
                <li>
                  <Link href="/" className="transition-colors hover:text-[#2563EB]">
                    Bosh sahifa
                  </Link>
                </li>
                <li className="text-gray-400">›</li>
                <li>
                  <Link href="/products" className="transition-colors hover:text-[#2563EB]">
                    Katalog
                  </Link>
                </li>
                <li className="text-gray-400">›</li>
                <li>
                  <Link href={`/categories/${product.category.slug}`} className="transition-colors hover:text-[#2563EB]">
                    {product.category.name}
                  </Link>
                </li>
                <li className="text-gray-400">›</li>
                <li className="font-semibold text-gray-900 truncate max-w-[150px]">{product.name}</li>
              </ol>
            </nav>

            {/* Product name (large, bold, h1) */}
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight">
              {product.name}
            </h1>

            {/* Two badge pills on one line: category tag (e.g. Floral) + # ID: 3 */}
            <div className="flex flex-wrap items-center gap-2 mt-3 mb-4">
              <span className="rounded-full bg-purple-50 px-3 py-0.5 text-xs font-semibold text-purple-700 border border-purple-100 uppercase tracking-wider">
                {product.fragranceFamily ? product.fragranceFamily.charAt(0) + product.fragranceFamily.slice(1).toLowerCase() : product.category.name}
              </span>
              <span className="rounded-full bg-gray-50 px-3 py-0.5 text-xs font-semibold text-gray-600 border border-gray-200">
                # ID: {product.id.slice(-1)}
              </span>
            </div>

            {/* Star rating row: stars + score + review count */}
            <div className="flex items-center gap-3 text-sm mt-3">
              <div className="flex items-center gap-1 text-amber-500">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star
                    key={index}
                    className={cn(
                      'h-4 w-4',
                      index < Math.round(ratingValue) ? 'fill-current text-amber-500' : 'text-gray-300'
                    )}
                  />
                ))}
                <span className="ml-1 font-bold text-gray-900">{ratingValue.toFixed(1)}</span>
              </div>
              <span className="text-gray-400">|</span>
              <span className="text-gray-600 font-medium">{reviewCount} ta sharh</span>
            </div>

            {/* Stock badge: ✅ Omborda bor: X ta */}
            <div className="mt-4">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                ✅ Omborda bor: {product.stock} ta
              </span>
            </div>

            {/* Price block */}
            <div className="mt-6 flex flex-wrap items-baseline gap-3">
              <span className="text-3xl font-extrabold text-gray-900">
                {formatUzPrice(product.price)}
              </span>
              {product.comparePrice && product.comparePrice > product.price ? (
                <>
                  <span className="text-lg text-gray-400 line-through">
                    {formatUzPrice(product.comparePrice)}
                  </span>
                  <span className="rounded-full bg-pink-50 border border-pink-100 px-2.5 py-0.5 text-xs font-semibold text-pink-600">
                    Tejaysiz: -{discountPercent}%
                  </span>
                </>
              ) : null}
            </div>

            {/* Two buttons full width side by side */}
            <div className="mt-6 grid grid-cols-2 gap-3">
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
                variant="blue"
                className="w-full"
              />
              <Button
                variant="outline"
                className="h-11 rounded-[12px] border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 flex items-center justify-center gap-1.5 w-full"
                asChild
              >
                <Link href="/cart">
                  <span className="text-base">🛒</span>
                  Savatni ko&apos;rish
                </Link>
              </Button>
            </div>

            {/* Delivery info row (2 cells with icons) */}
            <div className="mt-6 rounded-[12px] border border-gray-200 bg-gray-50 p-4">
              <div className="flex flex-col gap-3 text-sm text-gray-600">
                <div className="flex items-center gap-2.5">
                  <span className="text-lg">🚚</span>
                  <p>
                    <span className="font-semibold text-gray-900">Tez yetkazish</span> / 24–48 soat (Toshkent)
                  </p>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="text-lg">✳️</span>
                  <p>
                    <span className="font-semibold text-gray-900">Original</span> / Tech-House kafolati
                  </p>
                </div>
              </div>
            </div>

            {/* ⓘ Yetkazish haqida batafsil — outline button full width */}
            <Button
              variant="outline"
              className="mt-4 h-11 w-full rounded-[12px] border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 flex items-center justify-center gap-1.5"
              asChild
            >
              <Link href="/shipping">
                <span className="text-base font-bold">ⓘ</span>
                Yetkazish haqida batafsil
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

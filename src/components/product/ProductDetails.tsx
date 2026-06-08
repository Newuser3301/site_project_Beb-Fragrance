'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Heart, Minus, Plus, Droplets, Users } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Separator } from '@/components/ui/Separator';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { ProductGallery } from '@/components/product/ProductGallery';
import { ProductNotes } from '@/components/product/ProductNotes';
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

const genderLabels: Record<string, string> = {
  MEN: 'Men',
  WOMEN: 'Women',
  UNISEX: 'Unisex',
};

export function ProductDetails({ product, className }: ProductDetailsProps) {
  const [quantity, setQuantity] = useState(1);
  const { addItem, removeItem, isInWishlist } = useWishlistStore();
  const inWishlist = isInWishlist(product.id);

  const primaryImage = product.images[0] ?? '';
  const volumeLabel = product.variants[0]?.size ?? `${product.volume}ml`;
  const isOutOfStock = product.stock <= 0;
  const discountPercent = calculateDiscountPercent(
    product.price,
    product.comparePrice
  );

  const toggleWishlist = () => {
    if (inWishlist) {
      removeItem(product.id);
    } else {
      addItem(product.id, product.name, primaryImage, product.price);
    }
  };

  return (
    <div className={cn('space-y-10', className)}>
      <ProductStructuredData product={product} />

      <nav className="text-sm text-muted-foreground">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link href="/" className="transition-colors hover:text-gold-600">
              Home
            </Link>
          </li>
          <li>/</li>
          <li>
            <Link
              href={`/categories/${product.category.slug}`}
              className="transition-colors hover:text-gold-600"
            >
              {product.category.name}
            </Link>
          </li>
          <li>/</li>
          <li className="font-medium text-foreground">{product.name}</li>
        </ol>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        <ProductGallery images={product.images} productName={product.name} />

        <div className="space-y-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-gold-600">
              {product.brand}
            </p>
            <h1 className="mt-2 font-serif text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              {product.name}
            </h1>
          </div>

          <div className="flex flex-wrap items-baseline gap-3">
            <span className="font-serif text-3xl font-bold text-gold-600">
              {formatPrice(product.price, 'USD', 'en-US')}
            </span>
            {product.comparePrice && product.comparePrice > product.price && (
              <span className="text-xl text-muted-foreground line-through">
                {formatPrice(product.comparePrice, 'USD', 'en-US')}
              </span>
            )}
            {discountPercent > 0 && (
              <Badge variant="success">-{discountPercent}% OFF</Badge>
            )}
          </div>

          <ProductNotes
            notes={product.notes}
            notesDetailed={product.notesDetailed}
          />

          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4 text-gold-500" />
              <span>{genderLabels[product.gender] ?? product.gender}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Droplets className="h-4 w-4 text-gold-500" />
              <span>{volumeLabel}</span>
            </div>
            <Badge variant={isOutOfStock ? 'destructive' : 'success'}>
              {isOutOfStock ? 'Out of Stock' : 'In Stock'}
            </Badge>
          </div>

          <Separator />

          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">Quantity</span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={isOutOfStock}
                aria-label="Decrease quantity"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-10 text-center font-medium">{quantity}</span>
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9"
                onClick={() =>
                  setQuantity((q) => Math.min(product.stock || 99, q + 1))
                }
                disabled={isOutOfStock}
                aria-label="Increase quantity"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
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
              quantity={quantity}
              className="flex-1"
            />
            <Button
              variant="outline"
              className="gap-2"
              onClick={toggleWishlist}
            >
              <Heart
                className={cn(
                  'h-4 w-4',
                  inWishlist && 'fill-red-500 text-red-500'
                )}
              />
              {inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="description" className="w-full">
        <TabsList className="w-full justify-start border-b border-border bg-transparent p-0">
          <TabsTrigger
            value="description"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-gold-500 data-[state=active]:bg-transparent"
          >
            Description
          </TabsTrigger>
          <TabsTrigger
            value="notes"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-gold-500 data-[state=active]:bg-transparent"
          >
            Notes
          </TabsTrigger>
          <TabsTrigger
            value="reviews"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-gold-500 data-[state=active]:bg-transparent"
          >
            Reviews ({product.reviewCount ?? 0})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="description" className="mt-6">
          <div className="prose prose-neutral max-w-none">
            <p className="whitespace-pre-line leading-relaxed text-muted-foreground">
              {product.description}
            </p>
          </div>
        </TabsContent>

        <TabsContent value="notes" className="mt-6">
          <ProductNotes
            notes={product.notes}
            notesDetailed={product.notesDetailed}
          />
        </TabsContent>

        <TabsContent value="reviews" className="mt-6">
          <ProductReviews
            productId={product.id}
            initialReviews={product.reviews}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

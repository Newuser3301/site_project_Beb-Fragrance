// src/app/wishlist/page.tsx
'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { ShoppingBag, Trash2 } from 'lucide-react';
import { useWishlistStore } from '@/store/useWishlistStore';
import { useCartStore } from '@/store/useCartStore';
import { ProductCard } from '@/components/product/ProductCard';
import { EmptyState } from '@/components/shared/EmptyState';
import { Button } from '@/components/ui/Button';
import { toast } from 'sonner';

export default function WishlistPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { items, removeItem, clearWishlist } = useWishlistStore();
  const { addItem } = useCartStore();
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadWishlistProducts = useCallback(async () => {
    if (items.length === 0) {
      setProducts([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/wishlist');
      if (response.ok) {
        const data = await response.json();
        setProducts(data.items || []);
      }
    } catch (error) {
      console.error('Failed to load wishlist:', error);
    } finally {
      setIsLoading(false);
    }
  }, [items]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login?callbackUrl=/wishlist');
      return;
    }

    if (status === 'loading') return;

    loadWishlistProducts();
  }, [status, loadWishlistProducts, router]);

  const handleAddToCart = (product: any) => {
    addItem({
      id: product.id,
      productId: product.id,
      name: product.name,
      price: Number(product.price),
      image: product.images?.[0] || '',
      quantity: 1,
      volume: product.volume,
      brand: product.brand,
    });
    toast.success(`${product.name} added to cart!`);
  };

  const handleRemoveFromWishlist = async (productId: string) => {
    removeItem(productId);
    toast.success('Removed from wishlist');

    if (session?.user) {
      try {
        await fetch('/api/wishlist', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId }),
        });
      } catch (error) {
        console.error('Failed to sync wishlist:', error);
      }
    }
  };

  const handleClearWishlist = async () => {
    clearWishlist();
    setProducts([]);
    toast.success('Wishlist cleared');

    if (session?.user) {
      try {
        for (const item of items) {
          await fetch('/api/wishlist', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ productId: item.productId }),
          });
        }
      } catch (error) {
        console.error('Failed to sync wishlist:', error);
      }
    }
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="animate-pulse">
          <div className="mb-8 h-10 w-48 rounded bg-gray-200" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-4 rounded-2xl bg-white p-4">
                <div className="aspect-square rounded-xl bg-gray-200" />
                <div className="h-4 w-24 rounded bg-gray-200" />
                <div className="h-5 w-32 rounded bg-gray-200" />
                <div className="h-8 w-full rounded-lg bg-gray-200" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <EmptyState
          variant="wishlist"
          title="Your wishlist is empty"
          description="Save your favorite fragrances here for later"
          actionHref="/products"
          actionLabel="Browse Products"
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-gray-900">
            My Wishlist
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {products.length} item{products.length !== 1 ? 's' : ''} saved
          </p>
        </div>
        {products.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearWishlist}
            className="text-red-600 hover:bg-red-50 hover:text-red-700"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Clear Wishlist
          </Button>
        )}
      </div>

      {/* Products Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((item: any) => (
          <div key={item.id} className="group relative">
            <ProductCard
              product={{
                id: item.id,
                name: item.name,
                slug: item.slug,
                price: Number(item.price),
                comparePrice: item.comparePrice ? Number(item.comparePrice) : null,
                images: item.images || [],
                brand: item.brand,
                gender: item.gender,
                stock: item.stock,
                isFeatured: item.featured || false,
              }}
            />
            {/* Wishlist Actions Overlay */}
            <div className="absolute right-2 top-2 z-10 flex flex-col gap-1 opacity-0 transition-opacity group-hover:opacity-100">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleRemoveFromWishlist(item.id);
                }}
                className="rounded-full bg-white p-2 shadow-lg hover:bg-red-50 hover:text-red-500 transition-all"
                title="Remove from wishlist"
              >
                <Trash2 className="h-4 w-4" />
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleAddToCart(item);
                }}
                className="rounded-full bg-gold-500 p-2 text-white shadow-lg hover:bg-gold-600 transition-all"
                title="Add to cart"
                disabled={item.stock === 0}
              >
                <ShoppingBag className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
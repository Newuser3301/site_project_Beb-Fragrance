// src/app/products/[slug]/page.tsx
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { ProductDetails } from '@/components/product/ProductDetails';
import { RelatedProducts } from '@/components/product/RelatedProducts';
import { ProductStructuredData } from '@/components/product/ProductStructuredData';
import { LoadingSkeleton } from '@/components/shared/LoadingSkeleton';
import {
  fetchProductBySlug,
  fetchProductSlugs,
} from '@/lib/products-server';

export const revalidate = 3600;

interface ProductPageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  try {
    return await fetchProductSlugs();
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const product = await fetchProductBySlug(params.slug);

  if (!product) {
    return {
      title: 'Product Not Found',
      description: 'The requested product could not be found.',
    };
  }

  const description =
    product.shortDescription ?? product.description.slice(0, 160);
  const imageUrl = product.images[0] ?? '';

  return {
    title: product.name,
    description,
    openGraph: {
      title: `${product.name} | Beb Fragrance`,
      description,
      type: 'website',
      images: imageUrl
        ? [
            {
              url: imageUrl,
              alt: product.name,
              width: 800,
              height: 1000,
            },
          ]
        : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.name} | Beb Fragrance`,
      description,
      images: imageUrl ? [imageUrl] : [],
    },
  };
}

function RelatedProductsFallback() {
  return (
    <div className="container-beb py-12">
      <div className="mb-8 space-y-2">
        <div className="h-6 w-40 animate-pulse rounded bg-muted" />
        <div className="h-4 w-64 animate-pulse rounded bg-muted" />
      </div>
      <LoadingSkeleton variant="product-card" count={4} />
    </div>
  );
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await fetchProductBySlug(params.slug);

  if (!product) {
    notFound();
  }

  return (
    <>
      {/* Structured Data for SEO */}
      <ProductStructuredData product={product} />

      {/* Breadcrumb */}
      <div className="border-b border-border bg-cream-50">
        <div className="container-beb py-3">
          <nav aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
              <li>
                <Link
                  href="/"
                  className="transition-colors hover:text-gold-600"
                >
                  Home
                </Link>
              </li>
              <li aria-hidden="true">
                <ChevronRight className="h-3.5 w-3.5" />
              </li>
              <li>
                <Link
                  href="/products"
                  className="transition-colors hover:text-gold-600"
                >
                  Products
                </Link>
              </li>
              <li aria-hidden="true">
                <ChevronRight className="h-3.5 w-3.5" />
              </li>
              {product.category && (
                <>
                  <li>
                    <Link
                      href={`/categories/${product.category.slug}`}
                      className="transition-colors hover:text-gold-600"
                    >
                      {product.category.name}
                    </Link>
                  </li>
                  <li aria-hidden="true">
                    <ChevronRight className="h-3.5 w-3.5" />
                  </li>
                </>
              )}
              <li>
                <span className="font-medium text-foreground line-clamp-1 max-w-[200px]">
                  {product.name}
                </span>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Product Details */}
      <div className="container-beb py-10">
        <ProductDetails product={product} />
      </div>

      {/* Related Products */}
      <div className="border-t border-border bg-cream-50">
        <Suspense fallback={<RelatedProductsFallback />}>
          <RelatedProducts
            currentProductId={product.id}
            categoryId={product.categoryId}
            categorySlug={product.category.slug}
          />
        </Suspense>
      </div>
    </>
  );
}

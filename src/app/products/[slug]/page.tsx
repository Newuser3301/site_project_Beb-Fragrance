import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ProductDetails } from '@/components/product/ProductDetails';
import { ProductStructuredData } from '@/components/product/ProductStructuredData';
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

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await fetchProductBySlug(params.slug);

  if (!product) {
    notFound();
  }

  return (
    <>
      <ProductStructuredData product={product} />

      <div className="container-beb py-10">
        <ProductDetails product={product} />
      </div>
    </>
  );
}

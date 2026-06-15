// src/components/product/ProductStructuredData.tsx
import { CURRENCY } from '@/lib/constants';

interface ProductStructuredDataProps {
  product: {
    name: string;
    description: string;
    images: string[];
    brand: string;
    price: number;
    slug: string;
    stock: number;
    reviews?: { rating: number; comment: string | null; user: { name: string | null } }[];
  };
}

export function ProductStructuredData({ product }: ProductStructuredDataProps) {
  const reviewCount = product.reviews?.length || 0;
  const averageRating =
    reviewCount > 0
      ? product.reviews!.reduce((sum, r) => sum + r.rating, 0) / reviewCount
      : 0;

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.images,
    brand: {
      '@type': 'Brand',
      name: product.brand,
    },
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: CURRENCY,
      availability:
        product.stock > 0
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/products/${product.slug}`,
    },
    ...(reviewCount > 0 && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: averageRating.toFixed(1),
        reviewCount: reviewCount,
      },
      review: product.reviews!.map((review) => ({
        '@type': 'Review',
        author: {
          '@type': 'Person',
          name: review.user.name || 'Anonymous',
        },
        reviewBody: review.comment || '',
        reviewRating: {
          '@type': 'Rating',
          ratingValue: review.rating,
        },
      })),
    }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

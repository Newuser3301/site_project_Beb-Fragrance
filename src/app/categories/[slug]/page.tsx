// src/app/categories/[slug]/page.tsx
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ProductsCatalog } from '@/components/products/ProductsCatalog';
import {
  fetchCategories,
  fetchCategoryBySlug,
  fetchProducts,
} from '@/lib/products-server';
import { parseProductsSearchParams } from '@/lib/parse-search-params';

interface CategoryPageProps {
  params: {
    slug: string;
  };
  searchParams: Record<string, string | string[] | undefined>;
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const category = await fetchCategoryBySlug(params.slug);

  if (!category) {
    return {
      title: 'Category Not Found',
      description: 'The requested category could not be found.',
    };
  }

  const description =
    category.description ??
    `Shop ${category.name} fragrances at Beb Fragrance. Premium perfumes curated for discerning tastes.`;

  return {
    title: `${category.name} Perfumes`,
    description,
    openGraph: {
      title: `${category.name} Perfumes | Beb Fragrance`,
      description,
      type: 'website',
    },
    twitter: {
      card: 'summary',
      title: `${category.name} Perfumes | Beb Fragrance`,
      description,
    },
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const category = await fetchCategoryBySlug(params.slug);

  if (!category) {
    notFound();
  }

  const query = parseProductsSearchParams({
    ...searchParams,
    category: category.slug,
  });

  const [productsResult, categories] = await Promise.all([
    fetchProducts(query),
    fetchCategories(),
  ]);

  return (
    <ProductsCatalog
      products={productsResult.items}
      categories={categories}
      total={productsResult.total}
      page={productsResult.page}
      totalPages={productsResult.totalPages}
      searchParams={searchParams}
      pageTitle={category.name}
      pageDescription={
        category.description ??
        `Explore our ${category.name.toLowerCase()} fragrance collection. Premium scents curated for those who appreciate luxury.`
      }
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Products', href: '/products' },
        { label: category.name },
      ]}
      fixedCategoryId={category.id}
      fixedCategorySlug={category.slug}
    />
  );
}

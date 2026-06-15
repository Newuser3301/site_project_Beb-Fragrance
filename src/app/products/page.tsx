// src/app/products/page.tsx
import type { Metadata } from 'next';
import { ProductsCatalog } from '@/components/products/ProductsCatalog';
import { fetchCategories, fetchProducts } from '@/lib/products-server';
import { parseProductsSearchParams } from '@/lib/parse-search-params';

export const metadata: Metadata = {
  title: 'All Perfumes',
  description:
    'Browse our complete collection of premium perfumes. Filter by category, gender, price, and brand. Free shipping on orders over $100.',
  openGraph: {
    title: 'All Perfumes | Beb Fragrance',
    description:
      'Browse our complete collection of premium perfumes for men and women.',
    type: 'website',
  },
};

interface ProductsPageProps {
  searchParams: Record<string, string | string[] | undefined>;
}

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  const query = parseProductsSearchParams(searchParams);

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
      pageTitle="All Perfumes"
      pageDescription="Browse our complete collection of luxury fragrances from the world's finest perfume houses. Filter by gender, price, brand and more."
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Products' },
      ]}
    />
  );
}

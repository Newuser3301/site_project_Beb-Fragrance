'use client';

import { useCallback, useMemo, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { ProductGrid } from '@/components/product/ProductGrid';
import { ProductSearch } from '@/components/product/ProductSearch';
import { ProductSort, type ProductSortValue } from '@/components/product/ProductSort';
import { Pagination } from '@/components/shared/Pagination';
import type { ProductCardProduct } from '@/components/product/ProductCard';
import type { Category } from '@prisma/client';
import { cn } from '@/lib/utils';

export interface ProductsCatalogProps {
  products: ProductCardProduct[];
  categories: Category[];
  total: number;
  page: number;
  totalPages: number;
  searchParams: Record<string, string | string[] | undefined>;
  pageTitle?: string;
  pageDescription?: string;
  breadcrumbs?: Array<{ label: string; href?: string }>;
  fixedCategoryId?: string;
  fixedCategorySlug?: string;
}

function getParam(
  params: Record<string, string | string[] | undefined>,
  key: string
): string | undefined {
  const value = params[key];
  if (Array.isArray(value)) return value[0];
  return value;
}

function getCategoryLabel(category: Category) {
  const labelMap: Record<string, string> = {
    oriental: 'Sharqona iforlar',
    floral: 'Gulli iforlar',
    woody: "Yog'ochsimon iforlar",
    fresh: 'Yangi iforlar',
  };

  return labelMap[category.slug] ?? category.name;
}

export function ProductsCatalog({
  products,
  categories,
  total,
  page,
  totalPages,
  searchParams,
  pageTitle = 'Barcha atirlar',
  pageDescription,
  breadcrumbs = [{ label: 'Bosh sahifa', href: '/' }, { label: "Do'kon" }],
  fixedCategoryId,
  fixedCategorySlug,
}: ProductsCatalogProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);

  const currentSort = (getParam(searchParams, 'sort') ?? 'newest') as ProductSortValue;
  const currentSearch = getParam(searchParams, 'search') ?? '';
  const currentCategory = getParam(searchParams, 'category') ?? fixedCategorySlug ?? fixedCategoryId ?? '';
  const limit = Number(getParam(searchParams, 'limit') ?? 12);

  const updateParams = useCallback(
    (updates: Record<string, string | undefined>) => {
      setIsLoading(true);
      const params = new URLSearchParams();

      const merged: Record<string, string | undefined> = {
        page: String(page),
        limit: String(limit),
        sort: currentSort,
        search: currentSearch || undefined,
        category: currentCategory || undefined,
        ...updates,
      };

      Object.entries(merged).forEach(([key, value]) => {
        if (value) {
          params.set(key, value);
        }
      });

      router.push(`${pathname}?${params.toString()}`, { scroll: false });
      setTimeout(() => setIsLoading(false), 300);
    },
    [router, pathname, page, limit, currentSort, currentSearch, currentCategory]
  );

  const handleSearch = useCallback(
    (query: string) => {
      updateParams({ search: query || undefined, page: '1' });
    },
    [updateParams]
  );

  const handleSortChange = useCallback(
    (sort: ProductSortValue) => {
      updateParams({ sort, page: '1' });
    },
    [updateParams]
  );

  const handlePageChange = useCallback(
    (newPage: number) => {
      updateParams({ page: String(newPage) });
    },
    [updateParams]
  );

  const startItem = total === 0 ? 0 : (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, total);

  const filterTabs = useMemo(
    () => [
      { key: 'all', label: 'Barchasi', href: '/products', categorySlug: '' },
      ...categories.map((category) => ({
        key: category.id,
        label: getCategoryLabel(category),
        href: `/products?category=${category.slug}`,
        categorySlug: category.slug,
      })),
    ],
    [categories]
  );

  return (
    <div className="container-beb py-10">
      <nav className="mb-6 text-xs text-[#6B6B6B] dark:text-slate-400" style={{ letterSpacing: '0.02em' }}>
        <ol className="flex flex-wrap items-center gap-2">
          {breadcrumbs.map((crumb, index) => (
            <li key={crumb.label} className="flex items-center gap-2">
              {index > 0 && <span className="text-[#D0D0D0] dark:text-slate-600">/</span>}
              {crumb.href ? (
                <Link href={crumb.href} className="transition-colors hover:text-[#1A1A1A] dark:hover:text-white">
                  {crumb.label}
                </Link>
              ) : (
                <span className="font-medium text-[#1A1A1A] dark:text-slate-200">{crumb.label}</span>
              )}
            </li>
          ))}
        </ol>
      </nav>

      <div className="mb-8">
        <h1 className="font-serif text-4xl font-bold leading-tight text-[#1A1A1A] dark:text-white">
          {pageTitle}
        </h1>
        {pageDescription && (
          <p className="mt-2 max-w-2xl text-sm text-[#6B6B6B] dark:text-slate-400">
            {pageDescription}
          </p>
        )}
        <p className="mt-3 text-xs text-[#6B6B6B] dark:text-slate-400">
          {startItem}–{endItem} / {total} mahsulot
        </p>
      </div>

      <div className="mb-5 grid gap-3 lg:grid-cols-[minmax(0,1fr)_220px_220px]">
        <div className="min-w-0">
          <ProductSearch
            onSearch={handleSearch}
            initialValue={currentSearch}
            placeholder="Atir qidiring..."
            className="w-full"
          />
        </div>
        <select
          value={currentCategory}
          onChange={(event) =>
            updateParams({
              category: event.target.value || undefined,
              page: '1',
            })
          }
          className="h-11 rounded-2xl border border-[rgba(13,28,48,0.10)] dark:border-slate-700 bg-white dark:bg-slate-800 px-4 text-sm text-[#163050] dark:text-slate-200 outline-none"
        >
          <option value="">Kategoriya tanlang</option>
          {categories.map((category) => (
            <option key={category.id} value={category.slug}>
              {getCategoryLabel(category)}
            </option>
          ))}
        </select>
        <ProductSort currentSort={currentSort} onSortChange={handleSortChange} />
      </div>

      <div className="mb-8 flex flex-wrap gap-3">
        {filterTabs.map((tab) => {
          const active =
            tab.key === 'all'
              ? !currentCategory
              : currentCategory === tab.categorySlug;

          return (
            <Link
              key={tab.key}
              href={tab.href}
              className={cn(
                'rounded-full border px-4 py-2 text-sm font-medium transition-colors',
                active
                  ? 'border-[#3B82F6] bg-[#3B82F6] text-white'
                  : 'border-[rgba(13,28,48,0.10)] dark:border-slate-700 bg-white dark:bg-slate-800 text-[#163050] dark:text-slate-200 hover:border-[#bfdbfe] dark:hover:border-slate-600 hover:bg-[#f8fbff] dark:hover:bg-slate-700'
              )}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>

      <div className="min-w-0">
        <ProductGrid products={products} isLoading={isLoading} />

        {totalPages > 1 && (
          <div className="mt-10">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>
    </div>
  );
}

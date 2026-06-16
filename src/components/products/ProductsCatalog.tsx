'use client';

import { useCallback, useMemo, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { ProductGrid } from '@/components/product/ProductGrid';
import { ProductFilters, type ProductFilterState } from '@/components/product/ProductFilters';
import { ProductSearch } from '@/components/product/ProductSearch';
import { ProductSort, type ProductSortValue } from '@/components/product/ProductSort';
import { Pagination } from '@/components/shared/Pagination';
import type { ProductCardProduct } from '@/components/product/ProductCard';
import type { Category } from '@prisma/client';

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

function buildFilterState(
  params: Record<string, string | string[] | undefined>,
  categories: Category[],
  fixedCategoryId?: string
): ProductFilterState {
  const categoryFromParams = getParam(params, 'category');
  const matchedCategory = categories.find(
    (category) =>
      category.id === categoryFromParams ||
      category.slug === categoryFromParams
  );
  const categoryId =
    fixedCategoryId ?? matchedCategory?.id ?? categoryFromParams;

  return {
    categoryId,
    gender: (getParam(params, 'gender') as ProductFilterState['gender']) ?? 'ALL',
    minPrice: getParam(params, 'minPrice')
      ? Number(getParam(params, 'minPrice'))
      : undefined,
    maxPrice: getParam(params, 'maxPrice')
      ? Number(getParam(params, 'maxPrice'))
      : undefined,
    brands: getParam(params, 'brand')?.split(',').filter(Boolean) ?? [],
    volumes: getParam(params, 'volume')
      ? getParam(params, 'volume')!
          .split(',')
          .map(Number)
          .filter((n) => !isNaN(n))
      : [],
  };
}

export function ProductsCatalog({
  products,
  categories,
  total,
  page,
  totalPages,
  searchParams,
  pageTitle = 'All Perfumes',
  pageDescription,
  breadcrumbs = [{ label: 'Home', href: '/' }, { label: 'Products' }],
  fixedCategoryId,
  fixedCategorySlug,
}: ProductsCatalogProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);
  const tProducts = useTranslations('products');
  const tFilters = useTranslations('products.filters');

  const currentSort = (getParam(searchParams, 'sort') ?? 'newest') as ProductSortValue;
  const currentSearch = getParam(searchParams, 'search') ?? '';
  const limit = Number(getParam(searchParams, 'limit') ?? 12);
  const filters = useMemo(
    () => buildFilterState(searchParams, categories, fixedCategoryId),
    [searchParams, categories, fixedCategoryId]
  );

  const updateParams = useCallback(
    (updates: Record<string, string | undefined>) => {
      setIsLoading(true);
      const params = new URLSearchParams();

      const merged: Record<string, string | undefined> = {
        page: String(page),
        limit: String(limit),
        sort: currentSort,
        search: currentSearch || undefined,
        category: fixedCategorySlug ?? filters.categoryId,
        gender: filters.gender !== 'ALL' ? filters.gender : undefined,
        minPrice: filters.minPrice?.toString(),
        maxPrice: filters.maxPrice?.toString(),
        brand: filters.brands.length > 0 ? filters.brands.join(',') : undefined,
        volume: filters.volumes.length > 0 ? filters.volumes.join(',') : undefined,
        ...updates,
      };

      Object.entries(merged).forEach(([key, value]) => {
        if (value && value !== 'ALL') {
          params.set(key, value);
        }
      });

      router.push(`${pathname}?${params.toString()}`, { scroll: false });
      setTimeout(() => setIsLoading(false), 300);
    },
    [
      router,
      pathname,
      page,
      limit,
      currentSort,
      currentSearch,
      filters,
      fixedCategorySlug,
    ]
  );

  const handleFilterChange = (newFilters: ProductFilterState) => {
    updateParams({
      category: fixedCategorySlug ?? newFilters.categoryId,
      gender: newFilters.gender !== 'ALL' ? newFilters.gender : undefined,
      minPrice: newFilters.minPrice?.toString(),
      maxPrice: newFilters.maxPrice?.toString(),
      brand: newFilters.brands.length > 0 ? newFilters.brands.join(',') : undefined,
      volume: newFilters.volumes.length > 0 ? newFilters.volumes.join(',') : undefined,
      page: '1',
    });
  };

  const handleSearch = (query: string) => {
    updateParams({ search: query || undefined, page: '1' });
  };

  const handleSortChange = (sort: ProductSortValue) => {
    updateParams({ sort, page: '1' });
  };

  const handlePageChange = (newPage: number) => {
    updateParams({ page: String(newPage) });
  };

  const activeBadges = useMemo(() => {
    const badges: Array<{ label: string; key: string }> = [];
    if (filters.gender && filters.gender !== 'ALL') {
      const genderKey = filters.gender.toLowerCase();
      badges.push({ label: tFilters(`genders.${genderKey}`), key: 'gender' });
    }
    if (filters.minPrice) {
      badges.push({
        label: tProducts('badges.min', { value: filters.minPrice }),
        key: 'minPrice',
      });
    }
    if (filters.maxPrice) {
      badges.push({
        label: tProducts('badges.max', { value: filters.maxPrice }),
        key: 'maxPrice',
      });
    }
    filters.brands.forEach((brand) => {
      badges.push({ label: brand, key: `brand-${brand}` });
    });
    filters.volumes.forEach((vol) => {
      badges.push({ label: `${vol}ml`, key: `volume-${vol}` });
    });
    if (currentSearch) {
      badges.push({ label: `"${currentSearch}"`, key: 'search' });
    }
    return badges;
  }, [filters, currentSearch, tFilters, tProducts]);

  const removeBadge = (key: string) => {
    if (key === 'gender') updateParams({ gender: undefined, page: '1' });
    else if (key === 'minPrice') updateParams({ minPrice: undefined, page: '1' });
    else if (key === 'maxPrice') updateParams({ maxPrice: undefined, page: '1' });
    else if (key === 'search') updateParams({ search: undefined, page: '1' });
    else if (key.startsWith('brand-')) {
      const brand = key.replace('brand-', '');
      const updated = filters.brands.filter((b) => b !== brand);
      updateParams({
        brand: updated.length > 0 ? updated.join(',') : undefined,
        page: '1',
      });
    } else if (key.startsWith('volume-')) {
      const vol = Number(key.replace('volume-', ''));
      const updated = filters.volumes.filter((v) => v !== vol);
      updateParams({
        volume: updated.length > 0 ? updated.join(',') : undefined,
        page: '1',
      });
    }
  };

  const startItem = total === 0 ? 0 : (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, total);

  return (
    <div className="container-beb py-10">
      {/* Breadcrumb - SCENTORA style */}
      <nav className="mb-6 text-xs text-[#6B6B6B]" style={{ letterSpacing: '0.02em' }}>
        <ol className="flex flex-wrap items-center gap-2">
          {breadcrumbs.map((crumb, index) => (
            <li key={crumb.label} className="flex items-center gap-2">
              {index > 0 && <span className="text-[#D0D0D0]">/</span>}
              {crumb.href ? (
                <Link
                  href={crumb.href}
                  className="transition-colors hover:text-[#1A1A1A]"
                >
                  {crumb.label}
                </Link>
              ) : (
                <span className="font-medium text-[#1A1A1A]">
                  {crumb.label}
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>

      <div className="mb-8">
        <h1 className="font-serif text-4xl font-bold leading-tight text-[#1A1A1A]">
          {pageTitle}
        </h1>
        {pageDescription && (
          <p className="mt-2 max-w-2xl text-sm text-[#6B6B6B]">
            {pageDescription}
          </p>
        )}
        <p className="mt-3 text-xs text-[#6B6B6B]">
          {tProducts('showing', { start: startItem, end: endItem, total })}
        </p>
      </div>

      {/* Filter bar - SCENTORA style */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
          <ProductSearch
            onSearch={handleSearch}
            placeholder={tProducts('searchPlaceholder')}
            className="max-w-md flex-1"
          />
          <ProductFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            categories={categories}
            display="mobile"
          />
        </div>
        <ProductSort currentSort={currentSort} onSortChange={handleSortChange} />
      </div>

      {/* Active filter chips - SCENTORA style */}
      {activeBadges.length > 0 && (
        <div className="mb-6 flex flex-wrap items-center gap-2">
          <span className="text-xs text-[#6B6B6B]">{tProducts('activeFilters')}</span>
          {activeBadges.map((badge) => (
            <span key={badge.key} className="filter-chip">
              {badge.label}
              <button
                type="button"
                onClick={() => removeBadge(badge.key)}
                className="opacity-60 hover:opacity-100"
                aria-label={`Remove ${badge.label} filter`}
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
          <button
            type="button"
            onClick={() => router.push(pathname, { scroll: false })}
            className="text-xs text-[#6B6B6B] underline transition-colors hover:text-[#1A1A1A]"
          >
            {tProducts('clearAll')}
          </button>
        </div>
      )}

      <div className="flex gap-8">
        <ProductFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          categories={categories}
          display="sidebar"
        />

        <div className="min-w-0 flex-1">
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
    </div>
  );
}

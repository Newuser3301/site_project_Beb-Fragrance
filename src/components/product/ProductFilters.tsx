'use client';

import { useEffect, useState } from 'react';
import { Filter } from 'lucide-react';
import { useTranslations } from 'next-intl';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/Sheet';
import { cn } from '@/lib/utils';
import type { Category } from '@prisma/client';

export interface ProductFilterState {
  categoryId?: string;
  gender?: 'ALL' | 'MEN' | 'WOMEN' | 'UNISEX';
  minPrice?: number;
  maxPrice?: number;
  brands: string[];
  volumes: number[];
}

export interface BrandOption {
  id: string;
  name: string;
  slug: string;
}

export interface ProductFiltersProps {
  filters: ProductFilterState;
  onFilterChange: (filters: ProductFilterState) => void;
  categories: Category[];
  className?: string;
  display?: 'sidebar' | 'mobile' | 'both';
}

const defaultFilters: ProductFilterState = {
  gender: 'ALL',
  brands: [],
  volumes: [],
};

const genderOptions = [
  { value: 'ALL' as const, labelKey: 'all' },
  { value: 'MEN' as const, labelKey: 'men' },
  { value: 'WOMEN' as const, labelKey: 'women' },
  { value: 'UNISEX' as const, labelKey: 'unisex' },
];

const volumeOptions = [50, 100, 150];

function countActiveFilters(filters: ProductFilterState): number {
  let count = 0;
  if (filters.categoryId) count++;
  if (filters.gender && filters.gender !== 'ALL') count++;
  if (filters.minPrice !== undefined && filters.minPrice > 0) count++;
  if (filters.maxPrice !== undefined && filters.maxPrice > 0) count++;
  count += filters.brands.length;
  count += filters.volumes.length;
  return count;
}

function FilterContent({
  filters,
  onFilterChange,
  categories,
  brands,
  brandSearch,
  onBrandSearchChange,
}: {
  filters: ProductFilterState;
  onFilterChange: (filters: ProductFilterState) => void;
  categories: Category[];
  brands: BrandOption[];
  brandSearch: string;
  onBrandSearchChange: (value: string) => void;
}) {
  const t = useTranslations('products.filters');
  const tCommon = useTranslations('common');
  const filteredBrands = brands.filter((brand) =>
    brand.name.toLowerCase().includes(brandSearch.toLowerCase())
  );

  const toggleBrand = (brandName: string) => {
    const updated = filters.brands.includes(brandName)
      ? filters.brands.filter((b) => b !== brandName)
      : [...filters.brands, brandName];
    onFilterChange({ ...filters, brands: updated });
  };

  const toggleVolume = (volume: number) => {
    const updated = filters.volumes.includes(volume)
      ? filters.volumes.filter((v) => v !== volume)
      : [...filters.volumes, volume];
    onFilterChange({ ...filters, volumes: updated });
  };

  const clearAll = () => onFilterChange({ ...defaultFilters });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-serif text-lg font-semibold">{t('title')}</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={clearAll}
          className="text-muted-foreground hover:text-gold-600"
        >
          {tCommon('clearAll')}
        </Button>
      </div>

      <Accordion
        type="multiple"
        defaultValue={['category', 'gender', 'price', 'brand', 'volume']}
        className="space-y-2"
      >
        <AccordionItem value="category" className="rounded-lg border border-border px-4">
          <AccordionTrigger className="text-sm font-medium hover:text-gold-600 hover:no-underline">
            {t('category')}
          </AccordionTrigger>
          <AccordionContent className="space-y-2 pb-4">
            <label className="flex cursor-pointer items-center gap-2 text-sm">
              <input
                type="radio"
                name="category"
                checked={!filters.categoryId}
                onChange={() =>
                  onFilterChange({ ...filters, categoryId: undefined })
                }
                className="accent-gold-500"
              />
              {t('allCategories')}
            </label>
            {categories.map((category) => (
              <label
                key={category.id}
                className="flex cursor-pointer items-center gap-2 text-sm"
              >
                <input
                  type="radio"
                  name="category"
                  checked={filters.categoryId === category.id}
                  onChange={() =>
                    onFilterChange({ ...filters, categoryId: category.id })
                  }
                  className="accent-gold-500"
                />
                {category.name}
              </label>
            ))}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="gender" className="rounded-lg border border-border px-4">
          <AccordionTrigger className="text-sm font-medium hover:text-gold-600 hover:no-underline">
            {t('gender')}
          </AccordionTrigger>
          <AccordionContent className="space-y-2 pb-4">
            {genderOptions.map((option) => (
              <label
                key={option.value}
                className="flex cursor-pointer items-center gap-2 text-sm"
              >
                <input
                  type="radio"
                  name="gender"
                  checked={filters.gender === option.value}
                  onChange={() =>
                    onFilterChange({ ...filters, gender: option.value })
                  }
                  className="accent-gold-500"
                />
                {t(`genders.${option.labelKey}`)}
              </label>
            ))}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="price" className="rounded-lg border border-border px-4">
          <AccordionTrigger className="text-sm font-medium hover:text-gold-600 hover:no-underline">
            {t('priceRange')}
          </AccordionTrigger>
          <AccordionContent className="space-y-3 pb-4">
            <div className="flex items-center gap-2">
                <Input
                  type="number"
                  placeholder={t('minPrice')}
                defaultValue={filters.minPrice ?? ''}
                onChange={(e) =>
                  onFilterChange({
                    ...filters,
                    minPrice: e.target.value ? Number(e.target.value) : undefined,
                  })
                }
                className="h-9"
              />
              <span className="text-muted-foreground">—</span>
              <Input
                type="number"
                placeholder={t('maxPrice')}
                defaultValue={filters.maxPrice ?? ''}
                onChange={(e) =>
                  onFilterChange({
                    ...filters,
                    maxPrice: e.target.value ? Number(e.target.value) : undefined,
                  })
                }
                className="h-9"
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="brand" className="rounded-lg border border-border px-4">
          <AccordionTrigger className="text-sm font-medium hover:text-gold-600 hover:no-underline">
            {t('brand')}
          </AccordionTrigger>
          <AccordionContent className="space-y-3 pb-4">
            <Input
              type="search"
              placeholder={t('brandSearch')}
              value={brandSearch}
              onChange={(e) => onBrandSearchChange(e.target.value)}
              className="h-9"
            />
            <div className="max-h-40 space-y-2 overflow-y-auto">
              {filteredBrands.map((brand) => (
                <label
                  key={brand.id}
                  className="flex cursor-pointer items-center gap-2 text-sm"
                >
                  <input
                    type="checkbox"
                    checked={filters.brands.includes(brand.name)}
                    onChange={() => toggleBrand(brand.name)}
                    className="accent-gold-500"
                  />
                  {brand.name}
                </label>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="volume" className="rounded-lg border border-border px-4">
          <AccordionTrigger className="text-sm font-medium hover:text-gold-600 hover:no-underline">
            {t('volume')}
          </AccordionTrigger>
          <AccordionContent className="space-y-2 pb-4">
            {volumeOptions.map((volume) => (
              <label
                key={volume}
                className="flex cursor-pointer items-center gap-2 text-sm"
              >
                <input
                  type="checkbox"
                  checked={filters.volumes.includes(volume)}
                  onChange={() => toggleVolume(volume)}
                  className="accent-gold-500"
                />
                {volume}ml
              </label>
            ))}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

export function ProductFilters({
  filters,
  onFilterChange,
  categories,
  className,
  display = 'both',
}: ProductFiltersProps) {
  const t = useTranslations('products.filters');
  const [brands, setBrands] = useState<BrandOption[]>([]);
  const [brandSearch, setBrandSearch] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const activeCount = countActiveFilters(filters);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await fetch('/api/brands');
        if (response.ok) {
          const data = await response.json();
          setBrands(data.items ?? []);
        }
      } catch {
        setBrands([]);
      }
    };
    fetchBrands();
  }, []);

  const filterContent = (
    <FilterContent
      filters={filters}
      onFilterChange={onFilterChange}
      categories={categories}
      brands={brands}
      brandSearch={brandSearch}
      onBrandSearchChange={setBrandSearch}
    />
  );

  return (
    <>
      {(display === 'sidebar' || display === 'both') && (
        <aside
          className={cn(
            'hidden w-64 shrink-0 lg:block',
            className
          )}
        >
          <div className="sticky top-24 rounded-xl border border-border bg-background p-5 shadow-sm">
            {filterContent}
          </div>
        </aside>
      )}

      {(display === 'mobile' || display === 'both') && (
      <div className={cn(display === 'mobile' ? '' : 'lg:hidden')}>
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              {t('title')}
              {activeCount > 0 && (
                <Badge variant="warning" size="sm">
                  {activeCount}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-full max-w-sm overflow-y-auto">
            <SheetHeader>
              <SheetTitle className="flex items-center justify-between font-serif">
                {t('title')}
                {activeCount > 0 && (
                  <Badge variant="warning">{t('activeCount', { count: activeCount })}</Badge>
                )}
              </SheetTitle>
            </SheetHeader>
            <div className="mt-6">{filterContent}</div>
            <Button
              variant="luxury"
              className="mt-6 w-full"
              onClick={() => setMobileOpen(false)}
            >
              {t('apply')}
            </Button>
          </SheetContent>
        </Sheet>
      </div>
      )}
    </>
  );
}

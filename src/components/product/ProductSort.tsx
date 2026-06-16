'use client';

import { useTranslations } from 'next-intl';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select';
import { cn } from '@/lib/utils';

export type ProductSortValue =
  | 'newest'
  | 'price-asc'
  | 'price-desc'
  | 'bestseller'
  | 'name-asc';

export interface ProductSortProps {
  currentSort: string;
  onSortChange: (sort: ProductSortValue) => void;
  className?: string;
}

const sortOptions: Array<{ value: ProductSortValue; labelKey: string }> = [
  { value: 'newest', labelKey: 'newest' },
  { value: 'price-asc', labelKey: 'priceAsc' },
  { value: 'price-desc', labelKey: 'priceDesc' },
  { value: 'bestseller', labelKey: 'bestseller' },
  { value: 'name-asc', labelKey: 'nameAsc' },
];

export function ProductSort({
  currentSort,
  onSortChange,
  className,
}: ProductSortProps) {
  const t = useTranslations('products.sort');

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <span className="hidden text-sm text-muted-foreground sm:inline">
        {t('label')}
      </span>
      <Select
        value={currentSort}
        onValueChange={(value) => onSortChange(value as ProductSortValue)}
      >
        <SelectTrigger className="w-[200px] border-gold-200 focus:ring-gold-500">
          <SelectValue placeholder={t('placeholder')} />
        </SelectTrigger>
        <SelectContent>
          {sortOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {t(option.labelKey)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

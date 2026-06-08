'use client';

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

const sortOptions: Array<{ value: ProductSortValue; label: string }> = [
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'bestseller', label: 'Popularity' },
  { value: 'name-asc', label: 'Name: A-Z' },
];

export function ProductSort({
  currentSort,
  onSortChange,
  className,
}: ProductSortProps) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <span className="hidden text-sm text-muted-foreground sm:inline">
        Sort by:
      </span>
      <Select
        value={currentSort}
        onValueChange={(value) => onSortChange(value as ProductSortValue)}
      >
        <SelectTrigger className="w-[200px] border-gold-200 focus:ring-gold-500">
          <SelectValue placeholder="Sort products" />
        </SelectTrigger>
        <SelectContent>
          {sortOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

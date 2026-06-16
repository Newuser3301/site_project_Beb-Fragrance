'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { useDebounce } from '@/hooks/useDebounce';
import { formatPrice, cn } from '@/lib/utils';
import type { ProductDisplay } from '@/lib/product-helpers';

export interface ProductSearchProps {
  onSearch?: (query: string) => void;
  initialValue?: string;
  placeholder?: string;
  className?: string;
}

type SearchProduct = ProductDisplay & {
  averageRating?: number;
  reviewCount?: number;
};

function highlightMatch(text: string, query: string): React.ReactNode {
  if (!query.trim()) return text;

  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);

  return parts.map((part, index) =>
    regex.test(part) ? (
      <span key={index} className="font-semibold text-gold-600">
        {part}
      </span>
    ) : (
      part
    )
  );
}

export function ProductSearch({
  onSearch,
  initialValue = '',
  placeholder = 'Search fragrances...',
  className,
}: ProductSearchProps) {
  const [query, setQuery] = useState(initialValue);
  const [results, setResults] = useState<SearchProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setQuery(initialValue);
  }, [initialValue]);
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const debouncedQuery = useDebounce(query, 300);

  const showDropdown = isFocused && debouncedQuery.length > 0;

  const isFirstMount = useRef(true);
  const onSearchRef = useRef(onSearch);

  useEffect(() => {
    onSearchRef.current = onSearch;
  }, [onSearch]);

  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }
    if (onSearchRef.current) {
      onSearchRef.current(debouncedQuery);
    }
  }, [debouncedQuery]);

  useEffect(() => {
    const fetchResults = async () => {
      if (debouncedQuery.length < 2) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(
          `/api/products?search=${encodeURIComponent(debouncedQuery)}&limit=5`
        );
        if (response.ok) {
          const data = await response.json();
          setResults(data.items ?? []);
        }
      } catch {
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [debouncedQuery]);

  const handleClose = useCallback(() => {
    setIsFocused(false);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        handleClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [handleClose]);

  return (
    <div ref={containerRef} className={cn('relative w-full', className)}>
      {showDropdown && (
        <div
          className="fixed inset-0 z-40 bg-black/10"
          onClick={handleClose}
          aria-hidden="true"
        />
      )}

      <Input
        type="search"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setIsFocused(true)}
        icon={<Search className="h-4 w-4" />}
        className={cn(
          'transition-all duration-300',
          isFocused && 'border-gold-400 shadow-gold ring-gold-500'
        )}
      />

      {showDropdown && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-lg border border-border bg-background shadow-luxury-lg">
          {isLoading ? (
            <div className="flex items-center justify-center gap-2 px-4 py-8 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin text-gold-500" />
              Searching...
            </div>
          ) : results.length > 0 ? (
            <>
              <ul className="max-h-80 overflow-y-auto py-2">
                {results.map((product) => (
                  <li key={product.id}>
                    <Link
                      href={`/products/${product.slug}`}
                      onClick={handleClose}
                      className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-cream-50"
                    >
                      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md bg-cream-100">
                        {product.images[0] && (
                          <Image
                            src={product.images[0]}
                            alt={product.name}
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">
                          {highlightMatch(product.name, debouncedQuery)}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          {highlightMatch(product.brand, debouncedQuery)}
                        </p>
                      </div>
                      <span className="shrink-0 text-sm font-semibold text-gold-600">
                        {formatPrice(product.price, 'USD', 'en-US')}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="border-t border-border p-2">
                <Link
                  href={`/products?search=${encodeURIComponent(debouncedQuery)}`}
                  onClick={handleClose}
                  className="block rounded-md px-3 py-2 text-center text-sm font-medium text-gold-600 transition-colors hover:bg-cream-50"
                >
                  View all results
                </Link>
              </div>
            </>
          ) : (
            <div className="px-4 py-8 text-center text-sm text-muted-foreground">
              No products found for &apos;{debouncedQuery}&apos;
            </div>
          )}
        </div>
      )}
    </div>
  );
}

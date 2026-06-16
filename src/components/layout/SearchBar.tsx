'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search, Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Input } from '@/components/ui/Input';
import { useDebounce } from '@/hooks/useDebounce';
import { useUIStore } from '@/store/useUIStore';
import { formatPrice } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface SearchProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  images: string[];
  brand: string;
}

export interface SearchBarProps {
  className?: string;
}

export function SearchBar({ className }: SearchBarProps) {
  const t = useTranslations('searchBar');
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const debouncedQuery = useDebounce(query, 300);
  const { closeSearch } = useUIStore();

  const showDropdown = isFocused && debouncedQuery.length > 0;

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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsFocused(false);
        closeSearch();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [closeSearch]);

  const handleClose = () => {
    setIsFocused(false);
    setQuery('');
    closeSearch();
  };

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      {showDropdown && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[1px]"
          onClick={handleClose}
          aria-hidden="true"
        />
      )}

      <div
        className={cn(
          'relative z-50 transition-all duration-300',
          isFocused && 'w-full md:w-80 lg:w-96'
        )}
      >
        <Input
          type="search"
          placeholder={t('placeholder')}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          icon={<Search className="h-4 w-4" />}
          iconPosition="left"
          className="h-12 rounded-full border-[rgba(106,53,83,0.10)] bg-white pl-11 pr-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.5)]"
        />

        {showDropdown && (
          <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-lg border border-border bg-background shadow-luxury-lg">
            {isLoading ? (
              <div className="flex items-center justify-center gap-2 px-4 py-8 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                {t('loading')}
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
                          <p className="truncate text-sm font-medium text-foreground">
                            {product.name}
                          </p>
                          <p className="truncate text-xs text-muted-foreground">
                            {product.brand}
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
                    {t('allResults')}
                  </Link>
                </div>
              </>
            ) : (
              <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                {t('empty')}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

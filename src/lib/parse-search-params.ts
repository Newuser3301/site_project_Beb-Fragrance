import type { ProductsQuery } from '@/lib/products-server';
import type { GenderInput } from '@/lib/validations';

export function parseProductsSearchParams(
  searchParams: Record<string, string | string[] | undefined>
): ProductsQuery {
  const get = (key: string): string | undefined => {
    const value = searchParams[key];
    if (Array.isArray(value)) return value[0];
    return value;
  };

  const page = get('page') ? Number(get('page')) : 1;
  const limit = get('limit') ? Number(get('limit')) : 12;
  const minPrice = get('minPrice') ? Number(get('minPrice')) : undefined;
  const maxPrice = get('maxPrice') ? Number(get('maxPrice')) : undefined;
  const volumeParam = get('volume');
  const brandParam = get('brand');

  return {
    page: isNaN(page) ? 1 : page,
    limit: isNaN(limit) ? 12 : limit,
    category: get('category'),
    gender: get('gender') as GenderInput | undefined,
    minPrice: minPrice && !isNaN(minPrice) ? minPrice : undefined,
    maxPrice: maxPrice && !isNaN(maxPrice) ? maxPrice : undefined,
    search: get('search'),
    sort: get('sort') ?? 'newest',
    brand: brandParam,
    brands: brandParam?.split(',').filter(Boolean),
    volume: volumeParam
      ? Number(volumeParam.split(',')[0])
      : undefined,
  };
}

import type { ProductDisplay } from '@/lib/product-helpers';
import type { ProductsQuery, ProductsResult } from '@/lib/products-server';

type MockCategory = {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string | null;
  parentId: string | null;
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
};

type MockProduct = ProductDisplay & {
  averageRating: number;
  reviewCount: number;
};

const now = new Date('2026-06-01T10:00:00.000Z');

export const mockCategories: MockCategory[] = [
  {
    id: 'cat-oriental',
    name: 'Oriental',
    slug: 'oriental',
    description: 'Warm, exotic, and sensual fragrances with amber, oud, and spice notes.',
    image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800',
    parentId: null,
    isActive: true,
    sortOrder: 0,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'cat-floral',
    name: 'Floral',
    slug: 'floral',
    description: 'Elegant floral perfumes with rose, jasmine, and peony accords.',
    image: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=800',
    parentId: null,
    isActive: true,
    sortOrder: 1,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'cat-woody',
    name: 'Woody',
    slug: 'woody',
    description: 'Refined woody blends built around cedar, sandalwood, and vetiver.',
    image: 'https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=800',
    parentId: null,
    isActive: true,
    sortOrder: 2,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'cat-fresh',
    name: 'Fresh',
    slug: 'fresh',
    description: 'Bright, clean, and uplifting fragrances with citrus and aquatic notes.',
    image: 'https://images.unsplash.com/photo-1557170339-96395f6c2c7a?w=800',
    parentId: null,
    isActive: true,
    sortOrder: 3,
    createdAt: now,
    updatedAt: now,
  },
];

const getCategory = (slug: string) =>
  mockCategories.find((category) => category.slug === slug)!;

export const mockProducts: MockProduct[] = [
  {
    id: 'mock-oud-royale',
    name: 'Oud Royale',
    slug: 'oud-royale',
    description: 'A majestic oud fragrance layered with saffron, rose, sandalwood, and vanilla for a deep luxurious trail.',
    shortDescription: 'A majestic oud fragrance layered with saffron, rose, sandalwood, and vanilla.',
    sku: 'BEB-0001',
    gender: 'UNISEX',
    fragranceFamily: 'ORIENTAL',
    concentration: 'EDP',
    price: 295,
    comparePrice: 350,
    stock: 25,
    volume: 100,
    brand: 'Beb Fragrance',
    brandId: 'brand-beb',
    category: getCategory('oriental'),
    categoryId: 'cat-oriental',
    featured: true,
    isActive: true,
    isNewArrival: false,
    isBestseller: true,
    images: [
      'https://images.unsplash.com/photo-1541643600914-78b084683601?w=900',
      'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=900',
    ],
    notes: ['Bergamot', 'Saffron', 'Oud', 'Rose', 'Sandalwood', 'Vanilla'],
    notesDetailed: [
      { name: 'Bergamot', type: 'TOP' },
      { name: 'Saffron', type: 'TOP' },
      { name: 'Oud', type: 'MIDDLE' },
      { name: 'Rose', type: 'MIDDLE' },
      { name: 'Sandalwood', type: 'BASE' },
      { name: 'Vanilla', type: 'BASE' },
    ],
    variants: [
      {
        id: 'variant-oud-royale',
        name: '100ml',
        sku: 'BEB-0001-100',
        size: '100ml',
        sizeMl: 100,
        price: 295,
        comparePrice: 350,
        stock: 25,
      },
    ],
    createdAt: now,
    updatedAt: now,
    averageRating: 4.9,
    reviewCount: 18,
  },
  {
    id: 'mock-rose-noire',
    name: 'Rose Noire',
    slug: 'rose-noire',
    description: 'A dark rose composition with black pepper, patchouli, leather, and musk for dramatic evening wear.',
    shortDescription: 'A dark rose composition with black pepper, patchouli, leather, and musk.',
    sku: 'BEB-0002',
    gender: 'WOMEN',
    fragranceFamily: 'FLORAL',
    concentration: 'EDP',
    price: 245,
    comparePrice: 290,
    stock: 30,
    volume: 100,
    brand: 'Beb Fragrance',
    brandId: 'brand-beb',
    category: getCategory('floral'),
    categoryId: 'cat-floral',
    featured: true,
    isActive: true,
    isNewArrival: false,
    isBestseller: false,
    images: [
      'https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=900',
      'https://images.unsplash.com/photo-1557170339-96395f6c2c7a?w=900',
    ],
    notes: ['Black Pepper', 'Turkish Rose', 'Patchouli', 'Oud', 'Leather', 'Musk'],
    notesDetailed: [
      { name: 'Black Pepper', type: 'TOP' },
      { name: 'Turkish Rose', type: 'TOP' },
      { name: 'Patchouli', type: 'MIDDLE' },
      { name: 'Oud', type: 'MIDDLE' },
      { name: 'Leather', type: 'BASE' },
      { name: 'Musk', type: 'BASE' },
    ],
    variants: [
      {
        id: 'variant-rose-noire',
        name: '100ml',
        sku: 'BEB-0002-100',
        size: '100ml',
        sizeMl: 100,
        price: 245,
        comparePrice: 290,
        stock: 30,
      },
    ],
    createdAt: now,
    updatedAt: now,
    averageRating: 4.7,
    reviewCount: 11,
  },
  {
    id: 'mock-santal-supreme',
    name: 'Santal Supreme',
    slug: 'santal-supreme',
    description: 'Creamy sandalwood with iris, amber, and cardamom for a smooth modern woody signature.',
    shortDescription: 'Creamy sandalwood with iris, amber, and cardamom.',
    sku: 'BEB-0003',
    gender: 'MEN',
    fragranceFamily: 'WOODY',
    concentration: 'EDP',
    price: 210,
    comparePrice: null,
    stock: 20,
    volume: 100,
    brand: 'Beb Fragrance',
    brandId: 'brand-beb',
    category: getCategory('woody'),
    categoryId: 'cat-woody',
    featured: true,
    isActive: true,
    isNewArrival: false,
    isBestseller: false,
    images: [
      'https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=900',
      'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=900',
    ],
    notes: ['Cardamom', 'Iris', 'Sandalwood', 'Cedar', 'Amber', 'Musk'],
    notesDetailed: [
      { name: 'Cardamom', type: 'TOP' },
      { name: 'Iris', type: 'TOP' },
      { name: 'Sandalwood', type: 'MIDDLE' },
      { name: 'Cedar', type: 'MIDDLE' },
      { name: 'Amber', type: 'BASE' },
      { name: 'Musk', type: 'BASE' },
    ],
    variants: [
      {
        id: 'variant-santal-supreme',
        name: '100ml',
        sku: 'BEB-0003-100',
        size: '100ml',
        sizeMl: 100,
        price: 210,
        comparePrice: null,
        stock: 20,
      },
    ],
    createdAt: now,
    updatedAt: now,
    averageRating: 4.6,
    reviewCount: 9,
  },
  {
    id: 'mock-citrus-bloom',
    name: 'Citrus Bloom',
    slug: 'citrus-bloom',
    description: 'A sparkling Mediterranean blend of bergamot, lemon, neroli, petitgrain, and white musk.',
    shortDescription: 'A sparkling Mediterranean blend of bergamot, lemon, neroli, and white musk.',
    sku: 'BEB-0004',
    gender: 'WOMEN',
    fragranceFamily: 'CITRUS',
    concentration: 'EDT',
    price: 150,
    comparePrice: 175,
    stock: 50,
    volume: 50,
    brand: 'Beb Fragrance',
    brandId: 'brand-beb',
    category: getCategory('fresh'),
    categoryId: 'cat-fresh',
    featured: false,
    isActive: true,
    isNewArrival: true,
    isBestseller: false,
    images: [
      'https://images.unsplash.com/photo-1557170339-96395f6c2c7a?w=900',
      'https://images.unsplash.com/photo-1541643600914-78b084683601?w=900',
    ],
    notes: ['Bergamot', 'Lemon', 'Neroli', 'Petitgrain', 'White Musk', 'Vetiver'],
    notesDetailed: [
      { name: 'Bergamot', type: 'TOP' },
      { name: 'Lemon', type: 'TOP' },
      { name: 'Neroli', type: 'MIDDLE' },
      { name: 'Petitgrain', type: 'MIDDLE' },
      { name: 'White Musk', type: 'BASE' },
      { name: 'Vetiver', type: 'BASE' },
    ],
    variants: [
      {
        id: 'variant-citrus-bloom',
        name: '50ml',
        sku: 'BEB-0004-50',
        size: '50ml',
        sizeMl: 50,
        price: 150,
        comparePrice: 175,
        stock: 50,
      },
    ],
    createdAt: now,
    updatedAt: now,
    averageRating: 4.5,
    reviewCount: 6,
  },
  {
    id: 'mock-noir-velvet',
    name: 'Noir Velvet',
    slug: 'noir-velvet',
    description: 'Dark chocolate, rum, tobacco, coffee, and patchouli create a velvety statement fragrance.',
    shortDescription: 'Dark chocolate, rum, tobacco, coffee, and patchouli create a velvety statement.',
    sku: 'BEB-0005',
    gender: 'UNISEX',
    fragranceFamily: 'GOURMAND',
    concentration: 'PARFUM',
    price: 320,
    comparePrice: 380,
    stock: 15,
    volume: 100,
    brand: 'Beb Fragrance',
    brandId: 'brand-beb',
    category: getCategory('oriental'),
    categoryId: 'cat-oriental',
    featured: true,
    isActive: true,
    isNewArrival: false,
    isBestseller: true,
    images: [
      'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=900',
      'https://images.unsplash.com/photo-1600612253971-422e7f7faeb6?w=900',
    ],
    notes: ['Dark Chocolate', 'Rum', 'Tobacco', 'Coffee', 'Patchouli', 'Vanilla'],
    notesDetailed: [
      { name: 'Dark Chocolate', type: 'TOP' },
      { name: 'Rum', type: 'TOP' },
      { name: 'Tobacco', type: 'MIDDLE' },
      { name: 'Coffee', type: 'MIDDLE' },
      { name: 'Patchouli', type: 'BASE' },
      { name: 'Vanilla', type: 'BASE' },
    ],
    variants: [
      {
        id: 'variant-noir-velvet',
        name: '100ml',
        sku: 'BEB-0005-100',
        size: '100ml',
        sizeMl: 100,
        price: 320,
        comparePrice: 380,
        stock: 15,
      },
    ],
    createdAt: now,
    updatedAt: now,
    averageRating: 4.8,
    reviewCount: 13,
  },
  {
    id: 'mock-ocean-mist',
    name: 'Ocean Mist',
    slug: 'ocean-mist',
    description: 'A fresh aquatic perfume with sea salt, lavender, rosemary, driftwood, and moss.',
    shortDescription: 'A fresh aquatic perfume with sea salt, lavender, rosemary, driftwood, and moss.',
    sku: 'BEB-0006',
    gender: 'UNISEX',
    fragranceFamily: 'AQUATIC',
    concentration: 'EDT',
    price: 140,
    comparePrice: null,
    stock: 45,
    volume: 50,
    brand: 'Beb Fragrance',
    brandId: 'brand-beb',
    category: getCategory('fresh'),
    categoryId: 'cat-fresh',
    featured: false,
    isActive: true,
    isNewArrival: false,
    isBestseller: false,
    images: [
      'https://images.unsplash.com/photo-1557170339-96395f6c2c7a?w=900',
      'https://images.unsplash.com/photo-1541643600914-78b084683601?w=900',
    ],
    notes: ['Sea Salt', 'Marine Notes', 'Lavender', 'Rosemary', 'Driftwood', 'Moss'],
    notesDetailed: [
      { name: 'Sea Salt', type: 'TOP' },
      { name: 'Marine Notes', type: 'TOP' },
      { name: 'Lavender', type: 'MIDDLE' },
      { name: 'Rosemary', type: 'MIDDLE' },
      { name: 'Driftwood', type: 'BASE' },
      { name: 'Moss', type: 'BASE' },
    ],
    variants: [
      {
        id: 'variant-ocean-mist',
        name: '50ml',
        sku: 'BEB-0006-50',
        size: '50ml',
        sizeMl: 50,
        price: 140,
        comparePrice: null,
        stock: 45,
      },
    ],
    createdAt: now,
    updatedAt: now,
    averageRating: 4.4,
    reviewCount: 7,
  },
];

function matchesProduct(product: MockProduct, query: ProductsQuery): boolean {
  if (query.category && product.category.slug !== query.category && product.categoryId !== query.category) {
    return false;
  }

  if (query.gender && product.gender !== query.gender) {
    return false;
  }

  if (query.search) {
    const value = query.search.toLowerCase();
    const haystack = `${product.name} ${product.description} ${product.brand}`.toLowerCase();
    if (!haystack.includes(value)) {
      return false;
    }
  }

  if (query.brand) {
    const brand = query.brand.toLowerCase();
    if (product.brand.toLowerCase() !== brand) {
      return false;
    }
  }

  if (query.brands?.length && !query.brands.includes(product.brand)) {
    return false;
  }

  if (query.volume !== undefined && product.volume !== query.volume) {
    return false;
  }

  if (query.minPrice !== undefined && product.price < query.minPrice) {
    return false;
  }

  if (query.maxPrice !== undefined && product.price > query.maxPrice) {
    return false;
  }

  if (query.featured && !product.featured) {
    return false;
  }

  if (query.bestseller && !product.isBestseller) {
    return false;
  }

  if (query.exclude && (product.id === query.exclude || product.slug === query.exclude)) {
    return false;
  }

  return true;
}

function sortProducts(items: MockProduct[], sort = 'newest'): MockProduct[] {
  const sorted = [...items];

  switch (sort) {
    case 'oldest':
      return sorted.reverse();
    case 'name-asc':
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case 'name-desc':
      return sorted.sort((a, b) => b.name.localeCompare(a.name));
    case 'price-asc':
      return sorted.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return sorted.sort((a, b) => b.price - a.price);
    case 'bestseller':
      return sorted.sort((a, b) => Number(b.isBestseller) - Number(a.isBestseller));
    default:
      return sorted;
  }
}

export function getMockProducts(query: ProductsQuery = {}): ProductsResult {
  const page = query.page ?? 1;
  const limit = query.limit ?? 12;
  const filtered = sortProducts(
    mockProducts.filter((product) => matchesProduct(product, query)),
    query.sort
  );
  const total = filtered.length;
  const start = (page - 1) * limit;
  const items = filtered.slice(start, start + limit);
  const totalPages = Math.ceil(total / limit);

  return {
    items,
    total,
    page,
    totalPages,
    hasMore: page < totalPages,
  };
}

export function getMockProductBySlug(slug: string) {
  return mockProducts.find((product) => product.slug === slug || product.id === slug) ?? null;
}

export function getMockCategoryBySlug(slug: string) {
  return mockCategories.find((category) => category.slug === slug || category.id === slug) ?? null;
}

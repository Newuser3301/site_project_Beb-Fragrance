// src/app/admin/products/[id]/page.tsx
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { ProductForm } from '@/components/admin/ProductForm';

interface EditProductPageProps {
  params: { id: string };
}

export async function generateMetadata({ params }: EditProductPageProps): Promise<Metadata> {
  const product = await prisma.product
    .findUnique({ where: { id: params.id }, select: { name: true } })
    .catch(() => null);

  return {
    title: product ? `Edit: ${product.name} | Admin` : 'Edit Product | Admin',
    robots: { index: false, follow: false },
  };
}

export const dynamic = 'force-dynamic';

export default async function EditProductPage({ params }: EditProductPageProps) {
  let product = null;
  let categories: { id: string; name: string }[] = [];

  try {
    [product, categories] = await Promise.all([
      prisma.product.findUnique({
        where: { id: params.id },
        include: {
          images: { orderBy: { sortOrder: 'asc' } },
          variants: { orderBy: { price: 'asc' }, take: 1 },
          brand: { select: { name: true } },
          notes: true,
        },
      }),
      prisma.category.findMany({
        select: { id: true, name: true },
        orderBy: { name: 'asc' },
      }),
    ]);
  } catch {
    // DB not connected — show not found
  }

  if (!product) {
    notFound();
  }

  const firstVariant = product.variants[0];

  const initialData = {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description ?? '',
    brand: product.brand.name,
    price: firstVariant ? String(Number(firstVariant.price)) : '',
    comparePrice: '',
    costPrice: '',
    stock: firstVariant ? String(firstVariant.stock) : '0',
    categoryId: product.categoryId ?? '',
    gender: product.gender as 'MALE' | 'FEMALE' | 'UNISEX',
    volume: firstVariant?.size ?? '50ml',
    notes: product.notes.map((n: { name: string }) => n.name),
    isFeatured: product.isFeatured,
    images: product.images.map((img: { url: string }) => img.url),
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-gray-500">
        <Link href="/admin" className="hover:text-gold-600">Dashboard</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link href="/admin/products" className="hover:text-gold-600">Products</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="max-w-[200px] truncate font-medium text-gray-900">
          {product.name}
        </span>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="font-medium text-gray-900">Edit</span>
      </nav>

      {/* Title */}
      <div>
        <h1 className="font-serif text-2xl font-bold text-gray-900 md:text-3xl">
          Edit: {product.name}
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Update product information below.
        </p>
      </div>

      {/* Form */}
      <ProductForm
        categories={categories}
        initialData={initialData}
        mode="edit"
      />
    </div>
  );
}

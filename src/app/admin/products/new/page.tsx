// src/app/admin/products/new/page.tsx
import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { ProductForm } from '@/components/admin/ProductForm';

export const metadata: Metadata = {
  title: 'Add New Product | Beb Fragrance Admin',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({
    select: { id: true, name: true },
    orderBy: { name: 'asc' },
  }).catch(() => []);

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-gray-500">
        <Link href="/admin" className="hover:text-gold-600">Dashboard</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link href="/admin/products" className="hover:text-gold-600">Products</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="font-medium text-gray-900">Add New</span>
      </nav>

      {/* Title */}
      <div>
        <h1 className="font-serif text-2xl font-bold text-gray-900 md:text-3xl">
          Add New Product
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Fill in all required fields to create a new fragrance product.
        </p>
      </div>

      {/* Form */}
      <ProductForm categories={categories} mode="create" />
    </div>
  );
}

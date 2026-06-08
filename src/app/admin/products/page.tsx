// src/app/admin/products/page.tsx
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, Pencil } from 'lucide-react';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { formatPrice } from '@/lib/utils';
import { AdminProductsClient } from './AdminProductsClient';

export const metadata: Metadata = {
  title: 'Products | Beb Fragrance Admin',
  description: 'Manage your product catalog',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: { search?: string; page?: string };
}) {
  await auth(); // auth check done by layout

  const page = Math.max(1, parseInt(searchParams.page ?? '1', 10));
  const limit = 20;
  const skip = (page - 1) * limit;
  const search = searchParams.search ?? '';

  const where = search
    ? {
        OR: [
          { name: { contains: search, mode: 'insensitive' as const } },
          { brand: { name: { contains: search, mode: 'insensitive' as const } } },
        ],
        isActive: true,
      }
    : { isActive: true };

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        category: { select: { name: true } },
        brand: { select: { name: true } },
        images: { where: { isPrimary: true }, take: 1 },
        variants: { orderBy: { price: 'asc' }, take: 1 },
        _count: { select: { variants: true } },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.product.count({ where }),
  ]).catch(() => [[], 0] as [never[], number]);

  const productList = Array.isArray(products) ? products : [];
  const productCount = typeof total === 'number' ? total : 0;
  const totalPages = Math.ceil(productCount / limit);


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-gray-900 md:text-3xl">
            Products
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {productCount} product{productCount !== 1 ? 's' : ''} total
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:shadow-lg hover:brightness-105"
        >
          <Plus className="h-4 w-4" />
          Add New Product
        </Link>
      </div>

      {/* Client-side search + delete wrapper */}
      <AdminProductsClient initialSearch={search}>
        {/* Products Table */}
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {['Product', 'Category', 'Price', 'Stock', 'Status', 'Actions'].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {productList.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-16 text-center text-sm text-gray-400">
                      No products found
                    </td>
                  </tr>
                ) : (
                  productList.map((product) => {
                    const primaryImage = product.images[0]?.url;
                    const lowestVariant = product.variants[0];
                    const price = lowestVariant ? Number(lowestVariant.price) : 0;

                    return (
                      <tr key={product.id} className="group hover:bg-gray-50/60">
                        {/* Product */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-gray-100">
                              {primaryImage ? (
                                <Image
                                  src={primaryImage}
                                  alt={product.name}
                                  fill
                                  className="object-cover"
                                  sizes="48px"
                                />
                              ) : (
                                <div className="flex h-full items-center justify-center text-lg">
                                  🧴
                                </div>
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="truncate text-sm font-semibold text-gray-900 max-w-[200px]">
                                {product.name}
                              </p>
                              <p className="text-xs text-gray-400">{product.brand.name}</p>
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {product.category.name}
                        </td>

                        {/* Price */}
                        <td className="px-4 py-3">
                          <span className="font-semibold text-gray-900">
                            {lowestVariant
                              ? formatPrice(price, 'USD', 'en-US')
                              : '—'}
                          </span>
                        </td>

                        {/* Stock */}
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                              lowestVariant?.stock === 0
                                ? 'bg-red-50 text-red-700'
                                : lowestVariant?.stock <= 5
                                ? 'bg-amber-50 text-amber-700'
                                : 'bg-emerald-50 text-emerald-700'
                            }`}
                          >
                            {lowestVariant?.stock ?? 0} in stock
                          </span>
                        </td>

                        {/* Status */}
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                              product.isActive
                                ? 'bg-emerald-50 text-emerald-700'
                                : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            {product.isActive ? '● Active' : '○ Draft'}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <Link
                              href={`/admin/products/${product.id}`}
                              className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 transition-all hover:border-gold-300 hover:text-gold-700"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                              Edit
                            </Link>
                            {/* Delete button — handled by client wrapper */}
                            <button
                              type="button"
                              data-delete-product={product.id}
                              data-product-name={product.name}
                              className="inline-flex items-center gap-1.5 rounded-lg border border-red-100 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 transition-all hover:bg-red-100"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-gray-100 px-6 py-4">
              <p className="text-sm text-gray-500">
                Page {page} of {totalPages}
              </p>
              <div className="flex gap-2">
                {page > 1 && (
                  <Link
                    href={`?page=${page - 1}${search ? `&search=${search}` : ''}`}
                    className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-50"
                  >
                    ← Previous
                  </Link>
                )}
                {page < totalPages && (
                  <Link
                    href={`?page=${page + 1}${search ? `&search=${search}` : ''}`}
                    className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-50"
                  >
                    Next →
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </AdminProductsClient>
    </div>
  );
}

// src/app/admin/customers/page.tsx
import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { CustomerTable } from '@/components/admin/CustomerTable';
import { Users } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Customers | Beb Fragrance Admin',
  description: 'Manage customers',
};

interface SearchParams {
  page?: string;
  search?: string;
}

export default async function AdminCustomersPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const search = params.search || '';
  const limit = 20;

  const searchFilter = search
    ? {
        OR: [
          { name: { contains: search, mode: 'insensitive' as const } },
          { email: { contains: search, mode: 'insensitive' as const } },
        ],
      }
    : {};

  const [customers, total] = await Promise.all([
    prisma.user.findMany({
      where: {
        role: 'CUSTOMER',
        ...searchFilter,
      },
      include: {
        _count: {
          select: { orders: true },
        },
        orders: {
          select: {
            total: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.user.count({
      where: {
        role: 'CUSTOMER',
        ...searchFilter,
      },
    }),
  ]);

  const totalPages = Math.ceil(total / limit);

  // Transform data for CustomerTable
  const customerData = customers.map((customer) => ({
    id: customer.id,
    name: customer.name,
    email: customer.email || '',
    phone: customer.phone,
    image: customer.image,
    createdAt: customer.createdAt,
    _count: { orders: customer._count.orders },
    totalSpent: customer.orders.reduce(
      (sum, order) => sum + Number(order.total),
      0
    ),
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-gray-900">
            Customers
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {total} customer{total !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Search + Table */}
      {customers.length === 0 && !search ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white py-16">
          <Users className="h-12 w-12 text-gray-300" />
          <h3 className="mt-4 text-lg font-semibold text-gray-500">
            No customers yet
          </h3>
          <p className="mt-1 text-sm text-gray-400">
            Customers will appear here when they create accounts
          </p>
        </div>
      ) : (
        <>
          <CustomerTable customers={customerData} />

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <a
                href={`/admin/customers?page=${page - 1}${search ? `&search=${search}` : ''}`}
                className={`rounded-lg border px-4 py-2 text-sm font-medium transition-all ${
                  page <= 1
                    ? 'pointer-events-none border-gray-200 text-gray-400'
                    : 'border-gray-200 text-gray-700 hover:border-gold-300 hover:text-gold-700'
                }`}
              >
                Previous
              </a>

              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => {
                  // Show first page, last page, current page, and pages around current
                  return (
                    p === 1 ||
                    p === totalPages ||
                    Math.abs(p - page) <= 1
                  );
                })
                .map((p, idx, arr) => (
                  <div key={p} className="flex items-center gap-2">
                    {idx > 0 && arr[idx - 1] !== p - 1 && (
                      <span className="text-gray-400">...</span>
                    )}
                    <a
                      href={`/admin/customers?page=${p}${search ? `&search=${search}` : ''}`}
                      className={`rounded-lg border px-4 py-2 text-sm font-medium transition-all ${
                        p === page
                          ? 'border-gold-500 bg-gold-500 text-white'
                          : 'border-gray-200 text-gray-700 hover:border-gold-300 hover:text-gold-700'
                      }`}
                    >
                      {p}
                    </a>
                  </div>
                ))}

              <a
                href={`/admin/customers?page=${page + 1}${search ? `&search=${search}` : ''}`}
                className={`rounded-lg border px-4 py-2 text-sm font-medium transition-all ${
                  page >= totalPages
                    ? 'pointer-events-none border-gray-200 text-gray-400'
                    : 'border-gray-200 text-gray-700 hover:border-gold-300 hover:text-gold-700'
                }`}
              >
                Next
              </a>
            </div>
          )}
        </>
      )}
    </div>
  );
}
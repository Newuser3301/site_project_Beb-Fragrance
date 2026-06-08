// src/components/admin/CustomerTable.tsx
'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ExternalLink } from 'lucide-react';
import { formatPrice, formatDate, getInitials, cn } from '@/lib/utils';

interface CustomerRow {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
  image: string | null;
  createdAt: Date | string;
  _count: { orders: number };
  totalSpent: number;
}

type SortKey = 'name' | 'orders' | 'totalSpent' | 'createdAt';
type SortDir = 'asc' | 'desc';

interface CustomerTableProps {
  customers: CustomerRow[];
}

export function CustomerTable({ customers }: CustomerTableProps) {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('createdAt');
  const [sortDir, setSortDir] = useState<SortDir>('desc');

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortKey(key); setSortDir('asc'); }
  };

  const SortIcon = ({ k }: { k: SortKey }) => (
    <span className={cn('ml-1 text-xs', sortKey === k ? 'text-gold-600' : 'text-gray-400')}>
      {sortKey === k ? (sortDir === 'asc' ? '↑' : '↓') : '↕'}
    </span>
  );

  const filtered = useMemo(() => {
    let list = [...customers];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (c) =>
          (c.name ?? '').toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q)
      );
    }
    list.sort((a, b) => {
      let aVal: string | number, bVal: string | number;
      if (sortKey === 'name') {
        aVal = (a.name ?? '').toLowerCase();
        bVal = (b.name ?? '').toLowerCase();
      } else if (sortKey === 'orders') {
        aVal = a._count.orders;
        bVal = b._count.orders;
      } else if (sortKey === 'totalSpent') {
        aVal = a.totalSpent;
        bVal = b.totalSpent;
      } else {
        aVal = new Date(a.createdAt).getTime();
        bVal = new Date(b.createdAt).getTime();
      }
      if (aVal < bVal) return sortDir === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
    return list;
  }, [customers, search, sortKey, sortDir]);

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search customers..."
          className="h-10 w-full rounded-xl border border-gray-200 bg-white pl-9 pr-4 text-sm outline-none placeholder:text-gray-400 focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20"
        />
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  <button type="button" onClick={() => handleSort('name')}>
                    Customer <SortIcon k="name" />
                  </button>
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Email</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Phone</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  <button type="button" onClick={() => handleSort('orders')}>
                    Orders <SortIcon k="orders" />
                  </button>
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  <button type="button" onClick={() => handleSort('totalSpent')}>
                    Total Spent <SortIcon k="totalSpent" />
                  </button>
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  <button type="button" onClick={() => handleSort('createdAt')}>
                    Joined <SortIcon k="createdAt" />
                  </button>
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-sm text-gray-400">
                    No customers found
                  </td>
                </tr>
              ) : (
                filtered.map((customer) => (
                  <tr
                    key={customer.id}
                    className="cursor-pointer hover:bg-gray-50/60"
                    onClick={() => router.push(`/admin/customers/${customer.id}`)}
                  >
                    {/* Avatar + Name */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-gold-400 to-gold-600 text-xs font-bold text-white">
                          {customer.image ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={customer.image}
                              alt={customer.name ?? ''}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            getInitials(customer.name ?? customer.email)
                          )}
                        </div>
                        <span className="text-sm font-semibold text-gray-900">
                          {customer.name ?? '—'}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{customer.email}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{customer.phone ?? '—'}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
                        {customer._count.orders}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                      {formatPrice(customer.totalSpent, 'USD', 'en-US')}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500">
                      {formatDate(
                        typeof customer.createdAt === 'string'
                          ? new Date(customer.createdAt)
                          : customer.createdAt,
                        { month: 'short', day: 'numeric', year: 'numeric' },
                        'en-US'
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/admin/customers/${customer.id}`);
                        }}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 hover:border-gold-300 hover:text-gold-700"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

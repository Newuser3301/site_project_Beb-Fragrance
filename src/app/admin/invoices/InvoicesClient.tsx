// src/app/admin/invoices/InvoicesClient.tsx
'use client';

import { useState, useMemo } from 'react';
import { Search, Printer, FileText, X, Check, AlertCircle } from 'lucide-react';
import { formatPrice, formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

interface OrderItem {
  id: string;
  quantity: number;
  price: any;
  total: any;
  product: {
    name: string;
  };
  variant: {
    size: string;
  };
}

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  subtotal: any;
  shippingCost: any;
  discount: any;
  total: any;
  currency: string;
  createdAt: Date | string;
  user: {
    name: string | null;
    email: string;
  };
  shippingAddress: {
    firstName: string;
    lastName: string;
    phone: string;
    street: string;
    city: string;
    state: string | null;
    postalCode: string;
    country: string;
  };
  items: OrderItem[];
}

interface InvoicesClientProps {
  initialOrders: Order[];
}

export function InvoicesClient({ initialOrders }: InvoicesClientProps) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 15;

  const filtered = useMemo(() => {
    let list = [...orders];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (o) =>
          o.orderNumber.toLowerCase().includes(q) ||
          (o.user.name ?? '').toLowerCase().includes(q) ||
          o.user.email.toLowerCase().includes(q)
      );
    }
    return list;
  }, [orders, search]);

  const totalPages = Math.ceil(filtered.length / limit);
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * limit;
    return filtered.slice(start, start + limit);
  }, [filtered, currentPage]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative max-w-sm print:hidden">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          placeholder="Search order number or customer name..."
          className="h-10 w-full rounded-xl border border-gray-200 bg-white pl-9 pr-4 text-sm outline-none placeholder:text-gray-400 focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20"
        />
      </div>

      {/* Table list */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm print:hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Order Number</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Created At</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Method</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Payment Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Total Amount</th>
                <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">Invoice</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-sm text-gray-400">
                    No orders/invoices found
                  </td>
                </tr>
              ) : (
                paginated.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                      {order.orderNumber}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      <div className="font-semibold text-gray-900">{order.user.name ?? 'Guest'}</div>
                      <div className="text-xs text-gray-500">{order.user.email}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {formatDate(new Date(order.createdAt), { month: 'short', day: 'numeric', year: 'numeric' }, 'en-US')}
                    </td>
                    <td className="px-6 py-4 text-xs font-semibold text-gray-500">
                      {order.paymentMethod === 'STRIPE' ? 'Card (Stripe)' : 'Cash on Delivery'}
                    </td>
                    <td className="px-6 py-4">
                      {order.paymentStatus === 'PAID' ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                          <Check className="h-3 w-3" />
                          Paid
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700">
                          <AlertCircle className="h-3 w-3" />
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-950">
                      {formatPrice(Number(order.total), 'USD', 'en-US')}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedOrder(order)}
                        className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-750 hover:border-gold-300 hover:text-gold-700 transition-all"
                      >
                        <FileText className="h-3.5 w-3.5" />
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

      {/* Pagination */}
      {totalPages > 1 && !selectedOrder && (
        <div className="flex items-center justify-center gap-2 pt-2 print:hidden">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage <= 1}
          >
            Previous
          </Button>
          <span className="text-sm text-gray-500">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage >= totalPages}
          >
            Next
          </Button>
        </div>
      )}

      {/* Invoice Modal Overlay */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 overflow-y-auto print:absolute print:inset-0 print:z-0 print:bg-white print:p-0">
          <div className="relative w-full max-w-3xl rounded-3xl bg-white p-6 shadow-2xl border border-gray-150 print:border-none print:shadow-none print:w-full print:max-w-none print:p-0 print:m-0 flex flex-col">
            {/* Modal Actions */}
            <div className="mb-6 flex justify-between items-center no-print print:hidden">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">INVOICE RECEIPT</span>
              <div className="flex items-center gap-2">
                <Button variant="luxury" size="sm" onClick={handlePrint}>
                  <Printer className="h-4 w-4 mr-2" />
                  Print
                </Button>
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                  aria-label="Close modal"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Printable Area */}
            <div className="space-y-8 flex-1" id="invoice-sheet">
              {/* Header */}
              <div className="flex justify-between items-start border-b border-gray-100 pb-6">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-serif text-2xl font-black tracking-wider text-gold-600">BEB FRAGRANCE</span>
                  </div>
                  <p className="text-xs text-gray-450 mt-1">premium perfume boutique</p>
                </div>
                <div className="text-right">
                  <h2 className="text-xl font-bold text-gray-900">INVOICE</h2>
                  <p className="text-sm font-semibold text-gray-600 mt-1">{selectedOrder.orderNumber}</p>
                  <p className="text-xs text-gray-450 mt-1">
                    Date:{' '}
                    {formatDate(
                      new Date(selectedOrder.createdAt),
                      { month: 'short', day: 'numeric', year: 'numeric' },
                      'en-US'
                    )}
                  </p>
                </div>
              </div>

              {/* Billing Info Grid */}
              <div className="grid grid-cols-2 gap-8 text-sm">
                <div>
                  <p className="font-bold text-gray-400 uppercase tracking-wider text-[11px] mb-2">From</p>
                  <p className="font-bold text-gray-900">Beb Fragrance Store</p>
                  <p className="text-gray-650 mt-1">Chilonzor 9-mavze, Tashkent</p>
                  <p className="text-gray-650 mt-0.5">Uzbekistan</p>
                  <p className="text-gray-650 mt-1 font-semibold">+998 (71) 123 45 67</p>
                </div>
                <div>
                  <p className="font-bold text-gray-400 uppercase tracking-wider text-[11px] mb-2">Bill To</p>
                  <p className="font-bold text-gray-900">
                    {selectedOrder.shippingAddress.firstName} {selectedOrder.shippingAddress.lastName}
                  </p>
                  <p className="text-gray-650 mt-1">{selectedOrder.shippingAddress.street}</p>
                  <p className="text-gray-650 mt-0.5">
                    {selectedOrder.shippingAddress.city}
                    {selectedOrder.shippingAddress.state ? `, ${selectedOrder.shippingAddress.state}` : ''}{' '}
                    {selectedOrder.shippingAddress.postalCode}
                  </p>
                  <p className="text-gray-650 mt-0.5">{selectedOrder.shippingAddress.country}</p>
                  <p className="text-gray-650 mt-1 font-semibold">{selectedOrder.shippingAddress.phone}</p>
                </div>
              </div>

              {/* Order Items Table */}
              <div className="overflow-hidden rounded-2xl border border-gray-150">
                <table className="min-w-full divide-y divide-gray-150 text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2.5 text-left font-bold text-gray-500 uppercase tracking-wider text-xs">Item Description</th>
                      <th className="px-4 py-2.5 text-center font-bold text-gray-500 uppercase tracking-wider text-xs">Size</th>
                      <th className="px-4 py-2.5 text-right font-bold text-gray-500 uppercase tracking-wider text-xs">Unit Price</th>
                      <th className="px-4 py-2.5 text-center font-bold text-gray-500 uppercase tracking-wider text-xs">Qty</th>
                      <th className="px-4 py-2.5 text-right font-bold text-gray-500 uppercase tracking-wider text-xs">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 bg-white">
                    {selectedOrder.items.map((item) => (
                      <tr key={item.id}>
                        <td className="px-4 py-3 font-semibold text-gray-900">{item.product.name}</td>
                        <td className="px-4 py-3 text-center text-gray-600">{item.variant.size}</td>
                        <td className="px-4 py-3 text-right text-gray-600">
                          {formatPrice(Number(item.price), 'USD', 'en-US')}
                        </td>
                        <td className="px-4 py-3 text-center font-semibold text-gray-900">{item.quantity}</td>
                        <td className="px-4 py-3 text-right font-bold text-gray-900">
                          {formatPrice(Number(item.total), 'USD', 'en-US')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Calculations Block */}
              <div className="flex justify-end pt-4">
                <div className="w-72 space-y-2 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-semibold">{formatPrice(Number(selectedOrder.subtotal), 'USD', 'en-US')}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className="font-semibold">{formatPrice(Number(selectedOrder.shippingCost), 'USD', 'en-US')}</span>
                  </div>
                  {Number(selectedOrder.discount) > 0 && (
                    <div className="flex justify-between text-pink-650 font-semibold">
                      <span>Discount</span>
                      <span>-{formatPrice(Number(selectedOrder.discount), 'USD', 'en-US')}</span>
                    </div>
                  )}
                  <div className="flex justify-between border-t border-gray-150 pt-2.5 text-base font-black text-gray-950">
                    <span>Total Amount</span>
                    <span>{formatPrice(Number(selectedOrder.total), 'USD', 'en-US')}</span>
                  </div>
                </div>
              </div>

              {/* Footer Terms */}
              <div className="border-t border-gray-100 pt-6 text-center text-xs text-gray-450">
                <p className="font-semibold">Thank you for your purchase from Beb Fragrance Boutique!</p>
                <p className="mt-1">For any queries about this invoice, contact info@bebfragrance.uz</p>
              </div>
            </div>

            {/* Print styles override */}
            <style jsx global>{`
              @media print {
                /* Hide nextjs page wrapper headers/sidebars, only show the sheet */
                body * {
                  visibility: hidden;
                }
                #invoice-sheet, #invoice-sheet * {
                  visibility: visible;
                }
                #invoice-sheet {
                  position: absolute;
                  left: 0;
                  top: 0;
                  width: 100%;
                  padding: 1.5in 1in;
                  background: white;
                }
                .no-print {
                  display: none !important;
                }
              }
            `}</style>
          </div>
        </div>
      )}
    </div>
  );
}

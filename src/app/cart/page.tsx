'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useCartStore } from '@/store/useCartStore';

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, getTotal, getItemsCount } =
    useCartStore();

  const [promoInput, setPromoInput] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0); // 0.1 for 10%
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const subtotal = getTotal() * 12800; // Multiply by 12800 to match UZS thousands scale
  const itemCount = getItemsCount();
  const isEmpty = items.length === 0;

  // Shipping cost is 20,000 UZS, free if subtotal is above 500,000 UZS
  const shipping = isEmpty ? 0 : (subtotal >= 500000 ? 0 : 20000);
  const discountAmount = subtotal * appliedDiscount;
  const totalPrice = subtotal + shipping - discountAmount;

  const handleApplyPromo = () => {
    if (promoInput.trim().toUpperCase() === 'TEST10') {
      setAppliedDiscount(0.10);
      setPromoSuccess("Promo kod muvaffaqiyatli kiritildi (10% chegirma)!");
      setPromoError('');
    } else {
      setPromoError("Noto'g'ri promo kod!");
      setPromoSuccess('');
    }
  };

  const handleCheckout = () => {
    window.location.href = '/checkout';
  };

  const formatUzPrice = (val: number) => {
    return val.toLocaleString('en-US') + " so'm";
  };

  if (!mounted) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-gray-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#2563eb] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-[70vh] bg-gray-50/50 py-10">
      <div className="container-beb">
        {/* Page Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-gray-200 pb-5">
          <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-2">
            Savat 🛒
          </h1>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="outline"
              className="h-10 rounded-[12px] border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 flex items-center gap-1.5 shadow-sm"
              asChild
            >
              <Link href="/products">
                <span className="text-sm font-bold">← Katalogga qaytish</span>
              </Link>
            </Button>

            {!isEmpty && (
              <Button
                variant="outline"
                onClick={clearCart}
                className="h-10 rounded-[12px] border border-red-200 text-red-600 bg-white hover:bg-red-50 flex items-center gap-1.5 shadow-sm transition-colors"
              >
                <Trash2 className="h-4.5 w-4.5 text-red-600" />
                <span className="text-sm font-bold">🗑 Savatni tozalash</span>
              </Button>
            )}
          </div>
        </div>

        {isEmpty ? (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-white border border-gray-200 rounded-[12px] p-6 shadow-sm">
            <div className="relative mb-5">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-50 border border-blue-100">
                <span className="text-3xl">🧴</span>
              </div>
            </div>
            <h2 className="text-xl font-bold text-gray-900">Savatingiz hozircha bo&apos;sh</h2>
            <p className="mt-2 text-sm text-gray-500 max-w-sm">
              Savatingizga hali hech narsa qo&apos;shmadingiz. Premium atirlarimizni kashf qiling!
            </p>
            <Button
              variant="default"
              className="mt-6 bg-[#2563eb] hover:bg-[#1d4ed8] text-white border-0 rounded-[12px] px-6 h-11 font-bold shadow-sm transition-colors"
              asChild
            >
              <Link href="/products">Xaridni boshlash</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            {/* Left Column — Cart items */}
            <div className="lg:col-span-8">
              <div className="rounded-[12px] border border-gray-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-4">
                  <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <span className="text-xl">🧴</span> Tanlangan mahsulotlar
                  </h2>
                  <span className="text-sm text-gray-400 font-semibold bg-gray-50 px-2.5 py-0.5 rounded-full border border-gray-100">
                    {itemCount} ta mahsulot
                  </span>
                </div>

                <div className="divide-y divide-gray-100">
                  {items.map((item) => {
                    const itemTotal = (item.price * 12800) * item.quantity;
                    return (
                      <div key={item.productId} className="flex flex-col sm:flex-row gap-4 py-5 items-start sm:items-center justify-between">
                        <div className="flex gap-4 items-center flex-1 min-w-0">
                          {/* Thumbnail */}
                          <Link href={`/products/${item.id}`} className="relative shrink-0 h-16 w-16 overflow-hidden rounded-lg bg-gray-50 border border-gray-100">
                            <Image
                              src={item.image || '/placeholder-perfume.jpg'}
                              alt={item.name}
                              fill
                              className="object-cover hover:scale-105 transition-transform duration-300"
                              sizes="64px"
                            />
                          </Link>

                          {/* Product Info */}
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-gray-900 truncate hover:text-blue-600 transition-colors">
                              <Link href={`/products/${item.id}`}>{item.name}</Link>
                            </h3>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mt-1 text-xs text-gray-500">
                              <span>Dona: {formatUzPrice(item.price * 12800)}</span>
                              <span className="hidden sm:inline">•</span>
                              <span className="font-semibold text-gray-700">Item total: {formatUzPrice(itemTotal)}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end shrink-0 mt-3 sm:mt-0">
                          {/* Circular Detail Button */}
                          <Link
                            href={`/products/${item.id}`}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 text-gray-600 hover:bg-gray-50 hover:border-gray-400 transition-colors"
                            title="Batafsil ma'lumot"
                          >
                            <span className="text-xs font-bold">ⓘ</span>
                          </Link>

                          {/* Quantity Controls: pill shaped */}
                          <div className="flex items-center rounded-full border border-gray-300 bg-white px-1 h-9">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                              className="flex h-7 w-7 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 transition-colors disabled:opacity-40 disabled:hover:bg-transparent"
                            >
                              −
                            </button>
                            <span className="w-8 text-center text-sm font-semibold text-gray-900 select-none">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                              className="flex h-7 w-7 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 transition-colors"
                            >
                              +
                            </button>
                          </div>

                          {/* ✕ Remove Button: red, rounded */}
                          <button
                            type="button"
                            onClick={() => removeItem(item.productId)}
                            className="shrink-0 rounded-lg p-2 text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors border border-transparent hover:border-red-100"
                            aria-label="Remove item"
                          >
                            <X className="h-4.5 w-4.5 text-red-600" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Column — Order summary */}
            <div className="lg:col-span-4">
              <div className="rounded-[12px] border border-gray-200 bg-white p-5 shadow-sm sticky top-24">
                {/* Summary Header */}
                <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-4">
                  <h2 className="text-lg font-bold text-gray-900 flex items-center gap-1.5">
                    <span>💲</span> Hisob
                  </h2>
                  <span className="text-[10px] font-bold text-gray-400 bg-gray-50 border border-gray-100 rounded px-2.5 py-0.5 uppercase tracking-wider">
                    Prototip
                  </span>
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3 border-b border-gray-100 pb-4 mb-4 text-sm">
                  <div className="flex justify-between">
                    <span className="font-bold text-gray-800">Subtotal</span>
                    <span className="text-gray-900">{formatUzPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-bold text-gray-800">Yetkazish</span>
                    <span className="text-gray-900 font-semibold">
                      {shipping === 0 ? "Bepul" : formatUzPrice(shipping)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-bold text-gray-800">Discount</span>
                    <span className="text-pink-600 font-semibold">
                      -{formatUzPrice(discountAmount)}
                    </span>
                  </div>
                  <div className="flex justify-between items-baseline pt-3 border-t border-gray-100">
                    <span className="text-base font-extrabold text-gray-900">Jami</span>
                    <span className="text-xl font-extrabold text-gray-900">{formatUzPrice(totalPrice)}</span>
                  </div>
                </div>

                {/* Promo Code Input */}
                <div className="space-y-2 mb-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Promo code (TEST10)"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      className="flex-1 min-w-0 rounded-[12px] border border-gray-300 px-3.5 py-2 text-sm focus:border-blue-500 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleApplyPromo}
                      className="rounded-[12px] bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 transition-colors shrink-0"
                    >
                      Kiritish
                    </button>
                  </div>
                  {promoError && <p className="text-xs font-semibold text-red-600">{promoError}</p>}
                  {promoSuccess && <p className="text-xs font-semibold text-emerald-600">{promoSuccess}</p>}
                </div>

                {/* Checkout Button: full width filled blue */}
                <Button
                  type="button"
                  onClick={handleCheckout}
                  className="w-full bg-[#2563eb] hover:bg-[#1d4ed8] text-white border-0 font-bold h-11 rounded-[12px] flex items-center justify-center gap-2 shadow-sm transition-colors"
                >
                  <span>💳</span> Buyurtma berish
                </Button>

                {/* Note */}
                <p className="mt-3 text-center text-[11px] text-gray-400 font-semibold leading-relaxed">
                  LocalStorage cart. Promo: TEST10 (10% chegirma).
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

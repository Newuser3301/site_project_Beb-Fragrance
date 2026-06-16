'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCartStore } from '@/store/useCartStore';
import { Button } from '@/components/ui/Button';

export default function CheckoutPage() {
  const { items, clearCart, getTotal, getItemsCount } = useCartStore();

  const [mounted, setMounted] = useState(false);
  const [shippingMethod, setShippingMethod] = useState<'delivery' | 'pickup'>('delivery');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cash' | 'installment' | 'transfer'>('card');

  // Form states
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('Toshkent');
  const [address, setAddress] = useState('');
  const [district, setDistrict] = useState('');
  const [comment, setComment] = useState('');

  // Card states
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  // Promo code states
  const [promoInput, setPromoInput] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0); // 0.1 for 10%
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState('');

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const subtotal = getTotal() * 12800; // Multiply by 12800 to match UZS scale
  const itemCount = getItemsCount();
  const isEmpty = items.length === 0;

  // Shipping cost calculations (free above 500,000 UZS, otherwise 20,000 UZS. Set to 0 if pickup selected)
  const shipping = shippingMethod === 'pickup' ? 0 : (subtotal >= 500000 ? 0 : 20000);
  const discountAmount = subtotal * appliedDiscount;
  const totalPrice = subtotal + shipping - discountAmount;

  // Redirect to cart if empty (and mounted)
  useEffect(() => {
    if (mounted && isEmpty) {
      window.location.href = '/cart';
    }
  }, [mounted, isEmpty]);

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

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!fullName.trim()) newErrors.fullName = "Ism-familiya kiritilishi shart";
    if (!phone.trim()) newErrors.phone = "Telefon raqami kiritilishi shart";
    
    if (shippingMethod === 'delivery') {
      if (!address.trim()) newErrors.address = "Manzil kiritilishi shart";
    }
    
    if (paymentMethod === 'card') {
      if (!cardNumber.trim()) newErrors.cardNumber = "Karta raqami kiritilishi shart";
      if (!cardName.trim()) newErrors.cardName = "Karta egasi kiritilishi shart";
      if (!cardExpiry.trim()) newErrors.cardExpiry = "Amal qilish muddati kiritilishi shart";
      if (!cardCvv.trim()) newErrors.cardCvv = "CVV kiritilishi shart";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if (validate()) {
      clearCart();
      window.location.href = '/order-confirmation.html';
    }
  };

  const formatUzPrice = (val: number) => {
    return val.toLocaleString('en-US') + " so'm";
  };

  if (!mounted || isEmpty) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-gray-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#2563eb] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-[75vh] bg-gray-50/50 py-10">
      <div className="container-beb">
        {/* Page Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-gray-200 pb-5">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-2">
              Checkout 💳
            </h1>
            <p className="text-sm text-gray-500 mt-1">Buyurtmangizni yakunlang</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="outline"
              className="h-10 rounded-[12px] border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 flex items-center gap-1.5 shadow-sm"
              asChild
            >
              <Link href="/cart">
                <span className="text-sm font-bold">← Savatga qaytish</span>
              </Link>
            </Button>

            <Button
              variant="outline"
              className="h-10 rounded-[12px] border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 flex items-center gap-1.5 shadow-sm"
              asChild
            >
              <Link href="/products">
                <span className="text-sm font-bold">🛍 Yana mahsulot</span>
              </Link>
            </Button>
          </div>
        </div>

        {/* Main Grid */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          
          {/* Left Column — Buyurtma ma'lumotlari card */}
          <div className="lg:col-span-8 space-y-6">
            <div className="rounded-[12px] border border-gray-200 bg-white p-5 shadow-sm space-y-6">
              
              {/* Card Header */}
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <span>📋</span> Buyurtma ma'lumotlari
                </h2>
                <span className="text-xs font-semibold text-gray-400 bg-gray-50 border border-gray-100 rounded px-2.5 py-0.5 uppercase tracking-wider">
                  Prototip form
                </span>
              </div>

              {/* Yetkazish usuli toggle (pill buttons) */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-800">Yetkazib berish usuli</label>
                <div className="inline-flex rounded-full bg-gray-100 p-1 border border-gray-200">
                  <button
                    type="button"
                    onClick={() => {
                      setShippingMethod('delivery');
                      const errs = { ...errors };
                      delete errs.address;
                      setErrors(errs);
                    }}
                    className={`rounded-full px-5 py-2 text-xs font-bold transition-all flex items-center gap-1.5 ${
                      shippingMethod === 'delivery'
                        ? 'bg-white text-blue-600 shadow-sm border border-gray-200/50'
                        : 'text-gray-500 hover:text-gray-800'
                    }`}
                  >
                    <span>🚚</span> Delivery
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShippingMethod('pickup');
                      const errs = { ...errors };
                      delete errs.address;
                      setErrors(errs);
                    }}
                    className={`rounded-full px-5 py-2 text-xs font-bold transition-all flex items-center gap-1.5 ${
                      shippingMethod === 'pickup'
                        ? 'bg-white text-blue-600 shadow-sm border border-gray-200/50'
                        : 'text-gray-500 hover:text-gray-800'
                    }`}
                  >
                    <span>📍</span> Pickup
                  </button>
                </div>
              </div>

              {/* Form fields grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Ism-familiya */}
                <div className="space-y-1.5">
                  <label className="block text-sm font-semibold text-gray-800">Ism-familiya <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    placeholder="Masalan: Azizbek Karimov"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className={`w-full rounded-[12px] border ${
                      submitted && errors.fullName ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                    } px-3.5 py-2.5 text-sm focus:outline-none transition-colors`}
                  />
                  {submitted && errors.fullName && <p className="text-xs text-red-500 font-medium">{errors.fullName}</p>}
                </div>

                {/* Telefon */}
                <div className="space-y-1.5">
                  <label className="block text-sm font-semibold text-gray-800">Telefon <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    placeholder="Masalan: +998 90 123 45 67"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={`w-full rounded-[12px] border ${
                      submitted && errors.phone ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                    } px-3.5 py-2.5 text-sm focus:outline-none transition-colors`}
                  />
                  {submitted && errors.phone && <p className="text-xs text-red-500 font-medium">{errors.phone}</p>}
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label className="block text-sm font-semibold text-gray-800">Email (ixtiyoriy)</label>
                  <input
                    type="email"
                    placeholder="you@mail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-[12px] border border-gray-300 px-3.5 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>

                {/* Shahar (visible only for delivery) */}
                {shippingMethod === 'delivery' && (
                  <div className="space-y-1.5">
                    <label className="block text-sm font-semibold text-gray-800">Shahar</label>
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full rounded-[12px] border border-gray-300 px-3.5 py-2.5 text-sm focus:border-blue-500 focus:outline-none bg-white"
                    >
                      {['Toshkent', 'Samarqand', 'Buxoro', 'Andijon', 'Farg\'ona', 'Namangan', 'Xorazm', 'Navoiy', 'Jizzax', 'Sirdaryo', 'Qashqadaryo', 'Surxondaryo', 'Qoraqalpog\'iston'].map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Manzil (visible only for delivery) */}
                {shippingMethod === 'delivery' && (
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="block text-sm font-semibold text-gray-800">Manzil <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      placeholder="Ko'cha, uy, xonadon"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className={`w-full rounded-[12px] border ${
                        submitted && errors.address ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                      } px-3.5 py-2.5 text-sm focus:outline-none transition-colors`}
                    />
                    {submitted && errors.address && <p className="text-xs text-red-500 font-medium">{errors.address}</p>}
                  </div>
                )}

                {/* Tuman (visible only for delivery) */}
                {shippingMethod === 'delivery' && (
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="block text-sm font-semibold text-gray-800">Tuman (ixtiyoriy)</label>
                    <input
                      type="text"
                      placeholder="Masalan: Yunusobod"
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      className="w-full rounded-[12px] border border-gray-300 px-3.5 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                )}

                {/* Izoh */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="block text-sm font-semibold text-gray-800">Izoh (ixtiyoriy)</label>
                  <textarea
                    placeholder="Kur'yer uchun izoh: domofon, yo'nalish, vaqt..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={3}
                    className="w-full rounded-[12px] border border-gray-300 px-3.5 py-2.5 text-sm focus:border-blue-500 focus:outline-none resize-none"
                  />
                </div>
              </div>

              {/* To'lov usuli (demo) — 2×2 radio grid */}
              <div className="space-y-3 pt-4 border-t border-gray-100">
                <label className="block text-sm font-bold text-gray-800">To&apos;lov usuli (demo)</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  
                  {/* Bank Karta */}
                  <label className={`flex gap-3 p-4 rounded-[12px] border cursor-pointer transition-all ${
                    paymentMethod === 'card'
                      ? 'border-[#2563eb] bg-blue-50/50'
                      : 'border-gray-200 bg-white hover:bg-gray-50'
                  }`}>
                    <input
                      type="radio"
                      name="payment_method"
                      checked={paymentMethod === 'card'}
                      onChange={() => setPaymentMethod('card')}
                      className="mt-1 accent-[#2563eb]"
                    />
                    <div>
                      <span className="block text-sm font-bold text-gray-900">🏦 Bank karta</span>
                      <span className="block text-xs text-gray-500 mt-0.5">Demo: karta raqami tekshirilmaydi</span>
                    </div>
                  </label>

                  {/* Naqd */}
                  <label className={`flex gap-3 p-4 rounded-[12px] border cursor-pointer transition-all ${
                    paymentMethod === 'cash'
                      ? 'border-[#2563eb] bg-blue-50/50'
                      : 'border-gray-200 bg-white hover:bg-gray-50'
                  }`}>
                    <input
                      type="radio"
                      name="payment_method"
                      checked={paymentMethod === 'cash'}
                      onChange={() => {
                        setPaymentMethod('cash');
                        const errs = { ...errors };
                        delete errs.cardNumber;
                        delete errs.cardName;
                        delete errs.cardExpiry;
                        delete errs.cardCvv;
                        setErrors(errs);
                      }}
                      className="mt-1 accent-[#2563eb]"
                    />
                    <div>
                      <span className="block text-sm font-bold text-gray-900">💵 Naqd</span>
                      <span className="block text-xs text-gray-500 mt-0.5">Kur&apos;yerga naqd to&apos;lov (demo)</span>
                    </div>
                  </label>

                  {/* Bo'lib to'lash */}
                  <label className={`flex gap-3 p-4 rounded-[12px] border cursor-pointer transition-all ${
                    paymentMethod === 'installment'
                      ? 'border-[#2563eb] bg-blue-50/50'
                      : 'border-gray-200 bg-white hover:bg-gray-50'
                  }`}>
                    <input
                      type="radio"
                      name="payment_method"
                      checked={paymentMethod === 'installment'}
                      onChange={() => {
                        setPaymentMethod('installment');
                        const errs = { ...errors };
                        delete errs.cardNumber;
                        delete errs.cardName;
                        delete errs.cardExpiry;
                        delete errs.cardCvv;
                        setErrors(errs);
                      }}
                      className="mt-1 accent-[#2563eb]"
                    />
                    <div>
                      <span className="block text-sm font-bold text-gray-900">📅 Bo&apos;lib to&apos;lash</span>
                      <span className="block text-xs text-gray-500 mt-0.5">3/6/12 oy (demo)</span>
                    </div>
                  </label>

                  {/* Bank o'tkazma */}
                  <label className={`flex gap-3 p-4 rounded-[12px] border cursor-pointer transition-all ${
                    paymentMethod === 'transfer'
                      ? 'border-[#2563eb] bg-blue-50/50'
                      : 'border-gray-200 bg-white hover:bg-gray-50'
                  }`}>
                    <input
                      type="radio"
                      name="payment_method"
                      checked={paymentMethod === 'transfer'}
                      onChange={() => {
                        setPaymentMethod('transfer');
                        const errs = { ...errors };
                        delete errs.cardNumber;
                        delete errs.cardName;
                        delete errs.cardExpiry;
                        delete errs.cardCvv;
                        setErrors(errs);
                      }}
                      className="mt-1 accent-[#2563eb]"
                    />
                    <div>
                      <span className="block text-sm font-bold text-gray-900">🏢 Bank o&apos;tkazma</span>
                      <span className="block text-xs text-gray-500 mt-0.5">Invoice (demo)</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Card Fields (shown only when card selected) */}
              {paymentMethod === 'card' && (
                <div className="p-4 rounded-[12px] bg-gray-50 border border-gray-200 space-y-4 pt-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Karta raqami */}
                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide">Karta raqami <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        placeholder="8600 1234 5678 9012"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className={`w-full rounded-[12px] border ${
                          submitted && errors.cardNumber ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                        } px-3.5 py-2.5 text-sm focus:outline-none transition-colors bg-white`}
                      />
                      {submitted && errors.cardNumber && <p className="text-xs text-red-500 font-medium">{errors.cardNumber}</p>}
                    </div>

                    {/* Karta egasi */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide">Karta egasi <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        placeholder="AZIZBEK KARIMOV"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        className={`w-full rounded-[12px] border ${
                          submitted && errors.cardName ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                        } px-3.5 py-2.5 text-sm focus:outline-none transition-colors bg-white`}
                      />
                      {submitted && errors.cardName && <p className="text-xs text-red-500 font-medium">{errors.cardName}</p>}
                    </div>

                    {/* Expiry and CVV */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide">Muddati <span className="text-red-500">*</span></label>
                        <input
                          type="text"
                          placeholder="MM/YY"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          className={`w-full rounded-[12px] border ${
                            submitted && errors.cardExpiry ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                          } px-3.5 py-2.5 text-sm focus:outline-none transition-colors bg-white text-center`}
                        />
                        {submitted && errors.cardExpiry && <p className="text-xs text-red-500 font-medium">{errors.cardExpiry}</p>}
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide">CVV <span className="text-red-500">*</span></label>
                        <input
                          type="text"
                          placeholder="123"
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          className={`w-full rounded-[12px] border ${
                            submitted && errors.cardCvv ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                          } px-3.5 py-2.5 text-sm focus:outline-none transition-colors bg-white text-center`}
                        />
                        {submitted && errors.cardCvv && <p className="text-xs text-red-500 font-medium">{errors.cardCvv}</p>}
                      </div>
                    </div>
                  </div>

                  {/* Note */}
                  <p className="text-xs font-semibold text-emerald-600">
                    Demo: bu maydonlar faqat UI uchun. Real payment yo&apos;q.
                  </p>
                </div>
              )}

              {/* Bottom info box */}
              <div className="rounded-[12px] border border-blue-100 bg-[#f8fbff] p-4 text-xs space-y-2 text-gray-600 font-medium">
                <p className="flex items-center gap-1.5 text-gray-700 font-bold">
                  <span>🚚</span> Delivery: Toshkent 1–2 kun, viloyatlar 2–4 kun (demo).
                </p>
                <p className="flex items-center gap-1.5">
                  <span>📦</span> Shipping narxi shahar bo&apos;yicha hisoblanadi.
                </p>
                <p className="flex items-center gap-1.5 text-emerald-600 font-bold">
                  <span>✨</span> Atirlar ehtiyotkorlik bilan qadoqlanadi.
                </p>
              </div>

            </div>
          </div>

          {/* Right Column — Buyurtma xulosasi card */}
          <div className="lg:col-span-4 space-y-6">
            <div className="rounded-[12px] border border-gray-200 bg-white p-5 shadow-sm space-y-6">
              
              {/* Header */}
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-1.5">
                  <span>💲</span> Buyurtma xulosasi
                </h2>
                <span className="text-sm text-gray-400 font-semibold bg-gray-50 border border-gray-100 rounded px-2.5 py-0.5">
                  {itemCount} ta mahsulot
                </span>
              </div>

              {/* Price rows */}
              <div className="space-y-3 border-b border-gray-100 pb-4 text-sm">
                <div className="flex justify-between">
                  <span className="font-bold text-gray-800 font-medium">Subtotal</span>
                  <span className="text-gray-900 font-semibold">{formatUzPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold text-gray-800 font-medium">Yetkazish</span>
                  <span className="text-gray-900 font-semibold">
                    {shipping === 0 ? "Bepul" : formatUzPrice(shipping)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold text-gray-800 font-medium">Discount</span>
                  <span className="text-pink-600 font-semibold">-{formatUzPrice(discountAmount)}</span>
                </div>
                <div className="flex justify-between items-baseline pt-3 border-t border-gray-100">
                  <span className="text-base font-extrabold text-gray-900">Jami</span>
                  <span className="text-xl font-extrabold text-gray-900">{formatUzPrice(totalPrice)}</span>
                </div>
              </div>

              {/* Promo input */}
              <div className="space-y-2">
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

              {/* Checkout Button: full width blue */}
              <button
                type="submit"
                className="w-full bg-[#2563eb] hover:bg-[#1d4ed8] text-white border-0 font-bold h-11 rounded-[12px] flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
              >
                <span>✅</span> Buyurtmani yakunlash (demo)
              </button>

              {/* Green notes */}
              <div className="rounded-[12px] bg-emerald-50/50 border border-emerald-100 p-4 text-[11px] text-emerald-800 font-semibold space-y-1.5 leading-relaxed">
                <p className="flex items-center gap-1.5">
                  <span>✅</span> LocalStorage cart.
                </p>
                <p className="flex items-center gap-1.5">
                  <span>🖊</span> Promo: TEST10 (10% chegirma).
                </p>
                <p className="flex items-center gap-1.5">
                  <span>📋</span> Demo order: order-confirmation.html ga o&apos;tadi.
                </p>
              </div>

              {/* Items Section below summary in the same card */}
              <div className="space-y-4 pt-4 border-t border-gray-100">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                    <span>📦</span> Items
                  </span>
                  <Link href="/cart" className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 hover:underline">
                    <span>✏️</span> Savat edit
                  </Link>
                </div>

                <div className="space-y-3 max-h-[250px] overflow-y-auto pr-1">
                  {items.map((item) => {
                    const itemTotal = (item.price * 12800) * item.quantity;
                    return (
                      <div key={item.productId} className="flex gap-3 items-center text-xs justify-between">
                        <div className="flex gap-2.5 items-center flex-1 min-w-0">
                          {/* Thumbnail */}
                          <div className="relative shrink-0 h-10 w-10 overflow-hidden rounded bg-gray-50 border border-gray-100">
                            <Image
                              src={item.image || '/placeholder-perfume.jpg'}
                              alt={item.name}
                              fill
                              className="object-cover"
                              sizes="40px"
                            />
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-bold text-gray-900 truncate">{item.name}</h4>
                            <p className="text-[10px] text-gray-400 font-medium">{item.volume}</p>
                          </div>
                        </div>

                        {/* Pills info */}
                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className="rounded-full bg-gray-50 border border-gray-200 px-2 py-0.5 text-[10px] text-gray-600 font-bold">
                            Qty: {item.quantity}
                          </span>
                          <span className="rounded-full bg-gray-50 border border-gray-200 px-2 py-0.5 text-[10px] text-gray-600 font-bold">
                            {formatUzPrice(item.price * 12800)}
                          </span>
                          <span className="rounded-full bg-blue-50 border border-blue-100 px-2 py-0.5 text-[10px] text-blue-700 font-bold">
                            {formatUzPrice(itemTotal)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          </div>

        </form>
      </div>
    </div>
  );
}


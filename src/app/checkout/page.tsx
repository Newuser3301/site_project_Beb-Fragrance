'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCartStore } from '@/store/useCartStore';
import { Button } from '@/components/ui/Button';
import { Copy, Check, ExternalLink, Wallet } from 'lucide-react';
import { toast } from 'sonner';

type PaymentType = 'card' | 'cash' | 'ton' | 'installment' | 'transfer';

export default function CheckoutPage() {
  const { items, clearCart, getTotal, getItemsCount } = useCartStore();

  const [mounted, setMounted] = useState(false);
  const [shippingMethod, setShippingMethod] = useState<'delivery' | 'pickup'>('delivery');
  const [paymentMethod, setPaymentMethod] = useState<PaymentType>('card');

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

  // TON states
  const [tonCopied, setTonCopied] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  // Promo code states
  const [promoInput, setPromoInput] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState('');

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const tonAddress = process.env.NEXT_PUBLIC_TON_WALLET_ADDRESS || 'UQDE9lEqD9uS0RPTU4DmxPAs4CgZVDe79ZjkhkLqJiDM-_Kp';

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (paymentMethod === 'ton' && !qrCodeUrl) {
      import('qrcode').then((QRCode) => {
        QRCode.toDataURL(tonAddress, { margin: 2, scale: 5 })
          .then((url) => setQrCodeUrl(url))
          .catch(() => {});
      });
    }
  }, [paymentMethod, tonAddress, qrCodeUrl]);

  const subtotal = getTotal() * 12800;
  const itemCount = getItemsCount();
  const isEmpty = items.length === 0;

  const shipping = shippingMethod === 'pickup' ? 0 : (subtotal >= 500000 ? 0 : 20000);
  const discountAmount = subtotal * appliedDiscount;
  const totalPrice = subtotal + shipping - discountAmount;

  // TON conversion: 1 USD = 12800 UZS, 1 TON = 7.2 USD
  const totalUsd = totalPrice / 12800;
  const totalTon = totalUsd / 7.2;

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

  const handleCopyTon = useCallback(() => {
    navigator.clipboard.writeText(tonAddress);
    setTonCopied(true);
    toast.success('TON manzili nusxalandi!');
    setTimeout(() => setTonCopied(false), 2500);
  }, [tonAddress]);

  const clearCardErrors = (errs: Record<string, string>) => {
    const e = { ...errs };
    delete e.cardNumber;
    delete e.cardName;
    delete e.cardExpiry;
    delete e.cardCvv;
    return e;
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

  const formatUzPrice = (val: number) => val.toLocaleString('en-US') + " so'm";

  const inputClass = (field?: string) =>
    `w-full rounded-[12px] border px-3.5 py-2.5 text-sm focus:outline-none transition-colors
     bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100
     placeholder:text-gray-400 dark:placeholder:text-slate-500
     ${submitted && field && errors[field]
       ? 'border-red-500 focus:border-red-500'
       : 'border-gray-300 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-400'}`;

  if (!mounted || isEmpty) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-gray-50 dark:bg-slate-950">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#2563eb] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-[75vh] bg-gray-50/50 dark:bg-slate-950 py-10">
      <div className="container-beb">
        {/* Page Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-gray-200 dark:border-slate-800 pb-5">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
              Checkout 💳
            </h1>
            <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">Buyurtmangizni yakunlang</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="outline" className="h-10 rounded-[12px] border border-gray-300 dark:border-slate-700 text-gray-700 dark:text-slate-300 bg-white dark:bg-slate-900 hover:bg-gray-50 dark:hover:bg-slate-800 flex items-center gap-1.5 shadow-sm" asChild>
              <Link href="/cart"><span className="text-sm font-bold">← Savatga qaytish</span></Link>
            </Button>
            <Button variant="outline" className="h-10 rounded-[12px] border border-gray-300 dark:border-slate-700 text-gray-700 dark:text-slate-300 bg-white dark:bg-slate-900 hover:bg-gray-50 dark:hover:bg-slate-800 flex items-center gap-1.5 shadow-sm" asChild>
              <Link href="/products"><span className="text-sm font-bold">🛍 Yana mahsulot</span></Link>
            </Button>
          </div>
        </div>

        {/* Main Grid */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-8 lg:grid-cols-12">

          {/* Left Column */}
          <div className="lg:col-span-8 space-y-6">
            <div className="rounded-[12px] border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-6">

              {/* Card Header */}
              <div className="flex items-center justify-between border-b border-gray-100 dark:border-slate-800 pb-4">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <span>📋</span> Buyurtma ma&apos;lumotlari
                </h2>
                <span className="text-xs font-semibold text-gray-400 dark:text-slate-500 bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded px-2.5 py-0.5 uppercase tracking-wider">
                  Prototip form
                </span>
              </div>

              {/* Yetkazish usuli */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-800 dark:text-slate-200">Yetkazib berish usuli</label>
                <div className="inline-flex rounded-full bg-gray-100 dark:bg-slate-800 p-1 border border-gray-200 dark:border-slate-700">
                  <button type="button"
                    onClick={() => { setShippingMethod('delivery'); setErrors(e => { const n = {...e}; delete n.address; return n; }); }}
                    className={`rounded-full px-5 py-2 text-xs font-bold transition-all flex items-center gap-1.5 ${
                      shippingMethod === 'delivery'
                        ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm border border-gray-200/50 dark:border-slate-600'
                        : 'text-gray-500 dark:text-slate-400 hover:text-gray-800 dark:hover:text-slate-200'
                    }`}>
                    <span>🚚</span> Delivery
                  </button>
                  <button type="button"
                    onClick={() => { setShippingMethod('pickup'); setErrors(e => { const n = {...e}; delete n.address; return n; }); }}
                    className={`rounded-full px-5 py-2 text-xs font-bold transition-all flex items-center gap-1.5 ${
                      shippingMethod === 'pickup'
                        ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm border border-gray-200/50 dark:border-slate-600'
                        : 'text-gray-500 dark:text-slate-400 hover:text-gray-800 dark:hover:text-slate-200'
                    }`}>
                    <span>📍</span> Pickup
                  </button>
                </div>
              </div>

              {/* Form fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-sm font-semibold text-gray-800 dark:text-slate-200">Ism-familiya <span className="text-red-500">*</span></label>
                  <input type="text" placeholder="Masalan: Azizbek Karimov" value={fullName} onChange={e => setFullName(e.target.value)} className={inputClass('fullName')} />
                  {submitted && errors.fullName && <p className="text-xs text-red-500 font-medium">{errors.fullName}</p>}
                </div>
                <div className="space-y-1.5">
                  <label className="block text-sm font-semibold text-gray-800 dark:text-slate-200">Telefon <span className="text-red-500">*</span></label>
                  <input type="text" placeholder="Masalan: +998 90 123 45 67" value={phone} onChange={e => setPhone(e.target.value)} className={inputClass('phone')} />
                  {submitted && errors.phone && <p className="text-xs text-red-500 font-medium">{errors.phone}</p>}
                </div>
                <div className="space-y-1.5">
                  <label className="block text-sm font-semibold text-gray-800 dark:text-slate-200">Email (ixtiyoriy)</label>
                  <input type="email" placeholder="you@mail.com" value={email} onChange={e => setEmail(e.target.value)} className={inputClass()} />
                </div>
                {shippingMethod === 'delivery' && (
                  <div className="space-y-1.5">
                    <label className="block text-sm font-semibold text-gray-800 dark:text-slate-200">Shahar</label>
                    <select value={city} onChange={e => setCity(e.target.value)} className={inputClass()}>
                      {['Toshkent','Samarqand','Buxoro','Andijon',"Farg'ona",'Namangan','Xorazm','Navoiy','Jizzax','Sirdaryo','Qashqadaryo','Surxondaryo',"Qoraqalpog'iston"].map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                )}
                {shippingMethod === 'delivery' && (
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="block text-sm font-semibold text-gray-800 dark:text-slate-200">Manzil <span className="text-red-500">*</span></label>
                    <input type="text" placeholder="Ko'cha, uy, xonadon" value={address} onChange={e => setAddress(e.target.value)} className={inputClass('address')} />
                    {submitted && errors.address && <p className="text-xs text-red-500 font-medium">{errors.address}</p>}
                  </div>
                )}
                {shippingMethod === 'delivery' && (
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="block text-sm font-semibold text-gray-800 dark:text-slate-200">Tuman (ixtiyoriy)</label>
                    <input type="text" placeholder="Masalan: Yunusobod" value={district} onChange={e => setDistrict(e.target.value)} className={inputClass()} />
                  </div>
                )}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="block text-sm font-semibold text-gray-800 dark:text-slate-200">Izoh (ixtiyoriy)</label>
                  <textarea placeholder="Kur'yer uchun izoh: domofon, yo'nalish, vaqt..." value={comment} onChange={e => setComment(e.target.value)} rows={3}
                    className="w-full rounded-[12px] border border-gray-300 dark:border-slate-700 px-3.5 py-2.5 text-sm focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none resize-none bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 placeholder:text-gray-400 dark:placeholder:text-slate-500" />
                </div>
              </div>

              {/* To'lov usuli */}
              <div className="space-y-3 pt-4 border-t border-gray-100 dark:border-slate-800">
                <label className="block text-sm font-bold text-gray-800 dark:text-slate-200">To&apos;lov usuli</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                  {/* Bank Karta */}
                  {(['card','cash','installment','transfer'] as PaymentType[]).map((method) => {
                    const labels: Record<string, { icon: string; title: string; sub: string }> = {
                      card:        { icon: '🏦', title: 'Bank karta', sub: 'Demo: karta raqami tekshirilmaydi' },
                      cash:        { icon: '💵', title: 'Naqd', sub: "Kur'yerga naqd to'lov (demo)" },
                      installment: { icon: '📅', title: "Bo'lib to'lash", sub: '3/6/12 oy (demo)' },
                      transfer:    { icon: '🏢', title: "Bank o'tkazma", sub: 'Invoice (demo)' },
                    };
                    const info = labels[method];
                    return (
                      <label key={method} className={`flex gap-3 p-4 rounded-[12px] border cursor-pointer transition-all ${
                        paymentMethod === method
                          ? 'border-[#2563eb] bg-blue-50/50 dark:bg-blue-950/30 dark:border-blue-500'
                          : 'border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-750'
                      }`}>
                        <input type="radio" name="payment_method" checked={paymentMethod === method}
                          onChange={() => setPaymentMethod(method === 'cash' || method === 'installment' || method === 'transfer' ? (() => { setPaymentMethod(method); setErrors(clearCardErrors); return method; })() : method)}
                          className="mt-1 accent-[#2563eb]" />
                        <div>
                          <span className="block text-sm font-bold text-gray-900 dark:text-slate-100">{info.icon} {info.title}</span>
                          <span className="block text-xs text-gray-500 dark:text-slate-400 mt-0.5">{info.sub}</span>
                        </div>
                      </label>
                    );
                  })}

                  {/* TON Wallet */}
                  <label className={`flex gap-3 p-4 rounded-[12px] border cursor-pointer transition-all sm:col-span-2 ${
                    paymentMethod === 'ton'
                      ? 'border-[#2563eb] bg-blue-50/50 dark:bg-blue-950/30 dark:border-blue-500'
                      : 'border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-750'
                  }`}>
                    <input type="radio" name="payment_method" checked={paymentMethod === 'ton'}
                      onChange={() => { setPaymentMethod('ton'); setErrors(clearCardErrors); }}
                      className="mt-1 accent-[#2563eb]" />
                    <div className="flex-1">
                      <span className="block text-sm font-bold text-gray-900 dark:text-slate-100">
                        <Wallet className="inline-block h-4 w-4 mr-1 text-[#0088cc]" />
                        Telegram Wallet (TON)
                      </span>
                      <span className="block text-xs text-gray-500 dark:text-slate-400 mt-0.5">
                        TON kripto-valyuta orqali to&apos;lash
                      </span>
                    </div>
                    <div className="shrink-0 text-right hidden sm:block">
                      <span className="inline-block bg-[#0088cc]/10 text-[#0088cc] text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#0088cc]/20">
                        {totalTon.toFixed(4)} TON
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              {/* TON Panel */}
              {paymentMethod === 'ton' && (
                <div className="rounded-[12px] border border-[#0088cc]/30 bg-[#f0f8ff] dark:bg-slate-800/60 dark:border-slate-700 p-5 space-y-4">
                  {/* Rate summary */}
                  <div className="grid grid-cols-3 gap-2 text-center divide-x divide-gray-200 dark:divide-slate-700 border border-gray-200 dark:border-slate-700 rounded-xl p-3 bg-white dark:bg-slate-900">
                    <div>
                      <p className="text-[10px] text-gray-400 dark:text-slate-500 uppercase tracking-wider">UZS</p>
                      <p className="text-sm font-extrabold text-gray-900 dark:text-white">{formatUzPrice(totalPrice)}</p>
                    </div>
                    <div className="pl-2">
                      <p className="text-[10px] text-gray-400 dark:text-slate-500 uppercase tracking-wider">USD</p>
                      <p className="text-sm font-extrabold text-gray-900 dark:text-white">${totalUsd.toFixed(2)}</p>
                    </div>
                    <div className="pl-2">
                      <p className="text-[10px] text-[#0088cc] uppercase tracking-wider font-bold">TON</p>
                      <p className="text-sm font-extrabold text-[#0088cc]">{totalTon.toFixed(4)}</p>
                    </div>
                  </div>
                  <p className="text-[10px] text-gray-400 dark:text-slate-500 text-center">
                    1 USD = 12,800 UZS · 1 TON = 7.2 USD (taxminiy kurs)
                  </p>

                  {/* Wallet address */}
                  <div className="space-y-1.5">
                    <p className="text-xs font-bold text-gray-700 dark:text-slate-300 uppercase tracking-wider">TON Wallet Manzili</p>
                    <div className="flex gap-2 items-stretch">
                      <div className="flex-1 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-[11px] font-mono text-gray-800 dark:text-slate-200 break-all select-all min-h-[44px] flex items-center">
                        {tonAddress}
                      </div>
                      <button type="button" onClick={handleCopyTon}
                        className={`shrink-0 flex items-center gap-1.5 px-4 rounded-xl border text-sm font-semibold transition-all active:scale-95 ${
                          tonCopied
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-700 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-300'
                            : 'bg-white dark:bg-slate-900 border-gray-300 dark:border-slate-700 text-gray-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-800'
                        }`}>
                        {tonCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        <span>{tonCopied ? 'Nusxalandi' : 'Nusxa'}</span>
                      </button>
                    </div>
                  </div>

                  {/* QR + instructions */}
                  <div className="flex flex-col sm:flex-row gap-5 p-4 bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-700">
                    {qrCodeUrl ? (
                      <div className="flex flex-col items-center shrink-0">
                        <div className="border-2 border-gray-200 dark:border-slate-700 rounded-xl p-2 bg-white">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={qrCodeUrl} alt="TON QR" className="h-28 w-28 object-contain" />
                        </div>
                        <span className="text-[10px] text-gray-400 dark:text-slate-500 mt-1">QR skan qiling</span>
                      </div>
                    ) : (
                      <div className="h-32 w-32 shrink-0 bg-gray-100 dark:bg-slate-800 animate-pulse rounded-xl flex items-center justify-center text-xs text-gray-400">QR...</div>
                    )}
                    <div className="space-y-2 flex-1">
                      <p className="text-sm font-bold text-gray-800 dark:text-slate-200">Ko&apos;rsatmalar:</p>
                      <ol className="list-decimal pl-4 text-xs text-gray-600 dark:text-slate-400 space-y-1.5">
                        <li>Yuqoridagi manzilni nusxalang yoki QR kodni skan qiling.</li>
                        <li>Aynan <strong className="text-gray-900 dark:text-slate-200">{totalTon.toFixed(4)} TON</strong> yuboring.</li>
                        <li>To&apos;lov tasdiqlangandan so&apos;ng buyurtma raqamini administratorga yuboring.</li>
                        <li>Buyurtmangiz <strong className="text-gray-900 dark:text-slate-200">24–48 soat</strong> ichida yetkaziladi.</li>
                      </ol>
                    </div>
                  </div>

                  {/* Open Telegram */}
                  <a href="https://t.me/wallet" target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full bg-[#0088cc] hover:bg-[#0077b5] text-white font-semibold py-3 rounded-xl transition-all text-sm active:scale-[0.98] shadow-sm">
                    <span>Telegram Wallet orqali to&apos;lash</span>
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              )}

              {/* Card Fields */}
              {paymentMethod === 'card' && (
                <div className="p-4 rounded-[12px] bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 uppercase tracking-wide">Karta raqami <span className="text-red-500">*</span></label>
                      <input type="text" placeholder="8600 1234 5678 9012" value={cardNumber} onChange={e => setCardNumber(e.target.value)} className={inputClass('cardNumber')} />
                      {submitted && errors.cardNumber && <p className="text-xs text-red-500 font-medium">{errors.cardNumber}</p>}
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 uppercase tracking-wide">Karta egasi <span className="text-red-500">*</span></label>
                      <input type="text" placeholder="AZIZBEK KARIMOV" value={cardName} onChange={e => setCardName(e.target.value)} className={inputClass('cardName')} />
                      {submitted && errors.cardName && <p className="text-xs text-red-500 font-medium">{errors.cardName}</p>}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 uppercase tracking-wide">Muddati <span className="text-red-500">*</span></label>
                        <input type="text" placeholder="MM/YY" value={cardExpiry} onChange={e => setCardExpiry(e.target.value)} className={inputClass('cardExpiry') + ' text-center'} />
                        {submitted && errors.cardExpiry && <p className="text-xs text-red-500 font-medium">{errors.cardExpiry}</p>}
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 uppercase tracking-wide">CVV <span className="text-red-500">*</span></label>
                        <input type="text" placeholder="123" value={cardCvv} onChange={e => setCardCvv(e.target.value)} className={inputClass('cardCvv') + ' text-center'} />
                        {submitted && errors.cardCvv && <p className="text-xs text-red-500 font-medium">{errors.cardCvv}</p>}
                      </div>
                    </div>
                  </div>
                  <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    Demo: bu maydonlar faqat UI uchun. Real payment yo&apos;q.
                  </p>
                </div>
              )}

              {/* Bottom info box */}
              <div className="rounded-[12px] border border-blue-100 dark:border-slate-700 bg-[#f8fbff] dark:bg-slate-800 p-4 text-xs space-y-2 text-gray-600 dark:text-slate-400 font-medium">
                <p className="flex items-center gap-1.5 text-gray-700 dark:text-slate-300 font-bold">
                  <span>🚚</span> Delivery: Toshkent 1–2 kun, viloyatlar 2–4 kun (demo).
                </p>
                <p className="flex items-center gap-1.5">
                  <span>📦</span> Shipping narxi shahar bo&apos;yicha hisoblanadi.
                </p>
                <p className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold">
                  <span>✨</span> Atirlar ehtiyotkorlik bilan qadoqlanadi.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column — Buyurtma xulosasi */}
          <div className="lg:col-span-4 space-y-6">
            <div className="rounded-[12px] border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-6">

              <div className="flex items-center justify-between border-b border-gray-100 dark:border-slate-800 pb-4">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                  <span>💲</span> Buyurtma xulosasi
                </h2>
                <span className="text-sm text-gray-400 dark:text-slate-500 font-semibold bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded px-2.5 py-0.5">
                  {itemCount} ta mahsulot
                </span>
              </div>

              {/* Price rows */}
              <div className="space-y-3 border-b border-gray-100 dark:border-slate-800 pb-4 text-sm">
                <div className="flex justify-between">
                  <span className="font-bold text-gray-800 dark:text-slate-300">Subtotal</span>
                  <span className="text-gray-900 dark:text-slate-200 font-semibold">{formatUzPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold text-gray-800 dark:text-slate-300">Yetkazish</span>
                  <span className="text-gray-900 dark:text-slate-200 font-semibold">{shipping === 0 ? "Bepul" : formatUzPrice(shipping)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold text-gray-800 dark:text-slate-300">Discount</span>
                  <span className="text-pink-600 dark:text-pink-400 font-semibold">-{formatUzPrice(discountAmount)}</span>
                </div>
                <div className="flex justify-between items-baseline pt-3 border-t border-gray-100 dark:border-slate-800">
                  <span className="text-base font-extrabold text-gray-900 dark:text-white">Jami</span>
                  <span className="text-xl font-extrabold text-gray-900 dark:text-white">{formatUzPrice(totalPrice)}</span>
                </div>
              </div>

              {/* Promo input */}
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input type="text" placeholder="Promo code (TEST10)" value={promoInput} onChange={e => setPromoInput(e.target.value)}
                    className="flex-1 min-w-0 rounded-[12px] border border-gray-300 dark:border-slate-700 px-3.5 py-2 text-sm focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 placeholder:text-gray-400 dark:placeholder:text-slate-500" />
                  <button type="button" onClick={handleApplyPromo}
                    className="rounded-[12px] bg-slate-900 dark:bg-slate-700 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 dark:hover:bg-slate-600 transition-colors shrink-0">
                    Kiritish
                  </button>
                </div>
                {promoError && <p className="text-xs font-semibold text-red-600 dark:text-red-400">{promoError}</p>}
                {promoSuccess && <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">{promoSuccess}</p>}
              </div>

              {/* Checkout Button */}
              <button type="submit"
                className="w-full bg-[#2563eb] hover:bg-[#1d4ed8] text-white border-0 font-bold h-11 rounded-[12px] flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer">
                <span>✅</span> Buyurtmani yakunlash (demo)
              </button>

              {/* Green notes */}
              <div className="rounded-[12px] bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 p-4 text-[11px] text-emerald-800 dark:text-emerald-400 font-semibold space-y-1.5 leading-relaxed">
                <p className="flex items-center gap-1.5"><span>✅</span> LocalStorage cart.</p>
                <p className="flex items-center gap-1.5"><span>🖊</span> Promo: TEST10 (10% chegirma).</p>
                <p className="flex items-center gap-1.5"><span>📋</span> Demo order: order-confirmation.html ga o&apos;tadi.</p>
              </div>

              {/* Items */}
              <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-slate-800">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                    <span>📦</span> Items
                  </span>
                  <Link href="/cart" className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-800 flex items-center gap-1 hover:underline">
                    <span>✏️</span> Savat edit
                  </Link>
                </div>
                <div className="space-y-3 max-h-[250px] overflow-y-auto pr-1">
                  {items.map((item) => {
                    const itemTotal = (item.price * 12800) * item.quantity;
                    return (
                      <div key={item.productId} className="flex gap-3 items-center text-xs justify-between">
                        <div className="flex gap-2.5 items-center flex-1 min-w-0">
                          <div className="relative shrink-0 h-10 w-10 overflow-hidden rounded bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700">
                            <Image src={item.image || '/placeholder-perfume.jpg'} alt={item.name} fill className="object-cover" sizes="40px" />
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-bold text-gray-900 dark:text-slate-200 truncate">{item.name}</h4>
                            <p className="text-[10px] text-gray-400 dark:text-slate-500 font-medium">{item.volume}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className="rounded-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 px-2 py-0.5 text-[10px] text-gray-600 dark:text-slate-400 font-bold">Qty: {item.quantity}</span>
                          <span className="rounded-full bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50 px-2 py-0.5 text-[10px] text-blue-700 dark:text-blue-400 font-bold">{formatUzPrice(itemTotal)}</span>
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

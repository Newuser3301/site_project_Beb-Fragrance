'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import {
  User,
  ShoppingBag,
  MapPin,
  Heart,
  Lock,
  LogOut,
  Plus,
  Trash2,
  Edit2,
  Save,
  X,
  Loader2,
  CheckCircle,
  Eye,
  ShoppingBagIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { toast } from 'sonner';
import { formatDate, formatPrice } from '@/lib/utils';

interface Address {
  id: string;
  label: string | null;
  firstName: string;
  lastName: string;
  phone: string;
  street: string;
  city: string;
  state: string | null;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

interface OrderItem {
  id: string;
  quantity: number;
  price: any;
  product: {
    name: string;
    images: { url: string }[];
  };
}

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  createdAt: Date;
  total: any;
  items: OrderItem[];
}

interface Product {
  id: string;
  name: string;
  slug: string;
  brand?: { name: string };
  images: { url: string }[];
  variants: { price: any; stock: number; size: string }[];
}

interface ProfileClientProps {
  initialUser: {
    id: string;
    name: string | null;
    email: string;
    phone: string | null;
  };
  initialOrders: any[];
  initialAddresses: any[];
  initialWishlist: any[];
}

type TabType = 'profile' | 'orders' | 'addresses' | 'wishlist' | 'password';

const TAB_CONFIG = [
  { id: 'profile' as const, label: 'Shaxsiy ma\'lumotlar', icon: User },
  { id: 'orders' as const, label: 'Buyurtmalar tarixi', icon: ShoppingBag },
  { id: 'addresses' as const, label: 'Manzillarim', icon: MapPin },
  { id: 'wishlist' as const, label: 'Sevimlilar (Wishlist)', icon: Heart },
  { id: 'password' as const, label: 'Parolni o\'zgartirish', icon: Lock },
];

const STATUS_TRANSLATIONS: Record<string, { label: string; style: string }> = {
  PENDING: { label: 'Kutilmoqda', style: 'bg-amber-50 text-amber-700 border-amber-200' },
  CONFIRMED: { label: 'Tasdiqlandi', style: 'bg-blue-50 text-blue-700 border-blue-200' },
  PROCESSING: { label: 'Tayyorlanmoqda', style: 'bg-purple-50 text-purple-700 border-purple-200' },
  SHIPPED: { label: 'Yo‘lda', style: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  DELIVERED: { label: 'Yetkazildi', style: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  CANCELLED: { label: 'Bekor qilindi', style: 'bg-red-50 text-red-700 border-red-200' },
  REFUNDED: { label: 'Qaytarildi', style: 'bg-gray-50 text-gray-700 border-gray-200' },
};

export function ProfileClientPage({
  initialUser,
  initialOrders,
  initialAddresses,
  initialWishlist,
}: ProfileClientProps) {
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [user, setUser] = useState(initialUser);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: initialUser.name || '',
    email: initialUser.email || '',
    phone: initialUser.phone || '',
  });

  const [orders] = useState<Order[]>(initialOrders);
  const [addresses, setAddresses] = useState<Address[]>(initialAddresses);
  const [wishlist, setWishlist] = useState<Product[]>(initialWishlist);

  // Address creation form state
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressForm, setAddressForm] = useState({
    label: '',
    firstName: '',
    lastName: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'UZ',
    isDefault: false,
  });

  // Password change state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isPending, startTransition] = useTransition();

  const { addItem } = useCartStore();
  const { removeItem } = useWishlistStore();

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileForm),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? "Profilni saqlashda xatolik.");
      }

      setUser({
        ...user,
        name: data.user.name,
        email: data.user.email,
        phone: data.user.phone,
      });
      setIsEditingProfile(false);
      toast.success("Profil muvaffaqiyatli saqlandi.");
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setErrorMsg("Parollar bir xil emas.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/user/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? "Parolni yangilashda xatolik.");
      }

      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      toast.success("Parol muvaffaqiyatli yangilandi.");
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/user/addresses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(addressForm),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? "Manzil qo'shishda xatolik.");
      }

      // Refresh address list
      setAddresses([data.address, ...addresses.map(a => data.address.isDefault ? { ...a, isDefault: false } : a)]);
      setShowAddressForm(false);
      setAddressForm({
        label: '',
        firstName: '',
        lastName: '',
        phone: '',
        street: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'UZ',
        isDefault: false,
      });
      toast.success("Yangi manzil qo'shildi.");
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteAddress = async (id: string) => {
    if (!confirm("Ushbu manzilni o'chirmoqchimisiz?")) return;

    try {
      const response = await fetch(`/api/user/addresses?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error ?? "Manzilni o'chirishda xatolik.");
      }

      setAddresses(addresses.filter((a) => a.id !== id));
      toast.success("Manzil o'chirildi.");
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleAddToCart = (product: Product) => {
    const primaryVariant = product.variants?.[0];
    addItem({
      id: product.id,
      productId: product.id,
      name: product.name,
      price: Number(primaryVariant?.price || 0),
      image: product.images?.[0]?.url || '/placeholder-perfume.jpg',
      quantity: 1,
      volume: primaryVariant?.size || '100ml',
      brand: product.brand?.name || 'Beb Fragrance',
    });
    toast.success(`${product.name} savatchaga qo'shildi!`);
  };

  const handleRemoveFromWishlist = async (productId: string) => {
    removeItem(productId);
    setWishlist(wishlist.filter((p) => p.id !== productId));
    toast.success('Sevimlilardan olib tashlandi');

    try {
      await fetch('/api/wishlist', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      });
    } catch (error) {
      console.error('Failed to sync wishlist deletion:', error);
    }
  };

  return (
    <div className="bg-[#FAF8F5] dark:bg-slate-950 min-h-screen py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header Breadcrumb */}
        <div className="mb-8 text-sm text-gray-500 dark:text-slate-400">
          <Link href="/" className="hover:text-gold-600 transition-colors">Bosh sahifa</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900 dark:text-slate-200 font-medium">Kabinet</span>
        </div>

        {/* Page Structure: Split Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8 items-start">
          
          {/* Left Sidebar */}
          <aside className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm p-6 space-y-6">
            {/* User Profile Header */}
            <div className="flex items-center gap-4 border-b border-gray-150 dark:border-slate-800 pb-5">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-gold-400 via-gold-500 to-gold-600 font-serif text-xl font-bold text-white shadow-md">
                {user.name ? user.name.charAt(0).toUpperCase() : 'C'}
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="truncate text-base font-bold text-gray-900 dark:text-white leading-tight">
                  {user.name || 'Mijoz'}
                </h2>
                <p className="truncate text-xs text-gray-400 dark:text-slate-500 mt-1">
                  {user.email}
                </p>
              </div>
            </div>

            {/* Tabs List */}
            <nav className="flex flex-col gap-1">
              {TAB_CONFIG.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => {
                    setActiveTab(id);
                    setErrorMsg('');
                  }}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-left transition-all ${
                    activeTab === id
                      ? 'bg-gradient-to-r from-gold-500/10 via-gold-500/5 to-transparent text-gold-700 dark:text-gold-400 ring-1 ring-gold-500/20'
                      : 'text-gray-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-slate-200'
                  }`}
                >
                  <Icon className={`h-4.5 w-4.5 shrink-0 ${activeTab === id ? 'text-gold-600 dark:text-gold-400' : 'text-gray-400 dark:text-slate-600'}`} />
                  <span>{label}</span>
                </button>
              ))}

              <button
                type="button"
                onClick={() => signOut({ callbackUrl: '/' })}
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all mt-4 border-t border-gray-100 dark:border-slate-800 pt-5"
              >
                <LogOut className="h-4.5 w-4.5 shrink-0 text-red-500 dark:text-red-400" />
                <span>Chiqish</span>
              </button>
            </nav>
          </aside>

          {/* Right Dynamic Tab Content */}
          <main className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm p-6 sm:p-8">
            
            {/* Tab 1: Profile (Personal Information) */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-gray-100 dark:border-slate-800 pb-4">
                  <div>
                    <h3 className="font-serif text-xl font-bold text-gray-950 dark:text-white">Shaxsiy ma&apos;lumotlar</h3>
                    <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">Hisobingiz ma&apos;lumotlarini ko&apos;rish va tahrirlash</p>
                  </div>
                  {!isEditingProfile && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditingProfile(true)}
                      className="border-gray-250 dark:border-slate-700 text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white"
                    >
                      <Edit2 className="h-3.5 w-3.5 mr-1.5" />
                      Tahrirlash
                    </Button>
                  )}
                </div>

                {errorMsg && (
                  <div className="rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/20 p-3 text-xs text-red-600 dark:text-red-400">
                    {errorMsg}
                  </div>
                )}

                {isEditingProfile ? (
                  <form onSubmit={handleProfileUpdate} className="space-y-4 max-w-lg">
                    <Input id="name" label="To'liq ism" value={profileForm.name} onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })} required />
                    <Input id="email" type="email" label="Email" value={profileForm.email} onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })} required />
                    <Input id="phone" type="tel" label="Telefon raqam" placeholder="+998901234567" value={profileForm.phone} onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })} />
                    <div className="flex gap-2 pt-2">
                      <Button type="submit" className="bg-gold-600 hover:bg-gold-700 text-white rounded-xl text-xs font-semibold px-5 h-9" isLoading={isSubmitting}>
                        <Save className="h-4 w-4 mr-1.5" />
                        Saqlash
                      </Button>
                      <Button type="button" variant="outline" onClick={() => { setIsEditingProfile(false); setProfileForm({ name: user.name || '', email: user.email, phone: user.phone || '' }); }} className="border-gray-250 dark:border-slate-700 text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-xl text-xs font-semibold px-4 h-9">
                        Bekor qilish
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-xl">
                    <div className="space-y-1">
                      <span className="text-[11px] uppercase tracking-wider font-semibold text-gray-400 dark:text-slate-500">To&apos;liq ism</span>
                      <p className="text-sm font-medium text-gray-800 dark:text-slate-200">{user.name || '—'}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[11px] uppercase tracking-wider font-semibold text-gray-400 dark:text-slate-500">Email</span>
                      <p className="text-sm font-medium text-gray-800 dark:text-slate-200">{user.email}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[11px] uppercase tracking-wider font-semibold text-gray-400 dark:text-slate-500">Telefon raqam</span>
                      <p className="text-sm font-medium text-gray-800 dark:text-slate-200">{user.phone || 'Kiritilmagan'}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tab 2: Orders (Order History) */}
            {activeTab === 'orders' && (
              <div className="space-y-6">
                <div className="border-b border-gray-100 dark:border-slate-800 pb-4">
                  <h3 className="font-serif text-xl font-bold text-gray-950 dark:text-white">Buyurtmalar tarixi</h3>
                  <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">Do&apos;konimizdagi barcha xaridlaringiz ro&apos;yxati</p>
                </div>

                {orders.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-gray-100 dark:border-slate-800 rounded-2xl">
                    <ShoppingBagIcon className="h-10 w-10 text-gray-300 dark:text-slate-600 mb-3" />
                    <p className="text-sm font-medium text-gray-600 dark:text-slate-400">Sizda hali buyurtmalar yo&apos;q</p>
                    <Link href="/products" className="mt-4 inline-flex items-center text-xs font-bold text-gold-600 hover:text-gold-700 underline">Xarid qilishni boshlash</Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => {
                      const status = STATUS_TRANSLATIONS[order.status] || { label: order.status, style: 'bg-gray-100 text-gray-800 border-gray-250' };
                      return (
                        <div key={order.id} className="border border-gray-150 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs hover:shadow-sm transition-shadow">
                          <div className="bg-gray-50/60 dark:bg-slate-800/60 px-5 py-4 border-b border-gray-150 dark:border-slate-800 flex flex-wrap gap-4 items-center justify-between">
                            <div className="flex gap-4 items-center">
                              <div>
                                <span className="text-[10px] font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-wider">Buyurtma</span>
                                <p className="font-mono text-xs font-bold text-gray-900 dark:text-slate-200 mt-0.5">#{order.orderNumber}</p>
                              </div>
                              <div className="h-6 w-px bg-gray-200 dark:bg-slate-700" />
                              <div>
                                <span className="text-[10px] font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-wider">Sana</span>
                                <p className="text-xs text-gray-600 dark:text-slate-400 mt-0.5">{formatDate(order.createdAt, { day: 'numeric', month: 'short', year: 'numeric' }, 'uz-UZ')}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-semibold ${status.style}`}>{status.label}</span>
                              <span className="text-sm font-bold text-gray-900 dark:text-slate-200">{formatPrice(Number(order.total), 'USD', 'en-US')}</span>
                            </div>
                          </div>
                          <div className="px-5 py-3.5 space-y-3.5 divide-y divide-gray-100 dark:divide-slate-800">
                            {order.items.map((item) => (
                              <div key={item.id} className="flex gap-3 items-center py-2 first:pt-0 last:pb-0">
                                <div className="h-10 w-10 rounded-lg bg-gray-50 dark:bg-slate-800 border border-gray-150 dark:border-slate-700 overflow-hidden shrink-0 flex items-center justify-center">
                                  {item.product.images?.[0]?.url ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={item.product.images[0].url} alt={item.product.name} className="h-full w-full object-cover" />
                                  ) : (
                                    <ShoppingBag className="h-5 w-5 text-gray-300 dark:text-slate-600" />
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h4 className="text-xs font-semibold text-gray-800 dark:text-slate-200 truncate">{item.product.name}</h4>
                                  <p className="text-[10px] text-gray-400 dark:text-slate-500 mt-0.5">Soni: {item.quantity} × {formatPrice(Number(item.price), 'USD', 'en-US')}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Tab 3: Addresses */}
            {activeTab === 'addresses' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-gray-100 dark:border-slate-800 pb-4">
                  <div>
                    <h3 className="font-serif text-xl font-bold text-gray-950 dark:text-white">Yetkazib berish manzillari</h3>
                    <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">Buyurtmalarni tezroq rasmiylashtirish uchun manzillar ro&apos;yxati</p>
                  </div>
                  {!showAddressForm && (
                    <Button onClick={() => { setShowAddressForm(true); setErrorMsg(''); }} className="bg-gold-600 hover:bg-gold-700 text-white rounded-xl text-xs font-semibold px-4 h-9">
                      <Plus className="h-4 w-4 mr-1.5" />Yangi manzil
                    </Button>
                  )}
                </div>
                {errorMsg && (
                  <div className="rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/20 p-3 text-xs text-red-600 dark:text-red-400">{errorMsg}</div>
                )}
                {showAddressForm && (
                  <form onSubmit={handleAddAddress} className="bg-gray-50/60 dark:bg-slate-800/60 border border-gray-150 dark:border-slate-700 rounded-2xl p-5 space-y-4 max-w-xl">
                    <div className="flex items-center justify-between border-b border-gray-200 dark:border-slate-700 pb-3 mb-2">
                      <h4 className="text-xs font-bold text-gray-800 dark:text-slate-200 uppercase tracking-wider">Yangi manzil qo&apos;shish</h4>
                      <button type="button" onClick={() => setShowAddressForm(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-slate-200">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <Input id="addr-label" label="Manzil nomi (Masalan: Uy, Ishxona)" placeholder="Masalan: Uy" value={addressForm.label} onChange={(e) => setAddressForm({ ...addressForm, label: e.target.value })} />
                      <Input id="addr-phone" label="Telefon raqam" placeholder="+998901234567" value={addressForm.phone} onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })} required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <Input id="addr-fn" label="Ism" value={addressForm.firstName} onChange={(e) => setAddressForm({ ...addressForm, firstName: e.target.value })} required />
                      <Input id="addr-ln" label="Familiya" value={addressForm.lastName} onChange={(e) => setAddressForm({ ...addressForm, lastName: e.target.value })} required />
                    </div>
                    <Input id="addr-street" label="Ko'cha, uy/kvartira manzili" placeholder="Amir Temur ko'chasi, 12-uy" value={addressForm.street} onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })} required />
                    <div className="grid grid-cols-3 gap-3">
                      <Input id="addr-city" label="Shahar/Viloyat" placeholder="Toshkent" value={addressForm.city} onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })} required />
                      <Input id="addr-state" label="Tuman" placeholder="Yunusobod tumani" value={addressForm.state} onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })} />
                      <Input id="addr-zip" label="Pochta indeksi" placeholder="100000" value={addressForm.postalCode} onChange={(e) => setAddressForm({ ...addressForm, postalCode: e.target.value })} required />
                    </div>
                    <label className="flex items-center gap-2 text-xs text-gray-700 dark:text-slate-300 cursor-pointer pt-1">
                      <input type="checkbox" checked={addressForm.isDefault} onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })} className="h-4 w-4 rounded border-gray-300 text-gold-600 focus:ring-gold-500" />
                      Asosiy yetkazib berish manzili sifatida belgilash
                    </label>
                    <div className="flex gap-2 pt-3">
                      <Button type="submit" className="bg-gold-600 hover:bg-gold-700 text-white rounded-xl text-xs font-semibold px-4 h-9" isLoading={isSubmitting}>Qo&apos;shish</Button>
                      <Button type="button" variant="outline" onClick={() => setShowAddressForm(false)} className="border-gray-250 dark:border-slate-700 text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-xl text-xs font-semibold px-4 h-9">Bekor qilish</Button>
                    </div>
                  </form>
                )}
                {addresses.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center border border-dashed border-gray-150 dark:border-slate-800 rounded-2xl">
                    <MapPin className="h-9 w-9 text-gray-300 dark:text-slate-600 mb-2" />
                    <p className="text-sm text-gray-500 dark:text-slate-400">Sizda hali saqlangan manzillar yo&apos;q.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {addresses.map((addr) => (
                      <div key={addr.id} className="border border-gray-150 dark:border-slate-800 rounded-2xl p-4 space-y-3 flex flex-col justify-between relative hover:shadow-xs transition-shadow bg-white dark:bg-slate-800">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold text-gray-900 dark:text-slate-200 bg-gray-100 dark:bg-slate-700 px-2.5 py-0.5 rounded-full">{addr.label || 'Manzil'}</span>
                            {addr.isDefault && (
                              <span className="text-[9px] font-bold uppercase tracking-wider text-gold-700 bg-gold-50 px-2 py-0.5 rounded-full border border-gold-200">Asosiy</span>
                            )}
                          </div>
                          <p className="text-xs font-bold text-gray-800 dark:text-slate-200">{addr.firstName} {addr.lastName}</p>
                          <p className="text-[11px] text-gray-500 dark:text-slate-400 mt-1 leading-relaxed">{addr.street}, {addr.state ? `${addr.state}, ` : ''}{addr.city}, {addr.postalCode}, {addr.country}</p>
                          <p className="text-[11px] text-gray-400 dark:text-slate-500 font-mono mt-1.5">Tel: {addr.phone}</p>
                        </div>
                        <div className="flex justify-end pt-3 border-t border-gray-100 dark:border-slate-700">
                          <button type="button" onClick={() => handleDeleteAddress(addr.id)} className="inline-flex items-center text-[10px] font-bold text-red-600 dark:text-red-400 hover:text-red-700 transition-colors">
                            <Trash2 className="h-3.5 w-3.5 mr-1" />O&apos;chirish
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Tab 4: Wishlist */}
            {activeTab === 'wishlist' && (
              <div className="space-y-6">
                <div className="border-b border-gray-100 dark:border-slate-800 pb-4">
                  <h3 className="font-serif text-xl font-bold text-gray-950 dark:text-white">Sevimlilar ro&apos;yxati</h3>
                  <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">Sizga yoqqan va keyinchalik xarid qilish uchun saqlab qo&apos;yilgan mahsulotlar</p>
                </div>
                {wishlist.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-gray-100 dark:border-slate-800 rounded-2xl">
                    <Heart className="h-10 w-10 text-gray-300 dark:text-slate-600 mb-3" />
                    <p className="text-sm font-medium text-gray-600 dark:text-slate-400">Sevimlilar ro&apos;yxati bo&apos;sh</p>
                    <Link href="/products" className="mt-4 inline-flex items-center text-xs font-bold text-gold-600 hover:text-gold-700 underline">Katalogni ko&apos;rish</Link>
                  </div>
                ) : (
                  <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                    {wishlist.map((product) => {
                      const variant = product.variants?.[0];
                      const formattedPrice = variant ? formatPrice(Number(variant.price), 'USD', 'en-US') : '—';
                      return (
                        <div key={product.id} className="border border-gray-150 dark:border-slate-800 rounded-2xl overflow-hidden p-4 space-y-4 hover:shadow-sm transition-shadow flex flex-col justify-between bg-white dark:bg-slate-800 group relative">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest">{product.brand?.name || 'Beb Fragrance'}</span>
                            <button onClick={() => handleRemoveFromWishlist(product.id)} className="text-gray-400 hover:text-red-500 transition-colors" title="Sevimlilardan olib tashlash">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                          <Link href={`/products/${product.slug}`} className="flex flex-col items-center py-2 flex-1">
                            <div className="h-28 w-28 overflow-hidden rounded-xl bg-gray-50 dark:bg-slate-700 flex items-center justify-center p-2 border border-gray-100 dark:border-slate-600">
                              {product.images?.[0]?.url ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={product.images[0].url} alt={product.name} className="h-full w-full object-contain mix-blend-multiply dark:mix-blend-normal transition-transform duration-500 group-hover:scale-105" />
                              ) : (
                                <ShoppingBag className="h-8 w-8 text-gray-300 dark:text-slate-600" />
                              )}
                            </div>
                            <h4 className="mt-4 text-xs font-bold text-gray-900 dark:text-slate-200 text-center line-clamp-1 group-hover:text-gold-600 transition-colors">{product.name}</h4>
                            <p className="mt-1 text-xs font-semibold text-gray-700 dark:text-slate-300">{formattedPrice}</p>
                          </Link>
                          <div className="pt-2">
                            <Button onClick={() => handleAddToCart(product)} className="w-full bg-gold-600 hover:bg-gold-700 text-white rounded-xl text-xs font-semibold h-9" disabled={variant?.stock === 0}>
                              <ShoppingBagIcon className="h-3.5 w-3.5 mr-1.5" />Savatga qo&apos;shish
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Tab 5: Change Password */}
            {activeTab === 'password' && (
              <div className="space-y-6">
                <div className="border-b border-gray-100 dark:border-slate-800 pb-4">
                  <h3 className="font-serif text-xl font-bold text-gray-950 dark:text-white">Parolni o&apos;zgartirish</h3>
                  <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">Profil xavfsizligi uchun maxfiy parolingizni yangilang</p>
                </div>
                {errorMsg && (
                  <div className="rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/20 p-3 text-xs text-red-600 dark:text-red-400 max-w-lg">{errorMsg}</div>
                )}
                <form onSubmit={handlePasswordUpdate} className="space-y-4 max-w-lg">
                  <Input id="currentPassword" type="password" label="Hozirgi parol" value={passwordForm.currentPassword} onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })} required />
                  <Input id="newPassword" type="password" label="Yangi parol" placeholder="Kamida 8 ta belgi, harf va raqam" value={passwordForm.newPassword} onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })} required />
                  <Input id="confirmPassword" type="password" label="Yangi parolni tasdiqlang" placeholder="Yangi parolni qayta kiriting" value={passwordForm.confirmPassword} onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })} required />
                  <div className="pt-2">
                    <Button type="submit" className="bg-gold-600 hover:bg-gold-700 text-white rounded-xl text-xs font-semibold px-5 h-9" isLoading={isSubmitting}>
                      Parolni yangilash
                    </Button>
                  </div>
                </form>
              </div>
            )}

          </main>
        </div>
      </div>
    </div>
  );
}

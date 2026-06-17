// src/app/admin/settings/SettingsClient.tsx
'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import {
  Globe,
  Home,
  Folder,
  Image as ImageIcon,
  Save,
  Loader2,
  Phone,
  Mail,
  MapPin,
  Facebook,
  Instagram,
  Twitter,
  FileText,
  Percent,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { ImageUpload } from '@/components/admin/ImageUpload';

interface Category {
  id: string;
  name: string;
  slug: string;
  image: string | null;
}

interface SettingsClientProps {
  initialSettings: Record<string, string>;
  initialCategories: Category[];
}

type TabType = 'general' | 'hero' | 'categories' | 'banners';

const inputClass =
  'h-10 w-full rounded-xl border border-gray-300 bg-white px-3 text-sm outline-none transition-all placeholder:text-gray-400 focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20';

const textareaClass =
  'w-full resize-none rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none transition-all placeholder:text-gray-400 focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20';

export function SettingsClientPage({
  initialSettings,
  initialCategories,
}: SettingsClientProps) {
  const [activeTab, setActiveTab] = useState<TabType>('general');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Categories local state
  const [categories, setCategories] = useState<Category[]>(initialCategories);

  // Settings form states
  const [settings, setSettings] = useState<Record<string, string>>({
    site_name: initialSettings.site_name ?? 'Beb Fragrance',
    site_tagline: initialSettings.site_tagline ?? 'premium perfume store',
    contact_phone: initialSettings.contact_phone ?? '+998 (71) 123 45 67',
    contact_email: initialSettings.contact_email ?? 'info@bebfragrance.uz',
    contact_address: initialSettings.contact_address ?? 'Toshkent sh., Chilonzor tumani, 9-mavze',
    social_facebook: initialSettings.social_facebook ?? 'https://facebook.com/bebfragrance',
    social_instagram: initialSettings.social_instagram ?? 'https://instagram.com/bebfragrance',
    social_twitter: initialSettings.social_twitter ?? 'https://twitter.com/bebfragrance',

    // Hero Content
    hero_title_line1: initialSettings.hero_title_line1 ?? 'Har bir',
    hero_title_line2: initialSettings.hero_title_line2 ?? 'lahza uchun ifor',
    hero_description:
      initialSettings.hero_description ??
      'Kundalik marosimlar va unutilmas uchrashuvlar uchun tanlangan romantik floral, nafis musk va kechki aksent iforlarni kashf eting.',
    hero_bg_image: initialSettings.hero_bg_image ?? '',
    hero_bottle_image_1:
      initialSettings.hero_bottle_image_1 ??
      'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=500&h=700&fit=crop',
    hero_bottle_image_2:
      initialSettings.hero_bottle_image_2 ??
      'https://images.unsplash.com/photo-1541643600914-78b084683601?w=500&h=760&fit=crop',
    hero_bottle_image_3:
      initialSettings.hero_bottle_image_3 ??
      'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=500&h=760&fit=crop',

    // Hero Stats
    hero_stat_1_value: initialSettings.hero_stat_1_value ?? '120+',
    hero_stat_1_label: initialSettings.hero_stat_1_label ?? 'Lux brendlar',
    hero_stat_2_value: initialSettings.hero_stat_2_value ?? '24h',
    hero_stat_2_label: initialSettings.hero_stat_2_label ?? 'Sovg\'aga tayyor',
    hero_stat_3_value: initialSettings.hero_stat_3_value ?? 'Top 50',
    hero_stat_3_label: initialSettings.hero_stat_3_label ?? 'Saralangan hitlar',

    // Editorial Banner
    promo_banner_image: initialSettings.promo_banner_image ?? '',
    promo_banner_title: initialSettings.promo_banner_title ?? 'Sizning o\'ziga xos iforingiz',
    promo_banner_desc:
      initialSettings.promo_banner_desc ??
      'Issiq amber kechalari, yumshoq atirgul tonglari va har kun uchun nafis yangi notalarni kayfiyat bo\'yicha o\'rganing.',
    promo_banner_link: initialSettings.promo_banner_link ?? '/products',
  });

  const handleSettingChange = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleCategoryImageChange = (id: string, image: string) => {
    setCategories((prev) =>
      prev.map((cat) => (cat.id === id ? { ...cat, image } : cat))
    );
  };

  const handleSaveSettings = async (keysToSave: string[]) => {
    setIsSubmitting(true);
    try {
      const payloadSettings: Record<string, string> = {};
      keysToSave.forEach((key) => {
        payloadSettings[key] = settings[key];
      });

      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings: payloadSettings }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? 'Failed to save settings');

      toast.success('Sozlamalar muvaffaqiyatli saqlandi!');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Xatolik yuz berdi');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveCategory = async (cat: Category) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          categoryImages: [{ id: cat.id, image: cat.image ?? '' }],
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? 'Failed to save category image');

      toast.success(`${cat.name} kategoriyasi rasmi muvaffaqiyatli yangilandi!`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Xatolik yuz berdi');
    } finally {
      setIsSubmitting(false);
    }
  };

  const TAB_CONFIG = [
    { id: 'general' as const, label: 'Umumiy', icon: Globe },
    { id: 'hero' as const, label: 'Bosh sahifa', icon: Home },
    { id: 'categories' as const, label: 'Kategoriyalar', icon: Folder },
    { id: 'banners' as const, label: 'Bannerlar', icon: ImageIcon },
  ];

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[280px_1fr] items-start">
      {/* Left Navigation */}
      <aside className="bg-white rounded-3xl border border-gray-150 shadow-sm p-5 space-y-6">
        <p className="px-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">
          Sozlamalar bo&apos;limi
        </p>
        <nav className="flex flex-col gap-1">
          {TAB_CONFIG.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-left transition-all ${
                activeTab === id
                  ? 'bg-gradient-to-r from-gold-500/10 via-gold-500/5 to-transparent text-gold-700 ring-1 ring-gold-500/20'
                  : 'text-gray-650 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Icon
                className={`h-4.5 w-4.5 shrink-0 ${
                  activeTab === id ? 'text-gold-600' : 'text-gray-400'
                }`}
              />
              <span>{label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Right Dynamic Tab Content */}
      <main className="bg-white rounded-3xl border border-gray-150 shadow-sm p-6 sm:p-8 min-h-[500px]">
        {/* Tab 1: Umumiy (General settings) */}
        {activeTab === 'general' && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSaveSettings([
                'site_name',
                'site_tagline',
                'contact_phone',
                'contact_email',
                'contact_address',
                'social_facebook',
                'social_instagram',
                'social_twitter',
              ]);
            }}
            className="space-y-6"
          >
            <div className="border-b border-gray-100 pb-4">
              <h3 className="font-serif text-xl font-bold text-gray-950">Umumiy sayt sozlamalari</h3>
              <p className="text-xs text-gray-500 mt-1">Sayt sarlavhalari, aloqa va ijtimoiy tarmoqlar</p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-750">Sayt nomi</label>
                <input
                  type="text"
                  value={settings.site_name}
                  onChange={(e) => handleSettingChange('site_name', e.target.value)}
                  className={inputClass}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-750">Tagline / Tavsif</label>
                <input
                  type="text"
                  value={settings.site_tagline}
                  onChange={(e) => handleSettingChange('site_tagline', e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-750 flex items-center gap-1.5">
                  <Phone className="h-4 w-4 text-gray-400" /> Telefon raqam
                </label>
                <input
                  type="text"
                  value={settings.contact_phone}
                  onChange={(e) => handleSettingChange('contact_phone', e.target.value)}
                  className={inputClass}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-750 flex items-center gap-1.5">
                  <Mail className="h-4 w-4 text-gray-400" /> Aloqa emaili
                </label>
                <input
                  type="email"
                  value={settings.contact_email}
                  onChange={(e) => handleSettingChange('contact_email', e.target.value)}
                  className={inputClass}
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-750 flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-gray-400" /> Jismoniy manzil
              </label>
              <textarea
                value={settings.contact_address}
                onChange={(e) => handleSettingChange('contact_address', e.target.value)}
                rows={3}
                className={textareaClass}
                required
              />
            </div>

            <div className="border-t border-gray-100 pt-5 space-y-4">
              <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider">
                Ijtimoiy tarmoqlar havolalari
              </h4>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                    <Facebook className="h-3.5 w-3.5 text-blue-600" /> Facebook
                  </label>
                  <input
                    type="text"
                    value={settings.social_facebook}
                    onChange={(e) => handleSettingChange('social_facebook', e.target.value)}
                    className={inputClass}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                    <Instagram className="h-3.5 w-3.5 text-pink-600" /> Instagram
                  </label>
                  <input
                    type="text"
                    value={settings.social_instagram}
                    onChange={(e) => handleSettingChange('social_instagram', e.target.value)}
                    className={inputClass}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                    <Twitter className="h-3.5 w-3.5 text-sky-500" /> Twitter
                  </label>
                  <input
                    type="text"
                    value={settings.social_twitter}
                    onChange={(e) => handleSettingChange('social_twitter', e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex justify-end">
              <Button type="submit" variant="luxury" isLoading={isSubmitting}>
                <Save className="h-4 w-4 mr-2" />
                Saqlash
              </Button>
            </div>
          </form>
        )}

        {/* Tab 2: Bosh sahifa (Hero section content, stats, bottle images) */}
        {activeTab === 'hero' && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSaveSettings([
                'hero_title_line1',
                'hero_title_line2',
                'hero_description',
                'hero_bg_image',
                'hero_bottle_image_1',
                'hero_bottle_image_2',
                'hero_bottle_image_3',
                'hero_stat_1_value',
                'hero_stat_1_label',
                'hero_stat_2_value',
                'hero_stat_2_label',
                'hero_stat_3_value',
                'hero_stat_3_label',
              ]);
            }}
            className="space-y-6"
          >
            <div className="border-b border-gray-100 pb-4">
              <h3 className="font-serif text-xl font-bold text-gray-950">Bosh sahifa Hero sozlamalari</h3>
              <p className="text-xs text-gray-500 mt-1">Asosiy banner matnlari, flakon rasmlari va statistika</p>
            </div>

            {/* Typography */}
            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-750">Sarlavha (1-qator)</label>
                <input
                  type="text"
                  value={settings.hero_title_line1}
                  onChange={(e) => handleSettingChange('hero_title_line1', e.target.value)}
                  className={inputClass}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-750">Sarlavha (2-qator)</label>
                <input
                  type="text"
                  value={settings.hero_title_line2}
                  onChange={(e) => handleSettingChange('hero_title_line2', e.target.value)}
                  className={inputClass}
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-750">Qisqacha tavsif</label>
              <textarea
                value={settings.hero_description}
                onChange={(e) => handleSettingChange('hero_description', e.target.value)}
                rows={3}
                className={textareaClass}
                required
              />
            </div>

            {/* Statistics */}
            <div className="border-t border-gray-100 pt-5 space-y-4">
              <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider">
                Hero Statistikalar
              </h4>
              <div className="grid gap-4 md:grid-cols-3">
                {/* Stat 1 */}
                <div className="space-y-2 border border-gray-100 rounded-2xl p-4 bg-gray-50/55">
                  <p className="text-xs font-bold text-gold-700">STATISTIKA 1</p>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-gray-550 block">Qiymat (Value)</label>
                    <input
                      type="text"
                      value={settings.hero_stat_1_value}
                      onChange={(e) => handleSettingChange('hero_stat_1_value', e.target.value)}
                      className={inputClass}
                      placeholder="e.g. 120+"
                      required
                    />
                  </div>
                  <div className="space-y-1.5 mt-2">
                    <label className="text-[11px] font-semibold text-gray-550 block">Matn (Label)</label>
                    <input
                      type="text"
                      value={settings.hero_stat_1_label}
                      onChange={(e) => handleSettingChange('hero_stat_1_label', e.target.value)}
                      className={inputClass}
                      placeholder="e.g. Lux brendlar"
                      required
                    />
                  </div>
                </div>

                {/* Stat 2 */}
                <div className="space-y-2 border border-gray-100 rounded-2xl p-4 bg-gray-50/55">
                  <p className="text-xs font-bold text-gold-700">STATISTIKA 2</p>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-gray-550 block">Qiymat (Value)</label>
                    <input
                      type="text"
                      value={settings.hero_stat_2_value}
                      onChange={(e) => handleSettingChange('hero_stat_2_value', e.target.value)}
                      className={inputClass}
                      placeholder="e.g. 24h"
                      required
                    />
                  </div>
                  <div className="space-y-1.5 mt-2">
                    <label className="text-[11px] font-semibold text-gray-550 block">Matn (Label)</label>
                    <input
                      type="text"
                      value={settings.hero_stat_2_label}
                      onChange={(e) => handleSettingChange('hero_stat_2_label', e.target.value)}
                      className={inputClass}
                      placeholder="e.g. Sovg'aga tayyor"
                      required
                    />
                  </div>
                </div>

                {/* Stat 3 */}
                <div className="space-y-2 border border-gray-100 rounded-2xl p-4 bg-gray-50/55">
                  <p className="text-xs font-bold text-gold-700">STATISTIKA 3</p>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-gray-550 block">Qiymat (Value)</label>
                    <input
                      type="text"
                      value={settings.hero_stat_3_value}
                      onChange={(e) => handleSettingChange('hero_stat_3_value', e.target.value)}
                      className={inputClass}
                      placeholder="e.g. Top 50"
                      required
                    />
                  </div>
                  <div className="space-y-1.5 mt-2">
                    <label className="text-[11px] font-semibold text-gray-550 block">Matn (Label)</label>
                    <input
                      type="text"
                      value={settings.hero_stat_3_label}
                      onChange={(e) => handleSettingChange('hero_stat_3_label', e.target.value)}
                      className={inputClass}
                      placeholder="e.g. Saralangan hitlar"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Media Uploads */}
            <div className="border-t border-gray-100 pt-5 space-y-6">
              <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider">
                Hero Rasmlari va Vitrinalari
              </h4>

              {/* Background image */}
              <div className="rounded-2xl border border-dashed border-gold-300 bg-gold-50/20 p-5">
                <label className="text-sm font-semibold text-gray-800 block mb-2">
                  Hero Custom Background Image (Ixtiyoriy)
                </label>
                <p className="text-xs text-gray-500 mb-4">
                  Agar yuklansa, standard och pushti gradient fon o&apos;rniga bu rasm fon qilib qo&apos;yiladi.
                </p>
                <ImageUpload
                  value={settings.hero_bg_image ? [settings.hero_bg_image] : []}
                  onChange={(urls) => handleSettingChange('hero_bg_image', urls[0] ?? '')}
                />
              </div>

              {/* 3 Bottle images */}
              <div className="grid gap-6 md:grid-cols-3">
                <div className="rounded-2xl border border-gray-150 p-4 space-y-3 bg-white">
                  <label className="text-xs font-bold text-gray-700 block border-b pb-2">
                    Flakon rasm 1
                  </label>
                  <ImageUpload
                    value={settings.hero_bottle_image_1 ? [settings.hero_bottle_image_1] : []}
                    onChange={(urls) => handleSettingChange('hero_bottle_image_1', urls[0] ?? '')}
                  />
                </div>

                <div className="rounded-2xl border border-gray-150 p-4 space-y-3 bg-white">
                  <label className="text-xs font-bold text-gray-700 block border-b pb-2">
                    Flakon rasm 2
                  </label>
                  <ImageUpload
                    value={settings.hero_bottle_image_2 ? [settings.hero_bottle_image_2] : []}
                    onChange={(urls) => handleSettingChange('hero_bottle_image_2', urls[0] ?? '')}
                  />
                </div>

                <div className="rounded-2xl border border-gray-150 p-4 space-y-3 bg-white">
                  <label className="text-xs font-bold text-gray-700 block border-b pb-2">
                    Flakon rasm 3
                  </label>
                  <ImageUpload
                    value={settings.hero_bottle_image_3 ? [settings.hero_bottle_image_3] : []}
                    onChange={(urls) => handleSettingChange('hero_bottle_image_3', urls[0] ?? '')}
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex justify-end">
              <Button type="submit" variant="luxury" isLoading={isSubmitting}>
                <Save className="h-4 w-4 mr-2" />
                Saqlash
              </Button>
            </div>
          </form>
        )}

        {/* Tab 3: Kategoriyalar */}
        {activeTab === 'categories' && (
          <div className="space-y-6">
            <div className="border-b border-gray-100 pb-4">
              <h3 className="font-serif text-xl font-bold text-gray-950">Kategoriyalar bannerlari</h3>
              <p className="text-xs text-gray-500 mt-1">Har bir yo&apos;nalish uchun bosh sahifa kartochkasi rasmini o&apos;zgartirish</p>
            </div>

            {categories.length === 0 ? (
              <div className="text-center py-12 text-gray-450 text-sm">
                Mavjud faol kategoriyalar topilmadi.
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2">
                {categories.map((cat) => (
                  <Card key={cat.id} className="relative overflow-hidden border border-gray-150 rounded-2xl bg-white shadow-xs">
                    <CardContent className="p-5 space-y-4">
                      <div>
                        <h4 className="font-serif text-lg font-bold text-gray-900">{cat.name}</h4>
                        <p className="text-xs text-gray-500">Slug: /{cat.slug}</p>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-gray-700 block">Kategoriya rasmi</label>
                        <ImageUpload
                          value={cat.image ? [cat.image] : []}
                          onChange={(urls) => handleCategoryImageChange(cat.id, urls[0] ?? '')}
                        />
                      </div>

                      <div className="flex justify-end pt-2">
                        <Button
                          type="button"
                          variant="luxury"
                          size="sm"
                          onClick={() => handleSaveCategory(cat)}
                          isLoading={isSubmitting}
                        >
                          <Save className="h-3.5 w-3.5 mr-1.5" />
                          Yangilash
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Bannerlar */}
        {activeTab === 'banners' && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSaveSettings([
                'promo_banner_image',
                'promo_banner_title',
                'promo_banner_desc',
                'promo_banner_link',
              ]);
            }}
            className="space-y-6"
          >
            <div className="border-b border-gray-100 pb-4">
              <h3 className="font-serif text-xl font-bold text-gray-950">Promo va vitrina bannerlari</h3>
              <p className="text-xs text-gray-500 mt-1">Sizning o&apos;ziga xos iforingiz kabi promo bannerlarini boshqarish</p>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-750">Banner Sarlavhasi</label>
              <input
                type="text"
                value={settings.promo_banner_title}
                onChange={(e) => handleSettingChange('promo_banner_title', e.target.value)}
                className={inputClass}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-750">Banner Tavsifi</label>
              <textarea
                value={settings.promo_banner_desc}
                onChange={(e) => handleSettingChange('promo_banner_desc', e.target.value)}
                rows={3}
                className={textareaClass}
                required
              />
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-750">Havola linki (Redirect URL)</label>
                <input
                  type="text"
                  value={settings.promo_banner_link}
                  onChange={(e) => handleSettingChange('promo_banner_link', e.target.value)}
                  className={inputClass}
                  required
                />
              </div>
            </div>

            <div className="rounded-2xl border border-dashed border-gold-300 bg-gold-50/20 p-5 space-y-3">
              <label className="text-sm font-semibold text-gray-800 block">
                Banner Promo Rasmi (Yumshoq pushti vitrinalar rasm-mediasi)
              </label>
              <p className="text-xs text-gray-500">
                Bu rasm yuklansa, o&apos;ng tomondagi default abstract glassmorfik blocklar o&apos;rnida namoyish etiladi.
              </p>
              <ImageUpload
                value={settings.promo_banner_image ? [settings.promo_banner_image] : []}
                onChange={(urls) => handleSettingChange('promo_banner_image', urls[0] ?? '')}
              />
            </div>

            <div className="pt-4 border-t border-gray-100 flex justify-end">
              <Button type="submit" variant="luxury" isLoading={isSubmitting}>
                <Save className="h-4 w-4 mr-2" />
                Saqlash
              </Button>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}

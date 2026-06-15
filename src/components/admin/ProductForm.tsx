// src/components/admin/ProductForm.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Plus, X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { ImageUpload } from './ImageUpload';
import { slugify } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface ProductFormData {
  name: string;
  slug: string;
  description: string;
  brand: string;
  price: string;
  comparePrice: string;
  costPrice: string;
  stock: string;
  categoryId: string;
  gender: 'MALE' | 'FEMALE' | 'UNISEX';
  volume: string;
  notes: string[];
  isFeatured: boolean;
  images: string[];
}

interface Category {
  id: string;
  name: string;
}

interface ProductFormProps {
  initialData?: Partial<ProductFormData> & { id?: string };
  categories: Category[];
  mode?: 'create' | 'edit';
}

const VOLUMES = ['10ml', '30ml', '50ml', '75ml', '100ml', '150ml', '200ml'];
const GENDERS = [
  { value: 'MALE', label: 'Men' },
  { value: 'FEMALE', label: 'Women' },
  { value: 'UNISEX', label: 'Unisex' },
] as const;

function FormField({
  label,
  error,
  required,
  children,
  className,
}: {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label className="text-sm font-medium text-gray-700">
        {label}
        {required && <span className="ml-1 text-destructive">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

const inputClass =
  'h-10 w-full rounded-xl border border-gray-300 bg-white px-3 text-sm outline-none transition-all placeholder:text-gray-400 focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 disabled:bg-gray-50 disabled:text-gray-500';

export function ProductForm({ initialData, categories, mode = 'create' }: ProductFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof ProductFormData, string>>>({});

  const [form, setForm] = useState<ProductFormData>({
    name: initialData?.name ?? '',
    slug: initialData?.slug ?? '',
    description: initialData?.description ?? '',
    brand: initialData?.brand ?? '',
    price: initialData?.price ?? '',
    comparePrice: initialData?.comparePrice ?? '',
    costPrice: initialData?.costPrice ?? '',
    stock: initialData?.stock ?? '',
    categoryId: initialData?.categoryId ?? '',
    gender: initialData?.gender ?? 'UNISEX',
    volume: initialData?.volume ?? '50ml',
    notes: initialData?.notes ?? [''],
    isFeatured: initialData?.isFeatured ?? false,
    images: initialData?.images ?? [],
  });

  // Auto-generate slug from name
  useEffect(() => {
    if (mode === 'create' && form.name) {
      setForm((prev) => ({ ...prev, slug: slugify(form.name) }));
    }
  }, [form.name, mode]);

  const set = (field: keyof ProductFormData, value: unknown) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const addNote = () => {
    if (form.notes.length < 10) {
      set('notes', [...form.notes, '']);
    }
  };

  const updateNote = (idx: number, value: string) => {
    const updated = [...form.notes];
    updated[idx] = value;
    set('notes', updated);
  };

  const removeNote = (idx: number) => {
    set('notes', form.notes.filter((_, i) => i !== idx));
  };

  const validate = (): boolean => {
    const errs: Partial<Record<keyof ProductFormData, string>> = {};
    if (!form.name.trim() || form.name.length < 3)
      errs.name = 'Name must be at least 3 characters';
    if (!form.description.trim() || form.description.length < 10)
      errs.description = 'Description must be at least 10 characters';
    if (!form.brand.trim()) errs.brand = 'Brand is required';
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) <= 0)
      errs.price = 'Valid price is required';
    if (!form.stock || isNaN(Number(form.stock)) || Number(form.stock) < 0)
      errs.stock = 'Valid stock count required';
    if (!form.categoryId) errs.categoryId = 'Category is required';
    if (form.images.length === 0) errs.images = 'At least one image is required';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      toast.error('Please fix the form errors');
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        name: form.name.trim(),
        slug: form.slug || slugify(form.name),
        description: form.description.trim(),
        brand: form.brand.trim(),
        price: Number(form.price),
        comparePrice: form.comparePrice ? Number(form.comparePrice) : undefined,
        costPrice: form.costPrice ? Number(form.costPrice) : undefined,
        stock: Number(form.stock),
        categoryId: form.categoryId,
        gender: form.gender,
        volume: Number(form.volume.replace(/[^0-9]/g, '')),
        notes: form.notes.filter((n) => n.trim()),
        isFeatured: form.isFeatured,
        images: form.images,
        featured: form.isFeatured,
      };

      const url =
        mode === 'edit' && initialData?.id
          ? '/api/admin/products'
          : '/api/admin/products';
      const method = mode === 'edit' ? 'PUT' : 'POST';
      const body =
        mode === 'edit' ? { ...payload, id: initialData?.id } : payload;

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? 'Failed to save product');
      }

      toast.success(
        mode === 'create'
          ? 'Product created successfully!'
          : 'Product updated successfully!'
      );
      router.push('/admin/products');
      router.refresh();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Section: Basic Info */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <h2 className="mb-5 font-serif text-lg font-bold text-gray-900">
          Basic Information
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="Product Name" required error={errors.name} className="sm:col-span-2">
            <input
              type="text"
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              placeholder="e.g. Creed Aventus"
              className={cn(inputClass, errors.name && 'border-destructive')}
            />
          </FormField>

          <FormField label="Slug (URL)" error={errors.slug}>
            <input
              type="text"
              value={form.slug}
              onChange={(e) => set('slug', slugify(e.target.value))}
              placeholder="creed-aventus"
              className={inputClass}
            />
          </FormField>

          <FormField label="Brand" required error={errors.brand}>
            <input
              type="text"
              value={form.brand}
              onChange={(e) => set('brand', e.target.value)}
              placeholder="e.g. Creed"
              className={cn(inputClass, errors.brand && 'border-destructive')}
            />
          </FormField>

          <FormField label="Description" required error={errors.description} className="sm:col-span-2">
            <textarea
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              rows={5}
              placeholder="Describe the fragrance in detail..."
              className={cn(
                'w-full resize-y rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none transition-all placeholder:text-gray-400 focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20',
                errors.description && 'border-destructive'
              )}
            />
          </FormField>
        </div>
      </div>

      {/* Section: Pricing & Stock */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <h2 className="mb-5 font-serif text-lg font-bold text-gray-900">
          Pricing & Stock
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <FormField label="Price (USD)" required error={errors.price}>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">$</span>
              <input
                type="number"
                min={0}
                step="0.01"
                value={form.price}
                onChange={(e) => set('price', e.target.value)}
                placeholder="0.00"
                className={cn(inputClass, 'pl-6', errors.price && 'border-destructive')}
              />
            </div>
          </FormField>

          <FormField label="Compare Price" error={errors.comparePrice}>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">$</span>
              <input
                type="number"
                min={0}
                step="0.01"
                value={form.comparePrice}
                onChange={(e) => set('comparePrice', e.target.value)}
                placeholder="Original price"
                className={cn(inputClass, 'pl-6')}
              />
            </div>
          </FormField>

          <FormField label="Cost Price" error={errors.costPrice}>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">$</span>
              <input
                type="number"
                min={0}
                step="0.01"
                value={form.costPrice}
                onChange={(e) => set('costPrice', e.target.value)}
                placeholder="Your cost"
                className={cn(inputClass, 'pl-6')}
              />
            </div>
          </FormField>

          <FormField label="Stock" required error={errors.stock}>
            <input
              type="number"
              min={0}
              step={1}
              value={form.stock}
              onChange={(e) => set('stock', e.target.value)}
              placeholder="0"
              className={cn(inputClass, errors.stock && 'border-destructive')}
            />
          </FormField>
        </div>
      </div>

      {/* Section: Category & Properties */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <h2 className="mb-5 font-serif text-lg font-bold text-gray-900">
          Category & Properties
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <FormField label="Category" required error={errors.categoryId}>
            <select
              value={form.categoryId}
              onChange={(e) => set('categoryId', e.target.value)}
              className={cn(inputClass, errors.categoryId && 'border-destructive')}
            >
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </FormField>

          <FormField label="Volume">
            <select
              value={form.volume}
              onChange={(e) => set('volume', e.target.value)}
              className={inputClass}
            >
              {VOLUMES.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </FormField>

          <FormField label="Gender" className="flex flex-col gap-2">
            <div className="flex gap-2 pt-0.5">
              {GENDERS.map(({ value, label }) => (
                <label
                  key={value}
                  className={cn(
                    'flex flex-1 cursor-pointer items-center justify-center rounded-xl border px-3 py-2 text-sm font-medium transition-all',
                    form.gender === value
                      ? 'border-gold-400 bg-gold-50 text-gold-700'
                      : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                  )}
                >
                  <input
                    type="radio"
                    name="gender"
                    value={value}
                    checked={form.gender === value}
                    onChange={() => set('gender', value)}
                    className="sr-only"
                  />
                  {label}
                </label>
              ))}
            </div>
          </FormField>
        </div>

        {/* Notes */}
        <div className="mt-4">
          <div className="mb-2 flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">
              Fragrance Notes
            </label>
            <button
              type="button"
              onClick={addNote}
              disabled={form.notes.length >= 10}
              className="flex items-center gap-1 text-xs font-medium text-gold-600 disabled:opacity-50 hover:text-gold-700"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Note
            </button>
          </div>
          <div className="space-y-2">
            <AnimatePresence>
              {form.notes.map((note, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex gap-2"
                >
                  <input
                    type="text"
                    value={note}
                    onChange={(e) => updateNote(idx, e.target.value)}
                    placeholder={`Note ${idx + 1} (e.g. Bergamot, Rose, Musk)`}
                    className={inputClass}
                  />
                  <button
                    type="button"
                    onClick={() => removeNote(idx)}
                    className="shrink-0 rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-destructive"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Featured */}
        <div className="mt-4">
          <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 p-3 transition-colors hover:bg-gray-100">
            <input
              type="checkbox"
              checked={form.isFeatured}
              onChange={(e) => set('isFeatured', e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 accent-gold-500"
            />
            <div>
              <p className="text-sm font-medium text-gray-700">
                Mark as featured product
              </p>
              <p className="text-xs text-gray-400">
                Featured products appear on the homepage
              </p>
            </div>
          </label>
        </div>
      </div>

      {/* Section: Images */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <h2 className="mb-2 font-serif text-lg font-bold text-gray-900">
          Product Images
        </h2>
        <p className="mb-5 text-sm text-gray-500">
          Upload up to 5 images. The first (starred) image will be the main display image.
        </p>
        {errors.images && (
          <p className="mb-3 text-sm text-destructive">{errors.images}</p>
        )}
        <ImageUpload
          value={form.images}
          onChange={(urls) => set('images', urls)}
        />
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white p-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/admin/products')}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="luxury"
          size="lg"
          isLoading={isLoading}
          className="gap-2 px-8"
        >
          {mode === 'create' ? 'Create Product' : 'Update Product'}
        </Button>
      </div>
    </form>
  );
}

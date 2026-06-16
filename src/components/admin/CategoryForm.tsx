// src/components/admin/CategoryForm.tsx
'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/Button';
import { ImageUpload } from './ImageUpload';
import { slugify, cn } from '@/lib/utils';

interface CategoryFormData {
  name: string;
  slug: string;
  description: string;
  image: string;
}

interface CategoryFormProps {
  initialData?: Partial<CategoryFormData> & { id?: string };
  onSuccess?: () => void;
  mode?: 'create' | 'edit';
}

const inputClass =
  'h-10 w-full rounded-xl border border-gray-300 bg-white px-3 text-sm outline-none transition-all placeholder:text-gray-400 focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20';

export function CategoryForm({ initialData, onSuccess, mode = 'create' }: CategoryFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof CategoryFormData, string>>>({});

  const [form, setForm] = useState<CategoryFormData>({
    name: initialData?.name ?? '',
    slug: initialData?.slug ?? '',
    description: initialData?.description ?? '',
    image: initialData?.image ?? '',
  });

  useEffect(() => {
    if (mode === 'create' && form.name) {
      setForm((prev) => ({ ...prev, slug: slugify(form.name) }));
    }
  }, [form.name, mode]);

  const set = (field: keyof CategoryFormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = (): boolean => {
    const errs: Partial<Record<keyof CategoryFormData, string>> = {};
    if (!form.name.trim() || form.name.length < 2) {
      errs.name = 'Name must be at least 2 characters';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      const payload = {
        name: form.name.trim(),
        slug: form.slug || slugify(form.name),
        description: form.description.trim() || undefined,
        image: form.image || undefined,
        ...(mode === 'edit' && initialData?.id ? { id: initialData.id } : {}),
      };

      const url =
        mode === 'edit' && initialData?.id
          ? `/api/admin/categories/${initialData.id}`
          : '/api/admin/categories';

      const response = await fetch(url, {
        method: mode === 'edit' ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? 'Failed to save category');

      toast.success(
        mode === 'create' ? 'Category created successfully!' : 'Category updated successfully!'
      );
      onSuccess?.();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Name */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-gray-700">
          Name <span className="text-destructive">*</span>
        </label>
        <input
          type="text"
          value={form.name}
          onChange={(e) => set('name', e.target.value)}
          placeholder="e.g. Oriental Fragrances"
          className={cn(inputClass, errors.name && 'border-destructive')}
        />
        {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
      </div>

      {/* Slug */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-gray-700">Slug (URL)</label>
        <input
          type="text"
          value={form.slug}
          onChange={(e) => set('slug', slugify(e.target.value))}
          placeholder="oriental-fragrances"
          className={inputClass}
        />
        <p className="text-xs text-gray-400">
          Preview: /categories/{form.slug || 'your-slug'}
        </p>
      </div>

      {/* Description */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-gray-700">Description</label>
        <textarea
          value={form.description}
          onChange={(e) => set('description', e.target.value)}
          rows={3}
          placeholder="Brief description of this category..."
          className="w-full resize-none rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none transition-all placeholder:text-gray-400 focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20"
        />
      </div>

      {/* Image */}
      <div className="rounded-[24px] border border-dashed border-[rgba(245,158,11,0.35)] bg-[linear-gradient(180deg,#fffdf8_0%,#fff8ec_100%)] p-5">
        <div className="mb-4 border-b border-[rgba(245,158,11,0.14)] pb-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-gold-700">
            Category Media
          </p>
          <h3 className="mt-1 font-serif text-xl text-gray-900">
            Category banner image
          </h3>
          <p className="mt-1 text-xs text-gray-500">
            Use one clean visual to represent this fragrance family.
          </p>
        </div>

        <label className="text-sm font-medium text-gray-700">Category Image</label>
        <div className="mt-2">
          <ImageUpload
            value={form.image ? [form.image] : []}
            onChange={(urls) => set('image', urls[0] ?? '')}
          />
        </div>
      </div>

      {/* Submit */}
      <div className="flex gap-3 pt-2">
        <Button
          type="submit"
          variant="luxury"
          isLoading={isLoading}
          className="flex-1"
        >
          {mode === 'create' ? 'Create Category' : 'Update Category'}
        </Button>
      </div>
    </form>
  );
}

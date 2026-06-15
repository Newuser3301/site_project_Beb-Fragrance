// src/app/admin/categories/page.tsx
import { Metadata } from 'next';
import { logFallbackOnce } from '@/lib/app-mode';
import { prisma } from '@/lib/prisma';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/Dialog';
import { DeleteDialog } from '@/components/admin/DeleteDialog';
import { CategoryForm } from '@/components/admin/CategoryForm';
import { Plus, Pencil, Trash2, Folder, Package } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Categories | Beb Fragrance Admin',
  description: 'Manage product categories',
};

export default async function AdminCategoriesPage() {
  const categories = await prisma.category
    .findMany({
      include: {
        _count: {
          select: { products: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })
    .catch((error) => {
      logFallbackOnce(
        'admin.categories',
        'Admin categories could not be loaded. Rendering an empty state instead.',
        error
      );
      return [];
    });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-gray-900">
            Categories
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {categories.length} categor{categories.length !== 1 ? 'ies' : 'y'}
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="luxury">
              <Plus className="mr-2 h-4 w-4" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Add New Category</DialogTitle>
            </DialogHeader>
            <CategoryForm mode="create" />
          </DialogContent>
        </Dialog>
      </div>

      {/* Categories Grid */}
      {categories.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white py-16">
          <Folder className="h-12 w-12 text-gray-300" />
          <h3 className="mt-4 text-lg font-semibold text-gray-500">
            No categories yet
          </h3>
          <p className="mt-1 text-sm text-gray-400">
            Create your first category to organize products
          </p>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="luxury" className="mt-4">
                <Plus className="mr-2 h-4 w-4" />
                Add Category
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Add New Category</DialogTitle>
              </DialogHeader>
              <CategoryForm mode="create" />
            </DialogContent>
          </Dialog>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Card key={category.id} className="group relative overflow-hidden">
              {/* Category Image */}
              <div className="relative h-40 overflow-hidden bg-gradient-to-br from-gold-50 to-cream-100">
                {category.image ? (
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <Folder className="h-16 w-16 text-gold-300" />
                  </div>
                )}
              </div>

              <CardContent className="space-y-3">
                <div>
                  <h3 className="font-serif text-lg font-bold text-gray-900">
                    {category.name}
                  </h3>
                  <p className="text-xs text-gray-500">
                    /{category.slug}
                  </p>
                </div>

                {category.description && (
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {category.description}
                  </p>
                )}

                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Package className="h-4 w-4" />
                  <span>
                    {category._count.products} product
                    {category._count.products !== 1 ? 's' : ''}
                  </span>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Pencil className="mr-1.5 h-3.5 w-3.5" />
                        Edit
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-lg">
                      <DialogHeader>
                        <DialogTitle>Edit Category</DialogTitle>
                      </DialogHeader>
                      <CategoryForm
                        mode="edit"
                        initialData={{
                          id: category.id,
                          name: category.name,
                          slug: category.slug,
                          description: category.description || '',
                          image: category.image || '',
                        }}
                      />
                    </DialogContent>
                  </Dialog>

                  {category._count.products === 0 ? (
                    <DeleteDialog
                      itemName={category.name}
                      onConfirm={async () => {
                        'use server';
                        await prisma.category.delete({
                          where: { id: category.id },
                        });
                      }}
                    >
                      <Button variant="destructive" size="sm">
                        <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                        Delete
                      </Button>
                    </DeleteDialog>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      disabled
                      title="Cannot delete category with products"
                    >
                      <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                      Delete
                    </Button>
                  )}

                  <Link
                    href={`/categories/${category.slug}`}
                    className="ml-auto text-xs text-gold-600 hover:underline"
                  >
                    View
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

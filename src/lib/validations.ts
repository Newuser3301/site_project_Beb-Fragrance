import type { Gender } from '@prisma/client';
import { z } from 'zod';

export const genderSchema = z.enum(['MEN', 'WOMEN', 'UNISEX']);

export const productSchema = z.object({
  name: z
    .string()
    .min(3, 'Mahsulot nomi kamida 3 ta belgidan iborat bo\'lishi kerak'),
  description: z
    .string()
    .min(10, 'Tavsif kamida 10 ta belgidan iborat bo\'lishi kerak'),
  price: z.number().positive('Narx musbat son bo\'lishi kerak'),
  comparePrice: z.number().positive('Taqqoslash narxi musbat son bo\'lishi kerak').optional(),
  costPrice: z.number().positive('Xarajat narxi musbat son bo\'lishi kerak').optional(),
  stock: z.number().int().min(0, 'Zaxira manfiy bo\'lmasligi kerak'),
  categoryId: z.string().min(1, 'Kategoriya tanlanishi shart'),
  gender: genderSchema,
  brand: z.string().min(1, 'Brend nomi kiritilishi shart'),
  volume: z.number().positive('Hajm musbat son bo\'lishi kerak'),
  notes: z.array(z.string().min(1)).min(1, 'Kamida bitta nota kiritilishi kerak'),
  featured: z.boolean().default(false),
  images: z
    .array(z.string().url('Rasm URL noto\'g\'ri formatda'))
    .min(1, 'Kamida bitta rasm URL kiritilishi kerak'),
});

export const productUpdateSchema = productSchema.partial();

export const checkoutSchema = z.object({
  name: z.string().min(2, 'Ism kamida 2 ta belgidan iborat bo\'lishi kerak'),
  email: z.string().email('Noto\'g\'ri email formati'),
  phone: z
    .string()
    .min(9, 'Telefon raqami kamida 9 ta belgidan iborat bo\'lishi kerak'),
  address: z.string().min(5, 'Manzil kamida 5 ta belgidan iborat bo\'lishi kerak'),
  city: z.string().min(2, 'Shahar nomi kiritilishi shart'),
  zipCode: z.string().min(3, 'Pochta indeksi kiritilishi shart'),
});

export const reviewSchema = z.object({
  rating: z
    .number()
    .int()
    .min(1, 'Reyting kamida 1 bo\'lishi kerak')
    .max(5, 'Reyting ko\'pi bilan 5 bo\'lishi kerak'),
  comment: z
    .string()
    .max(500, 'Izoh 500 ta belgidan oshmasligi kerak')
    .optional(),
});

export const cartItemSchema = z.object({
  productId: z.string().min(1, 'Mahsulot ID kiritilishi shart'),
  quantity: z
    .number()
    .int()
    .min(1, 'Miqdor kamida 1 bo\'lishi kerak'),
});

export const searchParamsSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(12),
  category: z.string().optional(),
  gender: genderSchema.optional(),
  minPrice: z.coerce.number().nonnegative().optional(),
  maxPrice: z.coerce.number().positive().optional(),
  search: z.string().optional(),
  brand: z.string().optional(),
  volume: z.coerce.number().positive().optional(),
  exclude: z.string().optional(),
  sort: z
    .enum([
      'newest',
      'oldest',
      'price-asc',
      'price-desc',
      'name-asc',
      'name-desc',
      'bestseller',
    ])
    .default('newest'),
});

export type ProductInput = z.infer<typeof productSchema>;
export type ProductUpdateInput = z.infer<typeof productUpdateSchema>;
export type CheckoutInput = z.infer<typeof checkoutSchema>;
export type ReviewInput = z.infer<typeof reviewSchema>;
export type CartItemInput = z.infer<typeof cartItemSchema>;
export type SearchParamsInput = z.infer<typeof searchParamsSchema>;
export type GenderInput = z.infer<typeof genderSchema>;

const GENDER_TO_PRISMA: Record<GenderInput, Gender> = {
  MEN: 'MALE',
  WOMEN: 'FEMALE',
  UNISEX: 'UNISEX',
};

const GENDER_FROM_PRISMA: Record<Gender, GenderInput> = {
  MALE: 'MEN',
  FEMALE: 'WOMEN',
  UNISEX: 'UNISEX',
};

export function mapGenderToPrisma(gender: GenderInput): Gender {
  return GENDER_TO_PRISMA[gender];
}

export function mapGenderFromPrisma(gender: Gender): GenderInput {
  return GENDER_FROM_PRISMA[gender];
}

const NOTE_TYPES = ['TOP', 'MIDDLE', 'BASE'] as const;

export function mapNotesToPrisma(notes: string[]): Array<{ name: string; type: 'TOP' | 'MIDDLE' | 'BASE' }> {
  return notes.map((name, index) => ({
    name,
    type: NOTE_TYPES[index % NOTE_TYPES.length],
  }));
}

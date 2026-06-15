import {
  Gender,
  NoteType,
  PrismaClient,
} from '@prisma/client';
import { hashPassword } from '../src/lib/password';
import { slugify } from '../src/lib/utils';

const prisma = new PrismaClient();

type SeedProduct = {
  name: string;
  description: string;
  price: number;
  comparePrice: number | null;
  stock: number;
  volume: number;
  brand: string;
  gender: Gender;
  notes: string[];
  featured?: boolean;
  bestseller?: boolean;
  newArrival?: boolean;
  images: string[];
  categorySlug: string;
};

const categories = [
  {
    name: 'Oriental',
    slug: 'oriental',
    description: 'Warm, exotic, and sensual fragrances with amber, oud, and spice notes.',
    image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800',
  },
  {
    name: 'Floral',
    slug: 'floral',
    description: 'Elegant floral perfumes with rose, jasmine, and peony accords.',
    image: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=800',
  },
  {
    name: 'Woody',
    slug: 'woody',
    description: 'Refined woody blends built around cedar, sandalwood, and vetiver.',
    image: 'https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=800',
  },
  {
    name: 'Fresh',
    slug: 'fresh',
    description: 'Bright, clean, and uplifting fragrances with citrus and aquatic notes.',
    image: 'https://images.unsplash.com/photo-1557170339-96395f6c2c7a?w=800',
  },
  {
    name: 'Gourmand',
    slug: 'gourmand',
    description: 'Rich edible-inspired scents with vanilla, chocolate, coffee, and caramel.',
    image: 'https://images.unsplash.com/photo-1600612253971-422e7f7faeb6?w=800',
  },
];

const products: SeedProduct[] = [
  {
    name: 'Oud Royale',
    description: 'A majestic oud fragrance layered with saffron, rose, sandalwood, and vanilla for a deep luxurious trail.',
    price: 295,
    comparePrice: 350,
    stock: 25,
    volume: 100,
    brand: 'Beb Fragrance',
    gender: 'UNISEX',
    notes: ['Bergamot', 'Saffron', 'Oud', 'Rose', 'Sandalwood', 'Vanilla'],
    featured: true,
    bestseller: true,
    images: [
      'https://images.unsplash.com/photo-1541643600914-78b084683601?w=900',
      'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=900',
    ],
    categorySlug: 'oriental',
  },
  {
    name: 'Rose Noire',
    description: 'A dark rose composition with black pepper, patchouli, leather, and musk for dramatic evening wear.',
    price: 245,
    comparePrice: 290,
    stock: 30,
    volume: 100,
    brand: 'Beb Fragrance',
    gender: 'FEMALE',
    notes: ['Black Pepper', 'Turkish Rose', 'Patchouli', 'Oud', 'Leather', 'Musk'],
    featured: true,
    images: [
      'https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=900',
      'https://images.unsplash.com/photo-1557170339-96395f6c2c7a?w=900',
    ],
    categorySlug: 'floral',
  },
  {
    name: 'Golden Amber',
    description: 'A glowing amber scent wrapped in vanilla, cinnamon, clove, and tonka bean.',
    price: 185,
    comparePrice: 220,
    stock: 40,
    volume: 50,
    brand: 'Beb Fragrance',
    gender: 'UNISEX',
    notes: ['Citrus', 'Cinnamon', 'Clove', 'Amber', 'Vanilla', 'Tonka Bean'],
    bestseller: true,
    images: [
      'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=900',
      'https://images.unsplash.com/photo-1600612253971-422e7f7faeb6?w=900',
    ],
    categorySlug: 'gourmand',
  },
  {
    name: 'Santal Supreme',
    description: 'Creamy sandalwood with iris, amber, and cardamom for a smooth modern woody signature.',
    price: 210,
    comparePrice: null,
    stock: 20,
    volume: 100,
    brand: 'Beb Fragrance',
    gender: 'MALE',
    notes: ['Cardamom', 'Iris', 'Sandalwood', 'Cedar', 'Amber', 'Musk'],
    featured: true,
    images: [
      'https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=900',
      'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=900',
    ],
    categorySlug: 'woody',
  },
  {
    name: 'Citrus Bloom',
    description: 'A sparkling Mediterranean blend of bergamot, lemon, neroli, petitgrain, and white musk.',
    price: 150,
    comparePrice: 175,
    stock: 50,
    volume: 50,
    brand: 'Beb Fragrance',
    gender: 'FEMALE',
    notes: ['Bergamot', 'Lemon', 'Neroli', 'Petitgrain', 'White Musk', 'Vetiver'],
    newArrival: true,
    images: [
      'https://images.unsplash.com/photo-1557170339-96395f6c2c7a?w=900',
      'https://images.unsplash.com/photo-1541643600914-78b084683601?w=900',
    ],
    categorySlug: 'fresh',
  },
  {
    name: 'Noir Velvet',
    description: 'Dark chocolate, rum, tobacco, coffee, and patchouli create a velvety statement fragrance.',
    price: 320,
    comparePrice: 380,
    stock: 15,
    volume: 100,
    brand: 'Beb Fragrance',
    gender: 'UNISEX',
    notes: ['Dark Chocolate', 'Rum', 'Tobacco', 'Coffee', 'Patchouli', 'Vanilla'],
    featured: true,
    bestseller: true,
    images: [
      'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=900',
      'https://images.unsplash.com/photo-1600612253971-422e7f7faeb6?w=900',
    ],
    categorySlug: 'gourmand',
  },
  {
    name: 'Ocean Mist',
    description: 'A fresh aquatic perfume with sea salt, lavender, rosemary, driftwood, and moss.',
    price: 140,
    comparePrice: null,
    stock: 45,
    volume: 50,
    brand: 'Beb Fragrance',
    gender: 'UNISEX',
    notes: ['Sea Salt', 'Marine Notes', 'Lavender', 'Rosemary', 'Driftwood', 'Moss'],
    images: [
      'https://images.unsplash.com/photo-1557170339-96395f6c2c7a?w=900',
      'https://images.unsplash.com/photo-1541643600914-78b084683601?w=900',
    ],
    categorySlug: 'fresh',
  },
  {
    name: 'Midnight Orchid',
    description: 'A mysterious floral-oriental scent with black orchid, plum, patchouli, incense, and vanilla.',
    price: 280,
    comparePrice: null,
    stock: 22,
    volume: 100,
    brand: 'Beb Fragrance',
    gender: 'FEMALE',
    notes: ['Black Orchid', 'Plum', 'Patchouli', 'Incense', 'Dark Chocolate', 'Vanilla'],
    featured: true,
    newArrival: true,
    images: [
      'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=900',
      'https://images.unsplash.com/photo-1600612253971-422e7f7faeb6?w=900',
    ],
    categorySlug: 'floral',
  },
];

async function main() {
  console.log('Seeding fragrance store data...');
  const adminEmail = (process.env.ADMIN_EMAIL ?? 'admin@bebfragrance.com').toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD ?? 'Admin12345!';
  const adminPasswordHash = await hashPassword(adminPassword);

  await prisma.review.deleteMany();
  await prisma.wishlistItem.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.productNote.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.collection.deleteMany();
  await prisma.category.deleteMany();
  await prisma.brand.deleteMany();

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      name: 'Store Admin',
      role: 'ADMIN',
      password: adminPasswordHash,
    },
    create: {
      email: adminEmail,
      name: 'Store Admin',
      role: 'ADMIN',
      password: adminPasswordHash,
    },
  });

  const categoryMap = new Map<string, { id: string }>();

  for (let index = 0; index < categories.length; index += 1) {
    const category = categories[index];
    const created = await prisma.category.create({
      data: {
        name: category.name,
        slug: category.slug,
        description: category.description,
        image: category.image,
        sortOrder: index,
        isActive: true,
      },
      select: { id: true },
    });
    categoryMap.set(category.slug, created);
  }

  const brand = await prisma.brand.create({
    data: {
      name: 'Beb Fragrance',
      slug: 'beb-fragrance',
      description: 'Premium luxury fragrance house curated for modern perfume lovers.',
      isActive: true,
    },
  });

  for (let index = 0; index < products.length; index += 1) {
    const product = products[index];
    const category = categoryMap.get(product.categorySlug);

    if (!category) {
      throw new Error(`Category not found for ${product.name}`);
    }

    const skuBase = `BEB-${String(index + 1).padStart(4, '0')}`;

    await prisma.product.create({
      data: {
        name: product.name,
        slug: slugify(product.name),
        description: product.description,
        shortDescription: product.description.slice(0, 150),
        sku: skuBase,
        gender: product.gender,
        isActive: true,
        isFeatured: product.featured ?? false,
        isBestseller: product.bestseller ?? false,
        isNewArrival: product.newArrival ?? false,
        metaTitle: `${product.name} | Beb Fragrance`,
        metaDescription: product.description.slice(0, 155),
        brandId: brand.id,
        categoryId: category.id,
        images: {
          create: product.images.map((url, imageIndex) => ({
            url,
            alt: product.name,
            isPrimary: imageIndex === 0,
            sortOrder: imageIndex,
          })),
        },
        variants: {
          create: {
            name: `${product.volume}ml`,
            sku: `${skuBase}-${product.volume}`,
            size: `${product.volume}ml`,
            sizeMl: product.volume,
            price: product.price,
            comparePrice: product.comparePrice,
            stock: product.stock,
            isActive: true,
          },
        },
        notes: {
          create: product.notes.map((name, noteIndex) => ({
            name,
            type:
              noteIndex < 2
                ? NoteType.TOP
                : noteIndex < 4
                ? NoteType.MIDDLE
                : NoteType.BASE,
          })),
        },
      },
    });
  }

  console.log(
    `Created ${categories.length} categories, ${products.length} products, and admin user ${adminEmail}.`
  );
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error('Seed failed:', error);
    await prisma.$disconnect();
    process.exit(1);
  });

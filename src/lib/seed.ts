import {
  PrismaClient,
  Gender,
  FragranceFamily,
  NoteType,
  UserRole,
} from '@prisma/client';
import { slugify } from './utils';

const prisma = new PrismaClient();

const CATEGORIES = [
  {
    name: 'Oriental',
    slug: 'oriental',
    description: 'Issiq, jozibali va sirli sharqiy xushbo\'y hidlar',
    fragranceFamily: 'ORIENTAL' as FragranceFamily,
  },
  {
    name: 'Floral',
    slug: 'floral',
    description: 'Nafis gul va pushti notalar bilan boyitilgan hidlar',
    fragranceFamily: 'FLORAL' as FragranceFamily,
  },
  {
    name: 'Woody',
    slug: 'woody',
    description: 'O\'rmon va yog\'och notalari bilan boy hidlar',
    fragranceFamily: 'WOODY' as FragranceFamily,
  },
  {
    name: 'Fresh',
    slug: 'fresh',
    description: 'Yengil, tetik va energiya beruvchi hidlar',
    fragranceFamily: 'FRESH' as FragranceFamily,
  },
  {
    name: 'Oriental Spicy',
    slug: 'oriental-spicy',
    description: 'Ziravorlar va sharqiy notalar uyg\'unligi',
    fragranceFamily: 'SPICY' as FragranceFamily,
  },
];

interface SeedPerfume {
  name: string;
  brand: string;
  categorySlug: string;
  gender: Gender;
  price: number;
  comparePrice?: number;
  stock: number;
  volume: number;
  notes: string[];
  description: string;
  imageUrl: string;
}

const PERFUMES: SeedPerfume[] = [
  {
    name: 'Oud Wood Intense',
    brand: 'Tom Ford',
    categorySlug: 'woody',
    gender: 'UNISEX',
    price: 395,
    comparePrice: 450,
    stock: 45,
    volume: 100,
    notes: ['Oud', 'Rosewood', 'Cardamom', 'Sandalwood', 'Vanilla'],
    description: 'Tom Ford Oud Wood Intense — bu sharqiy va g\'arbiy an\'analar uyg\'unligida yaratilgan ajoyib hid. Boy oud notasi sandal va vanil bilan uyg\'unlashgan. Har bir tomchi bilan siz o\'ziga xos va esda qolarli taassurot qoldirasiz. Uzoq davom etadigan EDP formulasi tungi tadbirlar va maxsus kunlar uchun ideal tanlovdir.',
    imageUrl: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=600&h=800&fit=crop',
  },
  {
    name: 'No. 5 Eau de Parfum',
    brand: 'Chanel',
    categorySlug: 'floral',
    gender: 'FEMALE',
    price: 185,
    comparePrice: 220,
    stock: 78,
    volume: 100,
    notes: ['Aldehydes', 'Ylang-Ylang', 'Jasmine', 'Rose', 'Sandalwood'],
    description: 'Chanel No. 5 — parfyumeriya dunyosining eng mashhur va abadiy klassikasi. 1921-yilda yaratilgan bu hid hali ham zamonaviy va nafis. Gullar va aldehidlar uyg\'unligi ayollarning jozibasini oshiradi. Har qanday holatda o\'ziga xoslik va nafosat ifodasidir.',
    imageUrl: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600&h=800&fit=crop',
  },
  {
    name: 'Sauvage Elixir',
    brand: 'Dior',
    categorySlug: 'fresh',
    gender: 'MALE',
    price: 195,
    comparePrice: 230,
    stock: 62,
    volume: 60,
    notes: ['Grapefruit', 'Lavender', 'Licorice', 'Ambroxan', 'Patchouli'],
    description: 'Dior Sauvage Elixir — erkaklar uchun yaratilgan kuchli va jozibali hid. Yangi va ziravorli notalar uyg\'unligi kunduzgi va tungi foydalanish uchun mos. Uzoq davom etadigan formulasi bilan siz butun kun davomida yangi va ishonchli his qilasiz.',
    imageUrl: 'https://images.unsplash.com/photo-1615634260162-c5170a9bbf62?w=600&h=800&fit=crop',
  },
  {
    name: 'Aventus',
    brand: 'Creed',
    categorySlug: 'fresh',
    gender: 'MALE',
    price: 435,
    comparePrice: 480,
    stock: 28,
    volume: 100,
    notes: ['Pineapple', 'Birch', 'Musk', 'Oakmoss', 'Ambergris'],
    description: 'Creed Aventus — zamonaviy erkaklar parfyumeriyasining eng nufuzli nomlaridan biri. Ananas va yog\'och notalari bilan boyitilgan bu hid kuch, muvaffaqiyat va joziba ramzidir. Har bir tomchi bilan siz o\'ziga xos va esda qolarli taassurot qoldirasiz.',
    imageUrl: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600&h=800&fit=crop',
  },
  {
    name: 'Black Orchid',
    brand: 'Tom Ford',
    categorySlug: 'oriental',
    gender: 'UNISEX',
    price: 285,
    comparePrice: 320,
    stock: 55,
    volume: 100,
    notes: ['Black Truffle', 'Ylang-Ylang', 'Black Currant', 'Patchouli', 'Incense'],
    description: 'Tom Ford Black Orchid — sirli va jozibali sharqiy hid. Qora orchid va ziravorlar uyg\'unligi tungi tadbirlar va maxsus kunlar uchun ideal. Bu hid sizni boshqalardan ajratib turadi va uzoq davom etadigan taassurot qoldiradi.',
    imageUrl: 'https://images.unsplash.com/photo-1588405748880-12cf1d1a6b5f?w=600&h=800&fit=crop',
  },
  {
    name: 'Flowerbomb',
    brand: 'Viktor & Rolf',
    categorySlug: 'floral',
    gender: 'FEMALE',
    price: 165,
    comparePrice: 195,
    stock: 90,
    volume: 100,
    notes: ['Tea', 'Bergamot', 'Freesia', 'Rose', 'Patchouli'],
    description: 'Viktor & Rolf Flowerbomb — gullar portlashi kabi yorqin va quvonchli hid. Nafis gul notalari ayollarning jozibasini oshiradi. Kunduzgi va kechki foydalanish uchun mukammal tanlov. Har bir tomchi bilan siz bahor his qilasiz.',
    imageUrl: 'https://images.unsplash.com/photo-1619994403073-2cec844b8e63?w=600&h=800&fit=crop',
  },
  {
    name: 'Bleu de Chanel',
    brand: 'Chanel',
    categorySlug: 'woody',
    gender: 'MALE',
    price: 175,
    comparePrice: 210,
    stock: 70,
    volume: 100,
    notes: ['Citrus', 'Mint', 'Ginger', 'Sandalwood', 'Cedar'],
    description: 'Bleu de Chanel — zamonaviy erkaklar uchun yaratilgan klassik va nafis hid. Sitrus va yog\'och notalari uyg\'unligi kunduzgi va tungi foydalanish uchun mos. Uzoq davom etadigan formulasi bilan siz butun kun davomida yangi his qilasiz.',
    imageUrl: 'https://images.unsplash.com/photo-1615634260162-c5170a9bbf62?w=600&h=800&fit=crop',
  },
  {
    name: 'Baccarat Rouge 540',
    brand: 'Maison Francis Kurkdjian',
    categorySlug: 'oriental',
    gender: 'UNISEX',
    price: 425,
    comparePrice: 465,
    stock: 22,
    volume: 70,
    notes: ['Saffron', 'Jasmine', 'Amberwood', 'Cedar', 'Fir Resin'],
    description: 'Baccarat Rouge 540 — dunyodagi eng qimmat va talab qilinadigan hidlardan biri. Zafron va amber notalari bilan boyitilgan bu hid hashamat va nafosat ramzidir. Har bir tomchi bilan siz o\'ziga xos va esda qolarli taassurot qoldirasiz.',
    imageUrl: 'https://images.unsplash.com/photo-1595425970375-c37afc9f4d91?w=600&h=800&fit=crop',
  },
  {
    name: 'Acqua di Gio Profondo',
    brand: 'Giorgio Armani',
    categorySlug: 'fresh',
    gender: 'MALE',
    price: 125,
    comparePrice: 150,
    stock: 85,
    volume: 100,
    notes: ['Bergamot', 'Marine Notes', 'Rosemary', 'Patchouli', 'Musk'],
    description: 'Acqua di Gio Profondo — dengiz va yangilik hissi beruvchi erkaklar hididir. Dengiz notalari va sitrus uyg\'unligi yoz va kunduzgi foydalanish uchun ideal. Yengil va tetik formulasi bilan siz butun kun davomida yangi his qilasiz.',
    imageUrl: 'https://images.unsplash.com/photo-1615634260162-c5170a9bbf62?w=600&h=800&fit=crop',
  },
  {
    name: 'La Vie Est Belle',
    brand: 'Lancôme',
    categorySlug: 'floral',
    gender: 'FEMALE',
    price: 145,
    comparePrice: 175,
    stock: 95,
    volume: 100,
    notes: ['Black Currant', 'Pear', 'Iris', 'Jasmine', 'Vanilla'],
    description: 'La Vie Est Belle — hayot go\'zalligi va quvonch ramzi. Gullar va vanil notalari ayollarning jozibasini oshiradi. Kunduzgi va kechki foydalanish uchun mukammal tanlov. Har bir tomchi bilan siz baxt va quvonch his qilasiz.',
    imageUrl: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600&h=800&fit=crop',
  },
  {
    name: 'Spicebomb Extreme',
    brand: 'Viktor & Rolf',
    categorySlug: 'oriental-spicy',
    gender: 'MALE',
    price: 155,
    comparePrice: 185,
    stock: 58,
    volume: 90,
    notes: ['Black Pepper', 'Saffron', 'Tobacco', 'Vanilla', 'Benzoin'],
    description: 'Spicebomb Extreme — kuchli va jozibali erkaklar hididir. Ziravorlar va tutun notalari uyg\'unligi tungi tadbirlar uchun ideal. Uzoq davom etadigan formulasi bilan siz butun kecha davomida jozibali his qilasiz.',
    imageUrl: 'https://images.unsplash.com/photo-1615634260162-c5170a9bbf62?w=600&h=800&fit=crop',
  },
  {
    name: 'Good Girl',
    brand: 'Carolina Herrera',
    categorySlug: 'floral',
    gender: 'FEMALE',
    price: 135,
    comparePrice: 165,
    stock: 72,
    volume: 80,
    notes: ['Almond', 'Coffee', 'Jasmine', 'Tuberose', 'Tonka Bean'],
    description: 'Good Girl — zamonaviy ayollar uchun yaratilgan jozibali va sirli hid. Gullar va qahva notalari uyg\'unligi kunduzgi va tungi foydalanish uchun mos. Har bir tomchi bilan siz o\'ziga xos va esda qolarli taassurot qoldirasiz.',
    imageUrl: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600&h=800&fit=crop',
  },
  {
    name: 'Santal 33',
    brand: 'Le Labo',
    categorySlug: 'woody',
    gender: 'UNISEX',
    price: 295,
    comparePrice: 340,
    stock: 38,
    volume: 100,
    notes: ['Cardamom', 'Iris', 'Violet', 'Sandalwood', 'Cedar'],
    description: 'Le Labo Santal 33 — zamonaviy va minimalist hid. Sandal va yog\'och notalari uyg\'unligi kunduzgi va tungi foydalanish uchun mos. Uzoq davom etadigan formulasi bilan siz butun kun davomida nafis his qilasiz.',
    imageUrl: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=600&h=800&fit=crop',
  },
  {
    name: 'Angel',
    brand: 'Thierry Mugler',
    categorySlug: 'oriental',
    gender: 'FEMALE',
    price: 115,
    comparePrice: 140,
    stock: 65,
    volume: 100,
    notes: ['Melon', 'Jasmine', 'Caramel', 'Chocolate', 'Patchouli'],
    description: 'Thierry Mugler Angel — shirin va jozibali ayollar hididir. Karamel va shokolad notalari uyg\'unligi tungi tadbirlar uchun ideal. Har bir tomchi bilan siz o\'ziga xos va esda qolarli taassurot qoldirasiz.',
    imageUrl: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600&h=800&fit=crop',
  },
  {
    name: 'Terre d\'Hermès',
    brand: 'Hermès',
    categorySlug: 'woody',
    gender: 'MALE',
    price: 185,
    comparePrice: 215,
    stock: 48,
    volume: 100,
    notes: ['Orange', 'Grapefruit', 'Flint', 'Vetiver', 'Benzoin'],
    description: 'Terre d\'Hermès — tabiat va erkaklik uyg\'unligida yaratilgan nafis hid. Sitrus va vetiver notalari kunduzgi foydalanish uchun ideal. Uzoq davom etadigan formulasi bilan siz butun kun davomida ishonchli his qilasiz.',
    imageUrl: 'https://images.unsplash.com/photo-1615634260162-c5170a9bbf62?w=600&h=800&fit=crop',
  },
  {
    name: 'Libre Intense',
    brand: 'Yves Saint Laurent',
    categorySlug: 'floral',
    gender: 'FEMALE',
    price: 155,
    comparePrice: 185,
    stock: 80,
    volume: 90,
    notes: ['Lavender', 'Orange Blossom', 'Jasmine', 'Vanilla', 'Ambergris'],
    description: 'Libre Intense — erkinlik va joziba ramzi. Gullar va vanil notalari ayollarning jozibasini oshiradi. Kunduzgi va kechki foydalanish uchun mukammal tanlov. Har bir tomchi bilan siz kuchli va mustaqil his qilasiz.',
    imageUrl: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600&h=800&fit=crop',
  },
  {
    name: 'Oud for Greatness',
    brand: 'Initio Parfums',
    categorySlug: 'oriental-spicy',
    gender: 'UNISEX',
    price: 365,
    comparePrice: 410,
    stock: 25,
    volume: 90,
    notes: ['Lavender', 'Saffron', 'Oud', 'Musk', 'Nutmeg'],
    description: 'Initio Oud for Greatness — boy oud va ziravorlar uyg\'unligida yaratilgan hashamatli hid. Sharqiy notalar tungi tadbirlar va maxsus kunlar uchun ideal. Har bir tomchi bilan siz o\'ziga xos va esda qolarli taassurot qoldirasiz.',
    imageUrl: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=600&h=800&fit=crop',
  },
  {
    name: 'Light Blue',
    brand: 'Dolce & Gabbana',
    categorySlug: 'fresh',
    gender: 'FEMALE',
    price: 95,
    comparePrice: 120,
    stock: 100,
    volume: 100,
    notes: ['Sicilian Lemon', 'Apple', 'Bamboo', 'Jasmine', 'Cedar'],
    description: 'Dolce & Gabbana Light Blue — yoz va dengiz hissi beruvchi yengil hid. Sitrus va gul notalari uyg\'unligi kunduzgi foydalanish uchun ideal. Yengil va tetik formulasi bilan siz butun kun davomida yangi his qilasiz.',
    imageUrl: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600&h=800&fit=crop',
  },
  {
    name: 'One Million',
    brand: 'Paco Rabanne',
    categorySlug: 'oriental-spicy',
    gender: 'MALE',
    price: 105,
    comparePrice: 130,
    stock: 88,
    volume: 100,
    notes: ['Grapefruit', 'Mint', 'Cinnamon', 'Leather', 'Amber'],
    description: 'Paco Rabanne One Million — yosh va jozibali erkaklar hididir. Sitrus va ziravorlar uyg\'unligi kunduzgi va tungi foydalanish uchun mos. Uzoq davom etadigan formulasi bilan siz butun kun davomida jozibali his qilasiz.',
    imageUrl: 'https://images.unsplash.com/photo-1615634260162-c5170a9bbf62?w=600&h=800&fit=crop',
  },
  {
    name: 'Coco Mademoiselle',
    brand: 'Chanel',
    categorySlug: 'floral',
    gender: 'FEMALE',
    price: 195,
    comparePrice: 230,
    stock: 60,
    volume: 100,
    notes: ['Orange', 'Mandarin', 'Rose', 'Jasmine', 'Patchouli'],
    description: 'Chanel Coco Mademoiselle — zamonaviy va nafis ayollar hididir. Sitrus va gul notalari uyg\'unligi kunduzgi va kechki foydalanish uchun mukammal. Har bir tomchi bilan siz o\'ziga xos va esda qolarli taassurot qoldirasiz.',
    imageUrl: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600&h=800&fit=crop',
  },
];

const REVIEW_COMMENTS = [
  'Ajoyib hid, uzoq davom etadi. Tavsiya qilaman!',
  'Juda nafis va zamonaviy. Menga juda yoqdi.',
  'Narxiga arziydi. Sifatli va original.',
  'Yengil va tetik, kunduzgi foydalanish uchun ideal.',
  'Hashamatli taassurot qoldiradi. Yana sotib olaman.',
  'Notalar juda uyg\'un. Sevimli hidimga aylandi.',
  'Yetkazib berish tez, mahsulot a\'lo darajada.',
  'Sovg\'a sifatida berdim, juda xursand bo\'ldi.',
];

const NOTE_TYPES: NoteType[] = ['TOP', 'MIDDLE', 'BASE'];

async function clearDatabase(): Promise<void> {
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.review.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.wishlistItem.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.productNote.deleteMany();
  await prisma.product.deleteMany();
  await prisma.collection.deleteMany();
  await prisma.blogPost.deleteMany();
  await prisma.newsletterSubscriber.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.setting.deleteMany();
  await prisma.address.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.verificationToken.deleteMany();
  await prisma.user.deleteMany();
  await prisma.category.deleteMany();
  await prisma.brand.deleteMany();
}

async function main(): Promise<void> {
  console.log('🌸 Beb Fragrance seed boshlandi...');

  await clearDatabase();
  console.log('✅ Mavjud ma\'lumotlar o\'chirildi');

  const adminUser = await prisma.user.create({
    data: {
      name: 'Beb Admin',
      email: 'admin@bebfragrance.com',
      role: UserRole.ADMIN,
      emailVerified: new Date(),
    },
  });
  console.log(`✅ Admin foydalanuvchi yaratildi: ${adminUser.email}`);

  const customerUsers = await Promise.all(
    [
      { name: 'Dilnoza Karimova', email: 'dilnoza@example.com' },
      { name: 'Jasur Toshmatov', email: 'jasur@example.com' },
      { name: 'Malika Rahimova', email: 'malika@example.com' },
      { name: 'Sardor Yusupov', email: 'sardor@example.com' },
      { name: 'Nilufar Azimova', email: 'nilufar@example.com' },
      { name: 'Bekzod Mirzayev', email: 'bekzod@example.com' },
    ].map((customer) =>
      prisma.user.create({
        data: {
          name: customer.name,
          email: customer.email,
          role: UserRole.CUSTOMER,
          emailVerified: new Date(),
        },
      })
    )
  );
  console.log(`✅ ${customerUsers.length} ta mijoz yaratildi`);

  const categoryMap = new Map<string, string>();

  for (const category of CATEGORIES) {
    const created = await prisma.category.create({
      data: {
        name: category.name,
        slug: category.slug,
        description: category.description,
        isActive: true,
      },
    });
    categoryMap.set(category.slug, created.id);
  }
  console.log(`✅ ${CATEGORIES.length} ta kategoriya yaratildi`);

  const brandMap = new Map<string, string>();

  for (const perfume of PERFUMES) {
    if (!brandMap.has(perfume.brand)) {
      const brand = await prisma.brand.create({
        data: {
          name: perfume.brand,
          slug: slugify(perfume.brand),
          isActive: true,
        },
      });
      brandMap.set(perfume.brand, brand.id);
    }
  }
  console.log(`✅ ${brandMap.size} ta brend yaratildi`);

  const createdProducts: Array<{ id: string; name: string }> = [];

  for (const perfume of PERFUMES) {
    const categoryId = categoryMap.get(perfume.categorySlug);
    const brandId = brandMap.get(perfume.brand);
    const category = CATEGORIES.find((c) => c.slug === perfume.categorySlug);

    if (!categoryId || !brandId) {
      throw new Error(`Kategoriya yoki brend topilmadi: ${perfume.name}`);
    }

    const productSlug = slugify(perfume.name);
    const productSku = `BF-${productSlug.toUpperCase().replace(/-/g, '')}-${perfume.volume}`;

    const product = await prisma.product.create({
      data: {
        name: perfume.name,
        slug: productSlug,
        description: perfume.description,
        shortDescription: perfume.description.slice(0, 120) + '...',
        sku: productSku,
        gender: perfume.gender,
        fragranceFamily: category?.fragranceFamily,
        concentration: 'EDP',
        isActive: true,
        isFeatured: perfume.price > 300,
        isNewArrival: perfume.stock > 80,
        isBestseller: perfume.stock < 40,
        brandId,
        categoryId,
        images: {
          create: [
            {
              url: perfume.imageUrl,
              alt: perfume.name,
              isPrimary: true,
              sortOrder: 0,
            },
            {
              url: perfume.imageUrl.replace('w=600', 'w=400'),
              alt: `${perfume.name} - ikkinchi rasm`,
              isPrimary: false,
              sortOrder: 1,
            },
          ],
        },
        variants: {
          create: {
            name: `${perfume.volume}ml`,
            sku: `${productSku}-VAR`,
            size: `${perfume.volume}ml`,
            sizeMl: perfume.volume,
            price: perfume.price,
            comparePrice: perfume.comparePrice,
            stock: perfume.stock,
            isActive: true,
          },
        },
        notes: {
          create: perfume.notes.map((note, index) => ({
            name: note,
            type: NOTE_TYPES[index % NOTE_TYPES.length],
          })),
        },
      },
    });

    createdProducts.push({ id: product.id, name: product.name });
  }
  console.log(`✅ ${createdProducts.length} ta parfyum yaratildi`);

  let reviewCount = 0;

  for (const product of createdProducts) {
    const numReviews = 2 + Math.floor(Math.random() * 2);
    const shuffledCustomers = [...customerUsers].sort(() => Math.random() - 0.5);

    for (let i = 0; i < numReviews; i++) {
      const customer = shuffledCustomers[i];
      const rating = 3 + Math.floor(Math.random() * 3);
      const comment = REVIEW_COMMENTS[Math.floor(Math.random() * REVIEW_COMMENTS.length)];

      await prisma.review.create({
        data: {
          rating,
          title: rating >= 4 ? 'Ajoyib mahsulot!' : 'Yaxshi',
          comment,
          isVerified: true,
          isApproved: true,
          userId: customer.id,
          productId: product.id,
        },
      });
      reviewCount++;
    }
  }
  console.log(`✅ ${reviewCount} ta sharh yaratildi`);

  console.log('🎉 Beb Fragrance seed muvaffaqiyatli yakunlandi!');
}

main()
  .catch((error) => {
    console.error('❌ Seed xatosi:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

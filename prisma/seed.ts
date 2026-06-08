// prisma/seed.ts
import { PrismaClient, Gender } from "@prisma/client";
import { slugify } from "../src/lib/utils";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seed boshlandi...");

  // Avval hamma narsani tozalash
  console.log("🗑️  Eski ma'lumotlar tozalanmoqda...");
  await prisma.review.deleteMany();
  await prisma.wishlistItem.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.account.deleteMany();
  await prisma.session.deleteMany();
  await prisma.user.deleteMany();

  console.log("✅ Eski ma'lumotlar tozalandi");

  // ============================================
  // Kategoriyalar
  // ============================================
  console.log("📁 Kategoriyalar yaratilmoqda...");

  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: "Oriental",
        slug: "oriental",
        description:
          "Warm, exotic, and sensual fragrances with notes of spices, vanilla, amber, and musk.",
        image:
          "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400",
      },
    }),
    prisma.category.create({
      data: {
        name: "Floral",
        slug: "floral",
        description:
          "Romantic and feminine scents featuring rose, jasmine, lavender, and other flower notes.",
        image:
          "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=400",
      },
    }),
    prisma.category.create({
      data: {
        name: "Woody",
        slug: "woody",
        description:
          "Earthy, warm fragrances with sandalwood, cedar, patchouli, and vetiver notes.",
        image:
          "https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=400",
      },
    }),
    prisma.category.create({
      data: {
        name: "Fresh",
        slug: "fresh",
        description:
          "Clean, crisp, and invigorating scents with citrus, aquatic, and green notes.",
        image:
          "https://images.unsplash.com/photo-1557170339-96395f6c2c7a?w=400",
      },
    }),
    prisma.category.create({
      data: {
        name: "Gourmand",
        slug: "gourmand",
        description:
          "Sweet, edible-smelling fragrances with vanilla, caramel, chocolate, and coffee notes.",
        image:
          "https://images.unsplash.com/photo-1600612253971-422e7f7faeb6?w=400",
      },
    }),
  ]);

  console.log(`✅ ${categories.length} ta kategoriya yaratildi`);

  // ============================================
  // Mahsulotlar
  // ============================================
  console.log("🧴 Mahsulotlar yaratilmoqda...");

  const productsData = [
    {
      name: "Oud Royale",
      description:
        "A majestic blend of rare oud wood from Southeast Asia, combined with rich amber and warm spices. This luxurious fragrance opens with bergamot and saffron, evolves into a heart of Bulgarian rose and jasmine, and settles into a deep base of aged oud, sandalwood, and vanilla absolute.",
      price: 295.0,
      comparePrice: 350.0,
      stock: 25,
      volume: 100,
      brand: "Beb Fragrance",
      gender: "UNISEX" as Gender,
      notes: ["Bergamot", "Saffron", "Oud", "Rose", "Sandalwood", "Vanilla"],
      featured: true,
      images: [
        "https://images.unsplash.com/photo-1541643600914-78b084683601?w=600",
        "https://images.unsplash.com/photo-1590736969955-71cc94901144?w=600",
      ],
    },
    {
      name: "Rose Noire",
      description:
        "An enchanting dark rose fragrance that captures the mystery of midnight gardens. Turkish rose absolute mingles with black pepper, creating an intoxicating opening. The heart reveals patchouli and oud, while the base of leather and musk adds depth and sensuality.",
      price: 245.0,
      comparePrice: 290.0,
      stock: 30,
      volume: 100,
      brand: "Beb Fragrance",
      gender: "WOMEN" as Gender,
      notes: [
        "Black Pepper",
        "Turkish Rose",
        "Patchouli",
        "Oud",
        "Leather",
        "Musk",
      ],
      featured: true,
      images: [
        "https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=600",
        "https://images.unsplash.com/photo-1557170339-96395f6c2c7a?w=600",
      ],
    },
    {
      name: "Golden Amber",
      description:
        "A warm embrace of golden amber, wrapped in vanilla and tonka bean. This fragrance opens with sparkling citrus notes, transitions into a heart of cinnamon and clove, and finishes with a rich, long-lasting base of amber, vanilla, and benzoin.",
      price: 185.0,
      comparePrice: 220.0,
      stock: 40,
      volume: 50,
      brand: "Beb Fragrance",
      gender: "UNISEX" as Gender,
      notes: ["Citrus", "Cinnamon", "Clove", "Amber", "Vanilla", "Tonka Bean"],
      featured: false,
      images: [
        "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600",
        "https://images.unsplash.com/photo-1600612253971-422e7f7faeb6?w=600",
      ],
    },
    {
      name: "Santal Supreme",
      description:
        "A creamy, sophisticated sandalwood fragrance that exudes quiet confidence. Australian sandalwood takes center stage, supported by cardamom, iris, and amber. Perfect for those who appreciate understated elegance.",
      price: 210.0,
      comparePrice: null,
      stock: 20,
      volume: 100,
      brand: "Beb Fragrance",
      gender: "MEN" as Gender,
      notes: ["Cardamom", "Iris", "Sandalwood", "Cedar", "Amber", "Musk"],
      featured: true,
      images: [
        "https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=600",
        "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=600",
      ],
    },
    {
      name: "Citrus Bloom",
      description:
        "A bright and refreshing fragrance that captures the essence of a Mediterranean citrus grove in spring. Italian bergamot and lemon dance with neroli and petitgrain, while a base of white musk and vetiver keeps it grounded.",
      price: 150.0,
      comparePrice: 175.0,
      stock: 50,
      volume: 50,
      brand: "Beb Fragrance",
      gender: "WOMEN" as Gender,
      notes: [
        "Bergamot",
        "Lemon",
        "Neroli",
        "Petitgrain",
        "White Musk",
        "Vetiver",
      ],
      featured: false,
      images: [
        "https://images.unsplash.com/photo-1557170339-96395f6c2c7a?w=600",
        "https://images.unsplash.com/photo-1541643600914-78b084683601?w=600",
      ],
    },
    {
      name: "Noir Velvet",
      description:
        "A deep, mysterious fragrance that evokes the feeling of black velvet against skin. Dark chocolate and rum open the composition, followed by tobacco leaf and coffee absolute. The base of patchouli and vanilla creates an unforgettable trail.",
      price: 320.0,
      comparePrice: 380.0,
      stock: 15,
      volume: 100,
      brand: "Beb Fragrance",
      gender: "UNISEX" as Gender,
      notes: [
        "Dark Chocolate",
        "Rum",
        "Tobacco",
        "Coffee",
        "Patchouli",
        "Vanilla",
      ],
      featured: true,
      images: [
        "https://images.unsplash.com/photo-1590736969955-71cc94901144?w=600",
        "https://images.unsplash.com/photo-1600612253971-422e7f7faeb6?w=600",
      ],
    },
    {
      name: "Jasmin Éternel",
      description:
        "An eternal tribute to the queen of flowers. Egyptian jasmine absolute is the star, surrounded by ylang-ylang, tuberose, and orange blossom. A touch of green tea adds freshness, while musk provides a soft, lasting finish.",
      price: 175.0,
      comparePrice: null,
      stock: 35,
      volume: 50,
      brand: "Beb Fragrance",
      gender: "WOMEN" as Gender,
      notes: [
        "Jasmine",
        "Ylang-Ylang",
        "Tuberose",
        "Orange Blossom",
        "Green Tea",
        "Musk",
      ],
      featured: false,
      images: [
        "https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=600",
        "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=600",
      ],
    },
    {
      name: "Cedar & Leather",
      description:
        "A bold, masculine fragrance that combines the ruggedness of leather with the refinement of cedarwood. Pink pepper and bergamot provide a spicy-fresh opening, while the heart of cedar and vetiver leads to a powerful base of leather and amber.",
      price: 230.0,
      comparePrice: 260.0,
      stock: 28,
      volume: 100,
      brand: "Beb Fragrance",
      gender: "MEN" as Gender,
      notes: [
        "Pink Pepper",
        "Bergamot",
        "Cedar",
        "Vetiver",
        "Leather",
        "Amber",
      ],
      featured: false,
      images: [
        "https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=600",
        "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600",
      ],
    },
    {
      name: "Vanilla Orchid",
      description:
        "A sophisticated gourmand fragrance that reimagines vanilla in an elegant, modern way. Madagascar vanilla orchid is paired with almond milk and white chocolate, while heliotrope and sandalwood add a powdery-woody dimension.",
      price: 195.0,
      comparePrice: 225.0,
      stock: 32,
      volume: 100,
      brand: "Beb Fragrance",
      gender: "WOMEN" as Gender,
      notes: [
        "Almond Milk",
        "Vanilla Orchid",
        "White Chocolate",
        "Heliotrope",
        "Sandalwood",
        "Musk",
      ],
      featured: true,
      images: [
        "https://images.unsplash.com/photo-1600612253971-422e7f7faeb6?w=600",
        "https://images.unsplash.com/photo-1557170339-96395f6c2c7a?w=600",
      ],
    },
    {
      name: "Ocean Mist",
      description:
        "A fresh, aquatic fragrance that captures the essence of a windswept coastline. Sea salt and marine notes blend with lavender and rosemary, creating a clean, invigorating scent. Driftwood and moss provide an earthy base.",
      price: 140.0,
      comparePrice: null,
      stock: 45,
      volume: 50,
      brand: "Beb Fragrance",
      gender: "UNISEX" as Gender,
      notes: [
        "Sea Salt",
        "Marine Notes",
        "Lavender",
        "Rosemary",
        "Driftwood",
        "Moss",
      ],
      featured: false,
      images: [
        "https://images.unsplash.com/photo-1557170339-96395f6c2c7a?w=600",
        "https://images.unsplash.com/photo-1541643600914-78b084683601?w=600",
      ],
    },
    {
      name: "Spice Market",
      description:
        "Inspired by the vibrant spice markets of Marrakech, this fragrance is a journey through exotic aromas. Cinnamon, cardamom, and nutmeg create a warm opening, while incense and myrrh add a mystical quality. Labdanum and vanilla provide a rich finish.",
      price: 260.0,
      comparePrice: 300.0,
      stock: 18,
      volume: 100,
      brand: "Beb Fragrance",
      gender: "UNISEX" as Gender,
      notes: ["Cinnamon", "Cardamom", "Nutmeg", "Incense", "Myrrh", "Labdanum"],
      featured: false,
      images: [
        "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600",
        "https://images.unsplash.com/photo-1590736969955-71cc94901144?w=600",
      ],
    },
    {
      name: "White Tea & Ginger",
      description:
        "A serene, spa-like fragrance that brings a moment of calm. White tea leaves and fresh ginger create a crisp, clean opening, while lotus flower and bamboo add a watery, green heart. Cedar and white musk provide a gentle finish.",
      price: 130.0,
      comparePrice: 155.0,
      stock: 55,
      volume: 50,
      brand: "Beb Fragrance",
      gender: "UNISEX" as Gender,
      notes: ["White Tea", "Ginger", "Lotus", "Bamboo", "Cedar", "White Musk"],
      featured: false,
      images: [
        "https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=600",
        "https://images.unsplash.com/photo-1557170339-96395f6c2c7a?w=600",
      ],
    },
    {
      name: "Midnight Orchid",
      description:
        "An intoxicating, mysterious fragrance that blooms under the moonlight. Black orchid and plum create a dark, fruity opening, while patchouli and incense add depth. The base of dark chocolate and vanilla wraps everything in sensual warmth.",
      price: 280.0,
      comparePrice: null,
      stock: 22,
      volume: 100,
      brand: "Beb Fragrance",
      gender: "WOMEN" as Gender,
      notes: [
        "Black Orchid",
        "Plum",
        "Patchouli",
        "Incense",
        "Dark Chocolate",
        "Vanilla",
      ],
      featured: true,
      images: [
        "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=600",
        "https://images.unsplash.com/photo-1600612253971-422e7f7faeb6?w=600",
      ],
    },
    {
      name: "Vetiver Elixir",
      description:
        "A refined, earthy fragrance centered on the finest Haitian vetiver. Grapefruit and bergamot provide a sparkling opening, while geranium and nutmeg add complexity. The dry down reveals vetiver, cedar, and a hint of smoke.",
      price: 200.0,
      comparePrice: 240.0,
      stock: 27,
      volume: 100,
      brand: "Beb Fragrance",
      gender: "MEN" as Gender,
      notes: [
        "Grapefruit",
        "Bergamot",
        "Geranium",
        "Nutmeg",
        "Vetiver",
        "Smoke",
      ],
      featured: false,
      images: [
        "https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=600",
        "https://images.unsplash.com/photo-1541643600914-78b084683601?w=600",
      ],
    },
    {
      name: "Cherry Blossom",
      description:
        "A delicate, romantic fragrance inspired by the fleeting beauty of cherry blossoms in spring. Japanese cherry blossom and pink peony create a soft floral heart, while pear and bergamot add a fruity freshness. White musk and rice powder provide a gentle finish.",
      price: 160.0,
      comparePrice: 185.0,
      stock: 38,
      volume: 50,
      brand: "Beb Fragrance",
      gender: "WOMEN" as Gender,
      notes: [
        "Pear",
        "Bergamot",
        "Cherry Blossom",
        "Peony",
        "White Musk",
        "Rice Powder",
      ],
      featured: false,
      images: [
        "https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=600",
        "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=600",
      ],
    },
  ];

  // Asosiy brand yaratish
  const defaultBrand = await prisma.brand.create({
    data: {
      name: "Beb Fragrance",
      slug: "beb-fragrance",
      description: "Premium luxury fragrance brand",
    },
  });

  // Mahsulotlarni kategoriyalarga taqsimlash
  const categoryMap: Record<string, number[]> = {
    oriental: [0, 10, 11],
    floral: [1, 6, 14],
    woody: [3, 7, 13],
    fresh: [4, 9, 11],
    gourmand: [2, 5, 8],
  };

  const products = [];

  for (let i = 0; i < productsData.length; i++) {
    const data = productsData[i];

    let categoryIndex = 0;
    for (const [cat, indices] of Object.entries(categoryMap)) {
      if (indices.includes(i)) {
        categoryIndex = ["oriental", "floral", "woody", "fresh", "gourmand"].indexOf(cat);
        break;
      }
    }

    const product = await prisma.product.create({
      data: {
        name: data.name,
        slug: slugify(data.name),
        description: data.description,
        sku: `BEB-${String(i + 1).padStart(4, "0")}`,
        gender: data.gender,
        isFeatured: data.featured || false,
        brandId: defaultBrand.id,
        categoryId: categories[categoryIndex].id,
      },
    });
    products.push(product);
  }

  console.log(`✅ ${products.length} ta mahsulot yaratildi`);

  // ============================================
  // Admin foydalanuvchi
  // ============================================
  console.log("👤 Admin foydalanuvchi yaratilmoqda...");

  // Eslatma: Admin foydalanuvchi Google orqali login qilganda yaratiladi
  // Keyin role'ni qo'lda ADMIN ga o'zgartirish kerak
  // Yoki bu yerda email orqali admin yaratish mumkin emas (NextAuth Google orqali)

  console.log("ℹ️  Admin yaratish uchun:");
  console.log("   1. Google orqali login qiling");
  console.log(
    "   2. Prisma Studio da User jadvalidan rolni ADMIN ga o'zgartiring",
  );
  console.log(
    '   yoki SQL: UPDATE "User" SET "role" = \'ADMIN\' WHERE "email" = \'your-email@gmail.com\';',
  );

  // ============================================
  // Test review'lar
  // ============================================
  console.log("⭐ Review'lar yaratilmoqda...");

  const reviewTexts = [
    {
      rating: 5,
      comment:
        "Absolutely stunning fragrance! Lasts all day and I get compliments everywhere I go.",
    },
    {
      rating: 4,
      comment: "Beautiful scent, very elegant. The dry down is amazing.",
    },
    { rating: 5, comment: "My new signature scent. Worth every penny!" },
    {
      rating: 4,
      comment: "Great projection and longevity. The bottle is gorgeous too.",
    },
    {
      rating: 3,
      comment: "Nice but not my favorite. A bit too strong for my taste.",
    },
    {
      rating: 5,
      comment: "Incredible quality. You can tell they use premium ingredients.",
    },
    { rating: 4, comment: "Love the packaging and the scent is divine." },
    { rating: 5, comment: "Best perfume I have ever owned. Highly recommend!" },
  ];

  // Eslatma: Review'lar foydalanuvchi ID talab qiladi
  // Seed uchun review'larni o'tkazib yuboramiz yoki dummy user yaratamiz
  console.log("ℹ️  Review'lar foydalanuvchi login qilgandan keyin yoziladi");

  console.log("");
  console.log("✅ Seed muvaffaqiyatli yakunlandi!");
  console.log("");
  console.log("📊 Yaratilgan ma'lumotlar:");
  console.log(`   - ${categories.length} ta kategoriya`);
  console.log(`   - ${products.length} ta mahsulot`);
  console.log("");
  console.log('🚀 Endi "npm run dev" bilan serverni ishga tushiring!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Seed xatolik:", e);
    await prisma.$disconnect();
    process.exit(1);
  });

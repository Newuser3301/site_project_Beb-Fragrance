import type {
  User,
  Account,
  Session,
  Brand,
  Category,
  Collection,
  Product,
  ProductImage,
  ProductVariant,
  ProductNote,
  Review,
  Cart,
  CartItem,
  WishlistItem,
  Address,
  Order,
  OrderItem,
  Coupon,
  BlogPost,
  NewsletterSubscriber,
  Setting,
  UserRole,
  Gender,
  FragranceFamily,
  Concentration,
  NoteType,
  OrderStatus,
  PaymentStatus,
  PaymentMethod,
  AddressType,
  CouponType,
  BlogStatus,
} from '@prisma/client';

// ─── Re-export Prisma types ──────────────────────────────────────────────────

export type {
  User,
  Account,
  Session,
  Brand,
  Category,
  Collection,
  Product,
  ProductImage,
  ProductVariant,
  ProductNote,
  Review,
  Cart,
  CartItem,
  WishlistItem,
  Address,
  Order,
  OrderItem,
  Coupon,
  BlogPost,
  NewsletterSubscriber,
  Setting,
  UserRole,
  Gender,
  FragranceFamily,
  Concentration,
  NoteType,
  OrderStatus,
  PaymentStatus,
  PaymentMethod,
  AddressType,
  CouponType,
  BlogStatus,
};

// ─── Extended Prisma types with relations ────────────────────────────────────

export type UserWithRelations = User & {
  addresses?: Address[];
  cart?: CartWithItems | null;
  orders?: Order[];
  reviews?: Review[];
};

export type ProductWithRelations = Product & {
  brand: Brand;
  category: Category;
  collection?: Collection | null;
  images: ProductImage[];
  variants: ProductVariant[];
  notes: ProductNote[];
  reviews?: ReviewWithUser[];
  _count?: {
    reviews: number;
  };
};

export type ProductListItem = Pick<
  Product,
  | 'id'
  | 'name'
  | 'slug'
  | 'shortDescription'
  | 'gender'
  | 'fragranceFamily'
  | 'concentration'
  | 'isFeatured'
  | 'isNewArrival'
  | 'isBestseller'
> & {
  brand: Pick<Brand, 'id' | 'name' | 'slug'>;
  images: Pick<ProductImage, 'id' | 'url' | 'alt' | 'isPrimary'>[];
  variants: Pick<ProductVariant, 'id' | 'price' | 'comparePrice' | 'size' | 'stock'>[];
  averageRating?: number;
  reviewCount?: number;
};

export type ProductVariantWithProduct = ProductVariant & {
  product: Pick<Product, 'id' | 'name' | 'slug'> & {
    images: Pick<ProductImage, 'url' | 'alt' | 'isPrimary'>[];
  };
};

export type CartWithItems = Cart & {
  items: CartItemWithRelations[];
};

export type CartItemWithRelations = CartItem & {
  product: ProductWithRelations;
  variant: ProductVariant;
};

export type OrderWithRelations = Order & {
  user: Pick<User, 'id' | 'name' | 'email'>;
  shippingAddress: Address;
  billingAddress?: Address | null;
  coupon?: Coupon | null;
  items: OrderItemWithRelations[];
};

export type OrderItemWithRelations = OrderItem & {
  product: Pick<Product, 'id' | 'name' | 'slug'> & {
    images: Pick<ProductImage, 'url' | 'alt'>[];
  };
  variant: Pick<ProductVariant, 'id' | 'name' | 'size' | 'sizeMl'>;
};

export type ReviewWithUser = Review & {
  user: Pick<User, 'id' | 'name' | 'image'>;
};

export type ReviewWithProduct = Review & {
  product: Pick<Product, 'id' | 'name' | 'slug'>;
};

export type CategoryWithChildren = Category & {
  children?: Category[];
  _count?: {
    products: number;
  };
};

export type CollectionWithProducts = Collection & {
  products: ProductListItem[];
  _count?: {
    products: number;
  };
};

export type BrandWithProducts = Brand & {
  products: ProductListItem[];
  _count?: {
    products: number;
  };
};

export type BlogPostWithAuthor = BlogPost & {
  author: Pick<User, 'id' | 'name' | 'image'>;
};

export type WishlistItemWithProduct = WishlistItem & {
  product: ProductListItem;
};

// ─── Auth types ──────────────────────────────────────────────────────────────

export interface SessionUser {
  id: string;
  name?: string | null;
  email: string;
  image?: string | null;
  role: UserRole;
}

export interface AuthSession {
  user: SessionUser;
  expires: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// ─── API Response types ──────────────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// ─── Product filter & search types ───────────────────────────────────────────

export interface ProductFilters {
  search?: string;
  brandId?: string;
  categoryId?: string;
  collectionId?: string;
  gender?: Gender;
  fragranceFamily?: FragranceFamily;
  concentration?: Concentration;
  minPrice?: number;
  maxPrice?: number;
  isFeatured?: boolean;
  isNewArrival?: boolean;
  isBestseller?: boolean;
  inStock?: boolean;
}

export interface ProductSortOption {
  label: string;
  value: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

export type ProductSortValue =
  | 'newest'
  | 'oldest'
  | 'price-asc'
  | 'price-desc'
  | 'name-asc'
  | 'name-desc'
  | 'rating'
  | 'bestseller';

// ─── Cart types ──────────────────────────────────────────────────────────────

export interface AddToCartInput {
  productId: string;
  variantId: string;
  quantity: number;
}

export interface UpdateCartItemInput {
  cartItemId: string;
  quantity: number;
}

export interface CartSummary {
  subtotal: number;
  itemCount: number;
  items: CartItemWithRelations[];
}

// ─── Order types ─────────────────────────────────────────────────────────────

export interface CreateOrderInput {
  shippingAddressId: string;
  billingAddressId?: string;
  paymentMethod: PaymentMethod;
  couponCode?: string;
  notes?: string;
}

export interface CheckoutSession {
  orderId: string;
  stripeSessionId: string;
  url: string;
}

export interface OrderSummary {
  subtotal: number;
  shippingCost: number;
  tax: number;
  discount: number;
  total: number;
  currency: string;
}

// ─── Address types ───────────────────────────────────────────────────────────

export interface CreateAddressInput {
  label?: string;
  firstName: string;
  lastName: string;
  phone: string;
  street: string;
  city: string;
  state?: string;
  postalCode: string;
  country?: string;
  type?: AddressType;
  isDefault?: boolean;
}

export interface UpdateAddressInput extends Partial<CreateAddressInput> {
  id: string;
}

// ─── Review types ────────────────────────────────────────────────────────────

export interface CreateReviewInput {
  productId: string;
  rating: number;
  title?: string;
  comment?: string;
}

export interface UpdateReviewInput {
  id: string;
  rating?: number;
  title?: string;
  comment?: string;
}

// ─── Coupon types ────────────────────────────────────────────────────────────

export interface ValidateCouponInput {
  code: string;
  orderTotal: number;
}

export interface CouponValidationResult {
  valid: boolean;
  coupon?: Coupon;
  discount?: number;
  message?: string;
}

// ─── Admin types ─────────────────────────────────────────────────────────────

export interface AdminDashboardStats {
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  totalCustomers: number;
  recentOrders: OrderWithRelations[];
  lowStockProducts: ProductVariantWithProduct[];
  topProducts: ProductListItem[];
}

export interface CreateProductInput {
  name: string;
  description: string;
  shortDescription?: string;
  sku: string;
  gender: Gender;
  fragranceFamily?: FragranceFamily;
  concentration?: Concentration;
  yearReleased?: number;
  perfumer?: string;
  brandId: string;
  categoryId: string;
  collectionId?: string;
  isFeatured?: boolean;
  isNewArrival?: boolean;
  isBestseller?: boolean;
  metaTitle?: string;
  metaDescription?: string;
  variants: CreateProductVariantInput[];
  notes?: CreateProductNoteInput[];
}

export interface CreateProductVariantInput {
  name: string;
  sku: string;
  size: string;
  sizeMl: number;
  price: number;
  comparePrice?: number;
  stock: number;
}

export interface CreateProductNoteInput {
  name: string;
  type: NoteType;
}

export interface UpdateProductInput extends Partial<CreateProductInput> {
  id: string;
  isActive?: boolean;
}

// ─── Newsletter types ────────────────────────────────────────────────────────

export interface SubscribeNewsletterInput {
  email: string;
}

// ─── Blog types ──────────────────────────────────────────────────────────────

export interface CreateBlogPostInput {
  title: string;
  excerpt?: string;
  content: string;
  coverImage?: string;
  status?: BlogStatus;
  metaTitle?: string;
  metaDescription?: string;
}

export interface UpdateBlogPostInput extends Partial<CreateBlogPostInput> {
  id: string;
}

// ─── Settings types ──────────────────────────────────────────────────────────

export interface SiteSettings {
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  socialInstagram?: string;
  socialFacebook?: string;
  socialTelegram?: string;
  freeShippingThreshold?: number;
  defaultShippingCost?: number;
  taxRate?: number;
  currency: string;
}

export type SettingKey = keyof SiteSettings;

// ─── Stripe types ────────────────────────────────────────────────────────────

export interface StripeCheckoutMetadata {
  orderId: string;
  userId: string;
  orderNumber: string;
}

// ─── Form state types ────────────────────────────────────────────────────────

export interface FormState {
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
}

export interface FieldError {
  field: string;
  message: string;
}

// ─── Navigation types ──────────────────────────────────────────────────────────

export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

// ─── UI Component prop types ─────────────────────────────────────────────────

export interface SelectOption {
  label: string;
  value: string;
}

export interface TabItem {
  id: string;
  label: string;
  content: React.ReactNode;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  description?: string;
}

// ─── Search types ──────────────────────────────────────────────────────────────

export interface SearchResult {
  products: ProductListItem[];
  brands: Pick<Brand, 'id' | 'name' | 'slug' | 'logo'>[];
  categories: Pick<Category, 'id' | 'name' | 'slug' | 'image'>[];
  total: number;
}

export interface SearchParams {
  q: string;
  type?: 'all' | 'products' | 'brands' | 'categories';
  limit?: number;
}

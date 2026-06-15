// src/lib/constants.ts

export const SITE_NAME = 'Beb Fragrance';
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://bebfragrance.com';
export const SITE_DESCRIPTION =
  'Discover luxury fragrances at Beb Fragrance. Shop premium perfumes for men and women with free shipping on orders over $100.';

export const CONTACT_EMAIL = 'info@bebfragrance.com';
export const CONTACT_PHONE = '+1 (555) 123-4567';
export const CONTACT_ADDRESS = '123 Luxury Lane, Beverly Hills, CA 90210';

export const SOCIAL_LINKS = {
  facebook: 'https://facebook.com/bebfragrance',
  instagram: 'https://instagram.com/bebfragrance',
  twitter: 'https://twitter.com/bebfragrance',
  pinterest: 'https://pinterest.com/bebfragrance',
};

export const SHIPPING_FREE_THRESHOLD = 100;
export const SHIPPING_COST = 9.99;
export const TAX_RATE = 0.08;

export const CURRENCY = 'USD';
export const CURRENCY_SYMBOL = '$';

export const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Shop', href: '/products' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export const FOOTER_LINKS = {
  shop: [
    { label: 'All Products', href: '/products' },
    { label: 'New Arrivals', href: '/products?sort=newest' },
    { label: 'Best Sellers', href: '/products?sort=popular' },
    { label: 'Featured', href: '/products?featured=true' },
  ],
  help: [
    { label: 'FAQ', href: '/faq' },
    { label: 'Shipping', href: '/shipping' },
    { label: 'Returns', href: '/returns' },
    { label: 'Contact', href: '/contact' },
  ],
  legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
  ],
};

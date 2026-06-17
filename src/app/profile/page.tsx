// src/app/profile/page.tsx
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { ProfileClientPage } from './ProfileClient';

export const metadata: Metadata = {
  title: 'Mening profilim | Beb Fragrance',
  description: 'Mijoz shaxsiy kabineti. Buyurtmalar tarixi, manzillar va sevimlilar roʻyxati.',
};

export const dynamic = 'force-dynamic';

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect('/auth/login?callbackUrl=/profile');
  }

  // Fetch all user information in parallel
  const [user, orders, addresses, wishlistItems] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
      },
    }),
    prisma.order.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      include: {
        items: {
          include: {
            product: {
              select: {
                name: true,
                images: {
                  where: { isPrimary: true },
                  take: 1,
                  select: { url: true },
                },
              },
            },
          },
        },
      },
    }),
    prisma.address.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.wishlistItem.findMany({
      where: { userId: session.user.id },
      include: {
        product: {
          include: {
            brand: { select: { name: true } },
            images: {
              where: { isPrimary: true },
              take: 1,
              select: { url: true },
            },
            variants: {
              where: { isActive: true },
              take: 1,
              select: { price: true, stock: true, size: true },
            },
          },
        },
      },
    }),
  ]);

  if (!user) {
    redirect('/auth/login');
  }

  return (
    <ProfileClientPage
      initialUser={user}
      initialOrders={orders}
      initialAddresses={addresses}
      initialWishlist={wishlistItems.map((item) => item.product)}
    />
  );
}

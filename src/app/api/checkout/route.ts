// src/app/api/checkout/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { canUseDatabase, isStripeEnabled } from '@/lib/app-mode';
import { auth } from '@/lib/auth';
import { mockProducts } from '@/lib/mock-store';
import { prisma } from '@/lib/prisma';
import { stripe } from '@/lib/stripe';
import { generateOrderNumber, absoluteUrl } from '@/lib/utils';

export const dynamic = 'force-dynamic';

const shippingAddressSchema = z.object({
  name: z.string().min(2, 'Name required'),
  email: z.string().email('Valid email required'),
  phone: z.string().min(7, 'Phone required'),
  street: z.string().min(5, 'Street address required'),
  city: z.string().min(2, 'City required'),
  state: z.string().optional().default(''),
  postalCode: z.string().min(3, 'Postal code required'),
  country: z.string().min(2, 'Country required').default('US'),
});

const checkoutRequestSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        quantity: z.number().int().min(1).max(99),
      })
    )
    .min(1, 'At least one item required'),
  shippingAddress: shippingAddressSchema,
});

const FREE_SHIPPING_THRESHOLD = 100;
const SHIPPING_COST = 9.99;
const TAX_RATE = 0.08;

export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    const body = await req.json();
    const parsed = checkoutRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation error', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { items: cartItems, shippingAddress } = parsed.data;
    const stripeEnabled = isStripeEnabled();
    const databaseReady = await canUseDatabase();

    // Fetch products and validate stock (get first active variant for each product)
    const productIds = cartItems.map((i) => i.productId);
    const products = await prisma.product
      .findMany({
        where: { id: { in: productIds }, isActive: true },
        include: {
          variants: {
            where: { isActive: true },
            orderBy: { price: 'asc' },
            take: 1,
          },
          images: { where: { isPrimary: true }, take: 1 },
        },
      })
      .catch(() =>
        mockProducts
          .filter((product) => productIds.includes(product.id))
          .map((product) => ({
            id: product.id,
            name: product.name,
            variants: [
              {
                id: product.variants[0].id,
                price: product.variants[0].price,
                stock: product.variants[0].stock,
                size: product.variants[0].size,
              },
            ],
            images: product.images[0] ? [{ url: product.images[0] }] : [],
          }))
      );

    if (products.length !== cartItems.length) {
      return NextResponse.json(
        { error: 'One or more products are unavailable' },
        { status: 400 }
      );
    }

    // Validate stock and build line items
    const orderItemsData: Array<{
      productId: string;
      variantId: string;
      quantity: number;
      price: number;
      total: number;
    }> = [];

    const stripeLineItems: Array<{
      price_data: {
        currency: string;
        unit_amount: number;
        product_data: { name: string; images: string[] };
      };
      quantity: number;
    }> = [];

    for (const cartItem of cartItems) {
      const product = products.find((p) => p.id === cartItem.productId);
      if (!product || product.variants.length === 0) {
        return NextResponse.json(
          { error: `Product ${cartItem.productId} has no available variants` },
          { status: 400 }
        );
      }

      const variant = product.variants[0];
      if (variant.stock < cartItem.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for ${product.name}` },
          { status: 400 }
        );
      }

      const price = Number(variant.price);
      const itemTotal = price * cartItem.quantity;

      orderItemsData.push({
        productId: product.id,
        variantId: variant.id,
        quantity: cartItem.quantity,
        price,
        total: itemTotal,
      });

      stripeLineItems.push({
        price_data: {
          currency: 'usd',
          unit_amount: Math.round(price * 100),
          product_data: {
            name: `${product.name} (${variant.size})`,
            images: product.images[0]?.url ? [product.images[0].url] : [],
          },
        },
        quantity: cartItem.quantity,
      });
    }

    const subtotal = orderItemsData.reduce((sum, i) => sum + i.total, 0);
    const shippingCost = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
    const tax = Math.round(subtotal * TAX_RATE * 100) / 100;
    const total = Math.round((subtotal + shippingCost + tax) * 100) / 100;
    const orderNumber = generateOrderNumber();

    // Parse name for address
    const nameParts = shippingAddress.name.split(' ');
    const firstName = nameParts[0] ?? '';
    const lastName = nameParts.slice(1).join(' ') || firstName;

    const customer =
      session?.user?.id && session.user.email
        ? {
            id: session.user.id,
            email: session.user.email,
          }
        : databaseReady
          ? await prisma.user.upsert({
              where: { email: shippingAddress.email },
              update: {
                name: shippingAddress.name,
                phone: shippingAddress.phone,
              },
              create: {
                email: shippingAddress.email,
                name: shippingAddress.name,
                phone: shippingAddress.phone,
                role: 'CUSTOMER',
              },
              select: {
                id: true,
                email: true,
              },
            })
          : {
              id: `guest-${orderNumber}`,
              email: shippingAddress.email,
            };

    if (!databaseReady) {
      return NextResponse.json({
        success: true,
        orderId: `demo-${orderNumber}`,
        orderNumber,
        paymentMethod: stripeEnabled ? 'STRIPE' : 'CASH_ON_DELIVERY',
        url: absoluteUrl(`/checkout/success?order=${orderNumber}`),
      });
    }

    const { order } = await prisma.$transaction(async (tx) => {
      const address = await tx.address.create({
        data: {
          userId: customer.id,
          firstName,
          lastName,
          phone: shippingAddress.phone,
          street: shippingAddress.street,
          city: shippingAddress.city,
          state: shippingAddress.state || undefined,
          postalCode: shippingAddress.postalCode,
          country: shippingAddress.country,
          type: 'SHIPPING',
        },
      });

      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          userId: customer.id,
          shippingAddressId: address.id,
          status: stripeEnabled ? 'PENDING' : 'CONFIRMED',
          paymentStatus: 'PENDING',
          paymentMethod: stripeEnabled ? 'STRIPE' : 'CASH_ON_DELIVERY',
          subtotal,
          shippingCost,
          tax,
          total,
          currency: 'USD',
          items: {
            create: orderItemsData.map((item) => ({
              productId: item.productId,
              variantId: item.variantId,
              quantity: item.quantity,
              price: item.price,
              total: item.total,
            })),
          },
        },
      });

      // Decrease stock
      for (const item of orderItemsData) {
        await tx.productVariant.update({
          where: { id: item.variantId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      // Create admin notification
      try {
        await tx.notification.create({
          data: {
            userId: null,
            message: `Yangi buyurtma qabul qilindi: #${orderNumber} (${shippingAddress.name} - $${total.toFixed(2)})`,
            type: 'NEW_ORDER',
            isRead: false,
          },
        });
      } catch (err) {
        console.error('Checkout notification error:', err);
      }

      return { order: newOrder };
    });

    if (!stripeEnabled) {
      return NextResponse.json({
        success: true,
        orderId: order.id,
        orderNumber,
        paymentMethod: 'CASH_ON_DELIVERY',
        url: absoluteUrl(`/checkout/success?order=${order.id}`),
      });
    }

    // Add shipping as separate line item if applicable
    if (shippingCost > 0) {
      stripeLineItems.push({
        price_data: {
          currency: 'usd',
          unit_amount: Math.round(shippingCost * 100),
          product_data: {
            name: 'Standard Shipping',
            images: [],
          },
        },
        quantity: 1,
      });
    }

    // Create Stripe checkout session
    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: shippingAddress.email,
      line_items: stripeLineItems,
      success_url: absoluteUrl(`/checkout/success?session_id={CHECKOUT_SESSION_ID}`),
      cancel_url: absoluteUrl('/checkout/cancel'),
      metadata: {
        orderId: order.id,
        orderNumber,
        userId: customer.id,
      },
    });

    // Save stripe session ID
    await prisma.order.update({
      where: { id: order.id },
      data: { stripeSessionId: stripeSession.id },
    });

    return NextResponse.json({
      success: true,
      orderId: order.id,
      orderNumber,
      sessionId: stripeSession.id,
      url: stripeSession.url,
    });
  } catch (error) {
    console.error('[POST /api/checkout]', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

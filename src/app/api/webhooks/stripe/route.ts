// src/app/api/webhooks/stripe/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import type Stripe from 'stripe';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import {
  sendOrderConfirmation,
  sendAdminNotification,
  type OrderDetailItem,
} from '@/lib/email';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const headersList = headers();
    const signature = headersList.get('stripe-signature');

    if (!signature) {
      return NextResponse.json({ error: 'Missing Stripe signature' }, { status: 400 });
    }

    if (!webhookSecret) {
      console.error('[WEBHOOK] STRIPE_WEBHOOK_SECRET is not configured');
      return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 });
    }

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Webhook signature verification failed';
      console.error('[WEBHOOK] Signature verification failed:', message);
      return NextResponse.json({ error: message }, { status: 400 });
    }

    // Handle specific events
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(session);
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await handlePaymentFailed(paymentIntent);
        break;
      }

      default:
        console.log(`[WEBHOOK] Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('[WEBHOOK] Error processing webhook:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const { orderId, orderNumber, userId } = session.metadata ?? {};

  if (!orderId) {
    console.error('[WEBHOOK] No orderId in session metadata');
    return;
  }

  try {
    // Update order status and payment info
    const order = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: 'PROCESSING',
        paymentStatus: 'PAID',
        stripePaymentId: session.payment_intent as string | undefined,
      },
      include: {
        items: {
          include: {
            product: true,
            variant: true,
          },
        },
        user: true,
        shippingAddress: true,
      },
    });

    // Clear user's DB cart
    if (userId) {
      const cart = await prisma.cart.findUnique({ where: { userId } });
      if (cart) {
        await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
      }
    }

    // Build email data
    const emailItems: OrderDetailItem[] = order.items.map((item) => ({
      name: item.product.name,
      quantity: item.quantity,
      price: Number(item.price),
      size: item.variant.size,
    }));

    const subtotal = Number(order.subtotal);
    const shippingCost = Number(order.shippingCost);
    const tax = Number(order.tax);
    const discount = Number(order.discount);
    const total = Number(order.total);

    // Send confirmation email to customer
    if (order.user?.email) {
      try {
        await sendOrderConfirmation(
          order.id,
          order.user.email,
          order.user.name ?? 'Customer',
          {
            orderNumber: order.orderNumber,
            items: emailItems,
            subtotal,
            shippingCost,
            tax,
            discount,
          },
          total
        );
      } catch (emailErr) {
        console.error('[WEBHOOK] Failed to send customer email:', emailErr);
      }
    }

    // Send admin notification
    try {
      await sendAdminNotification(
        order.id,
        order.user?.name ?? 'Unknown Customer',
        total
      );
    } catch (emailErr) {
      console.error('[WEBHOOK] Failed to send admin email:', emailErr);
    }

    console.log(`[WEBHOOK] Order ${order.orderNumber} confirmed and emails sent`);
  } catch (error) {
    console.error(`[WEBHOOK] Failed to process order ${orderId}:`, error);
    throw error;
  }
}

async function handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
  const orderId = paymentIntent.metadata?.orderId;
  if (!orderId) return;

  try {
    await prisma.order.update({
      where: { id: orderId },
      data: { paymentStatus: 'FAILED' },
    });
    console.log(`[WEBHOOK] Payment failed for order ${orderId}`);
  } catch (error) {
    console.error(`[WEBHOOK] Failed to update order ${orderId} on payment failure:`, error);
  }
}

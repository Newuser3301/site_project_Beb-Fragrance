import Stripe from 'stripe';

let stripeInstance: Stripe | null = null;

function getStripeClient(): Stripe {
  if (!stripeInstance) {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      throw new Error('STRIPE_SECRET_KEY is not defined in environment variables');
    }
    stripeInstance = new Stripe(secretKey, {
      apiVersion: '2024-11-20.acacia' as Stripe.LatestApiVersion,
      typescript: true,
    });
  }
  return stripeInstance;
}

export const stripe = new Proxy<Stripe>({} as Stripe, {
  get(_target, prop) {
    return (getStripeClient() as any)[prop];
  },
});

export type StripeInstance = Stripe;

export default stripe;

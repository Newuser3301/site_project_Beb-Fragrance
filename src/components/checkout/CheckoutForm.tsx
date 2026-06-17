// src/components/checkout/CheckoutForm.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Loader2, Check, Truck, CreditCard, Package } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { ShippingForm, type ShippingFormData, type ShippingFormErrors } from './ShippingForm';
import { PaymentForm, type PaymentFormData, type PaymentFormErrors } from './PaymentForm';
import { OrderSummary } from './OrderSummary';
import { useCartStore } from '@/store/useCartStore';
import { checkoutSchema } from '@/lib/validations';

const FREE_SHIPPING_THRESHOLD = 100;
const SHIPPING_COST = 9.99;
const TAX_RATE = 0.08;

const STEPS = [
  { id: 1, label: 'Shipping', icon: Truck },
  { id: 2, label: 'Payment', icon: CreditCard },
  { id: 3, label: 'Review', icon: Package },
];

const initialShipping: ShippingFormData = {
  fullName: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  state: '',
  zipCode: '',
  country: 'US',
};

const initialPayment: PaymentFormData = {
  cardNumber: '',
  expiryDate: '',
  cvc: '',
  cardholderName: '',
};

export function CheckoutForm() {
  const router = useRouter();
  const { items, getTotal, clearCart } = useCartStore();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [shipping, setShipping] = useState<ShippingFormData>(initialShipping);
  const [payment, setPayment] = useState<PaymentFormData>(initialPayment);
  const [shippingErrors, setShippingErrors] = useState<ShippingFormErrors>({});
  const [paymentErrors, setPaymentErrors] = useState<PaymentFormErrors>({});
  const [stripeEnabled, setStripeEnabled] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<'STRIPE' | 'TON' | 'CASH_ON_DELIVERY'>('STRIPE');

  useEffect(() => {
    let isMounted = true;

    const loadServiceStatus = async () => {
      try {
        const response = await fetch('/api/status', { cache: 'no-store' });
        if (!response.ok) {
          throw new Error('Failed to load service status');
        }

        const data = (await response.json()) as {
          services?: { stripe?: boolean };
        };

        if (isMounted) {
          const hasStripe = Boolean(data.services?.stripe);
          setStripeEnabled(hasStripe);
          setPaymentMethod(hasStripe ? 'STRIPE' : 'TON');
        }
      } catch {
        if (isMounted) {
          setStripeEnabled(false);
          setPaymentMethod('TON');
        }
      }
    };

    loadServiceStatus();

    return () => {
      isMounted = false;
    };
  }, []);

  const subtotal = getTotal();
  const shippingCost = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const tax = subtotal * TAX_RATE;
  const total = subtotal + shippingCost + tax;

  const handleShippingChange = (field: keyof ShippingFormData, value: string) => {
    setShipping((prev) => ({ ...prev, [field]: value }));
    setShippingErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handlePaymentChange = (field: keyof PaymentFormData, value: string) => {
    setPayment((prev) => ({ ...prev, [field]: value }));
    setPaymentErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validateShipping = (): boolean => {
    const result = checkoutSchema.safeParse({
      name: shipping.fullName,
      email: shipping.email,
      phone: shipping.phone,
      address: shipping.address,
      city: shipping.city,
      zipCode: shipping.zipCode,
    });

    if (!result.success) {
      const errs: ShippingFormErrors = {};
      result.error.errors.forEach((e) => {
        const field = e.path[0] as string;
        if (field === 'name') errs.fullName = e.message;
        else if (field === 'email') errs.email = e.message;
        else if (field === 'phone') errs.phone = e.message;
        else if (field === 'address') errs.address = e.message;
        else if (field === 'city') errs.city = e.message;
        else if (field === 'zipCode') errs.zipCode = e.message;
      });
      setShippingErrors(errs);
      return false;
    }
    return true;
  };

  const validatePayment = (): boolean => {
    if (paymentMethod !== 'STRIPE') {
      setPaymentErrors({});
      return true;
    }

    const errs: PaymentFormErrors = {};
    const rawCard = payment.cardNumber.replace(/\s/g, '');

    if (rawCard.length < 16) errs.cardNumber = 'Please enter a valid card number';
    if (!payment.cardholderName.trim()) errs.cardholderName = 'Cardholder name is required';
    if (!payment.expiryDate.match(/^\d{2}\/\d{2}$/)) errs.expiryDate = 'Use MM/YY format';
    if (payment.cvc.length < 3) errs.cvc = 'Invalid CVC';

    setPaymentErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNextStep = () => {
    if (step === 1 && !validateShipping()) return;
    if (step === 2 && !validatePayment()) return;
    setStep((prev) => prev + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrevStep = () => {
    setStep((prev) => prev - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentMethod,
          items: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
          shippingAddress: {
            name: shipping.fullName,
            email: shipping.email,
            phone: shipping.phone,
            street: shipping.address,
            city: shipping.city,
            state: shipping.state,
            postalCode: shipping.zipCode,
            country: shipping.country,
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Checkout failed');
      }

      if (data.url) {
        clearCart();
        window.location.href = data.url;
      } else {
        clearCart();
        router.push('/checkout/success');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An error occurred';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container-beb py-10">
      {/* Page header */}
      <div className="mb-8">
        <nav className="mb-3 text-sm text-muted-foreground">
          <ol className="flex items-center gap-2">
            <li><a href="/" className="hover:text-gold-600">Home</a></li>
            <li>/</li>
            <li><a href="/cart" className="hover:text-gold-600">Cart</a></li>
            <li>/</li>
            <li className="font-medium text-foreground">Checkout</li>
          </ol>
        </nav>
        <h1 className="font-serif text-3xl font-bold text-foreground md:text-4xl">
          Checkout
        </h1>
      </div>

      {/* Steps indicator */}
      <div className="mb-8">
        <div className="flex items-center gap-0">
          {STEPS.map((s, idx) => {
            const Icon = s.icon;
            const isCompleted = step > s.id;
            const isCurrent = step === s.id;
            return (
              <div key={s.id} className="flex flex-1 items-center">
                <div className="flex flex-col items-center gap-1.5">
                  <div className={`flex h-9 w-9 items-center justify-center rounded-full border-2 transition-all ${
                    isCompleted
                      ? 'border-gold-500 bg-gold-500 text-white'
                      : isCurrent
                      ? 'border-gold-500 bg-white text-gold-600'
                      : 'border-border bg-white text-muted-foreground'
                  }`}>
                    {isCompleted ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Icon className="h-4 w-4" />
                    )}
                  </div>
                  <span className={`text-xs font-medium ${isCurrent ? 'text-gold-600' : 'text-muted-foreground'}`}>
                    {s.label}
                  </span>
                </div>
                {idx < STEPS.length - 1 && (
                  <div className={`mb-4 h-0.5 flex-1 transition-colors ${step > s.id ? 'bg-gold-500' : 'bg-border'}`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Main layout */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_400px]">
        {/* Left: Form */}
        <div>
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="rounded-2xl border border-border bg-white p-6 md:p-8"
          >
            {step === 1 && (
              <ShippingForm
                data={shipping}
                errors={shippingErrors}
                onChange={handleShippingChange}
              />
            )}

            {step === 2 && (
              <PaymentForm
                data={payment}
                errors={paymentErrors}
                onChange={handlePaymentChange}
                stripeEnabled={stripeEnabled}
                paymentMethod={paymentMethod}
                onPaymentMethodChange={setPaymentMethod}
                total={total}
              />
            )}

            {step === 3 && (
              <div>
                <h2 className="font-serif text-xl font-bold text-foreground">
                  Review Your Order
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Please confirm the details below before placing your order.
                </p>

                {/* Shipping review */}
                <div className="mt-5 rounded-xl bg-cream-50 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-semibold text-foreground">Shipping Address</p>
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="text-xs text-gold-600 underline-offset-2 hover:underline"
                    >
                      Edit
                    </button>
                  </div>
                  <p className="text-sm text-muted-foreground">{shipping.fullName}</p>
                  <p className="text-sm text-muted-foreground">{shipping.address}</p>
                  <p className="text-sm text-muted-foreground">
                    {shipping.city}{shipping.state ? `, ${shipping.state}` : ''} {shipping.zipCode}
                  </p>
                  <p className="text-sm text-muted-foreground">{shipping.country}</p>
                </div>

                {/* Payment review */}
                <div className="mt-3 rounded-xl bg-cream-50 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-semibold text-foreground">Payment</p>
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="text-xs text-gold-600 underline-offset-2 hover:underline"
                    >
                      Edit
                    </button>
                  </div>
                  {paymentMethod === 'STRIPE' ? (
                    <>
                      <p className="text-sm text-muted-foreground">
                        •••• •••• •••• {payment.cardNumber.replace(/\s/g, '').slice(-4)}
                      </p>
                      <p className="text-sm text-muted-foreground">{payment.cardholderName}</p>
                    </>
                  ) : paymentMethod === 'TON' ? (
                    <p className="text-sm text-muted-foreground">
                      Telegram Wallet (TON)
                    </p>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Cash on delivery
                    </p>
                  )}
                </div>

                {/* Terms */}
                <p className="mt-5 text-xs text-muted-foreground">
                  By placing your order, you agree to our{' '}
                  <a href="/terms" className="text-gold-600 hover:underline">Terms of Service</a>{' '}
                  and{' '}
                  <a href="/privacy" className="text-gold-600 hover:underline">Privacy Policy</a>.
                </p>
              </div>
            )}
          </motion.div>

          {/* Navigation buttons */}
          <div className="mt-4 flex items-center justify-between gap-3">
            {step > 1 ? (
              <Button variant="outline" onClick={handlePrevStep} size="lg">
                ← Back
              </Button>
            ) : (
              <a href="/cart" className="text-sm text-muted-foreground hover:text-foreground">
                ← Return to cart
              </a>
            )}

            {step < 3 ? (
              <Button variant="luxury" size="lg" onClick={handleNextStep}>
                Continue →
              </Button>
            ) : (
              <Button
                variant="luxury"
                size="lg"
                onClick={handleSubmit}
                disabled={isLoading}
                className="gap-2 min-w-[180px]"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  `Place Order · $${total.toFixed(2)}`
                )}
              </Button>
            )}
          </div>
        </div>

        {/* Right: Order Summary (sticky) */}
        <div className="order-first lg:order-last">
          <div className="sticky top-24">
            <OrderSummary items={items} />
          </div>
        </div>
      </div>
    </div>
  );
}

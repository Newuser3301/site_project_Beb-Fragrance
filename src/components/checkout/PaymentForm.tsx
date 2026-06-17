// src/components/checkout/PaymentForm.tsx
'use client';

import { useState, useEffect } from 'react';
import { Lock, CreditCard, Wallet, Coins, Copy, ExternalLink, Check, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export interface PaymentFormData {
  cardNumber: string;
  expiryDate: string;
  cvc: string;
  cardholderName: string;
}

export interface PaymentFormErrors {
  cardNumber?: string;
  expiryDate?: string;
  cvc?: string;
  cardholderName?: string;
}

interface PaymentFormProps {
  data: PaymentFormData;
  errors: PaymentFormErrors;
  onChange: (field: keyof PaymentFormData, value: string) => void;
  stripeEnabled?: boolean;
  paymentMethod: 'STRIPE' | 'TON' | 'CASH_ON_DELIVERY';
  onPaymentMethodChange: (method: 'STRIPE' | 'TON' | 'CASH_ON_DELIVERY') => void;
  total: number;
}

function formatCardNumber(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 16);
  return digits.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
}

function formatExpiry(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 4);
  if (digits.length >= 2) {
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  }
  return digits;
}

function detectCardType(number: string): string {
  const n = number.replace(/\s/g, '');
  if (/^4/.test(n)) return 'visa';
  if (/^5[1-5]|^2[2-7]/.test(n)) return 'mastercard';
  if (/^3[47]/.test(n)) return 'amex';
  return 'unknown';
}

function VisaIcon() {
  return (
    <svg className="h-6 w-auto" viewBox="0 0 60 20" fill="none">
      <text x="0" y="16" fontFamily="Arial" fontWeight="bold" fontSize="16" fill="#1A1F71">VISA</text>
    </svg>
  );
}

function MastercardIcon() {
  return (
    <svg className="h-6 w-auto" viewBox="0 0 40 26" fill="none">
      <circle cx="14" cy="13" r="12" fill="#EB001B" />
      <circle cx="26" cy="13" r="12" fill="#F79E1B" />
      <path d="M20 7.1a12 12 0 010 11.8 12 12 0 010-11.8z" fill="#FF5F00" />
    </svg>
  );
}

function AmexIcon() {
  return (
    <svg className="h-6 w-auto" viewBox="0 0 50 20" fill="none">
      <text x="0" y="15" fontFamily="Arial" fontWeight="bold" fontSize="13" fill="#007BC1">AMEX</text>
    </svg>
  );
}

export function PaymentForm({
  data,
  errors,
  onChange,
  stripeEnabled = true,
  paymentMethod,
  onPaymentMethodChange,
  total,
}: PaymentFormProps) {
  const [focused, setFocused] = useState<keyof PaymentFormData | null>(null);
  const [copied, setCopied] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');

  const cardType = detectCardType(data.cardNumber);
  const tonAddress = process.env.NEXT_PUBLIC_TON_WALLET_ADDRESS || 'UQDE9lEqD9uS0RPTU4DmxPAs4CgZVDe79ZjkhkLqJiDM-_Kp';

  useEffect(() => {
    if (paymentMethod === 'TON') {
      import('qrcode').then((QRCode) => {
        QRCode.toDataURL(tonAddress, { margin: 2, scale: 4 })
          .then((url) => setQrCodeUrl(url))
          .catch((err) => console.error('Failed to generate QR code', err));
      });
    }
  }, [paymentMethod, tonAddress]);

  const handleCardNumberChange = (value: string) => {
    onChange('cardNumber', formatCardNumber(value));
  };

  const handleExpiryChange = (value: string) => {
    onChange('expiryDate', formatExpiry(value));
  };

  const handleCvcChange = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, cardType === 'amex' ? 4 : 3);
    onChange('cvc', digits);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(tonAddress);
    setCopied(true);
    toast.success('Wallet address copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  // TON and UZS Conversions
  const uzsTotal = total * 12800;
  const tonTotal = total / 7.2;

  return (
    <div>
      <h2 className="font-serif text-xl font-bold text-foreground mb-5">
        Payment Method
      </h2>

      {/* Payment Method Selector Tabs */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 mb-6">
        {stripeEnabled && (
          <button
            type="button"
            onClick={() => onPaymentMethodChange('STRIPE')}
            className={cn(
              'flex flex-col items-start p-4 rounded-xl border text-left transition-all outline-none',
              paymentMethod === 'STRIPE'
                ? 'border-gold-500 bg-gold-50/20 ring-1 ring-gold-500'
                : 'border-border bg-white hover:border-gold-300'
            )}
          >
            <CreditCard className={cn('h-5 w-5 mb-2', paymentMethod === 'STRIPE' ? 'text-gold-600' : 'text-muted-foreground')} />
            <span className="text-sm font-semibold text-foreground">Card Payment</span>
            <span className="text-xs text-muted-foreground mt-1">Pay with Visa, Mastercard, or Amex</span>
          </button>
        )}

        <button
          type="button"
          onClick={() => onPaymentMethodChange('TON')}
          className={cn(
            'flex flex-col items-start p-4 rounded-xl border text-left transition-all outline-none',
            paymentMethod === 'TON'
              ? 'border-gold-500 bg-gold-50/20 ring-1 ring-gold-500'
              : 'border-border bg-white hover:border-gold-300'
          )}
        >
          <Wallet className={cn('h-5 w-5 mb-2', paymentMethod === 'TON' ? 'text-gold-600' : 'text-muted-foreground')} />
          <span className="text-sm font-semibold text-foreground">TON Wallet</span>
          <span className="text-xs text-muted-foreground mt-1">Pay with Telegram Wallet (TON)</span>
        </button>

        <button
          type="button"
          onClick={() => onPaymentMethodChange('CASH_ON_DELIVERY')}
          className={cn(
            'flex flex-col items-start p-4 rounded-xl border text-left transition-all outline-none',
            paymentMethod === 'CASH_ON_DELIVERY'
              ? 'border-gold-500 bg-gold-50/20 ring-1 ring-gold-500'
              : 'border-border bg-white hover:border-gold-300'
          )}
        >
          <Coins className={cn('h-5 w-5 mb-2', paymentMethod === 'CASH_ON_DELIVERY' ? 'text-gold-600' : 'text-muted-foreground')} />
          <span className="text-sm font-semibold text-foreground">Cash on Delivery</span>
          <span className="text-xs text-muted-foreground mt-1">Pay with cash when order arrives</span>
        </button>
      </div>

      {/* STRIPE Payment Fields */}
      {paymentMethod === 'STRIPE' && (
        <div className="space-y-4 border-t border-border pt-5">
          {/* Accepted cards */}
          <div className="flex items-center gap-3">
            <p className="text-sm text-muted-foreground">Accepted:</p>
            <div className="flex items-center gap-2">
              <div className={cn(
                'flex h-8 w-12 items-center justify-center rounded border bg-white px-1 transition-opacity',
                cardType === 'visa' || cardType === 'unknown' ? 'opacity-100' : 'opacity-40'
              )}>
                <VisaIcon />
              </div>
              <div className={cn(
                'flex h-8 w-12 items-center justify-center rounded border bg-white px-1 transition-opacity',
                cardType === 'mastercard' || cardType === 'unknown' ? 'opacity-100' : 'opacity-40'
              )}>
                <MastercardIcon />
              </div>
              <div className={cn(
                'flex h-8 w-12 items-center justify-center rounded border bg-white px-1 transition-opacity',
                cardType === 'amex' || cardType === 'unknown' ? 'opacity-100' : 'opacity-40'
              )}>
                <AmexIcon />
              </div>
            </div>
          </div>

          {/* Test card hint */}
          <div className="flex items-start gap-2 rounded-xl bg-blue-50 px-4 py-3 text-sm text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
            <CreditCard className="mt-0.5 h-4 w-4 shrink-0" />
            <p>
              <strong>Test card:</strong> 4242 4242 4242 4242 · Any future date · Any 3 digits
            </p>
          </div>

          {/* Card number */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="cardNumber" className="text-sm font-medium text-foreground">
              Card Number <span className="text-destructive">*</span>
            </label>
            <div className="relative">
              <input
                id="cardNumber"
                type="text"
                inputMode="numeric"
                value={data.cardNumber}
                onChange={(e) => handleCardNumberChange(e.target.value)}
                onFocus={() => setFocused('cardNumber')}
                onBlur={() => setFocused(null)}
                placeholder="1234 5678 9012 3456"
                maxLength={19}
                className={cn(
                  'h-11 w-full rounded-xl border bg-white px-4 pr-12 text-sm font-mono outline-none transition-all placeholder:font-sans placeholder:text-muted-foreground/60 dark:bg-slate-900',
                  'focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20',
                  errors.cardNumber ? 'border-destructive' : 'border-border hover:border-gold-300'
                )}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <CreditCard className="h-5 w-5 text-muted-foreground/40" />
              </div>
            </div>
            {errors.cardNumber && (
              <p className="text-xs text-destructive">{errors.cardNumber}</p>
            )}
          </div>

          {/* Cardholder Name */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="cardholderName" className="text-sm font-medium text-foreground">
              Cardholder Name <span className="text-destructive">*</span>
            </label>
            <input
              id="cardholderName"
              type="text"
              value={data.cardholderName}
              onChange={(e) => onChange('cardholderName', e.target.value.toUpperCase())}
              onFocus={() => setFocused('cardholderName')}
              onBlur={() => setFocused(null)}
              placeholder="JOHN DOE"
              className={cn(
                'h-11 w-full rounded-xl border bg-white px-4 text-sm font-mono tracking-wider outline-none transition-all placeholder:font-sans placeholder:tracking-normal placeholder:text-muted-foreground/60 dark:bg-slate-900',
                'focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20',
                errors.cardholderName ? 'border-destructive' : 'border-border hover:border-gold-300'
              )}
            />
            {errors.cardholderName && (
              <p className="text-xs text-destructive">{errors.cardholderName}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Expiry Date */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="expiryDate" className="text-sm font-medium text-foreground">
                Expiry Date <span className="text-destructive">*</span>
              </label>
              <input
                id="expiryDate"
                type="text"
                inputMode="numeric"
                value={data.expiryDate}
                onChange={(e) => handleExpiryChange(e.target.value)}
                onFocus={() => setFocused('expiryDate')}
                onBlur={() => setFocused(null)}
                placeholder="MM/YY"
                maxLength={5}
                className={cn(
                  'h-11 w-full rounded-xl border bg-white px-4 text-sm font-mono outline-none transition-all placeholder:font-sans placeholder:text-muted-foreground/60 dark:bg-slate-900',
                  'focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20',
                  errors.expiryDate ? 'border-destructive' : 'border-border hover:border-gold-300'
                )}
              />
              {errors.expiryDate && (
                <p className="text-xs text-destructive">{errors.expiryDate}</p>
              )}
            </div>

            {/* CVC */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="cvc" className="text-sm font-medium text-foreground">
                CVC <span className="text-destructive">*</span>
              </label>
              <input
                id="cvc"
                type="text"
                inputMode="numeric"
                value={data.cvc}
                onChange={(e) => handleCvcChange(e.target.value)}
                onFocus={() => setFocused('cvc')}
                onBlur={() => setFocused(null)}
                placeholder={cardType === 'amex' ? '0000' : '000'}
                maxLength={cardType === 'amex' ? 4 : 3}
                className={cn(
                  'h-11 w-full rounded-xl border bg-white px-4 text-sm font-mono outline-none transition-all placeholder:font-sans placeholder:text-muted-foreground/60 dark:bg-slate-900',
                  'focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20',
                  errors.cvc ? 'border-destructive' : 'border-border hover:border-gold-300'
                )}
              />
              {errors.cvc && (
                <p className="text-xs text-destructive">{errors.cvc}</p>
              )}
            </div>
          </div>

          {/* Secured by Stripe */}
          <div className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-cream-50 dark:bg-slate-800/40 py-3 text-sm text-muted-foreground">
            <Lock className="h-4 w-4 text-gold-500" />
            <span>Secured by <strong className="text-foreground">Stripe</strong> · 256-bit SSL encryption</span>
          </div>
        </div>
      )}

      {/* TON Wallet Payment */}
      {paymentMethod === 'TON' && (
        <div className="space-y-5 border-t border-border pt-5">
          {/* TON Exchange Rate Conversion Details */}
          <div className="rounded-xl border border-gold-200 bg-gold-50/10 p-5 dark:border-slate-850 dark:bg-slate-900/50">
            <div className="flex items-center gap-2 mb-3">
              <Info className="h-4.5 w-4.5 text-gold-600" />
              <span className="font-semibold text-sm text-foreground">Total Payable Amount</span>
            </div>
            
            <div className="grid grid-cols-3 gap-2 text-center divide-x divide-border">
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">USD Amount</span>
                <span className="text-base font-bold text-foreground">${total.toFixed(2)}</span>
              </div>
              <div className="flex flex-col px-2">
                <span className="text-xs text-muted-foreground">UZS (12,800)</span>
                <span className="text-base font-bold text-foreground">{uzsTotal.toLocaleString('uz-UZ')} UZS</span>
              </div>
              <div className="flex flex-col px-2">
                <span className="text-xs text-muted-foreground">TON (7.2 USD)</span>
                <span className="text-base font-bold text-gold-600">{tonTotal.toFixed(4)} TON</span>
              </div>
            </div>

            <p className="text-[11px] text-muted-foreground text-center mt-3">
              Exchange rates are fixed at 1 USD = 12,800 UZS and 1 TON = 7.2 USD.
            </p>
          </div>

          {/* TON Address Display & Copy */}
          <div className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-foreground">TON Wallet Address</span>
            <div className="flex gap-2">
              <div className="flex-1 bg-muted px-4 py-2.5 rounded-xl border border-border text-xs font-mono select-all break-all flex items-center min-h-[44px]">
                {tonAddress}
              </div>
              <button
                type="button"
                onClick={handleCopy}
                className={cn(
                  'shrink-0 flex items-center justify-center gap-1.5 px-4 rounded-xl border text-sm font-semibold transition-all active:scale-95',
                  copied
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-700 dark:bg-emerald-950/40 dark:border-emerald-850 dark:text-emerald-300'
                    : 'bg-white border-border text-foreground hover:bg-muted dark:bg-slate-900'
                )}
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* QR Code and Instructions Layout */}
          <div className="flex flex-col md:flex-row items-center gap-6 p-4 rounded-xl border border-border bg-white dark:bg-slate-900/50">
            {qrCodeUrl ? (
              <div className="flex flex-col items-center shrink-0">
                <div className="relative border-2 border-border rounded-xl p-2 bg-white">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={qrCodeUrl} alt="TON Wallet QR Code" className="h-32 w-32 object-contain" />
                </div>
                <span className="text-[10px] text-muted-foreground mt-1.5">Scan QR to pay</span>
              </div>
            ) : (
              <div className="h-36 w-36 bg-muted animate-pulse rounded-xl shrink-0 flex items-center justify-center text-xs text-muted-foreground">
                Generating QR...
              </div>
            )}

            <div className="space-y-2">
              <h4 className="font-semibold text-sm text-foreground">Directions for payment:</h4>
              <ol className="list-decimal pl-4 text-xs text-muted-foreground space-y-1.5">
                <li>Copy the wallet address above or scan the QR code.</li>
                <li>Send exactly <strong className="text-foreground">{tonTotal.toFixed(4)} TON</strong> to the address.</li>
                <li>Ensure the transaction is confirmed on the blockchain.</li>
                <li>
                  Go to <strong className="text-foreground">Telegram Wallet</strong> to easily manage and send your funds if needed.
                </li>
                <li>Send your **Order Number** to our support channel/admin to confirm your payment.</li>
              </ol>
            </div>
          </div>

          {/* Open Wallet in Telegram button */}
          <a
            href="https://t.me/wallet"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full bg-[#0088cc] hover:bg-[#0077b5] text-white font-medium py-3 rounded-xl transition-all shadow-[0_4px_12px_rgba(0,136,204,0.15)] text-sm active:scale-[0.98]"
          >
            <span>Open Telegram Wallet</span>
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      )}

      {/* Cash on Delivery Payment */}
      {paymentMethod === 'CASH_ON_DELIVERY' && (
        <div className="space-y-4 border-t border-border pt-5">
          <div className="rounded-xl border border-amber-200 bg-amber-50/20 p-5 dark:border-slate-850 dark:bg-slate-900/40">
            <h3 className="font-semibold text-sm text-foreground flex items-center gap-2 text-amber-800 dark:text-amber-300">
              <Coins className="h-4.5 w-4.5" />
              Cash on Delivery (COD) Selected
            </h3>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">
              You will be able to inspect and pay for your order using cash when it is delivered to your address.
              Please ensure you have the correct total amount of{' '}
              <strong className="text-foreground">${total.toFixed(2)}</strong> ({uzsTotal.toLocaleString('uz-UZ')} UZS) ready at delivery time.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

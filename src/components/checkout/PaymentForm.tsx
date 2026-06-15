// src/components/checkout/PaymentForm.tsx
'use client';

import { useState } from 'react';
import { Lock, CreditCard } from 'lucide-react';
import { cn } from '@/lib/utils';

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

export function PaymentForm({ data, errors, onChange }: PaymentFormProps) {
  const [focused, setFocused] = useState<keyof PaymentFormData | null>(null);
  const cardType = detectCardType(data.cardNumber);

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

  return (
    <div>
      <h2 className="font-serif text-xl font-bold text-foreground">
        Payment Details
      </h2>

      {/* Accepted cards */}
      <div className="mt-3 flex items-center gap-3">
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
      <div className="mt-3 flex items-start gap-2 rounded-xl bg-blue-50 px-4 py-3 text-sm text-blue-700">
        <CreditCard className="mt-0.5 h-4 w-4 shrink-0" />
        <p>
          <strong>Test card:</strong> 4242 4242 4242 4242 · Any future date · Any 3 digits
        </p>
      </div>

      <div className="mt-5 space-y-4">
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
                'h-11 w-full rounded-xl border bg-white px-4 pr-12 text-sm font-mono outline-none transition-all placeholder:font-sans placeholder:text-muted-foreground/60',
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
              'h-11 w-full rounded-xl border bg-white px-4 text-sm font-mono tracking-wider outline-none transition-all placeholder:font-sans placeholder:tracking-normal placeholder:text-muted-foreground/60',
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
                'h-11 w-full rounded-xl border bg-white px-4 text-sm font-mono outline-none transition-all placeholder:font-sans placeholder:text-muted-foreground/60',
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
                'h-11 w-full rounded-xl border bg-white px-4 text-sm font-mono outline-none transition-all placeholder:font-sans placeholder:text-muted-foreground/60',
                'focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20',
                errors.cvc ? 'border-destructive' : 'border-border hover:border-gold-300'
              )}
            />
            {errors.cvc && (
              <p className="text-xs text-destructive">{errors.cvc}</p>
            )}
          </div>
        </div>
      </div>

      {/* Secured by Stripe */}
      <div className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-cream-50 py-3 text-sm text-muted-foreground">
        <Lock className="h-4 w-4 text-gold-500" />
        <span>Secured by <strong className="text-foreground">Stripe</strong> · 256-bit SSL encryption</span>
      </div>
    </div>
  );
}

// src/components/checkout/ShippingForm.tsx
'use client';

import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const COUNTRIES = [
  { value: 'US', label: 'United States' },
  { value: 'GB', label: 'United Kingdom' },
  { value: 'CA', label: 'Canada' },
  { value: 'AU', label: 'Australia' },
  { value: 'DE', label: 'Germany' },
  { value: 'FR', label: 'France' },
  { value: 'IT', label: 'Italy' },
  { value: 'AE', label: 'United Arab Emirates' },
  { value: 'UZ', label: 'Uzbekistan' },
  { value: 'KZ', label: 'Kazakhstan' },
  { value: 'RU', label: 'Russia' },
  { value: 'TR', label: 'Turkey' },
];

export interface ShippingFormData {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface ShippingFormErrors {
  fullName?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
}

interface InputFieldProps {
  id: string;
  label: string;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  className?: string;
}

function InputField({
  id,
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  required,
  className,
}: InputFieldProps) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label
        htmlFor={id}
        className="text-sm font-medium text-foreground"
      >
        {label}
        {required && <span className="ml-1 text-destructive">*</span>}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          'h-11 w-full rounded-xl border bg-white px-4 text-sm outline-none transition-all placeholder:text-muted-foreground/60',
          'focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20',
          error
            ? 'border-destructive focus:border-destructive focus:ring-destructive/20'
            : 'border-border hover:border-gold-300'
        )}
        autoComplete="off"
      />
      {error && (
        <p className="text-xs text-destructive">{error}</p>
      )}
    </div>
  );
}

interface ShippingFormProps {
  data: ShippingFormData;
  errors: ShippingFormErrors;
  onChange: (field: keyof ShippingFormData, value: string) => void;
}

export function ShippingForm({ data, errors, onChange }: ShippingFormProps) {
  return (
    <div>
      <h2 className="font-serif text-xl font-bold text-foreground">
        Shipping Information
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Enter your delivery address below
      </p>

      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Full Name */}
        <InputField
          id="fullName"
          label="Full Name"
          placeholder="John Doe"
          value={data.fullName}
          onChange={(v) => onChange('fullName', v)}
          error={errors.fullName}
          required
          className="sm:col-span-2"
        />

        {/* Email */}
        <InputField
          id="email"
          label="Email Address"
          type="email"
          placeholder="john@example.com"
          value={data.email}
          onChange={(v) => onChange('email', v)}
          error={errors.email}
          required
        />

        {/* Phone */}
        <InputField
          id="phone"
          label="Phone Number"
          type="tel"
          placeholder="+1 (555) 000-0000"
          value={data.phone}
          onChange={(v) => onChange('phone', v)}
          error={errors.phone}
          required
        />

        {/* Address */}
        <InputField
          id="address"
          label="Street Address"
          placeholder="123 Main St, Apt 4B"
          value={data.address}
          onChange={(v) => onChange('address', v)}
          error={errors.address}
          required
          className="sm:col-span-2"
        />

        {/* City */}
        <InputField
          id="city"
          label="City"
          placeholder="New York"
          value={data.city}
          onChange={(v) => onChange('city', v)}
          error={errors.city}
          required
        />

        {/* State */}
        <InputField
          id="state"
          label="State / Province"
          placeholder="NY"
          value={data.state}
          onChange={(v) => onChange('state', v)}
          error={errors.state}
        />

        {/* Zip Code */}
        <InputField
          id="zipCode"
          label="ZIP / Postal Code"
          placeholder="10001"
          value={data.zipCode}
          onChange={(v) => onChange('zipCode', v)}
          error={errors.zipCode}
          required
        />

        {/* Country */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="country" className="text-sm font-medium text-foreground">
            Country <span className="text-destructive">*</span>
          </label>
          <div className="relative">
            <select
              id="country"
              value={data.country}
              onChange={(e) => onChange('country', e.target.value)}
              className={cn(
                'h-11 w-full appearance-none rounded-xl border bg-white px-4 pr-9 text-sm outline-none transition-all',
                'focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20',
                errors.country
                  ? 'border-destructive'
                  : 'border-border hover:border-gold-300'
              )}
            >
              {COUNTRIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </div>
          {errors.country && (
            <p className="text-xs text-destructive">{errors.country}</p>
          )}
        </div>
      </div>
    </div>
  );
}

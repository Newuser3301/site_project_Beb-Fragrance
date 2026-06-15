'use client';

import { StarRating } from '@/components/ui/StarRating';
import { ScrollReveal } from '@/components/home/ScrollReveal';

const testimonials = [
  {
    quote:
      'The quality is exceptional. My Tom Ford Oud Wood arrived perfectly packaged and smells absolutely divine. Beb Fragrance is now my go-to for luxury scents.',
    name: 'Sarah Mitchell',
    location: 'New York, USA',
    rating: 5,
  },
  {
    quote:
      'I was hesitant to buy perfume online, but the authenticity guarantee and fast shipping won me over. The Creed Aventus I received is 100% genuine.',
    name: 'James Chen',
    location: 'London, UK',
    rating: 5,
  },
  {
    quote:
      'Beautiful selection and elegant packaging. The customer service team helped me find the perfect gift for my wife. Highly recommend Beb Fragrance!',
    name: 'Amira Hassan',
    location: 'Dubai, UAE',
    rating: 5,
  },
];

export function TestimonialsSection() {
  return (
    <section className="pb-16 pt-10 md:pb-20">
      <div className="container-beb">
        <ScrollReveal className="mb-10 text-center">
          <p className="eyebrow mb-3">Trusted by thousands</p>
          <h2 className="section-title">
            Customers love the refined look, fast delivery, and authentic scents
          </h2>
          <p className="mt-3 text-[#7d6874]">
            Trusted by fragrance lovers worldwide
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <ScrollReveal key={testimonial.name} delay={index * 0.1}>
              <blockquote className="flex h-full flex-col rounded-[24px] border border-[rgba(106,53,83,0.08)] bg-white p-8 shadow-[0_16px_35px_rgba(81,42,63,0.04)]">
                <StarRating
                  rating={testimonial.rating}
                  readOnly
                  size="sm"
                  className="mb-4"
                />
                <p className="flex-1 text-sm leading-7 text-[#6f5966] italic">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
                <footer className="mt-6 border-t border-[rgba(106,53,83,0.08)] pt-4">
                  <p className="font-semibold text-[#2f1d28]">
                    {testimonial.name}
                  </p>
                  <p className="text-xs uppercase tracking-[0.18em] text-[#9a8691]">
                    {testimonial.location}
                  </p>
                </footer>
              </blockquote>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

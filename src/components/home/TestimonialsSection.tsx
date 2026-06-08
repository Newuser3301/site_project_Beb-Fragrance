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
    <section className="bg-white py-24">
      <div className="container-beb">
        <ScrollReveal className="mb-12 text-center">
          <h2 className="font-serif text-3xl font-bold text-foreground md:text-4xl">
            What Our Customers Say
          </h2>
          <p className="mt-3 text-muted-foreground">
            Trusted by fragrance lovers worldwide
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <ScrollReveal key={testimonial.name} delay={index * 0.1}>
              <blockquote className="flex h-full flex-col rounded-xl border border-border bg-cream-50 p-8">
                <StarRating
                  rating={testimonial.rating}
                  readOnly
                  size="sm"
                  className="mb-4"
                />
                <p className="flex-1 text-sm leading-relaxed text-muted-foreground italic">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
                <footer className="mt-6 border-t border-border pt-4">
                  <p className="font-semibold text-foreground">
                    {testimonial.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
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

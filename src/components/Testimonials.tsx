'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quotes, CaretLeft, CaretRight } from '@phosphor-icons/react';

const testimonials = [
  {
    quote:
      'Riley built our scheduling platform from scratch and it completely transformed how we run our business. The attention to detail is unmatched.',
    name: 'Marcus Whitfield',
    role: 'Operations Director',
    company: 'CleanRoute Pro',
  },
  {
    quote:
      'Working with Riley Tech Studio felt like having a senior engineer embedded in our team. They understood the product vision immediately.',
    name: 'Emma Westbrook',
    role: 'Founder',
    company: 'Restore Coaching',
  },
  {
    quote:
      'The website has been generating leads since day one. It looks premium, loads fast, and our clients consistently compliment it.',
    name: 'James Deakin',
    role: 'Director',
    company: 'JD Air Electrical',
  },
];

export default function Testimonials() {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % testimonials.length);
  }, []);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <section
      style={{
        paddingTop: 'var(--section-gap)',
        paddingBottom: 'var(--section-gap)',
        background: 'var(--color-background-alt)',
      }}
    >
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}
          style={{ textAlign: 'center', marginBottom: '3rem' }}
        >
          <span className="eyebrow">Client Feedback</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          style={{
            maxWidth: '720px',
            margin: '0 auto',
            textAlign: 'center',
            position: 'relative',
          }}
        >
          {/* Quote icon */}
          <Quotes
            size={48}
            weight="fill"
            style={{
              color: 'var(--color-primary-light)',
              margin: '0 auto 1.5rem',
            }}
          />

          <div style={{ minHeight: '200px', position: 'relative' }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
              >
                <blockquote
                  style={{
                    fontSize: 'clamp(1.125rem, 2vw, 1.375rem)',
                    lineHeight: 1.7,
                    color: 'var(--color-foreground)',
                    fontWeight: 500,
                    fontStyle: 'italic',
                    margin: '0 0 2rem',
                  }}
                >
                  &ldquo;{testimonials[current].quote}&rdquo;
                </blockquote>

                <div>
                  <div
                    style={{
                      fontWeight: 700,
                      fontSize: '1rem',
                      fontFamily: 'var(--font-heading)',
                      color: 'var(--color-foreground)',
                      letterSpacing: '-0.01em',
                    }}
                  >
                    {testimonials[current].name}
                  </div>
                  <div
                    style={{
                      fontSize: '0.875rem',
                      color: 'var(--color-foreground-subtle)',
                      marginTop: '0.25rem',
                    }}
                  >
                    {testimonials[current].role}, {testimonials[current].company}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Controls */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1rem',
              marginTop: '2rem',
            }}
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={prev}
              aria-label="Previous testimonial"
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                border: '1px solid var(--color-border)',
                background: 'var(--color-surface)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <CaretLeft size={16} weight="bold" color="var(--color-foreground)" />
            </motion.button>

            {/* Dots */}
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {testimonials.map((_, i) => (
                <motion.button
                  key={i}
                  onClick={() => setCurrent(i)}
                  animate={{
                    width: current === i ? '24px' : '8px',
                    background: current === i ? 'var(--color-primary)' : 'var(--color-border)',
                  }}
                  transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                  aria-label={`Go to testimonial ${i + 1}`}
                  style={{
                    height: '8px',
                    borderRadius: '4px',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0,
                  }}
                />
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={next}
              aria-label="Next testimonial"
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                border: '1px solid var(--color-border)',
                background: 'var(--color-surface)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <CaretRight size={16} weight="bold" color="var(--color-foreground)" />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

// The anxiety-reducer: a quote request is a commitment into an unknown
// process, so the process gets named. Ends with the same CTA string used
// everywhere else on the page.

const STEPS = [
  {
    title: 'Tell us what you need',
    body: 'Use the form or give us a call. About 15 minutes is enough to scope most jobs.',
  },
  {
    title: 'Get a fixed quote',
    body: 'A plan and a full price in writing. The number you see is the number you pay.',
  },
  {
    title: 'See the design first',
    body: 'We design your site and show you before we build it. You sign off when it looks right.',
  },
  {
    title: 'Launch and own it',
    body: 'Your site goes live in your name. Your domain, your content, yours to keep.',
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      style={{
        paddingTop: 'var(--section-gap)',
        paddingBottom: 'var(--section-gap)',
        background: 'var(--color-background-alt)',
        borderTop: '1px solid var(--color-border-subtle)',
        borderBottom: '1px solid var(--color-border-subtle)',
      }}
    >
      <div className="section-container">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
          style={{
            fontSize: 'clamp(1.875rem, 3.4vw, 2.75rem)',
            fontWeight: 700,
            letterSpacing: '-0.025em',
          }}
        >
          How it works
        </motion.h2>

        <div className="steps-grid">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{
                delay: i * 0.08,
                duration: 0.6,
                ease: [0.32, 0.72, 0, 1],
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '2.25rem',
                  fontWeight: 700,
                  color: 'var(--color-primary)',
                  lineHeight: 1,
                  display: 'block',
                }}
              >
                {i + 1}
              </span>
              <h3
                style={{
                  marginTop: '0.875rem',
                  fontSize: '1.125rem',
                  fontWeight: 600,
                  letterSpacing: '-0.015em',
                }}
              >
                {step.title}
              </h3>
              <p style={{ marginTop: '0.5rem', fontSize: '0.9375rem', lineHeight: 1.65 }}>
                {step.body}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{ marginTop: '3rem' }}
        >
          <Link href="/#contact" className="btn-primary">
            Get My Free Quote
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

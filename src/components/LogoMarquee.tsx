'use client';

import { motion } from 'framer-motion';

const logos = [
  'Restore Coaching',
  'CleanRoute Pro',
  'Today Stash',
  'Land to Sea Cleaning',
  'Coastal Escapes',
  'BAS to Basics',
  'JD Air',
  'First Choice Glass',
  'East Coast Pipe',
  'North Eastern Building',
  'Bay & Basin Hotel',
  'South Coast Gym',
];

export default function LogoMarquee() {
  return (
    <section
      style={{
        padding: '3rem 0',
        borderTop: '1px solid var(--color-border-subtle)',
        borderBottom: '1px solid var(--color-border-subtle)',
        background: 'var(--color-background-alt)',
        overflow: 'hidden',
      }}
    >
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <p
          style={{
            textAlign: 'center',
            fontSize: '0.75rem',
            fontWeight: 600,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'var(--color-foreground-subtle)',
            marginBottom: '1.5rem',
          }}
        >
          Trusted by businesses across the South Coast
        </p>

        <div style={{ position: 'relative', overflow: 'hidden' }}>
          {/* Gradient masks */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: '120px',
              background: 'linear-gradient(to right, var(--color-background-alt), transparent)',
              zIndex: 2,
              pointerEvents: 'none',
            }}
          />
          <div
            style={{
              position: 'absolute',
              right: 0,
              top: 0,
              bottom: 0,
              width: '120px',
              background: 'linear-gradient(to left, var(--color-background-alt), transparent)',
              zIndex: 2,
              pointerEvents: 'none',
            }}
          />

          <div
            className="animate-marquee"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '3rem',
              width: 'max-content',
            }}
          >
            {[...logos, ...logos].map((name, i) => (
              <span
                key={`${name}-${i}`}
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '0.9375rem',
                  fontWeight: 600,
                  color: 'var(--color-foreground-subtle)',
                  whiteSpace: 'nowrap',
                  transition: 'opacity 300ms',
                  letterSpacing: '-0.01em',
                }}
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}

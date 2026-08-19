'use client';

import { motion } from 'framer-motion';
import { Star, ArrowUpRight } from '@phosphor-icons/react';

// Compact Google-reviews band: aggregate rating + a few short quotes, with
// a link out to the real Google profile (the click-out is what makes it
// credible - never screenshot reviews).
//
// TODO(riley): fill in the real numbers and quotes from your Google
// Business Profile, then flip `ready` to true. Nothing renders until then -
// no invented star counts.
export const GOOGLE_REVIEWS = {
  ready: false,
  rating: '5.0', // your real aggregate rating
  count: 0, // your real review count
  profileUrl: '', // your Google Business Profile review link
  quotes: [
    // Up to three short quotes (2-3 lines max), copied word-for-word from
    // real Google reviews. Use the reviewer's real first name + business.
    { text: '', name: '', business: '' },
  ],
};

export default function GoogleReviews() {
  if (!GOOGLE_REVIEWS.ready) return null;
  const quotes = GOOGLE_REVIEWS.quotes.filter((q) => q.text.trim());

  return (
    <section
      style={{
        padding: '4rem 0',
        borderTop: '1px solid var(--color-border-subtle)',
        background: 'var(--color-background-alt)',
      }}
    >
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            marginBottom: quotes.length > 0 ? '2.25rem' : 0,
          }}
        >
          <span style={{ display: 'inline-flex', gap: '0.125rem' }} aria-hidden="true">
            {[0, 1, 2, 3, 4].map((i) => (
              <Star key={i} size={18} weight="fill" color="#fbbc04" />
            ))}
          </span>
          <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-foreground)' }}>
            {GOOGLE_REVIEWS.rating}
          </span>
          <span style={{ fontSize: '0.9375rem', color: 'var(--color-foreground-muted)' }}>
            from {GOOGLE_REVIEWS.count} Google reviews
          </span>
          <a
            href={GOOGLE_REVIEWS.profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.25rem',
              marginLeft: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: 600,
              color: 'var(--color-primary)',
              textDecoration: 'none',
            }}
          >
            Read them on Google
            <ArrowUpRight size={14} weight="bold" />
          </a>
        </motion.div>

        {quotes.length > 0 && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '1.25rem',
              maxWidth: 980,
              margin: '0 auto',
            }}
          >
            {quotes.map((q, i) => (
              <motion.blockquote
                key={q.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ delay: i * 0.08, duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
                style={{
                  margin: 0,
                  padding: '1.5rem 1.625rem',
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-lg)',
                }}
              >
                <p
                  style={{
                    margin: 0,
                    fontSize: '0.9375rem',
                    lineHeight: 1.65,
                    color: 'var(--color-foreground)',
                  }}
                >
                  &ldquo;{q.text}&rdquo;
                </p>
                <footer
                  style={{
                    marginTop: '0.75rem',
                    fontSize: '0.8125rem',
                    color: 'var(--color-foreground-muted)',
                  }}
                >
                  <strong style={{ color: 'var(--color-foreground)' }}>{q.name}</strong>
                  {q.business ? ` · ${q.business}` : ''}
                  {' · via Google review'}
                </footer>
              </motion.blockquote>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

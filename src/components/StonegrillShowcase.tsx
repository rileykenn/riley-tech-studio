'use client';

import Image from 'next/image';
import { motion, MotionConfig } from 'framer-motion';
import { ArrowUpRight, User } from '@phosphor-icons/react';
import StonegrillDemoBooking from './stonegrill/StonegrillDemoBooking';
import FireEmbers from './stonegrill/FireEmbers';

// TODO(riley): fill in the real testimonial (a quote lifted from a Google
// review works, attributed "via Google review"), then flip `ready` to true.
// The card stays hidden until then.
const TESTIMONIAL = {
  ready: true,
  avatarSrc: null as string | null,
  name: 'Alex Phua',
  role: 'Stone Grill Huskisson, via Google review',
  quote:
    'For years, we relied on a physical diary to manage our tables, which was always a headache during busy services. Now, everything is entirely online. The new setup is incredibly easy for both our staff to manage and our guests to use. The website looks premium and captures the exact vibe of our restaurant.',
};

// The one deliberate theme flip on the page: a charcoal band wearing Stone
// Grill Huskisson's own brand (Cinzel via --font-cinzel from the root layout,
// fire red, sharp corners, embers).

const HIGHLIGHTS = [
  {
    title: 'A reservation engine they own',
    body: 'Live per-slot capacity, lead times, blackout dates and approval rules. No per-cover fees to a booking platform.',
  },
  {
    title: 'One run sheet for every booking',
    body: 'Online, phone and walk-in bookings land in the same staff dashboard, with a week grid of covers against capacity.',
  },
  {
    title: 'Guests handle themselves',
    body: 'Branded confirmation emails with a one-click cancel link. No accounts, no phone tag.',
  },
];

export default function StonegrillShowcase() {
  return (
    <MotionConfig reducedMotion="user">
    <section
      id="stonegrill"
      style={{
        position: 'relative',
        overflow: 'hidden',
        background: '#09090b',
        paddingTop: 'var(--section-gap)',
        paddingBottom: 'var(--section-gap)',
      }}
    >
      {/* grain, glow and embers */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.05,
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          backgroundSize: 128,
          pointerEvents: 'none',
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: '50%',
          bottom: '-180px',
          transform: 'translateX(-50%)',
          width: 900,
          height: 420,
          background: 'radial-gradient(ellipse at center, rgba(204,0,0,0.16), rgba(255,106,0,0.05) 55%, transparent 75%)',
          filter: 'blur(60px)',
          pointerEvents: 'none',
        }}
      />
      <FireEmbers className="pointer-events-none absolute inset-x-0 bottom-0 h-full w-full" />

      <div className="section-container" style={{ position: 'relative', zIndex: 1 }}>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          style={{
            textAlign: 'center',
            fontFamily: 'var(--font-cinzel)',
            fontSize: 'clamp(2.5rem, 5.5vw, 4.25rem)',
            fontWeight: 700,
            lineHeight: 0.95,
            letterSpacing: '0.01em',
            color: '#fafafa',
            margin: '0 0 1.25rem',
          }}
        >
          Stone Grill{' '}
          <em style={{ color: '#cc0000', fontStyle: 'italic' }}>Huskisson.</em>
          <span className="sr-only">
            {' '}
            &mdash; restaurant website with online booking system for Stone
            Grill Huskisson
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          style={{
            textAlign: 'center',
            fontSize: '1.0625rem',
            lineHeight: 1.7,
            color: '#a8a29e',
            maxWidth: '52ch',
            margin: '0 auto 3.5rem',
          }}
        >
          A cinematic rebuild for Huskisson&rsquo;s hot-stone steakhouse, where guests sear premium
          cuts on 400° volcanic stone. Behind it: a custom reservation engine the restaurant owns
          outright. Watch its booking flow play out below.
        </motion.p>

        <div className="sg-grid">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <StonegrillDemoBooking />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
          >
            <div style={{ position: 'relative', paddingBottom: '3.25rem' }}>
              <div className="border border-white/10 shadow-2xl" style={{ overflow: 'hidden' }}>
                <Image
                  src="/casestudy/stonegrill-site.jpg"
                  alt="The live Stone Grill Huskisson homepage"
                  width={1400}
                  height={875}
                  sizes="(max-width: 900px) 100vw, 44vw"
                  style={{ width: '100%', height: 'auto', display: 'block' }}
                />
              </div>
              <div
                className="border border-white/10 shadow-2xl"
                style={{
                  position: 'absolute',
                  right: '-0.5rem',
                  bottom: 0,
                  width: '42%',
                  overflow: 'hidden',
                  transform: 'rotate(2deg)',
                }}
              >
                <Image
                  src="/casestudy/stonegrill-steak.jpg"
                  alt="Steak searing on the volcanic stone"
                  width={1000}
                  height={667}
                  sizes="(max-width: 900px) 45vw, 20vw"
                  style={{ width: '100%', height: 'auto', display: 'block' }}
                />
              </div>
            </div>

            <div style={{ marginTop: '1.75rem' }}>
              {HIGHLIGHTS.map((h, i) => (
                <motion.div
                  key={h.title}
                  initial={{ opacity: 0, x: 24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ delay: i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  style={{
                    borderLeft: '2px solid rgba(204,0,0,0.6)',
                    padding: '0.25rem 0 0.25rem 1rem',
                    marginBottom: i < HIGHLIGHTS.length - 1 ? '1.25rem' : 0,
                  }}
                >
                  <p style={{ margin: 0, fontSize: '0.9375rem', fontWeight: 600, color: '#fafafa' }}>
                    {h.title}
                  </p>
                  <p style={{ margin: '0.3rem 0 0', fontSize: '0.875rem', lineHeight: 1.65, color: '#a8a29e' }}>
                    {h.body}
                  </p>
                </motion.div>
              ))}
              <a
                href="https://www.stonegrillhuskisson.com.au"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginTop: '1.5rem',
                  padding: '0.8rem 1.5rem',
                  background: '#cc0000',
                  color: '#ffffff',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  textDecoration: 'none',
                  transition: 'background 200ms',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#e60000';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#cc0000';
                }}
              >
                Visit the live site
                <ArrowUpRight size={15} weight="bold" />
              </a>
            </div>
          </motion.div>
        </div>

        {/* testimonial */}
        {TESTIMONIAL.ready && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          style={{
            marginTop: '3.5rem',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderTop: '2px solid #cc0000',
            padding: '1.75rem 2rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.25rem' }}>
            <div
              style={{
                flexShrink: 0,
                width: 56,
                height: 56,
                borderRadius: '50%',
                background: 'rgba(204,0,0,0.12)',
                border: '1px solid rgba(204,0,0,0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
              }}
            >
              {TESTIMONIAL.avatarSrc ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={TESTIMONIAL.avatarSrc}
                  alt={TESTIMONIAL.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <User size={26} weight="duotone" color="#ff6b5e" />
              )}
            </div>
            <div style={{ minWidth: 0 }}>
              <p
                style={{
                  fontSize: '1.0625rem',
                  lineHeight: 1.65,
                  color: '#fafafa',
                  fontStyle: 'italic',
                  margin: 0,
                  maxWidth: '60ch',
                }}
              >
                &ldquo;{TESTIMONIAL.quote}&rdquo;
              </p>
              <p style={{ fontSize: '0.875rem', color: '#a8a29e', margin: '0.75rem 0 0' }}>
                <strong style={{ color: '#fafafa' }}>{TESTIMONIAL.name}</strong>
                {' · '}
                {TESTIMONIAL.role}
              </p>
            </div>
          </div>
        </motion.div>
        )}

        <p
          style={{
            textAlign: 'center',
            marginTop: '3.5rem',
            marginBottom: 0,
            fontSize: '1rem',
            color: '#a8a29e',
          }}
        >
          Want a booking system your restaurant owns?{' '}
          <a
            href="/#contact"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem',
              color: '#ff6b5e',
              fontWeight: 700,
              textDecoration: 'none',
            }}
          >
            Get a Free Quote
            <ArrowUpRight size={16} weight="bold" />
          </a>
        </p>
      </div>
    </section>
    </MotionConfig>
  );
}

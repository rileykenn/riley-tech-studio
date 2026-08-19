'use client';

import Image from 'next/image';
import { motion, MotionConfig } from 'framer-motion';
import { ArrowUpRight, Quotes, Star, User } from '@phosphor-icons/react';
import StashDemo from './stash/StashDemo';

// Today's Stash wears its own brand: charcoal green, neon lime, Bebas
// display type, glowing emerald. Built from scratch for a founder's idea,
// now live and client-owned at todaysstash.com.au.

// The founder's five-star Google review, in full. Name spelling and
// provenance confirmed by Riley 2026-08-19.
const TESTIMONIAL = {
  ready: true,
  avatarSrc: null as string | null,
  name: 'Adrian Coppola',
  role: "Founder, Today's Stash · via Google review",
  quote:
    'Exceptional MVP development from start to finish. Riley Tech Studio took my concept and turned it into a functional product that exceeded expectations. Professional, responsive, and delivered on time. Highly recommend for anyone needing a reliable tech partner. Will continue to use Riley.',
};

export default function StashShowcase() {
  return (
    <MotionConfig reducedMotion="user">
      <section
        id="stash"
        style={{
          position: 'relative',
          overflow: 'hidden',
          background: '#050B10',
          paddingTop: 'var(--section-gap)',
          paddingBottom: 'var(--section-gap)',
        }}
      >
        {/* soft lime/emerald glows */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: '-160px',
            left: '12%',
            width: 520,
            height: 420,
            background: 'radial-gradient(ellipse at center, rgba(125,231,89,0.1), transparent 70%)',
            filter: 'blur(70px)',
            pointerEvents: 'none',
          }}
        />
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            bottom: '-180px',
            right: '8%',
            width: 560,
            height: 460,
            background: 'radial-gradient(ellipse at center, rgba(16,185,129,0.12), transparent 70%)',
            filter: 'blur(80px)',
            pointerEvents: 'none',
          }}
        />

        <div className="section-container" style={{ position: 'relative', zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1.1rem',
              margin: '0 0 3rem',
            }}
          >
            <Image src="/casestudy/stash-chest.png" alt="" width={68} height={57} aria-hidden="true" />
            <div>
              <p
                style={{
                  margin: '0 0 0.4rem',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  letterSpacing: '0.3em',
                  textTransform: 'uppercase',
                  color: '#7de759',
                }}
              >
                Today&rsquo;s Stash
              </p>
              <h2
                style={{
                  fontFamily: "'Bebas Neue Pro Expanded', var(--font-heading)",
                  fontStyle: 'italic',
                  fontSize: 'clamp(2.5rem, 5.5vw, 4.25rem)',
                  lineHeight: 0.95,
                  letterSpacing: '0.01em',
                  color: '#E8FFF3',
                  margin: 0,
                }}
              >
                His idea,{' '}
                <span
                  style={{
                    color: '#9afc5d',
                    textShadow: '0 2px 16px rgba(154,252,93,0.18)',
                  }}
                >
                  made real.
                </span>
                <span className="sr-only">
                  {' '}
                  &mdash; a two-sided marketplace app we built for Today&rsquo;s
                  Stash
                </span>
              </h2>
              <p
                style={{
                  fontSize: 'clamp(1.125rem, 1.5vw, 1.3125rem)',
                  lineHeight: 1.6,
                  color: '#C7D2CB',
                  maxWidth: '46ch',
                  margin: '1rem 0 0',
                }}
              >
                <strong className="stash-marker" style={{ color: '#E8FFF3' }}>
                  Adrian came to us with nothing but a pitch deck
                </strong>
                , ambition, and zero coding background. We took his idea and built it into the
                real, working app he now owns.
              </p>
              <p
                style={{
                  fontSize: '0.9375rem',
                  color: '#8F908E',
                  margin: '0.85rem 0 0',
                }}
              >
                Watch it run below.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <StashDemo
              aside={
                <motion.div
                  initial={{ opacity: 0, x: 24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                >
                  {TESTIMONIAL.ready && (
                    <div
                      style={{
                        position: 'relative',
                        overflow: 'hidden',
                        borderRadius: 12,
                        borderTop: '2px solid #7de759',
                        background: 'rgba(255,255,255,0.04)',
                        padding: '1.5rem',
                      }}
                    >
                      <Quotes
                        size={96}
                        weight="fill"
                        color="#7de759"
                        aria-hidden="true"
                        style={{
                          position: 'absolute',
                          top: -12,
                          right: -8,
                          opacity: 0.12,
                          pointerEvents: 'none',
                        }}
                      />
                      <div
                        style={{
                          position: 'relative',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.9rem',
                          marginBottom: '1rem',
                        }}
                      >
                        <div
                          style={{
                            flexShrink: 0,
                            width: 48,
                            height: 48,
                            borderRadius: '50%',
                            background: 'rgba(125,231,89,0.1)',
                            border: '1px solid rgba(125,231,89,0.35)',
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
                            <User size={24} weight="duotone" color="#7de759" />
                          )}
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <p
                            style={{
                              fontSize: '0.9375rem',
                              fontWeight: 700,
                              color: '#E8FFF3',
                              margin: 0,
                            }}
                          >
                            {TESTIMONIAL.name}
                          </p>
                          <p style={{ fontSize: '0.875rem', color: '#8F908E', margin: '0.15rem 0 0' }}>
                            {TESTIMONIAL.role}
                          </p>
                        </div>
                      </div>
                      <div
                        aria-label="Rated five stars"
                        role="img"
                        style={{
                          position: 'relative',
                          display: 'flex',
                          gap: '0.2rem',
                          marginBottom: '0.75rem',
                        }}
                      >
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={14} weight="fill" color="#7de759" aria-hidden="true" />
                        ))}
                      </div>
                      <p
                        style={{
                          position: 'relative',
                          fontSize: '0.9375rem',
                          lineHeight: 1.65,
                          color: '#E8FFF3',
                          margin: 0,
                        }}
                      >
                        &ldquo;{TESTIMONIAL.quote}&rdquo;
                      </p>
                    </div>
                  )}
                  <a
                    href="https://todaysstash.com.au"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="stash-visit"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      marginTop: '1.25rem',
                      padding: '0.8rem 1.4rem',
                      borderRadius: 10,
                      background: '#7de759',
                      color: '#04120b',
                      fontSize: '0.875rem',
                      fontWeight: 700,
                      textDecoration: 'none',
                    }}
                  >
                    Visit todaysstash.com.au
                    <ArrowUpRight size={15} weight="bold" />
                  </a>
                  <p
                    style={{
                      marginTop: '1.25rem',
                      marginBottom: 0,
                      fontSize: '0.9375rem',
                      color: '#8F908E',
                    }}
                  >
                    Got an app idea of your own?{' '}
                    <a
                      href="/#contact"
                      className="stash-cta"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                        color: '#9afc5d',
                        fontWeight: 700,
                        textDecoration: 'none',
                      }}
                    >
                      Get a Free Quote
                      <ArrowUpRight size={16} weight="bold" />
                    </a>
                  </p>
                </motion.div>
              }
            />
          </motion.div>
        </div>
      </section>
    </MotionConfig>
  );
}

'use client';

import { useRef } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { motion, MotionConfig, useInView } from 'framer-motion';
import { ArrowUpRight, User } from '@phosphor-icons/react';
import BeforeAfterSlider from './BeforeAfterSlider';

// Sussex Inlet Golf Club's showcase wears the club's own look: sand paper,
// fairway green, gold hairlines and their Cormorant serif, with the real 3D
// course map as the centrepiece.

// The 3D map pulls in three.js (~1MB+ gzipped), so it stays out of the page
// bundle and only mounts once the section scrolls near the viewport.
const CourseMapEmbed = dynamic(() => import('./coursemap/CourseMapEmbed'), {
  ssr: false,
  loading: () => <MapSkeleton />,
});

const NAVY = '#0a1628';
const GOLD = '#b0873a';
const FAIRWAY = '#5d7f58';

// TODO(riley): fill in the real testimonial (a quote lifted from a Google
// review works, attributed "via Google review"), then flip `ready` to true.
// The card stays hidden until then: a visible placeholder reads worse than
// no testimonial at all.
const TESTIMONIAL = {
  ready: false,
  avatarSrc: null as string | null,
  name: 'Client name goes here',
  role: 'Sussex Inlet Golf Club',
  quote:
    'Placeholder for the club’s words about working with Riley Tech Studio. Swap this out for the real testimonial.',
};

function MapSkeleton() {
  return (
    <div style={{ position: 'relative', height: 'clamp(420px, 58vh, 640px)', overflow: 'hidden' }}>
      <Image
        src="/mapmedia/basemap.jpg"
        alt="Aerial view of the Sussex Inlet Golf Club course"
        fill
        sizes="(max-width: 1400px) 100vw, 1400px"
        style={{ objectFit: 'cover', opacity: 0.85 }}
      />
      <p
        className="glass-panel"
        style={{
          position: 'absolute',
          bottom: '0.75rem',
          left: '50%',
          transform: 'translateX(-50%)',
          whiteSpace: 'nowrap',
          borderRadius: 9999,
          padding: '0.5rem 1rem',
          fontSize: '0.75rem',
          fontWeight: 500,
          color: 'var(--color-foreground)',
          margin: 0,
        }}
      >
        Loading the interactive course&hellip;
      </p>
    </div>
  );
}

export default function FeaturedWork() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInView = useInView(mapRef, { once: true, margin: '300px 0px' });
  const mapVisible = useInView(mapRef, { margin: '300px 0px' });

  return (
    <MotionConfig reducedMotion="user">
      <section
        id="work"
        style={{
          paddingTop: 'var(--section-gap)',
          paddingBottom: 'var(--section-gap)',
          position: 'relative',
          overflow: 'hidden',
          background: '#faf9f7',
        }}
      >
        {/* fairway mowing stripes + soft green and gold light */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'repeating-linear-gradient(115deg, rgba(93,127,88,0.045) 0 90px, rgba(93,127,88,0) 90px 180px)',
            pointerEvents: 'none',
          }}
        />
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: '-140px',
            right: '6%',
            width: 560,
            height: 420,
            background: 'radial-gradient(ellipse at center, rgba(93,127,88,0.14), transparent 70%)',
            filter: 'blur(60px)',
            pointerEvents: 'none',
          }}
        />
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            bottom: '-160px',
            left: '4%',
            width: 520,
            height: 400,
            background: 'radial-gradient(ellipse at center, rgba(221,192,120,0.2), transparent 70%)',
            filter: 'blur(70px)',
            pointerEvents: 'none',
          }}
        />

        <div className="section-container" style={{ position: 'relative', zIndex: 1 }}>
          {/* compact club lockup, left aligned */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}
            className="sigc-head"
          >
            <Image
              src="/casestudy/sigc-logo.png"
              alt="Sussex Inlet Golf Club logo"
              width={92}
              height={92}
              style={{ flexShrink: 0 }}
            />
            <div style={{ minWidth: 0 }}>
              <p
                style={{
                  margin: '0 0 0.35rem',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                  color: GOLD,
                }}
              >
                Sussex Inlet Golf Club
              </p>
              <h2
                style={{
                  fontFamily: 'var(--font-sigc)',
                  fontSize: 'clamp(2.25rem, 4.5vw, 3.5rem)',
                  fontWeight: 700,
                  lineHeight: 1.02,
                  letterSpacing: '0.005em',
                  color: NAVY,
                  margin: 0,
                }}
              >
                Nine holes,{' '}
                <em style={{ color: GOLD, fontStyle: 'italic' }}>one new home.</em>
                <span className="sr-only">
                  {' '}
                  &mdash; new website and interactive 3D course map for Sussex
                  Inlet Golf Club
                </span>
              </h2>
              <p
                style={{
                  fontSize: '1rem',
                  color: 'var(--color-foreground-muted)',
                  maxWidth: '52ch',
                  margin: '0.75rem 0 0',
                }}
              >
                The club&rsquo;s full rebuild, crowned by an interactive 3D map of the course.
                Click a hole to fly it.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}
            className="card-shell"
            style={{ marginTop: '2.5rem', borderColor: 'rgba(93,127,88,0.28)' }}
          >
            <div className="card-core" style={{ position: 'relative', overflow: 'hidden' }} ref={mapRef}>
              {mapInView ? <CourseMapEmbed active={mapVisible} /> : <MapSkeleton />}
            </div>
          </motion.div>

          <div className="sigc-detail-grid" style={{ marginTop: '4rem' }}>
            {/* testimonial */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}
            >
              {TESTIMONIAL.ready && (
              <div
                style={{
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  borderTop: `2px solid ${GOLD}`,
                  borderRadius: 'var(--radius-lg)',
                  boxShadow: 'var(--shadow-lg)',
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
                      background: 'rgba(93,127,88,0.1)',
                      border: `1px solid rgba(93,127,88,0.35)`,
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
                      <User size={26} weight="duotone" color={FAIRWAY} />
                    )}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <p
                      style={{
                        fontFamily: 'var(--font-sigc)',
                        fontSize: '1.125rem',
                        lineHeight: 1.55,
                        color: NAVY,
                        fontStyle: 'italic',
                        margin: 0,
                      }}
                    >
                      &ldquo;{TESTIMONIAL.quote}&rdquo;
                    </p>
                    <p
                      style={{
                        fontSize: '0.875rem',
                        color: 'var(--color-foreground-muted)',
                        margin: '0.75rem 0 0',
                      }}
                    >
                      <strong style={{ color: NAVY }}>{TESTIMONIAL.name}</strong>
                      {' · '}
                      {TESTIMONIAL.role}
                    </p>
                  </div>
                </div>
              </div>
              )}
              <a
                href="https://sigc-five.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  marginTop: '1.25rem',
                  fontSize: '0.9375rem',
                  fontWeight: 600,
                  color: FAIRWAY,
                  textDecoration: 'none',
                }}
              >
                View the live site
                <ArrowUpRight size={16} weight="bold" />
              </a>
            </motion.div>

            {/* before / after wipe */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7, delay: 0.12, ease: [0.32, 0.72, 0, 1] }}
            >
              <BeforeAfterSlider
                beforeSrc="/casestudy/sigc-before.jpg"
                beforeAlt="The previous Sussex Inlet Golf Club website"
                afterSrc="/casestudy/sigc-after.jpg"
                afterAlt="The rebuilt Sussex Inlet Golf Club homepage"
              />
            </motion.div>
          </div>

          <p
            style={{
              textAlign: 'center',
              marginTop: '3.5rem',
              marginBottom: 0,
              fontSize: '1rem',
              color: 'var(--color-foreground-muted)',
            }}
          >
            Want something like this for your club?{' '}
            <a
              href="/#contact"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
                color: FAIRWAY,
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

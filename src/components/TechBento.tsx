'use client';

import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';

const techStack = [
  { name: 'Next.js', category: 'Framework' },
  { name: 'React', category: 'Frontend' },
  { name: 'React Native', category: 'Mobile' },
  { name: 'TypeScript', category: 'Language' },
  { name: 'Supabase', category: 'Backend' },
  { name: 'Tailwind CSS', category: 'Styling' },
  { name: 'Framer Motion', category: 'Animation' },
  { name: 'Vercel', category: 'Deploy' },
  { name: 'PostgreSQL', category: 'Database' },
  { name: 'Node.js', category: 'Runtime' },
  { name: 'Swift', category: 'iOS' },
  { name: 'AWS', category: 'Cloud' },
];

/* ── Isolated tilt card (performance-safe: uses useMotionValue, no useState) ── */
const TiltCard = React.memo(function TiltCard({
  children,
  index,
}: {
  children: React.ReactNode;
  index: number;
}) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-100, 100], [6, -6]), {
    stiffness: 200,
    damping: 25,
  });
  const rotateY = useSpring(useTransform(x, [-100, 100], [-6, 6]), {
    stiffness: 200,
    damping: 25,
  });

  function handleMouse(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set(e.clientX - rect.left - rect.width / 2);
    y.set(e.clientY - rect.top - rect.height / 2);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{
        delay: index * 0.05,
        duration: 0.5,
        ease: [0.32, 0.72, 0, 1],
      }}
      onMouseMove={handleMouse}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformPerspective: 800,
        cursor: 'default',
      }}
    >
      {children}
    </motion.div>
  );
});

/* ── Shimmer loop (isolated for performance) ── */
const ShimmerBar = React.memo(function ShimmerBar() {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        borderRadius: 'inherit',
        pointerEvents: 'none',
      }}
    >
      <motion.div
        animate={{ x: ['-100%', '200%'] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'linear', repeatDelay: 2 }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '40%',
          height: '100%',
          background:
            'linear-gradient(90deg, transparent, rgba(37, 99, 235, 0.04), transparent)',
        }}
      />
    </div>
  );
});

/* ── Live counter animation ── */
const AnimatedCounter = React.memo(function AnimatedCounter({
  value,
  suffix = '',
}: {
  value: number;
  suffix?: string;
}) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let frame: number;
    const duration = 1200;
    const start = performance.now();

    function animate(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * value));
      if (progress < 1) frame = requestAnimationFrame(animate);
    }

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [value]);

  return (
    <span>
      {display}
      {suffix}
    </span>
  );
});

export default function TechBento() {
  return (
    <section
      style={{
        paddingTop: 'var(--section-gap)',
        paddingBottom: 'var(--section-gap)',
      }}
    >
      <div className="section-container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}
          style={{ textAlign: 'center', marginBottom: '4rem' }}
        >
          <span className="eyebrow">Built With</span>
          <h2
            style={{
              marginTop: '1.25rem',
              fontSize: 'clamp(2rem, 4vw, 3.25rem)',
              fontWeight: 700,
              letterSpacing: '-0.03em',
              lineHeight: 1.1,
            }}
          >
            Production-grade stack.
            <br />
            <span style={{ color: 'var(--color-foreground-muted)' }}>
              Modern tooling.
            </span>
          </h2>
        </motion.div>

        {/* Bento Grid */}
        <div className="bento-grid">
          {/* Large feature card — Stats */}
          <TiltCard index={0}>
            <div
              className="card-shell"
              style={{ height: '100%' }}
            >
              <div
                className="card-core"
                style={{
                  padding: '2.5rem',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  position: 'relative',
                  minHeight: '220px',
                }}
              >
                <ShimmerBar />
                <div>
                  <div
                    style={{
                      fontSize: '0.6875rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      color: 'var(--color-primary)',
                      marginBottom: '0.75rem',
                    }}
                  >
                    Shipped This Year
                  </div>
                  <div
                    style={{
                      fontSize: 'clamp(3rem, 6vw, 4.5rem)',
                      fontWeight: 800,
                      fontFamily: 'var(--font-heading)',
                      letterSpacing: '-0.04em',
                      lineHeight: 1,
                      color: 'var(--color-foreground)',
                    }}
                  >
                    <AnimatedCounter value={12} suffix="+" />
                  </div>
                  <p
                    style={{
                      marginTop: '0.75rem',
                      fontSize: '0.9375rem',
                      color: 'var(--color-foreground-subtle)',
                    }}
                  >
                    Production apps and platforms delivered to real businesses.
                  </p>
                </div>
              </div>
            </div>
          </TiltCard>

          {/* Tech chips */}
          <TiltCard index={1}>
            <div className="card-shell" style={{ height: '100%' }}>
              <div
                className="card-core"
                style={{
                  padding: '2rem',
                  height: '100%',
                  position: 'relative',
                  minHeight: '220px',
                }}
              >
                <div
                  style={{
                    fontSize: '0.6875rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    color: 'var(--color-accent)',
                    marginBottom: '1.25rem',
                  }}
                >
                  Core Stack
                </div>
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '0.5rem',
                  }}
                >
                  {techStack.map((tech, i) => (
                    <motion.span
                      key={tech.name}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.03, type: 'spring', stiffness: 200, damping: 20 }}
                      whileHover={{ scale: 1.08, y: -2 }}
                      style={{
                        padding: '0.375rem 0.875rem',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        background: i % 2 === 0 ? 'var(--color-primary-ultra-light)' : '#F0F9FF',
                        color: i % 2 === 0 ? 'var(--color-primary)' : '#0EA5E9',
                        border: `1px solid ${i % 2 === 0 ? 'var(--color-primary-light)' : '#BAE6FD'}`,
                        cursor: 'default',
                      }}
                    >
                      {tech.name}
                    </motion.span>
                  ))}
                </div>
              </div>
            </div>
          </TiltCard>

          {/* Uptime */}
          <TiltCard index={2}>
            <div className="card-shell" style={{ height: '100%' }}>
              <div
                className="card-core"
                style={{
                  padding: '2rem',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  textAlign: 'center',
                  minHeight: '180px',
                  position: 'relative',
                }}
              >
                {/* Breathing dot */}
                <motion.div
                  animate={{ scale: [1, 1.3, 1], opacity: [1, 0.6, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    background: 'var(--color-success)',
                    boxShadow: '0 0 12px rgba(16, 185, 129, 0.4)',
                    marginBottom: '1rem',
                  }}
                />
                <div
                  style={{
                    fontSize: '2.5rem',
                    fontWeight: 800,
                    fontFamily: 'var(--font-heading)',
                    letterSpacing: '-0.03em',
                    color: 'var(--color-foreground)',
                  }}
                >
                  <AnimatedCounter value={99} suffix=".9%" />
                </div>
                <div
                  style={{
                    fontSize: '0.8125rem',
                    color: 'var(--color-foreground-subtle)',
                    marginTop: '0.25rem',
                    fontWeight: 600,
                  }}
                >
                  Uptime across all deployments
                </div>
              </div>
            </div>
          </TiltCard>

          {/* Response time */}
          <TiltCard index={3}>
            <div className="card-shell" style={{ height: '100%' }}>
              <div
                className="card-core"
                style={{
                  padding: '2rem',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  textAlign: 'center',
                  minHeight: '180px',
                }}
              >
                <div
                  style={{
                    fontSize: '2.5rem',
                    fontWeight: 800,
                    fontFamily: 'var(--font-heading)',
                    letterSpacing: '-0.03em',
                    color: 'var(--color-primary)',
                  }}
                >
                  &lt;24h
                </div>
                <div
                  style={{
                    fontSize: '0.8125rem',
                    color: 'var(--color-foreground-subtle)',
                    marginTop: '0.25rem',
                    fontWeight: 600,
                  }}
                >
                  Average response time
                </div>
              </div>
            </div>
          </TiltCard>
        </div>
      </div>

      <style jsx global>{`
        .bento-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1rem;
          grid-auto-flow: dense;
        }
        @media (min-width: 768px) {
          .bento-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .bento-grid > :first-child {
            grid-column: span 2;
          }
        }
        @media (min-width: 1024px) {
          .bento-grid {
            grid-template-columns: 2fr 1fr 1fr;
          }
          .bento-grid > :first-child {
            grid-column: span 1;
            grid-row: span 2;
          }
        }
      `}</style>
    </section>
  );
}

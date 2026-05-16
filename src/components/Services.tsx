'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ServiceData {
  title: string;
  description: string;
  details: string[];
  image: string;
  gradient: string;
  codeLines: string[];
  codeOffset: { top: string; left?: string; right?: string };
  bottomCode: string[];
  bottomOffset: { bottom: string; left?: string; right?: string };
}

const allServices: ServiceData[] = [
  {
    title: 'Mobile Apps',
    description:
      'Native and cross-platform apps built with React Native and Swift. Full lifecycle — concept to App Store.',
    details: ['iOS & Android', 'React Native & Swift', 'App Store optimisation', 'Push notifications'],
    image: '/whatwebuild/mobile.webp',
    gradient: 'linear-gradient(135deg, #DBEAFE 0%, #93C5FD 100%)',
    codeLines: [
      '$ npx react-native init ClientApp --template typescript',
      '✓ Installing dependencies...',
      '✓ Build succeeded — running on iPhone 15 Pro',
    ],
    codeOffset: { top: '-1rem', right: '5%' },
    bottomCode: [
      'info  Signing app with distribution cert...',
      '✓ Archive uploaded — processing on App Store Connect',
    ],
    bottomOffset: { bottom: '-2rem', left: '8%' },
  },
  {
    title: 'Web Applications',
    description:
      'High-performance web apps using Next.js, React, and modern tooling. Server-rendered, accessible, blazing fast.',
    details: ['Next.js & React', 'Server-side rendering', 'Responsive & accessible', 'Real-time features'],
    image: '/whatwebuild/webapps.jpeg',
    gradient: 'linear-gradient(135deg, #E0F2FE 0%, #7DD3FC 100%)',
    codeLines: [
      '$ next build --turbo',
      '✓ Compiled in 1.2s (348 modules)',
      '✓ Generating static pages (12/12)',
    ],
    codeOffset: { top: '0.5rem', left: '3%' },
    bottomCode: [
      'Route (app)   Size     First Load',
      '○ /           1.2 kB   87.4 kB',
    ],
    bottomOffset: { bottom: '-2.5rem', right: '6%' },
  },
  {
    title: 'SaaS Platforms',
    description:
      'End-to-end SaaS builds with auth, payments, dashboards, and multi-tenancy. Production-ready from day one.',
    details: ['Multi-tenant architecture', 'Stripe integration', 'Admin dashboards', 'Role-based access'],
    image: '/whatwebuild/saas.jpg',
    gradient: 'linear-gradient(135deg, #DBEAFE 0%, #A5B4FC 100%)',
    codeLines: [
      '$ supabase db push --linked',
      'Applying migration 20240315_add_tenants.sql...',
      '✓ Schema updated — 14 tables, 3 RLS policies',
    ],
    codeOffset: { top: '-0.5rem', right: '8%' },
    bottomCode: [
      'stripe  Ready! Webhook signing secret: whsec_••••',
      '✓ 3 events forwarded — 0 failures',
    ],
    bottomOffset: { bottom: '-1.5rem', left: '4%' },
  },
  {
    title: 'UI/UX Design',
    description:
      'Premium interfaces that convert. We design with purpose — not templates. Every pixel earns its place.',
    details: ['High-fidelity prototypes', 'Design systems', 'Interaction design', 'User testing'],
    image: '/whatwebuild/uiux.png',
    gradient: 'linear-gradient(135deg, #F0F9FF 0%, #BAE6FD 100%)',
    codeLines: [
      '$ figma-export tokens --config design.config.ts',
      'Exporting 48 tokens → ./styles/tokens.css',
      '✓ Design system synced — 0 diffs from source',
    ],
    codeOffset: { top: '1rem', left: '6%' },
    bottomCode: [
      'Exported: 12 components, 48 tokens, 6 themes',
      '✓ Storybook synced at localhost:6006',
    ],
    bottomOffset: { bottom: '-2rem', right: '3%' },
  },
  {
    title: 'Cloud & DevOps',
    description:
      'Supabase, AWS, Vercel — scalable infrastructure and CI/CD pipelines that keep your product running.',
    details: ['AWS & Vercel', 'Supabase & PostgreSQL', 'CI/CD pipelines', 'Monitoring & alerting'],
    image: '/whatwebuild/cloud&devops.avif',
    gradient: 'linear-gradient(135deg, #ECFDF5 0%, #A7F3D0 100%)',
    codeLines: [
      '$ vercel deploy --prod',
      'Deploying to https://app.client.com.au',
      '✓ Production live — 99.9% uptime SLA active',
    ],
    codeOffset: { top: '-1.5rem', right: '4%' },
    bottomCode: [
      'edge  Deployed 3 functions to ap-southeast-2',
      '✓ SSL provisioned — DNS propagation complete',
    ],
    bottomOffset: { bottom: '-2.5rem', left: '7%' },
  },
  {
    title: 'Business Websites',
    description:
      'Conversion-focused landing pages and marketing sites. SEO-optimised, mobile-first, designed to generate leads.',
    details: ['SEO-optimised', 'Lead generation', 'Analytics integration', 'Performance tuned'],
    image: '/whatwebuild/business werbsites.jpg',
    gradient: 'linear-gradient(135deg, #EFF6FF 0%, #BFDBFE 100%)',
    codeLines: [
      '$ lighthouse https://client.com.au --view',
      'Performance: 98  Accessibility: 100  SEO: 100',
      '✓ All audits passed — zero critical issues',
    ],
    codeOffset: { top: '0rem', left: '2%' },
    bottomCode: [
      'Best Practices: 96  PWA: yes  CLS: 0.01',
      '✓ Core Web Vitals — all green',
    ],
    bottomOffset: { bottom: '-1.5rem', right: '5%' },
  },
];

const leftServices = [allServices[0], allServices[2], allServices[4]];
const rightServices = [allServices[1], allServices[3], allServices[5]];

export default function Services() {
  const [active, setActive] = useState<string | null>(null);

  function toggle(title: string) {
    setActive((prev) => (prev === title ? null : title));
  }

  const activeSide: 'left' | 'right' | null = active
    ? leftServices.some((s) => s.title === active)
      ? 'left'
      : 'right'
    : null;

  return (
    <section
      id="services"
      style={{
        paddingTop: 'var(--section-gap)',
        paddingBottom: 'var(--section-gap)',
        position: 'relative',
        overflow: 'hidden',
        background: '#DCDCDD',
      }}
    >
      <div className="section-container" style={{ position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}
          style={{
            textAlign: 'center',
            fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)',
            fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
            fontWeight: 700,
            letterSpacing: '-0.03em',
            lineHeight: 1.1,
            color: 'var(--color-foreground)',
            marginBottom: '4rem',
          }}
        >
          What we build
        </motion.h2>

        {/* Three-column: left services | laptop | right services */}
        <motion.div
          className="services-scatter-grid"
          animate={{}}
          transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
          style={{ transformOrigin: 'center center' }}
        >
          {/* Left column */}
          <motion.div
            animate={{
              scale: activeSide === 'left' ? 1.04 : 1,
              x: activeSide === 'right' ? '15%' : '0%',
            }}
            transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-around',
              alignItems: 'flex-start',
              gap: '0.75rem',
              minHeight: '380px',
              transformOrigin: 'left center',
              paddingTop: '2rem',
            }}
          >
            {leftServices.map((svc, i) => (
              <ExpandableService
                key={svc.title}
                service={svc}
                isActive={active === svc.title}
                onToggle={() => toggle(svc.title)}
                delay={i * 0.1}
                fromX={-30}
                align="left"
                indent={i === 1 ? '1.5rem' : i === 2 ? '0.25rem' : '0'}
              />
            ))}
          </motion.div>

          {/* Center laptop */}
          <motion.div
            animate={{
              scale: active ? 1.06 : 1,
            }}
            transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              paddingTop: '2rem',
            }}
          >
            {/* Code overlay — opposite side of active card */}
            <AnimatePresence>
              {active && (() => {
                const svc = allServices.find((s) => s.title === active);
                if (!svc) return null;
                const isLeft = leftServices.some((s) => s.title === active);
                // Position on opposite side: left card open → code goes right, and vice versa
                const pos: React.CSSProperties = {
                  position: 'absolute',
                  top: svc.codeOffset.top,
                  zIndex: 3,
                  pointerEvents: 'none',
                  ...(isLeft
                    ? { right: svc.codeOffset.right || '5%', textAlign: 'right' as const }
                    : { left: svc.codeOffset.left || '5%', textAlign: 'left' as const }),
                };
                return (
                  <motion.div
                    key={active}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
                    style={pos}
                  >
                    {svc.codeLines.map((line, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: isLeft ? 12 : -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 + i * 0.12, duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
                        style={{
                          fontFamily: "'SF Mono', 'Fira Code', 'Consolas', monospace",
                          fontSize: '0.625rem',
                          color: i === 0 ? 'var(--color-foreground)' : 'var(--color-foreground-muted)',
                          opacity: 0.22,
                          letterSpacing: '-0.01em',
                          lineHeight: 1.8,
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {line}
                      </motion.div>
                    ))}
                  </motion.div>
                );
              })()}
            </AnimatePresence>

            <motion.img
              src="/laptopclosedfixed.png"
              alt="Closed laptop"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
              style={{
                width: '100%',
                maxWidth: '460px',
                height: 'auto',
                objectFit: 'contain',
              }}
            />

            {/* Bottom code overlay */}
            <AnimatePresence>
              {active && (() => {
                const svc = allServices.find((s) => s.title === active);
                if (!svc) return null;
                const isLeft = leftServices.some((s) => s.title === active);
                const pos: React.CSSProperties = {
                  position: 'absolute',
                  bottom: svc.bottomOffset.bottom,
                  zIndex: 3,
                  pointerEvents: 'none',
                  ...(isLeft
                    ? { left: svc.bottomOffset.left || '5%', textAlign: 'left' as const }
                    : { right: svc.bottomOffset.right || '5%', textAlign: 'right' as const }),
                };
                return (
                  <motion.div
                    key={active + '-bottom'}
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    transition={{ delay: 0.2, duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
                    style={pos}
                  >
                    {svc.bottomCode.map((line, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: isLeft ? -10 : 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + i * 0.12, duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
                        style={{
                          fontFamily: "'SF Mono', 'Fira Code', 'Consolas', monospace",
                          fontSize: '0.625rem',
                          color: 'var(--color-foreground-muted)',
                          opacity: 0.18,
                          letterSpacing: '-0.01em',
                          lineHeight: 1.8,
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {line}
                      </motion.div>
                    ))}
                  </motion.div>
                );
              })()}
            </AnimatePresence>
          </motion.div>

          {/* Right column */}
          <motion.div
            animate={{
              scale: activeSide === 'right' ? 1.04 : 1,
              x: activeSide === 'left' ? '-15%' : '0%',
            }}
            transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-around',
              alignItems: 'flex-end',
              gap: '0.75rem',
              minHeight: '380px',
              transformOrigin: 'right center',
              paddingTop: '2rem',
            }}
          >
            {rightServices.map((svc, i) => (
              <ExpandableService
                key={svc.title}
                service={svc}
                isActive={active === svc.title}
                onToggle={() => toggle(svc.title)}
                delay={i * 0.1 + 0.15}
                fromX={30}
                align="right"
                indent={i === 0 ? '1.5rem' : i === 2 ? '2rem' : '0'}
              />
            ))}
          </motion.div>
        </motion.div>
      </div>

      <style jsx global>{`
        .services-scatter-grid {
          display: grid;
          grid-template-columns: 1fr 1.2fr 1fr;
          gap: 2rem;
          align-items: start;
        }
        @media (max-width: 768px) {
          .services-scatter-grid {
            grid-template-columns: 1fr !important;
            gap: 2rem;
          }
          .services-scatter-grid > div {
            align-items: center !important;
            min-height: auto !important;
          }
        }
      `}</style>
    </section>
  );
}

/* ── Expandable service item ── */
function ExpandableService({
  service,
  isActive,
  onToggle,
  delay,
  fromX,
  align,
  indent,
}: {
  service: ServiceData;
  isActive: boolean;
  onToggle: () => void;
  delay: number;
  fromX: number;
  align: 'left' | 'right';
  indent: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: fromX }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay, duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
      layout
      style={{
        width: '100%',
        maxWidth: isActive ? '340px' : 'none',
        marginLeft: align === 'left' ? indent : 'auto',
        marginRight: align === 'right' ? indent : 'auto',
      }}
    >
      {/* Title (always visible) */}
      <motion.button
        layout="position"
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.97 }}
        onClick={onToggle}
        style={{
          fontSize: 'clamp(1rem, 1.8vw, 1.375rem)',
          fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
          fontWeight: isActive ? 700 : 500,
          color: isActive ? 'var(--color-primary)' : 'var(--color-foreground)',
          cursor: 'pointer',
          background: 'none',
          border: 'none',
          padding: '0.25rem 0',
          textAlign: align,
          width: '100%',
          transition: 'color 200ms',
          position: 'relative',
        }}
      >
        {service.title}
        {/* Underline */}
        <motion.div
          animate={{ scaleX: isActive ? 1 : 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 25 }}
          style={{
            position: 'absolute',
            bottom: 0,
            left: align === 'right' ? 'auto' : 0,
            right: align === 'right' ? 0 : 'auto',
            width: '100%',
            height: '2px',
            background: 'var(--color-primary)',
            transformOrigin: align === 'right' ? 'right' : 'left',
            borderRadius: '1px',
          }}
        />
      </motion.button>

      {/* Expanded card */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <div
              style={{
                marginTop: '0.75rem',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                background: 'var(--color-surface)',
                boxShadow: '0 12px 40px -10px rgba(15, 26, 42, 0.12)',
                border: '1px solid rgba(226, 232, 240, 0.6)',
              }}
            >
              {/* Image */}
              <div
                style={{
                  width: '100%',
                  height: '140px',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <motion.img
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.6 }}
                  src={service.image}
                  alt={service.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              </div>

              {/* Body */}
              <div style={{ padding: '1.25rem' }}>
                <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15, duration: 0.35 }}
                  style={{
                    fontSize: '0.875rem',
                    lineHeight: 1.65,
                    color: 'var(--color-foreground-muted)',
                    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                  }}
                >
                  {service.description}
                </motion.p>

                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '0.375rem',
                    marginTop: '1rem',
                  }}
                >
                  {service.details.map((d, i) => (
                    <motion.span
                      key={d}
                      initial={{ opacity: 0, scale: 0.85 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{
                        delay: 0.2 + i * 0.05,
                        type: 'spring',
                        stiffness: 200,
                        damping: 20,
                      }}
                      style={{
                        padding: '0.3rem 0.7rem',
                        borderRadius: '9999px',
                        fontSize: '0.6875rem',
                        fontWeight: 600,
                        fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                        background: 'var(--color-muted-bg)',
                        color: 'var(--color-foreground-muted)',
                        border: '1px solid var(--color-border)',
                      }}
                    >
                      {d}
                    </motion.span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

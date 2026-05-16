'use client';

import { motion } from 'framer-motion';
import { MapPin, Lightning, Users } from '@phosphor-icons/react';

const highlights = [
  {
    icon: MapPin,
    title: 'South Coast Based',
    description: 'Operating from the Shoalhaven and Illawarra — building for businesses across Australia.',
  },
  {
    icon: Lightning,
    title: 'Full-Stack Builder',
    description: 'Frontend to backend to deployment. One studio, zero handoffs, no communication gaps.',
  },
  {
    icon: Users,
    title: 'Founder-Led',
    description: 'You work directly with the person writing the code. No account managers, no layers.',
  },
];

export default function About() {
  return (
    <section
      id="about"
      style={{
        paddingTop: 'var(--section-gap)',
        paddingBottom: 'var(--section-gap)',
      }}
    >
      <div className="section-container">
        <div className="about-layout">
          {/* Left — Story */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}
          >
            <span className="eyebrow">About</span>
            <h2
              style={{
                marginTop: '1.25rem',
                fontSize: 'clamp(2rem, 4vw, 3.25rem)',
                fontWeight: 700,
                letterSpacing: '-0.03em',
                lineHeight: 1.1,
              }}
            >
              Not an agency.
              <br />
              <span style={{ color: 'var(--color-foreground-muted)' }}>
                A builder.
              </span>
            </h2>

            <div
              style={{
                marginTop: '2rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.25rem',
              }}
            >
              <p
                style={{
                  fontSize: '1.0625rem',
                  lineHeight: 1.7,
                  color: 'var(--color-foreground-muted)',
                }}
              >
                Riley Tech Studio is a one-person software studio based on the
                South Coast of Australia. I build apps, SaaS platforms, custom
                software, and high-converting websites for businesses that need
                real technology — not just a pretty homepage.
              </p>
              <p
                style={{
                  fontSize: '1.0625rem',
                  lineHeight: 1.7,
                  color: 'var(--color-foreground-muted)',
                }}
              >
                Every project I take on gets my full attention. I write the code,
                design the interfaces, configure the infrastructure, and stick
                around after launch. The businesses I work with get a product
                that works — not a handoff and a goodbye.
              </p>
            </div>
          </motion.div>

          {/* Right — Highlight cards */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
            }}
          >
            {highlights.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{
                  delay: i * 0.1,
                  duration: 0.6,
                  ease: [0.32, 0.72, 0, 1],
                }}
                whileHover={{ x: -4 }}
                className="card-shell"
              >
                <div className="card-core" style={{ padding: '1.75rem 2rem' }}>
                  <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
                    <div
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: 'var(--radius-md)',
                        background: i === 0 ? 'var(--color-primary-light)' : i === 1 ? '#E0F2FE' : 'var(--color-primary-ultra-light)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <item.icon
                        size={22}
                        weight="duotone"
                        color={i === 1 ? '#0EA5E9' : 'var(--color-primary)'}
                      />
                    </div>
                    <div>
                      <h3
                        style={{
                          fontSize: '1.0625rem',
                          fontWeight: 700,
                          fontFamily: 'var(--font-heading)',
                          letterSpacing: '-0.02em',
                          color: 'var(--color-foreground)',
                        }}
                      >
                        {item.title}
                      </h3>
                      <p
                        style={{
                          marginTop: '0.375rem',
                          fontSize: '0.9375rem',
                          lineHeight: 1.6,
                          color: 'var(--color-foreground-muted)',
                        }}
                      >
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <style jsx global>{`
        .about-layout {
          display: grid;
          grid-template-columns: 1fr;
          gap: 3rem;
          align-items: start;
        }
        @media (min-width: 768px) {
          .about-layout {
            grid-template-columns: 1fr 1fr;
            gap: 4rem;
          }
        }
      `}</style>
    </section>
  );
}

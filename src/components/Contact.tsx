'use client';

import { motion } from 'framer-motion';
import {
  ArrowRight,
  Envelope,
  Phone,
  MapPin,
  Clock,
} from '@phosphor-icons/react';

export default function Contact() {
  return (
    <section
      id="contact"
      style={{
        paddingTop: 'var(--section-gap)',
        paddingBottom: 'var(--section-gap)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Gradient accent */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '50%',
          background:
            'radial-gradient(ellipse 80% 100% at 50% 100%, rgba(219, 234, 254, 0.4), transparent)',
          pointerEvents: 'none',
        }}
      />

      <div className="section-container" style={{ position: 'relative', zIndex: 1 }}>
        <div className="contact-layout">
          {/* Left — CTA */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}
          >
            <span className="eyebrow">Get in Touch</span>
            <h2
              style={{
                marginTop: '1.25rem',
                fontSize: 'clamp(2rem, 4vw, 3.25rem)',
                fontWeight: 700,
                letterSpacing: '-0.03em',
                lineHeight: 1.1,
              }}
            >
              Ready to build
              <br />
              <span
                style={{
                  background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                something real?
              </span>
            </h2>

            <p
              style={{
                marginTop: '1.5rem',
                fontSize: '1.0625rem',
                lineHeight: 1.7,
                color: 'var(--color-foreground-muted)',
                maxWidth: '45ch',
              }}
            >
              Whether it's a new app, a SaaS platform, or a website that
              converts — reach out and let's talk scope.
            </p>

          </motion.div>

          {/* Right — Info cards */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
            }}
          >
            {[
              {
                icon: Envelope,
                label: 'Email',
                value: 'contactrileykennedy@gmail.com',
                href: 'mailto:contactrileykennedy@gmail.com',
              },
              {
                icon: Phone,
                label: 'Phone',
                value: '0499 545 069',
                href: 'tel:+61499545069',
              },
              {
                icon: MapPin,
                label: 'Location',
                value: 'Shoalhaven & Illawarra, NSW, Australia',
              },
              {
                icon: Clock,
                label: 'Response Time',
                value: 'Within 24 hours',
              },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{
                  delay: i * 0.1,
                  duration: 0.6,
                  ease: [0.32, 0.72, 0, 1],
                }}
                className="card-shell"
              >
                <div className="card-core" style={{ padding: '1.5rem 1.75rem' }}>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: 'var(--radius-sm)',
                        background: 'var(--color-primary-ultra-light)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <item.icon
                        size={20}
                        weight="duotone"
                        color="var(--color-primary)"
                      />
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: '0.6875rem',
                          fontWeight: 600,
                          textTransform: 'uppercase',
                          letterSpacing: '0.08em',
                          color: 'var(--color-foreground-subtle)',
                          marginBottom: '0.125rem',
                        }}
                      >
                        {item.label}
                      </div>
                      {item.href ? (
                        <a
                          href={item.href}
                          style={{
                            fontSize: '0.9375rem',
                            fontWeight: 600,
                            color: 'var(--color-primary)',
                            textDecoration: 'none',
                          }}
                        >
                          {item.value}
                        </a>
                      ) : (
                        <div
                          style={{
                            fontSize: '0.9375rem',
                            fontWeight: 600,
                            color: 'var(--color-foreground)',
                          }}
                        >
                          {item.value}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <style jsx global>{`
        .contact-layout {
          display: grid;
          grid-template-columns: 1fr;
          gap: 3rem;
          align-items: start;
        }
        @media (min-width: 768px) {
          .contact-layout {
            grid-template-columns: 1fr 1fr;
            gap: 4rem;
          }
        }
      `}</style>
    </section>
  );
}

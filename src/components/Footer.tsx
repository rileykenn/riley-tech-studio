'use client';

import { motion } from 'framer-motion';
import { Heart } from '@phosphor-icons/react';
import Image from 'next/image';

const footerLinks = [
  {
    title: 'Services',
    links: [
      { label: 'Mobile Apps', href: '#services' },
      { label: 'Web Applications', href: '#services' },
      { label: 'SaaS Platforms', href: '#services' },
      { label: 'UI/UX Design', href: '#services' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '#about' },
      { label: 'Work', href: '#work' },
      { label: 'Process', href: '#process' },
      { label: 'Contact', href: '#contact' },
    ],
  },
];

export default function Footer() {
  return (
    <footer
      style={{
        borderTop: '1px solid var(--color-border)',
        paddingTop: '4rem',
        paddingBottom: '2rem',
        background: 'var(--color-surface)',
      }}
    >
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="footer-grid"
        >
          {/* Brand */}
          <div style={{ maxWidth: '280px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '1rem' }}>
              <Image
                src="/rts-logo-black.webp"
                alt="Riley Tech Studio"
                width={28}
                height={28}
                style={{ borderRadius: '6px' }}
              />
              <span
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 700,
                  fontSize: '0.9375rem',
                  color: 'var(--color-foreground)',
                  letterSpacing: '-0.02em',
                }}
              >
                Riley Tech Studio
              </span>
            </div>
            <p
              style={{
                fontSize: '0.875rem',
                lineHeight: 1.6,
                color: 'var(--color-foreground-subtle)',
              }}
            >
              Australian software studio building production-grade apps, SaaS, and custom software from the South Coast.
            </p>
          </div>

          {/* Link columns */}
          {footerLinks.map((group) => (
            <div key={group.title}>
              <div
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: 'var(--color-foreground)',
                  marginBottom: '1rem',
                  fontFamily: 'var(--font-heading)',
                }}
              >
                {group.title}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                {group.links.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    style={{
                      fontSize: '0.875rem',
                      color: 'var(--color-foreground-subtle)',
                      textDecoration: 'none',
                      transition: 'color 200ms',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = 'var(--color-primary)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = 'var(--color-foreground-subtle)';
                    }}
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Divider */}
        <div
          style={{
            marginTop: '3rem',
            paddingTop: '1.5rem',
            borderTop: '1px solid var(--color-border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <span
            style={{
              fontSize: '0.8125rem',
              color: 'var(--color-foreground-subtle)',
            }}
          >
            {new Date().getFullYear()} Riley Tech Studio. All rights reserved.
          </span>

          <span
            style={{
              fontSize: '0.8125rem',
              color: 'var(--color-foreground-subtle)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.375rem',
            }}
          >
            Built by Riley Tech Studio on the South Coast
          </span>
        </div>
      </div>

      <style jsx global>{`
        .footer-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2.5rem;
        }
        @media (min-width: 640px) {
          .footer-grid {
            grid-template-columns: 1.5fr 1fr 1fr;
            gap: 4rem;
          }
        }
      `}</style>
    </footer>
  );
}

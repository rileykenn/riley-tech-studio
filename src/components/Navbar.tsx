'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { List, X } from '@phosphor-icons/react';
import Image from 'next/image';
import Link from 'next/link';

// Flat, full-width fixed bar: paper background, hairline bottom border,
// always visible. No floating pill, no glass, no hide-on-scroll.

const navLinks = [
  { label: 'Work', href: '/#work' },
  { label: 'About', href: '/about' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/#contact' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-40"
        style={{
          background: 'var(--color-background)',
          borderBottom: '1px solid var(--color-border)',
        }}
      >
        <div
          className="section-container"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '2rem',
            height: '64px',
          }}
        >
          {/* Logo */}
          <Link
            href="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.625rem',
              textDecoration: 'none',
            }}
          >
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
          </Link>

          {/* Desktop Links */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1.75rem',
            }}
            className="desktop-nav"
          >
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                style={{
                  fontSize: '0.9375rem',
                  fontWeight: 500,
                  color: 'var(--color-foreground-muted)',
                  textDecoration: 'none',
                  transition: 'color 150ms ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--color-foreground)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--color-foreground-muted)';
                }}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Phone + CTA */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <a
              href="tel:+61499545069"
              className="nav-phone"
              style={{
                fontSize: '0.875rem',
                fontWeight: 600,
                color: 'var(--color-foreground)',
                textDecoration: 'none',
                whiteSpace: 'nowrap',
              }}
            >
              0499 545 069
            </a>
            <Link
              href="/#contact"
              className="nav-cta btn-primary"
              style={{
                padding: '0.5rem 1.125rem',
                fontSize: '0.875rem',
                whiteSpace: 'nowrap',
              }}
            >
              Get My Free Quote
            </Link>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="mobile-menu-btn"
              aria-label="Toggle menu"
              style={{
                display: 'none',
                width: '40px',
                height: '40px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--color-border)',
                background: 'var(--color-surface)',
                cursor: 'pointer',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {isOpen ? (
                <X size={20} weight="bold" color="var(--color-foreground)" />
              ) : (
                <List size={20} weight="bold" color="var(--color-foreground)" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 39,
              background: 'var(--color-background)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1.5rem',
            }}
          >
            {navLinks.map((link, i) => (
              <motion.a
                key={link.label}
                href={link.href}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{
                  delay: i * 0.05,
                  duration: 0.4,
                  ease: [0.32, 0.72, 0, 1],
                }}
                onClick={() => setIsOpen(false)}
                style={{
                  fontSize: '1.75rem',
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 600,
                  color: 'var(--color-foreground)',
                  textDecoration: 'none',
                  letterSpacing: '-0.02em',
                }}
              >
                {link.label}
              </motion.a>
            ))}
            <motion.a
              href="tel:+61499545069"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ delay: navLinks.length * 0.05, duration: 0.4 }}
              onClick={() => setIsOpen(false)}
              style={{
                fontSize: '1.125rem',
                fontFamily: 'var(--font-heading)',
                fontWeight: 600,
                color: 'var(--color-foreground)',
                textDecoration: 'none',
              }}
            >
              Call or text 0499 545 069
            </motion.a>
            <motion.a
              href="/#contact"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ delay: (navLinks.length + 1) * 0.05, duration: 0.4 }}
              onClick={() => setIsOpen(false)}
              className="btn-primary"
              style={{ marginTop: '0.5rem' }}
            >
              Get My Free Quote
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .nav-cta { display: none !important; }
          .nav-phone { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
        @media (min-width: 769px) and (max-width: 1020px) {
          .nav-phone { display: none !important; }
        }
      `}</style>
    </>
  );
}

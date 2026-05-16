'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValueEvent, useScroll } from 'framer-motion';
import { List, X } from '@phosphor-icons/react';
import Image from 'next/image';

const navLinks = [
  { label: 'Work', href: '/#work' },
  { label: 'Services', href: '/#services' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/#contact' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const { scrollY } = useScroll();
  const lastY = useRef(0);

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setScrolled(latest > 50);

    // Only hide/show after scrolling past the hero
    if (latest < 100) {
      setHidden(false);
    } else if (latest > lastY.current && latest - lastY.current > 5) {
      setHidden(true); // scrolling down
    } else if (lastY.current > latest && lastY.current - latest > 5) {
      setHidden(false); // scrolling up
    }
    lastY.current = latest;
  });

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
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: hidden && !isOpen ? -100 : 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
        className="fixed top-0 left-0 right-0 z-40"
        style={{ padding: scrolled ? '0.75rem 0' : '1.25rem 0' }}
      >
        <div
          className="section-container"
          style={{ display: 'flex', justifyContent: 'center' }}
        >
          <motion.div
            layout
            className="glass-panel"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '2rem',
              padding: '0.625rem 1.5rem',
              borderRadius: '9999px',
              width: '100%',
              maxWidth: '860px',
              transition: 'all 500ms cubic-bezier(0.32, 0.72, 0, 1)',
              boxShadow: scrolled
                ? '0 8px 32px rgba(15, 26, 42, 0.08)'
                : '0 4px 12px rgba(15, 26, 42, 0.04)',
            }}
          >
            {/* Logo */}
            <a
              href="/"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.625rem',
                textDecoration: 'none',
              }}
            >
              <Image
                src="/RTS logo black.png"
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
            </a>

            {/* Desktop Links */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
              }}
              className="desktop-nav"
            >
              {navLinks.map((link) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    padding: '0.5rem 0.875rem',
                    borderRadius: '9999px',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    color: 'var(--color-foreground-muted)',
                    textDecoration: 'none',
                    transition: 'color 200ms, background 200ms',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'var(--color-foreground)';
                    e.currentTarget.style.background = 'var(--color-muted-bg)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'var(--color-foreground-muted)';
                    e.currentTarget.style.background = 'transparent';
                  }}
                >
                  {link.label}
                </motion.a>
              ))}
            </div>

            {/* CTA */}
            <motion.a
              href="/#contact"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="nav-cta"
              style={{
                padding: '0.5rem 1.25rem',
                borderRadius: '9999px',
                fontSize: '0.8125rem',
                fontWeight: 600,
                background: 'var(--color-primary)',
                color: 'white',
                textDecoration: 'none',
                transition: 'all 300ms cubic-bezier(0.32, 0.72, 0, 1)',
              }}
            >
              Start a Project
            </motion.a>

            {/* Mobile Hamburger */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsOpen(!isOpen)}
              className="mobile-menu-btn"
              aria-label="Toggle menu"
              style={{
                display: 'none',
                width: '40px',
                height: '40px',
                borderRadius: '10px',
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
            </motion.button>
          </motion.div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 39,
              background: 'rgba(255, 255, 255, 0.92)',
              backdropFilter: 'blur(40px) saturate(180%)',
              WebkitBackdropFilter: 'blur(40px) saturate(180%)',
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
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 12 }}
                transition={{
                  delay: i * 0.06,
                  duration: 0.5,
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
              href="/#contact"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ delay: navLinks.length * 0.06, duration: 0.5 }}
              onClick={() => setIsOpen(false)}
              className="btn-primary"
              style={{ marginTop: '1rem' }}
            >
              Start a Project
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .nav-cta { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </>
  );
}

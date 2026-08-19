'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

// Mobile-only sticky CTA: appears once the hero has scrolled away, hides
// again when the contact form is on screen so it never covers the thing it
// links to. IntersectionObserver only - no scroll listeners.

export default function StickyQuoteBar() {
  const [heroGone, setHeroGone] = useState(false);
  const [contactNear, setContactNear] = useState(false);

  useEffect(() => {
    const hero = document.getElementById('hero');
    const contact = document.getElementById('contact');
    if (!hero || !contact) return;

    const heroObserver = new IntersectionObserver(
      ([entry]) => setHeroGone(!entry.isIntersecting),
      { threshold: 0 }
    );
    const contactObserver = new IntersectionObserver(
      ([entry]) =>
        setContactNear(
          entry.isIntersecting || entry.boundingClientRect.top < 0
        ),
      { threshold: 0 }
    );
    heroObserver.observe(hero);
    contactObserver.observe(contact);
    return () => {
      heroObserver.disconnect();
      contactObserver.disconnect();
    };
  }, []);

  const visible = heroGone && !contactNear;

  return (
    <div
      className="sticky-quote-bar"
      style={{
        transform: visible ? 'translateY(0)' : 'translateY(110%)',
      }}
      aria-hidden={!visible}
    >
      <Link
        href="/#contact"
        className="btn-primary"
        style={{ width: '100%', justifyContent: 'center' }}
        tabIndex={visible ? 0 : -1}
      >
        Get My Free Quote
      </Link>
    </div>
  );
}

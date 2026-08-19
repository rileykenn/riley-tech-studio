'use client';

import { motion } from 'framer-motion';
import { FlowArrow, Browser, CalendarCheck } from '@phosphor-icons/react';

// Software leads, websites are the regional trust wedge. Every card anchors
// on a real, checkable build.

const OFFERS = [
  {
    icon: FlowArrow,
    title: 'Custom software',
    body: 'Scheduling, rosters, quoting, payroll, client portals. When off-the-shelf tools don’t fit how your business runs, we build the system that does. CleanRoute Pro below runs a cleaning company’s whole operation.',
    tinted: true,
    wide: true,
  },
  {
    icon: Browser,
    title: 'Websites',
    body: 'Fast, modern sites for cafes, clubs, trades and venues across the Shoalhaven & Illawarra, like Sussex Inlet Golf Club’s. Built to get found on Google.',
    tinted: false,
    wide: false,
  },
  {
    icon: CalendarCheck,
    title: 'Bookings & ordering',
    body: 'Table bookings, quote requests and online orders straight from your website. Stone Grill Huskisson takes bookings on one of ours.',
    tinted: false,
    wide: false,
  },
];

export default function Services() {
  return (
    <section
      id="services"
      style={{
        paddingTop: 'var(--section-gap)',
        paddingBottom: 'var(--section-gap)',
      }}
    >
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
          style={{ maxWidth: '620px' }}
        >
          <h2
            style={{
              fontSize: 'clamp(1.875rem, 3.4vw, 2.75rem)',
              fontWeight: 700,
              letterSpacing: '-0.025em',
            }}
          >
            What we build
          </h2>
          <p style={{ marginTop: '1rem', fontSize: '1.0625rem', lineHeight: 1.7 }}>
            Your customers are Googling you. What they find decides whether
            they call you or the next result down.
          </p>
        </motion.div>

        <div className="services-grid">
          {OFFERS.map((offer, i) => (
            <motion.div
              key={offer.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{
                delay: i * 0.07,
                duration: 0.6,
                ease: [0.32, 0.72, 0, 1],
              }}
              style={{
                padding: offer.wide ? '2rem 1.75rem' : '1.75rem',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--color-border)',
                background: 'var(--color-surface)',
                borderLeft: offer.wide ? '3px solid var(--color-primary)' : undefined,
                gridColumn: offer.wide ? '1 / -1' : undefined,
              }}
            >
              <offer.icon size={28} weight="duotone" color="var(--color-primary)" />
              <h3
                style={{
                  marginTop: '1rem',
                  fontSize: offer.wide ? '1.375rem' : '1.1875rem',
                  fontWeight: 600,
                  letterSpacing: '-0.015em',
                }}
              >
                {offer.title}
              </h3>
              <p
                style={{
                  marginTop: '0.5rem',
                  fontSize: '0.9375rem',
                  lineHeight: 1.65,
                  maxWidth: offer.wide ? '62ch' : undefined,
                }}
              >
                {offer.body}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

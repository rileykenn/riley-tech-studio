'use client';

import { motion } from 'framer-motion';
import { ArrowUpRight, Star, User } from '@phosphor-icons/react';
import ScheduleDemo from './cleanroute/ScheduleDemo';

// Sarah's Google review, posted in full — house rule: client reviews are
// never trimmed without Riley's sign-off.
const TESTIMONIAL = {
  ready: true,
  avatarSrc: '/casestudy/sarah-pfp.jpg' as string | null,
  name: 'Sarah',
  role: 'Owner, The Cleaning Co Shellharbour · via Google review',
  quote: [
    'I run a growing cleaning business with multiple teams travelling between jobs each day, and as the business grew, scheduling and administration became increasingly difficult to manage. I was using different systems for scheduling, travel, staff hours and payroll, with a lot of manual work involved.',
    'Riley built CleanRoute Pro specifically around the way my business operates. It manages our teams and daily schedules, calculates travel between jobs, allows us to save and reuse our rotating schedules, tracks staff hours for payroll and includes a customised checklist and form system linked directly to our clients and bookings.',
    'The development process was quite involved and there were definitely some challenges along the way, particularly given how customised the system became, but Riley continued working through the issues and changes needed to get the functionality right.',
    'The biggest benefit is having so many of our operational processes brought together into one system rather than trying to piece everything together manually across multiple platforms. As we move fully onto CleanRoute Pro, I expect it to significantly reduce the amount of administration involved in managing our teams each week.',
    'I’d recommend custom software like this to service-based businesses that have outgrown generic scheduling programs and need something built around the way their business actually operates.',
  ],
};

export default function CleanRouteShowcase() {
  return (
    <section
      id="work"
      style={{
        paddingTop: 'var(--section-gap)',
        paddingBottom: 'var(--section-gap)',
        position: 'relative',
        overflow: 'hidden',
        background: 'var(--color-background-alt)',
      }}
    >
      {/* route-themed backdrop: faint dashed travel paths with waypoints */}
      <svg
        aria-hidden="true"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
      >
        <g
          fill="none"
          stroke="var(--color-primary)"
          strokeWidth="2.5"
          strokeDasharray="2 10"
          strokeLinecap="round"
          opacity="0.2"
        >
          {/* entry route: drops out from under the hero's blue client bar
              and sweeps toward the section heading, guiding the eye down */}
          <path
            className="crp-bg-route"
            style={{ animationDuration: '18s' }}
            d="M 900 -30 C 880 150, 520 210, 440 380 S 300 520, 280 600"
          />
          <path className="crp-bg-route" d="M -40 170 C 300 70, 520 250, 820 150 S 1300 230, 1500 110" />
          <path
            className="crp-bg-route"
            style={{ animationDuration: '16s' }}
            d="M -60 730 C 260 650, 560 830, 900 710 S 1320 630, 1520 750"
          />
          <path
            className="crp-bg-route"
            style={{ animationDuration: '20s' }}
            d="M 1180 -30 C 1120 180, 1360 340, 1240 560"
          />
        </g>
        <g fill="var(--color-primary)" opacity="0.28">
          <circle className="crp-bg-dot" style={{ animationDelay: '-2.6s' }} cx="893" cy="55" r="5" />
          <circle className="crp-bg-dot" style={{ animationDelay: '-1.5s' }} cx="452" cy="360" r="5" />
          <circle className="crp-bg-dot" cx="300" cy="122" r="5" />
          <circle className="crp-bg-dot" style={{ animationDelay: '-1.2s' }} cx="820" cy="150" r="5" />
          <circle className="crp-bg-dot" style={{ animationDelay: '-2.3s' }} cx="1210" cy="186" r="5" />
          <circle className="crp-bg-dot" style={{ animationDelay: '-0.6s' }} cx="260" cy="666" r="5" />
          <circle className="crp-bg-dot" style={{ animationDelay: '-1.8s' }} cx="900" cy="710" r="5" />
          <circle className="crp-bg-dot" style={{ animationDelay: '-2.9s' }} cx="1287" cy="252" r="5" />
        </g>
        <g fill="none" stroke="var(--color-primary)" opacity="0.3" strokeWidth="2">
          <circle className="crp-bg-ping" cx="893" cy="55" r="10" />
          <circle className="crp-bg-ping" cx="300" cy="122" r="10" />
          <circle className="crp-bg-ping" style={{ animationDelay: '-1.7s' }} cx="900" cy="710" r="10" />
        </g>
      </svg>

      <div className="section-container" style={{ position: 'relative', zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}
          className="eyebrow"
          style={{ marginBottom: '1rem' }}
        >
          CleanRoute Pro &mdash; custom build
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7, delay: 0.05, ease: [0.32, 0.72, 0, 1] }}
          style={{
            fontSize: 'clamp(2.25rem, 4.5vw, 3.5rem)',
            fontFamily: 'var(--font-heading)',
            fontWeight: 700,
            letterSpacing: '-0.03em',
            lineHeight: 1.05,
            color: 'var(--color-foreground)',
            marginBottom: '1.25rem',
            maxWidth: '22ch',
          }}
        >
          The software that runs
          <br />
          <span
            style={{
              background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            The Cleaning Co Shellharbour.
          </span>
          <span className="sr-only">
            {' '}
            &mdash; custom scheduling and run-sheet software with live routes,
            payroll and client reports, built for a cleaning company
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.32, 0.72, 0, 1] }}
          style={{
            fontSize: '1.0625rem',
            lineHeight: 1.65,
            color: 'var(--color-foreground-muted)',
            maxWidth: '52ch',
            margin: '0 0 3.5rem',
          }}
        >
          Custom software running their whole operation: schedules with live Google routes,
          payroll, and checklist reports sent to their clients. Below is a working slice of
          their scheduler.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}
        >
          <ScheduleDemo
            aside={
              <div
                style={{
                  background: 'var(--color-surface)',
                  border: '1px solid #E5E7EB',
                  borderRadius: 18,
                  boxShadow: '0 14px 40px rgba(17,24,39,0.08)',
                  padding: '2rem',
                }}
              >
                {TESTIMONIAL.ready ? (
                <div style={{ position: 'relative' }}>
                  {/* oversized quote glyph anchoring the card */}
                  <span
                    aria-hidden="true"
                    style={{
                      display: 'block',
                      fontFamily: 'Georgia, "Times New Roman", serif',
                      fontSize: '4.5rem',
                      lineHeight: 0.6,
                      color: 'var(--color-primary-light)',
                      userSelect: 'none',
                      marginBottom: '0.75rem',
                    }}
                  >
                    &ldquo;
                  </span>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      marginBottom: '1.25rem',
                    }}
                  >
                    <div
                      style={{
                        flexShrink: 0,
                        width: 56,
                        height: 56,
                        borderRadius: '50%',
                        background: 'var(--color-primary-ultra-light)',
                        border: '1px solid var(--color-primary-light)',
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
                        <User size={26} weight="duotone" color="var(--color-primary)" />
                      )}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div
                        role="img"
                        aria-label="Rated 5 out of 5 stars"
                        style={{ display: 'flex', gap: '2px', marginBottom: '0.25rem' }}
                      >
                        {[0, 1, 2, 3, 4].map((i) => (
                          <Star key={i} size={16} weight="fill" color="#F5A623" />
                        ))}
                      </div>
                      <p
                        style={{
                          fontSize: '0.875rem',
                          color: 'var(--color-foreground-muted)',
                          margin: 0,
                        }}
                      >
                        <strong style={{ color: 'var(--color-foreground)' }}>{TESTIMONIAL.name}</strong>
                        {' · '}
                        {TESTIMONIAL.role}
                      </p>
                    </div>
                  </div>

                  <div style={{ minWidth: 0 }}>
                    {TESTIMONIAL.quote.map((para, i) => (
                      <p
                        key={i}
                        style={{
                          fontSize: '1.0625rem',
                          lineHeight: 1.65,
                          color: 'var(--color-foreground)',
                          fontStyle: 'italic',
                          margin: i === 0 ? 0 : '0.875rem 0 0',
                          maxWidth: '52ch',
                        }}
                      >
                        {i === 0 && <>&ldquo;</>}
                        {para}
                        {i === TESTIMONIAL.quote.length - 1 && <>&rdquo;</>}
                      </p>
                    ))}
                    <a
                      href="https://cleanroutepro.com.au"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        marginTop: '1rem',
                        fontSize: '0.9375rem',
                        fontWeight: 600,
                        color: 'var(--color-primary)',
                        textDecoration: 'none',
                      }}
                    >
                      Visit cleanroutepro.com.au
                      <ArrowUpRight size={16} weight="bold" />
                    </a>
                  </div>
                </div>
                ) : (
                  <a
                    href="https://cleanroutepro.com.au"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      fontSize: '0.9375rem',
                      fontWeight: 600,
                      color: 'var(--color-primary)',
                      textDecoration: 'none',
                    }}
                  >
                    Visit cleanroutepro.com.au
                    <ArrowUpRight size={16} weight="bold" />
                  </a>
                )}
              </div>
            }
          />
        </motion.div>

        <p
          style={{
            textAlign: 'center',
            fontSize: '0.875rem',
            color: 'var(--color-foreground-subtle)',
            maxWidth: '58ch',
            margin: '1.25rem auto 0',
          }}
        >
          That was a whole day planned: real routes, drive times, wages and profit, in seconds.
          The full app adds live traffic, photo checklists, branded client reports and payroll
          exports.
        </p>

        <p
          style={{
            textAlign: 'center',
            marginTop: '2.5rem',
            marginBottom: 0,
            fontSize: '1rem',
            color: 'var(--color-foreground-muted)',
          }}
        >
          Want software that runs your business like this?{' '}
          <a
            href="/#contact"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem',
              color: 'var(--color-primary)',
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
  );
}

'use client';

import { motion } from 'framer-motion';
import {
  ChatCircleDots,
  PencilSimpleLine,
  Code,
  Rocket,
  Headset,
} from '@phosphor-icons/react';

const steps = [
  {
    icon: ChatCircleDots,
    number: '01',
    title: 'Discovery',
    description:
      'We dig into your goals, audience, and constraints. No fluff — just honest questions to build the right thing.',
  },
  {
    icon: PencilSimpleLine,
    number: '02',
    title: 'Design',
    description:
      'High-fidelity wireframes and prototypes. You see exactly what you\'re getting before a single line of code.',
  },
  {
    icon: Code,
    number: '03',
    title: 'Build',
    description:
      'Production-grade code from the start. TypeScript, tested, and built on infrastructure that scales.',
  },
  {
    icon: Rocket,
    number: '04',
    title: 'Launch',
    description:
      'Deployed, monitored, and optimised. We don\'t hand off half-done work — you get a running product.',
  },
  {
    icon: Headset,
    number: '05',
    title: 'Support',
    description:
      'Ongoing maintenance, feature additions, and performance tuning. We stick around.',
  },
];

export default function Process() {
  return (
    <section
      id="process"
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
          style={{
            marginBottom: '3rem',
          }}
        >
          <span className="eyebrow">How We Work</span>
          <h2
            style={{
              marginTop: '1.25rem',
              fontSize: 'clamp(2rem, 4vw, 3.25rem)',
              fontWeight: 700,
              letterSpacing: '-0.03em',
              lineHeight: 1.1,
            }}
          >
            Straightforward process.
            <br />
            <span style={{ color: 'var(--color-foreground-muted)' }}>
              Predictable outcomes.
            </span>
          </h2>
        </motion.div>

        {/* Wide cards grid */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{
                delay: i * 0.08,
                duration: 0.5,
                ease: [0.32, 0.72, 0, 1],
              }}
              whileHover={{ x: 4 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1.5rem',
                padding: '1.5rem 2rem',
                borderRadius: 'var(--radius-lg)',
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                transition: 'box-shadow 250ms',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-md)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = 'none';
              }}
            >
              {/* Icon */}
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: 'var(--radius-md)',
                  background: i % 2 === 0 ? 'var(--color-primary-light)' : '#E0F2FE',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <step.icon
                  size={22}
                  weight="duotone"
                  color={i % 2 === 0 ? 'var(--color-primary)' : '#0EA5E9'}
                />
              </div>

              {/* Step number */}
              <span
                style={{
                  fontSize: '0.6875rem',
                  fontWeight: 700,
                  color: 'var(--color-foreground-subtle)',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  fontFamily: "'SF Mono', 'Fira Code', monospace",
                  minWidth: '2rem',
                  flexShrink: 0,
                }}
              >
                {step.number}
              </span>

              {/* Title */}
              <h3
                style={{
                  fontSize: '1.125rem',
                  fontWeight: 700,
                  fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                  letterSpacing: '-0.02em',
                  color: 'var(--color-foreground)',
                  minWidth: '7rem',
                  flexShrink: 0,
                }}
              >
                {step.title}
              </h3>

              {/* Description */}
              <p
                style={{
                  fontSize: '0.9375rem',
                  lineHeight: 1.6,
                  color: 'var(--color-foreground-muted)',
                  flex: 1,
                }}
              >
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

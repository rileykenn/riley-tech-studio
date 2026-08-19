'use client';

import { useEffect, useRef, useState } from 'react';
import { useInView, useReducedMotion } from 'framer-motion';
import BrandMark from './cleanroute/BrandMark';
import {
  DEMO_CLIENTS,
  DEMO_STAFF,
  fmtMin,
  fmtMoney,
  routeLegs,
  runSummary,
} from './cleanroute/demoData';

// A compact, working slice of CleanRoute Pro for the hero: three demo jobs
// get assigned onto a run while the route draws on the mini map, using the
// same schedule math as the full demo further down the page. Autoplays while
// in view; clicking a row assigns it immediately. Demo data only.

const JOBS = [DEMO_CLIENTS[0], DEMO_CLIENTS[2], DEMO_CLIENTS[5]];
const CREW = [DEMO_STAFF[0], DEMO_STAFF[1]];

// mini-map geometry: base then one pin per job, left to right
const PINS = [
  { x: 44, y: 130 },
  { x: 152, y: 52 },
  { x: 238, y: 110 },
  { x: 344, y: 46 },
];
const SEGMENTS = [
  'M 44 130 C 82 72, 112 62, 152 52',
  'M 152 52 C 192 70, 207 102, 238 110',
  'M 238 110 C 277 102, 312 62, 344 46',
];
const CRP_INDIGO = '#4F46E5';

export default function HeroSoftwareDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.35 });
  const reduce = useReducedMotion();
  const [assigned, setAssigned] = useState(0);

  useEffect(() => {
    if (reduce || !inView) return;
    const delay = assigned === 0 ? 1100 : assigned < JOBS.length ? 1700 : 3400;
    const t = setTimeout(() => {
      setAssigned((n) => (n >= JOBS.length ? 0 : n + 1));
    }, delay);
    return () => clearTimeout(t);
  }, [assigned, inView, reduce]);

  // under reduced motion the widget rests on the fully-assigned frame
  const shown = reduce ? JOBS.length : assigned;
  const run = JOBS.slice(0, shown);
  const summary = runSummary(run, CREW, run.length ? routeLegs(run) : undefined);

  return (
    <div ref={ref} className="hero-demo-window">
      {/* window chrome */}
      <div className="hero-demo-chrome">
        <BrandMark size={22} />
        <strong
          style={{
            fontSize: '0.875rem',
            fontWeight: 700,
            letterSpacing: '-0.01em',
            color: 'var(--color-foreground)',
          }}
        >
          CleanRoute Pro
        </strong>
        <span
          style={{
            marginLeft: 'auto',
            fontSize: '0.75rem',
            fontWeight: 600,
            color: 'var(--color-foreground-subtle)',
          }}
        >
          Thursday&rsquo;s run
        </span>
      </div>

      {/* mini route map */}
      <svg
        aria-hidden="true"
        viewBox="0 0 400 170"
        className="hero-demo-map"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* faint backdrop routes, same language as the full demo */}
        <path
          d="M -20 40 C 120 90, 260 20, 420 70"
          fill="none"
          stroke={CRP_INDIGO}
          strokeWidth="1.5"
          strokeDasharray="2 9"
          opacity="0.10"
        />
        <path
          d="M -20 150 C 140 120, 300 160, 420 120"
          fill="none"
          stroke={CRP_INDIGO}
          strokeWidth="1.5"
          strokeDasharray="2 9"
          opacity="0.10"
        />

        {/* base */}
        <circle cx={PINS[0].x} cy={PINS[0].y} r="5" fill={CRP_INDIGO} />
        <text
          x={PINS[0].x}
          y={PINS[0].y + 20}
          textAnchor="middle"
          fontSize="10"
          fontWeight="600"
          fill="var(--color-foreground-subtle)"
        >
          Base
        </text>

        {/* route segments + stop pins, one per assigned job */}
        {JOBS.map((job, i) => {
          const on = shown > i;
          const pin = PINS[i + 1];
          return (
            <g key={job.id} style={{ opacity: on ? 1 : 0, transition: 'opacity 300ms ease' }}>
              <path
                className="crp-bg-route"
                d={SEGMENTS[i]}
                fill="none"
                stroke={CRP_INDIGO}
                strokeWidth="2"
                strokeDasharray="2 8"
                strokeLinecap="round"
                opacity="0.55"
              />
              <circle className="crp-bg-ping" cx={pin.x} cy={pin.y} r="10" fill="none" stroke={CRP_INDIGO} strokeWidth="2" opacity="0.4" />
              <circle cx={pin.x} cy={pin.y} r="6" fill={CRP_INDIGO} />
              <circle cx={pin.x} cy={pin.y} r="2.2" fill="#ffffff" />
              <text
                x={pin.x}
                y={pin.y - 14}
                textAnchor="middle"
                fontSize="10"
                fontWeight="600"
                fill="var(--color-foreground-subtle)"
              >
                {job.suburb}
              </text>
            </g>
          );
        })}

        {/* ghost markers for stops not yet on the run */}
        {JOBS.map((job, i) =>
          shown > i ? null : (
            <circle
              key={`ghost-${job.id}`}
              cx={PINS[i + 1].x}
              cy={PINS[i + 1].y}
              r="5"
              fill="none"
              stroke="var(--color-foreground-subtle)"
              strokeWidth="1.5"
              strokeDasharray="2 3"
              opacity="0.5"
            />
          )
        )}
      </svg>

      {/* the run list */}
      <ul className="hero-demo-rows">
        {JOBS.map((job, i) => {
          const on = shown > i;
          const staff = CREW[i % CREW.length];
          return (
            <li key={job.id}>
              <button
                type="button"
                className="hero-demo-row"
                onClick={() => setAssigned((n) => Math.max(n, i + 1))}
                aria-pressed={on}
              >
                <span style={{ minWidth: 0 }}>
                  <span
                    style={{
                      display: 'block',
                      fontSize: '0.8125rem',
                      fontWeight: 600,
                      color: 'var(--color-foreground)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {job.name}
                  </span>
                  <span
                    style={{
                      display: 'block',
                      fontSize: '0.75rem',
                      color: 'var(--color-foreground-subtle)',
                    }}
                  >
                    {job.suburb} &middot; {fmtMin(job.durationMin)}
                  </span>
                </span>
                {on ? (
                  <span className="hero-demo-chip hero-demo-chip-on">{staff.name}</span>
                ) : (
                  <span className="hero-demo-chip">Assign</span>
                )}
              </button>
            </li>
          );
        })}
      </ul>

      {/* live totals from the real schedule math */}
      <div className="hero-demo-summary">
        {shown === 0 ? (
          <span>Assigning today&rsquo;s jobs&hellip;</span>
        ) : (
          <span>
            {shown} {shown === 1 ? 'job' : 'jobs'}, {summary.km} km driven.
            Revenue {fmtMoney(summary.revenue)}, profit {fmtMoney(summary.profit)}.
          </span>
        )}
      </div>
    </div>
  );
}

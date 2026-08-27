'use client';

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Star } from '@phosphor-icons/react';
import { GOOGLE_REVIEWS } from './GoogleReviews';

// Client marquee ribbon under the hero: cobalt background, solid-white
// logos and names drifting right-to-left. Every name is a confirmed client
// or Riley's own product, nothing else goes here. Items link to the work
// section. Hovering the bar eases the train down to a slow cruise (never a
// hard stop) and pins the bubble to whichever brand the cursor is closest
// to; leaving eases it back up.
//
// Review bubbles: brands with a `review` entry randomly pop a speech bubble
// (one verbatim sentence from their real Google review) above their spot on
// the train for a couple of seconds. The bubble rides with the train,
// lingers while hovered, and clicks through to the Google profile once
// GOOGLE_REVIEWS.profileUrl is filled in. Quotes must stay word-for-word
// from real reviews — never invent or trim one without Riley's sign-off.

// Hand-drawn white marks for clients whose real logo turns to mush when
// forced solid white (detailed crests etc.). 30x30, all-white, no fill tricks.
// Stonegrill's sign: a 3D stone slab with heat squiggles rising off it.
// Seams are stroked in the band's cobalt so the slab reads as 3D while the
// artwork stays solid white.
const stonegrillMark = (
  <svg width="30" height="30" viewBox="0 0 30 30" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
    <path d="M9 11c-1.2-1.3 1.2-2.7 0-4s1.2-2.7 0-4" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" />
    <path d="M15 11c-1.2-1.3 1.2-2.7 0-4s1.2-2.7 0-4" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" />
    <path d="M21 11c-1.2-1.3 1.2-2.7 0-4s1.2-2.7 0-4" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" />
    <path d="M3 20L15 15l12 5v3.5l-12 5-12-5z" fill="#fff" />
    <path d="M3 20l12 5 12-5M15 25v3.5" stroke="var(--color-primary)" strokeWidth="1.3" strokeLinejoin="round" />
  </svg>
);

// Restore Coaching (midwife & life coach, "Empowering Parents, Enriching
// Lives"): her real logo is a watercolor wash + script that dies in solid
// white, so the band wears a nurture mark instead — a heart cradled in an
// open-hands curve.
const restoreMark = (
  <svg width="30" height="30" viewBox="0 0 30 30" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
    <path
      d="M15 17.5c-4.3-3-6.8-5.6-6.8-8.5 0-2 1.6-3.5 3.5-3.5 1.4 0 2.6.8 3.3 2 .7-1.2 1.9-2 3.3-2 1.9 0 3.5 1.5 3.5 3.5 0 2.9-2.5 5.5-6.8 8.5z"
      fill="#fff"
    />
    <path d="M5 20.5c2.5 5.5 17.5 5.5 20 0" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

// CleanRoute Pro's app icon, re-drawn white: the route curve between two
// waypoints (the indigo tile background stays behind — the mark is the route).
const cleanrouteMark = (
  <svg width="30" height="30" viewBox="0 0 30 30" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
    <path d="M7 23C7 12 23 18 23 7" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" />
    <circle cx="7" cy="23" r="2" fill="#fff" />
    <circle cx="23" cy="7" r="3" fill="#fff" />
    <circle cx="23" cy="7" r="1.2" fill="var(--color-primary)" />
  </svg>
);

const golfMark = (
  <svg width="30" height="30" viewBox="0 0 30 30" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
    <path d="M17 4v17" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
    <path d="M17 4l9 3.5L17 11z" fill="#fff" />
    <circle cx="9" cy="21.5" r="3.5" fill="#fff" />
    <path d="M3 26.5c7-2.5 17-2.5 24 0" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

type Review = { quote: string; name: string };

const clients: Array<{
  name: string;
  mark: string;
  round?: boolean;
  logo?: string;
  icon?: ReactNode;
  // wide wordmark artwork: the logo IS the whole item (no tile, no text)
  wordmark?: boolean;
  wordmarkHeight?: number;
  // per-client type treatment (e.g. Stonegrill's letterspaced sign caps)
  nameStyle?: CSSProperties;
  // one verbatim sentence from this brand's real Google review
  review?: Review;
}> = [
  {
    name: 'Stone Grill Huskisson',
    mark: 'SG',
    icon: stonegrillMark,
    nameStyle: { textTransform: 'uppercase', letterSpacing: '0.14em', fontSize: '0.8125rem' },
    review: {
      quote: 'The website looks premium and captures the exact vibe of our restaurant.',
      name: 'Alex Phua',
    },
  },
  { name: 'Sussex Inlet Golf Club', mark: 'GC', icon: golfMark },
  {
    name: 'Todays Stash',
    mark: 'TS',
    // the spray-blob wordmark, pre-processed white with the lettering
    // knocked out so the band's cobalt reads through it
    logo: '/clientlogos/todays-stash.png',
    wordmark: true,
    wordmarkHeight: 42,
    review: {
      quote: 'Exceptional MVP development from start to finish.',
      name: 'Adrian Coppola',
    },
  },
  {
    name: 'Land to Sea Cleaning',
    mark: 'LS',
    logo: '/clientlogos/land-to-sea.png',
    review: {
      quote: 'The final website exceeded my expectations and perfectly captured my brand.',
      name: 'Haley Short',
    },
  },
  {
    name: 'CleanRoute Pro',
    mark: 'CR',
    icon: cleanrouteMark,
    review: {
      quote: 'Riley built CleanRoute Pro specifically around the way my business operates.',
      name: 'Sarah',
    },
  },
  {
    name: 'East Coast Pipe',
    mark: 'EP',
    logo: '/clientlogos/east-coast-pipe.png',
    wordmark: true,
    review: {
      quote: 'Very professional to deal with and made the whole process easy and stress free.',
      name: 'Peter Sloan',
    },
  },
  {
    name: 'Jervis Bay Boat Storage',
    mark: 'JB',
    logo: '/clientlogos/jervis-bay-boat-storage.png',
    review: {
      quote: 'Creative design, friendly, informative, professional service and very reasonable pricing.',
      name: "Matt O'Connor",
    },
  },
  {
    name: 'Inclusive Transport',
    mark: 'IT',
    logo: '/clientlogos/inclusive-transport.png',
    review: {
      quote: 'He has a great eye for creativity and really brought my vision to life.',
      name: 'Benni Brown',
    },
  },
  {
    name: 'Zampa Services',
    mark: 'ZS',
    logo: '/clientlogos/zampa-services.png',
    review: {
      quote: 'He took my ideas and turned them into a professional, polished website that truly represents my business.',
      name: 'Leanne Zampa',
    },
  },
  {
    name: 'Restore Coaching',
    mark: 'RC',
    icon: restoreMark,
    review: {
      quote: 'Riley created a website that is not only beautiful, modern and professional, but also captures my brand and vision perfectly.',
      name: 'Linley Blundell',
    },
  },
];

// Near-continuous stream: each bubble holds ~3s and the next follows a
// beat later, so the bar almost always has a quote in the air.
const BUBBLE_MS = 3000;
const GAP_MIN_MS = 350;
const GAP_RAND_MS = 400;
// hover cruise: fraction of full marquee speed while the cursor is on the bar
const SLOW_RATE = 0.22;

type Side = 'above' | 'below';

function Bubble({ review, side }: { review: Review; side: Side }) {
  const url = GOOGLE_REVIEWS.profileUrl;
  const card: CSSProperties = {
    position: 'relative',
    display: 'block',
    width: 'max-content',
    maxWidth: 232,
    background: 'var(--color-surface)',
    color: 'var(--color-foreground)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-md)',
    boxShadow: 'var(--shadow-lg)',
    padding: '0.625rem 0.75rem',
    fontSize: '0.75rem',
    lineHeight: 1.45,
    textDecoration: 'none',
  };
  // the wrapper spans the gap between item and card, so the cursor can
  // travel into the bubble without triggering the item's mouseleave
  const wrapper: CSSProperties =
    side === 'above'
      ? { position: 'absolute', bottom: '100%', left: '50%', paddingBottom: 16, zIndex: 60 }
      : { position: 'absolute', top: '100%', left: '50%', paddingTop: 16, zIndex: 60 };
  const inner = (
    <>
      <span
        role="img"
        aria-label="Rated 5 out of 5 stars"
        style={{ display: 'flex', gap: '1px', marginBottom: '0.25rem' }}
      >
        {[0, 1, 2, 3, 4].map((i) => (
          <Star key={i} size={11} weight="fill" color="#F5A623" />
        ))}
      </span>
      <span style={{ display: 'block', fontStyle: 'italic' }}>&ldquo;{review.quote}&rdquo;</span>
      <span
        style={{
          display: 'block',
          marginTop: '0.25rem',
          fontWeight: 600,
          fontSize: '0.6875rem',
          color: 'var(--color-foreground-subtle)',
        }}
      >
        {review.name} &middot; Google review{url ? ' ↗' : ''}
      </span>
      <span
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: '50%',
          width: 10,
          height: 10,
          background: 'var(--color-surface)',
          transform: 'translateX(-50%) rotate(45deg)',
          ...(side === 'above'
            ? {
                bottom: -5.5,
                borderRight: '1px solid var(--color-border)',
                borderBottom: '1px solid var(--color-border)',
              }
            : {
                top: -5.5,
                borderLeft: '1px solid var(--color-border)',
                borderTop: '1px solid var(--color-border)',
              }),
        }}
      />
    </>
  );
  const drift = side === 'above' ? 8 : -8;
  const pop = {
    initial: { opacity: 0, y: drift, x: '-50%' },
    animate: { opacity: 1, y: 0, x: '-50%' },
    exit: { opacity: 0, y: drift * 0.6, x: '-50%' },
    transition: { duration: 0.25, ease: [0.32, 0.72, 0, 1] as const },
  };
  return (
    <motion.div style={wrapper} {...pop}>
      {url ? (
        <a href={url} target="_blank" rel="noopener noreferrer" style={card}>
          {inner}
        </a>
      ) : (
        <div style={card}>{inner}</div>
      )}
    </motion.div>
  );
}

export default function ClientLogoGrid() {
  const bandRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const hovered = useRef(false);
  const cursorX = useRef<number | null>(null);
  const [activeKey, setActiveKey] = useState<string | null>(null);
  // cursor-following reveal: while inside the bar the bubble sits on the
  // review-bearing brand closest to the cursor and outranks the random cycle
  const [hoverKey, setHoverKey] = useState<string | null>(null);
  // remember the last couple of brands so the random cycle never echoes
  const recentBrands = useRef<string[]>([]);
  // each pop lands above or below the bar, 50/50
  const [side, setSide] = useState<Side>('above');
  const hoverKeyRef = useRef<string | null>(null);

  // Randomly pop a bubble on a review-bearing brand that is currently
  // visible inside the band, hold it, hide it, wait, repeat. While the
  // visitor hovers the band (train paused) the current bubble lingers.
  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    const show = () => {
      const band = bandRef.current;
      if (!band) return;
      if (hovered.current) {
        t = setTimeout(show, 1000);
        return;
      }
      const bandRect = band.getBoundingClientRect();
      // wide left margin: the train exits left, so a pick too close to that
      // edge would drift off-screen before its bubble finishes
      const candidates = Array.from(
        band.querySelectorAll<HTMLElement>('[data-review-key]'),
      ).filter((el) => {
        const r = el.getBoundingClientRect();
        return r.left >= bandRect.left + 140 && r.right <= bandRect.right - 32;
      });
      // never echo either of the last two brands — if nothing fresh is in
      // frame yet, wait for the train to bring something new rather than
      // repeating (repeats read as broken randomness)
      const fresh = candidates.filter(
        (el) => !recentBrands.current.includes((el.dataset.reviewKey ?? '').split(':')[1]),
      );
      if (fresh.length === 0) {
        t = setTimeout(show, 600);
        return;
      }
      const el = fresh[Math.floor(Math.random() * fresh.length)];
      const key = el.dataset.reviewKey ?? null;
      const brand = key ? key.split(':')[1] : null;
      if (brand) {
        recentBrands.current = [brand, ...recentBrands.current].slice(0, 2);
      }
      setSide(Math.random() < 0.5 ? 'above' : 'below');
      setActiveKey(key);
      t = setTimeout(hide, BUBBLE_MS);
    };
    const hide = () => {
      if (hovered.current) {
        t = setTimeout(hide, 800);
        return;
      }
      setActiveKey(null);
      t = setTimeout(show, GAP_MIN_MS + Math.random() * GAP_RAND_MS);
    };
    t = setTimeout(show, 1800);
    return () => clearTimeout(t);
  }, []);

  // Ease the marquee between full speed and a slow cruise (no hard stops),
  // and while the cursor is inside the bar keep the bubble pinned to the
  // review-bearing brand closest to it — even over gaps or brands without
  // reviews, so a bubble is always up while browsing the bar.
  useEffect(() => {
    let raf: number;
    let rate = 1;
    const loop = () => {
      const anim = trackRef.current?.getAnimations()[0];
      const target = hovered.current ? SLOW_RATE : 1;
      rate += (target - rate) * 0.06;
      if (Math.abs(rate - target) < 0.005) rate = target;
      if (anim && anim.playbackRate !== rate) anim.playbackRate = rate;

      if (hovered.current && cursorX.current !== null && bandRef.current) {
        let bestKey: string | null = null;
        let bestD = Infinity;
        bandRef.current.querySelectorAll<HTMLElement>('[data-review-key]').forEach((el) => {
          const r = el.getBoundingClientRect();
          const d = Math.abs((cursorX.current as number) - (r.left + r.width / 2));
          if (d < bestD) {
            bestD = d;
            bestKey = el.dataset.reviewKey ?? null;
          }
        });
        if (bestKey !== null && hoverKeyRef.current !== bestKey) {
          hoverKeyRef.current = bestKey;
          setSide(Math.random() < 0.5 ? 'above' : 'below');
          setHoverKey(bestKey);
        }
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const row = (rowIdx: number) => (
    <ul className="hero-logo-row" aria-hidden={rowIdx === 1 || undefined}>
      {clients.map((client) => {
        const key = `${rowIdx}:${client.name}`;
        return (
          <li
            key={client.name}
            className="hero-logo-item"
            style={{ position: 'relative' }}
            {...(client.review ? { 'data-review-key': key } : {})}
          >
            <Link
              href="/#work"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.625rem',
                textDecoration: 'none',
              }}
            >
              {client.wordmark && client.logo ? (
                <Image
                  src={client.logo}
                  alt={client.name}
                  width={110}
                  height={client.wordmarkHeight ?? 30}
                  style={{
                    width: 'auto',
                    height: client.wordmarkHeight ?? 26,
                    objectFit: 'contain',
                    filter: 'brightness(0) invert(1)',
                    flexShrink: 0,
                  }}
                />
              ) : client.icon ? (
                client.icon
              ) : client.logo ? (
                <Image
                  src={client.logo}
                  alt=""
                  width={30}
                  height={30}
                  style={{
                    width: 30,
                    height: 30,
                    objectFit: 'contain',
                    filter: 'brightness(0) invert(1)',
                    flexShrink: 0,
                  }}
                />
              ) : (
                <span
                  aria-hidden="true"
                  className="hero-logo-mark"
                  style={{ borderRadius: client.round ? '50%' : '8px' }}
                >
                  {client.mark}
                </span>
              )}
              {!client.wordmark && (
                <span className="hero-logo-name" style={client.nameStyle}>
                  {client.name}
                </span>
              )}
            </Link>
            <AnimatePresence>
              {(hoverKey ?? activeKey) === key && client.review && (
                <Bubble review={client.review} side={side} />
              )}
            </AnimatePresence>
          </li>
        );
      })}
    </ul>
  );

  return (
    <div
      ref={bandRef}
      className="hero-logo-band"
      onMouseEnter={() => {
        hovered.current = true;
        // entering the bar cancels whatever the random cycle had up —
        // the cursor decides from here
        setActiveKey(null);
      }}
      onMouseMove={(e) => {
        cursorX.current = e.clientX;
      }}
      onMouseLeave={() => {
        hovered.current = false;
        cursorX.current = null;
        hoverKeyRef.current = null;
        setHoverKey(null);
      }}
    >
      <div className="hero-logo-track" ref={trackRef}>
        {row(0)}
        {row(1)}
      </div>
    </div>
  );
}

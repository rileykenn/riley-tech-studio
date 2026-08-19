'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { useInView } from 'framer-motion';
import heroViewFile from './coursemap/hero-view.json';

// A compact copy of the Sussex Inlet Golf Club 3D course map for the hero.
// The full-size viewer stays in the case-study section; this one shares the
// same embed at hero scale. three.js is heavy, so the map mounts on idle
// (the poster holds the frame first, keeping the hero's first paint fast)
// and the frameloop pauses whenever the hero is scrolled away.
//
// FRAMING: hero-view.json holds the hand-locked resting camera (set with the
// dev tuner, since removed). If its view is ever nulled, the rig falls back
// to auto-fitting all hole markers to the canvas.

type Vec3 = [number, number, number];
type CameraView = { position: Vec3; target: Vec3 };

const LOCKED_VIEW = (heroViewFile as { view: CameraView | null }).view;
const HERO_MAP_HEIGHT = 'clamp(360px, 44vh, 470px)';

const CourseMapEmbed = dynamic(() => import('./coursemap/CourseMapEmbed'), {
  ssr: false,
  loading: () => <MapPoster />,
});

function MapPoster() {
  return (
    <div style={{ position: 'relative', height: HERO_MAP_HEIGHT, overflow: 'hidden' }}>
      <Image
        src="/mapmedia/basemap.jpg"
        alt="Aerial view of the Sussex Inlet Golf Club course"
        fill
        preload
        sizes="(max-width: 900px) 92vw, 44vw"
        style={{ objectFit: 'cover', opacity: 0.85 }}
      />
      <p
        className="glass-panel"
        style={{
          position: 'absolute',
          bottom: '0.75rem',
          left: '50%',
          transform: 'translateX(-50%)',
          whiteSpace: 'nowrap',
          borderRadius: 9999,
          padding: '0.5rem 1rem',
          fontSize: '0.75rem',
          fontWeight: 500,
          color: 'var(--color-foreground)',
          margin: 0,
        }}
      >
        Loading the interactive course&hellip;
      </p>
    </div>
  );
}

export default function HeroCourseMap() {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInView(ref, { amount: 0.15 });
  const [mount, setMount] = useState(false);

  // wait for the browser to go idle before pulling in three.js, so the
  // headline, CTA and poster paint first
  useEffect(() => {
    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(() => setMount(true), { timeout: 1800 });
      return () => window.cancelIdleCallback(id);
    }
    const t = setTimeout(() => setMount(true), 900);
    return () => clearTimeout(t);
  }, []);

  return (
    <div ref={ref}>
      <div className="card-shell hero-map-shell">
        <div className="card-core" style={{ position: 'relative', overflow: 'hidden' }}>
          {mount ? (
            <CourseMapEmbed
              active={visible}
              height={HERO_MAP_HEIGHT}
              fitCourse={!LOCKED_VIEW}
              homeView={LOCKED_VIEW ?? undefined}
              compact
            />
          ) : (
            <MapPoster />
          )}
        </div>
      </div>

      {/* the club's byline: map stays clean, credit sits under the card */}
      <div className="hero-map-credit">
        <Image
          src="/casestudy/sigc-logo.png"
          alt="Sussex Inlet Golf Club crest"
          width={24}
          height={24}
          style={{ objectFit: 'contain', flexShrink: 0 }}
        />
        <b>Sussex Inlet Golf Club</b>
        <span className="hero-map-credit-desc">
          Interactive 3D course map and website.
        </span>
        <Link href="/#work" className="hero-map-credit-link">
          See the full case study
        </Link>
      </div>
    </div>
  );
}

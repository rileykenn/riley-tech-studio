'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { motion, useMotionValue, useTransform, useAnimationFrame, useReducedMotion } from 'framer-motion';
import { CaretLeft, CaretRight } from '@phosphor-icons/react';

// A stacked before/after comparison: drag the divider to wipe between the two
// images. When nobody is touching it, the divider sways gently on its own.

const MIN = 0;
const MAX = 100;
const IDLE_RESUME_MS = 2500;

export default function BeforeAfterSlider({
  beforeSrc,
  beforeAlt,
  afterSrc,
  afterAlt,
}: {
  beforeSrc: string;
  beforeAlt: string;
  afterSrc: string;
  afterAlt: string;
}) {
  const reduce = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const p = useMotionValue(50);
  const clip = useTransform(p, (v) => `inset(0 ${100 - v}% 0 0)`);
  const left = useTransform(p, (v) => `${v}%`);

  const [dragging, setDragging] = useState(false);
  const lastInteraction = useRef(0);
  // phase offset so the idle sway resumes smoothly from wherever the user left it
  const phase = useRef(0);
  const phaseSynced = useRef(true);

  const setFromClientX = (clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const v = Math.min(MAX, Math.max(MIN, ((clientX - r.left) / r.width) * 100));
    p.set(v);
    lastInteraction.current = performance.now();
    phaseSynced.current = false;
  };

  useAnimationFrame((t) => {
    if (reduce || dragging) return;
    if (performance.now() - lastInteraction.current < IDLE_RESUME_MS && lastInteraction.current > 0) return;
    if (!phaseSynced.current) {
      // pick the sine phase that matches the current position, then drift on
      const v = Math.min(1, Math.max(-1, (p.get() - 50) / 34));
      phase.current = Math.asin(v) - t / 1600;
      phaseSynced.current = true;
    }
    // chase the sway target instead of snapping to it, so resuming from a
    // position outside the sway band (near 0 or 100) glides back in
    const target = 50 + 34 * Math.sin(t / 1600 + phase.current);
    p.set(p.get() + (target - p.get()) * 0.06);
  });

  return (
    <div
      ref={containerRef}
      role="slider"
      aria-label="Compare the old site with the rebuild"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(p.get())}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
          e.preventDefault();
          const delta = e.key === 'ArrowLeft' ? -6 : 6;
          p.set(Math.min(MAX, Math.max(MIN, p.get() + delta)));
          lastInteraction.current = performance.now();
          phaseSynced.current = false;
        }
      }}
      onPointerDown={(e) => {
        (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
        setDragging(true);
        setFromClientX(e.clientX);
      }}
      onPointerMove={(e) => {
        if (dragging) setFromClientX(e.clientX);
      }}
      onPointerUp={() => {
        setDragging(false);
        lastInteraction.current = performance.now();
      }}
      onPointerCancel={() => setDragging(false)}
      className="group relative w-full cursor-ew-resize touch-none select-none overflow-hidden focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#b0873a]"
      style={{ aspectRatio: '16 / 10', borderRadius: 'var(--radius-lg)' }}
    >
      {/* after (base layer) */}
      <Image
        src={afterSrc}
        alt={afterAlt}
        fill
        sizes="(max-width: 768px) 100vw, 44vw"
        style={{ objectFit: 'cover' }}
        draggable={false}
      />
      {/* before (clipped on top) */}
      <motion.div className="absolute inset-0" style={{ clipPath: clip }}>
        <Image
          src={beforeSrc}
          alt={beforeAlt}
          fill
          sizes="(max-width: 768px) 100vw, 44vw"
          style={{ objectFit: 'cover' }}
          draggable={false}
        />
      </motion.div>

      {/* divider + handle */}
      <motion.div
        className="absolute inset-y-0 z-10"
        style={{ left, x: '-50%', width: 2, background: 'rgba(255,255,255,0.95)', boxShadow: '0 0 12px rgba(0,0,0,0.35)' }}
      />
      <motion.div
        className="absolute top-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-[0_4px_16px_rgba(0,0,0,0.3)]"
        style={{ left, x: '-50%', y: '-50%' }}
      >
        <CaretLeft size={12} weight="bold" color="#0a1628" />
        <CaretRight size={12} weight="bold" color="#0a1628" />
      </motion.div>
    </div>
  );
}

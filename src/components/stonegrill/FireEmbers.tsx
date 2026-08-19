'use client';

import { useEffect, useRef } from 'react';

// Rising fire embers on a canvas: tiny hot sparks in red through amber that
// drift up from the bottom edge, flickering and stretching slightly along
// their direction of travel like real embers off a grill. Drawn additively so
// they bloom against the charcoal section. The loop only runs while the
// section is on screen and is skipped entirely under reduced motion.

interface Ember {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  hue: number;
  sway: number;
  swaySpeed: number;
  flicker: number;
  flickerSpeed: number;
}

const EMBER_COUNT = 72;

export default function FireEmbers({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf: number | null = null;
    let running = false;
    let width = 0;
    let height = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const embers: Ember[] = [];

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const spawn = (e: Ember, initial: boolean) => {
      e.x = Math.random() * width;
      e.y = initial ? height - Math.random() * height * 0.9 : height + 6;
      e.vx = (Math.random() - 0.5) * 0.14;
      e.vy = -(0.35 + Math.random() * 0.75);
      e.maxLife = 240 + Math.random() * 220;
      e.life = initial ? Math.random() * e.maxLife : e.maxLife;
      // mostly pin-sharp sparks with the odd larger cinder
      e.size = Math.random() < 0.8 ? 0.4 + Math.random() * 0.6 : 1 + Math.random() * 0.7;
      // red (4) through orange (28) into amber (40)
      e.hue = 4 + Math.random() * 36;
      e.sway = Math.random() * Math.PI * 2;
      e.swaySpeed = 0.004 + Math.random() * 0.01;
      e.flicker = Math.random() * Math.PI * 2;
      e.flickerSpeed = 0.05 + Math.random() * 0.12;
    };

    resize();
    for (let i = 0; i < EMBER_COUNT; i++) {
      const e = {} as Ember;
      spawn(e, true);
      embers.push(e);
    }

    const tick = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = 'lighter';
      for (const e of embers) {
        e.life -= 1;
        e.sway += e.swaySpeed;
        e.flicker += e.flickerSpeed;
        e.x += e.vx + Math.sin(e.sway) * 0.2;
        e.y += e.vy;
        if (e.life <= 0 || e.y < -8) spawn(e, false);

        const t = e.life / e.maxLife;
        // brightest mid-flight, fading at both ends, with a per-spark flicker
        const flicker = 0.72 + 0.28 * Math.sin(e.flicker);
        const alpha = Math.min(1, t * 3) * Math.min(1, (1 - t) * 2.4) * flicker;
        const r = e.size * (0.7 + t * 0.5);
        // stretched slightly along the direction of travel, like a real spark
        const stretch = 1 + Math.min(1.4, Math.abs(e.vy) * 1.1);

        // hot core: small, sharp, near-white centre
        ctx.fillStyle = `hsla(${e.hue + 8}, 100%, ${68 + flicker * 10}%, ${alpha})`;
        ctx.beginPath();
        ctx.ellipse(e.x, e.y, r, r * stretch, 0, 0, Math.PI * 2);
        ctx.fill();

        // tight glow: steep falloff so it reads as a spark, not a blob
        const glowR = r * 2.2;
        const grad = ctx.createRadialGradient(e.x, e.y, 0, e.x, e.y, glowR);
        grad.addColorStop(0, `hsla(${e.hue}, 100%, 55%, ${alpha * 0.5})`);
        grad.addColorStop(0.55, `hsla(${e.hue}, 100%, 45%, ${alpha * 0.14})`);
        grad.addColorStop(1, `hsla(${e.hue}, 100%, 40%, 0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.ellipse(e.x, e.y, glowR, glowR * stretch, 0, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(tick);
    };

    const start = () => {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(tick);
    };
    const stop = () => {
      running = false;
      if (raf !== null) cancelAnimationFrame(raf);
      raf = null;
    };

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((en) => en.isIntersecting)) start();
        else stop();
      },
      { rootMargin: '80px' }
    );
    io.observe(canvas);

    const onResize = () => resize();
    window.addEventListener('resize', onResize);

    return () => {
      stop();
      io.disconnect();
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}

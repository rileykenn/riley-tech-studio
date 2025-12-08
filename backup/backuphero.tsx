"use client";

import React, { useEffect, useRef } from "react";

type MouseState = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  speed: number; // pixels per ms
  lastTime: number;
};

type Impact = {
  x: number;      // x along the ribbon where it was "plucked"
  time: number;   // in seconds (same time base as `t` in draw)
  strength: number;
  ribbon: number; // which ribbon this impact belongs to
};

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const mouseRef = useRef<MouseState>({
    x: 0.5,
    y: 0.5,
    vx: 0,
    vy: 0,
    speed: 0,
    lastTime: 0,
  });

  const impactsRef = useRef<Impact[]>([]);
  const lastHitTimeRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;

    const resize = () => {
      const { innerWidth, innerHeight } = window;
      canvas.width = innerWidth * dpr;
      canvas.height = innerHeight * dpr;
      canvas.style.width = `${innerWidth}px`;
      canvas.style.height = `${innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize);

    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const now = performance.now();

      const prev = mouseRef.current;
      const nx = e.clientX / innerWidth;
      const ny = e.clientY / innerHeight;

      const dxPx = (nx - prev.x) * innerWidth;
      const dyPx = (ny - prev.y) * innerHeight;
      const dt = Math.max(now - prev.lastTime, 16); // ms

      const speed = Math.hypot(dxPx, dyPx) / dt; // px/ms

      mouseRef.current = {
        x: nx,
        y: ny,
        vx: dxPx / dt,
        vy: dyPx / dt,
        speed,
        lastTime: now,
      };
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!e.touches[0]) return;
      const { innerWidth, innerHeight } = window;
      const now = performance.now();

      const prev = mouseRef.current;
      const nx = e.touches[0].clientX / innerWidth;
      const ny = e.touches[0].clientY / innerHeight;

      const dxPx = (nx - prev.x) * innerWidth;
      const dyPx = (ny - prev.y) * innerHeight;
      const dt = Math.max(now - prev.lastTime, 16);

      const speed = Math.hypot(dxPx, dyPx) / dt;

      mouseRef.current = {
        x: nx,
        y: ny,
        vx: dxPx / dt,
        vy: dyPx / dt,
        speed,
        lastTime: now,
      };
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove);

    let startTime = performance.now();

    const draw = (timeMs: number) => {
      const t = (timeMs - startTime) / 1000; // seconds
      const { innerWidth: w, innerHeight: h } = window;
      const mouse = mouseRef.current;
      const mx = mouse.x * w;
      const my = mouse.y * h;
      const mouseSpeed = mouse.speed;

      // solid black background
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, w, h);

      const ribbonCount = 2;
      const segmentCount = 400;

      // ==== wobble config ====
      const wavelength = 70;        // distance between peaks along x
      const oscillationSpeed = 40;  // how fast it shivers (radians/sec)
      const decayTime = 0.15;        // how quickly wobble fades over time
      const spatialFalloff = 150;   // how far wobble spreads left/right
      const minStrength = 0.1;
      const maxStrength = 25;
      const hitRadius = 25;         // how close cursor needs to be to "hit" a ribbon
      const minHitGap = 0.07;       // seconds between impacts
      // ========================

      // keep only very old impacts out (smooth tail instead of hard cut)
      const maxImpactAge = decayTime * 4; // long enough so it fades naturally
      const globalImpacts = impactsRef.current.filter(
        (imp) => t - imp.time < maxImpactAge
      );
      impactsRef.current = globalImpacts;

      // additive so overlaps = hotspots
      ctx.globalCompositeOperation = "lighter";

      for (let i = 0; i < ribbonCount; i++) {
        const progress = i / (ribbonCount - 1 || 1);
        const baseY = h * (0.2 + progress * 0.6);

        const speed = 0.1 + progress * 0.35;
        const amplitude = 30 + progress * 55;
        const secondaryAmp = amplitude * 0.2;

        const phase = t * speed * 1.8 + i * 0.9;

        // 1) build centreline points (with wobble applied)
        const rawPoints: { x: number; y: number }[] = [];

        for (let j = 0; j <= segmentCount; j++) {
          const pct = j / segmentCount;
          const x = pct * (w + 200) - 100;

          const baseWave =
            Math.sin(pct * 6 + phase) * amplitude +
            Math.cos(pct * 3.4 - phase * 0.7) * secondaryAmp;

          let y = baseY + baseWave + Math.sin(t * 0.9 + i) * 8;

          // apply wobble from impacts that belong ONLY to this ribbon
          let wobble = 0;
          for (const imp of globalImpacts) {
            if (imp.ribbon !== i) continue;

            const age = t - imp.time;
            if (age < 0 || age > maxImpactAge) continue;

            const dx = x - imp.x;
            const spatial = Math.exp(-Math.abs(dx) / spatialFalloff);
            const temporal = Math.exp(-age / decayTime);
            const wave =
              Math.sin(dx / wavelength - age * oscillationSpeed) *
              spatial *
              temporal;

            wobble += imp.strength * wave;
          }

          y += wobble;

          rawPoints.push({ x, y });
        }

        // detect "hit" so we can spawn a new wobble (per ribbon)
        let minDist = Infinity;
        let closestX = mx;

        for (const p of rawPoints) {
          const dx = p.x - mx;
          const dy = p.y - my;
          const d = Math.hypot(dx, dy);
          if (d < minDist) {
            minDist = d;
            closestX = p.x;
          }
        }

        if (minDist < hitRadius) {
          if (t - lastHitTimeRef.current > minHitGap) {
            // map cursor speed to wobble strength
            const strength = Math.min(
              Math.max(mouseSpeed * 40, minStrength),
              maxStrength
            );
            impactsRef.current.push({
              x: closestX,
              time: t,
              strength,
              ribbon: i,
            });
            lastHitTimeRef.current = t;
          }
        }

        // ==== cursor bend settings (your values kept) ====
        const influenceRadius = Math.min(w, h) * 0.35;
        const innerRadius = influenceRadius * 0.25;
        const maxPush = 35;
        const span = Math.max(influenceRadius - innerRadius, 5);

        // 2) apply local cursor repulsion so ribbons “bend away”
        const bentPoints: { x: number; y: number }[] = rawPoints.map((p) => {
          const dx = p.x - mx;
          const dy = p.y - my;
          const dist = Math.hypot(dx, dy);

          if (dist === 0 || dist > influenceRadius) {
            return p;
          }

          let strength: number;

          if (dist <= innerRadius) {
            strength = 1;
          } else {
            const tNorm = (dist - innerRadius) / span; // 0..1
            const tClamped = Math.min(Math.max(tNorm, 0), 1);
            const smooth = tClamped * tClamped * (3 - 2 * tClamped); // smoothstep
            strength = 1 - smooth;
          }

          const push = maxPush * strength;
          const ux = dx / (dist || 1);
          const uy = dy / (dist || 1);

          return {
            x: p.x + ux * push,
            y: p.y + uy * push,
          };
        });

        // 3) smooth the bent points to kill the "triangle" / segment artifacts
        const points = bentPoints.map((p) => ({ ...p }));
        const smoothPasses = 2;
        const smoothFactor = 1; // 0 = no smooth, 1 = full average

        for (let pass = 0; pass < smoothPasses; pass++) {
          for (let j = 1; j < points.length - 1; j++) {
            const prevY = points[j - 1].y;
            const currY = points[j].y;
            const nextY = points[j + 1].y;

            const avgY = (prevY + currY + nextY) / 3;
            points[j].y = currY * (1 - smoothFactor) + avgY * smoothFactor;
          }
        }

        const baseWidth = 20 + progress * 10; // thicker ribbons

        // ---- base ribbon body ----
        ctx.beginPath();
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        points.forEach((p, idx) => {
          if (idx === 0) ctx.moveTo(p.x, p.y);
          else ctx.lineTo(p.x, p.y);
        });

        ctx.strokeStyle = "rgba(255,255,255,0.35)"; // soft body
        ctx.lineWidth = baseWidth;
        ctx.stroke();

        // ---- twisting highlight (one side, sliding) ----
        const twistSpeed = 1.4; // how fast highlight rolls along the ribbon
        const twistFreq = 4;    // how many twists along the length

        const highlightPoints: { x: number; y: number }[] = [];

        for (let j = 0; j < points.length; j++) {
          const p = points[j];
          const prev = points[Math.max(j - 1, 0)];
          const next = points[Math.min(j + 1, points.length - 1)];

          const tx = next.x - prev.x;
          const ty = next.y - prev.y;
          const len = Math.hypot(tx, ty) || 1;

          const nx = -ty / len;
          const ny = tx / len;

          const pct = j / segmentCount;

          const side = Math.sin(
            t * twistSpeed + pct * twistFreq * Math.PI + i * 0.7
          );

          const offsetAmount = baseWidth * 0.7 * side;

          const hx = p.x + nx * offsetAmount;
          const hy = p.y + ny * offsetAmount;

          highlightPoints.push({ x: hx, y: hy });
        }

        ctx.beginPath();
        highlightPoints.forEach((p, idx) => {
          if (idx === 0) ctx.moveTo(p.x, p.y);
          else ctx.lineTo(p.x, p.y);
        });

        ctx.strokeStyle = "rgba(255,255,255,0.9)"; // bright edge
        ctx.lineWidth = baseWidth * 0.45;
        ctx.stroke();
      }

      // reset blend mode
      ctx.globalCompositeOperation = "source-over";

      animationFrameRef.current = requestAnimationFrame(draw);
    };

    animationFrameRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section className="relative h-screen w-full overflow-hidden bg-black text-white flex items-center">
      {/* animated background */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 z-0"
      />

      {/* slight overlay to keep content readable */}
      <div className="pointer-events-none absolute inset-0 z-10 bg-black/20" />

      {/* content */}
      <div className="relative z-20 mx-auto flex w-full max-w-6xl flex-col items-center gap-10 px-6 text-center md:items-start md:px-10 md:text-left">
        {/* heading pill */}
        <div className="mt-16 inline-flex items-center gap-2 rounded-full border border-white/12 bg-black/40 px-4 py-1 text-xs text-white/80 backdrop-blur-sm">
          <span className="rounded-full bg-white/10 px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wide text-white/90">
            Web • Systems • Automation
          </span>
          <span className="text-[0.7rem] text-white/70">
            Engineered builds for serious businesses
          </span>
        </div>

        {/* main heading */}
        <div className="space-y-4">
          <h1 className="text-4xl font-semibold tracking-tight md:text-6xl">
            Fast, engineered websites.
          </h1>

          <h2 className="text-3xl font-semibold tracking-tight md:text-5xl">
            Automation systems that{" "}
            <span className="text-white">actually ship work.</span>
          </h2>
        </div>

        {/* subcopy */}
        <p className="max-w-2xl text-sm text-white/70 md:text-base">
          I&apos;m a full-stack engineer with a media and design background. I
          build high-performance marketing sites and wire them into CRMs,
          automations and AI flows so your team spends less time clicking and
          more time selling.
        </p>

        {/* buttons */}
        <div className="mt-2 flex flex-wrap items-center justify-center gap-4 md:justify-start">
          <button
            onClick={() => scrollToSection("contact")}
            className="rounded-full bg-white text-black px-8 py-3 text-sm font-medium transition hover:bg-white/80"
          >
            Book a free call
          </button>

          <button
            onClick={() => scrollToSection("blueprint")}
            className="rounded-full border border-white/30 px-8 py-3 text-sm font-medium text-white transition hover:border-white hover:text-white"
          >
            Explore what I build
          </button>
        </div>

        {/* trust row */}
        <div className="mt-6 flex items-center gap-3 text-xs text-white/40">
          <span className="h-px w-10 bg-white/30" />
          <span>Built for founders, agencies & real operators.</span>
        </div>
      </div>

      {/* scroll arrow */}
      <div className="absolute bottom-7 left-1/2 z-20 -translate-x-1/2">
        <button
          onClick={() => scrollToSection("blueprint")}
          className="group flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white transition hover:border-white"
        >
          <span className="arrow-bounce text-lg leading-none">↓</span>
        </button>
      </div>

      <style jsx>{`
        @keyframes arrow-bounce {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(4px);
          }
        }
        .arrow-bounce {
          animation: arrow-bounce 1.4s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}

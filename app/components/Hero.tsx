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
  x: number; // x along the ribbon where it was "plucked"
  time: number; // in seconds (same time base as `t` in draw)
  strength: number;
  ribbon: number; // which ribbon this impact belongs to
};

type RibbonPoint = {
  x: number;
  y: number;
  glow: number; // 0..1 bend intensity near cursor
};

type Particle = {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  vx: number;
  vy: number;
  size: number;
  twinkleOffset: number;
};

// =========================
// PARTICLE CONFIG
// =========================
const PARTICLE_CONFIG = {
  count: 65, // amount of particles

  sizeMin: 1.1,
  sizeMax: 3.4,

  // motion
  springToBase: 0.008,
  damping: 0.9,
  floatAmp: 5,
  maxSpeed: 1.8,

  // cursor interaction
  cursorInfluenceRadiusMultiplier: 0.3, // % of min(screenWidth, screenHeight)
  cursorRepelStrength: 0.4,

  // twinkle
  twinkleSpeed: 2.0,
  twinkleMin: 0.4,
  twinkleMax: 0.65,

  // colour & glow (blueprint tint)
  color: "170,210,255", // base RGB
  glowOpacity: 0.5, // base opacity
  glowBoostNearCursor: 0.4, // extra glow when close to cursor
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
  const particlesRef = useRef<Particle[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;

    const initParticles = () => {
      const { innerWidth, innerHeight } = window;
      const particles: Particle[] = [];

      for (let i = 0; i < PARTICLE_CONFIG.count; i++) {
        const x = Math.random() * innerWidth;
        const y = Math.random() * innerHeight;
        particles.push({
          x,
          y,
          baseX: x,
          baseY: y,
          vx: 0,
          vy: 0,
          size:
            PARTICLE_CONFIG.sizeMin +
            Math.random() *
              (PARTICLE_CONFIG.sizeMax - PARTICLE_CONFIG.sizeMin),
          twinkleOffset: Math.random() * Math.PI * 2,
        });
      }

      particlesRef.current = particles;
    };

    const resize = () => {
      const { innerWidth, innerHeight } = window;
      canvas.width = innerWidth * dpr;
      canvas.height = innerHeight * dpr;
      canvas.style.width = `${innerWidth}px`;
      canvas.style.height = `${innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // re-seed particles to fit new viewport
      initParticles();
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

      // ===== BACKGROUND: match blueprint hues + volumetrics =====
      ctx.globalCompositeOperation = "source-over";

      // vertical gradient: black → navy → blueprint
      const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
      bgGrad.addColorStop(0, "#020617");
      bgGrad.addColorStop(0.45, "#020617");
      bgGrad.addColorStop(0.72, "#0057c2");
      bgGrad.addColorStop(1, "#003c86");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      // radial bright band near the “seam” so it matches the middle glow
      ctx.globalCompositeOperation = "screen";
      const seamY = h * 0.78;
      const seamGlow = ctx.createRadialGradient(
        w * 0.5,
        seamY,
        0,
        w * 0.5,
        seamY,
        h * 0.6
      );
      seamGlow.addColorStop(0, "rgba(10,119,255,0.9)");
      seamGlow.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = seamGlow;
      ctx.fillRect(0, h * 0.5, w, h * 0.5);

      // soft volumetric blue fog
      const fogLeft = ctx.createRadialGradient(
        w * 0.2,
        h * 0.18,
        0,
        w * 0.2,
        h * 0.18,
        h * 0.85
      );
      fogLeft.addColorStop(0, "rgba(56,189,248,0.4)");
      fogLeft.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = fogLeft;
      ctx.fillRect(0, 0, w, h);

      const fogRight = ctx.createRadialGradient(
        w * 0.85,
        h * 0.05,
        0,
        w * 0.85,
        h * 0.05,
        h * 0.9
      );
      fogRight.addColorStop(0, "rgba(37,99,235,0.5)");
      fogRight.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = fogRight;
      ctx.fillRect(0, 0, w, h);

      // blueprint-style grid only in lower part, fading out towards the bottom
      ctx.globalCompositeOperation = "source-over";
      ctx.save();
      const gridTop = h * 0.55;
      const gridSize = 80;

      ctx.beginPath();
      ctx.rect(0, gridTop, w, h - gridTop);
      ctx.clip();

      ctx.lineWidth = 1;

      // vertical lines
      for (let x = 0; x <= w; x += gridSize) {
        const centerFactor = 1 - Math.abs(x - w / 2) / (w / 2);
        const baseAlpha = 0.1 + centerFactor * 0.16;
        ctx.strokeStyle = `rgba(255,255,255,${baseAlpha})`;
        ctx.beginPath();
        ctx.moveTo(x, gridTop);
        ctx.lineTo(x, h);
        ctx.stroke();
      }

      // horizontal lines – fade to 0 alpha at very bottom so the grid feels
      // like it continues into the next blueprint section instead of a hard stop
      for (let y = gridTop; y <= h; y += gridSize) {
        const tLine = (y - gridTop) / (h - gridTop + 1);
        const alpha = 0.28 * (1 - tLine); // 0.28 at top → 0 at bottom
        ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      ctx.restore();
      // ===== END BACKGROUND =====

      const ribbonCount = 2;
      const segmentCount = 400;

      // ==== wobble config ====
      const wavelength = 70;
      const oscillationSpeed = 40;
      const decayTime = 0.15;
      const spatialFalloff = 150;
      const minStrength = 0.1;
      const maxStrength = 25;
      const hitRadius = 25;
      const minHitGap = 0.07;
      // ========================

      const maxImpactAge = decayTime * 4;
      const globalImpacts = impactsRef.current.filter(
        (imp) => t - imp.time < maxImpactAge
      );
      impactsRef.current = globalImpacts;

      ctx.globalCompositeOperation = "lighter";

      // ===== Tiny cursor-reactive particles (under ribbons, using config) =====
      const particles = particlesRef.current;

      const influenceRadius =
        Math.min(w, h) * PARTICLE_CONFIG.cursorInfluenceRadiusMultiplier;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // spring back toward home
        const bx = p.baseX - p.x;
        const by = p.baseY - p.y;
        p.vx += bx * PARTICLE_CONFIG.springToBase;
        p.vy += by * PARTICLE_CONFIG.springToBase;

        // cursor repulsion effect
        const dx = mx - p.x;
        const dy = my - p.y;
        const dist = Math.hypot(dx, dy) || 0.001;

        let glowBoost = 0;

        if (dist < influenceRadius) {
          const strength =
            (1 - dist / influenceRadius) *
            PARTICLE_CONFIG.cursorRepelStrength;

          const ux = dx / dist;
          const uy = dy / dist;

          // push away
          p.vx -= ux * strength;
          p.vy -= uy * strength;

          glowBoost = PARTICLE_CONFIG.glowBoostNearCursor * strength;
        }

        // floating motion
        p.vx +=
          Math.sin(t * 0.6 + p.twinkleOffset) *
          PARTICLE_CONFIG.floatAmp *
          0.1;
        p.vy +=
          Math.cos(t * 0.4 + p.twinkleOffset) *
          PARTICLE_CONFIG.floatAmp *
          0.1;

        // damping
        p.vx *= PARTICLE_CONFIG.damping;
        p.vy *= PARTICLE_CONFIG.damping;

        // speed clamp
        const vLen = Math.hypot(p.vx, p.vy);
        if (vLen > PARTICLE_CONFIG.maxSpeed) {
          p.vx = (p.vx / vLen) * PARTICLE_CONFIG.maxSpeed;
          p.vy = (p.vy / vLen) * PARTICLE_CONFIG.maxSpeed;
        }

        // integrate
        p.x += p.vx;
        p.y += p.vy;

        // twinkle amount (0..1)
        const twinklePhase =
          Math.sin(
            t * PARTICLE_CONFIG.twinkleSpeed + p.twinkleOffset
          ) *
            0.5 +
          0.5;

        const twinkle =
          PARTICLE_CONFIG.twinkleMin +
          (PARTICLE_CONFIG.twinkleMax - PARTICLE_CONFIG.twinkleMin) *
            twinklePhase;

        let alpha = PARTICLE_CONFIG.glowOpacity + glowBoost;
        if (alpha > 1) alpha = 1;
        if (alpha < 0) alpha = 0;

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * twinkle, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${PARTICLE_CONFIG.color},${alpha})`;
        ctx.fill();
      }
      // =============================================================

      // ===== RIBBONS (drawn on top of particles, with blueprint tint) =====
      for (let i = 0; i < ribbonCount; i++) {
        const progress = i / (ribbonCount - 1 || 1);
        const baseY = h * (0.2 + progress * 0.6);

        const speed = 0.1 + progress * 0.35;
        const amplitude = 30 + progress * 55;
        const secondaryAmp = amplitude * 0.2;

        const phase = t * speed * 1.8 + i * 0.9;

        // 1) base curve with wobble
        const rawPoints: { x: number; y: number }[] = [];

        for (let j = 0; j <= segmentCount; j++) {
          const pct = j / segmentCount;
          const x = pct * (w + 200) - 100;

          const baseWave =
            Math.sin(pct * 6 + phase) * amplitude +
            Math.cos(pct * 3.4 - phase * 0.7) * secondaryAmp;

          let y = baseY + baseWave + Math.sin(t * 0.9 + i) * 8;

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

        // hit detection
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

        // ==== cursor bend + glow ====
        const influenceRadiusRibbon = Math.min(w, h) * 0.35;
        const innerRadius = influenceRadiusRibbon * 0.25;
        const maxPush = 35;
        const span = Math.max(influenceRadiusRibbon - innerRadius, 5);

        const bentPoints: RibbonPoint[] = rawPoints.map((p) => {
          const dx = p.x - mx;
          const dy = p.y - my;
          const dist = Math.hypot(dx, dy);

          if (dist === 0 || dist > influenceRadiusRibbon) {
            return { x: p.x, y: p.y, glow: 0 };
          }

          let strength: number;
          if (dist <= innerRadius) {
            strength = 1;
          } else {
            const tNorm = (dist - innerRadius) / span;
            const tClamped = Math.min(Math.max(tNorm, 0), 1);
            const smooth = tClamped * tClamped * (3 - 2 * tClamped);
            strength = 1 - smooth;
          }

          const push = maxPush * strength;
          const ux = dx / (dist || 1);
          const uy = dy / (dist || 1);

          return {
            x: p.x + ux * push,
            y: p.y + uy * push,
            glow: strength,
          };
        });

        // smooth out
        const points: RibbonPoint[] = bentPoints.map((p) => ({ ...p }));
        const smoothPasses = 2;
        const smoothFactor = 1;

        for (let pass = 0; pass < smoothPasses; pass++) {
          for (let j = 1; j < points.length - 1; j++) {
            const prev = points[j - 1];
            const curr = points[j];
            const next = points[j + 1];

            const avgY = (prev.y + curr.y + next.y) / 3;
            const avgGlow = (prev.glow + curr.glow + next.glow) / 3;

            points[j].y = curr.y * (1 - smoothFactor) + avgY * smoothFactor;
            points[j].glow =
              curr.glow * (1 - smoothFactor) + avgGlow * smoothFactor;
          }
        }

        const baseWidth = 20 + progress * 10;

        // ---- ribbon body with slight blueprint tint ----
        const bodyGrad = ctx.createLinearGradient(0, baseY - 80, 0, baseY + 80);
        bodyGrad.addColorStop(0, "rgba(255,255,255,0.06)");
        bodyGrad.addColorStop(0.5, "rgba(240,248,255,0.22)");
        bodyGrad.addColorStop(1, "rgba(176,210,255,0.12)");

        ctx.beginPath();
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        points.forEach((p, idx) => {
          if (idx === 0) ctx.moveTo(p.x, p.y);
          else ctx.lineTo(p.x, p.y);
        });
        ctx.strokeStyle = bodyGrad;
        ctx.lineWidth = baseWidth;
        ctx.stroke();

        // ---- base highlight (blue-tinted edge) ----
        const twistSpeed = 1.4;
        const twistFreq = 4;

        const highlightPoints: { x: number; y: number; glow: number }[] = [];

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

          highlightPoints.push({ x: hx, y: hy, glow: p.glow });
        }

        // constant highlight edge (cool white → cyan)
        const edgeGrad = ctx.createLinearGradient(
          0,
          baseY - 40,
          0,
          baseY + 40
        );
        edgeGrad.addColorStop(0, "rgba(236,245,255,1)");
        edgeGrad.addColorStop(1, "rgba(129,230,217,1)");

        ctx.beginPath();
        highlightPoints.forEach((p, idx) => {
          if (idx === 0) ctx.moveTo(p.x, p.y);
          else ctx.lineTo(p.x, p.y);
        });
        ctx.strokeStyle = edgeGrad;
        ctx.lineWidth = baseWidth * 0.4;
        ctx.stroke();

        // ---- gradient glow near bend (blue-cyan glow) ----
        let maxGlow = 0;
        let maxGlowIndex = 0;
        for (let j = 0; j < points.length; j++) {
          if (points[j].glow > maxGlow) {
            maxGlow = points[j].glow;
            maxGlowIndex = j;
          }
        }

        if (maxGlow > 0.03) {
          const halfWindow = 50;
          const startIdx = Math.max(0, maxGlowIndex - halfWindow);
          const endIdx = Math.min(points.length - 1, maxGlowIndex + halfWindow);

          const startPt = highlightPoints[startIdx];
          const endPt = highlightPoints[endIdx];

          const grad = ctx.createLinearGradient(
            startPt.x,
            startPt.y,
            endPt.x,
            endPt.y
          );

          const midAlpha = 0.35 + maxGlow * 0.9;

          grad.addColorStop(0.0, "rgba(59,130,246,0)");
          grad.addColorStop(
            0.25,
            `rgba(56,189,248,${midAlpha * 0.35})`
          );
          grad.addColorStop(0.5, `rgba(56,189,248,${midAlpha})`);
          grad.addColorStop(
            0.75,
            `rgba(129,230,217,${midAlpha * 0.45})`
          );
          grad.addColorStop(1.0, "rgba(59,130,246,0)");

          ctx.save();
          ctx.strokeStyle = grad;
          ctx.lineWidth = baseWidth * (0.35 + maxGlow * 0.15);

          ctx.shadowColor = `rgba(56,189,248,${midAlpha})`;
          ctx.shadowBlur = baseWidth * 1.6;

          ctx.beginPath();
          ctx.moveTo(startPt.x, startPt.y);
          for (let j = startIdx + 1; j <= endIdx; j++) {
            const p = highlightPoints[j];
            ctx.lineTo(p.x, p.y);
          }
          ctx.stroke();
          ctx.restore();
        }
      }
      // ===== end ribbons =====

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

      {/* overlay to keep content readable but let colour through */}
      <div className="pointer-events-none absolute inset-0 z-10 bg-black/15" />

      {/* content */}
      <div className="relative z-20 mx-auto flex w-full max-w-6xl flex-col items-center gap-10 px-6 text-center md:items-start md:px-10 md:text-left">
        {/* heading pill */}
        <div className="mt-16 inline-flex items-center gap-2 rounded-full border border-cyan-300/25 bg-cyan-500/10 px-4 py-1 text-xs text-cyan-50/90 backdrop-blur-sm">
          <span className="rounded-full bg-cyan-400/20 px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wide text-cyan-50">
            Web • Systems • Automation
          </span>
          <span className="text-[0.7rem] text-cyan-50/80">
            Engineered builds for serious businesses
          </span>
        </div>

        {/* main heading */}
        <div className="space-y-4">
          <h1 className="text-4xl font-semibold tracking-tight md:text-6xl">
            Fast, engineered{" "}
            <span className="bg-gradient-to-r from-cyan-200 via-sky-300 to-blue-400 bg-clip-text text-transparent">
              websites.
            </span>
          </h1>

          <h2 className="text-3xl font-semibold tracking-tight md:text-5xl">
            Automation systems that{" "}
            <span className="bg-gradient-to-r from-cyan-200 via-sky-300 to-blue-400 bg-clip-text text-transparent">
              actually ship work.
            </span>
          </h2>
        </div>

        {/* subcopy */}
        <p className="max-w-2xl text-sm text-cyan-50/80 md:text-base">
          I&apos;m a full-stack engineer with a media and design background. I
          build high-performance marketing sites and wire them into CRMs,
          automations and AI flows so your team spends less time clicking and
          more time selling.
        </p>

        {/* buttons */}
        <div className="mt-2 flex flex-wrap items-center justify-center gap-4 md:justify-start">
          <button
            onClick={() => scrollToSection("contact")}
            className="rounded-full bg-white text-black px-8 py-3 text-sm font-medium transition hover:bg-white/90"
          >
            Book a free call
          </button>

          <button
            onClick={() => scrollToSection("blueprint")}
            className="rounded-full border border-cyan-200/60 px-8 py-3 text-sm font-medium text-cyan-50/90 transition hover:border-cyan-100 hover:text-white"
          >
            Explore what I build
          </button>
        </div>

        {/* trust row */}
        <div className="mt-6 flex items-center gap-3 text-xs text-cyan-100/70">
          <span className="h-px w-10 bg-cyan-200/60" />
          <span>Built for founders, agencies &amp; real operators.</span>
        </div>
      </div>

      {/* scroll arrow */}
      <div className="absolute bottom-7 left-1/2 z-20 -translate-x-1/2">
        <button
          onClick={() => scrollToSection("blueprint")}
          className="group flex h-10 w-10 items-center justify-center rounded-full border border-cyan-200/40 text-cyan-50/90 transition hover:border-cyan-100"
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

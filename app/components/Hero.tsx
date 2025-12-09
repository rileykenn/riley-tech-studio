"use client";

import React, { useEffect, useRef } from "react";
import LogoTrain from "./LogoTrain";

type MouseState = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  speed: number; // pixels per ms
  lastTime: number;
};

type Impact = {
  x: number;
  time: number;
  strength: number;
  ribbon: number;
};

type RibbonPoint = {
  x: number;
  y: number;
  glow: number;
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

const PARTICLE_CONFIG = {
  count: 25,
  sizeMin: 1.1,
  sizeMax: 3.4,
  springToBase: 0.008,
  damping: 0.9,
  floatAmp: 5,
  maxSpeed: 1.8,
  cursorInfluenceRadiusMultiplier: 0.3,
  cursorRepelStrength: 0.4,
  twinkleSpeed: 2.0,
  twinkleMin: 0.4,
  twinkleMax: 0.65,
  // blueprint-tinted particles (same family as old hero)
  color: "170,210,255",
  glowOpacity: 0.45,
  glowBoostNearCursor: 0.35,
};

// Simple Safari detection (to hide visible orbs there)
const isSafari =
  typeof window !== "undefined" &&
  typeof navigator !== "undefined" &&
  /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

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

  const heroRef = useRef<HTMLElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const textBlockRef = useRef<HTMLDivElement | null>(null);

  // wrapper that holds the mask
  const gridRef = useRef<HTMLDivElement | null>(null);
  // inner pattern that actually moves
  const gridPatternRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;

    const initParticles = (width: number, height: number) => {
      const particles: Particle[] = [];

      for (let i = 0; i < PARTICLE_CONFIG.count; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
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
      const heroEl = heroRef.current;
      const rect = heroEl?.getBoundingClientRect();
      const width = rect?.width ?? window.innerWidth;
      const height = rect?.height ?? window.innerHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      initParticles(width, height);
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
      const t = (timeMs - startTime) / 1000;

      const canvas = canvasRef.current;
      if (!canvas) return;

      const w = canvas.width / dpr;
      const h = canvas.height / dpr;

      const mouse = mouseRef.current;
      const mx = mouse.x * w;
      const my = mouse.y * h;
      const mouseSpeed = mouse.speed;

      // ===== BLUE BACKGROUND + VOLUMETRICS + POINT LIGHTS (from old hero) =====
      ctx.globalCompositeOperation = "source-over";

      // vertical gradient: deep navy → blueprint
      const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
      bgGrad.addColorStop(0, "#020617");
      bgGrad.addColorStop(0.45, "#020617");
      bgGrad.addColorStop(0.72, "#0057c2");
      bgGrad.addColorStop(1, "#003c86");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      // bright seam glow band near bottom third
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
      ctx.save();
      ctx.globalCompositeOperation = "screen";

      // Draw the seam glow normally (no clipping)
      ctx.fillStyle = seamGlow;
      ctx.fillRect(0, 0, w, h);

      // Create a vertical fade mask ABOVE the glow so it naturally softens
      const fade = ctx.createLinearGradient(0, h * 0.45, 0, h * 0.75);
      fade.addColorStop(0, "rgba(0,0,0,1)"); // fully block glow above
      fade.addColorStop(1, "rgba(0,0,0,0)"); // fully allow glow below

      ctx.globalCompositeOperation = "destination-out"; // subtract alpha
      ctx.fillStyle = fade;
      ctx.fillRect(0, 0, w, h);

      ctx.restore();

      // volumetric fog left
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

      // volumetric fog right
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

      // back to additive for particles/ribbons
      ctx.globalCompositeOperation = "lighter";
      // ===== END BACKGROUND =====

      const ribbonCount = 2;
      const segmentCount = 400;

      const wavelength = 70;
      const oscillationSpeed = 40;
      const decayTime = 0.15;
      const spatialFalloff = 150;
      const minStrength = 0.1;
      const maxStrength = 25;
      const hitRadius = 25;
      const minHitGap = 0.07;

      const maxImpactAge = decayTime * 4;
      const globalImpacts = impactsRef.current.filter(
        (imp) => t - imp.time < maxImpactAge
      );
      impactsRef.current = globalImpacts;

      const particles = particlesRef.current;
      const influenceRadius =
        Math.min(w, h) * PARTICLE_CONFIG.cursorInfluenceRadiusMultiplier;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        const bx = p.baseX - p.x;
        const by = p.baseY - p.y;
        p.vx += bx * PARTICLE_CONFIG.springToBase;
        p.vy += by * PARTICLE_CONFIG.springToBase;

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

          p.vx -= ux * strength;
          p.vy -= uy * strength;

          glowBoost = PARTICLE_CONFIG.glowBoostNearCursor * strength;
        }

        p.vx +=
          Math.sin(t * 0.6 + p.twinkleOffset) *
          PARTICLE_CONFIG.floatAmp *
          0.1;
        p.vy +=
          Math.cos(t * 0.4 + p.twinkleOffset) *
          PARTICLE_CONFIG.floatAmp *
          0.1;

        p.vx *= PARTICLE_CONFIG.damping;
        p.vy *= PARTICLE_CONFIG.damping;

        const vLen = Math.hypot(p.vx, p.vy);
        if (vLen > PARTICLE_CONFIG.maxSpeed) {
          p.vx = (p.vx / vLen) * PARTICLE_CONFIG.maxSpeed;
          p.vy = (p.vy / vLen) * PARTICLE_CONFIG.maxSpeed;
        }

        p.x += p.vx;
        p.y += p.vy;

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

        // Safari is drawing the orbs as solid circles – keep the physics
        // but skip the actual visible draw there.
        if (!isSafari) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * twinkle, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${PARTICLE_CONFIG.color},${alpha})`;
          ctx.fill();
        }
      }

      for (let i = 0; i < ribbonCount; i++) {
        const progress = i / (ribbonCount - 1 || 1);
        const baseY = h * (0.2 + progress * 0.6);

        const speed = 0.1 + progress * 0.35;
        const amplitude = 30 + progress * 55;
        const secondaryAmp = amplitude * 0.2;

        const phase = t * speed * 1.8 + i * 0.9;

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

        ctx.beginPath();
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        points.forEach((p, idx) => {
          if (idx === 0) ctx.moveTo(p.x, p.y);
          else ctx.lineTo(p.x, p.y);
        });
        ctx.strokeStyle = "rgba(255,255,255,0.18)";
        ctx.lineWidth = baseWidth;
        ctx.stroke();

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

        ctx.save();
        ctx.beginPath();
        highlightPoints.forEach((p, idx) => {
          if (idx === 0) ctx.moveTo(p.x, p.y);
          else ctx.lineTo(p.x, p.y);
        });
        ctx.strokeStyle = "rgba(240,240,240,1)";
        ctx.lineWidth = baseWidth * 0.4;
        ctx.shadowColor = "rgba(0,232,255,88)";
        ctx.shadowBlur = baseWidth * 4;
        ctx.stroke();
        ctx.restore();

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

          const midAlpha = 0.1 + maxGlow * 4;

          grad.addColorStop(0.0, "rgba(255,255,255,0)");
          grad.addColorStop(
            0.25,
            `rgba(255,255,255,${midAlpha * 0.4})`
          );
          grad.addColorStop(0.5, `rgba(255,255,255,${midAlpha})`);
          grad.addColorStop(
            0.75,
            `rgba(255,255,255,${midAlpha * 0.4})`
          );
          grad.addColorStop(1.0, "rgba(255,255,255,0)");

          ctx.save();
          ctx.strokeStyle = grad;
          ctx.lineWidth = baseWidth * (0.35 + maxGlow * 0.15);
          ctx.shadowColor = `rgba(255,255,255,${midAlpha})`;
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

  // keep mask center aligned with text block
  useEffect(() => {
    const updateGridCenter = () => {
      if (!contentRef.current || !textBlockRef.current || !gridRef.current)
        return;

      const contentRect = contentRef.current.getBoundingClientRect();
      const textRect = textBlockRef.current.getBoundingClientRect();

      const centerRatio =
        (textRect.left + textRect.width / 2 - contentRect.left) /
        contentRect.width;

      const clamped = Math.max(0, Math.min(1, centerRatio));

      gridRef.current!.style.setProperty(
        "--grid-center-x",
        `${clamped * 100}%`
      );
    };

    updateGridCenter();
    window.addEventListener("resize", updateGridCenter);
    return () => window.removeEventListener("resize", updateGridCenter);
  }, []);

  // parallax scroll: move ONLY the grid pattern, not the mask
  useEffect(() => {
    const pattern = gridPatternRef.current;
    const hero = heroRef.current;
    if (!pattern || !hero) return;

    const handleScroll = () => {
      const rect = hero.getBoundingClientRect();
      const viewportHeight =
        window.innerHeight || document.documentElement.clientHeight;

      const sectionCenter = rect.top + rect.height / 2;
      const viewportCenter = viewportHeight / 2;

      const delta = sectionCenter - viewportCenter;

      // tweak 0.5 for more / less intensity
      const offset = delta * 0.5;

      pattern.style.transform = `translate3d(0, ${offset}px, 0)`;
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section
      ref={heroRef}
      className="relative w-full overflow-hidden bg-black text-white flex items-center min-h-screen min-h-[100svh]"
    >
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 z-0"
      />

      <div className="pointer-events-none absolute inset-0 z-10 bg-black/20" />

      <div
        ref={contentRef}
        className="relative z-20 mx-auto flex w-full max-w-6xl flex-col items-center gap-10 px-6 text-center md:items-start md:px-10 md:text-left"
      >
        {/* GRID: masked wrapper + moving pattern */}
        <div className="pointer-events-none absolute left-1/2 top-0 bottom-0 -translate-x-1/2 flex items-center">
          <div ref={gridRef} className="hero-grid">
            <div ref={gridPatternRef} className="hero-grid-pattern" />
          </div>
        </div>

        {/* TOP PILL – bluish glass */}
        <div className="mt-16 inline-flex items-center gap-2 rounded-full border border-sky-300/45 bg-gradient-to-r from-sky-500/40 via-sky-500/15 to-sky-400/40 px-4 py-1 text-xs text-sky-50/90 backdrop-blur-xl shadow-[0_0_26px_rgba(56,189,248,0.55)]">
          <span className="rounded-full bg-sky-900/50 px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wide text-sky-50">
            Web • Systems • Automation
          </span>
          <span className="text-[0.7rem] text-sky-50/80">
            Engineered builds for serious businesses
          </span>
        </div>

        <div
          ref={textBlockRef}
          className="flex w-full flex-col items-center gap-6 md:items-start"
        >
          <div className="space-y-4">
            <h1 className="text-4xl font-semibold tracking-tight md:text-6xl">
              Engineering{" "}
              <span
                className="hero-accent hero-accent--1"
                data-text="beautiful websites"
              >
                beautiful websites
              </span>
              ,
            </h1>

            <h2 className="text-3xl font-semibold tracking-tight md:text-5xl">
              <span
                className="hero-accent hero-accent--2"
                data-text="Automations"
              >
                Automations
              </span>
              , and{" "}
              <span
                className="hero-accent hero-accent--3"
                data-text="MVP apps."
              >
                MVP apps.
              </span>
            </h2>
          </div>

          <p className="max-w-2xl text-sm text-white/70 md:text-base">
            I&apos;m a full-stack engineer with a media and design background. I
            build high-performance marketing sites and wire them into CRMs,
            automations and AI flows so your team spends less time clicking and
            more time selling.
          </p>

          <div className="mt-2 flex flex-wrap items-center justify-center gap-4 md:justify-start">
            {/* BOOK A CALL – stronger blue-tinted glassy gradient */}
            <button
              onClick={() => scrollToSection("contact")}
              className="rounded-full border border-sky-100/70 bg-gradient-to-br from-sky-50/95 via-white to-sky-200/90 text-slate-900 px-8 py-3 text-sm font-medium shadow-[0_0_26px_rgba(56,189,248,0.55)] transition hover:from-sky-100/95 hover:via-white hover:to-sky-300/95 hover:shadow-[0_0_34px_rgba(56,189,248,0.75)]"
            >
              Book a free call
            </button>

            {/* EXPLORE BUTTON – keep as-is (glass / blue tint) */}
            <button
              onClick={() => scrollToSection("blueprint")}
              className="rounded-full border border-sky-200/35 bg-white/5 px-8 py-3 text-sm font-medium text-sky-50/90 backdrop-blur-md shadow-[0_0_18px_rgba(56,189,248,0.35)] transition hover:bg-white/10 hover:border-sky-100/80 hover:text-white"
            >
              Explore what I build
            </button>
          </div>

          <div className="mt-6 flex items-center gap-3 text-xs text-white/40">
            <span className="h-px w-10 bg-white/30" />
            <span>Built for founders, agencies &amp; real operators.</span>
          </div>
        </div>
      </div>

      {/* Logo billboard train at bottom of hero – wider and closer to edges */}
      <div className="absolute bottom-12 left-1/2 z-20 w-full max-w-6xl -translate-x-1/2 px-2 md:px-6">
        <LogoTrain />
      </div>

      <style jsx>{`
        /* HERO TEXT – base blue gradient + moving shine copy */
        .hero-accent {
          position: relative;
          display: inline-block;
          font-weight: 700;
          background: linear-gradient(120deg, #60a5ff, #8bcdff, #38bdf8);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          color: transparent;
          overflow: visible;
        }

        .hero-accent::before {
          content: attr(data-text);
          position: absolute;
          inset: 0;

          background-image: linear-gradient(
            120deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0) 35%,
            rgba(255, 255, 255, 0.95) 50%,
            rgba(255, 255, 255, 0) 65%,
            rgba(255, 255, 255, 0) 100%
          );
          background-size: 230% 100%;
          background-position: -130% 0;
          background-repeat: no-repeat;

          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          color: transparent;

          mix-blend-mode: screen;
          animation: hero-shine 4s linear infinite;
          pointer-events: none;
        }

        .hero-accent--1::before {
          animation-delay: 0s;
        }
        .hero-accent--2::before {
          animation-delay: 0.8s;
        }
        .hero-accent--3::before {
          animation-delay: 1.6s;
        }

        @keyframes hero-shine {
          0% {
            background-position: 130% 0; /* start off RIGHT */
          }
          65% {
            background-position: -130% 0; /* sweep to LEFT */
          }
          100% {
            background-position: -130% 0;
          }
        }

        /* GRID BEHIND TEXT */
        .hero-grid {
          position: relative;
          width: 2200px;
          height: 860px;
          z-index: -1;
          overflow: hidden;
          mask-image: radial-gradient(
            ellipse 40% 35% at var(--grid-center-x, 30%) 50%,
            rgba(0, 0, 0, 1) 0%,
            rgba(0, 0, 0, 0) 95%
          );
          -webkit-mask-image: radial-gradient(
            ellipse 40% 35% at var(--grid-center-x, 30%) 50%,
            rgba(0, 0, 0, 1) 0%,
            rgba(0, 0, 0, 0) 95%
          );
        }

        .hero-grid-pattern {
          position: absolute;
          inset: -200px 0;
          opacity: 2;
          will-change: transform;
          background-image: repeating-linear-gradient(
              0deg,
              rgba(255, 255, 255, 0.16) 0,
              rgba(255, 255, 255, 0.16) 1px,
              transparent 1px,
              transparent 64px
            ),
            repeating-linear-gradient(
              90deg,
              rgba(255, 255, 255, 0.16) 0,
              rgba(255, 255, 255, 0.16) 1px,
              transparent 1px,
              transparent 64px
            );
        }
      `}</style>
    </section>
  );
}

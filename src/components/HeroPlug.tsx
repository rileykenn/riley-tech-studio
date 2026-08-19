'use client';

import { useRef, useState } from 'react';
import { Plug } from '@phosphor-icons/react';
import plugFile from './hero-plug.json';

// "Powering the South Coast": one oversized plug in faint brand blue behind
// the hero, with a cable flowing out of it. Placement and cable shape live
// in hero-plug.json; on localhost a tuner panel (bottom-left) adjusts
// everything and "Lock it in" writes the values back into the code via the
// dev-only API route. The cable is a smooth spline through three draggable
// anchor dots; its junction with the plug's cord stub is fixed.

type Pt = [number, number];
type PlugConfig = {
  x: number;
  y: number;
  rotate: number;
  size: number;
  opacity: number;
  cable: Pt[];
};

const SAVED = plugFile as PlugConfig;
const IS_DEV = process.env.NODE_ENV === 'development';

// where the glyph's cord stub sits in the 3x canvas (icon occupies the
// top-right 256x256 of a 768x768 space)
const STUB: Pt = [544, 224];
// virtual point "behind" the stub keeping the junction tangent stable
const ENTRY_GHOST: Pt = [624, 144];

// Catmull-Rom spline through [STUB, ...anchors], emitted as cubic beziers
function cablePath(anchors: Pt[]): string {
  const last = anchors[anchors.length - 1];
  const prev = anchors.length > 1 ? anchors[anchors.length - 2] : STUB;
  const endGhost: Pt = [last[0] * 2 - prev[0], last[1] * 2 - prev[1]];
  const seq: Pt[] = [ENTRY_GHOST, STUB, ...anchors, endGhost];
  let d = `M ${STUB[0]} ${STUB[1]}`;
  for (let i = 1; i < seq.length - 2; i++) {
    const p0 = seq[i - 1];
    const p1 = seq[i];
    const p2 = seq[i + 1];
    const p3 = seq[i + 2];
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C ${c1x.toFixed(1)} ${c1y.toFixed(1)}, ${c2x.toFixed(1)} ${c2y.toFixed(1)}, ${p2[0]} ${p2[1]}`;
  }
  return d;
}

const sliderRow: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '52px 1fr 44px',
  alignItems: 'center',
  gap: '0.5rem',
  fontSize: '0.6875rem',
  fontWeight: 600,
  color: 'var(--color-foreground-muted)',
};

const panelBtn: React.CSSProperties = {
  padding: '0.375rem 0.875rem',
  borderRadius: 'var(--radius-md)',
  border: '1px solid var(--color-border)',
  background: 'var(--color-surface)',
  fontSize: '0.75rem',
  fontWeight: 600,
  color: 'var(--color-foreground)',
  cursor: 'pointer',
  fontFamily: 'inherit',
};

export default function HeroPlug() {
  const [cfg, setCfg] = useState<PlugConfig>(SAVED);
  const [tuning, setTuning] = useState(false);
  const [lockState, setLockState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const handlesSvg = useRef<SVGSVGElement>(null);
  const dragging = useRef<number | null>(null);

  const set = (key: 'x' | 'y' | 'rotate' | 'size' | 'opacity') =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setCfg((c) => ({ ...c, [key]: Number(e.target.value) }));

  // client coords -> the cable svg's local space (handles rotation for free)
  const toLocal = (e: React.PointerEvent): Pt | null => {
    const svg = handlesSvg.current;
    if (!svg) return null;
    const ctm = svg.getScreenCTM();
    if (!ctm) return null;
    const pt = new DOMPoint(e.clientX, e.clientY).matrixTransform(ctm.inverse());
    return [Math.round(pt.x), Math.round(pt.y)];
  };

  const onDrag = (e: React.PointerEvent) => {
    if (dragging.current === null) return;
    const p = toLocal(e);
    if (!p) return;
    const clamped: Pt = [
      Math.max(-300, Math.min(1100, p[0])),
      Math.max(-300, Math.min(1100, p[1])),
    ];
    setCfg((c) => ({
      ...c,
      cable: c.cable.map((a, i) => (i === dragging.current ? clamped : a)),
    }));
  };

  const lock = async () => {
    setLockState('saving');
    try {
      const res = await fetch('/api/dev/hero-plug', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cfg),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setLockState('saved');
      setTuning(false);
    } catch {
      setLockState('error');
    }
  };

  const d = cablePath(cfg.cable);
  const cableEnd = cfg.cable[cfg.cable.length - 1];

  const wrapperStyle: React.CSSProperties = {
    position: 'absolute',
    left: `${cfg.x}%`,
    top: `${cfg.y}%`,
    transform: `translate(-50%, -50%) rotate(${cfg.rotate}deg)`,
    pointerEvents: 'none',
    zIndex: 0,
    lineHeight: 0,
  };

  const cableSvgStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: -2 * cfg.size,
    width: cfg.size * 3,
    height: cfg.size * 3,
    overflow: 'visible',
    pointerEvents: 'none',
    color: 'var(--color-primary)',
  };

  return (
    <>
      {/* the artwork, at its faint resting opacity */}
      <div aria-hidden="true" className="hero-plug" style={{ ...wrapperStyle, opacity: cfg.opacity }}>
        <Plug size={cfg.size} weight="light" color="var(--color-primary)" />
        <svg aria-hidden="true" viewBox="0 0 768 768" style={cableSvgStyle}>
          <defs>
            <linearGradient
              id="hero-cord-fade"
              gradientUnits="userSpaceOnUse"
              x1={STUB[0]}
              y1={STUB[1]}
              x2={cableEnd[0]}
              y2={cableEnd[1]}
            >
              <stop offset="0" stopColor="currentColor" stopOpacity="1" />
              <stop offset="0.7" stopColor="currentColor" stopOpacity="0.55" />
              <stop offset="1" stopColor="currentColor" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d={d}
            fill="none"
            stroke="url(#hero-cord-fade)"
            strokeWidth="12"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* full-opacity drag handles over the same geometry, tuning only */}
      {IS_DEV && tuning && (
        <div className="hero-plug" style={{ ...wrapperStyle, zIndex: 55 }}>
          <svg
            ref={handlesSvg}
            viewBox="0 0 768 768"
            style={{ ...cableSvgStyle, pointerEvents: 'none' }}
            onPointerMove={onDrag}
            onPointerUp={() => {
              dragging.current = null;
            }}
          >
            <path
              d={d}
              fill="none"
              stroke="var(--color-primary)"
              strokeWidth="2"
              strokeDasharray="4 6"
              opacity="0.5"
            />
            <circle cx={STUB[0]} cy={STUB[1]} r="7" fill="var(--color-foreground-subtle)" opacity="0.6" />
            {cfg.cable.map((a, i) => (
              <circle
                key={i}
                cx={a[0]}
                cy={a[1]}
                r="11"
                fill="#ffffff"
                stroke="var(--color-primary)"
                strokeWidth="3"
                style={{ pointerEvents: 'auto', cursor: 'grab' }}
                onPointerDown={(e) => {
                  dragging.current = i;
                  (e.target as SVGCircleElement).setPointerCapture(e.pointerId);
                }}
              />
            ))}
          </svg>
        </div>
      )}

      {IS_DEV && (
        <div
          style={{
            position: 'fixed',
            left: '1rem',
            bottom: '1rem',
            zIndex: 60,
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
            padding: tuning ? '0.875rem' : 0,
            borderRadius: 'var(--radius-md)',
            background: tuning ? 'var(--color-surface)' : 'transparent',
            border: tuning ? '1px solid var(--color-border)' : 'none',
            boxShadow: tuning ? 'var(--shadow-lg)' : 'none',
            width: tuning ? 260 : 'auto',
          }}
        >
          {!tuning ? (
            <button type="button" style={panelBtn} onClick={() => setTuning(true)}>
              Adjust plug (dev only)
            </button>
          ) : (
            <>
              <label style={sliderRow}>
                X
                <input type="range" min={0} max={100} step={0.5} value={cfg.x} onChange={set('x')} />
                <span>{cfg.x}%</span>
              </label>
              <label style={sliderRow}>
                Y
                <input type="range" min={0} max={100} step={0.5} value={cfg.y} onChange={set('y')} />
                <span>{cfg.y}%</span>
              </label>
              <label style={sliderRow}>
                Rotate
                <input type="range" min={-180} max={180} step={1} value={cfg.rotate} onChange={set('rotate')} />
                <span>{cfg.rotate}&deg;</span>
              </label>
              <label style={sliderRow}>
                Size
                <input type="range" min={200} max={900} step={10} value={cfg.size} onChange={set('size')} />
                <span>{cfg.size}</span>
              </label>
              <label style={sliderRow}>
                Fade
                <input
                  type="range"
                  min={0.04}
                  max={0.35}
                  step={0.01}
                  value={cfg.opacity}
                  onChange={set('opacity')}
                />
                <span>{cfg.opacity}</span>
              </label>
              <span style={{ fontSize: '0.6875rem', color: 'var(--color-foreground-subtle)' }}>
                Drag the white dots to shape the cable.
              </span>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                <button
                  type="button"
                  style={{
                    ...panelBtn,
                    background: 'var(--color-primary)',
                    borderColor: 'var(--color-primary)',
                    color: '#fff',
                  }}
                  onClick={lock}
                  disabled={lockState === 'saving'}
                >
                  {lockState === 'saving' ? 'Locking…' : 'Lock it in'}
                </button>
                <button type="button" style={panelBtn} onClick={() => setTuning(false)}>
                  Done
                </button>
              </div>
            </>
          )}
          {lockState === 'saved' && (
            <span style={{ fontSize: '0.6875rem', fontWeight: 600, color: 'var(--color-success)' }}>
              Saved to hero-plug.json
            </span>
          )}
          {lockState === 'error' && (
            <span style={{ fontSize: '0.6875rem', fontWeight: 600, color: 'var(--color-destructive)' }}>
              Save failed. Localhost only.
            </span>
          )}
        </div>
      )}
    </>
  );
}

'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { MAP_WIDTH, MAP_HEIGHT } from './holeMarkers';

// Cute low-poly kangaroos that hop around the course. They sample the base
// map texture so they only ever land on open grass, never on houses, trees,
// sand or water.

const SAMPLE_W = 1024;
const SAMPLE_H = 576;

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function useGrassSampler() {
  const [sampler, setSampler] = useState<((u: number, v: number) => boolean) | null>(null);

  useEffect(() => {
    const img = new window.Image();
    img.src = '/mapmedia/basemap.jpg';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = SAMPLE_W;
      canvas.height = SAMPLE_H;
      const ctx = canvas.getContext('2d', { willReadFrequently: false });
      if (!ctx) return;
      ctx.drawImage(img, 0, 0, SAMPLE_W, SAMPLE_H);
      const data = ctx.getImageData(0, 0, SAMPLE_W, SAMPLE_H).data;

      const isGrassPx = (px: number, py: number) => {
        const x = Math.min(SAMPLE_W - 1, Math.max(0, Math.round(px)));
        const y = Math.min(SAMPLE_H - 1, Math.max(0, Math.round(py)));
        const i = (y * SAMPLE_W + x) * 4;
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        // open fairway grass in the art: light yellow-green
        return g > 140 && r > 100 && g - b > 45 && g - r > 5 && r + g + b > 330;
      };

      setSampler(() => (u: number, v: number) => {
        if (u < 0.03 || u > 0.97 || v < 0.04 || v > 0.96) return false;
        const px = u * SAMPLE_W;
        const py = v * SAMPLE_H;
        // the whole footprint must be grass, not just the centre
        return (
          isGrassPx(px, py) &&
          isGrassPx(px + 5, py) &&
          isGrassPx(px - 5, py) &&
          isGrassPx(px, py + 5) &&
          isGrassPx(px, py - 5)
        );
      });
    };
  }, []);

  return sampler;
}

/* ---------- one kangaroo ---------- */

type RooState = 'pause' | 'hop' | 'graze' | 'scratch' | 'look';

function Kangaroo({
  seed,
  spawn,
  isGrass,
  frozen,
}: {
  seed: number;
  spawn: { u: number; v: number };
  isGrass: (u: number, v: number) => boolean;
  frozen: boolean;
}) {
  const root = useRef<THREE.Group>(null);
  const body = useRef<THREE.Group>(null);
  const head = useRef<THREE.Group>(null);
  const armR = useRef<THREE.Group>(null);
  const earL = useRef<THREE.Mesh>(null);
  const earR = useRef<THREE.Mesh>(null);
  const tail = useRef<THREE.Group>(null);

  const state = useRef({
    mode: 'pause' as RooState,
    t: 0,
    duration: 1,
    from: { x: (spawn.u - 0.5) * MAP_WIDTH, z: (spawn.v - 0.5) * MAP_HEIGHT },
    to: { x: (spawn.u - 0.5) * MAP_WIDTH, z: (spawn.v - 0.5) * MAP_HEIGHT },
    heading: 0,
    rand: mulberry32(seed),
  });

  const pickNext = () => {
    const s = state.current;
    const r = s.rand();
    if (r < 0.42) {
      // try to find a grassy hop target
      for (let attempt = 0; attempt < 10; attempt++) {
        const ang = s.rand() * Math.PI * 2;
        const dist = 0.35 + s.rand() * 0.55;
        const nx = s.to.x + Math.cos(ang) * dist;
        const nz = s.to.z + Math.sin(ang) * dist;
        const u = nx / MAP_WIDTH + 0.5;
        const v = nz / MAP_HEIGHT + 0.5;
        const mu = (s.to.x + Math.cos(ang) * dist * 0.5) / MAP_WIDTH + 0.5;
        const mv = (s.to.z + Math.sin(ang) * dist * 0.5) / MAP_HEIGHT + 0.5;
        if (isGrass(u, v) && isGrass(mu, mv)) {
          s.from = { ...s.to };
          s.to = { x: nx, z: nz };
          s.heading = Math.atan2(nx - s.from.x, nz - s.from.z);
          s.mode = 'hop';
          s.duration = 0.5 + s.rand() * 0.15;
          s.t = 0;
          return;
        }
      }
      s.mode = 'pause';
      s.duration = 0.8;
      s.t = 0;
    } else if (r < 0.62) {
      s.mode = 'graze';
      s.duration = 1.6 + s.rand() * 1.6;
      s.t = 0;
    } else if (r < 0.78) {
      s.mode = 'scratch';
      s.duration = 1.5;
      s.t = 0;
    } else if (r < 0.9) {
      s.mode = 'look';
      s.duration = 1.6;
      s.t = 0;
    } else {
      s.mode = 'pause';
      s.duration = 0.6 + s.rand() * 1.4;
      s.t = 0;
    }
  };

  useFrame((frame, delta) => {
    const s = state.current;
    if (!root.current || !body.current || !head.current || !armR.current || !tail.current) return;
    // ground plane sits at y=0.015; rest feet on it rather than clipping through
    const GROUND = 0.022;
    if (frozen) {
      root.current.position.set(s.to.x, GROUND, s.to.z);
      return;
    }

    s.t += delta;
    const p = Math.min(1, s.t / s.duration);
    const time = frame.clock.getElapsedTime();

    // defaults each frame (relaxed pose)
    let y = 0;
    let bodyPitch = 0.15;
    let headPitch = 0;
    let headYaw = 0;
    let armAngle = 0.5;
    let tailPitch = -0.35;

    if (s.mode === 'hop') {
      const hopH = 0.26;
      y = 4 * hopH * p * (1 - p);
      root.current.position.x = THREE.MathUtils.lerp(s.from.x, s.to.x, p);
      root.current.position.z = THREE.MathUtils.lerp(s.from.z, s.to.z, p);
      root.current.rotation.y = s.heading;
      bodyPitch = 0.45 - 0.5 * p; // lean into the jump, level out
      tailPitch = -0.05;
      armAngle = 0.9;
    } else {
      root.current.position.x = s.to.x;
      root.current.position.z = s.to.z;
      if (s.mode === 'graze') {
        const dip = Math.sin(Math.min(p, 0.25) / 0.25 * Math.PI * 0.5);
        bodyPitch = 0.55 * dip + 0.15;
        headPitch = 0.75 * dip;
        armAngle = 0.2;
      } else if (s.mode === 'scratch') {
        headPitch = 0.35 + Math.sin(time * 16) * 0.06;
        headYaw = 0.3;
        armAngle = 1.3 + Math.sin(time * 16) * 0.45; // fast little scratches
      } else if (s.mode === 'look') {
        headYaw = Math.sin(p * Math.PI * 2) * 0.65;
      }
      // idle breathing bob
      y = Math.abs(Math.sin(time * 2.2 + seed)) * 0.006;
    }

    root.current.position.y = GROUND + y;
    body.current.rotation.x = bodyPitch;
    head.current.rotation.x = headPitch;
    head.current.rotation.y = headYaw;
    armR.current.rotation.x = -armAngle;
    tail.current.rotation.x = tailPitch;

    // occasional ear twitch
    const twitch = Math.sin(time * 1.3 + seed * 7);
    const flick = twitch > 0.96 ? Math.sin(time * 40) * 0.25 : 0;
    if (earL.current) earL.current.rotation.z = 0.35 + flick;
    if (earR.current) earR.current.rotation.z = -0.35 - flick * 0.6;

    if (p >= 1) pickNext();
  });

  const FUR = '#c68f5e';
  const BELLY = '#e6c49a';
  const DARK = '#8a5f3c';

  return (
    <group ref={root} scale={0.16}>
      <group ref={body} position={[0, 0.42, 0]}>
        {/* torso */}
        <mesh position={[0, 0, -0.05]}>
          <boxGeometry args={[0.34, 0.5, 0.42]} />
          <meshStandardMaterial color={FUR} flatShading roughness={1} />
        </mesh>
        {/* belly */}
        <mesh position={[0, -0.06, 0.13]}>
          <boxGeometry args={[0.26, 0.34, 0.2]} />
          <meshStandardMaterial color={BELLY} flatShading roughness={1} />
        </mesh>
        {/* head */}
        <group ref={head} position={[0, 0.36, 0.1]}>
          <mesh>
            <boxGeometry args={[0.22, 0.22, 0.24]} />
            <meshStandardMaterial color={FUR} flatShading roughness={1} />
          </mesh>
          {/* snout */}
          <mesh position={[0, -0.045, 0.16]}>
            <boxGeometry args={[0.13, 0.11, 0.14]} />
            <meshStandardMaterial color={DARK} flatShading roughness={1} />
          </mesh>
          {/* ears */}
          <mesh ref={earL} position={[-0.09, 0.17, -0.02]} rotation={[0, 0, 0.35]}>
            <coneGeometry args={[0.05, 0.18, 4]} />
            <meshStandardMaterial color={FUR} flatShading roughness={1} />
          </mesh>
          <mesh ref={earR} position={[0.09, 0.17, -0.02]} rotation={[0, 0, -0.35]}>
            <coneGeometry args={[0.05, 0.18, 4]} />
            <meshStandardMaterial color={FUR} flatShading roughness={1} />
          </mesh>
        </group>
        {/* arms */}
        <group ref={armR} position={[0.13, 0.08, 0.16]} rotation={[-0.5, 0, 0]}>
          <mesh position={[0, -0.08, 0]}>
            <boxGeometry args={[0.06, 0.16, 0.06]} />
            <meshStandardMaterial color={DARK} flatShading roughness={1} />
          </mesh>
        </group>
        <group position={[-0.13, 0.08, 0.16]} rotation={[-0.5, 0, 0]}>
          <mesh position={[0, -0.08, 0]}>
            <boxGeometry args={[0.06, 0.16, 0.06]} />
            <meshStandardMaterial color={DARK} flatShading roughness={1} />
          </mesh>
        </group>
      </group>
      {/* haunches */}
      <mesh position={[-0.17, 0.22, -0.08]}>
        <boxGeometry args={[0.12, 0.3, 0.3]} />
        <meshStandardMaterial color={FUR} flatShading roughness={1} />
      </mesh>
      <mesh position={[0.17, 0.22, -0.08]}>
        <boxGeometry args={[0.12, 0.3, 0.3]} />
        <meshStandardMaterial color={FUR} flatShading roughness={1} />
      </mesh>
      {/* feet */}
      <mesh position={[-0.16, 0.04, 0.08]}>
        <boxGeometry args={[0.1, 0.08, 0.34]} />
        <meshStandardMaterial color={DARK} flatShading roughness={1} />
      </mesh>
      <mesh position={[0.16, 0.04, 0.08]}>
        <boxGeometry args={[0.1, 0.08, 0.34]} />
        <meshStandardMaterial color={DARK} flatShading roughness={1} />
      </mesh>
      {/* tail */}
      <group ref={tail} position={[0, 0.28, -0.28]} rotation={[-0.35, 0, 0]}>
        <mesh position={[0, -0.05, -0.16]} rotation={[1.25, 0, 0]}>
          <coneGeometry args={[0.09, 0.52, 5]} />
          <meshStandardMaterial color={FUR} flatShading roughness={1} />
        </mesh>
      </group>
    </group>
  );
}

/* ---------- the mob ---------- */

export default function Kangaroos({ frozen }: { frozen: boolean }) {
  const isGrass = useGrassSampler();

  const spawns = useMemo(() => {
    if (!isGrass) return [];
    const rand = mulberry32(2540);
    const found: { u: number; v: number }[] = [];
    let guard = 0;
    while (found.length < 7 && guard < 4000) {
      guard++;
      const u = 0.08 + rand() * 0.84;
      const v = 0.08 + rand() * 0.84;
      if (!isGrass(u, v)) continue;
      // keep the mob spread out
      if (found.some((f) => Math.hypot((f.u - u) * MAP_WIDTH, (f.v - v) * MAP_HEIGHT) < 1.4)) continue;
      found.push({ u, v });
    }
    return found;
  }, [isGrass]);

  if (!isGrass || spawns.length === 0) return null;

  return (
    <>
      {spawns.map((s, i) => (
        <Kangaroo key={i} seed={i * 37 + 11} spawn={s} isGrass={isGrass} frozen={frozen} />
      ))}
    </>
  );
}

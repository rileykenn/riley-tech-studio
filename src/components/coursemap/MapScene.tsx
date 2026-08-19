'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { MapControls, Html, useTexture, TransformControls } from '@react-three/drei';
import { EffectComposer, DepthOfField } from '@react-three/postprocessing';
import type { DepthOfFieldEffect } from 'postprocessing';
import type { MapControls as MapControlsImpl } from 'three-stdlib';
import {
  markerToWorld,
  worldToMarker,
  defaultCamera,
  MAP_WIDTH,
  MAP_HEIGHT,
  type HoleMarker,
  type TerrainConfig,
  type TreeConfig,
  type LensConfig,
  type HoleView,
} from './holeMarkers';
import Kangaroos from './Kangaroos';

export type CameraView = { position: [number, number, number]; target: [number, number, number] };

export type EditTarget = 'flag' | 'tee';

type MapSceneProps = {
  markers: HoleMarker[];
  tees: HoleMarker[];
  selectedHole: number | null;
  onSelectHole: (hole: number | null) => void;
  configMode: boolean;
  editHole: number | null;
  editTarget: EditTarget;
  onEditHole: (hole: number | null) => void;
  onMarkerDragged: (hole: number, u: number, v: number) => void;
  onTeeDragged: (hole: number, u: number, v: number) => void;
  onReady?: (api: { getView: () => CameraView }) => void;
  reducedMotion?: boolean;
  terrain: TerrainConfig;
  trees: TreeConfig;
  lens: LensConfig;
  // the hole currently driving the camera (selection, or preview in config
  // mode) and its saved view, if any
  cameraHole: number | null;
  holeView: HoleView | null;
  // manual pan/zoom/rotate is reserved for the config editor
  controlsEnabled: boolean;
  // depth-of-field post-processing is expensive; the embed disables it on
  // coarse-pointer (mobile) GPUs
  enableEffects?: boolean;
  // when set, that hole's tee button wears a pulsing "click here" nudge
  hintHole?: number | null;
  hintLabel?: string;
  // when set, the resting camera pulls back along its default sight line
  // until every hole marker projects inside the canvas (the hero's compact
  // embed; the case-study viewer keeps the hand-tuned default view)
  fitCourse?: boolean;
  // a hand-locked resting view; takes priority over fitCourse
  homeView?: CameraView;
};

const OUTER_SCALE = 1.5;

/* ---------- deterministic noise ---------- */

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function vnHash(x: number, z: number) {
  const s = Math.sin(x * 127.1 + z * 311.7) * 43758.5453;
  return s - Math.floor(s);
}
function valueNoise(x: number, z: number) {
  const xi = Math.floor(x);
  const zi = Math.floor(z);
  const xf = x - xi;
  const zf = z - zi;
  const sx = xf * xf * (3 - 2 * xf);
  const sz = zf * zf * (3 - 2 * zf);
  const a = vnHash(xi, zi);
  const b = vnHash(xi + 1, zi);
  const c = vnHash(xi, zi + 1);
  const d = vnHash(xi + 1, zi + 1);
  return a + (b - a) * sx + (c - a) * sz + (a - b - c + d) * sx * sz;
}
function fbm(x: number, z: number) {
  return (
    0.55 * valueNoise(x * 0.32, z * 0.32) +
    0.3 * valueNoise(x * 0.75 + 13.7, z * 0.75 + 7.1) +
    0.15 * valueNoise(x * 1.6 + 41.3, z * 1.6 + 23.9)
  );
}

/* ---------- Ground ---------- */

function Ground() {
  const texture = useTexture('/mapmedia/basemap.jpg');
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.015, 0]}>
      <planeGeometry args={[MAP_WIDTH, MAP_HEIGHT]} />
      <meshBasicMaterial map={texture} toneMapped={false} />
    </mesh>
  );
}

function Surroundings() {
  const texture = useTexture('/mapmedia/basemap-outer.jpg');
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;

  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[MAP_WIDTH * OUTER_SCALE, MAP_HEIGHT * OUTER_SCALE]} />
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]}>
        <circleGeometry args={[70, 48]} />
        <meshBasicMaterial color="#4a7a44" />
      </mesh>
    </>
  );
}

/* ---------- Low-poly clouds ---------- */

type CloudSpec = {
  x: number;
  z: number;
  y: number;
  scale: number;
  speed: number;
  puffs: { dx: number; dz: number; dy: number; r: number }[];
};

function makeClouds(count: number, seedFn: () => number): CloudSpec[] {
  const clouds: CloudSpec[] = [];
  for (let i = 0; i < count; i++) {
    const puffCount = 3 + Math.floor(seedFn() * 3);
    const puffs = [];
    for (let p = 0; p < puffCount; p++) {
      puffs.push({
        dx: (seedFn() - 0.5) * 1.6,
        dz: (seedFn() - 0.5) * 0.8,
        dy: seedFn() * 0.25,
        r: 0.28 + seedFn() * 0.35,
      });
    }
    clouds.push({
      x: (seedFn() - 0.5) * MAP_WIDTH * 1.2,
      z: (seedFn() - 0.5) * MAP_HEIGHT * 1.1,
      y: 2.6 + seedFn() * 1.4,
      scale: 0.7 + seedFn() * 0.9,
      speed: 0.08 + seedFn() * 0.1,
      puffs,
    });
  }
  return clouds;
}

function Cloud({ spec, frozen }: { spec: CloudSpec; frozen: boolean }) {
  const group = useRef<THREE.Group>(null);
  const shadow = useRef<THREE.Mesh>(null);
  const x = useRef(spec.x);

  useFrame((_, delta) => {
    if (frozen || !group.current || !shadow.current) return;
    x.current += spec.speed * delta;
    const limit = MAP_WIDTH * 0.75;
    if (x.current > limit) x.current = -limit;
    group.current.position.x = x.current;
    shadow.current.position.x = x.current;
  });

  return (
    <>
      <group ref={group} position={[spec.x, spec.y, spec.z]} scale={spec.scale}>
        {spec.puffs.map((p, i) => (
          <mesh key={i} position={[p.dx, p.dy, p.dz]}>
            <icosahedronGeometry args={[p.r, 0]} />
            <meshStandardMaterial color="#ffffff" flatShading roughness={1} transparent opacity={0.96} />
          </mesh>
        ))}
      </group>
      <mesh
        ref={shadow}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[spec.x, 0.02, spec.z]}
        scale={spec.scale}
      >
        <circleGeometry args={[0.9, 6]} />
        <meshBasicMaterial color="#0a1628" transparent opacity={0.05} depthWrite={false} />
      </mesh>
    </>
  );
}

function Clouds({ frozen }: { frozen: boolean }) {
  const clouds = useMemo(() => makeClouds(8, mulberry32(42)), []);
  return (
    <>
      {clouds.map((c, i) => (
        <Cloud key={i} spec={c} frozen={frozen} />
      ))}
    </>
  );
}

/* ---------- Birds ---------- */

function Bird({ offset, frozen }: { offset: number; frozen: boolean }) {
  const body = useRef<THREE.Group>(null);
  const left = useRef<THREE.Mesh>(null);
  const right = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (frozen || !body.current || !left.current || !right.current) return;
    const t = clock.getElapsedTime();
    const flap = Math.sin(t * 9 + offset * 3) * 0.6;
    left.current.rotation.z = flap;
    right.current.rotation.z = -flap;
    const r = 5.5 + offset * 1.1;
    const speed = 0.12 + offset * 0.015;
    const a = t * speed + offset * 2.1;
    body.current.position.set(Math.cos(a) * r, 1.7 + Math.sin(t * 0.7 + offset) * 0.15, Math.sin(a) * r * 0.55);
    body.current.rotation.y = -a + Math.PI / 2;
  });

  const wingGeo = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.lineTo(0.16, 0.02);
    shape.lineTo(0.15, 0.055);
    shape.lineTo(0, 0.02);
    return new THREE.ShapeGeometry(shape);
  }, []);

  return (
    <group ref={body}>
      <mesh ref={left} geometry={wingGeo} rotation={[-Math.PI / 2.4, 0, 0]}>
        <meshBasicMaterial color="#3d5a80" side={THREE.DoubleSide} />
      </mesh>
      <mesh ref={right} geometry={wingGeo} rotation={[-Math.PI / 2.4, 0, Math.PI]}>
        <meshBasicMaterial color="#3d5a80" side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

/* ---------- Rolling forested hills ---------- */

function useGradedForestTexture(cfg: TerrainConfig) {
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [texture, setTexture] = useState<THREE.CanvasTexture | null>(null);

  useEffect(() => {
    const image = new window.Image();
    image.src = '/mapmedia/forest-tile.jpg';
    image.onload = () => setImg(image);
  }, []);

  useEffect(() => {
    if (!img) return;
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(img, 0, 0);
    const id = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const d = id.data;
    const black = cfg.blackPoint;
    const white = Math.max(black + 5, cfg.whitePoint);
    const range = white - black;
    const cf = (259 * (cfg.contrast + 255)) / (255 * (259 - cfg.contrast));
    const sat = cfg.saturation;
    for (let i = 0; i < d.length; i += 4) {
      let r = ((d[i] - black) / range) * 255;
      let g = ((d[i + 1] - black) / range) * 255;
      let b = ((d[i + 2] - black) / range) * 255;
      r = cf * (r - 128) + 128;
      g = cf * (g - 128) + 128;
      b = cf * (b - 128) + 128;
      const lum = 0.299 * r + 0.587 * g + 0.114 * b;
      d[i] = Math.max(0, Math.min(255, lum + (r - lum) * sat));
      d[i + 1] = Math.max(0, Math.min(255, lum + (g - lum) * sat));
      d[i + 2] = Math.max(0, Math.min(255, lum + (b - lum) * sat));
    }
    ctx.putImageData(id, 0, 0);
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.wrapS = THREE.MirroredRepeatWrapping;
    tex.wrapT = THREE.MirroredRepeatWrapping;
    tex.anisotropy = 8;
    setTexture((prev) => {
      prev?.dispose();
      return tex;
    });
  }, [img, cfg.blackPoint, cfg.whitePoint, cfg.contrast, cfg.saturation]);

  useEffect(() => {
    if (!texture) return;
    texture.repeat.set(cfg.texScale, cfg.texScale * 0.62);
    texture.needsUpdate = true;
  }, [texture, cfg.texScale]);

  return texture;
}

function Hills({ terrain }: { terrain: TerrainConfig }) {
  const texture = useGradedForestTexture(terrain);

  const geometry = useMemo(() => {
    const W = 52;
    const H = 34;
    const geo = new THREE.PlaneGeometry(W, H, 104, 68);
    const pos = geo.attributes.position;
    const flatX = (MAP_WIDTH * OUTER_SCALE) / 2 - 0.3;
    const flatZ = (MAP_HEIGHT * OUTER_SCALE) / 2 - 0.3;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = -pos.getY(i);
      const dx = Math.max(0, Math.abs(x) - flatX);
      const dz = Math.max(0, Math.abs(z) - flatZ);
      const d = Math.hypot(dx, dz);
      const env = Math.min(1, d / 5.5);
      const smooth = env * env * (3 - 2 * env);
      const h = smooth * terrain.elevation * (0.3 + fbm(x, z));
      pos.setZ(i, h);
    }
    geo.rotateX(-Math.PI / 2);
    geo.computeVertexNormals();
    return geo;
  }, [terrain.elevation]);

  useEffect(() => () => geometry.dispose(), [geometry]);

  if (!texture) return null;
  return (
    <mesh geometry={geometry} position={[0, -0.06, 0]}>
      <meshStandardMaterial map={texture} flatShading roughness={1} />
    </mesh>
  );
}

/* ---------- Instanced forest: organic clumped scatter ---------- */

const TREE_SHADES = ['#4a8a3d', '#549a44', '#5da84c', '#6bb75a', '#417a36'];

function ForestRing({ trees }: { trees: TreeConfig }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);

  const { matrices, shadeIndex } = useMemo(() => {
    const rand = mulberry32(1953);
    const dummy = new THREE.Object3D();
    const matrices: THREE.Matrix4[] = [];
    const shadeIndex: number[] = [];
    const innerX = MAP_WIDTH / 2 + 0.05;
    const innerZ = MAP_HEIGHT / 2 + 0.05;
    const outerX = (MAP_WIDTH * OUTER_SCALE) / 2 + 2.5;
    const outerZ = (MAP_HEIGHT * OUTER_SCALE) / 2 + 2.5;
    const TARGET = 700;
    let placed = 0;
    let guard = 0;
    while (placed < TARGET && guard < 40000) {
      guard++;
      const x = (rand() * 2 - 1) * outerX;
      const z = (rand() * 2 - 1) * outerZ;
      // keep the course clear
      if (Math.abs(x) < innerX && Math.abs(z) < innerZ) continue;
      // organic clumping: density from noise, gently higher near the course
      // edge, with no relation to the rectangle's straight sides
      const dx = Math.max(0, Math.abs(x) - innerX);
      const dz = Math.max(0, Math.abs(z) - innerZ);
      const edgeDist = Math.hypot(dx, dz);
      const clump = fbm(x * 0.9 + 71.3, z * 0.9 + 29.4);
      const density = Math.max(0.06, 0.85 - edgeDist * 0.09) * (clump * 1.5 - 0.15);
      if (rand() > density) continue;
      const s = 0.09 + rand() * 0.17;
      dummy.position.set(x, s * 0.7, z);
      dummy.scale.set(s, s * (0.9 + rand() * 0.5), s);
      dummy.rotation.y = rand() * Math.PI;
      dummy.updateMatrix();
      matrices.push(dummy.matrix.clone());
      shadeIndex.push(Math.floor(rand() * TREE_SHADES.length));
      placed++;
    }
    return { matrices, shadeIndex };
  }, []);

  // colors react to the config sliders
  useEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const hsl = { h: 0, s: 0, l: 0 };
    shadeIndex.forEach((si, i) => {
      const c = new THREE.Color(TREE_SHADES[si]);
      c.getHSL(hsl);
      c.setHSL(
        (hsl.h + trees.hue / 360 + 1) % 1,
        Math.min(1, Math.max(0, hsl.s * trees.saturation)),
        Math.min(1, Math.max(0, hsl.l * trees.lightness))
      );
      mesh.setColorAt(i, c);
    });
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, [trees.hue, trees.saturation, trees.lightness, shadeIndex]);

  return (
    <instancedMesh
      ref={(mesh) => {
        meshRef.current = mesh;
        if (!mesh) return;
        matrices.forEach((m, i) => mesh.setMatrixAt(i, m));
        mesh.count = matrices.length;
        mesh.instanceMatrix.needsUpdate = true;
      }}
      args={[undefined, undefined, 700]}
      frustumCulled={false}
    >
      <icosahedronGeometry args={[1, 0]} />
      <meshStandardMaterial flatShading roughness={1} />
    </instancedMesh>
  );
}

/* ---------- Hole markers, tees and flight line ---------- */

// The flag pin sits on the green: purely visual, no number
function FlagPin({
  hole,
  position,
  active,
  registerObject,
}: {
  hole: number;
  position: [number, number, number];
  active: boolean;
  registerObject: (hole: number, obj: THREE.Group | null) => void;
}) {
  return (
    <group position={position} ref={(obj) => registerObject(hole, obj)}>
      <mesh position={[0, 0.28, 0]}>
        <cylinderGeometry args={[0.012, 0.012, 0.56, 6]} />
        <meshStandardMaterial color="#ffffff" flatShading />
      </mesh>
      <mesh position={[0.09, 0.48, 0]} rotation={[0, 0, -0.08]}>
        <boxGeometry args={[0.18, 0.11, 0.015]} />
        <meshStandardMaterial color={active ? '#ffd23f' : '#ff5f4e'} flatShading />
      </mesh>
      <mesh position={[0, 0.02, 0]}>
        <cylinderGeometry args={[0.09, 0.11, 0.05, 8]} />
        <meshStandardMaterial color="#fdf6e3" flatShading />
      </mesh>
    </group>
  );
}

// The tee site carries the clickable hole number, like real tee signage
function TeeSite({
  hole,
  position,
  active,
  editing,
  hint,
  hintLabel,
  onClick,
  registerObject,
}: {
  hole: number;
  position: [number, number, number];
  active: boolean;
  editing: boolean;
  hint: boolean;
  hintLabel: string;
  onClick: () => void;
  registerObject: (hole: number, obj: THREE.Group | null) => void;
}) {
  const highlight = active || editing;

  return (
    <group position={position} ref={(obj) => registerObject(hole, obj)}>
      {/* golf ball on a peg, revealed when the hole is open or being edited */}
      {highlight && (
        <>
          <mesh position={[0, 0.09, 0]}>
            <icosahedronGeometry args={[0.05, 1]} />
            <meshStandardMaterial color="#ffffff" flatShading />
          </mesh>
          <mesh position={[0, 0.03, 0]}>
            <cylinderGeometry args={[0.012, 0.02, 0.07, 6]} />
            <meshStandardMaterial color="#ff5f4e" flatShading />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.012, 0]}>
            <ringGeometry args={[0.08, 0.11, 24]} />
            <meshBasicMaterial color="#ffd23f" transparent opacity={0.9} side={THREE.DoubleSide} />
          </mesh>
        </>
      )}
      <Html center position={[0, 0.5, 0]} zIndexRange={[10, 0]}>
        <div className="relative">
          {hint && (
            <>
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 animate-ping rounded-full bg-[#ffd23f]/80 motion-reduce:hidden"
              />
              <span aria-hidden="true" className="sigc-hole-hint">
                {hintLabel}
              </span>
            </>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation(); // keep tee clicks from triggering the click-away handler
              onClick();
            }}
            aria-label={`Open hole ${hole} details`}
            className={`relative flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border-[3px] text-base font-bold shadow-lg shadow-[#1d3557]/20 transition-transform duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
              highlight
                ? 'scale-110 border-[#ffd23f] bg-white text-[#1d3557]'
                : 'border-white bg-[#ffd23f] text-[#1d3557] hover:scale-110'
            }`}
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {hole}
          </button>
        </div>
      </Html>
    </group>
  );
}

function FlightLine({
  tee,
  flag,
  animate,
}: {
  tee: [number, number, number];
  flag: [number, number, number];
  animate: boolean;
}) {
  const progress = useRef(0);
  const ball = useRef<THREE.Mesh>(null);
  const lineObj = useMemo(() => {
    const start = new THREE.Vector3(tee[0], 0.1, tee[2]);
    const end = new THREE.Vector3(flag[0], 0.12, flag[2]);
    const mid = start.clone().lerp(end, 0.5);
    mid.y = 0.25 + start.distanceTo(end) * 0.28;
    const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
    const geo = new THREE.TubeGeometry(curve, 48, 0.022, 6, false);
    geo.setDrawRange(0, 0);
    const mat = new THREE.MeshBasicMaterial({ color: '#ffd23f', transparent: true, opacity: 0.95 });
    const mesh = new THREE.Mesh(geo, mat);
    return { mesh, curve, indexCount: geo.index ? geo.index.count : 0 };
  }, [tee, flag]);

  useEffect(() => {
    progress.current = 0;
    return () => {
      lineObj.mesh.geometry.dispose();
      (lineObj.mesh.material as THREE.Material).dispose();
    };
  }, [lineObj]);

  useFrame((_, delta) => {
    if (!animate) {
      progress.current = 1;
    } else if (progress.current < 1) {
      progress.current = Math.min(1, progress.current + delta * 0.9);
    }
    const p = progress.current;
    const eased = p * p * (3 - 2 * p);
    lineObj.mesh.geometry.setDrawRange(0, Math.floor(lineObj.indexCount * eased));
    if (ball.current) {
      const pos = lineObj.curve.getPoint(eased);
      ball.current.position.copy(pos);
      ball.current.visible = p < 0.999;
    }
  });

  return (
    <>
      <primitive object={lineObj.mesh} />
      <mesh ref={ball}>
        <icosahedronGeometry args={[0.045, 1]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
    </>
  );
}

/* ---------- Depth of field ---------- */

function Effects({
  lens,
  focusPoint,
  controlsRef,
}: {
  lens: LensConfig;
  focusPoint: [number, number, number] | null;
  controlsRef: React.RefObject<MapControlsImpl | null>;
}) {
  const dofRef = useRef<DepthOfFieldEffect>(null);
  const vec = useMemo(() => new THREE.Vector3(), []);

  useFrame(() => {
    const effect = dofRef.current;
    if (!effect) return;
    effect.bokehScale = lens.bokehScale;
    const coc = effect.circleOfConfusionMaterial;
    coc.worldFocusRange = lens.focusRange;
    if (lens.focusDistance != null) {
      effect.target = null;
      coc.worldFocusDistance = lens.focusDistance;
    } else if (focusPoint) {
      effect.target = vec.set(focusPoint[0], focusPoint[1], focusPoint[2]);
    } else if (controlsRef.current) {
      effect.target = controlsRef.current.target;
    }
  });

  return (
    <EffectComposer>
      <DepthOfField ref={dofRef} bokehScale={lens.bokehScale} focusDistance={0.02} focalLength={0.05} />
    </EffectComposer>
  );
}

/* ---------- Camera rig ---------- */

function CameraRig({
  selectedHole,
  markers,
  holeView,
  fov,
  controlsRef,
  controlsEnabled,
  onReady,
  reducedMotion,
  fitCourse = false,
  homeView,
}: {
  selectedHole: number | null;
  markers: HoleMarker[];
  holeView: HoleView | null;
  fov: number;
  controlsRef: React.RefObject<MapControlsImpl | null>;
  controlsEnabled: boolean;
  onReady?: (api: { getView: () => CameraView }) => void;
  reducedMotion?: boolean;
  fitCourse?: boolean;
  homeView?: CameraView;
}) {
  const camera = useThree((s) => s.camera);
  const size = useThree((s) => s.size);

  // Fit-to-course resting view: keep the default camera's target and sight
  // line, but solve for the distance at which every hole marker projects
  // inside the canvas with room for its bubble. Runs per canvas size, so any
  // container shape frames the whole course.
  const fittedHome = useMemo(() => {
    if (!fitCourse || homeView || size.width === 0 || size.height === 0) return null;
    const target = new THREE.Vector3(...defaultCamera.target);
    const sight = new THREE.Vector3(...defaultCamera.position).sub(target);
    const d0 = sight.length();
    sight.normalize();
    const points = markers.map((m) => new THREE.Vector3(...markerToWorld(m)));
    // px kept clear at each edge for the marker bubbles
    const limX = Math.max(0.5, 1 - (2 * 64) / size.width);
    const limY = Math.max(0.5, 1 - (2 * 56) / size.height);
    const probe = new THREE.PerspectiveCamera(fov, size.width / size.height, 0.1, 400);
    const v = new THREE.Vector3();
    let d = d0;
    for (let i = 0; i < 5; i++) {
      probe.position.copy(target).addScaledVector(sight, d);
      probe.up.set(0, 1, 0);
      probe.lookAt(target);
      probe.updateMatrixWorld(true);
      probe.updateProjectionMatrix();
      let worst = 0;
      for (const p of points) {
        v.copy(p).project(probe);
        worst = Math.max(worst, Math.abs(v.x) / limX, Math.abs(v.y) / limY);
      }
      if (worst <= 1.005) break;
      d *= worst;
    }
    // very narrow canvases would need absurd distance to fit everything;
    // beyond ~2.2x the course reads as a speck, so slight edge clipping wins
    d = Math.min(Math.max(d, d0), d0 * 2.2);
    return { position: target.clone().addScaledVector(sight, d), target };
  }, [fitCourse, markers, fov, size.width, size.height]);

  const HOME_POS = useMemo(
    () =>
      homeView
        ? new THREE.Vector3(...homeView.position)
        : fittedHome
          ? fittedHome.position.clone()
          : new THREE.Vector3(...defaultCamera.position),
    [homeView, fittedHome]
  );
  const HOME_TARGET = useMemo(
    () =>
      homeView
        ? new THREE.Vector3(...homeView.target)
        : fittedHome
          ? fittedHome.target.clone()
          : new THREE.Vector3(...defaultCamera.target),
    [homeView, fittedHome]
  );
  const goal = useMemo(
    () => ({ pos: HOME_POS.clone(), target: HOME_TARGET.clone(), active: false }),
    [HOME_POS, HOME_TARGET]
  );
  // keyframe ping-pong state (only for holes with a second keyframe)
  const loop = useMemo(
    () => ({
      armed: false,
      running: false,
      tau: 0,
      seconds: 8,
      p1: new THREE.Vector3(),
      t1: new THREE.Vector3(),
      p2: new THREE.Vector3(),
      t2: new THREE.Vector3(),
    }),
    []
  );

  const registered = useRef(false);
  if (!registered.current && onReady) {
    registered.current = true;
    onReady({
      getView: () => ({
        position: camera.position.toArray() as [number, number, number],
        target: (controlsRef.current?.target.toArray() ?? [0, 0, 0]) as [number, number, number],
      }),
    });
  }

  const lastSelection = useRef<number | null | undefined>(undefined);
  if (lastSelection.current !== selectedHole) {
    lastSelection.current = selectedHole;
    loop.armed = false;
    loop.running = false;
    loop.tau = 0;
    if (selectedHole === null) {
      goal.pos.copy(HOME_POS);
      goal.target.copy(HOME_TARGET);
    } else if (holeView) {
      goal.pos.set(...holeView.position);
      goal.target.set(...holeView.target);
      if (holeView.position2 && holeView.target2) {
        loop.armed = true;
        loop.seconds = Math.max(0.5, holeView.animSeconds ?? 8);
        loop.p1.set(...holeView.position);
        loop.t1.set(...holeView.target);
        loop.p2.set(...holeView.position2);
        loop.t2.set(...holeView.target2);
      }
    } else {
      const m = markers.find((h) => h.hole === selectedHole);
      if (m) {
        const [x, , z] = markerToWorld(m);
        goal.target.set(x, 0, z);
        goal.pos.set(x + 0.2, 3.1, z + 2.4);
      }
    }
    goal.active = true;
    if (reducedMotion) {
      camera.position.copy(goal.pos);
      controlsRef.current?.target.copy(goal.target);
      goal.active = false;
      loop.armed = false;
    }
  }

  // Re-home when the resting view itself changes (the compact embed updates
  // homeView once its container is measured). Selection changes are already
  // handled above; this only fires while the camera is at rest.
  const firstHome = useRef(true);
  useEffect(() => {
    if (firstHome.current) {
      firstHome.current = false;
      return;
    }
    if (lastSelection.current !== null) return;
    goal.pos.copy(HOME_POS);
    goal.target.copy(HOME_TARGET);
    goal.active = true;
    if (reducedMotion) {
      camera.position.copy(goal.pos);
      controlsRef.current?.target.copy(goal.target);
      goal.active = false;
    }
  }, [HOME_POS, HOME_TARGET, goal, camera, controlsRef, reducedMotion]);

  useFrame((_, delta) => {
    // fov glides toward the active lens setting
    const cam = camera as THREE.PerspectiveCamera;
    if (Math.abs(cam.fov - fov) > 0.05) {
      cam.fov = THREE.MathUtils.lerp(cam.fov, fov, 1 - Math.pow(0.002, delta));
      cam.updateProjectionMatrix();
    }

    if (!controlsRef.current) return;
    const t = controlsRef.current.target;
    t.x = THREE.MathUtils.clamp(t.x, -MAP_WIDTH / 2 - 0.5, MAP_WIDTH / 2 + 0.5);
    t.z = THREE.MathUtils.clamp(t.z, -MAP_HEIGHT / 2 - 0.5, MAP_HEIGHT / 2 + 0.5);

    if (goal.active) {
      const k = 1 - Math.pow(0.001, delta);
      camera.position.lerp(goal.pos, k);
      controlsRef.current.target.lerp(goal.target, k);
      if (camera.position.distanceTo(goal.pos) < 0.02) {
        goal.active = false;
        if (loop.armed) loop.running = true;
      }
      return;
    }

    // slow keyframe ping-pong: 1 -> 2 -> 1, cosine-eased so it never jerks
    if (loop.running) {
      loop.tau = (loop.tau + delta / loop.seconds) % 2;
      const s = (1 - Math.cos(Math.PI * loop.tau)) / 2;
      camera.position.lerpVectors(loop.p1, loop.p2, s);
      controlsRef.current.target.lerpVectors(loop.t1, loop.t2, s);
    }
  });

  return (
    <MapControls
      ref={controlsRef}
      enabled={controlsEnabled}
      target={[HOME_TARGET.x, HOME_TARGET.y, HOME_TARGET.z]}
      enableDamping
      dampingFactor={0.08}
      minDistance={1.6}
      maxDistance={13}
      maxPolarAngle={Math.PI / 2.6}
      onStart={() => {
        // the user grabbed the camera: stop any fly-to or keyframe loop
        goal.active = false;
        loop.running = false;
        loop.armed = false;
      }}
    />
  );
}

/* ---------- Scene root ---------- */

export default function MapScene({
  markers,
  tees,
  selectedHole,
  onSelectHole,
  configMode,
  editHole,
  editTarget,
  onEditHole,
  onMarkerDragged,
  onTeeDragged,
  onReady,
  reducedMotion,
  terrain,
  trees,
  lens,
  cameraHole,
  holeView,
  controlsEnabled,
  enableEffects = true,
  hintHole = null,
  hintLabel = 'Click me!',
  fitCourse = false,
  homeView,
}: MapSceneProps) {
  const frozen = !!reducedMotion;
  const controlsRef = useRef<MapControlsImpl | null>(null);
  // Plain ref maps (never state): ref callbacks re-fire on every render with a
  // fresh identity; writing them into state loops forever. The gizmo only
  // reads these after a click, which triggers its own render.
  const pinObjects = useRef<Record<number, THREE.Group | null>>({});
  const teeObjects = useRef<Record<number, THREE.Group | null>>({});

  const activeHole = configMode ? editHole : selectedHole;
  const activeMarker = activeHole !== null ? markers.find((m) => m.hole === activeHole) : undefined;
  const activeTee = activeHole !== null ? tees.find((t) => t.hole === activeHole) : undefined;

  const editObject =
    configMode && editHole !== null
      ? editTarget === 'flag'
        ? (pinObjects.current[editHole] ?? null)
        : (teeObjects.current[editHole] ?? null)
      : null;

  const focusPoint = activeMarker ? markerToWorld(activeMarker) : null;

  return (
    <>
      <color attach="background" args={['#aadcf7']} />
      <fog attach="fog" args={['#c3e8fc', 16, 40]} />
      <ambientLight intensity={1.25} color="#fffaf0" />
      <hemisphereLight args={['#cde9ff', '#9fc78a', 0.55]} />
      <directionalLight position={[6, 10, 4]} intensity={1.0} color="#fff2d0" />

      <Ground />
      <Surroundings />
      <Hills terrain={terrain} />
      <ForestRing trees={trees} />
      <Clouds frozen={frozen} />
      <group>
        {[0, 1, 2, 3, 4].map((i) => (
          <Bird key={i} offset={i} frozen={frozen} />
        ))}
      </group>
      <Kangaroos frozen={frozen} />

      {/* flags mark the greens (visual only) */}
      {markers.map((m) => (
        <FlagPin
          key={m.hole}
          hole={m.hole}
          position={markerToWorld(m)}
          active={activeHole === m.hole}
          registerObject={(hole, obj) => {
            pinObjects.current[hole] = obj;
          }}
        />
      ))}

      {/* the clickable hole numbers live at the tees */}
      {tees.map((t) => (
        <TeeSite
          key={t.hole}
          hole={t.hole}
          position={markerToWorld(t)}
          active={!configMode && selectedHole === t.hole}
          editing={configMode && editHole === t.hole}
          hint={!configMode && hintHole === t.hole}
          hintLabel={hintLabel}
          onClick={() => {
            if (configMode) {
              onEditHole(editHole === t.hole ? null : t.hole);
            } else {
              onSelectHole(selectedHole === t.hole ? null : t.hole);
            }
          }}
          registerObject={(hole, obj) => {
            teeObjects.current[hole] = obj;
          }}
        />
      ))}

      {/* ball flight from tee to green while a hole is open or edited */}
      {activeHole !== null && activeMarker && activeTee && (
        <FlightLine
          key={`${activeHole}-${activeTee.u.toFixed(4)}-${activeTee.v.toFixed(4)}-${activeMarker.u.toFixed(4)}-${activeMarker.v.toFixed(4)}`}
          tee={markerToWorld(activeTee)}
          flag={markerToWorld(activeMarker)}
          animate={!configMode && !frozen}
        />
      )}

      {editObject && (
        <TransformControls
          object={editObject}
          mode="translate"
          showY={false}
          size={0.65}
          onMouseDown={() => {
            if (controlsRef.current) controlsRef.current.enabled = false;
          }}
          onMouseUp={() => {
            if (controlsRef.current) controlsRef.current.enabled = true;
            if (editObject && editHole !== null) {
              editObject.position.y = 0;
              const { u, v } = worldToMarker(editObject.position.x, editObject.position.z);
              if (editTarget === 'flag') onMarkerDragged(editHole, u, v);
              else onTeeDragged(editHole, u, v);
            }
          }}
          onObjectChange={() => {
            if (editObject) editObject.position.y = 0;
          }}
        />
      )}

      {enableEffects && <Effects lens={lens} focusPoint={focusPoint} controlsRef={controlsRef} />}

      <CameraRig
        selectedHole={cameraHole}
        markers={markers}
        holeView={holeView}
        fov={lens.fov}
        controlsRef={controlsRef}
        controlsEnabled={controlsEnabled}
        onReady={onReady}
        reducedMotion={reducedMotion}
        fitCourse={fitCourse}
        homeView={homeView}
      />
    </>
  );
}

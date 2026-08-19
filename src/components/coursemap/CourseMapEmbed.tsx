'use client';

import { Suspense, useEffect, useState } from 'react';
import Image from 'next/image';
import { Canvas } from '@react-three/fiber';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { X } from '@phosphor-icons/react';
import MapScene, { type CameraView } from './MapScene';
import { holes } from './courseData';
import {
  holeMarkers,
  defaultTees,
  defaultHoleViews,
  defaultCamera,
  defaultLens,
  defaultTerrain,
  defaultTrees,
} from './holeMarkers';

// Read-only embed of the Sussex Inlet Golf Club 3D course map, ported from
// the client project. The config editor, admin gates and drone videos stay
// behind on the club's site; this keeps the scene, the fly-to cameras and
// the hole details.

const noop = () => {};

function HolePanel({
  hole,
  onClose,
  compact = false,
}: {
  hole: number;
  onClose: () => void;
  // hero-sized embeds get a much smaller card so it doesn't smother the map
  compact?: boolean;
}) {
  const data = holes.find((h) => h.number === hole);
  if (!data) return null;

  return (
    <motion.aside
      initial={{ x: 420, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 420, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 30 }}
      className={`pointer-events-auto absolute max-h-[calc(100%-24px)] overflow-y-auto overflow-x-hidden rounded-2xl bg-white/95 shadow-xl shadow-[#0a1628]/25 backdrop-blur sm:inset-x-auto sm:bottom-auto sm:flex sm:flex-col ${
        compact
          ? 'inset-x-2 bottom-2 sm:right-3 sm:top-3 sm:max-h-[calc(100%-24px)] sm:w-[240px]'
          : 'inset-x-3 bottom-3 sm:right-4 sm:top-4 sm:max-h-[calc(100%-32px)] sm:w-[340px]'
      }`}
      aria-label={`Hole ${data.number} details`}
      onClick={(e) => e.stopPropagation()}
    >
      <div className={`relative shrink-0 bg-[#0a1628] ${compact ? 'h-20' : 'aspect-video'}`}>
        <Image
          src={`/mapmedia/holemedia/web/hole${data.number}poster.jpg`}
          alt={`Aerial view of hole ${data.number}`}
          fill
          sizes={compact ? '240px' : '(min-width: 640px) 340px, 100vw'}
          className="object-cover"
        />
        <span className="absolute inset-0 bg-gradient-to-t from-[#0a1628]/70 via-transparent to-[#0a1628]/25" />
        <span className={`absolute ${compact ? 'left-3 bottom-2' : 'left-4 bottom-3'}`}>
          <span
            className={`block font-semibold uppercase tracking-wide text-[#ddc078] ${
              compact ? 'text-[10px]' : 'text-[11px]'
            }`}
          >
            Hole {data.number}
          </span>
          <span className={`block font-semibold text-white ${compact ? 'text-lg' : 'text-3xl'}`}>
            Par {data.par}
          </span>
        </span>
        <button
          onClick={onClose}
          aria-label="Close hole details"
          className={`absolute flex cursor-pointer items-center justify-center rounded-full bg-[#0a1628]/55 text-white backdrop-blur transition hover:bg-[#0a1628]/80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
            compact ? 'right-2 top-2 h-7 w-7' : 'right-3 top-3 h-9 w-9'
          }`}
        >
          <X size={compact ? 14 : 18} weight="bold" />
        </button>
      </div>

      <div className={`sm:min-h-0 sm:flex-1 sm:overflow-y-auto ${compact ? 'p-3' : 'p-5'}`}>
        <dl
          className={`grid grid-cols-3 rounded-xl bg-[#f4f2ed] tabular-nums ${
            compact ? 'gap-2 px-3 py-2' : 'gap-3 px-4 py-3'
          }`}
        >
          <div>
            <dt className={`text-[#0a1628]/70 ${compact ? 'text-[10px]' : 'text-[11px]'}`}>Men</dt>
            <dd className={`font-semibold text-[#0a1628] ${compact ? 'text-lg' : 'text-2xl'}`}>
              {data.metresMen}m
            </dd>
          </div>
          <div>
            <dt className={`text-[#0a1628]/70 ${compact ? 'text-[10px]' : 'text-[11px]'}`}>Women</dt>
            <dd className={`font-semibold text-[#0a1628] ${compact ? 'text-lg' : 'text-2xl'}`}>
              {data.metresWomen}m
            </dd>
          </div>
          <div>
            <dt className={`text-[#0a1628]/70 ${compact ? 'text-[10px]' : 'text-[11px]'}`}>Index</dt>
            <dd className={`font-semibold text-[#0a1628] ${compact ? 'text-lg' : 'text-2xl'}`}>
              {data.strokeIndex}
            </dd>
          </div>
        </dl>

        <p
          className={`leading-relaxed text-[#0a1628]/75 ${
            compact ? 'mt-2.5 line-clamp-3 text-xs' : 'mt-4 text-sm'
          }`}
        >
          {data.description}
        </p>
        {!compact && data.tip && (
          <p className="mt-3 rounded-xl border border-[#ddc078]/60 bg-[#ddc078]/15 p-3 text-sm leading-relaxed text-[#0a1628]">
            <span className="font-semibold">Local tip: </span>
            {data.tip}
          </p>
        )}
      </div>
    </motion.aside>
  );
}

// Mounts inside the scene's Suspense boundary, so it commits only once the
// textures have resolved: the parent uses it to drop the loading overlay.
function SceneReady({ onReady }: { onReady: () => void }) {
  useEffect(() => {
    onReady();
  }, [onReady]);
  return null;
}

export default function CourseMapEmbed({
  active = true,
  height = 'clamp(420px, 58vh, 640px)',
  fitCourse = false,
  homeView,
  compact = false,
  controlsEnabled = false,
  selectable = true,
  onViewApi,
}: {
  active?: boolean;
  height?: string;
  // when set, the resting camera pulls back until every hole marker fits the
  // canvas (the hero's compact copy; the case-study viewer keeps its
  // hand-tuned default view)
  fitCourse?: boolean;
  // a hand-locked resting view; takes priority over fitCourse
  homeView?: CameraView;
  // hero-sized embeds: smaller hole cards so they don't cover the map
  compact?: boolean;
  // manual pan/zoom/tilt, used by the dev-only framing tuner
  controlsEnabled?: boolean;
  // turn off hole selection (and the hole-1 nudge) while tuning the framing
  selectable?: boolean;
  // receives { getView } for reading the live camera, used by the tuner
  onViewApi?: (api: { getView: () => CameraView }) => void;
}) {
  const [selectedHole, setSelectedHole] = useState<number | null>(null);
  const [coarsePointer, setCoarsePointer] = useState(false);
  const [sceneReady, setSceneReady] = useState(false);
  // the "click here" nudge on hole 1 lives until the visitor opens any hole
  const [hasOpenedHole, setHasOpenedHole] = useState(false);
  const reducedMotion = useReducedMotion();

  const selectHole = (hole: number | null) => {
    if (hole !== null) setHasOpenedHole(true);
    setSelectedHole(hole);
  };

  useEffect(() => {
    setCoarsePointer(window.matchMedia('(pointer: coarse)').matches);
  }, []);

  const holeView = selectedHole !== null ? (defaultHoleViews[String(selectedHole)] ?? null) : null;
  const lens = holeView?.lens ?? defaultLens;

  // In fit mode the rig solves the exact resting distance once the canvas is
  // measured; starting the camera already pulled back keeps the first frame
  // close to where it will settle.
  const initialPosition = fitCourse
    ? (defaultCamera.target.map(
        (t, i) => t + (defaultCamera.position[i] - t) * 1.8
      ) as [number, number, number])
    : defaultCamera.position;

  return (
    <div>
      <div
        className="relative overflow-hidden"
        style={{ height, borderRadius: 'inherit' }}
        onClick={() => {
          // clicking anywhere outside the panel (tee buttons stop propagation)
          // closes it and flies the camera back to the default view
          if (selectedHole !== null) setSelectedHole(null);
        }}
      >
        <Canvas
          camera={{ position: initialPosition, fov: defaultLens.fov }}
          dpr={[1, 1.5]}
          frameloop={active ? 'always' : 'never'}
        >
          <Suspense fallback={null}>
            <MapScene
              markers={holeMarkers}
              tees={defaultTees}
              selectedHole={selectedHole}
              onSelectHole={selectable ? selectHole : noop}
              hintHole={selectable && sceneReady && !hasOpenedHole ? 1 : null}
              hintLabel={coarsePointer ? 'Tap me!' : 'Click me!'}
              configMode={false}
              editHole={null}
              editTarget="flag"
              onEditHole={noop}
              onMarkerDragged={noop}
              onTeeDragged={noop}
              reducedMotion={!!reducedMotion}
              terrain={defaultTerrain}
              trees={defaultTrees}
              lens={lens}
              cameraHole={selectedHole}
              holeView={holeView}
              fitCourse={fitCourse}
              homeView={homeView}
              onReady={onViewApi}
              controlsEnabled={controlsEnabled}
              enableEffects={!coarsePointer}
            />
            <SceneReady onReady={() => setSceneReady(true)} />
          </Suspense>
        </Canvas>

        {/* the aerial still holds the frame while the ~4MB of textures stream in */}
        <AnimatePresence>
          {!sceneReady && (
            <motion.div
              key="scene-loading"
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
              className="absolute inset-0 z-10"
              aria-hidden="true"
            >
              <Image
                src="/mapmedia/basemap.jpg"
                alt=""
                fill
                sizes="(max-width: 1400px) 100vw, 1400px"
                style={{ objectFit: 'cover', opacity: 0.85 }}
              />
              <p className="glass-panel absolute bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg px-4 py-2 text-xs font-medium text-[#0F1A2A]">
                Loading the interactive course&hellip;
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="pointer-events-none absolute inset-0 z-20">
          <AnimatePresence>
            {selectedHole !== null && (
              <HolePanel
                key="hole-panel"
                hole={selectedHole}
                onClose={() => setSelectedHole(null)}
                compact={compact}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

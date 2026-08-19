import mapConfig from './map-config.json';

// Normalised positions on the course base map: u/v are 0-1 from the top-left
// of the 16:9 map image. Live values are managed in map-config.json via the
// map viewer's temporary config panel.
export type HoleMarker = {
  hole: number;
  u: number;
  v: number;
};

export type LensConfig = {
  fov: number;
  bokehScale: number;
  focusRange: number;
  focusDistance: number | null;
};

export type HoleView = {
  // keyframe 1: the entry view for the hole
  position: [number, number, number];
  target: [number, number, number];
  // keyframe 2 (optional): when set, the camera slowly ping-pongs 1 -> 2 -> 1
  position2?: [number, number, number] | null;
  target2?: [number, number, number] | null;
  // seconds for one leg of the ping-pong
  animSeconds?: number;
  lens: LensConfig;
};

export type TerrainConfig = {
  texScale: number;
  blackPoint: number;
  whitePoint: number;
  contrast: number;
  saturation: number;
  elevation: number;
};

export type TreeConfig = {
  hue: number;
  saturation: number;
  lightness: number;
};

export const DEFAULT_LENS: LensConfig = {
  fov: 46,
  bokehScale: 2,
  focusRange: 8,
  focusDistance: null,
};

export const DEFAULT_TERRAIN: TerrainConfig = {
  texScale: 2.5,
  blackPoint: 0,
  whitePoint: 255,
  contrast: 0,
  saturation: 1,
  elevation: 2.2,
};

export const DEFAULT_TREES: TreeConfig = { hue: 0, saturation: 1, lightness: 1 };

type RawConfig = {
  camera: { position: number[]; target: number[] };
  lens?: Partial<LensConfig>;
  markers: HoleMarker[];
  tees?: HoleMarker[];
  holeViews?: Record<string, HoleView>;
  terrain?: Partial<TerrainConfig>;
  trees?: Partial<TreeConfig>;
};

const raw = mapConfig as unknown as RawConfig;

export const holeMarkers: HoleMarker[] = raw.markers;

export const defaultTees: HoleMarker[] =
  raw.tees ?? raw.markers.map((m) => ({ hole: m.hole, u: m.u + 0.02, v: m.v + 0.02 }));

export const defaultHoleViews: Record<string, HoleView> = raw.holeViews ?? {};

export const defaultCamera = {
  position: raw.camera.position as [number, number, number],
  target: raw.camera.target as [number, number, number],
};

export const defaultLens: LensConfig = { ...DEFAULT_LENS, ...(raw.lens ?? {}) };
export const defaultTerrain: TerrainConfig = { ...DEFAULT_TERRAIN, ...(raw.terrain ?? {}) };
export const defaultTrees: TreeConfig = { ...DEFAULT_TREES, ...(raw.trees ?? {}) };

// World-space constants shared by the scene: the map plane is 19.2 x 10.8
// units (16:9), centred on the origin, lying in the XZ plane.
export const MAP_WIDTH = 19.2;
export const MAP_HEIGHT = 10.8;

export function markerToWorld(m: { u: number; v: number }): [number, number, number] {
  return [(m.u - 0.5) * MAP_WIDTH, 0, (m.v - 0.5) * MAP_HEIGHT];
}

export function worldToMarker(x: number, z: number): { u: number; v: number } {
  return { u: x / MAP_WIDTH + 0.5, v: z / MAP_HEIGHT + 0.5 };
}

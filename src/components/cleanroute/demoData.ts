// Fictional demo data and schedule math for the CleanRoute Pro homepage demo.
// Client names are made up; their pins sit on well-known public places around
// the Illawarra (shopping centres, fast food, landmarks), never home
// addresses. The formulas mirror the real product's route engine: job time is
// split across the crew, staff are paid for job split + travel, revenue is
// the client's hourly rate times booked hours, fuel is 10L/100km at $1.85/L.

export interface DemoClient {
  id: string;
  name: string;
  suburb: string;
  // the well-known public place the pin sits on
  place: string;
  durationMin: number;
  // hourly rate charged to the client, AUD
  rate: number;
  lat: number;
  lng: number;
}

export interface DemoStaff {
  id: string;
  name: string;
  wage: number; // AUD per hour
}

export const BASE = {
  name: 'Start Base',
  suburb: 'Shellharbour City Centre',
  place: 'Stockland Shellharbour',
  lat: -34.5796,
  lng: 150.8443,
};

export const DEMO_CLIENTS: DemoClient[] = [
  { id: 'kat-shane', name: 'Kat & Shane', suburb: 'Warilla', place: 'Warilla Grove', durationMin: 90, rate: 52, lat: -34.5507, lng: 150.858 },
  { id: 'margaret', name: 'Margaret H (Coastal Care)', suburb: 'Albion Park Rail', place: "McDonald's Albion Park Rail", durationMin: 120, rate: 60, lat: -34.561, lng: 150.7995 },
  { id: 'dental', name: 'Shellharbour Dental', suburb: 'Shellharbour Village', place: 'Addison St shops', durationMin: 180, rate: 70, lat: -34.5837, lng: 150.869 },
  { id: 'dave-priya', name: 'Dave & Priya', suburb: 'Shell Cove', place: 'The Waterfront marina', durationMin: 90, rate: 55, lat: -34.588, lng: 150.872 },
  { id: 'physio', name: 'Oak Flats Physio', suburb: 'Oak Flats', place: 'Woolworths Oak Flats', durationMin: 120, rate: 68, lat: -34.5607, lng: 150.8135 },
  { id: 'beach-house', name: 'The Beach House', suburb: 'Kiama', place: 'Kiama Blowhole', durationMin: 150, rate: 65, lat: -34.6707, lng: 150.8618 },
];

export const DEMO_STAFF: DemoStaff[] = [
  { id: 'mia', name: 'Mia', wage: 38 },
  { id: 'jordan', name: 'Jordan', wage: 40 },
  { id: 'tahlia', name: 'Tahlia', wage: 36 },
  { id: 'nick', name: 'Nick', wage: 42 },
];

// Long-day threshold per staff member (matches the product's warning spirit)
export const LONG_DAY_MIN = 390;

const ROAD_FACTOR = 1.3;
const AVG_KMH = 40;

export interface Leg {
  km: number;
  minutes: number;
}

// Haversine fallback for when live Google directions have not resolved yet
function legBetween(a: { lat: number; lng: number }, b: { lat: number; lng: number }): Leg {
  const rad = Math.PI / 180;
  const dLat = (b.lat - a.lat) * rad;
  const dLng = (b.lng - a.lng) * rad;
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(a.lat * rad) * Math.cos(b.lat * rad) * Math.sin(dLng / 2) ** 2;
  const straight = 6371 * 2 * Math.atan2(Math.sqrt(s), Math.sqrt(1 - s));
  const km = Math.round(straight * ROAD_FACTOR * 10) / 10;
  const minutes = Math.max(2, Math.ceil((km / AVG_KMH) * 60 + 3));
  return { km, minutes };
}

// base -> job -> job ... -> base
export function routeLegs(jobs: DemoClient[]): { legs: Leg[]; totalKm: number; totalMin: number } {
  if (jobs.length === 0) return { legs: [], totalKm: 0, totalMin: 0 };
  const stops = [BASE, ...jobs, BASE];
  const legs: Leg[] = [];
  for (let i = 0; i < stops.length - 1; i++) legs.push(legBetween(stops[i], stops[i + 1]));
  const totalKm = Math.round(legs.reduce((s, l) => s + l.km, 0) * 10) / 10;
  const totalMin = legs.reduce((s, l) => s + l.minutes, 0);
  return { legs, totalKm, totalMin };
}

export interface RunSummary {
  jobMin: number;
  splitMin: number; // per staff
  travelMin: number;
  km: number;
  payablePerStaffMin: number;
  wages: number;
  revenue: number;
  fuel: number;
  profit: number;
  longDay: boolean;
  missingStaff: boolean;
}

export function runSummary(
  jobs: DemoClient[],
  staff: DemoStaff[],
  travel?: { totalKm: number; totalMin: number }
): RunSummary {
  const t = jobs.length > 0 ? (travel ?? routeLegs(jobs)) : { totalKm: 0, totalMin: 0 };
  const km = t.totalKm;
  const totalMin = t.totalMin;
  const jobMin = jobs.reduce((s, j) => s + j.durationMin, 0);
  const splitMin = staff.length > 0 ? jobMin / staff.length : jobMin;
  const payablePerStaffMin = jobs.length > 0 ? splitMin + totalMin : 0;
  const wages = staff.reduce((s, m) => s + (payablePerStaffMin / 60) * m.wage, 0);
  const revenue = jobs.reduce((s, j) => s + (j.durationMin / 60) * j.rate, 0);
  const fuel = km * 0.185; // (km/100) * 10 L/100km * $1.85/L
  return {
    jobMin,
    splitMin,
    travelMin: totalMin,
    km,
    payablePerStaffMin,
    wages,
    revenue,
    fuel,
    profit: revenue - wages - fuel,
    longDay: staff.length > 0 && payablePerStaffMin > LONG_DAY_MIN,
    missingStaff: jobs.length > 0 && staff.length === 0,
  };
}

// Greedy nearest-neighbour ordering from the base, like a one-click
// "Optimise" in the real app. Returns the reordered jobs and the km saved.
export function optimizeRoute(jobs: DemoClient[]): {
  ordered: DemoClient[];
  savedKm: number;
  savedMin: number;
} {
  if (jobs.length < 2) return { ordered: jobs, savedKm: 0, savedMin: 0 };
  const before = routeLegs(jobs);
  const remaining = [...jobs];
  const ordered: DemoClient[] = [];
  let here: { lat: number; lng: number } = BASE;
  while (remaining.length > 0) {
    let bestIdx = 0;
    let bestKm = Infinity;
    remaining.forEach((j, i) => {
      const { km } = legBetween(here, j);
      if (km < bestKm) {
        bestKm = km;
        bestIdx = i;
      }
    });
    const next = remaining.splice(bestIdx, 1)[0];
    ordered.push(next);
    here = next;
  }
  const after = routeLegs(ordered);
  // never replace an order the user already has that is as good or better
  if (after.totalKm >= before.totalKm) return { ordered: jobs, savedKm: 0, savedMin: 0 };
  return {
    ordered,
    savedKm: Math.round((before.totalKm - after.totalKm) * 10) / 10,
    savedMin: Math.max(0, before.totalMin - after.totalMin),
  };
}

// A run entry is a client id or the lunch break
export const BREAK_ID = 'break';
export const BREAK_MIN = 30;
export const DAY_START_MIN = 8 * 60;

export interface TimelineRow {
  kind: 'base' | 'client' | 'break' | 'return';
  clientId?: string;
  stopNumber?: number;
  startMin: number;
  endMin?: number;
  travelBefore?: Leg;
}

// Forward pass from base departure, mirroring the real app's schedule times:
// travel to each client, clean for the crew-split duration, breaks add their
// minutes without moving the van, then drive home.
export function buildTimeline(
  entries: string[],
  clients: DemoClient[],
  legs: Leg[],
  staffCount: number
): TimelineRow[] {
  const split = Math.max(1, staffCount);
  const rows: TimelineRow[] = [{ kind: 'base', startMin: DAY_START_MIN }];
  let t = DAY_START_MIN;
  let ci = 0;
  for (const entry of entries) {
    if (entry === BREAK_ID) {
      rows.push({ kind: 'break', startMin: t, endMin: t + BREAK_MIN });
      t += BREAK_MIN;
      continue;
    }
    const client = clients.find((c) => c.id === entry);
    if (!client) continue;
    const leg = legs[ci] ?? { km: 0, minutes: 0 };
    const start = t + leg.minutes;
    const end = start + client.durationMin / split;
    rows.push({
      kind: 'client',
      clientId: client.id,
      stopNumber: ci + 1,
      startMin: start,
      endMin: end,
      travelBefore: leg,
    });
    t = end;
    ci++;
  }
  if (ci > 0) {
    const home = legs[ci] ?? { km: 0, minutes: 0 };
    rows.push({ kind: 'return', startMin: t + home.minutes, travelBefore: home });
  }
  return rows;
}

export function fmtClock(totalMin: number): string {
  const m = Math.round(totalMin);
  const h24 = Math.floor(m / 60) % 24;
  const mm = (m % 60).toString().padStart(2, '0');
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${h12}:${mm} ${h24 < 12 ? 'am' : 'pm'}`;
}

export function fmtMin(min: number): string {
  const m = Math.round(min);
  const h = Math.floor(m / 60);
  const r = m % 60;
  if (h === 0) return `${r}m`;
  if (r === 0) return `${h}h`;
  return `${h}h ${r}m`;
}

export function fmtMoney(n: number): string {
  const r = Math.round(Math.abs(n));
  return `${n < 0 && r > 0 ? '-' : ''}$${r.toLocaleString('en-AU')}`;
}

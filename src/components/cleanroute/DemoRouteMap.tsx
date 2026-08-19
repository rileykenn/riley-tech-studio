'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Map as GoogleMap, useMap, useMapsLibrary } from '@vis.gl/react-google-maps';
import { BASE, DEMO_CLIENTS, type DemoClient, type Leg } from './demoData';

// The live route map, ported from the real app's RouteMap: a Google
// DirectionsService route from base through every job and home again, drawn
// with a DirectionsRenderer polyline and custom numbered circle markers.
// For the portfolio embed the camera is FIXED (framed on the whole service
// area, no auto-fit, no pan or zoom) with standard Google map colours.
// Google's logo and attribution stay: removing them is against the Maps
// terms of service.

export interface LiveTravel {
  legs: Leg[];
  totalKm: number;
  totalMin: number;
  // identifies which stop order these legs belong to
  key: string;
}

const resultCache = new Map<string, google.maps.DirectionsResult>();

export function chainKey(jobs: DemoClient[]): string {
  return [BASE, ...jobs, BASE].map((p) => `${p.lat},${p.lng}`).join('->');
}

/* ---------- smooth camera ---------- */

function latRad(lat: number): number {
  const sin = Math.sin((lat * Math.PI) / 180);
  const rad = Math.log((1 + sin) / (1 - sin)) / 2;
  return Math.max(Math.min(rad, Math.PI), -Math.PI) / 2;
}

// The center + fractional zoom that frames the bounds with padding, computed
// without moving the map, so the camera can be tweened there by hand.
function cameraForBounds(
  map: google.maps.Map,
  bounds: google.maps.LatLngBounds,
  padding: number
): { lat: number; lng: number; zoom: number } | null {
  const div = map.getDiv();
  const w = div.clientWidth - padding * 2;
  const h = div.clientHeight - padding * 2;
  if (w <= 0 || h <= 0) return null;
  const ne = bounds.getNorthEast();
  const sw = bounds.getSouthWest();
  const latFraction = Math.max((latRad(ne.lat()) - latRad(sw.lat())) / Math.PI, 1e-6);
  const lngFraction = Math.max((((ne.lng() - sw.lng()) % 360) + 360) % 360, 1e-4) / 360;
  const zoom = Math.min(
    Math.log2(h / 256 / latFraction),
    Math.log2(w / 256 / lngFraction),
    13 // never dive in absurdly close for a single nearby stop
  );
  const center = bounds.getCenter();
  return { lat: center.lat(), lng: center.lng(), zoom };
}

const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

function extractTravel(result: google.maps.DirectionsResult, key: string): LiveTravel {
  const legs: Leg[] = (result.routes[0]?.legs ?? []).map((l) => ({
    km: Math.round(((l.distance?.value ?? 0) / 1000) * 10) / 10,
    minutes: Math.max(1, Math.ceil((l.duration?.value ?? 0) / 60)),
  }));
  return {
    legs,
    totalKm: Math.round(legs.reduce((s, l) => s + l.km, 0) * 10) / 10,
    totalMin: legs.reduce((s, l) => s + l.minutes, 0),
    key,
  };
}

function RouteLayer({
  jobs,
  color,
  onTravel,
}: {
  jobs: DemoClient[];
  color: string;
  onTravel: (t: LiveTravel | null) => void;
}) {
  const map = useMap();
  const routesLibrary = useMapsLibrary('routes');
  const [renderer, setRenderer] = useState<google.maps.DirectionsRenderer | null>(null);
  const [service, setService] = useState<google.maps.DirectionsService | null>(null);
  const cameraAnim = useRef<number | null>(null);

  const onTravelRef = useRef(onTravel);
  onTravelRef.current = onTravel;
  const jobsRef = useRef(jobs);
  jobsRef.current = jobs;

  const positionsKey = jobs.map((j) => `${j.id}:${j.lat},${j.lng}`).join('|');

  useEffect(() => {
    if (!routesLibrary || !map) return;
    const directionsRenderer = new routesLibrary.DirectionsRenderer({
      map,
      suppressMarkers: true, // custom markers below, like the real app
      preserveViewport: true, // the camera never moves
      polylineOptions: { strokeColor: color, strokeWeight: 4, strokeOpacity: 0.8 },
    });
    const directionsService = new routesLibrary.DirectionsService();
    setRenderer(directionsRenderer);
    setService(directionsService);
    return () => {
      directionsRenderer.setMap(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routesLibrary, map]);

  // route: base -> jobs -> base
  const renderRoute = useCallback(() => {
    const js = jobsRef.current;
    if (!service || !renderer) return;
    if (js.length === 0) {
      renderer.setDirections({ routes: [] } as unknown as google.maps.DirectionsResult);
      onTravelRef.current(null);
      return;
    }
    const key = chainKey(js);
    const cached = resultCache.get(key);
    if (cached) {
      renderer.setDirections(cached);
      onTravelRef.current(extractTravel(cached, key));
      return;
    }
    service.route(
      {
        origin: { lat: BASE.lat, lng: BASE.lng },
        destination: { lat: BASE.lat, lng: BASE.lng },
        waypoints: js.map((c) => ({ location: { lat: c.lat, lng: c.lng }, stopover: true })),
        travelMode: google.maps.TravelMode.DRIVING,
        optimizeWaypoints: false, // keep the user's order, like the real app
      },
      (result, status) => {
        // the run may have changed while this request was in flight
        if (key !== chainKey(jobsRef.current)) return;
        if (status === google.maps.DirectionsStatus.OK && result) {
          resultCache.set(key, result);
          renderer.setDirections(result);
          onTravelRef.current(extractTravel(result, key));
        } else {
          // failed for the current order: drop the stale polyline and let the
          // parent fall back to estimated legs
          renderer.setDirections({ routes: [] } as unknown as google.maps.DirectionsResult);
          onTravelRef.current(null);
        }
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [service, renderer, positionsKey]);

  useEffect(() => {
    renderRoute();
  }, [renderRoute]);

  // custom markers, ported from the real app; unassigned clients show as
  // faint dots so the service area always reads even on an empty day
  useEffect(() => {
    if (!map) return;
    const js = jobsRef.current;
    const markers: google.maps.Marker[] = [];

    markers.push(
      new google.maps.Marker({
        position: { lat: BASE.lat, lng: BASE.lng },
        map,
        label: { text: '🏠', fontSize: '20px' },
        title: `${BASE.place} (Start Base)`,
        zIndex: 1000,
      })
    );

    js.forEach((client, index) => {
      const marker = new google.maps.Marker({
        position: { lat: client.lat, lng: client.lng },
        map,
        label: { text: String(index + 1), color: 'white', fontWeight: 'bold', fontSize: '13px' },
        title: client.name,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 16,
          fillColor: color,
          fillOpacity: 1,
          strokeColor: 'white',
          strokeWeight: 3,
        },
        zIndex: 999 - index,
      });
      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div style="font-family: Inter, system-ui, sans-serif; padding: 4px 0;">
            <div style="font-weight: 600; font-size: 14px; color: #111827; margin-bottom: 4px;">${client.name}</div>
            <div style="font-size: 13px; color: #6B7280; margin-bottom: 4px;">${client.place}, ${client.suburb}</div>
            <div style="font-size: 13px; color: ${color}; font-weight: 500;">${client.durationMin} min clean</div>
          </div>
        `,
      });
      marker.addListener('click', () => infoWindow.open(map, marker));
      markers.push(marker);
    });

    // auto-frame the assigned stops with a hand-tweened glide (fitBounds
    // animates too mechanically). On an empty day, frame the home cluster
    // around the base; far-flung pins like Kiama only pull the camera out
    // once they actually join the run.
    const homeCluster = DEMO_CLIENTS.filter(
      (c) => Math.hypot(c.lat - BASE.lat, c.lng - BASE.lng) < 0.08
    );
    const timer = setTimeout(() => {
      const bounds = new google.maps.LatLngBounds();
      bounds.extend({ lat: BASE.lat, lng: BASE.lng });
      (js.length > 0 ? js : homeCluster).forEach((c) => bounds.extend({ lat: c.lat, lng: c.lng }));
      const target = cameraForBounds(map, bounds, 50);
      if (!target) return;

      if (cameraAnim.current) cancelAnimationFrame(cameraAnim.current);
      const c0 = map.getCenter();
      const z0 = map.getZoom();
      if (!c0 || z0 == null || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        map.moveCamera({ center: { lat: target.lat, lng: target.lng }, zoom: target.zoom });
        return;
      }
      const from = { lat: c0.lat(), lng: c0.lng(), zoom: z0 };
      const start = performance.now();
      const DURATION = 1100;
      const step = (now: number) => {
        const t = Math.min(1, (now - start) / DURATION);
        const e = easeInOutCubic(t);
        map.moveCamera({
          center: {
            lat: from.lat + (target.lat - from.lat) * e,
            lng: from.lng + (target.lng - from.lng) * e,
          },
          zoom: from.zoom + (target.zoom - from.zoom) * e,
        });
        if (t < 1) cameraAnim.current = requestAnimationFrame(step);
        else cameraAnim.current = null;
      };
      cameraAnim.current = requestAnimationFrame(step);
    }, 300);

    return () => {
      markers.forEach((m) => m.setMap(null));
      clearTimeout(timer);
      if (cameraAnim.current) cancelAnimationFrame(cameraAnim.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, positionsKey, color]);

  return null;
}

export default function DemoRouteMap({
  jobs,
  color,
  onTravel,
}: {
  jobs: DemoClient[];
  color: string;
  onTravel: (t: LiveTravel | null) => void;
}) {
  return (
    <GoogleMap
      defaultCenter={{ lat: -34.612, lng: 150.838 }}
      defaultZoom={11.5}
      mapId="cleanroute-map"
      gestureHandling="none"
      disableDefaultUI
      clickableIcons={false}
      style={{ width: '100%', height: '100%', minHeight: 420 }}
    >
      <RouteLayer jobs={jobs} color={color} onTravel={onTravel} />
    </GoogleMap>
  );
}

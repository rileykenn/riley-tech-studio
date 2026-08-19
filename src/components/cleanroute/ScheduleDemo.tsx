'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  motion,
  AnimatePresence,
  MotionConfig,
  useInView,
  useReducedMotion,
  useSpring,
  useTransform,
  type PanInfo,
} from 'framer-motion';
import { APIProvider } from '@vis.gl/react-google-maps';
import {
  X,
  Path,
  Plus,
  Check,
  Coffee,
  CheckCircle,
  Warning,
} from '@phosphor-icons/react';
import DemoRouteMap, { chainKey, type LiveTravel } from './DemoRouteMap';
import StaffPhonePreview from './StaffPhonePreview';
import {
  BASE,
  BREAK_ID,
  BREAK_MIN,
  DEMO_CLIENTS,
  DEMO_STAFF,
  fmtMin,
  fmtMoney,
  optimizeRoute,
  routeLegs,
  runSummary,
} from './demoData';

// A tight slice of the software built for The Cleaning Co Shellharbour:
// schedule the day's clients onto the run, pick the crew, and the real
// Google Maps route, travel times, wages and profit recalculate live.

type Zone = 'roster' | 'run';

const RUN_COLOR = '#047857';
const MAPS_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
const INITIAL_CREW: Record<string, boolean> = { mia: true, jordan: false, tahlia: true, nick: false };

const clientById = (id: string) => DEMO_CLIENTS.find((c) => c.id === id)!;

// The windows spring open like little app windows: squashed flat on the y
// axis, then bouncing up to full height, one after another. They settle
// before the scripted intro starts moving cards at 800ms, so the pop never
// fights the layout glides or drag interactions.
const WINDOWS_STAGGER = {
  closed: {},
  open: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};

const WINDOW_POP = {
  closed: { opacity: 0, scaleY: 0.04 },
  open: {
    opacity: 1,
    scaleY: 1,
    transition: {
      opacity: { duration: 0.16, ease: 'easeOut' as const },
      scaleY: { type: 'spring' as const, stiffness: 380, damping: 16, mass: 0.85 },
    },
  },
};

function AnimatedNumber({
  value,
  format,
  className,
}: {
  value: number;
  format: (n: number) => string;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const spring = useSpring(value, { stiffness: 150, damping: 24 });
  const text = useTransform(spring, (v) => format(v));

  useEffect(() => {
    if (reduce) spring.jump(value);
    else spring.set(value);
  }, [value, reduce, spring]);

  return (
    <span className={className}>
      <motion.span aria-hidden="true">{text}</motion.span>
      <span className="sr-only">{format(value)}</span>
    </span>
  );
}

function TravelLeg({ minutes, km }: { minutes: number; km: number }) {
  return (
    <div className="ml-4 flex items-center gap-2 border-l-2 border-dotted border-[#C7D2FE] py-1 pl-3">
      <span className="text-[11px] font-medium text-[#6B7280]">
        {minutes}m · {km} km drive
      </span>
    </div>
  );
}

export default function ScheduleDemo({ aside }: { aside?: React.ReactNode }) {
  const reduce = useReducedMotion();
  const [run, setRun] = useState<string[]>([]);
  const [crew, setCrew] = useState<Record<string, boolean>>(INITIAL_CREW);
  const [published, setPublished] = useState(false);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [hoverZone, setHoverZone] = useState<Zone | null>(null);
  const [optToast, setOptToast] = useState<{ savedKm: number; savedMin: number } | null>(null);
  const [coarse, setCoarse] = useState(false);
  const [liveTravel, setLiveTravel] = useState<LiveTravel | null>(null);
  const [introPlaying, setIntroPlaying] = useState(false);

  const rootRef = useRef<HTMLDivElement>(null);
  const introInView = useInView(rootRef, { once: true, margin: '-120px 0px' });
  const introDone = useRef(false);

  const zoneRefs = useRef<{ roster: HTMLDivElement | null; run: HTMLDivElement | null; map: HTMLDivElement | null }>({
    roster: null,
    run: null,
    map: null,
  });
  const pendingFocus = useRef<string | null>(null);
  const introPlayingRef = useRef(false);
  introPlayingRef.current = introPlaying;
  const successBtnRef = useRef<HTMLButtonElement>(null);
  // the Maps JS API only loads once the section is within scrolling distance
  const mapsNear = useInView(rootRef, { once: true, margin: '600px 0px' });

  useEffect(() => {
    setCoarse(window.matchMedia('(pointer: coarse)').matches);
  }, []);

  useEffect(() => {
    if (!pendingFocus.current) return;
    const fid = pendingFocus.current;
    pendingFocus.current = null;
    requestAnimationFrame(() => {
      document.querySelector<HTMLElement>(`[data-fid="${fid}"]`)?.focus();
    });
  }, [run]);

  useEffect(() => {
    if (published) successBtnRef.current?.focus();
  }, [published]);

  useEffect(() => {
    if (!optToast) return;
    const t = setTimeout(() => setOptToast(null), 2200);
    return () => clearTimeout(t);
  }, [optToast]);

  const assign = useCallback((id: string) => {
    if (!introPlayingRef.current) pendingFocus.current = `c-${id}-remove`;
    setRun((prev) => (prev.includes(id) ? prev : [...prev, id]));
  }, []);

  const unassign = useCallback((id: string) => {
    pendingFocus.current = `c-${id}-add`;
    setRun((prev) => prev.filter((x) => x !== id));
  }, []);

  // scripted intro: two clients glide onto the run, then it goes interactive
  useEffect(() => {
    if (!introInView || introDone.current) return;
    introDone.current = true;
    if (reduce) return;
    setIntroPlaying(true);
    const t1 = setTimeout(() => assign('kat-shane'), 800);
    const t2 = setTimeout(() => assign('physio'), 2200);
    const t3 = setTimeout(() => setIntroPlaying(false), 3300);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [introInView, reduce, assign]);

  const rosterIds = DEMO_CLIENTS.filter((c) => !run.includes(c.id)).map((c) => c.id);
  const runClients = run.filter((id) => id !== BREAK_ID).map(clientById);
  const crewStaff = DEMO_STAFF.filter((s) => crew[s.id]);

  const liveMatches = liveTravel !== null && liveTravel.key === chainKey(runClients);
  const legs = liveMatches ? liveTravel!.legs : routeLegs(runClients).legs;
  const sum = runSummary(runClients, crewStaff, liveMatches ? liveTravel! : undefined);

  const canPublish = runClients.length === DEMO_CLIENTS.length && crewStaff.length > 0 && !published;

  const onTravel = useCallback((t: LiveTravel | null) => {
    setLiveTravel(t);
  }, []);

  const zoneAt = useCallback((point: { x: number; y: number }): Zone | null => {
    const px = point.x - window.scrollX;
    const py = point.y - window.scrollY;
    const hit = (el: HTMLElement | null) => {
      if (!el) return false;
      const r = el.getBoundingClientRect();
      return px >= r.left && px <= r.right && py >= r.top && py <= r.bottom;
    };
    // dropping on the run sheet OR the map schedules the client
    if (hit(zoneRefs.current.run) || hit(zoneRefs.current.map)) return 'run';
    if (hit(zoneRefs.current.roster)) return 'roster';
    return null;
  }, []);

  const handleDragEnd = (id: string, info: PanInfo) => {
    const target = zoneAt(info.point);
    setDraggingId(null);
    setHoverZone(null);
    const current: Zone = run.includes(id) ? 'run' : 'roster';
    if (!target || target === current) return;
    if (target === 'run') assign(id);
    else unassign(id);
  };

  const runOptimize = () => {
    const { ordered, savedKm, savedMin } = optimizeRoute(runClients);
    setRun((prev) => {
      const breakIdx = prev.indexOf(BREAK_ID);
      const ids = ordered.map((c) => c.id);
      if (breakIdx >= 0) ids.splice(Math.min(breakIdx, ids.length), 0, BREAK_ID);
      return ids;
    });
    setOptToast({ savedKm, savedMin });
  };

  const reset = () => {
    setRun([]);
    setCrew(INITIAL_CREW);
    setPublished(false);
    setOptToast(null);
  };

  const dragProps = (id: string) =>
    coarse || published || introPlaying
      ? {}
      : {
          drag: true as const,
          dragSnapToOrigin: true,
          dragMomentum: false,
          dragElastic: 0.12,
          whileDrag: { scale: 1.04, zIndex: 60, boxShadow: '0 16px 40px rgba(17,24,39,0.18)' },
          onDragStart: () => setDraggingId(id),
          onDrag: (_: unknown, info: PanInfo) => setHoverZone(zoneAt(info.point)),
          onDragEnd: (_: unknown, info: PanInfo) => handleDragEnd(id, info),
        };

  const cardLayoutTransition = { layout: { type: 'spring' as const, stiffness: 110, damping: 20 } };

  const dropGlow = (zone: Zone) =>
    draggingId !== null && hoverZone === zone && (run.includes(draggingId) ? 'run' : 'roster') !== zone;

  const board = (
    <div className="relative" ref={rootRef} style={{ fontFeatureSettings: '"tnum"' }}>
      <p className="sr-only">
        Interactive demonstration of the scheduling software built for The Cleaning Co
        Shellharbour: schedule sample clients onto the day&rsquo;s run, pick the crew, and
        the route, travel times, wages and profit recalculate live.
      </p>

      <motion.div
        inert={published}
        className="crp-windows"
        variants={WINDOWS_STAGGER}
        initial="closed"
        animate={introInView ? 'open' : 'closed'}
        style={introPlaying ? { pointerEvents: 'none' } : undefined}
      >
        {/* client roster */}
        <motion.div
          variants={WINDOW_POP}
          ref={(el) => {
            zoneRefs.current.roster = el;
          }}
          className={`crp-win-roster rounded-[18px] border border-[#E5E7EB] bg-white p-3.5 shadow-[0_14px_40px_rgba(17,24,39,0.08)] transition-shadow ${
            dropGlow('roster') ? 'ring-2 ring-[#4F46E5]/35' : ''
          }`}
        >
          <p className="m-0 mb-2 text-[11px] font-bold uppercase tracking-wide text-[#6B7280]">
            Client Roster
          </p>
          <div className="crp-roster-list flex flex-col gap-2">
            {rosterIds.map((id) => {
              const c = clientById(id);
              return (
                <motion.div
                  key={id}
                  layoutId={`crp-c-${id}`}
                  layout
                  transition={cardLayoutTransition}
                  {...dragProps(id)}
                  onTap={() => {
                    if (!published && !introPlaying) assign(id);
                  }}
                  className={`relative flex shrink-0 cursor-pointer items-center gap-2 rounded-[10px] border border-[#E5E7EB] bg-white p-2.5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] ${
                    coarse || published || introPlaying ? '' : 'active:cursor-grabbing'
                  }`}
                  style={{ minWidth: 190 }}
                >
                  <div className="min-w-0 leading-tight">
                    <p className="m-0 text-[13px] font-semibold text-[#111827]">{c.name}</p>
                    <p className="m-0 mt-0.5 text-[11px] text-[#6B7280]">
                      {c.suburb} · {fmtMin(c.durationMin)}
                      <span className="ml-1.5 font-semibold text-[#047857]">${c.rate}/hr</span>
                    </p>
                  </div>
                  {!published && (
                    <button
                      onClick={() => assign(id)}
                      onPointerDownCapture={(e) => e.stopPropagation()}
                      data-fid={`c-${id}-add`}
                      aria-label={`Add ${c.name} to the run`}
                      className="ml-auto flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-full bg-[#047857] text-white transition-transform hover:scale-110 active:scale-95 [@media(pointer:coarse)]:h-10 [@media(pointer:coarse)]:w-10"
                    >
                      <Plus size={13} weight="bold" />
                    </button>
                  )}
                </motion.div>
              );
            })}
            {!run.includes(BREAK_ID) && !published && (
              <div
                onClick={() => assign(BREAK_ID)}
                className="flex shrink-0 cursor-pointer items-center gap-2 rounded-[10px] border border-dashed border-[#FDE68A] bg-[#FFFBEB]/70 p-2.5"
                style={{ minWidth: 190 }}
              >
                <Coffee size={15} weight="fill" color="#B45309" className="shrink-0" />
                <div className="min-w-0 leading-tight">
                  <p className="m-0 text-[13px] font-semibold text-[#111827]">Lunch Break</p>
                  <p className="m-0 mt-0.5 text-[11px] text-[#6B7280]">{BREAK_MIN}m · unpaid</p>
                </div>
                <button
                  onClick={() => assign(BREAK_ID)}
                  data-fid="c-break-add"
                  aria-label="Add a lunch break to the run"
                  className="ml-auto flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-full bg-[#B45309] text-white transition-transform hover:scale-110 active:scale-95 [@media(pointer:coarse)]:h-10 [@media(pointer:coarse)]:w-10"
                >
                  <Plus size={13} weight="bold" />
                </button>
              </div>
            )}
            {rosterIds.length === 0 && (
              <div className="rounded-[10px] border border-dashed border-[#C7D2FE] bg-[#EEF2FF]/50 p-3 text-center text-xs font-medium text-[#4F46E5]">
                Every client is scheduled
              </div>
            )}
          </div>
        </motion.div>

        {/* the run sheet */}
        <motion.div
          variants={WINDOW_POP}
          ref={(el) => {
            zoneRefs.current.run = el;
          }}
          className={`crp-win-run flex flex-col rounded-[18px] border bg-white p-3.5 shadow-[0_14px_40px_rgba(17,24,39,0.08)] transition-shadow ${
            dropGlow('run') ? 'border-[#C7D2FE] ring-2 ring-[#4F46E5]/35' : 'border-[#E5E7EB]'
          }`}
        >
          <div className="mb-2 flex min-h-[22px] flex-wrap items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: RUN_COLOR }} />
            <span className="text-[13px] font-bold text-[#111827]">Today&rsquo;s Run</span>
            <AnimatePresence>
              {optToast && (
                <motion.span
                  initial={{ opacity: 0, y: -4, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className={`ml-auto rounded-full px-2 py-0.5 text-[10px] font-bold ${
                    optToast.savedKm > 0 ? 'bg-[#ECFDF5] text-[#047857]' : 'bg-[#F1F5F9] text-[#6B7280]'
                  }`}
                >
                  {optToast.savedKm > 0
                    ? `Saved ${optToast.savedKm} km${optToast.savedMin > 0 ? ` and ${optToast.savedMin}m` : ''}`
                    : 'Already optimal'}
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          {/* crew picker: clearly staff, not clients */}
          <div className="mb-2 rounded-[10px] bg-[#F8FAFC] px-2.5 py-2">
            <p className="m-0 mb-1.5 text-[10px] font-bold uppercase tracking-wide text-[#6B7280]">
              Crew on this run · tap to change
            </p>
            <div className="flex flex-wrap gap-1.5">
              {DEMO_STAFF.map((s) => {
                const on = crew[s.id];
                return (
                  <button
                    key={s.id}
                    onClick={() => !published && setCrew((prev) => ({ ...prev, [s.id]: !prev[s.id] }))}
                    disabled={published}
                    aria-pressed={on}
                    aria-label={`${s.name}, $${s.wage} an hour, ${on ? 'on' : 'off'} the run`}
                    className={`flex items-center gap-1 rounded-full border py-0.5 pl-1.5 pr-2 text-[11px] font-semibold transition-colors [@media(pointer:coarse)]:min-h-10 ${
                      on
                        ? 'border-transparent text-white'
                        : 'border-dashed border-[#D1D5DB] bg-white text-[#6B7280] hover:border-[#047857] hover:text-[#047857]'
                    } ${published ? '' : 'cursor-pointer'}`}
                    style={on ? { background: RUN_COLOR } : undefined}
                  >
                    {on ? <Check size={11} weight="bold" /> : <Plus size={11} weight="bold" />}
                    {s.name}
                    <span className={on ? 'font-normal text-white' : 'font-normal text-[#6B7280]'}>
                      ${s.wage}/hr
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* start base */}
          <div className="flex items-center gap-2 rounded-[10px] bg-[#F8FAFC] px-2.5 py-1.5">
            <span className="h-2 w-2 rounded-full border-2 border-[#4F46E5] bg-white" />
            <span className="text-xs font-semibold text-[#111827]">{BASE.name}</span>
            <span className="text-[11px] text-[#6B7280]">{BASE.place}</span>
          </div>

          {run.length === 0 ? (
            <div
              className={`mt-2 flex flex-1 items-center justify-center rounded-[10px] border border-dashed p-5 text-center text-xs font-medium transition-colors ${
                dropGlow('run')
                  ? 'border-[#4F46E5] bg-[#EEF2FF] text-[#4F46E5]'
                  : 'border-[#E5E7EB] text-[#6B7280]'
              }`}
            >
              {coarse
                ? 'Tap a client to add them to the run'
                : 'Click a client to schedule it, or drag it here or onto the map'}
            </div>
          ) : (
            <div className="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain">
              {(() => {
                let ci = 0;
                return run.map((id) => {
                  if (id === BREAK_ID) {
                    return (
                      <div key="break">
                        <div className="ml-4 h-2 border-l-2 border-dotted border-[#C7D2FE]" />
                        <div className="flex items-center gap-2 rounded-[10px] bg-[#FFFBEB] px-2.5 py-1.5">
                          <Coffee size={13} weight="fill" color="#B45309" className="shrink-0" />
                          <span className="text-xs font-semibold text-[#111827]">Lunch Break</span>
                          <span className="text-[11px] text-[#6B7280]">{BREAK_MIN}m · excl. payroll</span>
                          {!published && (
                            <button
                              onClick={() => unassign(BREAK_ID)}
                              data-fid="c-break-remove"
                              aria-label="Remove the lunch break from the run"
                              className="ml-auto flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-full text-[#6B7280] transition-colors hover:bg-[#FEE2E2] hover:text-[#B91C1C] [@media(pointer:coarse)]:h-10 [@media(pointer:coarse)]:w-10"
                            >
                              <X size={12} weight="bold" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  }
                  const c = clientById(id);
                  const i = ci++;
                  return (
                    <div key={c.id}>
                      <TravelLeg minutes={legs[i].minutes} km={legs[i].km} />
                      <motion.div
                        layoutId={`crp-c-${c.id}`}
                        layout
                        transition={cardLayoutTransition}
                        {...dragProps(c.id)}
                        className={`relative rounded-[10px] border border-[#E5E7EB] bg-white p-2.5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] ${
                          coarse || published || introPlaying ? '' : 'cursor-grab active:cursor-grabbing'
                        }`}
                        style={{ borderLeft: `3px solid ${RUN_COLOR}` }}
                      >
                        <div className="flex items-start gap-2">
                          <span
                            className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white"
                            style={{ background: RUN_COLOR }}
                          >
                            {i + 1}
                          </span>
                          <div className="min-w-0">
                            <p className="m-0 truncate text-[13px] font-semibold leading-tight text-[#111827]">
                              {c.name}
                            </p>
                            <p className="m-0 mt-0.5 text-[11px] text-[#6B7280]">
                              {c.suburb} · {fmtMin(c.durationMin)}
                              {crewStaff.length > 1 && (
                                <span className="ml-1 rounded bg-[#EEF2FF] px-1 py-px text-[10px] font-bold text-[#4F46E5]">
                                  ÷{crewStaff.length} = {fmtMin(c.durationMin / crewStaff.length)}
                                </span>
                              )}
                            </p>
                          </div>
                          {!published && (
                            <button
                              onClick={() => unassign(c.id)}
                              onPointerDownCapture={(e) => e.stopPropagation()}
                              data-fid={`c-${c.id}-remove`}
                              aria-label={`Remove ${c.name} from the run`}
                              className="ml-auto flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full text-[#6B7280] transition-colors hover:bg-[#FEE2E2] hover:text-[#B91C1C] [@media(pointer:coarse)]:h-11 [@media(pointer:coarse)]:w-11"
                            >
                              <X size={13} weight="bold" />
                            </button>
                          )}
                        </div>
                      </motion.div>
                    </div>
                  );
                });
              })()}
              {runClients.length > 0 && (
                <>
                  <TravelLeg minutes={legs[legs.length - 1].minutes} km={legs[legs.length - 1].km} />
                  <div className="flex items-center gap-2 rounded-[10px] bg-[#F8FAFC] px-2.5 py-1.5">
                    <span className="h-2 w-2 rounded-full bg-[#4F46E5]" />
                    <span className="text-xs font-semibold text-[#111827]">Return to Base</span>
                  </div>
                </>
              )}
            </div>
          )}

          <div className="mt-auto pt-2">
            {runClients.length >= 2 && !published && (
              <button
                onClick={runOptimize}
                className="flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-[10px] border border-[#C7D2FE] bg-[#EEF2FF]/60 px-2 py-1.5 text-xs font-semibold text-[#4F46E5] transition-colors hover:bg-[#EEF2FF] [@media(pointer:coarse)]:min-h-10"
              >
                <Path size={14} weight="bold" />
                Optimise Route Order
              </button>
            )}
            {sum.missingStaff && (
              <p className="m-0 mt-1.5 flex items-center gap-1 rounded-[8px] bg-[#FEF2F2] px-2 py-1 text-[11px] font-semibold text-[#B91C1C]">
                <Warning size={12} weight="bold" /> Pick at least one cleaner
              </p>
            )}
            {sum.longDay && (
              <p className="m-0 mt-1.5 flex items-center gap-1 rounded-[8px] bg-[#FFFBEB] px-2 py-1 text-[11px] font-semibold text-[#B45309]">
                <Warning size={12} weight="bold" /> Long day: over 6h 30m each
              </p>
            )}
          </div>
        </motion.div>

        {/* the live map */}
        <motion.div
          variants={WINDOW_POP}
          ref={(el) => {
            zoneRefs.current.map = el;
          }}
          className={`crp-win-map overflow-hidden rounded-[18px] border border-[#E5E7EB] bg-white shadow-[0_14px_40px_rgba(17,24,39,0.08)] transition-shadow ${
            dropGlow('run') ? 'ring-2 ring-[#4F46E5]/35' : ''
          }`}
        >
          {MAPS_KEY && mapsNear ? (
            <APIProvider apiKey={MAPS_KEY} libraries={['routes']}>
              <DemoRouteMap jobs={runClients} color={RUN_COLOR} onTravel={onTravel} />
            </APIProvider>
          ) : (
            <div className="flex h-full min-h-[420px] items-center justify-center p-6 text-center text-sm text-[#6B7280]">
              {MAPS_KEY
                ? 'Loading the live map…'
                : 'Set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to show the live route map.'}
            </div>
          )}
        </motion.div>

        {/* summary + publish */}
        <motion.div
          variants={WINDOW_POP}
          className="crp-win-summary rounded-[18px] border border-[#E5E7EB] bg-white px-4 py-2.5 shadow-[0_14px_40px_rgba(17,24,39,0.08)] sm:px-5"
        >
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <SummaryStat label="Travel">
              <AnimatedNumber value={sum.travelMin} format={(v) => fmtMin(v)} />
              {' · '}
              <AnimatedNumber value={sum.km} format={(v) => `${(Math.round(v * 10) / 10).toFixed(1)} km`} />
            </SummaryStat>
            <SummaryStat label="Wages">
              <AnimatedNumber value={sum.wages} format={fmtMoney} />
            </SummaryStat>
            <SummaryStat label="Clients pay">
              <AnimatedNumber value={sum.revenue} format={fmtMoney} />
            </SummaryStat>
            <span className="flex items-baseline gap-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wide text-[#6B7280]">Profit</span>
              <AnimatedNumber
                value={sum.profit}
                format={fmtMoney}
                className={`text-xl font-bold tabular-nums ${
                  sum.profit >= 0 ? 'text-[#047857]' : 'text-[#B91C1C]'
                }`}
              />
            </span>
            <span className="ml-auto flex items-center gap-3">
              <span className="text-xs font-semibold text-[#6B7280]">
                {runClients.length}/{DEMO_CLIENTS.length} scheduled
              </span>
              <button
                onClick={() => canPublish && setPublished(true)}
                disabled={!canPublish}
                title={
                  canPublish
                    ? 'Publish the day'
                    : crewStaff.length === 0
                      ? 'Pick at least one cleaner'
                      : 'Schedule all clients to publish'
                }
                className={`rounded-[10px] px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                  canPublish
                    ? 'cursor-pointer bg-[#4F46E5] text-white shadow-[0_0_20px_rgba(79,70,229,0.15)] hover:-translate-y-px hover:bg-[#4338CA]'
                    : 'cursor-not-allowed bg-[#F1F5F9] text-[#6B7280]'
                }`}
              >
                Publish Day
              </button>
            </span>
          </div>
        </motion.div>

        {/* the crew's phone, with the client's words beside it */}
        <motion.div variants={WINDOW_POP} className="crp-win-bottom">
          <div className="shrink-0" style={{ transform: 'rotate(-1deg)' }}>
            <p className="m-0 mb-2 text-center text-[11px] font-bold uppercase tracking-wide text-[#6B7280]">
              What the crew sees
            </p>
            <StaffPhonePreview
              entries={run}
              clients={DEMO_CLIENTS}
              legs={legs}
              staffCount={crewStaff.length}
              color={RUN_COLOR}
            />
          </div>
          {aside && <div style={{ flex: 1, minWidth: 0 }}>{aside}</div>}
        </motion.div>
      </motion.div>

      {/* publish success */}
      <AnimatePresence>
        {published && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="crp-pub-title"
            onKeyDown={(e) => {
              if (e.key === 'Escape') reset();
            }}
            className="absolute inset-0 z-30 flex items-center justify-center rounded-[24px] bg-white/70 p-6 backdrop-blur-sm"
          >
            <motion.div
              initial={reduce ? false : { scale: 0.9, y: 12 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 22 }}
              className="w-full max-w-[340px] rounded-[16px] border border-[#E5E7EB] bg-white p-6 text-center shadow-[0_20px_60px_rgba(17,24,39,0.15)]"
            >
              <CheckCircle size={44} weight="fill" color="#047857" className="mx-auto" />
              <p id="crp-pub-title" className="m-0 mt-2 text-lg font-bold text-[#111827]">
                Day published
              </p>
              <p className="m-0 mt-1 text-sm leading-relaxed text-[#6B7280]">
                The crew now sees this run on their phones, with turn-by-turn travel and a
                checklist at every stop.
              </p>
              <p className="m-0 mt-3 text-sm font-semibold text-[#111827]">
                Projected profit{' '}
                <span className={sum.profit >= 0 ? 'text-[#047857]' : 'text-[#B91C1C]'}>
                  {fmtMoney(sum.profit)}
                </span>
              </p>
              <button
                ref={successBtnRef}
                onClick={reset}
                className="mt-4 w-full cursor-pointer rounded-[10px] bg-[#4F46E5] px-4 py-2.5 text-sm font-semibold text-white transition-all hover:-translate-y-px hover:bg-[#4338CA]"
              >
                Build another day
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return <MotionConfig reducedMotion="user">{board}</MotionConfig>;
}

function SummaryStat({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <span className="flex items-baseline gap-1.5 text-sm font-semibold tabular-nums text-[#111827]">
      <span className="text-[11px] font-bold uppercase tracking-wide text-[#6B7280]">{label}</span>
      {children}
    </span>
  );
}

'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView, useReducedMotion } from 'framer-motion';
import {
  Users,
  CalendarBlank,
  Clock,
  CaretLeft,
  CaretRight,
  Minus,
  Plus,
  CheckCircle,
  CircleNotch,
} from '@phosphor-icons/react';

// A self-driving replica of the Stone Grill reservation flow. A scripted
// cursor walks through a sample booking on a loop: pick a date, pick a time,
// confirm sample details, get a reference. The whole widget is inert, holds
// no live inputs and makes no network calls, so it cannot create a real
// reservation. The real widget on stonegrillhuskisson.com.au shares this
// exact charcoal-and-red anatomy.

const RED = '#cc0000';
const STEPS = ['Party & Date', 'Time', 'Your Details', 'Confirm'];
const SLOT_LABELS = ['5:30 PM', '6:00 PM', '6:30 PM', '7:00 PM', '7:30 PM', '8:00 PM', '8:30 PM'];
const PARTY_SIZE = 2;
const SCRIPT_DATE = 2; // third open day
const SCRIPT_SLOT = 2; // 6:30 PM
const REFERENCE = '2K9F4C7A';

const SAMPLE_DETAILS: Array<[string, string]> = [
  ['Full Name', 'Sam Taylor'],
  ['Phone Number', '0400 123 456'],
  ['Occasion', 'Date Night'],
  ['Special Requests', 'Window table if possible'],
];

interface DemoDay {
  label: string;
  dayName: string;
  dayNum: number;
  month: string;
  seed: number;
}

function nextOpenDays(count: number): DemoDay[] {
  const days: DemoDay[] = [];
  const d = new Date();
  d.setDate(d.getDate() + 1);
  while (days.length < count) {
    if (d.getDay() !== 0) {
      // closed Sundays, like the restaurant
      days.push({
        label: d.toLocaleDateString('en-AU', { weekday: 'long', day: 'numeric', month: 'long' }),
        dayName: d.toLocaleDateString('en-AU', { weekday: 'short' }),
        dayNum: d.getDate(),
        month: d.toLocaleDateString('en-AU', { month: 'short' }),
        seed: d.getDate() + d.getMonth() * 3,
      });
    }
    d.setDate(d.getDate() + 1);
  }
  return days;
}

// staged availability: deterministic per date so the demo feels alive
function slotAvailability(seed: number, slotIdx: number): number {
  if ((seed + slotIdx * 3) % 7 === 2) return 0; // Full
  return 2 + ((seed * 5 + slotIdx * 7) % 13);
}

export default function StonegrillDemoBooking() {
  const reduce = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(containerRef, { margin: '-80px 0px' });

  const [step, setStep] = useState(0);
  const [dateIdx, setDateIdx] = useState<number | null>(null);
  const [slotIdx, setSlotIdx] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [cursor, setCursor] = useState({ x: 80, y: 100, shown: false, down: false });
  // dates are timezone-dependent, so they only exist client-side (hydration-safe)
  const [days, setDays] = useState<DemoDay[]>([]);

  const targets = useRef<Record<string, HTMLElement | null>>({});
  const reg = (key: string) => (el: HTMLElement | null) => {
    targets.current[key] = el;
  };

  useEffect(() => {
    setDays(nextOpenDays(8));
  }, []);

  useEffect(() => {
    if (reduce) {
      // no auto-play under reduced motion: rest on the confirmation frame
      setStep(3);
      setDateIdx(SCRIPT_DATE);
      setSlotIdx(SCRIPT_SLOT);
      return;
    }
    if (!inView || days.length === 0) return;

    let alive = true;
    const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

    const moveToAndClick = async (key: string) => {
      const el = targets.current[key];
      const c = containerRef.current;
      if (!el || !c || !alive) return;
      const er = el.getBoundingClientRect();
      const cr = c.getBoundingClientRect();
      setCursor((p) => ({
        ...p,
        shown: true,
        x: er.left - cr.left + er.width / 2,
        y: er.top - cr.top + er.height / 2,
      }));
      await sleep(650);
      if (!alive) return;
      setCursor((p) => ({ ...p, down: true }));
      await sleep(170);
      setCursor((p) => ({ ...p, down: false }));
    };

    (async () => {
      while (alive) {
        setStep(0);
        setDateIdx(null);
        setSlotIdx(null);
        setSubmitting(false);
        await sleep(950);
        if (!alive) break;
        await moveToAndClick('date');
        if (!alive) break;
        setDateIdx(SCRIPT_DATE);
        await sleep(650);
        if (!alive) break;
        await moveToAndClick('cta0');
        if (!alive) break;
        setStep(1);
        await sleep(850);
        if (!alive) break;
        await moveToAndClick('slot');
        if (!alive) break;
        setSlotIdx(SCRIPT_SLOT);
        await sleep(600);
        if (!alive) break;
        await moveToAndClick('cta1');
        if (!alive) break;
        setStep(2);
        await sleep(1150);
        if (!alive) break;
        await moveToAndClick('confirm');
        if (!alive) break;
        setSubmitting(true);
        await sleep(950);
        if (!alive) break;
        setSubmitting(false);
        setStep(3);
        setCursor((p) => ({ ...p, shown: false }));
        await sleep(3800);
      }
    })();

    return () => {
      alive = false;
    };
  }, [inView, reduce, days.length]);

  const day = days.length > 0 ? days[dateIdx ?? SCRIPT_DATE] : null;

  const stepMotion = reduce
    ? {}
    : {
        initial: { opacity: 0, x: 40 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -40 },
        transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] as const },
      };

  return (
    <div>
      <p className="sr-only">
        Animated demonstration of the Stone Grill booking flow: choose a date, pick a time,
        confirm sample details and receive a booking reference. It loops with sample data and
        cannot make a real reservation.
      </p>

      <div
        inert
        ref={containerRef}
        aria-hidden="true"
        className="relative w-full select-none overflow-hidden border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl md:p-8"
        style={{ fontFeatureSettings: '"tnum"' }}
      >
        <div
          className="pointer-events-none absolute -right-32 -top-32 h-64 w-64 rounded-full opacity-20 blur-[100px]"
          style={{ background: RED }}
        />

        {/* step indicator */}
        <div className="relative mb-7">
          <ol className="flex items-center gap-1.5 sm:gap-2" style={{ listStyle: 'none', margin: 0, padding: 0 }}>
            {STEPS.map((label, i) => (
              <li key={label} className="flex items-center gap-1.5 sm:gap-2">
                {i > 0 && (
                  <span className={`h-px w-4 sm:w-8 ${i <= step ? 'bg-[#cc0000]' : 'bg-stone-800'}`} />
                )}
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                    i < step ? 'bg-[#cc0000] text-white' : i === step ? 'bg-white text-black' : 'bg-stone-800 text-stone-400'
                  }`}
                >
                  {i < step ? '✓' : i + 1}
                </span>
                <span
                  className={`hidden text-xs uppercase tracking-widest sm:block ${
                    i === step ? 'text-white' : 'text-stone-400'
                  }`}
                >
                  {label}
                </span>
              </li>
            ))}
          </ol>
        </div>

        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div key="s0" {...stepMotion}>
              <p className="m-0 mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-widest" style={{ color: '#a8a29e' }}>
                <Users size={16} /> Party Size
              </p>
              <div className="mb-6 flex">
                <span className="flex h-14 w-14 items-center justify-center border border-stone-500 text-stone-300">
                  <Minus size={16} weight="bold" />
                </span>
                <div className="flex h-14 flex-1 flex-col items-center justify-center border-y border-stone-500 bg-stone-900/40">
                  <span className="text-2xl font-bold tabular-nums text-white" style={{ fontFamily: 'var(--font-cinzel)' }}>
                    {PARTY_SIZE}
                  </span>
                  <span className="text-[10px] uppercase tracking-widest text-stone-400">guests</span>
                </div>
                <span className="flex h-14 w-14 items-center justify-center border border-stone-500 text-stone-300">
                  <Plus size={16} weight="bold" />
                </span>
              </div>

              <p className="m-0 mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-widest" style={{ color: '#a8a29e' }}>
                <CalendarBlank size={16} /> Date
              </p>
              <div className="mb-1 grid grid-cols-4 gap-2">
                {days.length === 0
                  ? Array.from({ length: 8 }, (_, i) => (
                      <div key={i} className="h-[74px] border border-stone-800" />
                    ))
                  : days.map((d, i) => (
                      <div
                        key={i}
                        ref={i === SCRIPT_DATE ? reg('date') : undefined}
                        className={`flex flex-col items-center gap-0.5 border p-2 transition-colors ${
                          dateIdx === i
                            ? 'border-white bg-white text-black'
                            : 'border-stone-800 text-stone-400'
                        }`}
                      >
                        <span className="text-[10px] uppercase">{d.dayName}</span>
                        <span className="text-lg font-bold" style={{ fontFamily: 'var(--font-cinzel)' }}>
                          {d.dayNum}
                        </span>
                        <span className="text-[10px] uppercase">{d.month}</span>
                      </div>
                    ))}
              </div>
              <p className="m-0 mb-5 text-[11px]" style={{ color: '#a8a29e' }}>
                Closed Sundays.
              </p>

              <div
                ref={reg('cta0')}
                className={`flex w-full items-center justify-center gap-2 py-4 text-sm font-medium uppercase tracking-widest transition-colors ${
                  dateIdx !== null ? 'bg-[#cc0000] text-white' : 'bg-stone-800 text-stone-500'
                }`}
              >
                View Available Times <CaretRight size={15} weight="bold" />
              </div>
            </motion.div>
          )}

          {step === 1 && day && (
            <motion.div key="s1" {...stepMotion}>
              <p className="m-0 mb-4 flex items-center gap-1.5 text-sm text-stone-400">
                <CaretLeft size={14} weight="bold" /> Back
              </p>
              <p className="m-0 mb-1 flex items-center gap-2 text-xs font-medium uppercase tracking-widest" style={{ color: '#a8a29e' }}>
                <Clock size={16} /> Available Times, {day.label}
              </p>
              <p className="m-0 mb-4 text-xs" style={{ color: '#a8a29e' }}>
                {PARTY_SIZE} guests · Greyed = full or unavailable
              </p>
              <div className="mb-5 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                {SLOT_LABELS.map((label, i) => {
                  const left = slotAvailability(day.seed, i);
                  const bookable = left >= PARTY_SIZE;
                  const selected = slotIdx === i && bookable;
                  return (
                    <div
                      key={label}
                      ref={i === SCRIPT_SLOT ? reg('slot') : undefined}
                      className={`flex flex-col items-center gap-0.5 border py-3.5 transition-colors ${
                        selected
                          ? 'border-[#cc0000] bg-[#cc0000]/10 text-white'
                          : bookable
                            ? 'border-stone-500 text-stone-300'
                            : 'border-stone-800 text-stone-700'
                      }`}
                    >
                      <span className="text-base font-medium">{label}</span>
                      <span className={`text-xs ${bookable ? 'text-stone-400' : 'text-stone-700'}`}>
                        {left === 0 ? 'Full' : `${left} left`}
                      </span>
                    </div>
                  );
                })}
              </div>
              <div
                ref={reg('cta1')}
                className={`flex w-full items-center justify-center gap-2 py-4 text-sm font-medium uppercase tracking-widest transition-colors ${
                  slotIdx !== null ? 'bg-[#cc0000] text-white' : 'bg-stone-800 text-stone-500'
                }`}
              >
                Continue <CaretRight size={15} weight="bold" />
              </div>
            </motion.div>
          )}

          {step === 2 && day && (
            <motion.div key="s2" {...stepMotion}>
              <p className="m-0 mb-4 flex items-center gap-1.5 text-sm text-stone-400">
                <CaretLeft size={14} weight="bold" /> Back
              </p>
              <div className="mb-5 flex flex-wrap gap-x-4 gap-y-1.5 border border-white/10 bg-white/5 p-3.5 text-sm text-stone-300">
                <span className="flex items-center gap-1.5">
                  <CalendarBlank size={14} />
                  {day.dayName} {day.dayNum} {day.month}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock size={14} />
                  {SLOT_LABELS[SCRIPT_SLOT]}
                </span>
                <span className="flex items-center gap-1.5">
                  <Users size={14} />
                  {PARTY_SIZE} guests
                </span>
              </div>

              {SAMPLE_DETAILS.map(([label, value]) => (
                <div key={label} className="mb-3">
                  <p className="m-0 mb-1 text-xs uppercase tracking-widest" style={{ color: '#a8a29e' }}>
                    {label}
                  </p>
                  <p className="m-0 w-full border border-stone-500 bg-white/5 px-4 py-3 text-white">
                    {value}
                  </p>
                </div>
              ))}

              <div
                ref={reg('confirm')}
                className="mt-5 flex w-full items-center justify-center gap-2 bg-[#cc0000] py-4 text-sm font-medium uppercase tracking-widest text-white"
              >
                {submitting ? (
                  <>
                    <CircleNotch size={17} className="animate-spin" /> Confirming…
                  </>
                ) : (
                  'Confirm Booking'
                )}
              </div>
            </motion.div>
          )}

          {step === 3 && day && (
            <motion.div key="s3" {...stepMotion} className="text-center">
              <CheckCircle size={56} weight="fill" color={RED} className="mx-auto" />
              <p className="m-0 mt-3 text-3xl font-bold text-white" style={{ fontFamily: 'var(--font-cinzel)' }}>
                You&rsquo;re Booked!
              </p>
              <p className="m-0 mt-1 text-sm text-stone-400">
                Sample booking confirmed with demo data.
              </p>
              <div className="mx-auto mt-5 max-w-sm border border-white/10 bg-white/5 p-5 text-left">
                {[
                  ['Name', 'Sam Taylor'],
                  ['Date & Time', `${day.dayName} ${day.dayNum} ${day.month} · ${SLOT_LABELS[SCRIPT_SLOT]}`],
                  ['Party', `${PARTY_SIZE} guests`],
                  ['Reference', REFERENCE],
                ].map(([k, v]) => (
                  <div key={k} className="flex items-baseline justify-between gap-4 py-1.5">
                    <span className="text-xs uppercase tracking-widest text-stone-400">{k}</span>
                    <span className={`text-sm text-white ${k === 'Reference' ? 'font-mono' : ''}`}>{v}</span>
                  </div>
                ))}
              </div>
              <p className="m-0 mt-4 text-xs" style={{ color: '#a8a29e' }}>
                The real system emails a confirmation with a one-click cancel link.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* the scripted cursor driving the demo */}
        {!reduce && (
          <motion.div
            className="pointer-events-none absolute left-0 top-0 z-20"
            animate={{
              x: cursor.x,
              y: cursor.y,
              opacity: cursor.shown ? 1 : 0,
              scale: cursor.down ? 0.8 : 1,
            }}
            transition={{
              x: { type: 'spring', stiffness: 160, damping: 26 },
              y: { type: 'spring', stiffness: 160, damping: 26 },
              opacity: { duration: 0.35 },
              scale: { duration: 0.15 },
            }}
            style={{ marginLeft: -14, marginTop: -14 }}
          >
            <span className="block h-7 w-7 rounded-full border-2 border-white bg-white/25 shadow-[0_2px_14px_rgba(0,0,0,0.55)] backdrop-blur-sm" />
            <AnimatePresence>
              {cursor.down && (
                <motion.span
                  key="ripple"
                  initial={{ opacity: 0.6, scale: 1 }}
                  animate={{ opacity: 0, scale: 2 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.45, ease: 'easeOut' }}
                  className="absolute inset-0 rounded-full border-2 border-white"
                />
              )}
            </AnimatePresence>
          </motion.div>
        )}

        <p className="relative m-0 mt-6 border-t border-white/10 pt-3 text-center text-[11px]" style={{ color: '#a8a29e' }}>
          Booking system built &amp; maintained by Riley Tech Studio
        </p>
      </div>

      <p className="m-0 mt-3 text-center text-xs" style={{ color: '#a8a29e' }}>
        Self-running demo with sample data. Nothing is saved and it can&rsquo;t make a real booking.
      </p>
    </div>
  );
}

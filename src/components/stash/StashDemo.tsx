'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import QRCode from 'react-qr-code';
import { motion, AnimatePresence, useInView, useReducedMotion } from 'framer-motion';
import { Clock, Fire, CheckCircle, Check } from '@phosphor-icons/react';

// The Today's Stash loop told through one phone, both sides of it. Four
// beats, each pinned 1:1 to a rail step: the venue publishes from its own
// dashboard (a merchant screen on the same phone), the coupon lands in the
// town feed, the shopper's camera scans the printed counter poster, and the
// database verifies and logs it. Beats only tick while the demo is in view,
// so scrollers always catch the story from a sensible point; rail clicks
// jump. Numbers stay consistent across the loop: 10 posted, 9 left after
// the one redemption we watch.

const LIME = '#9afc5d';
const PIN = '482913';
const BEATS = ['post', 'feed', 'scan', 'saved'] as const;
type Beat = (typeof BEATS)[number];
const BEAT_MS: Record<Beat, number> = { post: 4400, feed: 3600, scan: 3400, saved: 4000 };

const STORY: Array<{ beat: Beat; title: string; body: string }> = [
  {
    beat: 'post',
    title: 'A venue posts a deal',
    body: 'Price, stock and a time window. Live in seconds.',
  },
  {
    beat: 'feed',
    title: 'It lands in the town feed',
    body: 'A live coupon with real stock and a countdown.',
  },
  {
    beat: 'scan',
    title: 'Scanned at the counter',
    body: 'The shopper’s camera reads the venue’s printed poster.',
  },
  {
    beat: 'saved',
    title: 'Verified and logged',
    body: 'Stock drops and the venue sees it instantly.',
  },
];

export default function StashDemo({ aside }: { aside?: React.ReactNode }) {
  const reduce = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const inView = useInView(rootRef, { margin: '-80px 0px' });
  const [beat, setBeat] = useState<Beat>('post');
  const [published, setPublished] = useState(false);
  const [detected, setDetected] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const prevBeat = useRef<Beat>('post');
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const advance = () => {
    setBeat((b) => {
      prevBeat.current = b;
      return BEATS[(BEATS.indexOf(b) + 1) % BEATS.length];
    });
  };

  const jumpTo = (b: Beat) => {
    setBeat((cur) => {
      prevBeat.current = cur;
      return b;
    });
  };

  useEffect(() => {
    setHydrated(true);
  }, []);

  // reduced motion: no autoplay, rest on the feed beat
  useEffect(() => {
    if (reduce) setBeat('feed');
  }, [reduce]);

  // the loop only ticks while the demo is actually on screen
  useEffect(() => {
    if (reduce || !inView) return;
    timer.current = setTimeout(advance, BEAT_MS[beat]);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [beat, reduce, inView]);

  // sub-moments inside a beat: the publish press and the QR detection
  useEffect(() => {
    if (beat === 'post') {
      if (reduce) {
        setPublished(true);
        return;
      }
      setPublished(false);
      if (!inView) return;
      const t = setTimeout(() => setPublished(true), 2400);
      return () => clearTimeout(t);
    }
    if (beat === 'scan') {
      if (reduce) {
        setDetected(true);
        return;
      }
      setDetected(false);
      if (!inView) return;
      const t = setTimeout(() => setDetected(true), 2200);
      return () => clearTimeout(t);
    }
  }, [beat, reduce, inView]);

  const sheetUp = beat === 'scan' || beat === 'saved';
  const saved = beat === 'saved';
  const activeStory = BEATS.indexOf(beat);
  // the loop reset is a scene cut: let the sheet clear before the dashboard enters
  const resetting = beat === 'post' && prevBeat.current === 'saved';

  return (
    <div ref={rootRef} className="stash-layout">
      <p className="sr-only">
        Animated demonstration of the Today&rsquo;s Stash app using sample data: a venue
        publishes a deal from its merchant dashboard, the coupon lands in the town feed, a
        shopper scans the printed counter poster, and the redemption is verified and logged.
      </p>

      {/* narrative rail: one step per beat, always in sync with the phone */}
      <div>
        {STORY.map((s, i) => {
          const active = activeStory === i;
          return (
            <button
              key={s.beat}
              onClick={() => jumpTo(s.beat)}
              className={`stash-step block w-full cursor-pointer border-l-2 py-3.5 pl-5 pr-2 text-left transition-colors duration-300${active ? ' is-active' : ''}`}
              style={{
                borderColor: active ? LIME : 'rgba(255,255,255,0.12)',
                background: active ? 'rgba(154,252,93,0.05)' : 'transparent',
              }}
            >
              <span
                className="block text-base font-bold transition-colors duration-300"
                style={{ color: active ? '#E8FFF3' : '#8F908E' }}
              >
                {s.title}
              </span>
              <span
                className="mt-1 block text-sm leading-relaxed transition-colors duration-300"
                style={{ color: active ? '#B8C4BC' : '#7c8781' }}
              >
                {s.body}
              </span>
            </button>
          );
        })}
        <p className="m-0 mt-5 pl-5 text-xs" style={{ color: '#7c8781' }}>
          {hydrated && reduce
            ? 'Click a step to explore each stage.'
            : 'Plays on its own. Click a step to jump there.'}
        </p>
      </div>

      {/* the phone, the whole story */}
      <div className="stash-stage">
        <div className="w-[272px]">
          <div className="overflow-hidden rounded-[32px] border-[8px] border-black bg-[#0B1210] shadow-[0_24px_60px_rgba(0,0,0,0.55)]">
            <div className="relative h-[512px]">
              {/* consumer feed, the base screen */}
              <div className="absolute inset-0 flex flex-col p-3.5">
                <div className="mb-3 flex items-center gap-2">
                  <Image src="/casestudy/stash-chest.png" alt="" width={26} height={22} aria-hidden="true" />
                  <p className="m-0 text-sm font-bold" style={{ color: '#E8FFF3' }}>
                    Today&rsquo;s Stash
                  </p>
                  <span className="ml-auto rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400 ring-1 ring-emerald-400/40">
                    Sussex Inlet
                  </span>
                </div>

                <AnimatePresence>
                  {beat !== 'post' && (
                    <motion.div
                      key="coupon"
                      initial={reduce ? false : { opacity: 0, y: -18, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ type: 'spring', stiffness: 220, damping: 24 }}
                      onClick={() => beat === 'feed' && advance()}
                      className={`relative overflow-hidden rounded-xl ${beat === 'feed' ? 'cursor-pointer' : ''}`}
                    >
                      {/* image banner */}
                      <div
                        className="relative flex h-20 items-center justify-center overflow-hidden"
                        style={{
                          background: 'linear-gradient(135deg, #0f2318 0%, #123a24 55%, #0b5233 100%)',
                        }}
                      >
                        <span
                          className="text-3xl"
                          style={{
                            fontFamily: "'Bebas Neue Pro Expanded', var(--font-heading)",
                            fontStyle: 'italic',
                            color: LIME,
                            textShadow: '0 2px 18px rgba(154,252,93,0.35)',
                          }}
                        >
                          2-FOR-1
                        </span>
                        {saved && (
                          <motion.div
                            initial={reduce ? false : { opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="absolute inset-0 flex items-center justify-center bg-black/50"
                          >
                            <span className="rounded-full bg-emerald-500 px-5 py-1.5 text-sm font-bold text-[#04120b]">
                              Redeemed
                            </span>
                          </motion.div>
                        )}
                      </div>
                      {/* body */}
                      <div
                        className="p-3"
                        style={{
                          background: '#1a1a1a url(/casestudy/stash-cardtexture.jpg) center/cover',
                          backgroundBlendMode: 'overlay',
                        }}
                      >
                        <p className="m-0 truncate text-lg font-bold text-white">2-for-1 Coffee</p>
                        <p className="m-0 mb-2 truncate text-xs text-white/85">Sussex Inlet Bistro</p>
                        <div className="flex items-end justify-between gap-2">
                          <div className="min-w-0">
                            <p className="m-0 flex items-center gap-1 text-[11px] font-medium" style={{ color: '#77c769' }}>
                              <Clock size={12} weight="bold" /> Expires in 2h 41m
                            </p>
                            <p className="m-0 mt-0.5 flex items-center gap-1 text-[11px] font-medium" style={{ color: '#f4586b' }}>
                              <Fire size={12} weight="fill" /> {saved ? '9 left' : '10 left'}
                            </p>
                          </div>
                          <p className="m-0 text-right leading-none">
                            <span className="mr-1.5 text-xs text-gray-400 line-through">$9</span>
                            <span className="text-3xl font-black tracking-tight" style={{ color: LIME }}>
                              $4.50
                            </span>
                          </p>
                        </div>
                      </div>
                      {/* perforated stub */}
                      <div
                        className="border-t border-dashed px-3 py-2 text-center"
                        style={{
                          background: '#1a1a1a',
                          borderColor: '#818281',
                          WebkitMaskImage:
                            'radial-gradient(circle 6px at 10px 100%, transparent 6px, black 6.5px)',
                          WebkitMaskSize: '20px 100%',
                          WebkitMaskRepeat: 'repeat-x',
                        }}
                      >
                        <span
                          className="font-mono text-[10px] font-bold uppercase tracking-widest"
                          style={{ color: saved ? '#34d399' : '#b4b5b3' }}
                        >
                          {saved ? 'Redeemed' : 'Tap to redeem'}
                        </span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* the rest of the town feed, peeking in under the hero coupon */}
                {beat !== 'post' && (
                  <div aria-hidden="true" className="mt-3 overflow-hidden rounded-xl opacity-30">
                    <div
                      className="flex h-16 items-center justify-center"
                      style={{
                        background: 'linear-gradient(135deg, #10202e 0%, #14304a 60%, #0e3c5c 100%)',
                      }}
                    >
                      <span
                        className="text-2xl"
                        style={{
                          fontFamily: "'Bebas Neue Pro Expanded', var(--font-heading)",
                          fontStyle: 'italic',
                          color: '#8fd4fe',
                        }}
                      >
                        30% OFF
                      </span>
                    </div>
                    <div className="p-3" style={{ background: '#1a1a1a' }}>
                      <p className="m-0 truncate text-base font-bold text-white">Half-Price Fish &amp; Chips</p>
                    </div>
                  </div>
                )}
              </div>

              {/* merchant screen: the venue's side, on the same phone */}
              <AnimatePresence>
                {beat === 'post' && (
                  <motion.div
                    key="merchant"
                    initial={reduce ? false : { x: 44, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -60, opacity: 0 }}
                    transition={{
                      type: 'spring',
                      stiffness: 260,
                      damping: 30,
                      delay: resetting && !reduce ? 0.25 : 0,
                    }}
                    className="absolute inset-0 z-10 flex flex-col p-3.5"
                    style={{ background: '#0B1210' }}
                  >
                    <div className="mb-3 flex items-center gap-2">
                      <Image src="/casestudy/stash-chest.png" alt="" width={26} height={22} aria-hidden="true" />
                      <div className="min-w-0">
                        <p className="m-0 truncate text-sm font-bold leading-tight" style={{ color: '#E8FFF3' }}>
                          Sussex Inlet Bistro
                        </p>
                        <p className="m-0 text-[11px] leading-tight" style={{ color: '#8F908E' }}>
                          Merchant dashboard
                        </p>
                      </div>
                    </div>

                    <div className="rounded-xl bg-white/[0.04] p-3 ring-1 ring-white/10">
                      <p className="m-0 mb-2 text-[11px] font-bold uppercase tracking-widest" style={{ color: '#8F908E' }}>
                        New deal
                      </p>
                      <p className="m-0 text-base font-bold text-white">2-for-1 Coffee</p>
                      <p className="m-0 mt-1 text-sm" style={{ color: '#B8C4BC' }}>
                        <span className="mr-1.5 text-gray-400 line-through">$9.00</span>
                        <span className="font-bold" style={{ color: LIME }}>
                          $4.50
                        </span>
                      </p>
                      <p className="m-0 mt-2 text-[11px]" style={{ color: '#8F908E' }}>
                        10 available &middot; Today 5:00 - 8:00 pm
                      </p>
                    </div>

                    <motion.div
                      animate={published && !reduce ? { scale: [1, 0.96, 1] } : { scale: 1 }}
                      transition={{ duration: 0.3 }}
                      className="mt-3 flex h-11 items-center justify-center gap-1.5 rounded-xl text-sm font-bold transition-colors duration-300"
                      style={{
                        background: published ? 'rgba(125,231,89,0.14)' : '#7de759',
                        color: published ? '#7de759' : '#04120b',
                        boxShadow: published ? 'inset 0 0 0 1px rgba(125,231,89,0.4)' : 'none',
                      }}
                    >
                      {published ? (
                        <>
                          <Check size={16} weight="bold" /> Published
                        </>
                      ) : (
                        'Publish deal'
                      )}
                    </motion.div>
                    {published && (
                      <motion.p
                        initial={reduce ? false : { opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="m-0 mt-2 text-center text-[11px]"
                        style={{ color: '#8F908E' }}
                      >
                        Live in the town feed.
                      </motion.p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* camera sheet: the shopper scans the counter poster */}
              <AnimatePresence>
                {sheetUp && (
                  <motion.div
                    key="sheet"
                    initial={reduce ? false : { y: '100%' }}
                    animate={{ y: 0 }}
                    exit={{ y: '100%' }}
                    transition={{ type: 'spring', stiffness: 220, damping: 26 }}
                    className="absolute inset-x-0 bottom-0 z-20 rounded-t-3xl p-4 ring-1 ring-white/10"
                    style={{ background: '#070F18' }}
                  >
                    <div className="mx-auto mb-3 h-1.5 w-10 rounded-full bg-white/20" />
                    {!saved ? (
                      <>
                        <p className="m-0 text-[11px] text-white/60">Sussex Inlet Bistro</p>
                        <p className="m-0 mb-3 text-base font-semibold text-white">2-for-1 Coffee</p>
                        {/* viewfinder: the phone's camera aimed at the printed poster */}
                        <div
                          aria-hidden="true"
                          className="relative mx-auto h-40 w-40 overflow-hidden rounded-2xl"
                          style={{
                            background: 'radial-gradient(ellipse at 50% 40%, #12231b 0%, #050B10 78%)',
                          }}
                        >
                          <div
                            className="absolute left-1/2 top-1/2 w-[96px] -translate-x-1/2 -translate-y-1/2 rounded-md bg-white p-2 shadow-lg"
                            style={{ rotate: '-3deg' }}
                          >
                            <QRCode
                              value={`TODAYS-STASH-${PIN}`}
                              size={80}
                              bgColor="#ffffff"
                              fgColor="#101214"
                              style={{ width: '100%', height: 'auto' }}
                            />
                            <p className="m-0 mt-1 text-center text-[7px] font-black uppercase tracking-wider text-[#101214]">
                              Scan to redeem
                            </p>
                            <p className="m-0 text-center text-[6.5px] text-[#101214]/60">Sussex Inlet Bistro</p>
                          </div>
                          {/* camera framing */}
                          <span className="absolute left-2 top-2 h-5 w-5 rounded-tl-lg border-l-2 border-t-2 border-emerald-400/80" />
                          <span className="absolute right-2 top-2 h-5 w-5 rounded-tr-lg border-r-2 border-t-2 border-emerald-400/80" />
                          <span className="absolute bottom-2 left-2 h-5 w-5 rounded-bl-lg border-b-2 border-l-2 border-emerald-400/80" />
                          <span className="absolute bottom-2 right-2 h-5 w-5 rounded-br-lg border-b-2 border-r-2 border-emerald-400/80" />
                          {!reduce && !detected && (
                            <motion.span
                              aria-hidden="true"
                              initial={{ y: 0 }}
                              animate={{ y: [0, 136, 0] }}
                              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                              className="absolute inset-x-3 top-2 h-0.5 rounded-full bg-emerald-400/80"
                            />
                          )}
                        </div>
                        {detected ? (
                          <p className="m-0 mt-3 text-center text-[11px] font-semibold text-emerald-400">
                            Code detected &middot; {PIN} filled automatically
                          </p>
                        ) : (
                          <p className="m-0 mt-3 text-center text-[11px] text-white/60">
                            Scanning the counter poster&hellip;
                          </p>
                        )}
                      </>
                    ) : (
                      <div className="relative text-center">
                        {!reduce &&
                          [...Array(10)].map((_, i) => (
                            <motion.span
                              key={i}
                              className="absolute left-1/2 top-6 h-2 w-2 rounded-full"
                              style={{ background: ['#7de759', '#10b981', '#ffe259', '#34d399'][i % 4] }}
                              initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                              animate={{
                                x: Math.cos((i / 10) * Math.PI * 2) * 95,
                                y: Math.sin((i / 10) * Math.PI * 2) * 60 - 16,
                                opacity: 0,
                                scale: 0.4,
                              }}
                              transition={{ duration: 0.9, ease: 'easeOut' }}
                            />
                          ))}
                        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 ring-1 ring-emerald-400/40">
                          <CheckCircle size={28} weight="fill" color="#34d399" />
                        </span>
                        <p className="m-0 mt-2 text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-400">
                          Show this screen to the staff
                        </p>
                        <div className="mt-3 rounded-xl border border-emerald-400/50 bg-emerald-500/5 p-3 text-left">
                          <p className="m-0 text-[11px] text-white/60">Offer validated</p>
                          <p className="m-0 text-sm font-bold text-white">2-for-1 Coffee</p>
                          <p className="m-0 text-[11px] text-white/70">Sussex Inlet Bistro</p>
                        </div>
                        <p className="m-0 mt-2 text-[11px] text-white/50">
                          Logged on the venue&rsquo;s dashboard. 9 left.
                        </p>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* testimonial + ask, the third column */}
      {aside ? <div className="stash-aside">{aside}</div> : null}
    </div>
  );
}

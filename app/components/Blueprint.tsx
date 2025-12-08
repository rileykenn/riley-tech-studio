"use client";

import { motion, type Variants } from "framer-motion";
import { ReactNode } from "react";

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" },
  },
};

function Pill({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-full border border-cyan-200/40 bg-cyan-500/5 px-3 py-1 text-[11px] font-medium tracking-wide text-cyan-50/90 backdrop-blur">
      {children}
    </span>
  );
}

export default function Blueprint() {
  return (
    <section className="relative w-full bg-[#0057C2] py-20 md:py-28">
      {/* Blueprint gradient base */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_#0a77ff_0,_#0057c2_40%,_#003c86_100%)]" />

      {/* Grid overlay */}
      <div className="pointer-events-none absolute inset-0 opacity-30 mix-blend-screen">
        <div className="h-full w-full bg-[linear-gradient(to_right,rgba(255,255,255,0.18)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.18)_1px,transparent_1px)] bg-[size:80px_80px]" />
      </div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariants}
        className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 md:px-10 lg:flex-row lg:items-center"
      >
        {/* LEFT: copy */}
        <div className="flex-1 space-y-6 text-cyan-50">
          <Pill>Build &amp; integrate</Pill>

          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl lg:text-5xl">
            I architect your website, automations &amp; CRM like a{" "}
            <span className="underline decoration-cyan-200/90 decoration-[3px]">
              blueprint
            </span>
            — every system planned before it&apos;s built.
          </h2>

          <p className="max-w-xl text-sm md:text-base text-cyan-50/80">
            Most businesses bolt tools on randomly. I map your website, CRM,
            forms, automations and internal processes as one connected layout —
            then build clean flows behind the scenes so nothing leaks.
          </p>

          <div className="grid gap-4 text-xs md:grid-cols-2 md:text-sm">
            <div className="rounded-xl border border-cyan-100/20 bg-cyan-900/10 p-4 backdrop-blur-sm">
              <h3 className="mb-1 text-[13px] font-semibold text-cyan-50">
                Systems mapped first
              </h3>
              <p className="text-cyan-50/75">
                Lead capture, sales pipeline, onboarding and operations
                sketched as a single flow before any code is written.
              </p>
            </div>
            <div className="rounded-xl border border-cyan-100/20 bg-cyan-900/10 p-4 backdrop-blur-sm">
              <h3 className="mb-1 text-[13px] font-semibold text-cyan-50">
                Built to plug into what you already use
              </h3>
              <p className="text-cyan-50/75">
                Xero, CRMs, booking tools, email platforms — your website
                becomes the front door to the systems you already rely on.
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT: fake blueprint card */}
        <div className="flex-1">
          <div className="relative mx-auto max-w-md rounded-3xl border border-cyan-100/40 bg-cyan-900/10 p-5 shadow-[0_0_60px_rgba(7,25,79,0.9)] backdrop-blur-md">
            {/* subtle highlight */}
            <div className="pointer-events-none absolute inset-x-10 top-0 h-20 rounded-b-full bg-[radial-gradient(circle,_rgba(255,255,255,0.18),transparent_60%)] opacity-70" />

            {/* fake floorplan */}
            <svg
              viewBox="0 0 440 300"
              className="relative z-10 h=[260px] w-full text-cyan-50/90"
            >
              <g
                stroke="currentColor"
                strokeWidth="1.3"
                fill="none"
                strokeLinejoin="round"
              >
                {/* outer walls */}
                <rect
                  x="24"
                  y="24"
                  width="392"
                  height="252"
                  className="animate-[blueprint-draw_1.6s_ease-out_forwards]"
                  strokeDasharray="820"
                  strokeDashoffset="820"
                />

                {/* vertical dividers */}
                <path
                  d="M180 24v252 M300 24v252"
                  className="animate-[blueprint-draw_1.4s_ease-out_0.2s_forwards]"
                  strokeDasharray="620"
                  strokeDashoffset="620"
                />

                {/* horizontal dividers */}
                <path
                  d="M24 130h392 M24 210h392"
                  className="animate-[blueprint-draw_1.4s_ease-out_0.35s_forwards]"
                  strokeDasharray="520"
                  strokeDashoffset="520"
                />

                {/* door / connectors */}
                <path
                  d="M180 80h-30 M180 176h-30 M300 260h-30"
                  className="animate-[blueprint-draw_1.2s_ease-out_0.55s_forwards]"
                  strokeDasharray="160"
                  strokeDashoffset="160"
                />

                {/* labels */}
                <text
                  x="60"
                  y="80"
                  fontSize="11"
                  fill="currentColor"
                  className="uppercase tracking-[0.16em] opacity-0 [animation:fade-in_0.6s_ease-out_0.8s_forwards]"
                >
                  LEAD CAPTURE
                </text>
                <text
                  x="215"
                  y="80"
                  fontSize="11"
                  fill="currentColor"
                  className="uppercase tracking-[0.16em] opacity-0 [animation:fade-in_0.6s_ease-out_0.9s_forwards]"
                >
                  WEBSITE
                </text>
                <text
                  x="335"
                  y="80"
                  fontSize="11"
                  fill="currentColor"
                  className="uppercase tracking-[0.16em] opacity-0 [animation:fade-in_0.6s_ease-out_1s_forwards]"
                >
                  CRM
                </text>

                <text
                  x="70"
                  y="190"
                  fontSize="11"
                  fill="currentColor"
                  className="uppercase tracking-[0.16em] opacity-0 [animation:fade-in_0.6s_ease-out_1.1s_forwards]"
                >
                  FOLLOW UP
                </text>
                <text
                  x="225"
                  y="190"
                  fontSize="11"
                  fill="currentColor"
                  className="uppercase tracking-[0.16em] opacity-0 [animation:fade-in_0.6s_ease-out_1.2s_forwards]"
                >
                  BOOKINGS
                </text>
                <text
                  x="328"
                  y="190"
                  fontSize="11"
                  fill="currentColor"
                  className="uppercase tracking-[0.16em] opacity-0 [animation:fade-in_0.6s_ease-out_1.3s_forwards]"
                >
                  REPORTING
                </text>
              </g>
            </svg>

            <div className="mt-4 flex items-center justify-between text-[11px] text-cyan-50/75">
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-cyan-300" />
                Flow v1 • Website → CRM → Automations
              </span>
              <span className="uppercase tracking-[0.18em] text-cyan-100/70">
                Blueprint
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* keyframes */}
      <style jsx>{`
        @keyframes blueprint-draw {
          to {
            stroke-dashoffset: 0;
          }
        }
        @keyframes fade-in {
          to {
            opacity: 1;
          }
        }
      `}</style>
    </section>
  );
}

"use client";

import { motion, type Variants } from "framer-motion";

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const towns = [
  "Sussex Inlet",
  "Jervis Bay",
  "Vincentia",
  "Huskisson",
  "Sanctuary Point",
  "Nowra",
];

export default function Local() {
  return (
    <section className="relative w-full bg-[#02040a] py-20 md:py-24">
      {/* ocean / coastline gradient */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(56,189,248,0.25),transparent_60%),radial-gradient(circle_at_top,_rgba(129,140,248,0.15),transparent_55%)]" />

      {/* subtle contour lines */}
      <div className="pointer-events-none absolute inset-0 opacity-25 mix-blend-screen">
        <div className="h-full w-full bg-[radial-gradient(circle_at_center,transparent_30%,rgba(15,23,42,0.65)_31%,transparent_33%),radial-gradient(circle_at_20%_20%,transparent_35%,rgba(15,23,42,0.7)_36%,transparent_38%),radial-gradient(circle_at_80%_40%,transparent_40%,rgba(15,23,42,0.7)_41%,transparent_43%)]" />
      </div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariants}
        className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 md:px-10 lg:flex-row lg:items-center"
      >
        {/* LEFT: copy */}
        <div className="flex-1 space-y-6 text-slate-50">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-300/80">
            Local to the Shoalhaven
          </p>

          <h2 className="text-2xl font-semibold tracking-tight md:text-3xl lg:text-4xl">
            A high-end tech studio{" "}
            <span className="text-cyan-300">actually based near you.</span>
          </h2>

          <p className="max-w-xl text-sm text-slate-300/85 md:text-[15px]">
            I&apos;m not some overseas agency you&apos;ll never speak to.
            I grew up around the Shoalhaven and build for the kinds of
            businesses I see every day – builders, cafes, gyms, salons,
            holiday stays and local pros who need their online setup to
            finally catch up.
          </p>

          <div className="grid gap-4 text-xs text-slate-200/85 md:grid-cols-2 md:text-sm">
            <div className="rounded-2xl border border-slate-700/70 bg-slate-900/70 p-4 backdrop-blur">
              <h3 className="mb-1 text-[13px] font-semibold text-slate-50">
                Built to get enquiries, not just look pretty
              </h3>
              <p>
                Clean sites, fast load times and clear calls-to-action that
                turn locals searching on their phone into leads you can call,
                text or book in.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-700/70 bg-slate-900/70 p-4 backdrop-blur">
              <h3 className="mb-1 text-[13px] font-semibold text-slate-50">
                Websites tied into how you already work
              </h3>
              <p>
                I plug forms, bookings and payments into the tools you already
                use, so your &quot;website guy&quot; and your business systems
                aren&apos;t living in different worlds.
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT: stylised local map / town list */}
        <div className="flex-1">
          <div className="relative mx-auto max-w-md overflow-hidden rounded-3xl border border-cyan-400/40 bg-slate-950/80 p-5 shadow-[0_0_60px_rgba(8,47,73,0.85)] backdrop-blur">
            {/* glow ring */}
            <div className="pointer-events-none absolute inset-0 opacity-70">
              <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-400/40 bg-[radial-gradient(circle,_rgba(34,211,238,0.45),transparent_60%)] blur-[1px]" />
            </div>

            {/* dots / towns */}
            <div className="relative z-10 h-60 w-full">
              <div className="absolute left-1/2 top-1/2 h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-200 shadow-[0_0_18px_rgba(34,211,238,0.9)]" />

              {/* simple constellation of towns */}
              <div className="absolute left-[30%] top-[26%]">
                <TownDot label="Sussex Inlet" />
              </div>
              <div className="absolute left-[60%] top-[20%]">
                <TownDot label="Jervis Bay" />
              </div>
              <div className="absolute left-[68%] top-[40%]">
                <TownDot label="Vincentia" />
              </div>
              <div className="absolute left-[56%] top-[55%]">
                <TownDot label="Huskisson" />
              </div>
              <div className="absolute left-[40%] top-[65%]">
                <TownDot label="Sanctuary Point" />
              </div>
              <div className="absolute left-[22%] top-[50%]">
                <TownDot label="Nowra" />
              </div>

              {/* connecting lines */}
              <svg
                viewBox="0 0 200 200"
                className="absolute inset-0 h-full w-full text-cyan-200/50"
              >
                <polyline
                  points="60,55 120,45 135,80 120,110 85,130 55,110"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="0.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="opacity-70"
                />
              </svg>
            </div>

            <div className="relative z-10 mt-4 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-300">
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-cyan-300" />
                Serving businesses across the Shoalhaven coast.
              </span>
              <span className="uppercase tracking-[0.18em] text-slate-400">
                Local projects
              </span>
            </div>

            {/* list of towns */}
            <div className="relative z-10 mt-4 flex flex-wrap gap-2 text-[11px] text-slate-300/85">
              {towns.map((town) => (
                <span
                  key={town}
                  className="rounded-full border border-slate-700/80 bg-slate-900/80 px-3 py-1"
                >
                  {town}
                </span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

function TownDot({ label }: { label: string }) {
  return (
    <div className="group flex flex-col items-center gap-1">
      <div className="relative flex h-3 w-3 items-center justify-center">
        <div className="absolute h-4 w-4 rounded-full bg-cyan-400/20 blur-[2px]" />
        <div className="relative h-1.5 w-1.5 rounded-full bg-cyan-200 shadow-[0_0_10px_rgba(34,211,238,0.9)]" />
      </div>
      <span className="text-[10px] uppercase tracking-[0.16em] text-slate-300/80">
        {label}
      </span>
    </div>
  );
}

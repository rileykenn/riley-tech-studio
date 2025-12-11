"use client";

import { motion, type Variants } from "framer-motion";

const flowVariants: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const steps = [
  {
    id: 1,
    label: "Capture",
    title: "Lead enters through your website",
    body: "High intent forms, quiz funnels or booking requests come in through a modern, fast site instead of a clunky contact page.",
  },
  {
    id: 2,
    label: "Qualify",
    title: "Lead data flows into your CRM",
    body: "Fields are cleaned, tagged and segmented automatically no more copy/paste or guessing who is worth your time.",
  },
  {
    id: 3,
    label: "Automate",
    title: "AI & automations do the busy work",
    body: "Sequences send follow-up emails, SMS, reminders and pre frame content tailored to that lead, without you touching it.",
  },
  {
    id: 4,
    label: "Book",
    title: "Bookings drop straight into your calendar",
    body: "Qualified leads are pushed to your calendar or booking system, with all the context you need already attached.",
  },
  {
    id: 5,
    label: "Track",
    title: "Results are tracked in one place",
    body: "Dashboards show where leads came from, who converted and where your pipeline is leaking so we can keep tuning it.",
  },
];

export default function Automation() {
  return (
    <section className="relative w-full bg-[#03050b] py-20 md:py-24">
      {/* background glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(56,189,248,0.2),transparent_60%)]" />

      {/* faint diagonal lines to feel like wiring */}
      <div className="pointer-events-none absolute inset-0 opacity-25 mix-blend-screen">
        <div className="h-full w-full bg-[linear-gradient(135deg,rgba(15,23,42,0.4)_0,rgba(148,163,184,0.4)_1px,transparent_1px)] bg-[size:120px_120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-6 md:px-10">
        {/* header */}
        <div className="mb-10 flex flex-col gap-4 md:mb-14 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-300/80">
              Automation flows
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-50 md:text-3xl lg:text-4xl">
              From raw website traffic to{" "}
              <span className="text-cyan-300">qualified bookings</span>{" "}
              without manual work.
            </h2>
          </div>
          <p className="max-w-md text-sm text-slate-300/80 md:text-[15px]">
            This is where most websites fall apart. I wire forms, CRMs, AI and
            calendars together so every lead is captured, followed up and
            tracked automatically.
          </p>
        </div>

        {/* flow diagram */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={flowVariants}
          className="relative mx-auto max-w-5xl"
        >
          {/* horizontal connector line */}
          <div className="pointer-events-none absolute inset-x-6 top-1/2 hidden h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-cyan-400/70 to-transparent md:block" />

          <div className="flex flex-col gap-6 md:flex-row md:items-stretch md:justify-between">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className="relative flex-1"
              >
                {/* node dot */}
                <div className="hidden md:flex items-center justify-center">
                  <div className="relative mb-4 flex h-6 w-6 items-center justify-center">
                    <div className="absolute h-6 w-6 rounded-full bg-cyan-400/20 blur-[2px]" />
                    <div className="relative h-2.5 w-2.5 rounded-full bg-cyan-300 shadow-[0_0_14px_rgba(34,211,238,0.9)]" />
                  </div>
                </div>

                {/* card */}
                <div className="group relative overflow-hidden rounded-2xl border border-slate-700/70 bg-slate-900/70 p-4 text-sm text-slate-100 shadow-[0_18px_40px_rgba(15,23,42,0.9)] backdrop-blur">
                  {/* gradient edge on hover */}
                  <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <div className="absolute inset-[-1px] rounded-2xl bg-[conic-gradient(from_140deg_at_50%_0%,rgba(34,211,238,0.7),rgba(59,130,246,0.65),rgba(129,140,248,0.7),rgba(34,211,238,0.7))] opacity-70 blur-[4px]" />
                  </div>

                  <div className="relative z-10 flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <span className="rounded-full border border-cyan-400/40 bg-cyan-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-cyan-200">
                        {step.label}
                      </span>
                      <span className="text-[10px] uppercase tracking-[0.18em] text-slate-400">
                        {String(step.id).padStart(2, "0")}
                      </span>
                    </div>
                    <h3 className="text-[15px] font-semibold text-slate-50">
                      {step.title}
                    </h3>
                    <p className="text-[13px] leading-relaxed text-slate-300/85">
                      {step.body}
                    </p>
                  </div>
                </div>

                {/* vertical connector for mobile between cards */}
                {index < steps.length - 1 && (
                  <div className="mt-3 flex h-10 items-center justify-center md:hidden">
                    <div className="h-full w-px bg-gradient-to-b from-cyan-400/70 via-cyan-400/20 to-transparent" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* small caption */}
        <p className="mt-10 max-w-2xl text-xs text-slate-400 md:text-[13px]">
          Under the hood I&apos;m using tools like Make, custom APIs and
          full stack code to glue everything together but your team just
          experiences clean, predictable flows that &quot;just work&quot;.
        </p>
      </div>
    </section>
  );
}

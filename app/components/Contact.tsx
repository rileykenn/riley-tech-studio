"use client";

import { motion, type Variants } from "framer-motion";
import { useState } from "react";

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // later you can hook this into Supabase / email / CRM
    setSubmitted(true);
  };

  return (
    <section className="relative w-full bg-[#020617] py-20 md:py-24">
      {/* soft cyan glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.25),transparent_60%)]" />

      {/* faint grid */}
      <div className="pointer-events-none absolute inset-0 opacity-15">
        <div className="h-full w-full bg-[linear-gradient(to_right,rgba(51,65,85,0.5)_1px,transparent_1px),linear-gradient(to_bottom,rgba(51,65,85,0.5)_1px,transparent_1px)] bg-[size:90px_90px]" />
      </div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariants}
        className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 md:px-10 lg:flex-row lg:items-start"
      >
        {/* LEFT: pitch */}
        <div className="flex-1 space-y-6 text-slate-50">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-300/80">
            Let&apos;s build your system
          </p>

          <h2 className="text-2xl font-semibold tracking-tight md:text-3xl lg:text-4xl">
            Tell me what you&apos;re trying to fix,{" "}
            <span className="text-cyan-300">I&apos;ll handle the tech.</span>
          </h2>

          <p className="max-w-xl text-sm text-slate-300/85 md:text-[15px]">
            Whether it&apos;s a slow, outdated website or a mess of tools that
            don&apos;t talk to each other – this is where we start. I&apos;ll
            review what you&apos;ve got now and send back a clear plan for how
            we can upgrade it.
          </p>

          <div className="grid gap-4 text-xs text-slate-200/85 md:grid-cols-2 md:text-sm">
            <div className="rounded-2xl border border-slate-700/70 bg-slate-900/70 p-4 backdrop-blur">
              <h3 className="mb-1 text-[13px] font-semibold text-slate-50">
                What you can use this for
              </h3>
              <p>
                New builds, rebuilds, fixing broken sites, wiring in CRMs,
                automation flows, bookings, payments or internal tools.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-700/70 bg-slate-900/70 p-4 backdrop-blur">
              <h3 className="mb-1 text-[13px] font-semibold text-slate-50">
                How I usually respond
              </h3>
              <p>
                A quick loom or message walking through your current setup and a
                few concrete options at different levels of budget and scope.
              </p>
            </div>
          </div>

          <div className="pt-2 text-xs text-slate-400 md:text-[13px]">
            Prefer a direct call? Once this is hooked up I&apos;d drop a booking
            link here so people can grab a time in your calendar.
          </div>
        </div>

        {/* RIGHT: form */}
        <div className="flex-1">
          <div className="relative mx-auto max-w-md overflow-hidden rounded-3xl border border-slate-700/80 bg-slate-950/90 p-6 shadow-[0_22px_60px_rgba(15,23,42,0.95)] backdrop-blur">
            {/* corner glow */}
            <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[radial-gradient(circle,_rgba(34,211,238,0.55),transparent_60%)] opacity-70" />

            <div className="relative z-10">
              <h3 className="text-[15px] font-semibold text-slate-50">
                Start a project / ask a question
              </h3>
              <p className="mt-1 text-[13px] text-slate-400">
                No obligation – just tell me what&apos;s broken or what you
                want to build.
              </p>

              {submitted ? (
                <div className="mt-6 rounded-2xl border border-emerald-400/40 bg-emerald-500/10 px-4 py-3 text-[13px] text-emerald-100">
                  Thanks for sending that through. In a real build this would
                  trigger an email / CRM entry and I&apos;d get back to you
                  personally.
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="mt-5 space-y-4 text-[13px]"
                >
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
                        Name
                      </label>
                      <input
                        required
                        type="text"
                        name="name"
                        placeholder="Riley from DNA Coaching"
                        className="w-full rounded-xl border border-slate-700/80 bg-slate-950/80 px-3 py-2.5 text-[13px] text-slate-50 outline-none transition focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/60"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
                        Email
                      </label>
                      <input
                        required
                        type="email"
                        name="email"
                        placeholder="you@business.com"
                        className="w-full rounded-xl border border-slate-700/80 bg-slate-950/80 px-3 py-2.5 text-[13px] text-slate-50 outline-none transition focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/60"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
                      Business name / website
                    </label>
                    <input
                      type="text"
                      name="business"
                      placeholder="e.g. Sussex Inlet Carpentry / sussexcarpentry.com.au"
                      className="w-full rounded-xl border border-slate-700/80 bg-slate-950/80 px-3 py-2.5 text-[13px] text-slate-50 outline-none transition focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/60"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
                      What do you want to build or fix?
                    </label>
                    <textarea
                      required
                      name="message"
                      rows={4}
                      placeholder="Tell me in plain language – slow site, broken forms, want more enquiries, need automation, etc."
                      className="w-full rounded-xl border border-slate-700/80 bg-slate-950/80 px-3 py-2.5 text-[13px] text-slate-50 outline-none transition focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/60"
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-[1.4fr_minmax(0,1fr)]">
                    <div>
                      <label className="mb-1 block text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
                        Rough budget / scope
                      </label>
                      <select
                        name="budget"
                        className="w-full rounded-xl border border-slate-700/80 bg-slate-950/80 px-3 py-2.5 text-[13px] text-slate-50 outline-none transition focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/60"
                        defaultValue=""
                      >
                        <option value="" disabled>
                          Choose one (can change later)
                        </option>
                        <option value="small">
                          Smaller tweaks / fixes
                        </option>
                        <option value="site">
                          New site or full rebuild
                        </option>
                        <option value="systems">
                          Website + automations / systems
                        </option>
                      </select>
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
                        How soon do you want this live?
                      </label>
                      <select
                        name="timeline"
                        className="w-full rounded-xl border border-slate-700/80 bg-slate-950/80 px-3 py-2.5 text-[13px] text-slate-50 outline-none transition focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/60"
                        defaultValue=""
                      >
                        <option value="" disabled>
                          Select a rough timeframe
                        </option>
                        <option value="soon">ASAP / this month</option>
                        <option value="quarter">Next 1–3 months</option>
                        <option value="thinking">Just exploring options</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="mt-2 inline-flex w-full items-center justify-center rounded-full bg-cyan-400 px-6 py-2.5 text-sm font-medium text-black shadow-[0_0_40px_rgba(34,211,238,0.6)] transition hover:bg-cyan-300"
                  >
                    Send this to Riley
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* footer-ish line */}
      <div className="relative z-10 mt-10 flex justify-center px-6 md:px-10">
        <div className="flex w-full max-w-6xl items-center justify-between border-t border-slate-800/80 pt-4 text-[11px] text-slate-500">
          <span>© {new Date().getFullYear()} Riley Tech Studio</span>
          <span className="hidden md:inline">
            Built, designed & engineered by Riley in the Shoalhaven.
          </span>
        </div>
      </div>
    </section>
  );
}

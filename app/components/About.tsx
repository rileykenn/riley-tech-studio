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

const timeline = [
  {
    year: "Early",
    title: "Media, art & design first",
    body: "I started on the creative side graphics, motion, 3D and visual design learning how to make things look sharp and feel good to use.",
  },
  {
    year: "Next",
    title: "Full-stack engineering",
    body: "I moved into full stack web dev so I could own the entire build from the front end experience to the backend logic, databases and APIs.",
  },
  {
    year: "Now",
    title: "Automation & systems",
    body: "I specialise in wiring websites into CRMs, automations and AI, so businesses aren’t just getting a homepage they’re getting a system.",
  },
  {
    year: "Shoalhaven",
    title: "Local projects & long-term partners",
    body: "Now I’m focused on working with businesses around the Shoalhaven who want a high end technical partner they can actually talk to.",
  },
];

export default function About() {
  return (
    <section className="relative w-full bg-[#030814] py-20 md:py-24">
      {/* soft gradient backdrop */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.2),transparent_55%),radial-gradient(circle_at_bottom,_rgba(15,23,42,0.9),#020617_70%)]" />

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariants}
        className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 md:px-10 lg:flex-row lg:items-start"
      >
        {/* LEFT: intro */}
        <div className="flex-1 space-y-6 text-slate-50">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-300/80">
            About Riley
          </p>

          <h2 className="text-2xl font-semibold tracking-tight md:text-3xl lg:text-4xl">
            Designer brain.{" "}
            <span className="text-cyan-300">Engineer hands.</span> Automation
            obsessed.
          </h2>

          <p className="max-w-xl text-sm text-slate-300/85 md:text-[15px]">
            I&apos;m Riley, the one actually designing, coding and wiring up
            everything at Riley Tech Studio. My background in media and visual
            design means your site looks good my full stack and automation
            work means it actually does something for your business.
          </p>

          <div className="grid gap-4 text-xs text-slate-200/85 md:grid-cols-2 md:text-sm">
            <div className="rounded-2xl border border-slate-700/70 bg-slate-900/70 p-4 backdrop-blur">
              <h3 className="mb-1 text-[13px] font-semibold text-slate-50">
                One person who understands the whole stack
              </h3>
              <p>
                No hand offs between &quot;the designer&quot; & &quot;the dev&quot;
              I design the experience and build
                the underlying systems myself.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-700/70 bg-slate-900/70 p-4 backdrop-blur">
              <h3 className="mb-1 text-[13px] font-semibold text-slate-50">
                Long term thinking, not quick hacks
              </h3>
              <p>
                I care about performance, clean architecture and making sure
                what we build together is easy to extend in six or twelve
                months, not just launch day.
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT: timeline */}
        <div className="flex-1">
          <div className="relative mx-auto max-w-md">
            {/* vertical line */}
            <div className="absolute left-4 top-2 bottom-2 w-px bg-gradient-to-b from-cyan-400/80 via-slate-600/70 to-transparent" />

            <div className="space-y-6">
              {timeline.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{
                    duration: 0.45,
                    delay: index * 0.06,
                    ease: "easeOut",
                  }}
                  className="relative flex gap-4"
                >
                  {/* dot */}
                  <div className="relative mt-1.5 flex h-4 w-8 items-center justify-center">
                    <div className="absolute left-1 h-3 w-3 rounded-full bg-cyan-400/25 blur-[2px]" />
                    <div className="absolute left-1 h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_10px_rgba(34,211,238,0.9)]" />
                  </div>

                  {/* content */}
                  <div className="flex-1 rounded-2xl border border-slate-700/80 bg-slate-900/80 p-4 text-sm text-slate-100 backdrop-blur">
                    <div className="mb-1 flex items-center justify-between text-[11px] text-slate-400">
                      <span className="uppercase tracking-[0.18em] text-cyan-200/80">
                        {item.year}
                      </span>
                      <span className="text-[10px] tracking-[0.16em] text-slate-500">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <h3 className="mb-1 text-[15px] font-semibold text-slate-50">
                      {item.title}
                    </h3>
                    <p className="text-[13px] leading-relaxed text-slate-300/85">
                      {item.body}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

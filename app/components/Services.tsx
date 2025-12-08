"use client";

import { motion } from "framer-motion";

const services = [
  {
    label: "Web",
    title: "High-performance business websites",
    description:
      "Fast, modern, mobile-first sites that feel premium and actually convert visitors into enquiries and bookings.",
    bullets: [
      "Custom design (no bloated themes)",
      "Mobile-first layouts",
      "Speed, SEO & analytics baked in",
    ],
  },
  {
    label: "Automation",
    title: "Lead, sales & onboarding automations",
    description:
      "Flows that capture leads, qualify them, follow up automatically and plug into your existing tools.",
    bullets: [
      "Lead capture & qualification",
      "Automated follow-up & reminders",
      "Onboarding sequences & task hand-off",
    ],
  },
  {
    label: "Integration",
    title: "Connecting the tools you already use",
    description:
      "Websites, CRMs, booking systems, Xero, email platforms – wired together so data moves without you.",
    bullets: [
      "CRM & pipeline integrations",
      "Booking / calendar syncing",
      "Reporting dashboards & alerts",
    ],
  },
  {
    label: "Creative",
    title: "Brand, media & visual systems",
    description:
      "Pulling from my media and design background to make your brand look sharp across web and content.",
    bullets: [
      "Brand & interface design",
      "Landing page creative",
      "Content & visual direction",
    ],
  },
];

export default function Services() {
  return (
    <section className="relative w-full bg-[#050811] py-20 md:py-24">
      {/* subtle glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(14,230,255,0.22),transparent_60%)]" />

      {/* faint grid */}
      <div className="pointer-events-none absolute inset-0 opacity-15">
        <div className="h-full w-full bg-[linear-gradient(to_right,rgba(148,163,184,0.35)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.35)_1px,transparent_1px)] bg-[size:90px_90px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-6 md:px-10">
        <div className="mb-10 flex flex-col gap-4 md:mb-12 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-300/80">
              What I build
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-50 md:text-3xl lg:text-4xl">
              Everything from the website to the{" "}
              <span className="text-cyan-300">systems behind it.</span>
            </h2>
          </div>
          <p className="max-w-md text-sm text-slate-300/80 md:text-[15px]">
            I&apos;m not just making pretty homepages. I build the structure
            underneath – automations, CRMs and flows – so your site is wired
            into how your business actually runs.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {services.map((service, i) => (
            <motion.article
              key={service.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.45, delay: i * 0.08, ease: "easeOut" }}
              className="group relative overflow-hidden rounded-2xl border border-slate-700/60 bg-slate-900/50 p-5 text-sm text-slate-100 shadow-[0_18px_45px_rgba(15,23,42,0.9)] backdrop-blur-sm"
            >
              {/* glow border on hover */}
              <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <div className="absolute inset-[-1px] rounded-2xl border border-cyan-400/70 blur-[1px]" />
              </div>

              <div className="mb-3 flex items-center justify-between">
                <span className="rounded-full border border-cyan-400/40 bg-cyan-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-cyan-200">
                  {service.label}
                </span>
                <span className="text-[10px] uppercase tracking-[0.16em] text-slate-400">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>

              <h3 className="mb-2 text-[15px] font-semibold text-slate-50">
                {service.title}
              </h3>
              <p className="mb-4 text-[13px] leading-relaxed text-slate-300/85">
                {service.description}
              </p>

              <ul className="space-y-1.5 text-[12px] text-slate-300/90">
                {service.bullets.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="mt-[6px] h-[5px] w-[5px] rounded-full bg-cyan-300/80" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

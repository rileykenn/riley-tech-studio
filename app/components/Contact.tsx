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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const data = new FormData(form);

    const payload = {
      name: (data.get("name") || "") as string,
      email: (data.get("email") || "") as string,
      phone: (data.get("phone") || "") as string,
      business: (data.get("business") || "") as string,
      message: (data.get("message") || "") as string,
      budget: (data.get("budget") || "") as string,
      timeline: (data.get("timeline") || "") as string,
    };

    try {
      const res = await fetch("/api/airtable", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        console.error("Failed to send to Airtable", await res.text());
        alert("Something went wrong sending your message. Please try again.");
        return;
      }

      setSubmitted(true);
      form.reset();
    } catch (err) {
      console.error("Submit error", err);
      alert("Network error sending your message. Please try again.");
    }
  };

  return (
    <section className="relative w-full bg-[#02101f] py-20 md:py-24">
      {/* bright blue bloom */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.28),transparent_65%)]" />

      {/* electric blueprint grid */}
      <div className="pointer-events-none absolute inset-0 opacity-20">
        <div className="h-full w-full bg-[linear-gradient(to_right,rgba(75,130,255,0.35)_1px,transparent_1px),linear-gradient(to_bottom,rgba(75,130,255,0.35)_1px,transparent_1px)] bg-[size:88px_88px]" />
      </div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariants}
        className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 md:px-10 lg:flex-row lg:items-start"
      >
        {/* LEFT SIDE TEXT + CALL CARD */}
        <div className="flex-1 space-y-6 text-slate-50">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-300/90">
            Let&apos;s build your system
          </p>

          <h2 className="text-2xl font-semibold tracking-tight md:text-3xl lg:text-4xl">
            Tell me what you&apos;re trying to fix,{" "}
            <span className="text-cyan-300">I&apos;ll handle the tech.</span>
          </h2>

          <p className="max-w-xl text-sm text-slate-200/85 md:text-[15px]">
            Whether it&apos;s a slow, outdated website or a mess of tools that
            don&apos;t talk to each other – this is where we start. I&apos;ll
            review what you&apos;ve got now and send back a clear plan.
          </p>

          {/* DIRECT CALL OPTION */}
          <div className="mt-4 rounded-2xl border border-cyan-400/20 bg-slate-900/40 p-5 backdrop-blur text-center shadow-[0_0_40px_rgba(0,140,255,0.15)] max-w-md">
            <p className="text-[13px] text-slate-300 mb-1">Prefer to talk first?</p>
            <p className="text-[15px] font-medium text-slate-200">
              Call me directly:
            </p>

            <a
              href="tel:+61499545069"
              className="mt-1 block text-2xl font-semibold text-cyan-300 tracking-wide hover:text-cyan-200 transition"
            >
              0499 545 069
            </a>

            <p className="text-[12px] text-slate-500 mt-2">
              Available most days from 9am–6pm AEST
            </p>
          </div>
        </div>

        {/* RIGHT SIDE – FORM */}
        <div className="flex-1">
          <div className="relative mx-auto max-w-md overflow-hidden rounded-3xl border border-cyan-400/25 bg-slate-950/70 p-6 shadow-[0_22px_60px_rgba(0,90,160,0.85)] backdrop-blur-xl">
            <div className="relative z-10">
              <h3 className="text-[15px] font-semibold text-cyan-100">
                Start a project / ask a question
              </h3>

              <p className="mt-1 text-[13px] text-slate-400">
                No obligation – just tell me what&apos;s broken or what you want
                to build.
              </p>

              {submitted ? (
                <div className="mt-6 rounded-2xl border border-emerald-400/40 bg-emerald-500/10 px-4 py-3 text-[13px] text-emerald-100">
                  Thanks for sending that through, I&apos;ll get back to you
                  personally.
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="mt-5 space-y-4 text-[13px]">
                  {/* NAME + EMAIL */}
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-xs font-medium uppercase tracking-[0.18em] text-cyan-300/80">
                        Name
                      </label>
                      <input
                        required
                        type="text"
                        name="name"
                        placeholder="Riley from DNA Coaching"
                        className="w-full rounded-xl border border-cyan-400/30 bg-slate-900/50 px-3 py-2.5 text-cyan-50 outline-none transition focus:border-cyan-300 focus:ring-1 focus:ring-cyan-300/60"
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-xs font-medium uppercase tracking-[0.18em] text-cyan-300/80">
                        Email
                      </label>
                      <input
                        required
                        type="email"
                        name="email"
                        placeholder="you@business.com"
                        className="w-full rounded-xl border border-cyan-400/30 bg-slate-900/50 px-3 py-2.5 text-cyan-50 outline-none transition focus:border-cyan-300 focus:ring-1 focus:ring-cyan-300/60"
                      />
                    </div>
                  </div>

                  {/* PHONE */}
                  <div>
                    <label className="mb-1 block text-xs font-medium uppercase tracking-[0.18em] text-cyan-300/80">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="0499 545 069"
                      className="w-full rounded-xl border border-cyan-400/30 bg-slate-900/50 px-3 py-2.5 text-cyan-50 outline-none transition focus:border-cyan-300 focus:ring-1 focus:ring-cyan-300/60"
                    />
                  </div>

                  {/* BUSINESS */}
                  <div>
                    <label className="mb-1 block text-xs font-medium uppercase tracking-[0.18em] text-cyan-300/80">
                      Business name / website
                    </label>
                    <input
                      type="text"
                      name="business"
                      placeholder="e.g. Sussex Inlet Carpentry"
                      className="w-full rounded-xl border border-cyan-400/30 bg-slate-900/50 px-3 py-2.5 text-cyan-50 outline-none transition focus:border-cyan-300 focus:ring-1 focus:ring-cyan-300/60"
                    />
                  </div>

                  {/* MESSAGE */}
                  <div>
                    <label className="mb-1 block text-xs font-medium uppercase tracking-[0.18em] text-cyan-300/80">
                      What do you want to build or fix?
                    </label>
                    <textarea
                      required
                      name="message"
                      rows={4}
                      placeholder="Tell me in plain language – slow site, broken forms, need automation, etc."
                      className="w-full rounded-xl border border-cyan-400/30 bg-slate-900/50 px-3 py-2.5 text-cyan-50 outline-none transition focus:border-cyan-300 focus:ring-1 focus:ring-cyan-300/60"
                    />
                  </div>

                  {/* BUDGET + TIMELINE */}
                  <div className="grid gap-4 md:grid-cols-[1.4fr_minmax(0,1fr)]">
                    <div>
                      <label className="mb-1 block text-xs font-medium uppercase tracking-[0.18em] text-cyan-300/80">
                        Rough budget / scope
                      </label>
                      <select
                        name="budget"
                        defaultValue=""
                        className="w-full rounded-xl border border-cyan-400/30 bg-slate-900/50 px-3 py-2.5 text-cyan-50 outline-none transition focus:border-cyan-300 focus:ring-1 focus:ring-cyan-300/60"
                      >
                        <option value="" disabled>
                          Choose one (can change later)
                        </option>
                        <option value="Smaller tweaks / fixes">
                          Smaller tweaks / fixes
                        </option>
                        <option value="New site or full rebuild">
                          New site or full rebuild
                        </option>
                        <option value="Website + automations / systems">
                          Website + automations / systems
                        </option>
                      </select>
                    </div>

                    <div>
                      <label className="mb-1 block text-xs font-medium uppercase tracking-[0.18em] text-cyan-300/80">
                        How soon do you want this live?
                      </label>
                      <select
                        name="timeline"
                        defaultValue=""
                        className="w-full rounded-xl border border-cyan-400/30 bg-slate-900/50 px-3 py-2.5 text-cyan-50 outline-none transition focus:border-cyan-300 focus:ring-1 focus:ring-cyan-300/60"
                      >
                        <option value="" disabled>
                          Select a rough timeframe
                        </option>
                        <option value="ASAP / this month">ASAP / this month</option>
                        <option value="Next 1–3 months">Next 1–3 months</option>
                        <option value="Just exploring options">
                          Just exploring options
                        </option>
                      </select>
                    </div>
                  </div>

                  {/* SUBMIT */}
                  <button
                    type="submit"
                    className="mt-2 inline-flex w-full items-center justify-center rounded-full 
                      bg-gradient-to-br from-white via-white to-cyan-100 
                      px-6 py-2.5 text-sm font-semibold text-slate-900 
                      shadow-[0_0_25px_rgba(180,220,255,0.45)] 
                      transition hover:from-white hover:via-cyan-50 hover:to-cyan-200"
                  >
                    Send this to Riley
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* FOOTER */}
      <div className="relative z-10 mt-10 flex justify-center px-6 md:px-10">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 border-t border-cyan-400/20 pt-4 
          text-[11px] text-slate-400 md:flex-row md:items-center md:justify-between">
          
          <span>© {new Date().getFullYear()} Riley Tech Studio</span>

          <span className="md:text-right">
            Built, designed & engineered by Riley in the Shoalhaven.
          </span>

          <div className="flex flex-wrap gap-x-4 gap-y-1">
            <span>ABN 82 944 887 387</span>
            <a href="mailto:contactrileykennedy@gmail.com" className="hover:text-cyan-300">
              contactrileykennedy@gmail.com
            </a>
            <a href="tel:+61499545069" className="hover:text-cyan-300">
              0499 545 069
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

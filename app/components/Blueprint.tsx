"use client";

import { motion, type Variants } from "framer-motion";
import { ReactNode } from "react";
import Image from "next/image";

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
            I Design your website, automations &amp; CRM like a{" "}
            <span className="underline decoration-cyan-200/90 decoration-[3px]">
              blueprint 
            </span>
            {" "}- every system planned before it&apos;s built.
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

        {/* RIGHT: replaced diagram with your image */}
        <div className="flex-1">
          <div className="relative mx-auto max-w-md rounded-3xl border border-cyan-100/40 bg-cyan-900/10 p-5 shadow-[0_0_60px_rgba(7,25,79,0.9)] backdrop-blur-md overflow-hidden">
            
            {/* subtle highlight */}
            <div className="pointer-events-none absolute inset-x-10 top-0 h-20 rounded-b-full bg-[radial-gradient(circle,_rgba(255,255,255,0.18),transparent_60%)] opacity-70" />

            {/* YOUR IMAGE */}
            <Image
              src="/blueprintwithgrid.png"
              alt="Blueprint System Diagram"
              width={900}
              height={700}
              className="relative z-10 w-full h-auto object-contain"
            />
          </div>
        </div>
      </motion.div>
    </section>
  );
}

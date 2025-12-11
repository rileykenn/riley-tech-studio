"use client";

import { motion, type Variants } from "framer-motion";
import Image from "next/image";

/* -------------------------------------------------------
   GLOW CONFIG — tweak this freely
------------------------------------------------------- */
const glow = {
  spread: 18,
  intensity: 0.32,
  lift: 0,
  bias: 0.5,
};

const glowColor1 = `rgba(${Math.round(82 + 42 * glow.bias)}, ${Math.round(
  209 - 80 * glow.bias
)}, ${Math.round(255)}, ${glow.intensity})`;

const glowColor2 = `rgba(${Math.round(124)}, ${Math.round(
  59 + 120 * (1 - glow.bias)
)}, ${Math.round(255)}, ${glow.intensity * 0.6})`;

const glowShadow = `[text-shadow:0_${glow.lift}px_${glow.spread}px_${glowColor1},0_${glow.lift}px_${glow.spread *
  2}px_${glowColor2}]`;

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
    <section className="relative w-full py-20 md:py-24 bg-[#000105] overflow-hidden">
      {/* TRUE BLACK BASE */}

      {/* VERY SUBTLE BLUE + PURPLE GLOWS */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_8%,rgba(56,189,248,0.10),transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_12%,rgba(147,51,234,0.10),transparent_72%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(56,189,248,0.08),transparent_80%)]" />
      </div>

      {/* GRID */}
      <div
        className="
          absolute inset-0 pointer-events-none
          opacity-[0.10]
          mix-blend-screen
          bg-[linear-gradient(to_right,#11233f_1px,transparent_1px),
             linear-gradient(to_bottom,#11233f_1px,transparent_1px)]
          bg-[size:26px_26px]
        "
      />

      {/* PARTICLES */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.15]">
        <div className="absolute top-10 left-24 h-1 w-1 rounded-full bg-cyan-300/60 blur-[2px]" />
        <div className="absolute top-1/3 left-1/2 h-1 w-1 rounded-full bg-cyan-200/60 blur-[3px]" />
        <div className="absolute bottom-16 right-32 h-1 w-1 rounded-full bg-purple-300/50 blur-[3px]" />
      </div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariants}
        className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 md:px-10 lg:flex-row lg:items-center"
      >
        {/* LEFT TEXT */}
        <div className="flex-1 space-y-6 text-[#A7B9D6]">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-300/90">
            Local to the Shoalhaven
          </p>

          <h2 className="text-2xl font-semibold tracking-tight md:text-3xl lg:text-4xl text-white">
            A high-end tech studio{" "}
            <span
              className={`
                bg-gradient-to-r from-[#52D1FF] via-[#3B9CFF] to-[#7C3BFF]
                text-transparent bg-clip-text
                ${glowShadow}
              `}
            >
              actually based near you.
            </span>
          </h2>

          <p className="max-w-xl text-sm md:text-[15px] text-[#A7B9D6] leading-relaxed">
            I'm not some overseas agency you'll never speak to.
            I grew up around the Shoalhaven and build for the kinds of
            businesses I see every day builders, cafes, gyms, salons,
            holiday stays and local pros who need their online setup to
            finally catch up.
          </p>

          {/* INFO CARDS */}
          <div className="grid gap-4 text-xs md:grid-cols-2 md:text-sm">
            <div className="rounded-2xl border border-[#133046] bg-[#030814]/85 p-4 backdrop-blur shadow-[0_0_20px_rgba(15,50,110,0.22)]">
              <h3 className="mb-1 text-[13px] font-semibold text-[#E8F4FF]">
                Built to get enquiries, not just look pretty
              </h3>
              <p className="text-[#9DB3D1]">
                Clean sites, fast load times and clear calls to action that turn locals
                searching on their phone into leads you can call, text or book in.
              </p>
            </div>

            <div className="rounded-2xl border border-[#133046] bg-[#030814]/85 p-4 backdrop-blur shadow-[0_0_20px_rgba(15,50,110,0.22)]">
              <h3 className="mb-1 text-[13px] font-semibold text-[#E8F4FF]">
                Websites tied into how you already work
              </h3>
              <p className="text-[#9DB3D1]">
                I plug forms, bookings and payments into the tools you already use,
                so your “website guy” and your business systems aren't living in
                different worlds.
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT — MAP CARD (overall smaller) */}
        <div className="w-full max-w-[380px] shrink-0 mx-auto lg:mx-0">
          <div className="relative mx-auto">
            <div className="relative overflow-hidden rounded-[28px] border border-cyan-400/40 bg-slate-950/90 shadow-[0_0_60px_rgba(8,47,73,0.6)] backdrop-blur-xl">
              {/* ambient glow */}
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(650px_at_center,rgba(37,99,235,0.14),transparent_75%)]" />

              <div className="relative px-4 pt-4 pb-2">
                <div className="relative rounded-[22px] bg-transparent">
                  <Image
                    src="/maptransparent.png"
                    alt="Shoalhaven map region"
                    width={1200}
                    height={1200}
                    className="
                      relative z-10 h-auto w-full object-contain !bg-transparent rounded-[22px]
                      [mask-image:
                        radial-gradient(20px_20px_at_top_left,transparent_0,white_20px),
                        radial-gradient(20px_20px_at_top_right,transparent_0,white_20px),
                        radial-gradient(20px_20px_at_bottom_left,transparent_0,white_20px),
                        radial-gradient(20px_20px_at_bottom_right,transparent_0,white_20px)
                      ]
                      [mask-composite:intersect]
                    "
                    priority
                  />
                </div>
              </div>

              {/* footer text */}
              <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 px-4 pb-2 text-[11px] text-slate-300">
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-cyan-300" />
                  Serving businesses across the Shoalhaven coast.
                </span>
                <span className="uppercase tracking-[0.18em] text-slate-400">
                  Local projects
                </span>
              </div>

              {/* towns */}
              <div className="relative z-10 flex flex-wrap gap-2 px-4 pb-3 text-[11px] text-slate-300/85">
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
        </div>

      </motion.div>
    </section>
  );
}

"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { LiquidGlass } from "@liquidglass/react";

const SECTIONS = [
  { id: "hero", label: "Home" },
  { id: "blueprint", label: "Build & Integrate" },
  { id: "services", label: "What I Build" },
  { id: "automation", label: "Automation Flows" },
  { id: "local", label: "Shoalhaven" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
];

export default function NavBar() {
  const [activeId, setActiveId] = useState<string>("hero");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.innerHeight * 0.3;
      const sections = Array.from(
        document.querySelectorAll<HTMLElement>("section[data-section]")
      );

      let current = "hero";

      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        const id = section.dataset.section;
        if (!id) return;

        if (rect.top <= y && rect.bottom >= y) {
          current = id;
        }
      });

      setActiveId(current);
      setScrolled(window.scrollY > 20);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed inset-x-0 top-0 z-40 flex justify-center px-4 pt-3 md:pt-4"
    >
      <LiquidGlass
        className={[
          "w-full max-w-6xl rounded-2xl overflow-hidden",
          "transition-all duration-300",
          scrolled
            ? "shadow-[0_18px_45px_rgba(15,23,42,0.9)] scale-[0.99]"
            : "shadow-[0_10px_30px_rgba(15,23,42,0.7)]",
        ].join(" ")}
        // Glass tuning: subtle, not crazy
        borderRadius={18}
        blur={2}             // small frost, still readable
        contrast={1.1}
        brightness={1.02}    // slightly bright, not dim
        saturation={1.15}
        shadowIntensity={0.35}
        displacementScale={4} // gentle warp
        elasticity={0}
        zIndex={1000}
      >
        <div className="relative flex w-full items-center justify-between px-4 py-2.5 md:px-5 md:py-3">
          {/* SIMPLE WHITE OUTLINE + LIGHT BEVEL */}
          <div
            className="pointer-events-none absolute inset-0 rounded-2xl"
            style={{
              border: "1px solid rgba(255,255,255,0.7)", // consistent white rim
              boxShadow:
                // soft outer drop + tiny inner highlight for bevel
                "0 0 0 1px rgba(255,255,255,0.25), 0 16px 32px rgba(0,0,0,0.45)",
            }}
          />

          {/* LOGO + TITLE – keep bright */}
          <button
            type="button"
            onClick={() => scrollToSection("hero")}
            className="flex items-center gap-3"
          >
            <Image
              src="/RTS-logo-white.png"
              alt="Riley Tech Studio Logo"
              width={38}
              height={38}
              className="object-contain"
              priority
            />

            <div className="hidden flex-col text-xs leading-tight text-white md:flex">
              <span className="font-semibold tracking-[0.18em] uppercase">
                Riley Tech Studio
              </span>
              <span className="text-[11px] text-white/70">
                Web • Systems • Automation
              </span>
            </div>
          </button>

          {/* NAV LINKS – bright, legible */}
          <nav className="flex items-center gap-1 md:gap-2">
            {SECTIONS.map((item) => {
              const isActive = activeId === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => scrollToSection(item.id)}
                  className={[
                    "relative rounded-full px-3 py-1.5 text-[11px] md:px-3.5 md:py-1.5 md:text-xs font-medium transition",
                    isActive
                      ? "text-cyan-300"
                      : "text-white/80 hover:text-cyan-200",
                  ].join(" ")}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 -z-10 rounded-full bg-cyan-500/15 border border-cyan-400/40"
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 30,
                      }}
                    />
                  )}
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>
      </LiquidGlass>
    </motion.header>
  );
}

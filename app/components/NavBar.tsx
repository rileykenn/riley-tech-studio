"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

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
  const [activeId, setActiveId] = useState("hero");
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Background intensity on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Section highlight (scroll spy)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible) setActiveId(visible.target.id);
      },
      { threshold: 0.35 }
    );

    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const handleClick = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileOpen(false);
  };

  return (
    <nav className="fixed inset-x-0 top-0 z-40 flex justify-center">
      <div className="mt-4 w-full max-w-6xl px-3 md:px-4">

        {/* =============== NAV PILL =============== */}
        <div
          className={`flex items-center justify-between gap-3 rounded-full border px-4 py-2 backdrop-blur-xl transition-all duration-300
            ${
              scrolled
                ? "bg-white/10 border-white/20 shadow-[0_0_18px_rgba(255,255,255,0.08)]"
                : "bg-white/5 border-white/10 shadow-[0_0_10px_rgba(255,255,255,0.05)]"
            }`}
        >

          {/* =============== LEFT LOGO =============== */}
          <button
            onClick={() => handleClick("hero")}
            className="group flex items-center gap-2 rounded-full px-1 py-1 transition hover:bg-white/10"
          >
            <Image
              src="/RTS-logo-white.png"
              alt="Riley Tech Studio"
              width={32}
              height={32}
              className="object-contain"
            />

            <span className="hidden text-[11px] font-semibold tracking-[0.15em] text-white/80 md:inline">
              RILEY TECH STUDIO
            </span>
          </button>

          {/* =============== MOBILE TITLE CENTERED =============== */}
          <span className="absolute left-1/2 top-1/2 block -translate-x-1/2 -translate-y-1/2 text-[11px] font-semibold tracking-[0.16em] text-white/90 md:hidden">
            RILEY TECH STUDIO
          </span>

          {/* =============== DESKTOP LINKS =============== */}
          <div className="hidden items-center gap-1 md:flex">
            {SECTIONS.map((s) => {
              const active = s.id === activeId;
              return (
                <button
                  key={s.id}
                  onClick={() => handleClick(s.id)}
                  className={`rounded-full px-3 py-1 text-[11px] font-medium tracking-wide transition
                  ${
                    active
                      ? "text-white bg-white/15 border border-white/20 shadow-[0_0_10px_rgba(255,255,255,0.2)]"
                      : "text-white/60 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {s.label}
                </button>
              );
            })}
          </div>

          {/* =============== NEW CLEAN HAMBURGER (NO GLOW) =============== */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="relative h-8 w-8 flex flex-col items-center justify-center md:hidden"
          >
            <span
              className={`h-[2px] w-5 rounded-full bg-white transition-transform ${
                mobileOpen ? "translate-y-[6px] rotate-45" : ""
              }`}
            />
            <span
              className={`h-[2px] w-5 rounded-full bg-white/70 transition-opacity ${
                mobileOpen ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`h-[2px] w-5 rounded-full bg-white transition-transform ${
                mobileOpen ? "-translate-y-[6px] -rotate-45" : ""
              }`}
            />
          </button>
        </div>

        {/* =============== MOBILE DROPDOWN =============== */}
        <div
          className={`md:hidden transition-all duration-300 ${
            mobileOpen
              ? "opacity-100 translate-y-2 pointer-events-auto"
              : "opacity-0 -translate-y-1 pointer-events-none"
          }`}
        >
          <div className="mt-2 rounded-3xl border border-white/10 bg-white/10 px-3 py-3 backdrop-blur-xl shadow-[0_0_15px_rgba(255,255,255,0.1)]">
            <div className="space-y-1">
              {SECTIONS.map((s) => {
                const active = s.id === activeId;
                return (
                  <button
                    key={s.id}
                    onClick={() => handleClick(s.id)}
                    className={`flex w-full items-center justify-between rounded-2xl px-3 py-2 text-[12px] transition
                    ${
                      active
                        ? "text-white bg-white/20 shadow-[0_0_10px_rgba(255,255,255,0.2)]"
                        : "text-white/70 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    {s.label}
                    {active && <span className="h-[6px] w-[6px] rounded-full bg-white" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

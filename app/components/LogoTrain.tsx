"use client";

import Image from "next/image";

const LOGOS = [
  { src: "/train/OpenAI_Logo.png", alt: "OpenAI" },
  { src: "/train/xero.png", alt: "Xero" },
  { src: "/train/365.png", alt: "Microsoft 365" },
  { src: "/train/google.png", alt: "Google" },
  { src: "/train/hubspot.png", alt: "HubSpot" },
  { src: "/train/Make.png", alt: "Make" },
  { src: "/train/n8n.png", alt: "n8n" },
];

export default function LogoTrain() {
  const items = [...LOGOS, ...LOGOS];

  return (
    <div className="relative w-full">
      {/* soft glow behind glass strip */}
      <div className="pointer-events-none absolute inset-x-0 top-1/2 -z-10 h-16 -translate-y-1/2 rounded-full bg-sky-500/30 blur-3xl" />

      {/* glass strip */}
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-full border border-white/18 bg-white/6 px-2 py-3 backdrop-blur-2xl">
        {/* subtle inner highlight */}
        <div className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.45),_transparent_55%)]" />

        {/* scrolling logo track */}
        <div className="relative flex h-10 items-center">
          <div className="logo-track flex w-max items-center gap-12">
            {items.map((logo, i) => (
              <div
                key={`${logo.src}-${i}`}
                className="flex min-w-[90px] items-center justify-center opacity-80 transition-opacity hover:opacity-100"
              >
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  width={120}
                  height={40}
                  className="h-6 w-auto object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .logo-track {
          animation: logo-marquee 26s linear infinite;
        }

        @keyframes logo-marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
}

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Riley Tech Studio | Custom Software, Apps & SaaS — Shoalhaven & Illawarra",
  description:
    "Australian software studio based in the Shoalhaven and Illawarra. We build production-grade apps, SaaS platforms, and custom software that ships.",
  keywords: [
    "software development",
    "web development",
    "app development",
    "SaaS",
    "Shoalhaven",
    "Illawarra",
    "Australia",
    "custom software",
    "Riley Tech Studio",
  ],
  openGraph: {
    title: "Riley Tech Studio | Custom Software, Apps & SaaS",
    description:
      "Australian software studio. We build production-grade apps, SaaS platforms, and custom software.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="grain-overlay">
        {children}
      </body>
    </html>
  );
}

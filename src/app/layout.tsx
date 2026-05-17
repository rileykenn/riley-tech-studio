import type { Metadata } from "next";
import { DM_Sans, Space_Grotesk } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "optional",
  variable: "--font-body",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "optional",
  variable: "--font-heading",
});

export const metadata: Metadata = {
  title: "Riley Tech Studio | Web Design & Development — Shoalhaven & Illawarra",
  description:
    "Web design and development for local businesses in the Shoalhaven and Illawarra. Fast, modern websites built in React and Next.js that actually get results.",
  keywords: [
    "web design Shoalhaven",
    "web design Illawarra",
    "web developer Nowra",
    "website design Nowra",
    "web design Sussex Inlet",
    "small business website NSW",
    "Riley Tech Studio",
  ],
  metadataBase: new URL("https://www.rileytechstudio.com"),
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Riley Tech Studio | Web Design — Shoalhaven & Illawarra",
    description:
      "Fast, modern websites for local businesses in the Shoalhaven and Illawarra. Built in Next.js, designed to convert.",
    type: "website",
    url: "https://www.rileytechstudio.com",
    siteName: "Riley Tech Studio",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Riley Tech Studio — Web Design Shoalhaven & Illawarra",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Riley Tech Studio | Web Design — Shoalhaven & Illawarra",
    description:
      "Fast, modern websites for local businesses in the Shoalhaven and Illawarra.",
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${dmSans.variable} ${spaceGrotesk.variable}`}>
      <body className="grain-overlay">
        {children}
      </body>
    </html>
  );
}

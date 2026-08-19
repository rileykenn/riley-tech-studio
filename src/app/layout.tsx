import type { Metadata } from "next";
import { Cinzel, Cormorant_Garamond, DM_Sans, Space_Grotesk } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body-gf",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-heading-gf",
});

// Sussex Inlet Golf Club's display serif, used only inside its showcase section
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["600", "700"],
  style: ["normal", "italic"],
  display: "swap",
  preload: false,
  variable: "--font-sigc",
});

// Stone Grill Huskisson's display serif, used only inside its showcase section
const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["700"],
  display: "swap",
  preload: false,
  variable: "--font-cinzel",
});

export const metadata: Metadata = {
  title: "Riley Tech Studio | Web Design & Development — Shoalhaven & Illawarra",
  description:
    "Custom software and web design for businesses across the Shoalhaven and Illawarra. Fast, modern websites and software built in React and Next.js that get results.",
  keywords: [
    "web design Shoalhaven",
    "web design Illawarra",
    "web developer Nowra",
    "website design Nowra",
    "web design Sussex Inlet",
    "small business website NSW",
    "Riley Tech Studio",
  ],
  metadataBase: new URL("https://www.rileytechstudio.com.au"),
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
      "Custom software and fast, modern websites for businesses across the Shoalhaven and Illawarra. Built in Next.js, designed to convert.",
    type: "website",
    url: "https://www.rileytechstudio.com.au",
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
};

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": ["LocalBusiness", "ProfessionalService"],
  "@id": "https://www.rileytechstudio.com.au/#business",
  "name": "Riley Tech Studio",
  "url": "https://www.rileytechstudio.com.au",
  "logo": "https://www.rileytechstudio.com.au/rts-logo-black.webp",
  "image": "https://www.rileytechstudio.com.au/rts-logo-black.webp",
  "description": "Custom software and web design for businesses across the Shoalhaven and Illawarra. Fast, modern websites and custom software built in React and Next.js.",
  "telephone": "+61499545069",
  "email": "contactrileykennedy@gmail.com",
  "priceRange": "$$",
  "address": {
    "@type": "PostalAddress",
    "addressRegion": "NSW",
    "addressCountry": "AU",
  },
  "founder": {
    "@type": "Person",
    "name": "Riley Kennedy",
    "url": "https://www.rileytechstudio.com.au/about",
  },
  "areaServed": [
    { "@type": "AdministrativeArea", "name": "Shoalhaven" },
    { "@type": "AdministrativeArea", "name": "Illawarra" },
  ],
  "serviceArea": {
    "@type": "GeoCircle",
    "geoMidpoint": {
      "@type": "GeoCoordinates",
      "latitude": -34.9093,
      "longitude": 150.5933,
    },
    "geoRadius": "100000",
  },
  "sameAs": [
    "https://www.facebook.com/rileytechstudio",
    "https://www.instagram.com/rileytechstudio",
    "https://www.tiktok.com/@rileytechstudio",
  ],
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Services",
    "itemListElement": [
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Web Design & Development" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Custom Software Development" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "SaaS Development" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "App Development" } },
    ],
  },
};

const webSiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Riley Tech Studio",
  "url": "https://www.rileytechstudio.com.au",
  "publisher": { "@id": "https://www.rileytechstudio.com.au/#business" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${dmSans.variable} ${spaceGrotesk.variable} ${cinzel.variable} ${cormorant.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }}
        />
      </head>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}

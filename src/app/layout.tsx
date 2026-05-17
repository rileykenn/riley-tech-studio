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
    "Web design and development for local businesses in the Shoalhaven and Illawarra. Fast, modern websites built in React and Next.js that get results.",
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
      "Fast, modern websites for local businesses in the Shoalhaven and Illawarra. Built in Next.js, designed to convert.",
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
  twitter: {
    card: "summary_large_image",
    title: "Riley Tech Studio | Web Design — Shoalhaven & Illawarra",
    description:
      "Fast, modern websites for local businesses in the Shoalhaven and Illawarra.",
    images: ["/og-image.jpg"],
  },
};

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Riley Tech Studio",
  "url": "https://www.rileytechstudio.com.au",
  "logo": "https://www.rileytechstudio.com.au/logo.png",
  "image": "https://www.rileytechstudio.com.au/og-image.jpg",
  "description": "Web design and development for local businesses in the Shoalhaven and Illawarra. Fast, modern websites and custom software built in React and Next.js.",
  "telephone": "+61499545069",
  "email": "contactrileykennedy@gmail.com",
  "priceRange": "$$",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${dmSans.variable} ${spaceGrotesk.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
      </head>
      <body className="grain-overlay">
        {children}
      </body>
    </html>
  );
}

import dynamic from 'next/dynamic';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';

const FeaturedWork = dynamic(() => import('@/components/FeaturedWork'));
const CleanRouteShowcase = dynamic(() => import('@/components/CleanRouteShowcase'));
const StonegrillShowcase = dynamic(() => import('@/components/StonegrillShowcase'));
const StashShowcase = dynamic(() => import('@/components/StashShowcase'));
const GoogleReviews = dynamic(() => import('@/components/GoogleReviews'));
const Contact = dynamic(() => import('@/components/Contact'));
const Footer = dynamic(() => import('@/components/Footer'));
const StickyQuoteBar = dynamic(() => import('@/components/StickyQuoteBar'));

// Homepage: hero with proof -> work as evidence (CleanRoute Pro first,
// then SIGC and the venue builds) -> reviews -> the one ask. Each
// showcase carries its own closer, so no re-offer band between sections.
// Services, process and FAQ live on /about. One CTA string everywhere.

export default function Home() {
  return (
    <main
      style={{
        overflowX: 'hidden',
        width: '100%',
        maxWidth: '100%',
      }}
    >
      <Navbar />
      <Hero />
      <CleanRouteShowcase />
      <FeaturedWork />
      <StonegrillShowcase />
      <StashShowcase />
      <GoogleReviews />
      <Contact />
      <Footer />
      <StickyQuoteBar />
    </main>
  );
}

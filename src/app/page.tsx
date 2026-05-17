import dynamic from 'next/dynamic';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import LogoMarquee from '@/components/LogoMarquee';

const Services = dynamic(() => import('@/components/Services'));
const Work = dynamic(() => import('@/components/Work'));
const Contact = dynamic(() => import('@/components/Contact'));
const Footer = dynamic(() => import('@/components/Footer'));

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
      <LogoMarquee />
      <Services />
      <Work />
      <Contact />
      <Footer />
    </main>
  );
}


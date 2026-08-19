import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'About Riley Tech Studio | Web Designer & Developer — South Coast NSW',
  description: 'Riley Tech Studio is a software studio based on the South Coast of Australia. Custom software, booking systems and high-converting websites built properly from day one.',
  alternates: {
    canonical: 'https://www.rileytechstudio.com.au/about',
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'About Riley Tech Studio | Web Designer & Developer — South Coast NSW',
    description: 'Riley Tech Studio is a software studio based on the South Coast of Australia. Custom software, booking systems and high-converting websites built properly from day one.',
    type: 'website',
    url: 'https://www.rileytechstudio.com.au/about',
    siteName: 'Riley Tech Studio',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
  },
};

const About = dynamic(() => import('@/components/About'));
const Services = dynamic(() => import('@/components/Services'));
const HowItWorks = dynamic(() => import('@/components/HowItWorks'));
const Faq = dynamic(() => import('@/components/Faq'));
const Footer = dynamic(() => import('@/components/Footer'));


export default function AboutPage() {
  return (
    <main
      style={{
        overflowX: 'hidden',
        width: '100%',
        maxWidth: '100%',
      }}
    >
      <Navbar />
      <div>
        <About />
        <Services />
        <HowItWorks />
        <Faq />
      </div>
      <Footer />
    </main>
  );
}

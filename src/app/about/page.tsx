import dynamic from 'next/dynamic';
import Navbar from '@/components/Navbar';

const About = dynamic(() => import('@/components/About'));
const Process = dynamic(() => import('@/components/Process'));
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
      <div style={{ paddingTop: '8rem' }}>
        <About />
        <Process />
      </div>
      <Footer />
    </main>
  );
}

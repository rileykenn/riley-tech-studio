import Navbar from '@/components/Navbar';
import Process from '@/components/Process';
import About from '@/components/About';
import Footer from '@/components/Footer';

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

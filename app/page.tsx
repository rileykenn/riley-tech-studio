import Hero from "./components/Hero";
import Blueprint from "./components/Blueprint";
import Services from "./components/Services";
import Automation from "./components/Automation";
import Local from "./components/Local";
import About from "./components/About";
import Contact from "./components/Contact";
import NavBar from "./components/NavBar";

export default function Home() {
  return (
    // Root wrapper:
    // - min-h-[100svh] fixes iOS Safari dynamic toolbar height
    // - bg set to deep hero blue so any tiny gaps blend in
    <div className="min-h-screen min-h-[100svh] w-full bg-[#003c86] text-white">
      <NavBar />

      {/* stop any accidental horizontal scroll from canvas / ribbons */}
      <main className="w-full overflow-x-hidden">
        <section id="hero" data-section="hero">
          <Hero />
        </section>

        <section id="blueprint" data-section="blueprint">
          <Blueprint />
        </section>

        <section id="services" data-section="services">
          <Services />
        </section>

        <section id="automation" data-section="automation">
          <Automation />
        </section>

        <section id="local" data-section="local">
          <Local />
        </section>

        <section id="about" data-section="about">
          <About />
        </section>

        <section id="contact" data-section="contact">
          <Contact />
        </section>
      </main>
    </div>
  );
}

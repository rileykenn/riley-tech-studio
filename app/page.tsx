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
    <div className="min-h-screen w-full bg-black text-white">
      <NavBar />

      <main className="w-full">
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

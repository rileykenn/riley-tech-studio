import Link from 'next/link';
import ClientLogoGrid from './ClientLogoGrid';
import HeroCourseMap from './HeroCourseMap';
import HeroPlug from './HeroPlug';

// Proof-led hero: the 50+ claim is the headline, the static client-logo grid
// directly below is its receipts, and the visual is a compact copy of the
// SIGC interactive 3D course map (the full-size one stays in the case-study
// section). One number claim, one primary CTA.

export default function Hero() {
  return (
    <section
      id="hero"
      style={{
        position: 'relative',
        overflow: 'hidden',
        background: 'var(--color-background)',
      }}
    >
      {/* "Powering the South Coast": one big plug behind the hero, placed
          via hero-plug.json (dev tuner bottom-left on localhost) */}
      <HeroPlug />

      <div
        className="section-container"
        style={{
          position: 'relative',
          zIndex: 1,
          paddingTop: 'clamp(7rem, 12vh, 9rem)',
        }}
      >
        <div className="hero-grid">
          {/* ── Left: message + CTA ── */}
          <div>
            <h1
              className="hero-fade-in"
              style={{
                // deliberately the native system grotesque (SF Pro / Segoe),
                // not Space Grotesk: this is the exact rendering Riley
                // approved for the hero statement
                fontFamily:
                  'ui-sans-serif, system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif',
                animationDelay: '0.06s',
                fontSize: 'clamp(2.5rem, 3.75vw, 3.1875rem)',
                fontWeight: 300,
                lineHeight: 1.1,
                letterSpacing: '-0.02em',
                color: 'var(--color-foreground)',
              }}
            >
              Powering the South Coast
              <br className="hero-h1-br" /> with{' '}
              <span
                style={{
                  fontWeight: 700,
                  boxShadow: 'inset 0 -0.14em 0 0 rgba(29, 78, 216, 0.32)',
                  WebkitBoxDecorationBreak: 'clone',
                  boxDecorationBreak: 'clone',
                }}
              >
                high-performance
                <br className="hero-h1-br" /> software.
              </span>
              <span className="sr-only">
                Custom software and web design for businesses across the
                Shoalhaven &amp; Illawarra, NSW
              </span>
            </h1>

            <p
              className="hero-fade-in"
              style={{
                animationDelay: '0.14s',
                marginTop: '1.375rem',
                fontSize: '1.125rem',
                lineHeight: 1.65,
                maxWidth: '46ch',
              }}
            >
              Custom websites, mobile apps and business automation software,
              saving admin work for 50+ businesses and growing.
            </p>

            <div
              className="hero-fade-in"
              style={{
                animationDelay: '0.22s',
                display: 'flex',
                alignItems: 'center',
                gap: '1.375rem',
                marginTop: '2.25rem',
                flexWrap: 'wrap',
              }}
            >
              <Link href="/#contact" className="btn-primary">
                Get My Free Quote
              </Link>
              <Link href="/#work" className="hero-work-link">
                See our work
              </Link>
            </div>
          </div>

          {/* ── Right: the SIGC 3D course map, hero-sized ── */}
          <div className="hero-visual hero-fade-in" style={{ animationDelay: '0.18s' }}>
            <HeroCourseMap />
          </div>
        </div>

        {/* ── Receipts for the headline: static grid, whole band clicks to work ── */}
        <ClientLogoGrid />
      </div>
    </section>
  );
}

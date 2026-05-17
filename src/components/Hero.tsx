import Image from 'next/image';

const stats = [
  { value: '12+', label: 'Apps Shipped' },
  { value: '99.9%', label: 'Uptime SLA' },
  { value: 'AU', label: 'Based & Built' },
];

export default function Hero() {
  return (
    <section
      id="hero"
      style={{
        position: 'relative',
        minHeight: '100dvh',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
      }}
    >
      {/* ── Full-screen background image ── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
        }}
      >
        <Image
          src="/herobackground.webp"
          alt="Riley Tech Studio office background"
          fill
          priority
          sizes="100vw"
          quality={75}
          style={{
            objectFit: 'cover',
            objectPosition: 'center',
          }}
        />
      </div>

      {/* ── Gradient overlays for text legibility ── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          background:
            'linear-gradient(to right, rgba(248, 250, 251, 0.92) 0%, rgba(248, 250, 251, 0.75) 45%, rgba(248, 250, 251, 0.15) 70%, transparent 100%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          background:
            'linear-gradient(to top, rgba(248, 250, 251, 0.6) 0%, transparent 40%)',
        }}
      />

      {/* ── Content — CSS animations for instant LCP, no JS dependency ── */}
      <div
        className="section-container"
        style={{
          position: 'relative',
          zIndex: 2,
          width: '100%',
          paddingTop: '8rem',
          paddingBottom: '4rem',
        }}
      >
        <div style={{ maxWidth: '620px' }}>
          <div className="hero-fade-in">
            <span className="eyebrow">
              <span
                aria-hidden="true"
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: 'var(--color-success)',
                  display: 'inline-block',
                }}
              />
              Available for projects
            </span>
          </div>

          <h1
            className="hero-fade-in"
            style={{
              animationDelay: '0.08s',
              marginTop: '1.5rem',
              fontSize: 'clamp(2.75rem, 5.5vw, 4.5rem)',
              fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: '-0.035em',
              color: 'var(--color-foreground)',
            }}
          >
            Creative Websites
            <br />
            <span
              style={{
                background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              & Software.
            </span>
          </h1>

          <p
            className="hero-fade-in"
            style={{
              animationDelay: '0.16s',
              marginTop: '1.5rem',
              fontSize: '1.125rem',
              lineHeight: 1.7,
              color: 'var(--color-foreground-muted)',
              maxWidth: '48ch',
            }}
          >
            We build production-grade apps, SaaS platforms, and custom software
            for businesses across the Shoalhaven, Illawarra, and beyond.
          </p>

          <div
            className="hero-fade-in"
            style={{
              animationDelay: '0.24s',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              marginTop: '2.5rem',
              flexWrap: 'wrap',
            }}
          >
            <a
              href="/#contact"
              className="hero-cta"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '2rem',
                padding: '0.75rem 1.25rem',
                background: 'var(--color-primary)',
                color: '#fff',
                fontSize: '1rem',
                fontWeight: 600,
                fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                letterSpacing: '-0.01em',
                textDecoration: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                transform: 'skewX(-6deg)',
              }}
            >
              <span style={{ transform: 'skewX(6deg)' }}>Start a Project</span>
              <span style={{ transform: 'skewX(6deg)', display: 'flex', alignItems: 'center' }}>
                <svg width="18" height="18" viewBox="0 0 256 256" fill="none" aria-hidden="true">
                  <path d="M200,128v64a8,8,0,0,1-16,0V147.31L69.66,261.66a8,8,0,0,1-11.32-11.32L172.69,136H128a8,8,0,0,1,0-16h64A8,8,0,0,1,200,128Z" fill="currentColor" transform="translate(0,-80) scale(0.95)"/>
                </svg>
              </span>
            </a>

            <a
              href="/#work"
              className="hero-cta"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '2rem',
                padding: '0.75rem 1.25rem',
                background: '#1a1a1a',
                color: '#fff',
                fontSize: '1rem',
                fontWeight: 600,
                fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                letterSpacing: '-0.01em',
                textDecoration: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                transform: 'skewX(-6deg)',
              }}
            >
              <span style={{ transform: 'skewX(6deg)' }}>View Our Work</span>
              <span style={{ transform: 'skewX(6deg)', display: 'flex', alignItems: 'center' }}>
                <svg width="18" height="18" viewBox="0 0 256 256" fill="none" aria-hidden="true">
                  <path d="M200,128v64a8,8,0,0,1-16,0V147.31L69.66,261.66a8,8,0,0,1-11.32-11.32L172.69,136H128a8,8,0,0,1,0-16h64A8,8,0,0,1,200,128Z" fill="currentColor" transform="translate(0,-80) scale(0.95)"/>
                </svg>
              </span>
            </a>
          </div>

          {/* Stats */}
          <div
            className="hero-fade-in"
            style={{
              animationDelay: '0.32s',
              display: 'flex',
              gap: '2.5rem',
              marginTop: '3.5rem',
              paddingTop: '2rem',
              borderTop: '1px solid rgba(226, 232, 240, 0.6)',
            }}
          >
            {stats.map((stat) => (
              <div key={stat.label}>
                <div
                  style={{
                    fontSize: '1.5rem',
                    fontWeight: 700,
                    fontFamily: 'var(--font-heading)',
                    color: 'var(--color-foreground)',
                    letterSpacing: '-0.02em',
                  }}
                >
                  {stat.value}
                </div>
                <div
                  style={{
                    fontSize: '0.8125rem',
                    color: 'var(--color-foreground-subtle)',
                    marginTop: '0.25rem',
                  }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Floating badge — bottom right (CSS animation, no JS delay) ── */}
      <div
        className="glass-panel hero-badge"
        style={{
          position: 'absolute',
          bottom: '2.5rem',
          right: '2.5rem',
          zIndex: 3,
          padding: '0.875rem 1.25rem',
          borderRadius: 'var(--radius-lg)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          fontSize: '0.8125rem',
          fontWeight: 600,
        }}
      >
        <span
          aria-hidden="true"
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: 'var(--color-success)',
            boxShadow: '0 0 8px rgba(16, 185, 129, 0.5)',
          }}
        />
        Currently taking clients
      </div>

    </section>
  );
}
